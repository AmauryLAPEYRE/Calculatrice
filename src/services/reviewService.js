// src/services/reviewService.js (mise à jour)
import { supabase } from '../supabaseClient';
// src/services/reviewService.js - Ajoutez cet import en haut du fichier
import { linkReceiptItemToReview } from './receiptService';
import { validateReviewWithAI } from '../services/aiReviewService';

/**
 * Récupère tous les critères d'évaluation disponibles
 * @returns {Promise<object>} - Résultat avec les critères d'évaluation
 */
// Fonctions inchangées...
export const getReviewCriterias = async () => {
  try {
    const { data, error } = await supabase
      .from('review_criterias')
      .select('*')
      .order('weight', { ascending: false });
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error("Erreur lors de la récupération des critères:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Récupère les avis pour un produit spécifique
 * @param {string} productCode - Code-barres du produit
 * @param {number} limit - Nombre maximum d'avis à récupérer
 * @param {number} offset - Décalage pour la pagination
 * @returns {Promise<object>} - Résultat avec les avis
 */
/**
 * Récupère les avis pour un produit spécifique avec le nouveau champ allow_public_display
 */
export const getProductReviews = async (productCode, limit = 10, offset = 0) => {
  try {
    if (!productCode) {
      throw new Error("Code produit requis");
    }
    
    // Récupérer les avis avec les informations du ticket de caisse
    const { data: reviews, count, error } = await supabase
      .from('product_reviews')
      .select(`
        *,
        users!inner (id, display_name),
        review_ratings (id, criteria_id, rating),
        receipts!product_reviews_receipt_id_fkey (
          id,
          allow_public_display,
          enseigne_id,
          enseignes!receipts_enseigne_id_fkey (
            code_postal
          )
        )
      `, { count: 'exact' })
      .eq('product_code', productCode)
      .in('status', ['approved', 'approved_auto'])
      .order('creation_date', { ascending: false })
      .range(offset, offset + limit - 1);
      
    if (error) throw error;
    
    // Récupérer le nombre de likes pour chaque avis
    const reviewsWithLikes = await Promise.all(
      reviews.map(async (review) => {
        const { count: likesCount, error: likesError } = await supabase
          .from('review_likes')
          .select('id', { count: 'exact', head: true })
          .eq('review_id', review.id);
          
        if (likesError) throw likesError;
        
        return {
          ...review,
          likes_count: likesCount || 0
        };
      })
    );
    
    // Récupérer les critères pour afficher les noms
    const { data: criterias, error: criteriasError } = await supabase
      .from('review_criterias')
      .select('*');
      
    if (criteriasError) throw criteriasError;
    
    // Formater les avis pour faciliter l'affichage
    const formattedReviews = reviewsWithLikes.map(review => {
      // Organiser les notes par critère
      const ratingsByCriteria = {};
      
      review.review_ratings.forEach(rating => {
        const criteria = criterias.find(c => c.id === rating.criteria_id);
        if (criteria) {
          ratingsByCriteria[criteria.name] = {
            rating: rating.rating,
            display_name: criteria.display_name,
            weight: criteria.weight
          };
        }
      });
      
      // Extraire le code postal depuis les données de l'enseigne
      let codePostal = null;
      if (review.receipts && review.receipts.enseignes) {
        codePostal = review.receipts.enseignes.code_postal;
      }
      
      return {
        id: review.id,
        user_name: review.users.display_name,
        user_id: review.user_id,
        comment: review.comment,
        date: review.creation_date,
        is_verified: review.is_verified,
        average_rating: review.average_rating,
        likes_count: review.likes_count,
        ratings: ratingsByCriteria,
        purchase_price: review.purchase_price,
        purchase_date: review.purchase_date,
        store_name: review.store_name,
        code_postal: codePostal,
        has_location: !!review.purchase_location,
        // NOUVEAU : Utiliser allow_public_display de la table receipts
        can_show_receipt: review.receipts?.allow_public_display && review.receipt_id,
        review_source: review.review_source
      };
    });
    
    return { 
      success: true, 
      reviews: formattedReviews, 
      total: count
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des avis:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Ajoute un nouvel avis pour un produit
 * @param {string} userId - ID de l'utilisateur
 * @param {string} productCode - Code-barres du produit
 * @param {string} comment - Commentaire de l'avis
 * @param {string|null} receiptId - ID du ticket de caisse (si disponible)
 * @param {object} ratings - Notes par critère {criteria_id: rating, ...}
 * @param {object} purchaseInfo - Informations sur l'achat
 * @returns {Promise<object>} - Résultat de l'opération
 */  


/**
 * Ajoute un nouvel avis pour un produit (version mise à jour)
 */
export const addProductReview = async (
  userId, 
  productCode, 
  comment, 
  receiptId, 
  ratings,
  purchaseInfo = {}
) => {
  try {
    // Validations des entrées
    if (!userId || !productCode) {
      throw new Error("ID utilisateur et code produit requis");
    }
    
    if (!comment || comment.trim() === '') {
      throw new Error("Un commentaire est requis pour publier un avis");
    }
    
    if (!ratings || Object.keys(ratings).length === 0) {
      throw new Error("Au moins une note est requise");
    }
    
    // Extraire les informations d'achat
    const { 
      price,
      date,
      location,
      storeName,
      allowPublicDisplay = false, // NOUVEAU : Utiliser allowPublicDisplay
      selectedItemId = null,
      receiptItems = [],
      matchScore = 0
    } = purchaseInfo;
    
    // Déterminer le statut de l'avis en fonction du taux de correspondance
    const reviewStatus = matchScore >= 1.70 ? 'approved_auto' : 'pending';
    // j'ai mis 1.7 car cela ne peut jamais arrivé et cela force toujours l'ia a vontroler les avis et surtout les commentaire.
    // Calculer la note moyenne
    const criteriaWeights = {
      '1': 3.0, // Poids du goût
      '2': 2.0, // Poids de la quantité
      '3': 1.0  // Poids du prix
    };
    
    let weightedSum = 0;
    let totalWeight = 0;
    
    Object.entries(ratings).forEach(([criteriaId, rating]) => {
      const weight = criteriaWeights[criteriaId] || 1.0;
      weightedSum += rating * weight;
      totalWeight += weight;
    });
    
    const averageRating = totalWeight > 0 ? Number((weightedSum / totalWeight).toFixed(2)) : 0;
    
    // Insérer l'avis SANS authorize_receipt_sharing
    const { data: newReview, error: reviewError } = await supabase
      .from('product_reviews')
      .insert([
        {
          user_id: userId,
          product_code: productCode,
          comment: comment,
          receipt_id: receiptId,
          receipt_item_id: selectedItemId,
          is_verified: !!receiptId,
          status: reviewStatus,
          match_score: matchScore,
          average_rating: averageRating,
          taste_rating: ratings['1'] || 0,
          quantity_rating: ratings['2'] || 0,
          price_rating: ratings['3'] || 0,
          purchase_price: price,
          purchase_date: date,
          purchase_location: location ? `(${location.lat},${location.lng})` : null,
          store_name: storeName
        }
      ])
      .select()
      .single();
      
    if (reviewError) throw reviewError;
    // ICI APPEL DE LA FONCTION EDGE IA si le product_reviews.status='pending'
    // NOUVEAU : Appel de la fonction Edge IA si le statut est 'pending'
    if (newReview.status === 'pending') {
      console.log(`Validation automatique démarrée pour l'avis ${newReview.id}`);
      
      // Appel asynchrone pour ne pas bloquer la réponse utilisateur
      validateReviewWithAI(newReview.id)
        .then(result => {
          if (result.success) {
            console.log(`Avis ${newReview.id} validé automatiquement:`, result.data.decision);
          } else {
            console.error(`Erreur validation automatique avis ${newReview.id}:`, result.error);
          }
        })
        .catch(error => {
          console.error(`Erreur critique validation avis ${newReview.id}:`, error);
        });
    }
    // Mettre à jour le ticket de caisse avec allow_public_display
    if (receiptId) {
      const { error: receiptUpdateError } = await supabase
        .from('receipts')
        .update({ 
          allow_public_display: allowPublicDisplay,
          updated_at: new Date().toISOString()
        })
        .eq('id', receiptId);
        
      if (receiptUpdateError) {
        console.warn("Avertissement: La mise à jour du partage du ticket a échoué:", receiptUpdateError);
      }
    }
    
    // Insérer les notes pour chaque critère
    const ratingsToInsert = Object.entries(ratings).map(([criteriaId, rating]) => ({
      review_id: newReview.id,
      criteria_id: criteriaId,
      rating: rating
    }));
    
    const { error: ratingsError } = await supabase
      .from('review_ratings')
      .insert(ratingsToInsert);
      
    if (ratingsError) throw ratingsError;

    // Traitement des articles du ticket (inchangé)
    if (selectedItemId && receiptId) {
      try {
        const { error: updateError } = await supabase
          .from('receipt_items')
          .update({ 
            product_code: productCode,
            is_selected: true
          })
          .eq('id', selectedItemId);
        
        if (updateError) {
          console.warn("Avertissement: La mise à jour de l'article sélectionné a échoué:", updateError);
        }
      } catch (linkError) {
        console.error("Erreur lors de la liaison article-avis:", linkError);
      }
    }
    
    return { 
      success: true, 
      review: newReview,
      status: reviewStatus
    };
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'avis:", error.message);
    return { success: false, error: error.message };
  }
};


/**
 * Met à jour les statistiques agrégées d'un produit (notes moyennes, nombre d'avis, etc.)
 * @param {string} productCode - Code-barres du produit
 * @returns {Promise<boolean>} - Succès de l'opération
 */
export const updateProductStats = async (productCode) => {
  try {
    const { data: reviews, error } = await supabase
      .from('product_reviews')
      .select(`
        average_rating,
        taste_rating,
        quantity_rating,
        price_rating,
        purchase_price,
        is_verified,
        review_source
      `)
      .eq('product_code', productCode)
      .in('status', ['approved', 'approved_auto']);
      
    if (error) throw error;
    
    if (!reviews || reviews.length === 0) {
      return true;
    }
    
    const totalReviews = reviews.length;
    const averageRating = Number((reviews.reduce((sum, r) => sum + (r.average_rating || 0), 0) / totalReviews).toFixed(2));
    const tasteRating = Number((reviews.reduce((sum, r) => sum + (r.taste_rating || 0), 0) / totalReviews).toFixed(2));
    const quantityRating = Number((reviews.reduce((sum, r) => sum + (r.quantity_rating || 0), 0) / totalReviews).toFixed(2));
    const priceRating = Number((reviews.reduce((sum, r) => sum + (r.price_rating || 0), 0) / totalReviews).toFixed(2));
    
    const validPriceReviews = reviews.filter(r => r.is_verified && r.purchase_price > 0);
    const averagePrice = validPriceReviews.length > 0 
      ? Number((validPriceReviews.reduce((sum, r) => sum + r.purchase_price, 0) / validPriceReviews.length).toFixed(2))
      : 0;
    
    const { error: updateError } = await supabase
      .from('products')
      .update({
        average_rating: averageRating,
        taste_rating: tasteRating,
        quantity_rating: quantityRating,
        price_rating: priceRating,
        average_price: averagePrice,
        total_reviews: totalReviews
      })
      .eq('code', productCode);
      
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour des statistiques du produit:", error.message);
    return false;
  }
};

/**
 * Récupère si l'utilisateur a déjà laissé un avis pour ce produit
 * @param {string} userId - ID de l'utilisateur
 * @param {string} productCode - Code-barres du produit
 * @returns {Promise<object>} - Résultat avec hasReviewed et reviewStatus
 */
export const checkUserReview = async (userId, productCode) => {
  try {
    if (!userId || !productCode) {
      throw new Error("ID utilisateur et code produit requis");
    }
    
    const { data, error } = await supabase
      .from('product_reviews')
      .select('id, status, creation_date','review_source')  // Ajout de creation_date
      .eq('user_id', userId)
      .eq('product_code', productCode)
      .order('creation_date', { ascending: false })  // Tri décroissant par date de création
      .limit(1)  // Prendre seulement le plus récent
      .maybeSingle();  // Remplace .single() pour éviter l'erreur si aucun résultat
      
    if (error) {
      throw error;
    }
    
    // Si aucun avis trouvé
    if (!data) {
      return { 
        success: true, 
        hasReviewed: false,
        reviewStatus: null,
        reviewId: null
      };
    }
    
    // Calculer la date d'il y a 1 mois
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    // Convertir la date de création en objet Date
    const creationDate = new Date(data.creation_date);
    
    // Vérifier si l'avis a moins d'un mois
    const isRecentReview = creationDate > oneMonthAgo;
    
    return { 
      success: true, 
      hasReviewed: isRecentReview,  // True seulement si l'avis a moins d'un mois
      reviewStatus: data.status,
      reviewId: data.id,
      reviewDate: data.creation_date,  // Optionnel : retourner la date pour information
      isRecentReview: isRecentReview   // Optionnel : pour distinguer l'existence de la récence
    };
    
  } catch (error) {
    console.error("Erreur lors de la vérification de l'avis:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Ajoute ou supprime un like sur un avis
 * @param {string} userId - ID de l'utilisateur
 * @param {string} reviewId - ID de l'avis
 * @param {boolean} addLike - true pour ajouter, false pour supprimer
 * @returns {Promise<object>} - Résultat de l'opération
 */
export const toggleReviewLike = async (userId, reviewId, addLike) => {
  try {
    if (!userId || !reviewId) {
      throw new Error("ID utilisateur et ID avis requis");
    }
    
    if (addLike) {
      // Ajouter un like
      const { data, error } = await supabase
        .from('review_likes')
        .insert([
          {
            user_id: userId,
            review_id: reviewId
          }
        ])
        .select();
        
      if (error && error.code !== '23505') { // 23505 = "Unique constraint violation"
        throw error;
      }
      
      return { success: true, liked: true };
    } else {
      // Supprimer un like
      const { data, error } = await supabase
        .from('review_likes')
        .delete()
        .eq('user_id', userId)
        .eq('review_id', reviewId);
        
      if (error) throw error;
      
      return { success: true, liked: false };
    }
  } catch (error) {
    console.error("Erreur lors de la modification du like:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Vérifie si l'utilisateur a liké un avis
 * @param {string} userId - ID de l'utilisateur
 * @param {string} reviewId - ID de l'avis
 * @returns {Promise<object>} - Résultat avec hasLiked
 */
export const checkUserLike = async (userId, reviewId) => {
  try {
    if (!userId || !reviewId) {
      throw new Error("ID utilisateur et ID avis requis");
    }
    
    const { data, error } = await supabase
      .from('review_likes')
      .select('id')
      .eq('user_id', userId)
      .eq('review_id', reviewId)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 = "No rows returned"
      throw error;
    }
    
    return { success: true, hasLiked: !!data };
  } catch (error) {
    console.error("Erreur lors de la vérification du like:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Récupère tous les avis d'un utilisateur avec les métadonnées du produit
 * @param {string} userId - ID de l'utilisateur
 * @param {number} limit - Nombre maximum d'avis à récupérer
 * @param {number} offset - Décalage pour la pagination
 * @returns {Promise<object>} - Résultat avec les avis
 */
/**
 * Récupère tous les avis d'un utilisateur (version mise à jour)
 */
export const getUserReviews = async (userId, limit = 10, offset = 0) => {
  try {
    if (!userId) {
      throw new Error("ID utilisateur requis");
    }
    
    // Récupérer les avis de l'utilisateur avec les informations du ticket
    const { data: reviews, count, error } = await supabase
      .from('product_reviews')
      .select(`
        *,
        review_ratings (id, criteria_id, rating),
        receipts (
          id,
          allow_public_display
        )
      `, { count: 'exact' })
      .eq('user_id', userId)
      .order('creation_date', { ascending: false })
      .range(offset, offset + limit - 1);
      
    if (error) throw error;
    
    // Récupérer les critères pour afficher les noms
    const { data: criterias, error: criteriasError } = await supabase
      .from('review_criterias')
      .select('*');
      
    if (criteriasError) throw criteriasError;
    
    // Formater les avis
    const formattedReviews = await Promise.all(reviews.map(async (review) => {
      // Organiser les notes par critère
      const ratingsByCriteria = {};
      
      review.review_ratings.forEach(rating => {
        const criteria = criterias.find(c => c.id === rating.criteria_id);
        if (criteria) {
          ratingsByCriteria[criteria.name] = {
            rating: rating.rating,
            display_name: criteria.display_name,
            weight: criteria.weight
          };
        }
      });
      
      // Récupérer les infos de base du produit
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('product_name, brands, image_url, firebase_image_path')
        .eq('code', review.product_code)
        .single();
        
      if (productError && productError.code !== 'PGRST116') {
        console.warn(`Erreur lors de la récupération du produit ${review.product_code}:`, productError);
      }
      
      return {
        id: review.id,
        product_code: review.product_code,
        comment: review.comment,
        date: review.creation_date,
        is_verified: review.is_verified,
        average_rating: review.average_rating,
        review_source: review.review_source,
        product_name: product?.product_name || 'Produit sans nom',
        product_brand: product?.brands || 'Marque inconnue',
        product_image_url: product?.image_url || product?.firebase_image_path,
        status: review.status,
        rejection_reason: review.rejection_reason, // NOUVEAU : Inclure la raison du rejet
        ratings: ratingsByCriteria,
        purchase_price: review.purchase_price,
        purchase_date: review.purchase_date,
        store_name: review.store_name,
        has_location: !!review.purchase_location,
        // NOUVEAU : Utiliser allow_public_display du ticket
        allow_public_display: review.receipts?.allow_public_display || false,
        match_score: review.match_score
      };
    }));
    
    return { success: true, reviews: formattedReviews, total: count };
  } catch (error) {
    console.error("Erreur lors de la récupération des avis:", error.message);
    return { success: false, error: error.message };
  }
};


/**
 * Obtient l'image du ticket de caisse si autorisé
 * @param {string} reviewId - ID de l'avis
 * @returns {Promise<object>} - URL du ticket ou erreur
 */
/**
 * Obtient l'image du ticket de caisse si autorisé (version mise à jour)
 */
export const getReceiptImage = async (reviewId) => {
  try {
    if (!reviewId) {
      throw new Error("ID de l'avis requis");
    }
    
    // Vérifier si l'avis autorise le partage du ticket via la table receipts
    const { data: review, error: reviewError } = await supabase
      .from('product_reviews')
      .select(`
        receipt_id,
        user_id,
        review_source,
        receipts (
          firebase_url,
          allow_public_display
        )
      `)
      .eq('id', reviewId)
      .single();
      
    if (reviewError) throw reviewError;
    
    if (!review.receipt_id) {
      throw new Error("Aucun ticket associé à cet avis");
    }
    
    if (!review.receipts?.allow_public_display) {
      throw new Error("L'utilisateur n'a pas autorisé le partage du ticket");
    }
    
    return { 
      success: true, 
      receiptUrl: review.receipts.firebase_url 
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du ticket:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Vérifie si un utilisateur peut laisser un avis (un par produit et par mois)
 * @param {string} userId - ID de l'utilisateur
 * @param {string} productCode - Code-barres du produit
 * @returns {Promise<object>} - Résultat avec canLeaveReview, lastReviewDate
 */
export const canUserLeaveReview = async (userId, productCode) => {
  try {
    if (!userId || !productCode) {
      throw new Error("ID utilisateur et code produit requis");
    }
    
    // Récupérer la date du dernier avis laissé par l'utilisateur pour ce produit
    const { data, error } = await supabase
      .from('product_reviews')
      .select('creation_date','review_source')
      .eq('user_id', userId)
      .eq('product_code', productCode)
      .neq('status','rejected')
      .neq('status','rejected_ia')
      .order('creation_date', { ascending: false })
      .limit(1);
      
    if (error) throw error;
    
    // Si aucun avis n'a été trouvé, l'utilisateur peut en laisser un
    if (!data || data.length === 0) {
      return { 
        success: true, 
        canLeaveReview: true,
        lastReviewDate: null
      };
    }
    
    const lastReviewDate = data[0].creation_date;
    
    // Vérifier si le dernier avis date de ce mois
    const now = new Date();
    const lastReview = new Date(lastReviewDate);
    
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = lastReview.getMonth();
    const lastYear = lastReview.getFullYear();
    
    // Si le dernier avis date d'un mois différent ou d'une année différente,
    // l'utilisateur peut en laisser un nouveau
    const canLeaveReview = currentMonth !== lastMonth || currentYear !== lastYear;
    
    return { 
      success: true, 
      canLeaveReview,
      lastReviewDate
    };
  } catch (error) {
    console.error("Erreur lors de la vérification de l'autorisation:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Active ou désactive le partage public du ticket de caisse
 * @param {string} reviewId - ID de l'avis
 * @param {boolean} authorize - Autoriser le partage (true) ou non (false)
 * @returns {Promise<object>} - Résultat de l'opération
 */
/**
 * Active ou désactive le partage public du ticket de caisse (version mise à jour)
 */
export const toggleReceiptSharing = async (reviewId, authorize) => {
  try {
    if (!reviewId) {
      throw new Error("ID de l'avis requis");
    }
    
    // Récupérer l'ID du ticket depuis l'avis
    const { data: reviewData, error: reviewError } = await supabase
      .from('product_reviews')
      .select('receipt_id')
      .eq('id', reviewId)
      .single();

    if (reviewError) throw reviewError;
    
    if (!reviewData.receipt_id) {
      throw new Error("Aucun ticket associé à cet avis");
    }

    // Mettre à jour allow_public_display dans la table receipts
    const { error: receiptError } = await supabase
      .from('receipts')
      .update({ 
        allow_public_display: authorize,
        updated_at: new Date().toISOString()
      })
      .eq('id', reviewData.receipt_id);

    if (receiptError) throw receiptError;
    
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la modification de l'autorisation:", error.message);
    return { success: false, error: error.message };
  }
};


/**
 * Récupère les derniers prix enregistrés pour un produit
 * @param {string} productCode - Code-barres du produit
 * @param {number} limit - Nombre maximum de prix à récupérer (défaut: 10)
 * @returns {Promise<object>} - Résultat avec la liste des prix
 */
// Modification de la fonction dans reviewService.js pour inclure la note moyenne
export const getProductRecentPrices = async (productCode, limit = 10) => {
  try {
    if (!productCode) {
      throw new Error("Code produit requis");
    }
    
    // Récupérer les avis approuvés avec prix d'achat, note moyenne et informations utilisateur
    // On ajoute la jointure avec receipts pour accéder à l'enseigne_id
    const { data, error } = await supabase
      .from('product_reviews')
      .select(`
        id,
        purchase_price,
        purchase_date,
        store_name,
        is_verified,
        average_rating,
        users(display_name),
        receipt_id,
        receipts!product_reviews_receipt_id_fkey(enseigne_id, country_code),
        review_source
      `)
      .eq('product_code', productCode)
      .in('status', ['approved', 'approved_auto'])
      .not('purchase_price', 'is', null)
      .eq('review_source','user')
      .order('purchase_date', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    
    // Extraire les IDs d'enseignes à partir des tickets
    const enseigneIds = data
      .filter(item => item.receipts && item.receipts.enseigne_id)
      .map(item => item.receipts.enseigne_id);
    
    // Créer un mapping des enseignes pour les codes postaux
    let enseigneMap = {};
    
    if (enseigneIds.length > 0) {
      // Récupérer les codes postaux des enseignes
      const { data: enseignes, error: enseigneError } = await supabase
        .from('enseignes')
        .select('id, code_postal')
        .in('id', enseigneIds);
        
      if (!enseigneError && enseignes) {
        enseigneMap = enseignes.reduce((map, enseigne) => {
          map[enseigne.id] = enseigne.code_postal;
          return map;
        }, {});
      }
    }
    
    // Formater les données pour l'affichage
    const formattedPriceHistory = data.map(item => ({
      purchase_price: item.purchase_price,
      purchase_date: item.purchase_date,
      store_name: item.store_name,
      code_postal: item.receipts?.enseigne_id ? enseigneMap[item.receipts.enseigne_id] : null,
      country_code: item.receipts?.country_code ?? 'FR',
      is_verified: item.is_verified,
      average_rating: item.average_rating,
      user_display_name: item.users?.display_name || 'Anonyme'
    }));
    
    return { 
      success: true, 
      priceHistory: formattedPriceHistory
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique des prix:", error.message);
    return { success: false, error: error.message };
  }
};