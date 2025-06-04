// src/pages/ChallengesPageUltimate.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Info,
  Target,
  TrendingUp,
  Award,
  Flame,
  Crown,
  Star,
  Zap,
  Gift,
  Shield
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

// Configuration des niveaux avec animations Lottie
const LEVEL_CONFIG = {
  bronze: {
    name: 'Bronze',
    icon: '🥉',
    color: 'amber',
    gradient: 'from-amber-400 to-amber-600',
    bgGradient: 'from-amber-50 to-amber-100',
    borderColor: 'border-amber-300',
    shadowColor: 'shadow-amber-200',
    description: 'Nouveau membre de la communauté Fydo',
    animationUrl: 'https://assets2.lottiefiles.com/packages/lf20_touohxv0.json',
    unlockMessage: 'Bienvenue dans l\'aventure Fydo !',
    particleColor: '#f59e0b',
    lottieOptions: {
      speed: 1.2,
      segments: [0, 120]
    }
  },
  argent: {
    name: 'Argent', 
    icon: '🥈',
    color: 'gray',
    gradient: 'from-gray-400 to-gray-600',
    bgGradient: 'from-gray-50 to-gray-100',
    borderColor: 'border-gray-300',
    shadowColor: 'shadow-gray-200',
    description: 'Contributeur régulier et engagé',
    animationUrl: 'https://assets9.lottiefiles.com/packages/lf20_lc0lqpbg.json',
    unlockMessage: 'Vous progressez rapidement !',
    particleColor: '#6b7280',
    lottieOptions: {
      speed: 1,
      segments: [0, 150]
    }
  },
  or: {
    name: 'Or',
    icon: '🥇',
    color: 'yellow',
    gradient: 'from-yellow-400 to-yellow-600',
    bgGradient: 'from-yellow-50 to-yellow-100',
    borderColor: 'border-yellow-300',
    shadowColor: 'shadow-yellow-200',
    description: 'Expert reconnu par la communauté',
    animationUrl: 'https://assets1.lottiefiles.com/packages/lf20_kvdyp9s6.json',
    unlockMessage: 'Vous êtes un expert Fydo !',
    particleColor: '#eab308',
    lottieOptions: {
      speed: 0.8,
      segments: [0, 180]
    }
  },
  diamant: {
    name: 'Diamant',
    icon: '💎',
    color: 'blue',
    gradient: 'from-blue-400 to-purple-600',
    bgGradient: 'from-blue-50 to-purple-100',
    borderColor: 'border-blue-300',
    shadowColor: 'shadow-blue-200',
    description: 'Ambassadeur d\'exception Fydo',
    animationUrl: 'https://assets3.lottiefiles.com/packages/lf20_n9ryrmts.json',
    unlockMessage: 'Légendaire ! Vous êtes au sommet !',
    particleColor: '#3b82f6',
    lottieOptions: {
      speed: 1.5,
      segments: [0, 200]
    }
  }
};

// Animations supplémentaires pour les événements spéciaux
const SPECIAL_ANIMATIONS = {
  levelUp: 'https://assets10.lottiefiles.com/packages/lf20_jbrw3hcz.json',
  achievement: 'https://assets4.lottiefiles.com/packages/lf20_xrpu7w8s.json',
  celebration: 'https://assets6.lottiefiles.com/packages/lf20_suzt7qhz.json',
  fireworks: 'https://assets8.lottiefiles.com/packages/lf20_tfb3estd.json'
};

// Composant pour les effets de particules avancés
const ParticleEffect = ({ trigger, type = 'confetti' }) => {
  useEffect(() => {
    if (!trigger) return;

    if (type === 'confetti') {
      // Confetti standard
      const count = 200;
      const defaults = { origin: { y: 0.7 } };
      
      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }
      
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    } else if (type === 'stars') {
      // Étoiles dorées
      const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ['star'],
        colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
      };
      
      function shoot() {
        confetti({
          ...defaults,
          particleCount: 40,
          scalar: 1.2,
          shapes: ['star']
        });
        
        confetti({
          ...defaults,
          particleCount: 10,
          scalar: 0.75,
          shapes: ['circle']
        });
      }
      
      setTimeout(shoot, 0);
      setTimeout(shoot, 100);
      setTimeout(shoot, 200);
    } else if (type === 'fireworks') {
      // Feux d'artifice
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      
      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }
      
      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        
        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
    }
  }, [trigger, type]);

  return null;
};

// Composant pour l'animation de progression du niveau
const LevelProgressAnimation = ({ level, progress }) => {
  const levelConfig = LEVEL_CONFIG[level] || LEVEL_CONFIG.bronze;
  
  return (
    <motion.div 
      className="relative h-6 bg-gray-200 rounded-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${levelConfig.gradient}`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundImage: [
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)'
            ],
            backgroundPosition: ['-200% 0', '200% 0']
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
      
      {/* Étincelles animées */}
      {progress > 0 && (
        <motion.div
          className="absolute right-0 top-1/2 transform -translate-y-1/2"
          animate={{ x: `${progress}%` }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <Sparkles className="text-yellow-400 w-4 h-4 animate-pulse" />
        </motion.div>
      )}
    </motion.div>
  );
};

// Composant principal amélioré
const ChallengesPage = () => {
  const { currentUser, userDetails } = useAuth();
  const [activeLevel, setActiveLevel] = useState('bronze');
  const [animatedProgress, setAnimatedProgress] = useState({});
  const [showGallery, setShowGallery] = useState(false);
  const [unlockedTrophies, setUnlockedTrophies] = useState([]);
  const [hoveredChallenge, setHoveredChallenge] = useState(null);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [streakDays, setStreakDays] = useState(0);
  const [specialEffectTrigger, setSpecialEffectTrigger] = useState(null);
  
  // Hook pour gérer les animations de déblocage
  const { current: currentUnlock, addToQueue, onAnimationComplete } = useTrophyAnimations();

  // Construire les données de progression
  const userProgress = useMemo(() => buildUserProgress(userDetails), [userDetails]);
  
  // Calculer le statut dynamiquement
  const calculatedStatus = useMemo(() => {
    if (!userProgress) return 'nouveau';
    return calculateUserStatus(userProgress);
  }, [userProgress]);

  // Configuration des challenges avec mapping des trophées
  const getChallengesWithTrophies = () => {
    const progress = userProgress || {};
    
    // Harmoniser les noms de propriétés
    const normalizedProgress = {
      totalScans: progress.totalScans || progress.scanCount || 0,
      totalReviews: progress.totalReviews || progress.reviewCount || 0,
      totalFavorites: progress.totalFavorites || progress.favoriteCount || 0,
      totalLikes: progress.totalLikes || 0,
      firstReviews: progress.firstReviews || 0,
      categories: progress.categories || 0,
      daysConnected: progress.daysConnected || 0,
      profileComplete: progress.profileComplete || false
    };
    
    const challenges = {
      bronze: [
        { 
          id: 'scan5', 
          label: 'Scanner 5 produits différents', 
          current: Math.min(normalizedProgress.totalScans, 5), 
          target: 5, 
          points: 50,
          trophy: FYDO_TROPHIES.bronze.explorer_5,
          icon: <Trophy className="w-6 h-6" />
        },
        { 
          id: 'review1', 
          label: 'Publier 1 avis vérifié', 
          current: Math.min(normalizedProgress.totalReviews, 1), 
          target: 1, 
          points: 50,
          trophy: FYDO_TROPHIES.bronze.first_review,
          icon: <Star className="w-6 h-6" />
        },
        { 
          id: 'fav3', 
          label: 'Ajouter 3 produits en favoris', 
          current: Math.min(normalizedProgress.totalFavorites, 3), 
          target: 3, 
          points: 15,
          trophy: FYDO_TROPHIES.bronze.collector_3,
          icon: <Shield className="w-6 h-6" />
        },
        { 
          id: 'profile', 
          label: 'Compléter son profil à 100%', 
          current: normalizedProgress.profileComplete ? 1 : 0, 
          target: 1, 
          points: 20,
          trophy: FYDO_TROPHIES.bronze.complete_profile,
          icon: <CheckCircle2 className="w-6 h-6" />
        }
      ],
      argent: [
        { 
          id: 'scan25', 
          label: 'Scanner 25 produits différents', 
          current: Math.min(normalizedProgress.totalScans, 25), 
          target: 25, 
          points: 100,
          trophy: FYDO_TROPHIES.argent.scanner_25,
          icon: <Award className="w-6 h-6" />
        },
        { 
          id: 'review5', 
          label: 'Publier 5 avis vérifiés', 
          current: Math.min(normalizedProgress.totalReviews, 5), 
          target: 5, 
          points: 250,
          trophy: FYDO_TROPHIES.argent.reviewer_5,
          icon: <Zap className="w-6 h-6" />
        },
        { 
          id: 'likes10', 
          label: 'Obtenir 10 "j\'aime" sur ses avis', 
          current: Math.min(normalizedProgress.totalLikes, 10), 
          target: 10, 
          points: 50,
          trophy: FYDO_TROPHIES.argent.popular_10,
          icon: <TrendingUp className="w-6 h-6" />
        },
        { 
          id: 'days7', 
          label: '7 jours de connexion', 
          current: Math.min(normalizedProgress.daysConnected, 7), 
          target: 7, 
          points: 70,
          trophy: FYDO_TROPHIES.argent.week_streak,
          icon: <Flame className="w-6 h-6" />
        }
      ],
      or: [
        { 
          id: 'scan75', 
          label: 'Scanner 75 produits différents', 
          current: Math.min(normalizedProgress.totalScans, 75), 
          target: 75, 
          points: 300,
          trophy: FYDO_TROPHIES.or.scanner_expert,
          icon: <Crown className="w-6 h-6" />
        },
        { 
          id: 'review20', 
          label: 'Publier 20 avis vérifiés', 
          current: Math.min(normalizedProgress.totalReviews, 20), 
          target: 20, 
          points: 1000,
          trophy: FYDO_TROPHIES.or.reviewer_master,
          icon: <Gift className="w-6 h-6" />
        },
        { 
          id: 'first3', 
          label: 'Être le premier à évaluer 3 produits', 
          current: Math.min(normalizedProgress.firstReviews, 3), 
          target: 3, 
          points: 450,
          trophy: FYDO_TROPHIES.or.pioneer,
          icon: <Target className="w-6 h-6" />
        },
        { 
          id: 'likes50', 
          label: 'Obtenir 50 "j\'aime" sur ses avis', 
          current: Math.min(normalizedProgress.totalLikes, 50), 
          target: 50, 
          points: 250,
          trophy: FYDO_TROPHIES.or.influencer_50,
          icon: <Users className="w-6 h-6" />
        },
        { 
          id: 'days30', 
          label: '30 jours de connexion au total', 
          current: Math.min(normalizedProgress.daysConnected, 30), 
          target: 30, 
          points: 300,
          trophy: FYDO_TROPHIES.or.month_veteran,
          icon: <Shield className="w-6 h-6" />
        }
      ],
      diamant: [
        { 
          id: 'scan200', 
          label: 'Scanner 200 produits différents', 
          current: Math.min(normalizedProgress.totalScans, 200), 
          target: 200, 
          points: 1000,
          trophy: FYDO_TROPHIES.diamant.scanner_legend,
          icon: <Trophy className="w-6 h-6" />
        },
        { 
          id: 'review50', 
          label: 'Publier 50 avis vérifiés', 
          current: Math.min(normalizedProgress.totalReviews, 50), 
          target: 50, 
          points: 2500,
          trophy: FYDO_TROPHIES.diamant.reviewer_legend,
          icon: <Star className="w-6 h-6" />
        },
        { 
          id: 'first10', 
          label: 'Être le premier à évaluer 10 produits', 
          current: Math.min(normalizedProgress.firstReviews, 10), 
          target: 10, 
          points: 1500,
          trophy: FYDO_TROPHIES.diamant.discoverer,
          icon: <Award className="w-6 h-6" />
        },
        { 
          id: 'likes200', 
          label: 'Obtenir 200 "j\'aime" sur ses avis', 
          current: Math.min(normalizedProgress.totalLikes, 200), 
          target: 200, 
          points: 1000,
          trophy: FYDO_TROPHIES.diamant.superstar,
          icon: <Sparkles className="w-6 h-6" />
        },
        { 
          id: 'cat5', 
          label: 'Avoir des avis sur 5 catégories différentes', 
          current: Math.min(normalizedProgress.categories, 5), 
          target: 5, 
          points: 500,
          trophy: FYDO_TROPHIES.diamant.polyvalent,
          icon: <Crown className="w-6 h-6" />
        },
        { 
          id: 'days90', 
          label: '90 jours de connexion au total', 
          current: Math.min(normalizedProgress.daysConnected, 90), 
          target: 90, 
          points: 900,
          trophy: FYDO_TROPHIES.diamant.veteran_90,
          icon: <Flame className="w-6 h-6" />
        }
      ]
    };
    
    return challenges;
  };

  const challenges = getChallengesWithTrophies();

  // Calculer le statut actuel
  const getCurrentStatusIndex = () => {
    const statusMap = { 'nouveau': -1, 'bronze': 0, 'argent': 1, 'or': 2, 'diamant': 3 };
    return statusMap[calculatedStatus] ?? -1;
  };

  // Calculer les points totaux et la progression
  const calculateStats = useCallback(() => {
    let totalPoints = 0;
    let completedChallenges = 0;
    let totalChallenges = 0;
    let nextUnlock = null;
    let nearestProgress = 0;
    
    Object.values(challenges).forEach(levelChallenges => {
      levelChallenges.forEach(challenge => {
        totalChallenges++;
        const progress = (challenge.current / challenge.target) * 100;
        
        if (challenge.current >= challenge.target) {
          completedChallenges++;
          totalPoints += challenge.points;
        } else if (progress > nearestProgress) {
          nearestProgress = progress;
          nextUnlock = challenge;
        }
      });
    });
    
    return { 
      totalPoints, 
      completedChallenges, 
      totalChallenges,
      nextUnlock,
      completionPercentage: (completedChallenges / totalChallenges) * 100
    };
  }, [challenges]);

  const stats = useMemo(() => calculateStats(), [calculateStats]);

  // Vérifier les nouveaux trophées débloqués
  useEffect(() => {
    if (!userProgress) return;
    
    const newlyUnlocked = [];
    
    Object.entries(challenges).forEach(([level, levelChallenges]) => {
      levelChallenges.forEach(challenge => {
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
      
      // Déclencher un effet spécial
      setSpecialEffectTrigger({ type: 'stars', id: Date.now() });
    }
  }, [userProgress, challenges, unlockedTrophies, addToQueue]);

  // Animation au chargement
  useEffect(() => {
    const currentIndex = getCurrentStatusIndex();
    if (currentIndex >= 0 && currentIndex < levelOrder.length) {
      setActiveLevel(levelOrder[currentIndex]);
    } else {
      setActiveLevel('bronze');
    }
  }, [calculatedStatus]);

  // Animer les barres de progression
  useEffect(() => {
    Object.entries(challenges).forEach(([level, levelChallenges]) => {
      levelChallenges.forEach((challenge, index) => {
        setTimeout(() => {
          setAnimatedProgress(prev => ({
            ...prev,
            [`${level}-${index}`]: (challenge.current / challenge.target) * 100
          }));
        }, 100 * index);
      });
    });
  }, [challenges]);

  // Calculer le streak de connexion (simulation)
  useEffect(() => {
    // Simulation d'un streak de connexion
    const streak = userProgress?.daysConnected || 0;
    setStreakDays(Math.min(streak, 999));
  }, [userProgress]);

  const levelOrder = ['bronze', 'argent', 'or', 'diamant'];
  const totalPoints = stats.totalPoints;

  // Calculer tous les trophées disponibles
  const allTrophies = Object.values(FYDO_TROPHIES).flatMap(level => Object.values(level));

  if (!currentUser || !userDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center pt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <LottieTrophy
            animationUrl={SPECIAL_ANIMATIONS.achievement}
            size={200}
            loop={true}
          />
          <p className="text-green-700 font-medium mt-4">Connectez-vous pour voir vos challenges</p>
          <Link 
            to="/login"
            className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105"
          >
            Se connecter
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
      
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-green-50 min-h-screen">
      <Helmet>
        <title>Challenges & Trophées Animés | Fydo</title>
        <meta name="description" content="Progressez dans les niveaux Fydo et débloquez des trophées animés exclusifs" />
      </Helmet>

      {/* Effet de particules */}
      <ParticleEffect trigger={specialEffectTrigger} type={specialEffectTrigger?.type || 'confetti'} />

      {/* Notification de déblocage de trophée */}
      {currentUnlock && (
        <EpicUnlockNotification
          trophy={currentUnlock}
          onClose={onAnimationComplete}
        />
      )}

      {/* Animation de niveau supérieur */}
      <AnimatePresence>
        {showLevelUpAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <LottieTrophy
              animationUrl={SPECIAL_ANIMATIONS.levelUp}
              size={400}
              loop={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header avec animations */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-green-800 mb-4"
              animate={{ 
                scale: [1, 1.02, 1],
                transition: { repeat: Infinity, duration: 3 }
              }}
            >
              Challenges & <span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
                style={{
                  backgroundSize: '200% 200%',
                  animation: 'gradient 3s ease infinite',
                }}
              >Trophées Animés</span>
            </motion.h1>
            <p className="text-xl text-green-700 max-w-3xl mx-auto mb-8">
              Relevez des défis épiques et débloquez des animations exclusives
            </p>
            
            {/* Barre de progression globale */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progression globale</span>
                <span className="font-bold">{Math.round(stats.completionPercentage)}%</span>
              </div>
              <LevelProgressAnimation 
                level={calculatedStatus && LEVEL_CONFIG[calculatedStatus] ? calculatedStatus : 'bronze'} 
                progress={stats.completionPercentage}
              />
            </div>
            
            {/* Stats en temps réel avec animations */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white rounded-2xl px-6 py-4 shadow-lg flex items-center gap-3 border border-yellow-200"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Trophy className="text-yellow-500" size={28} />
                </motion.div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-gray-800">{stats.completedChallenges}/{stats.totalChallenges}</p>
                  <p className="text-sm text-gray-600">Challenges</p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white rounded-2xl px-6 py-4 shadow-lg flex items-center gap-3 border border-green-200"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Target className="text-green-500" size={28} />
                </motion.div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-gray-800">{stats.totalPoints}</p>
                  <p className="text-sm text-gray-600">Points</p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white rounded-2xl px-6 py-4 shadow-lg flex items-center gap-3 border border-purple-200"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Award className="text-purple-500" size={28} />
                </motion.div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-gray-800">{unlockedTrophies.length}/{allTrophies.length}</p>
                  <p className="text-sm text-gray-600">Trophées</p>
                </div>
              </motion.div>

              {/* Streak de connexion */}
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl px-6 py-4 shadow-lg flex items-center gap-3 text-white"
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Flame size={28} />
                </motion.div>
                <div className="text-left">
                  <p className="text-2xl font-bold">{streakDays}</p>
                  <p className="text-sm">Jours d'affilée</p>
                </div>
              </motion.div>
            </div>
            
            {/* Bouton galerie amélioré */}
            <motion.button
              onClick={() => setShowGallery(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-2xl font-bold shadow-lg transition-all"
            >
              <Crown size={24} />
              Ma Collection de Trophées
              <ChevronRight size={20} />
            </motion.button>
          </motion.div>

          {/* Carte du profil avec effets avancés */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-green-100 relative overflow-hidden"
          >
            {/* Effet de dégradé animé en arrière-plan */}
            <div className="absolute inset-0 opacity-5">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-400 to-purple-600"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.5, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            </div>
            
            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar avec animations multiples */}
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <UserAvatar 
                  userId={userDetails?.firebase_uid || currentUser?.uid}
                  size={120}
                  status={calculatedStatus}
                  displayName={userDetails?.displayName || currentUser?.displayName}
                  customAvatarUrl={userDetails?.avatarUrl}
                  avatarSeed={userDetails?.avatarSeed}
                  className="shadow-xl"
                  showBorder={true}
                />
                
                {/* Badge de niveau avec animation Lottie */}
                {getCurrentStatusIndex() >= 0 && calculatedStatus && (
                  <motion.div 
                    className="absolute -bottom-6 -right-6"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.5 }}
                  >
                    <div className="w-20 h-20 relative">
                      <LottieTrophy
                        animationUrl={LEVEL_CONFIG[calculatedStatus]?.animationUrl || LEVEL_CONFIG.bronze.animationUrl}
                        size={80}
                        loop={true}
                      />
                    </div>
                  </motion.div>
                )}
                
                {/* Effet de particules au hover */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div
                    className="absolute -top-2 -left-2"
                    animate={{ 
                      rotate: 360,
                      scale: [0, 1, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="text-yellow-400 w-6 h-6" />
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-2 -right-2"
                    animate={{ 
                      rotate: -360,
                      scale: [0, 1, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  >
                    <Star className="text-purple-400 w-6 h-6" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Infos utilisateur avec animations */}
              <div className="flex-1 text-center md:text-left">
                <motion.h2 
                  className="text-3xl font-bold text-gray-800 mb-2"
                  animate={{ 
                    textShadow: [
                      "0px 0px 0px rgba(0,0,0,0)",
                      "0px 0px 20px rgba(34,197,94,0.3)",
                      "0px 0px 0px rgba(0,0,0,0)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {userDetails?.displayName || currentUser?.displayName || 'Explorateur'}
                </motion.h2>
                
                {/* Statut et progression avec effets */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                  <motion.span 
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${
                      LEVEL_CONFIG[calculatedStatus]?.gradient || LEVEL_CONFIG.bronze.gradient
                    } text-white shadow-lg`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {LEVEL_CONFIG[calculatedStatus]?.icon || '🌱'} {LEVEL_CONFIG[calculatedStatus]?.name || 'Nouveau'}
                  </motion.span>
                  
                  {/* Prochain challenge */}
                  {stats.nextUnlock && (
                    <motion.div 
                      className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Target size={16} className="text-blue-600" />
                      <span className="text-sm text-blue-700">
                        Prochain: {stats.nextUnlock.label} ({Math.round((stats.nextUnlock.current / stats.nextUnlock.target) * 100)}%)
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Badges de réalisations avec animations d'apparition */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {stats.completedChallenges >= 5 && (
                    <motion.span 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring" }}
                      className="bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md"
                    >
                      <Flame size={12} /> Série de 5
                    </motion.span>
                  )}
                  {stats.totalPoints >= 1000 && (
                    <motion.span 
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="bg-gradient-to-r from-purple-400 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md"
                    >
                      <Sparkles size={12} /> 1000+ Points
                    </motion.span>
                  )}
                  {unlockedTrophies.length >= 10 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md"
                    >
                      <Crown size={12} /> Collectionneur
                    </motion.span>
                  )}
                  {streakDays >= 7 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.3 }}
                      className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md animate-pulse"
                    >
                      <Flame size={12} /> En feu !
                    </motion.span>
                  )}
                </div>
              </div>

              {/* Actions rapides avec effets */}
              <div className="flex flex-col gap-3">
                <Link
                  to="/recherche-filtre"
                  className="group relative overflow-hidden bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-lg"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                    animate={{ x: [-200, 200] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="relative">Scanner un produit</span>
                  <ChevronRight size={16} className="relative group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <button
                  onClick={() => window.location.href = '/top-produits'}
                  className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-md"
                >
                  Top Produits
                </button>
              </div>
            </div>
          </motion.div>

          {/* Navigation des niveaux avec effets 3D */}
          <div className="flex flex-wrap justify-center gap-6 mb-12" style={{ perspective: '1000px' }}>
            {levelOrder.map((levelKey, index) => {
              const level = LEVEL_CONFIG[levelKey];
              const isActive = activeLevel === levelKey;
              const currentIndex = getCurrentStatusIndex();
              const levelIndex = index;
              const isUnlocked = levelIndex <= currentIndex + 1;
              const isCompleted = levelIndex < currentIndex;
              
              return (
                <motion.button
                  key={levelKey}
                  onClick={() => setActiveLevel(levelKey)}
                  disabled={!isUnlocked && levelIndex > 0}
                  whileHover={isUnlocked ? { scale: 1.05, rotateY: 5 } : {}}
                  whileTap={isUnlocked ? { scale: 0.95 } : {}}
                  className={`relative transition-all transform-gpu ${
                    !isUnlocked && levelIndex > 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <motion.div 
                    className={`relative bg-white rounded-2xl p-6 shadow-lg border-2 transition-all ${
                      isActive ? `${level.borderColor} ${level.shadowColor} shadow-2xl scale-110` : 'border-gray-200'
                    } ${isCompleted ? 'bg-gradient-to-br from-green-50 to-green-100' : ''}`}
                    animate={isActive ? { 
                      y: [0, -10, 0],
                      boxShadow: [
                        '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        '0 20px 40px -5px rgba(0, 0, 0, 0.15)',
                        '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                      ]
                    } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {/* Animation Lottie du niveau */}
                    <div className="mb-3 relative">
                      <LottieTrophy
                        animationUrl={level.animationUrl}
                        size={120}
                        loop={isActive}
                      />
                      {isCompleted && (
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <CheckCircle2 className="w-12 h-12 text-green-500 bg-white rounded-full" />
                        </motion.div>
                      )}
                    </div>
                    
                    <h3 className={`font-bold text-lg ${isActive ? 'text-gray-800' : 'text-gray-600'}`}>
                      {level.name}
                    </h3>
                    
                    {/* Progression du niveau avec effet */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progression</span>
                        <motion.span
                          key={`${levelKey}-progress`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {challenges[levelKey]?.filter(c => c.current >= c.target).length || 0}/
                          {challenges[levelKey]?.length || 0}
                        </motion.span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full bg-gradient-to-r ${level.gradient} relative`}
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${((challenges[levelKey]?.filter(c => c.current >= c.target).length || 0) / (challenges[levelKey]?.length || 1)) * 100}%` 
                          }}
                          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-white opacity-20"
                            animate={{ x: [-100, 200] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </motion.div>
                      </div>
                    </div>

                    {/* Badge de verrouillage avec effet */}
                    {!isUnlocked && levelIndex > 0 && (
                      <motion.div 
                        className="absolute inset-0 bg-white bg-opacity-90 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Lock className="w-10 h-10 text-gray-400" />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Indicateurs animés */}
                  {isActive && (
                    <motion.div 
                      className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r ${level.gradient} rounded-full`}
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                  
                  {calculatedStatus === levelKey && (
                    <motion.div 
                      className="absolute -top-3 -right-3 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", bounce: 0.6 }}
                    >
                      <Star size={12} /> Actuel
                    </motion.div>
                  )}
                  
                  {isCompleted && (
                    <motion.div 
                      className="absolute -top-3 -left-3 bg-green-500 text-white rounded-full p-1.5 shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.3 }}
                    >
                      <CheckCircle2 size={16} />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Contenu du niveau sélectionné avec animations avancées */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Liste des challenges */}
            <div className="lg:col-span-2">
              <motion.div 
                className={`bg-white rounded-3xl shadow-xl overflow-hidden border-2 ${LEVEL_CONFIG[activeLevel]?.borderColor || 'border-gray-200'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={activeLevel}
              >
                {/* Header du niveau avec dégradé animé */}
                <div className={`relative bg-gradient-to-r ${LEVEL_CONFIG[activeLevel]?.gradient || 'from-gray-400 to-gray-600'} p-6 text-white overflow-hidden`}>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"
                    animate={{ x: [-200, 200] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <LottieTrophy
                            animationUrl={LEVEL_CONFIG[activeLevel]?.animationUrl || LEVEL_CONFIG.bronze.animationUrl}
                            size={40}
                            loop={false}
                          />
                        </motion.div>
                        Statut {LEVEL_CONFIG[activeLevel]?.name || 'Bronze'}
                      </h3>
                      <p className="text-white/80 mt-1">{LEVEL_CONFIG[activeLevel]?.description || ''}</p>
                    </div>
                    <motion.div 
                      className="text-4xl"
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {LEVEL_CONFIG[activeLevel]?.icon || '🥉'}
                    </motion.div>
                  </div>
                </div>

                {/* Liste des challenges avec animations séquentielles */}
                <div className="p-6 space-y-4">
                  <AnimatePresence mode="wait">
                    {challenges[activeLevel]?.map((challenge, index) => {
                      const isCompleted = challenge.current >= challenge.target;
                      const progressKey = `${activeLevel}-${index}`;
                      const progress = animatedProgress[progressKey] || 0;

                      return (
                        <motion.div
                          key={challenge.id}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          transition={{ 
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 100
                          }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          onHoverStart={() => setHoveredChallenge(challenge.id)}
                          onHoverEnd={() => setHoveredChallenge(null)}
                          className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                            isCompleted 
                              ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-300 shadow-lg' 
                              : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Trophée animé */}
                            <motion.div 
                              className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                                isCompleted 
                                  ? 'bg-white shadow-lg' 
                                  : 'bg-gray-200'
                              }`}
                              animate={isCompleted ? { 
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1]
                              } : {}}
                              transition={{ repeat: Infinity, duration: 3 }}
                            >
                              {challenge.trophy && (
                                <motion.span 
                                  className="text-4xl"
                                  animate={hoveredChallenge === challenge.id ? {
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 360]
                                  } : {}}
                                  transition={{ duration: 0.5 }}
                                >
                                  {challenge.trophy.emoji}
                                </motion.span>
                              )}
                            </motion.div>

                            {/* Contenu du challenge */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className={`font-bold text-lg flex items-center gap-2 ${
                                    isCompleted ? 'text-green-700' : 'text-gray-800'
                                  }`}>
                                    {challenge.label}
                                    {hoveredChallenge === challenge.id && challenge.icon && (
                                      <motion.span
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-gray-600"
                                      >
                                        {challenge.icon}
                                      </motion.span>
                                    )}
                                  </h4>
                                  {challenge.trophy && (
                                    <motion.p 
                                      className="text-sm text-gray-600 mt-1 flex items-center gap-1"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.2 }}
                                    >
                                      <Award size={14} />
                                      {challenge.trophy.name}
                                      {challenge.trophy.rarity && (
                                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                          challenge.trophy.rarity === 'common' ? 'bg-gray-100 text-gray-600' :
                                          challenge.trophy.rarity === 'rare' ? 'bg-blue-100 text-blue-600' :
                                          challenge.trophy.rarity === 'epic' ? 'bg-purple-100 text-purple-600' :
                                          'bg-yellow-100 text-yellow-600'
                                        }`}>
                                          {challenge.trophy.rarity.toUpperCase()}
                                        </span>
                                      )}
                                    </motion.p>
                                  )}
                                </div>
                                <motion.span 
                                  className={`text-sm font-bold px-4 py-2 rounded-full flex items-center gap-1 ${
                                    isCompleted 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-gray-100 text-gray-600'
                                  }`}
                                  animate={isCompleted ? { 
                                    scale: [1, 1.1, 1],
                                    boxShadow: [
                                      '0 0 0 0 rgba(34, 197, 94, 0)',
                                      '0 0 0 10px rgba(34, 197, 94, 0.1)',
                                      '0 0 0 0 rgba(34, 197, 94, 0)'
                                    ]
                                  } : {}}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <Zap size={14} />
                                  +{challenge.points} pts
                                </motion.span>
                              </div>

                              {/* Barre de progression améliorée */}
                              <div className="relative">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                  <motion.span 
                                    className="font-medium"
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  >
                                    {challenge.current} / {challenge.target}
                                  </motion.span>
                                  <motion.span 
                                    className={`font-bold ${progress >= 100 ? 'text-green-600' : ''}`}
                                    animate={progress >= 100 ? {
                                      scale: [1, 1.2, 1],
                                      color: ['#16a34a', '#22c55e', '#16a34a']
                                    } : {}}
                                    transition={{ duration: 1 }}
                                  >
                                    {Math.round(progress)}%
                                  </motion.span>
                                </div>
                                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                                  <motion.div 
                                    className={`h-full rounded-full relative ${
                                      isCompleted 
                                        ? 'bg-gradient-to-r from-green-400 to-green-600' 
                                        : `bg-gradient-to-r ${LEVEL_CONFIG[activeLevel]?.gradient || 'from-gray-400 to-gray-600'}`
                                    }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                  >
                                    {/* Effet de brillance */}
                                    <motion.div
                                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                                      animate={{ x: [-100, 200] }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    
                                    {/* Particules pour progression active */}
                                    {progress > 0 && progress < 100 && (
                                      <motion.div
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2"
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                      >
                                        <Sparkles className="text-white w-3 h-3" />
                                      </motion.div>
                                    )}
                                  </motion.div>
                                </div>
                              </div>

                              {/* Tags supplémentaires */}
                              {challenge.trophy && (
                                <motion.div 
                                  className="flex gap-2 mt-3"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  {challenge.trophy.limited && (
                                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                      <Gift size={10} />
                                      ÉDITION LIMITÉE
                                    </span>
                                  )}
                                  {challenge.trophy.special && (
                                    <span className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full font-medium">
                                      SPÉCIAL
                                    </span>
                                  )}
                                </motion.div>
                              )}
                            </div>
                          </div>

                          {/* Badge de complétion animé */}
                          {isCompleted && (
                            <motion.div 
                              className="absolute -top-3 -right-3 bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1 shadow-lg"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", delay: 0.3, bounce: 0.6 }}
                              whileHover={{ scale: 1.1 }}
                            >
                              <CheckCircle2 size={14} />
                              Débloqué
                            </motion.div>
                          )}

                          {/* Effet de hover avec particules */}
                          <AnimatePresence>
                            {hoveredChallenge === challenge.id && !isCompleted && (
                              <>
                                <motion.div
                                  className="absolute top-4 right-4"
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0 }}
                                >
                                  <Sparkles className="text-yellow-400 w-4 h-4 animate-pulse" />
                                </motion.div>
                                <motion.div
                                  className="absolute bottom-4 left-4"
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0 }}
                                  transition={{ delay: 0.1 }}
                                >
                                  <Star className="text-purple-400 w-3 h-3 animate-pulse" />
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Panneau latéral avec widgets interactifs */}
            <div className="space-y-6">
              {/* Guide interactif */}
              <motion.div 
                className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ y: -2 }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Info className="text-blue-500" />
                  </motion.div>
                  Comment progresser ?
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  {[
                    'Complétez les challenges pour débloquer des trophées animés exclusifs',
                    'Chaque trophée rapporte des points qui augmentent votre niveau',
                    'Découvrez des trophées secrets cachés dans l\'application',
                    'Les trophées sont permanents et visibles dans votre profil'
                  ].map((tip, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CheckCircle2 className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <p>{tip}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Widget de progression vers le prochain niveau */}
              {calculatedStatus !== 'diamant' && getCurrentStatusIndex() < levelOrder.length - 1 && (
                <motion.div 
                  className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-xl p-6 border border-purple-200"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                    <Target className="text-purple-600" />
                    Prochaine Récompense
                  </h3>
                  <div className="text-center">
                    <motion.div 
                      className="mb-4"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <LottieTrophy
                        animationUrl={LEVEL_CONFIG[levelOrder[getCurrentStatusIndex() + 1]]?.animationUrl || LEVEL_CONFIG.bronze.animationUrl}
                        size={120}
                        loop={true}
                      />
                    </motion.div>
                    <p className="text-purple-700 font-medium text-lg">
                      Niveau {LEVEL_CONFIG[levelOrder[getCurrentStatusIndex() + 1]]?.name || 'Bronze'}
                    </p>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-purple-600 mb-2">
                        <span>Progression</span>
                        <span className="font-bold">75%</span>
                      </div>
                      <LevelProgressAnimation 
                        level={levelOrder[getCurrentStatusIndex() + 1] || 'bronze'} 
                        progress={75}
                      />
                    </div>
                    <p className="text-sm text-purple-600 mt-3">
                      Plus que 2 challenges à compléter !
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Statistiques en temps réel */}
              <motion.div 
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-xl p-6 border border-green-200"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="text-green-600" />
                  Vos Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Rang mondial</span>
                    <motion.span 
                      className="font-bold text-green-700"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      #1,337
                    </motion.span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Points ce mois</span>
                    <span className="font-bold text-green-700">+450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Trophées rares</span>
                    <span className="font-bold text-purple-700">3</span>
                  </div>
                </div>
              </motion.div>

              {/* Actions avec animations */}
              <div className="space-y-3">
                <Link
                  to="/recherche-filtre"
                  className="group relative overflow-hidden block bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl text-center transition-all transform hover:scale-105 shadow-lg"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                    animate={{ x: [-200, 200] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="relative flex items-center justify-center gap-2">
                    Scanner un produit
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
                
                <motion.button
                  onClick={() => setShowGallery(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Crown size={20} />
                    Voir tous les trophées
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal galerie de trophées améliorée */}
      <AnimatePresence>
        {showGallery && (
          <motion.div 
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGallery(false)}
          >
            <motion.div 
              className="bg-white rounded-3xl p-8 max-w-7xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", bounce: 0.3 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <Crown className="text-purple-600" size={32} />
                    Ma Collection de Trophées
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {unlockedTrophies.length} trophées débloqués sur {allTrophies.length} • {stats.totalPoints} points au total
                  </p>
                </motion.div>
                <motion.button
                  onClick={() => setShowGallery(false)}
                  className="text-gray-500 hover:text-gray-700 text-4xl leading-none transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.button>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                <InteractiveTrophyGallery
                  trophies={allTrophies}
                  userTrophies={unlockedTrophies}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </section>
    </>
  );
};

export default ChallengesPage;