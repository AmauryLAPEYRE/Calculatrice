// src/pages/ChallengesPageWithLottie.js
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserAvatar from '../components/profile/UserAvatar';
import { calculateUserStatus, buildUserProgress } from '../utils/statusCalculator';
import { 
  LottieTrophy, 
  EpicUnlockNotification, 
  InteractiveTrophyGallery,
  useTrophyAnimations 
} from '../components/achievements/TrophyAnimations';
import { FYDO_TROPHIES, getTrophyById } from '../config/trophyCollection';
import { 
  Trophy, 
  ChevronRight,
  Users,
  Lock,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Mapper les challenges existants avec les trophées Lottie
const CHALLENGE_TO_TROPHY_MAP = {
  // Bronze
  'scan5': 'explorer_5',
  'review1': 'first_review',
  'fav3': 'collector_3',
  'profile': 'complete_profile',
  // Argent
  'scan25': 'scanner_25',
  'review5': 'reviewer_5',
  'likes10': 'popular_10',
  'days7': 'week_streak',
  // Or
  'scan75': 'scanner_expert',
  'review20': 'reviewer_master',
  'first3': 'pioneer',
  'likes50': 'influencer_50',
  'days30': 'month_veteran',
  // Diamant
  'scan200': 'scanner_legend',
  'review50': 'reviewer_legend',
  'first10': 'discoverer',
  'likes200': 'superstar',
  'cat5': 'polyvalent',
  'days90': 'veteran_90'
};

// URLs des animations Lottie pour chaque niveau
const LOTTIE_LEVEL_ANIMATIONS = {
  bronze: 'https://assets2.lottiefiles.com/packages/lf20_touohxv0.json', // Médaille bronze
  argent: 'https://assets9.lottiefiles.com/packages/lf20_lc0lqpbg.json', // Médaille argent
  or: 'https://assets1.lottiefiles.com/packages/lf20_kvdyp9s6.json', // Trophée or
  diamant: 'https://assets3.lottiefiles.com/packages/lf20_n9ryrmts.json' // Diamant brillant
};

const ChallengesPage = () => {
  const { currentUser, userDetails } = useAuth();
  const [activeStatus, setActiveStatus] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredChallenge, setHoveredChallenge] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [unlockedTrophies, setUnlockedTrophies] = useState([]);
  
  // Hook pour gérer les animations de déblocage
  const { current: currentUnlock, addToQueue, onAnimationComplete } = useTrophyAnimations();

  // Construire les données de progression
  const userProgress = useMemo(() => buildUserProgress(userDetails), [userDetails]);
  
  // Calculer le statut dynamiquement
  const calculatedStatus = useMemo(() => {
    if (!userProgress) return 'nouveau';
    return calculateUserStatus(userProgress);
  }, [userProgress]);

  // Configuration des statuts avec leurs challenges et trophées
  const getStatusLevels = () => [
    {
      name: 'Bronze',
      level: 0,
      color: 'amber',
      gradient: 'from-amber-400 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
      borderColor: 'border-amber-300',
      icon: '🥉',
      description: 'Nouveau membre',
      animationUrl: LOTTIE_LEVEL_ANIMATIONS.bronze,
      challenges: [
        { 
          id: 'scan5', 
          label: 'Scanner 5 produits différents', 
          current: Math.min(userProgress.totalScans, 5), 
          target: 5, 
          points: 50,
          trophy: FYDO_TROPHIES.bronze.explorer_5
        },
        { 
          id: 'review1', 
          label: 'Publier 1 avis vérifié', 
          current: Math.min(userProgress.totalReviews, 1), 
          target: 1, 
          points: 50,
          trophy: FYDO_TROPHIES.bronze.first_review
        },
        { 
          id: 'fav3', 
          label: 'Ajouter 3 produits en favoris', 
          current: Math.min(userProgress.totalFavorites, 3), 
          target: 3, 
          points: 15,
          trophy: FYDO_TROPHIES.bronze.collector_3
        },
        { 
          id: 'profile', 
          label: 'Compléter son profil à 100%', 
          current: userProgress.profileComplete ? 1 : 0, 
          target: 1, 
          points: 20,
          trophy: FYDO_TROPHIES.bronze.complete_profile
        }
      ]
    },
    {
      name: 'Argent',
      level: 1,
      color: 'gray',
      gradient: 'from-gray-400 to-gray-600',
      bgGradient: 'from-gray-50 to-gray-100',
      borderColor: 'border-gray-300',
      icon: '🥈',
      description: 'Contributeur régulier',
      animationUrl: LOTTIE_LEVEL_ANIMATIONS.argent,
      challenges: [
        { 
          id: 'scan25', 
          label: 'Scanner 25 produits différents', 
          current: Math.min(userProgress.totalScans, 25), 
          target: 25, 
          points: 100,
          trophy: FYDO_TROPHIES.argent.scanner_25
        },
        { 
          id: 'review5', 
          label: 'Publier 5 avis vérifiés', 
          current: Math.min(userProgress.totalReviews, 5), 
          target: 5, 
          points: 250,
          trophy: FYDO_TROPHIES.argent.reviewer_5
        },
        { 
          id: 'likes10', 
          label: 'Obtenir 10 "j\'aime" sur ses avis', 
          current: Math.min(userProgress.totalLikes, 10), 
          target: 10, 
          points: 50,
          trophy: FYDO_TROPHIES.argent.popular_10
        },
        { 
          id: 'days7', 
          label: '7 jours de connexion', 
          current: Math.min(userProgress.daysConnected, 7), 
          target: 7, 
          points: 70,
          trophy: FYDO_TROPHIES.argent.week_streak
        }
      ]
    },
    {
      name: 'Or',
      level: 2,
      color: 'yellow',
      gradient: 'from-yellow-400 to-yellow-600',
      bgGradient: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-300',
      icon: '🥇',
      description: 'Expert reconnu',
      animationUrl: LOTTIE_LEVEL_ANIMATIONS.or,
      challenges: [
        { 
          id: 'scan75', 
          label: 'Scanner 75 produits différents', 
          current: Math.min(userProgress.totalScans, 75), 
          target: 75, 
          points: 300,
          trophy: FYDO_TROPHIES.or.scanner_expert
        },
        { 
          id: 'review20', 
          label: 'Publier 20 avis vérifiés', 
          current: Math.min(userProgress.totalReviews, 20), 
          target: 20, 
          points: 1000,
          trophy: FYDO_TROPHIES.or.reviewer_master
        },
        { 
          id: 'first3', 
          label: 'Être le premier à évaluer 3 produits', 
          current: Math.min(userProgress.firstReviews, 3), 
          target: 3, 
          points: 450,
          trophy: FYDO_TROPHIES.or.pioneer
        },
        { 
          id: 'likes50', 
          label: 'Obtenir 50 "j\'aime" sur ses avis', 
          current: Math.min(userProgress.totalLikes, 50), 
          target: 50, 
          points: 250,
          trophy: FYDO_TROPHIES.or.influencer_50
        },
        { 
          id: 'days30', 
          label: '30 jours de connexion au total', 
          current: Math.min(userProgress.daysConnected, 30), 
          target: 30, 
          points: 300,
          trophy: FYDO_TROPHIES.or.month_veteran
        }
      ]
    },
    {
      name: 'Diamant',
      level: 3,
      color: 'blue',
      gradient: 'from-blue-400 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-300',
      icon: '💎',
      description: 'Ambassadeur Fydo',
      animationUrl: LOTTIE_LEVEL_ANIMATIONS.diamant,
      challenges: [
        { 
          id: 'scan200', 
          label: 'Scanner 200 produits différents', 
          current: Math.min(userProgress.totalScans, 200), 
          target: 200, 
          points: 1000,
          trophy: FYDO_TROPHIES.diamant.scanner_legend
        },
        { 
          id: 'review50', 
          label: 'Publier 50 avis vérifiés', 
          current: Math.min(userProgress.totalReviews, 50), 
          target: 50, 
          points: 2500,
          trophy: FYDO_TROPHIES.diamant.reviewer_legend
        },
        { 
          id: 'first10', 
          label: 'Être le premier à évaluer 10 produits', 
          current: Math.min(userProgress.firstReviews, 10), 
          target: 10, 
          points: 1500,
          trophy: FYDO_TROPHIES.diamant.discoverer
        },
        { 
          id: 'likes200', 
          label: 'Obtenir 200 "j\'aime" sur ses avis', 
          current: Math.min(userProgress.totalLikes, 200), 
          target: 200, 
          points: 1000,
          trophy: FYDO_TROPHIES.diamant.superstar
        },
        { 
          id: 'cat5', 
          label: 'Avoir des avis sur 5 catégories différentes', 
          current: Math.min(userProgress.categories, 5), 
          target: 5, 
          points: 500,
          trophy: FYDO_TROPHIES.diamant.polyvalent
        },
        { 
          id: 'days90', 
          label: '90 jours de connexion au total', 
          current: Math.min(userProgress.daysConnected, 90), 
          target: 90, 
          points: 900,
          trophy: FYDO_TROPHIES.diamant.veteran_90
        }
      ]
    }
  ];

  // Vérifier les nouveaux trophées débloqués
  useEffect(() => {
    if (!userProgress) return;
    
    const newlyUnlocked = [];
    const statusLevels = getStatusLevels();
    
    statusLevels.forEach(status => {
      status.challenges.forEach(challenge => {
        const isCompleted = challenge.current >= challenge.target;
        const trophyId = challenge.trophy?.id;
        
        if (isCompleted && trophyId && !unlockedTrophies.includes(trophyId)) {
          newlyUnlocked.push(challenge.trophy);
        }
      });
    });
    
    if (newlyUnlocked.length > 0) {
      // Ajouter à la file d'attente des animations
      newlyUnlocked.forEach(trophy => addToQueue(trophy));
      
      // Mettre à jour les trophées débloqués
      setUnlockedTrophies(prev => [
        ...prev, 
        ...newlyUnlocked.map(t => t.id)
      ]);
      
      // Sauvegarder en base de données
      // TODO: Appel API pour sauvegarder les trophées
    }
  }, [userProgress]);

  // Calculer le statut actuel
  const getCurrentStatusIndex = () => {
    const statusMap = { 'nouveau': -1, 'bronze': 0, 'argent': 1, 'or': 2, 'diamant': 3 };
    return statusMap[calculatedStatus] ?? -1;
  };

  // Calculer les points totaux
  const calculateUserPoints = () => {
    let points = 0;
    const statusLevels = getStatusLevels();
    
    statusLevels.forEach(status => {
      status.challenges.forEach(challenge => {
        if (challenge.current >= challenge.target) {
          points += challenge.points;
        }
      });
    });
    
    return points;
  };

  // Animation au chargement
  useEffect(() => {
    setIsVisible(true);
    const currentIndex = getCurrentStatusIndex();
    setActiveStatus(currentIndex >= 0 ? currentIndex : 0);
  }, []);

  // Animer les barres de progression
  useEffect(() => {
    const statusLevels = getStatusLevels();
    statusLevels.forEach((status, statusIndex) => {
      status.challenges.forEach((challenge, index) => {
        setTimeout(() => {
          setAnimatedProgress(prev => ({
            ...prev,
            [`${statusIndex}-${index}`]: (challenge.current / challenge.target) * 100
          }));
        }, 100 * index);
      });
    });
  }, [userProgress]);

  const statusLevels = getStatusLevels();
  const totalPoints = calculateUserPoints();

  // Calculer tous les trophées disponibles
  const allTrophies = Object.values(FYDO_TROPHIES).flatMap(level => Object.values(level));

  if (!currentUser || !userDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center pt-20">
        <div className="text-center">
          <Trophy className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <p className="text-green-700 font-medium">Connectez-vous pour voir vos challenges</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-white min-h-screen">
      <Helmet>
        <title>Challenges & Trophées | Fydo</title>
        <meta name="description" content="Progressez dans les niveaux Fydo et débloquez des trophées animés exclusifs" />
      </Helmet>

      {/* Notification de déblocage de trophée */}
      {currentUnlock && (
        <EpicUnlockNotification
          trophy={currentUnlock}
          onClose={onAnimationComplete}
        />
      )}

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header avec bouton galerie */}
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
              Challenges & <span className="text-green-600">Trophées Animés</span>
            </h1>
            <p className="text-xl text-green-700 max-w-3xl mx-auto mb-6">
              Relevez des défis et débloquez des trophées animés exclusifs
            </p>
            
            {/* Bouton pour voir la galerie */}
            <button
              onClick={() => setShowGallery(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105"
            >
              <Trophy size={20} />
              Voir ma collection ({unlockedTrophies.length}/{allTrophies.length})
            </button>
          </div>

          {/* Carte du profil avec stats */}
          <div className={`bg-white rounded-2xl shadow-xl p-8 mb-8 transform transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative group">
                <UserAvatar 
                  userId={userDetails?.firebase_uid || currentUser?.uid}
                  size={96}
                  status={calculatedStatus}
                  displayName={userDetails?.displayName || currentUser?.displayName}
                  customAvatarUrl={userDetails?.avatarUrl}
                  avatarSeed={userDetails?.avatarSeed}
                  className="shadow-lg"
                  showBorder={true}
                />
                {/* Badge de niveau avec animation Lottie */}
                {getCurrentStatusIndex() >= 0 && (
                  <div className="absolute -bottom-4 -right-4 w-16 h-16">
                    <LottieTrophy
                      animationUrl={statusLevels[getCurrentStatusIndex()].animationUrl}
                      size={64}
                      loop={true}
                    />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {userDetails?.displayName || currentUser?.displayName || 'Utilisateur'}
                </h2>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${
                    getCurrentStatusIndex() >= 0 ? statusLevels[getCurrentStatusIndex()].gradient : 'from-gray-400 to-gray-600'
                  } text-white`}>
                    {getCurrentStatusIndex() >= 0 ? statusLevels[getCurrentStatusIndex()].name : 'Nouveau'}
                  </span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-600 font-medium">{totalPoints} points</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-purple-600 font-medium">
                    <Trophy size={16} className="inline mr-1" />
                    {unlockedTrophies.length} trophées
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation des statuts avec animations Lottie */}
          <div className={`flex flex-wrap justify-center gap-4 mb-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {statusLevels.map((status, index) => {
              const isActive = activeStatus === index;
              const currentIndex = getCurrentStatusIndex();
              const isUnlocked = index <= currentIndex + 1;
              
              return (
                <button
                  key={status.name}
                  onClick={() => setActiveStatus(index)}
                  disabled={!isUnlocked && index > 0}
                  className={`relative group transition-all duration-300 ${
                    isActive ? 'scale-110' : 'hover:scale-105'
                  } ${!isUnlocked && index > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`relative bg-white rounded-xl p-6 shadow-lg border-2 transition-all duration-300 ${
                    isActive ? `${status.borderColor} shadow-2xl` : 'border-gray-200'
                  }`}>
                    {/* Animation Lottie du niveau */}
                    <div className="mb-2">
                      <LottieTrophy
                        animationUrl={status.animationUrl}
                        size={80}
                        loop={isActive}
                      />
                    </div>
                    <h3 className={`font-bold ${isActive ? 'text-gray-800' : 'text-gray-600'}`}>
                      {status.name}
                    </h3>
                    
                    {/* Nombre de trophées débloqués */}
                    <p className="text-xs text-gray-600 mt-1">
                      {status.challenges.filter(c => c.current >= c.target).length}/{status.challenges.length} trophées
                    </p>

                    {!isUnlocked && index > 0 && (
                      <div className="absolute inset-0 bg-white bg-opacity-90 rounded-xl flex items-center justify-center">
                        <Lock className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {isActive && (
                    <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r ${status.gradient} rounded-full animate-pulse`}></div>
                  )}
                  
                  {currentIndex >= 0 && currentIndex === index && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      Actuel
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Contenu du statut sélectionné avec trophées */}
          <div className={`grid lg:grid-cols-3 gap-8 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="lg:col-span-2">
              <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border-2 ${statusLevels[activeStatus].borderColor}`}>
                <div className={`bg-gradient-to-r ${statusLevels[activeStatus].gradient} p-6 text-white`}>
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <LottieTrophy
                      animationUrl={statusLevels[activeStatus].animationUrl}
                      size={40}
                      loop={false}
                    />
                    Statut {statusLevels[activeStatus].name}
                  </h3>
                  <p className="text-white/80 mt-1">{statusLevels[activeStatus].description}</p>
                </div>

                <div className="p-6 space-y-4">
                  {statusLevels[activeStatus].challenges.map((challenge, index) => {
                    const isCompleted = challenge.current >= challenge.target;
                    const progressKey = `${activeStatus}-${index}`;
                    const progress = animatedProgress[progressKey] || 0;

                    return (
                      <div
                        key={challenge.id}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                          isCompleted 
                            ? 'bg-green-50 border-green-300' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                        onMouseEnter={() => setHoveredChallenge(challenge.id)}
                        onMouseLeave={() => setHoveredChallenge(null)}
                      >
                        <div className="flex items-start gap-4">
                          {/* Trophée ou emoji */}
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCompleted 
                              ? 'bg-white shadow-lg' 
                              : 'bg-gray-200'
                          }`}>
                            {challenge.trophy && (
                              <span className="text-3xl">
                                {challenge.trophy.emoji}
                              </span>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className={`font-medium ${isCompleted ? 'text-green-700' : 'text-gray-800'}`}>
                                  {challenge.label}
                                </h4>
                                {challenge.trophy && (
                                  <p className="text-xs text-gray-600 mt-0.5">
                                    Trophée: {challenge.trophy.name}
                                  </p>
                                )}
                              </div>
                              <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                                isCompleted 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                +{challenge.points} pts
                              </span>
                            </div>

                            <div className="relative">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>{challenge.current} / {challenge.target}</span>
                                <span className={`font-bold ${progress >= 100 ? 'text-green-600' : ''}`}>
                                  {Math.round(progress)}%
                                </span>
                              </div>
                              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                    isCompleted 
                                      ? 'bg-green-500' 
                                      : `bg-gradient-to-r ${statusLevels[activeStatus].gradient}`
                                  }`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {isCompleted && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            Débloqué
                          </div>
                        )}

                        {/* Animation au hover */}
                        {hoveredChallenge === challenge.id && !isCompleted && (
                          <div className="absolute inset-0 pointer-events-none">
                            <Sparkles className="absolute top-2 right-2 text-yellow-400 animate-pulse" size={16} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Panneau latéral avec infos */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Info className="text-blue-500" />
                  Comment ça marche ?
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>• Complétez les challenges pour débloquer des trophées animés</p>
                  <p>• Chaque trophée rapporte des points</p>
                  <p>• Les trophées sont permanents une fois débloqués</p>
                  <p>• Certains trophées secrets peuvent être découverts !</p>
                </div>
              </div>

              <Link
                to="/recherche-filtre"
                className="block bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl text-center transition-all transform hover:scale-105"
              >
                Scanner un produit
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal galerie de trophées */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Ma Collection de Trophées</h2>
              <button
                onClick={() => setShowGallery(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl"
              >
                ×
              </button>
            </div>
            
            <InteractiveTrophyGallery
              trophies={allTrophies}
              userTrophies={unlockedTrophies}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ChallengesPage;