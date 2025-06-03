// src/services/aiReviewService.js

import { supabase } from '../supabaseClient';
import {getProductReviewCriterias} from './reviewService'
/**
 * Service pour gérer la génération automatique d'avis avec l'IA
 */

const AI_REVIEW_API_URL = 'https://gwjkbtbtqntwaqtrflnq.supabase.co/functions/v1/create-review-ia';

/**
 * Vérifie si un avis IA existe déjà pour ce produit
 * @param {string} productCode - Code-barres du produit
 * @returns {Promise<Object>} - Résultat de la vérification
 */
export const checkExistingAIReview = async (productCode) => {
  try {
    console.log('🔍 Vérification d\'avis IA existant pour le produit:', productCode);
    
    if (!productCode) {
      throw new Error('Code produit requis');
    }

    // Chercher un avis avec review_source = 'ai' pour ce produit
    const { data, error } = await supabase
      .from('product_reviews')
      .select('id, creation_date, status, user_id')
      .eq('product_code', productCode)
      .eq('review_source', 'ai')
      .order('creation_date', { ascending: false })
      .limit(1);

    if (error) {
      console.error('❌ Erreur lors de la vérification d\'avis IA:', error);
      throw error;
    }

    const hasAIReview = data && data.length > 0;
    
    if (hasAIReview) {
      console.log('✅ Avis IA existant trouvé:', data[0]);
      return {
        exists: true,
        review: data[0],
        message: `Avis IA déjà présent (créé le ${new Date(data[0].creation_date).toLocaleDateString()})`
      };
    } else {
      console.log('📭 Aucun avis IA trouvé pour ce produit');
      return {
        exists: false,
        message: 'Aucun avis IA existant pour ce produit'
      };
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification d\'avis IA existant:', error);
    return {
      exists: false,
      error: error.message,
      message: 'Erreur lors de la vérification des avis existants'
    };
  }
};

/**
 * Génère automatiquement un avis IA pour un produit
 * @param {Object} params - Paramètres de génération
 * @param {string} params.productCode - Code-barres du produit
 * @param {string} params.productName - Nom du produit
 * @param {string} params.userId - ID de l'utilisateur
 * @param {string} [params.criteria1] - Premier critère (défaut: GOUT)
 * @param {string} [params.criteria2] - Deuxième critère (défaut: QUANTITÉ)
 * @param {string} [params.criteria3] - Troisième critère (défaut: PRIX)
 * @param {Function} [params.onProgress] - Callback pour suivre le progrès
 * @returns {Promise<Object>} - Résultat de la génération
 */
export const generateAIReview = async (params) => {
  try {
    console.log('🤖 Début de génération d\'avis IA pour:', params.productName);
    
    // Validation des paramètres obligatoires
    if (!params.productCode || !params.productName || !params.userId) {
      throw new Error('Paramètres manquants: productCode, productName et userId sont requis');
    }

    // Callback de progression si fourni
    if (params.onProgress) {
      params.onProgress('Initialisation de la génération d\'avis IA...');
    }




    // Préparer les paramètres avec valeurs par défaut
    const requestParams = {
      productCode: params.productCode,
      productName: params.productName,
      userId: params.userId,
      criteria1: params.criteres.data[0].display_name || 'GOUT',
      criteria2: params.criteres.data[1].display_name || 'QUANTITÉ',
      criteria3: params.criteres.data[2].display_name || 'PRIX',
      criteria1Id: params.criteres.data[0].id || '43b1121b-0ffe-478c-aa8c-ed38ef37e234',
      criteria2Id: params.criteres.data[1].id || 'e5f32be3-d08c-41be-bbae-db313ed0cb27',
      criteria3Id: params.criteres.data[2].id || '9ad348fb-b617-4af8-97c7-ab9f22739f0c'
    };

    console.log('📤 Envoi de la requête à l\'API IA:', requestParams);

    if (params.onProgress) {
      params.onProgress('Création automatique d\'un avis par l\'IA en cours...');
    }

    // Appel à l'API avec timeout de 12 secondes
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 136000);

    const startTime = Date.now();

    const response = await fetch(AI_REVIEW_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestParams),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const processingTime = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erreur API: ${response.status}`);
    }

    const result = await response.json();
    
    if (params.onProgress) {
      params.onProgress('Avis IA généré avec succès !');
    }

    console.log('✅ Avis IA généré avec succès en', processingTime, 'ms:', result);

    return {
      success: true,
      reviewId: result.reviewId,
      review: result.review,
      processingTime: processingTime,
      apiProcessingTime: result.processingTime
    };

  } catch (error) {
    console.error('❌ Erreur lors de la génération d\'avis IA:', error);
    
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'La génération d\'avis a pris trop de temps (timeout)',
        errorType: 'timeout'
      };
    }

    return {
      success: false,
      error: error.message || 'Erreur lors de la génération de l\'avis',
      errorType: 'api_error'
    };
  }
};

/**
 * Vérifie si un produit peut bénéficier d'un avis IA automatique
 * @param {Object} product - Objet produit avec ses statistiques
 * @param {string} userId - ID de l'utilisateur connecté
 * @returns {Object} - Résultat de la vérification
 */
export const shouldGenerateAIReview = (product, userId) => {
  try {
    // Vérifications de base
    if (!product || !product.code || !product.product_name) {
      return {
        shouldGenerate: false,
        reason: 'Informations produit insuffisantes'
      };
    }

    if (!userId) {
      return {
        shouldGenerate: false,
        reason: 'Utilisateur non connecté'
      };
    }

    // Vérifier si le produit n'a pas encore d'avis
    const totalReviews = product.total_reviews || 0;
    
    if (totalReviews > 0) {
      return {
        shouldGenerate: false,
        reason: `Le produit a déjà ${totalReviews} avis`
      };
    }

    // Vérifier que ce n'est pas un produit trop générique
    if (product.product_name.length < 5) {
      return {
        shouldGenerate: false,
        reason: 'Nom de produit trop court pour une analyse pertinente'
      };
    }

    // Conditions remplies pour générer un avis IA
    return {
      shouldGenerate: true,
      reason: 'Produit éligible pour génération d\'avis IA automatique'
    };

  } catch (error) {
    console.error('Erreur lors de la vérification d\'éligibilité:', error);
    return {
      shouldGenerate: false,
      reason: `Erreur de vérification: ${error.message}`
    };
  }
};

/**
 * Génère automatiquement un avis IA si les conditions sont remplies
 * @param {Object} product - Objet produit
 * @param {string} userId - ID de l'utilisateur
 * @param {Function} onSuccess - Callback en cas de succès
 * @param {Function} onError - Callback en cas d'erreur
 * @param {Function} onProgress - Callback pour suivre le progrès
 * @returns {Promise<boolean>} - True si la génération a été déclenchée
 */
export const autoGenerateReviewIfNeeded = async (product, userId, onSuccess, onError, onProgress) => {
  try {
    // Vérifier l'éligibilité de base
    const eligibility = shouldGenerateAIReview(product, userId);
    
    if (!eligibility.shouldGenerate) {
      console.log('🚫 Génération IA non requise (critères de base):', eligibility.reason);
      return false;
    }

    // NOUVELLE VÉRIFICATION : Contrôler s'il existe déjà un avis IA en base
    console.log('🔍 Vérification des avis IA existants...');

    const aiReviewCheck = await checkExistingAIReview(product.code);
    
    if (aiReviewCheck.error) {
      console.error('⚠️ Erreur lors de la vérification d\'avis IA:', aiReviewCheck.error);
      // Continuer malgré l'erreur de vérification pour ne pas bloquer
    }

    if (aiReviewCheck.exists) {
      console.log('🚫 Avis IA déjà existant:', aiReviewCheck.message);
      // Ne pas afficher d'erreur à l'utilisateur - c'est un cas normal, pas une erreur
      return false;
    }

    console.log('✅ Pas d\'avis IA existant, génération automatique déclenchée pour:', product.product_name);

    // SEULEMENT MAINTENANT déclencher les callbacks de progression
    if (onProgress) {
      onProgress('Vérification des avis IA existants...');
    }
   // vérification des criteres suivant le produit
    const criteresResult = await getProductReviewCriterias(product.code);
      

    // Déclencher la génération
    const result = await generateAIReview({
      productCode: product.code,
      productName: product.product_name,
      userId: userId,
      onProgress: onProgress,
      criteres: criteresResult

    });

    if (result.success) {
      console.log('🎉 Avis IA généré automatiquement avec succès');
      if (onSuccess) {
        onSuccess(result);
      }
      return true;
    } else {
      throw new Error(result.error);
    }

  } catch (error) {
    console.error('❌ Erreur lors de la génération automatique:', error);
    if (onError) {
      onError(error.message);
    }
    return false;
  }
};

/**
 * Récupère tous les avis IA pour un produit donné
 * @param {string} productCode - Code-barres du produit
 * @returns {Promise<Object>} - Liste des avis IA
 */
export const getAIReviewsForProduct = async (productCode) => {
  try {
    console.log('📋 Récupération des avis IA pour le produit:', productCode);
    
    if (!productCode) {
      throw new Error('Code produit requis');
    }

    const { data, error } = await supabase
      .from('product_reviews')
      .select(`
        id,
        comment,
        average_rating,
        taste_rating,
        quantity_rating,
        price_rating,
        creation_date,
        status,
        users!inner (display_name)
      `)
      .eq('product_code', productCode)
      .eq('review_source', 'ai')
      .in('status', ['approved', 'approved_auto'])
      .order('creation_date', { ascending: false });

    if (error) {
      console.error('❌ Erreur lors de la récupération des avis IA:', error);
      throw error;
    }

    console.log(`✅ ${data.length} avis IA trouvés`);
    
    return {
      success: true,
      reviews: data || [],
      count: data ? data.length : 0
    };

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des avis IA:', error);
    return {
      success: false,
      error: error.message,
      reviews: [],
      count: 0
    };
  }
};

// 1. Fonction à ajouter dans reviewService.js pour appeler la fonction Edge
/**
 * Valide automatiquement un avis via l'IA
 * @param {string} reviewId - ID de l'avis à valider
 * @returns {Promise<object>} - Résultat de la validation
 */
export const validateReviewWithAI = async (reviewId) => {
  try {
    if (!reviewId) {
      throw new Error("ID de l'avis requis");
    }

    // URL de votre fonction Edge - à adapter selon votre déploiement
    const EDGE_FUNCTION_URL = `https://gwjkbtbtqntwaqtrflnq.supabase.co/functions/v1/validate-review`;
    
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ reviewId })
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || "Erreur lors de la validation");
    }

    return { 
      success: true, 
      data: result 
    };
  } catch (error) {
    console.error("Erreur lors de la validation IA:", error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

export default {
  generateAIReview,
  shouldGenerateAIReview,
  autoGenerateReviewIfNeeded,
  checkExistingAIReview,
  getAIReviewsForProduct,
  validateReviewWithAI
};