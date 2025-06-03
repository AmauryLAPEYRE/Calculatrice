// src/utils/statusCalculator.js

/**
 * Calcule le statut actuel d'un utilisateur basé sur sa progression réelle
 * @param {Object} userProgress - Les données de progression de l'utilisateur
 * @returns {string} - Le statut calculé ('bronze', 'argent', 'or', 'diamant')
 */
export const calculateUserStatus = (userProgress) => {
  if (!userProgress) return 'bronze';

  // Définition des challenges par niveau
  const statusChallenges = {
    bronze: [
      { id: 'scan5', target: 5, getValue: (p) => Math.min(p.totalScans, 5) },
      { id: 'review1', target: 1, getValue: (p) => Math.min(p.totalReviews, 1) },
      { id: 'fav3', target: 3, getValue: (p) => Math.min(p.totalFavorites, 3) },
      { id: 'profile', target: 1, getValue: (p) => p.profileComplete ? 1 : 0 }
    ],
    argent: [
      { id: 'scan25', target: 25, getValue: (p) => Math.min(p.totalScans, 25) },
      { id: 'review5', target: 5, getValue: (p) => Math.min(p.totalReviews, 5) },
      { id: 'likes10', target: 10, getValue: (p) => Math.min(p.totalLikes, 10) },
      { id: 'days7', target: 7, getValue: (p) => Math.min(p.daysConnected, 7) }
    ],
    or: [
      { id: 'scan75', target: 75, getValue: (p) => Math.min(p.totalScans, 75) },
      { id: 'review20', target: 20, getValue: (p) => Math.min(p.totalReviews, 20) },
      { id: 'first3', target: 3, getValue: (p) => Math.min(p.firstReviews, 3) },
      { id: 'likes50', target: 50, getValue: (p) => Math.min(p.totalLikes, 50) },
      { id: 'days30', target: 30, getValue: (p) => Math.min(p.daysConnected, 30) }
    ],
    diamant: [
      { id: 'scan200', target: 200, getValue: (p) => Math.min(p.totalScans, 200) },
      { id: 'review50', target: 50, getValue: (p) => Math.min(p.totalReviews, 50) },
      { id: 'first10', target: 10, getValue: (p) => Math.min(p.firstReviews, 10) },
      { id: 'likes200', target: 200, getValue: (p) => Math.min(p.totalLikes, 200) },
      { id: 'cat5', target: 5, getValue: (p) => Math.min(p.categories, 5) },
      { id: 'days90', target: 90, getValue: (p) => Math.min(p.daysConnected, 90) }
    ]
  };

  // Fonction pour vérifier si tous les challenges d'un niveau sont complétés
  const isLevelCompleted = (levelChallenges) => {
    return levelChallenges.every(challenge => {
      const currentValue = challenge.getValue(userProgress);
      return currentValue >= challenge.target;
    });
  };

  // Vérifier les niveaux dans l'ordre inverse (du plus haut au plus bas)
  if (isLevelCompleted(statusChallenges.diamant)) {
    return 'diamant';
  }
  if (isLevelCompleted(statusChallenges.or)) {
    return 'or';
  }
  if (isLevelCompleted(statusChallenges.argent)) {
    return 'argent';
  }
  if (isLevelCompleted(statusChallenges.bronze)) {
    return 'bronze';
  }

  // Si aucun niveau n'est complété à 100%, on reste sans statut
  // ou on peut retourner 'none' ou 'nouveau'
  return 'nouveau'; // ou 'bronze' si vous voulez que tout le monde commence bronze
};

/**
 * Construit l'objet userProgress à partir des données utilisateur
 * @param {Object} userDetails - Les détails de l'utilisateur depuis la base
 * @returns {Object} - L'objet de progression formaté
 */
export const buildUserProgress = (userDetails) => {
  if (!userDetails) return null;

  return {
    totalScans: userDetails.scanCount || 0,
    totalReviews: userDetails.reviewCount || 0,
    totalFavorites: userDetails.favoriteCount || 0,
    totalLikes: Math.floor((userDetails.reviewCount || 0) * 2), // Estimation
    firstReviews: Math.floor((userDetails.reviewCount || 0) * 0.2), // Estimation
    categories: Math.min(Math.floor((userDetails.reviewCount || 0) / 5), 10), // Estimation
    daysConnected: 7, // Valeur par défaut, à calculer depuis la date de création
    profileComplete: !!(userDetails.displayName && userDetails.city && userDetails.country && userDetails.postalCode)
  };
};

/**
 * Calcule le prochain statut atteignable et la progression vers celui-ci
 * @param {Object} userProgress - Les données de progression
 * @param {string} currentStatus - Le statut actuel calculé
 * @returns {Object} - Infos sur le prochain statut
 */
export const getNextStatusInfo = (userProgress, currentStatus) => {
  const statusOrder = ['nouveau', 'bronze', 'argent', 'or', 'diamant'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  
  if (currentIndex === statusOrder.length - 1) {
    return { nextStatus: null, progress: 100, remainingChallenges: 0 };
  }
  
  const nextStatus = statusOrder[currentIndex + 1];
  
  // Calculer la progression vers le prochain statut
  const statusChallenges = {
    bronze: [
      { id: 'scan5', target: 5, getValue: (p) => Math.min(p.totalScans, 5) },
      { id: 'review1', target: 1, getValue: (p) => Math.min(p.totalReviews, 1) },
      { id: 'fav3', target: 3, getValue: (p) => Math.min(p.totalFavorites, 3) },
      { id: 'profile', target: 1, getValue: (p) => p.profileComplete ? 1 : 0 }
    ],
    argent: [
      { id: 'scan25', target: 25, getValue: (p) => Math.min(p.totalScans, 25) },
      { id: 'review5', target: 5, getValue: (p) => Math.min(p.totalReviews, 5) },
      { id: 'likes10', target: 10, getValue: (p) => Math.min(p.totalLikes, 10) },
      { id: 'days7', target: 7, getValue: (p) => Math.min(p.daysConnected, 7) }
    ],
    or: [
      { id: 'scan75', target: 75, getValue: (p) => Math.min(p.totalScans, 75) },
      { id: 'review20', target: 20, getValue: (p) => Math.min(p.totalReviews, 20) },
      { id: 'first3', target: 3, getValue: (p) => Math.min(p.firstReviews, 3) },
      { id: 'likes50', target: 50, getValue: (p) => Math.min(p.totalLikes, 50) },
      { id: 'days30', target: 30, getValue: (p) => Math.min(p.daysConnected, 30) }
    ],
    diamant: [
      { id: 'scan200', target: 200, getValue: (p) => Math.min(p.totalScans, 200) },
      { id: 'review50', target: 50, getValue: (p) => Math.min(p.totalReviews, 50) },
      { id: 'first10', target: 10, getValue: (p) => Math.min(p.firstReviews, 10) },
      { id: 'likes200', target: 200, getValue: (p) => Math.min(p.totalLikes, 200) },
      { id: 'cat5', target: 5, getValue: (p) => Math.min(p.categories, 5) },
      { id: 'days90', target: 90, getValue: (p) => Math.min(p.daysConnected, 90) }
    ]
  };
  
  const challenges = statusChallenges[nextStatus] || [];
  const completed = challenges.filter(c => c.getValue(userProgress) >= c.target).length;
  const progress = (completed / challenges.length) * 100;
  
  return {
    nextStatus,
    progress: Math.round(progress),
    remainingChallenges: challenges.length - completed
  };
};