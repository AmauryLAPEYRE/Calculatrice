// 1. NOUVEAU SERVICE - src/services/aiReviewStatsService.js
import { supabase } from '../supabaseClient';

/**
 * Récupère et calcule les statistiques des avis IA pour un produit
 * @param {string} productCode - Code-barres du produit
 * @returns {Promise<object>} - Statistiques calculées des avis IA
 */
export const getAIReviewStats = async (productCode) => {
  try {
    if (!productCode) {
      throw new Error("Code produit requis");
    }
    
    console.log('📊 Calcul des statistiques IA pour le produit:', productCode);
    
    // Récupérer tous les avis IA approuvés pour ce produit
    const { data: aiReviews, error } = await supabase
      .from('product_reviews')
      .select(`
        id,
        average_rating,
        taste_rating,
        quantity_rating,
        price_rating,
        purchase_price,
        creation_date,
        comment,
        users!inner (display_name)
      `)
      .eq('product_code', productCode)
      .eq('review_source', 'ai')
      .in('status', ['approved', 'approved_auto'])
      .order('creation_date', { ascending: false });
      
    if (error) throw error;
    
    if (!aiReviews || aiReviews.length === 0) {
      return {
        success: true,
        stats: {
          total_reviews: 0,
          average_rating: 0,
          taste_rating: 0,
          quantity_rating: 0,
          price_rating: 0,
          average_price: 0,
          verified_reviews: 0
        },
        reviews: []
      };
    }
    
    const totalReviews = aiReviews.length;
    
    // Calculer les moyennes
    const averageRating = Number((aiReviews.reduce((sum, r) => sum + (r.average_rating || 0), 0) / totalReviews).toFixed(2));
    const tasteRating = Number((aiReviews.reduce((sum, r) => sum + (r.taste_rating || 0), 0) / totalReviews).toFixed(2));
    const quantityRating = Number((aiReviews.reduce((sum, r) => sum + (r.quantity_rating || 0), 0) / totalReviews).toFixed(2));
    const priceRating = Number((aiReviews.reduce((sum, r) => sum + (r.price_rating || 0), 0) / totalReviews).toFixed(2));
    
    // Prix moyen (si disponible)
    const validPriceReviews = aiReviews.filter(r => r.purchase_price > 0);
    const averagePrice = validPriceReviews.length > 0 
      ? Number((validPriceReviews.reduce((sum, r) => sum + r.purchase_price, 0) / validPriceReviews.length).toFixed(2))
      : 0;
    
    console.log('✅ Statistiques IA calculées:', {
      totalReviews,
      averageRating,
      tasteRating,
      quantityRating,
      priceRating,
      averagePrice
    });
    
    return {
      success: true,
      stats: {
        total_reviews: totalReviews,
        average_rating: averageRating,
        taste_rating: tasteRating,
        quantity_rating: quantityRating,
        price_rating: priceRating,
        average_price: averagePrice,
        verified_reviews: 0, // Les avis IA ne sont pas "vérifiés" au sens classique
        total_favorites: 0 // Pas applicable aux avis IA
      },
      reviews: aiReviews.map(review => ({
        id: review.id,
        user_name: review.users.display_name,
        comment: review.comment,
        date: review.creation_date,
        is_verified: false,
        average_rating: review.average_rating,
        likes_count: 0, // Les avis IA n'ont pas de likes
        ratings: {
          taste: {
            rating: review.taste_rating,
            display_name: "Goût",
            weight: 3.0
          },
          quantity: {
            rating: review.quantity_rating,
            display_name: "Quantité", 
            weight: 2.0
          },
          price: {
            rating: review.price_rating,
            display_name: "Prix",
            weight: 1.0
          }
        },
        purchase_price: review.purchase_price,
        purchase_date: null,
        store_name: null,
        code_postal: null,
        has_location: false,
        can_show_receipt: false,
        review_source: 'ai'
      }))
    };
    
  } catch (error) {
    console.error("❌ Erreur lors du calcul des statistiques IA:", error.message);
    return { 
      success: false, 
      error: error.message,
      stats: null,
      reviews: []
    };
  }
};
