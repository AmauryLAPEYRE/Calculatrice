// src/services/challengeService.js
import { supabase } from '../supabaseClient';

/**
 * Service pour gérer les challenges utilisateurs
 */

/**
 * Récupère tous les challenges actifs
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Array>} Liste des challenges actifs
 */
export const getActiveUserChallenges = async (userId) => {
  try {
    if (!userId) throw new Error("ID utilisateur requis");
    
    const now = new Date().toISOString();
    
    // Récupérer les challenges actifs pour l'utilisateur
    const { data, error } = await supabase
      .from('user_challenges')
      .select(`
        *,
        challenges (*)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .lte('challenges.start_date', now)
      .gte('challenges.end_date', now)
      .order('challenges.end_date', { ascending: true });
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des challenges actifs:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Récupère tous les challenges terminés
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Array>} Liste des challenges terminés
 */
export const getCompletedUserChallenges = async (userId) => {
  try {
    if (!userId) throw new Error("ID utilisateur requis");
    
    const now = new Date().toISOString();
    
    // Récupérer les challenges terminés pour l'utilisateur
    const { data, error } = await supabase
      .from('user_challenges')
      .select(`
        *,
        challenges (*)
      `)
      .eq('user_id', userId)
      .or(`is_completed.eq.true, challenges.end_date.lt.${now}`)
      .order('completed_date', { ascending: false });
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des challenges terminés:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Récupère les badges de l'utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Array>} Liste des badges de l'utilisateur
 */
export const getUserBadges = async (userId) => {
  try {
    if (!userId) throw new Error("ID utilisateur requis");
    
    // Récupérer les badges de l'utilisateur
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badges (*)
      `)
      .eq('user_id', userId)
      .order('earned_date', { ascending: false });
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des badges:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Met à jour la progression d'un challenge
 * @param {string} userChallengeId - ID du challenge utilisateur
 * @param {number} newProgress - Nouvelle valeur de progression
 * @returns {Promise<Object>} Résultat de la mise à jour
 */
export const updateChallengeProgress = async (userChallengeId, newProgress) => {
  try {
    if (!userChallengeId) throw new Error("ID du challenge utilisateur requis");
    
    // Mettre à jour la progression
    const { data, error } = await supabase
      .from('user_challenges')
      .update({ 
        current_progress: newProgress,
        last_updated: new Date().toISOString()
      })
      .eq('id', userChallengeId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Vérifier si le challenge est maintenant terminé
    if (data.current_progress >= data.target_progress && !data.is_completed) {
      // Marquer le challenge comme terminé
      const { error: completeError } = await supabase
        .from('user_challenges')
        .update({ 
          is_completed: true,
          completed_date: new Date().toISOString()
        })
        .eq('id', userChallengeId);
      
      if (completeError) throw completeError;
    }
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la progression:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Récupère les informations de niveau de l'utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Informations sur le niveau
 */
export const getUserLevelInfo = async (userId) => {
  try {
    if (!userId) throw new Error("ID utilisateur requis");
    
    // Récupérer les informations sur l'utilisateur
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('points, status')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    
    // Récupérer les informations sur les niveaux
    const { data: levelData, error: levelError } = await supabase
      .from('user_levels')
      .select('*')
      .order('required_points', { ascending: true });
    
    if (levelError) throw levelError;
    
    // Déterminer le niveau actuel et le prochain niveau
    const currentPoints = userData.points || 0;
    const currentStatus = userData.status || 'bronze';
    
    let currentLevel = levelData.find(level => level.name.toLowerCase() === currentStatus.toLowerCase());
    let nextLevel = levelData.find(level => level.required_points > currentPoints);
    
    if (!currentLevel) {
      currentLevel = levelData[0]; // Par défaut, niveau le plus bas
    }
    
    if (!nextLevel && levelData.length > 0) {
      nextLevel = levelData[levelData.length - 1]; // Niveau maximum si déjà au max
    }
    
    return {
      success: true,
      data: {
        currentPoints,
        currentStatus,
        currentLevel,
        nextLevel,
        progress: currentPoints / (nextLevel?.required_points || 1000) * 100
      }
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des informations de niveau:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Récupère la progression globale de l'utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Progression de l'utilisateur
 */
export const getUserProgress = async (userId) => {
  try {
    if (!userId) throw new Error("ID utilisateur requis");
    
    // Récupérer les informations de base de l'utilisateur
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    
    // Récupérer le nombre total de scans
    const { count: scansCount, error: scansError } = await supabase
      .from('scanned_products')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (scansError) console.error("Erreur scans:", scansError);
    
    // Récupérer le nombre total d'avis
    const { count: reviewsCount, error: reviewsError } = await supabase
      .from('product_reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (reviewsError) console.error("Erreur reviews:", reviewsError);
    
    // Récupérer le nombre de favoris
    const { count: favoritesCount, error: favoritesError } = await supabase
      .from('user_favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (favoritesError) console.error("Erreur favoris:", favoritesError);
    
    // Récupérer le nombre total de likes reçus sur les avis
    const { data: likesData, error: likesError } = await supabase
      .from('product_reviews')
      .select('helpful_count')
      .eq('user_id', userId);
    
    if (likesError) console.error("Erreur likes:", likesError);
    
    const totalLikes = likesData?.reduce((sum, review) => sum + (review.helpful_count || 0), 0) || 0;
    
    // Récupérer le nombre d'avis où l'utilisateur a été le premier
    const { count: firstReviewsCount, error: firstReviewsError } = await supabase
      .from('product_reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_first_review', true);
    
    if (firstReviewsError) console.error("Erreur first reviews:", firstReviewsError);
    
    // Récupérer le nombre de catégories différentes
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('product_reviews')
      .select('product_id')
      .eq('user_id', userId);
    
    // TODO: Implémenter la logique pour compter les catégories uniques
    // Pour l'instant, on met une valeur par défaut
    const uniqueCategories = 0;
    
    // Calculer le nombre de jours de connexion
    const accountCreatedDate = new Date(userData.created_at);
    const daysSinceCreation = Math.floor((new Date() - accountCreatedDate) / (1000 * 60 * 60 * 24));
    const daysConnected = Math.min(daysSinceCreation, userData.login_streak || 0);
    
    // Vérifier si le profil est complet
    const profileComplete = !!(
      userData.display_name && 
      userData.bio && 
      userData.profile_picture_url
    );
    
    return {
      success: true,
      data: {
        currentStatus: userData.status || 'bronze',
        totalPointsEarned: userData.points || 0,
        totalScans: scansCount || 0,
        totalReviews: reviewsCount || 0,
        totalFavorites: favoritesCount || 0,
        totalLikes: totalLikes,
        firstReviews: firstReviewsCount || 0,
        categories: uniqueCategories,
        daysConnected: daysConnected,
        profileComplete: profileComplete
      }
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de la progression:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  getActiveUserChallenges,
  getCompletedUserChallenges,
  getUserBadges,
  updateChallengeProgress,
  getUserLevelInfo,
  getUserProgress
};