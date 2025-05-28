// src/services/challengeService.js
import { supabase } from '../supabaseClient';

/**
 * Service pour gérer les challenges et statuts utilisateurs
 */

/**
 * Configuration des statuts et leurs challenges
 */
const STATUS_CONFIG = {
  bronze: {
    name: 'Bronze',
    requiredPoints: 0,
    challenges: {
      scan5: { target: 5, points: 50 },
      review1: { target: 1, points: 50 },
      fav3: { target: 3, points: 15 },
      profile: { target: 1, points: 20 }
    }
  },
  argent: {
    name: 'Argent',
    requiredPoints: 135,
    challenges: {
      scan25: { target: 25, points: 100 },
      review5: { target: 5, points: 250 },
      likes10: { target: 10, points: 50 },
      days7: { target: 7, points: 70 }
    }
  },
  or: {
    name: 'Or',
    requiredPoints: 605,
    challenges: {
      scan75: { target: 75, points: 300 },
      review20: { target: 20, points: 1000 },
      first3: { target: 3, points: 450 },
      likes50: { target: 50, points: 250 },
      days30: { target: 30, points: 300 }
    }
  },
  diamant: {
    name: 'Diamant',
    requiredPoints: 2905,
    challenges: {
      scan200: { target: 200, points: 1000 },
      review50: { target: 50, points: 2500 },
      first10: { target: 10, points: 1500 },
      likes200: { target: 200, points: 1000 },
      cat5: { target: 5, points: 500 },
      days90: { target: 90, points: 900 }
    }
  }
};

/**
 * Récupère la progression complète de l'utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Progression de l'utilisateur
 */
export const getUserProgress = async (userId) => {
  try {
    if (!userId) throw new Error("ID utilisateur requis");

    // Récupérer les données de l'utilisateur
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Récupérer le nombre total de scans (produits consultés)
    const { count: totalScans } = await supabase
      .from('product_views')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Récupérer le nombre total d'avis publiés
    const { count: totalReviews } = await supabase
      .from('product_reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('status', ['approved', 'approved_auto']);

    // Récupérer le nombre total de favoris
    const { count: totalFavorites } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Récupérer le nombre total de likes reçus
    const { data: userReviews } = await supabase
      .from('product_reviews')
      .select('id')
      .eq('user_id', userId)
      .in('status', ['approved', 'approved_auto']);

    let totalLikes = 0;
    if (userReviews && userReviews.length > 0) {
      const reviewIds = userReviews.map(r => r.id);
      const { count: likesCount } = await supabase
        .from('review_likes')
        .select('*', { count: 'exact', head: true })
        .in('review_id', reviewIds);
      totalLikes = likesCount || 0;
    }

    // Récupérer le nombre de premiers avis
    const { count: firstReviews } = await supabase
      .from('product_reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_first_review', true)
      .in('status', ['approved', 'approved_auto']);

    // Récupérer le nombre de catégories différentes
    const { data: categoriesData } = await supabase
      .from('product_reviews')
      .select('products!inner(category)')
      .eq('user_id', userId)
      .in('status', ['approved', 'approved_auto']);

    const uniqueCategories = new Set(categoriesData?.map(r => r.products?.category).filter(Boolean));
    const totalCategories = uniqueCategories.size;

    // Calculer les jours de connexion (simulé pour la démo)
    const accountAge = new Date() - new Date(userData.created_at);
    const daysConnected = Math.min(Math.floor(accountAge / (1000 * 60 * 60 * 24)), 90);

    // Vérifier si le profil est complet
    const profileComplete = !!(
      userData.display_name && 
      userData.country && 
      userData.city && 
      userData.postal_code
    );

    // Calculer le statut actuel et les points
    const progress = {
      currentStatus: userData.status || 'bronze',
      currentPoints: userData.points || 0,
      totalScans: totalScans || 0,
      totalReviews: totalReviews || 0,
      totalFavorites: totalFavorites || 0,
      totalLikes: totalLikes || 0,
      firstReviews: firstReviews || 0,
      categories: totalCategories || 0,
      daysConnected: daysConnected || 0,
      profileComplete: profileComplete
    };

    // Calculer les challenges complétés et les points gagnés
    const challengesStatus = calculateChallengesStatus(progress);
    
    return {
      success: true,
      data: {
        ...progress,
        ...challengesStatus
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

/**
 * Calcule le statut des challenges pour un utilisateur
 * @param {Object} progress - Progression actuelle de l'utilisateur
 * @returns {Object} Statut des challenges
 */
const calculateChallengesStatus = (progress) => {
  const statusOrder = ['bronze', 'argent', 'or', 'diamant'];
  let totalPointsEarned = 0;
  let completedChallenges = {};
  let nextStatus = null;
  let pointsToNextStatus = 0;

  // Parcourir chaque statut
  for (let i = 0; i < statusOrder.length; i++) {
    const status = statusOrder[i];
    const config = STATUS_CONFIG[status];
    
    // Vérifier chaque challenge du statut
    for (const [challengeId, challengeConfig] of Object.entries(config.challenges)) {
      let current = 0;
      
      // Mapper les challenges aux données de progression
      switch(challengeId) {
        case 'scan5':
        case 'scan25':
        case 'scan75':
        case 'scan200':
          current = progress.totalScans;
          break;
        case 'review1':
        case 'review5':
        case 'review20':
        case 'review50':
          current = progress.totalReviews;
          break;
        case 'fav3':
          current = progress.totalFavorites;
          break;
        case 'profile':
          current = progress.profileComplete ? 1 : 0;
          break;
        case 'likes10':
        case 'likes50':
        case 'likes200':
          current = progress.totalLikes;
          break;
        case 'days7':
        case 'days30':
        case 'days90':
          current = progress.daysConnected;
          break;
        case 'first3':
        case 'first10':
          current = progress.firstReviews;
          break;
        case 'cat5':
          current = progress.categories;
          break;
      }
      
      // Si le challenge est complété, ajouter les points
      if (current >= challengeConfig.target) {
        if (!completedChallenges[status]) {
          completedChallenges[status] = [];
        }
        completedChallenges[status].push(challengeId);
        totalPointsEarned += challengeConfig.points;
      }
    }
    
    // Déterminer le prochain statut
    if (progress.currentStatus === status && i < statusOrder.length - 1) {
      nextStatus = statusOrder[i + 1];
      pointsToNextStatus = STATUS_CONFIG[nextStatus].requiredPoints - totalPointsEarned;
    }
  }

  return {
    totalPointsEarned,
    completedChallenges,
    nextStatus,
    pointsToNextStatus: Math.max(0, pointsToNextStatus)
  };
};

/**
 * Met à jour le statut de l'utilisateur si nécessaire
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Résultat de la mise à jour
 */
export const updateUserStatus = async (userId) => {
  try {
    if (!userId) throw new Error("ID utilisateur requis");

    // Récupérer la progression actuelle
    const { success, data: progress, error } = await getUserProgress(userId);
    
    if (!success || error) throw new Error(error || "Erreur lors de la récupération de la progression");

    // Déterminer le nouveau statut basé sur les points
    let newStatus = 'bronze';
    if (progress.totalPointsEarned >= STATUS_CONFIG.diamant.requiredPoints) {
      newStatus = 'diamant';
    } else if (progress.totalPointsEarned >= STATUS_CONFIG.or.requiredPoints) {
      newStatus = 'or';
    } else if (progress.totalPointsEarned >= STATUS_CONFIG.argent.requiredPoints) {
      newStatus = 'argent';
    }

    // Mettre à jour si le statut a changé
    if (newStatus !== progress.currentStatus) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          status: newStatus,
          points: progress.totalPointsEarned,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      return {
        success: true,
        statusChanged: true,
        oldStatus: progress.currentStatus,
        newStatus: newStatus,
        totalPoints: progress.totalPointsEarned
      };
    }

    // Mettre à jour les points même si le statut n'a pas changé
    const { error: pointsError } = await supabase
      .from('users')
      .update({ 
        points: progress.totalPointsEarned,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (pointsError) throw pointsError;

    return {
      success: true,
      statusChanged: false,
      currentStatus: progress.currentStatus,
      totalPoints: progress.totalPointsEarned
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Enregistre une action utilisateur et met à jour les compteurs
 * @param {string} userId - ID de l'utilisateur
 * @param {string} actionType - Type d'action (scan, review, favorite, like)
 * @param {Object} metadata - Métadonnées supplémentaires
 * @returns {Promise<Object>} Résultat de l'action
 */
export const recordUserAction = async (userId, actionType, metadata = {}) => {
  try {
    if (!userId || !actionType) throw new Error("ID utilisateur et type d'action requis");

    // Mettre à jour les compteurs selon le type d'action
    let updateData = {};
    
    switch(actionType) {
      case 'scan':
        updateData.scan_count = supabase.raw('scan_count + 1');
        break;
      case 'review':
        updateData.review_count = supabase.raw('review_count + 1');
        break;
      case 'favorite':
        updateData.favorite_count = supabase.raw('favorite_count + 1');
        break;
      case 'search':
        if (metadata.searchType === 'manual') {
          updateData.manual_search_count = supabase.raw('manual_search_count + 1');
        } else {
          updateData.search_by_name_count = supabase.raw('search_by_name_count + 1');
        }
        break;
    }

    // Mettre à jour l'utilisateur
    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId);

    if (error) throw error;

    // Vérifier et mettre à jour le statut
    const statusUpdate = await updateUserStatus(userId);

    return {
      success: true,
      actionRecorded: true,
      ...statusUpdate
    };
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'action:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Récupère le classement des utilisateurs
 * @param {number} limit - Nombre d'utilisateurs à récupérer
 * @returns {Promise<Object>} Classement des utilisateurs
 */
export const getUserRanking = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, display_name, status, points, review_count')
      .order('points', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return {
      success: true,
      ranking: data || []
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du classement:", error);
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
<<<<<<< HEAD
  getUserProgress,
  updateUserStatus,
  recordUserAction,
  getUserRanking,
  STATUS_CONFIG
=======
  getActiveUserChallenges,
  getCompletedUserChallenges,
  getUserBadges,
  updateChallengeProgress,
  getUserLevelInfo,
  getUserProgress
>>>>>>> 2a08158ed3439faebfc2602d126eb315f82c366a
};