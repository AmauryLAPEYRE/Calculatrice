// src/components/login/UserProfile.js - Version Ultra Dynamique et Gamifiée
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getUserSubscription } from '../../services/subscriptionService';
import { calculateUserStatus, buildUserProgress, getNextStatusInfo } from '../../utils/statusCalculator';
import ProfileLayout from '../profile/ProfileLayout';
import UserAvatar from '../profile/UserAvatar';
import { 
  ShoppingBag, 
  AlertCircle, 
  Settings, 
  Star, 
  Heart, 
  Award, 
  Shield, 
  Badge, 
  Calendar, 
  Map,
  ChevronRight,
  Crown,
  Zap,
  Trophy,
  TrendingUp,
  MessageSquare,
  Clock,
  Camera,
  Receipt,
  LogOut,
  Edit3,
  Mail,
  MapPin,
  Gift,
  Sparkles,
  Users,
  BarChart3,
  User,
  Building2,
  Hash,
  Target,
  Flame,
  Activity,
  ArrowUp,
  CheckCircle2,
  Plus,
  Search,
  Share2,
  Smile,
  Scan,
  ThumbsUp,
  Diamond,
  Medal,
  Rocket,
  ChevronUp,
  Info,
  Eye,
  ArrowRight,
  Timer,
  Lock,
  Unlock
} from 'lucide-react';

const UserProfile = () => {
  const { currentUser, logout, userDetails } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedStat, setSelectedStat] = useState(null);
  const [animatedNumbers, setAnimatedNumbers] = useState({});
  const [hoveredAchievement, setHoveredAchievement] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Construire les données de progression
  const userProgress = buildUserProgress(userDetails);
  const calculatedStatus = calculateUserStatus(userProgress);
  const nextStatusInfo = getNextStatusInfo(userProgress, calculatedStatus);

  // Calculer les points totaux (synchronisé avec ChallengesPage)
  const totalPoints = useMemo(() => {
    if (!userProgress) return 0;
    let points = 0;
    
    // Points pour scans
    if (userProgress.totalScans >= 5) points += 50;
    if (userProgress.totalScans >= 25) points += 100;
    if (userProgress.totalScans >= 75) points += 300;
    if (userProgress.totalScans >= 200) points += 1000;
    
    // Points pour reviews
    if (userProgress.totalReviews >= 1) points += 50;
    if (userProgress.totalReviews >= 5) points += 250;
    if (userProgress.totalReviews >= 20) points += 1000;
    if (userProgress.totalReviews >= 50) points += 2500;
    
    // Points pour favoris
    if (userProgress.totalFavorites >= 3) points += 15;
    
    // Points pour profil complet
    if (userProgress.profileComplete) points += 20;
    
    // Points pour likes
    if (userProgress.totalLikes >= 10) points += 50;
    if (userProgress.totalLikes >= 50) points += 250;
    if (userProgress.totalLikes >= 200) points += 1000;
    
    // Points pour jours connectés
    if (userProgress.daysConnected >= 7) points += 70;
    if (userProgress.daysConnected >= 30) points += 300;
    if (userProgress.daysConnected >= 90) points += 900;
    
    return points;
  }, [userProgress]);

  // Configuration des statuts (synchronisée avec ChallengesPage)
  const statusConfig = {
    nouveau: {
      name: 'Nouveau',
      color: 'green',
      gradient: 'from-green-400 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      borderColor: 'border-green-300',
      icon: '🌱',
      glow: 'shadow-green-400/50'
    },
    bronze: {
      name: 'Bronze',
      color: 'amber',
      gradient: 'from-amber-400 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
      borderColor: 'border-amber-300',
      icon: '🥉',
      glow: 'shadow-amber-400/50'
    },
    argent: {
      name: 'Argent',
      color: 'gray',
      gradient: 'from-gray-300 to-gray-500',
      bgGradient: 'from-gray-50 to-gray-100',
      borderColor: 'border-gray-300',
      icon: '🥈',
      glow: 'shadow-gray-400/50'
    },
    or: {
      name: 'Or',
      color: 'yellow',
      gradient: 'from-yellow-400 to-yellow-600',
      bgGradient: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-300',
      icon: '🥇',
      glow: 'shadow-yellow-400/50'
    },
    diamant: {
      name: 'Diamant',
      color: 'blue',
      gradient: 'from-blue-400 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-300',
      icon: '💎',
      glow: 'shadow-blue-400/50'
    }
  };

  const currentStatusConfig = statusConfig[calculatedStatus] || statusConfig.nouveau;

  // Animation des nombres au chargement (une seule fois)
  useEffect(() => {
    if (!userProgress || hasAnimated) return;
    
    const timers = [];
    const stats = {
      scans: userProgress.totalScans || 0,
      reviews: userProgress.totalReviews || 0,
      favorites: userProgress.totalFavorites || 0,
      likes: userProgress.totalLikes || 0,
      days: userProgress.daysConnected || 0,
      points: totalPoints
    };

    // Marquer comme animé
    setHasAnimated(true);

    // Animer chaque statistique
    Object.entries(stats).forEach(([key, target]) => {
      // Si la valeur est 0, pas besoin d'animer
      if (target === 0) {
        setAnimatedNumbers(prev => ({ ...prev, [key]: 0 }));
      } else {
        let current = 0;
        const duration = 1500; // 1.5 secondes pour l'animation
        const steps = 30;
        const increment = target / steps;
        let step = 0;
        
        const timer = setInterval(() => {
          step++;
          current = Math.round(increment * step);
          
          if (step >= steps) {
            current = target;
            clearInterval(timer);
          }
          
          setAnimatedNumbers(prev => ({ ...prev, [key]: current }));
        }, duration / steps);
        
        timers.push(timer);
      }
    });

    // Cleanup function pour nettoyer tous les intervalles
    return () => {
      timers.forEach(timer => clearInterval(timer));
    };
  }, [userProgress, totalPoints, hasAnimated]);

  // Animation au chargement
  useEffect(() => {
    setIsVisible(true);
    // Effet confetti si l'utilisateur vient de passer un niveau
    const hasLeveledUp = localStorage.getItem('justLeveledUp');
    if (hasLeveledUp) {
      setShowConfetti(true);
      localStorage.removeItem('justLeveledUp');
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, []);

  // Réinitialiser l'animation si l'utilisateur change
  useEffect(() => {
    setHasAnimated(false);
  }, [userDetails?.firebase_uid]);

  // Fonction de déconnexion
  const handleLogout = async () => {
    setError('');
    setLoading(true);
    
    try {
      await logout();
      navigate('/');
    } catch (error) {
      setError('Échec de la déconnexion: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Charger les informations d'abonnement
  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      if (currentUser) {
        try {
          const { subscription, plan } = await getUserSubscription(currentUser.uid);
          setSubscription(subscription);
          setSubscriptionPlan(plan);
        } catch (err) {
          console.error("Erreur lors du chargement de l'abonnement:", err);
        }
      }
    };
    
    fetchSubscriptionInfo();
  }, [currentUser]);

  // Statistiques détaillées avec progression
  const getDetailedStats = () => {
    const stats = [
      {
        id: 'scans',
        icon: <Scan className="text-blue-600" />,
        value: animatedNumbers.scans ?? userProgress?.totalScans ?? 0,
        label: 'Produits scannés',
        color: 'blue',
        progress: {
          current: userProgress?.totalScans || 0,
          targets: [5, 25, 75, 200],
          unit: 'scans'
        },
        trend: '+23%',
        description: 'Découvrez de nouveaux produits'
      },
      {
        id: 'reviews',
        icon: <Star className="text-amber-600" />,
        value: animatedNumbers.reviews ?? userProgress?.totalReviews ?? 0,
        label: 'Avis publiés',
        color: 'amber',
        progress: {
          current: userProgress?.totalReviews || 0,
          targets: [1, 5, 20, 50],
          unit: 'avis'
        },
        trend: '+12%',
        description: 'Partagez votre expérience'
      },
      {
        id: 'favorites',
        icon: <Heart className="text-pink-600" />,
        value: animatedNumbers.favorites ?? userProgress?.totalFavorites ?? 0,
        label: 'Favoris',
        color: 'pink',
        progress: {
          current: userProgress?.totalFavorites || 0,
          targets: [3, 10, 25, 50],
          unit: 'favoris'
        },
        trend: '+5%',
        description: 'Vos produits préférés'
      },
      {
        id: 'likes',
        icon: <ThumbsUp className="text-green-600" />,
        value: animatedNumbers.likes ?? userProgress?.totalLikes ?? 0,
        label: 'J\'aime reçus',
        color: 'green',
        progress: {
          current: userProgress?.totalLikes || 0,
          targets: [10, 50, 200, 500],
          unit: 'likes'
        },
        trend: '+18%',
        description: 'La communauté vous apprécie'
      }
    ];
    
    return stats;
  };

  // Achievements dynamiques synchronisés avec ChallengesPage
  const getDynamicAchievements = useMemo(() => {
    if (!userProgress) return [];
    
    // Configuration des challenges par niveau (depuis ChallengesPage)
    const allChallenges = [
      // Bronze
      {
        id: 'scan5',
        name: 'Explorateur débutant',
        description: 'Scanner 5 produits différents',
        icon: <Scan className="text-amber-600" />,
        unlocked: userProgress.totalScans >= 5,
        current: Math.min(userProgress.totalScans, 5),
        target: 5,
        points: 50,
        level: 'bronze',
        color: 'amber'
      },
      {
        id: 'review1',
        name: 'Première opinion',
        description: 'Publier 1 avis vérifié',
        icon: <Star className="text-amber-600" />,
        unlocked: userProgress.totalReviews >= 1,
        current: Math.min(userProgress.totalReviews, 1),
        target: 1,
        points: 50,
        level: 'bronze',
        color: 'amber'
      },
      {
        id: 'fav3',
        name: 'Collectionneur novice',
        description: 'Ajouter 3 produits en favoris',
        icon: <Heart className="text-amber-600" />,
        unlocked: userProgress.totalFavorites >= 3,
        current: Math.min(userProgress.totalFavorites, 3),
        target: 3,
        points: 15,
        level: 'bronze',
        color: 'amber'
      },
      {
        id: 'profile',
        name: 'Profil complet',
        description: 'Compléter son profil à 100%',
        icon: <Users className="text-amber-600" />,
        unlocked: userProgress.profileComplete,
        current: userProgress.profileComplete ? 1 : 0,
        target: 1,
        points: 20,
        level: 'bronze',
        color: 'amber'
      },
      // Argent
      {
        id: 'scan25',
        name: 'Scanner confirmé',
        description: 'Scanner 25 produits différents',
        icon: <Scan className="text-gray-600" />,
        unlocked: userProgress.totalScans >= 25,
        current: Math.min(userProgress.totalScans, 25),
        target: 25,
        points: 100,
        level: 'argent',
        color: 'gray'
      },
      {
        id: 'review5',
        name: 'Contributeur actif',
        description: 'Publier 5 avis vérifiés',
        icon: <Star className="text-gray-600" />,
        unlocked: userProgress.totalReviews >= 5,
        current: Math.min(userProgress.totalReviews, 5),
        target: 5,
        points: 250,
        level: 'argent',
        color: 'gray'
      },
      {
        id: 'likes10',
        name: 'Apprécié',
        description: 'Obtenir 10 "j\'aime" sur ses avis',
        icon: <ThumbsUp className="text-gray-600" />,
        unlocked: userProgress.totalLikes >= 10,
        current: Math.min(userProgress.totalLikes, 10),
        target: 10,
        points: 50,
        level: 'argent',
        color: 'gray'
      },
      {
        id: 'days7',
        name: 'Semaine active',
        description: '7 jours de connexion',
        icon: <Calendar className="text-gray-600" />,
        unlocked: userProgress.daysConnected >= 7,
        current: Math.min(userProgress.daysConnected, 7),
        target: 7,
        points: 70,
        level: 'argent',
        color: 'gray'
      },
      // Or
      {
        id: 'scan75',
        name: 'Scanner expert',
        description: 'Scanner 75 produits différents',
        icon: <Scan className="text-yellow-600" />,
        unlocked: userProgress.totalScans >= 75,
        current: Math.min(userProgress.totalScans, 75),
        target: 75,
        points: 300,
        level: 'or',
        color: 'yellow'
      },
      {
        id: 'review20',
        name: 'Critique reconnu',
        description: 'Publier 20 avis vérifiés',
        icon: <Star className="text-yellow-600" />,
        unlocked: userProgress.totalReviews >= 20,
        current: Math.min(userProgress.totalReviews, 20),
        target: 20,
        points: 1000,
        level: 'or',
        color: 'yellow'
      },
      {
        id: 'first3',
        name: 'Pionnier',
        description: 'Être le premier à évaluer 3 produits',
        icon: <Trophy className="text-yellow-600" />,
        unlocked: userProgress.firstReviews >= 3,
        current: Math.min(userProgress.firstReviews, 3),
        target: 3,
        points: 450,
        level: 'or',
        color: 'yellow'
      },
      {
        id: 'likes50',
        name: 'Influenceur',
        description: 'Obtenir 50 "j\'aime" sur ses avis',
        icon: <ThumbsUp className="text-yellow-600" />,
        unlocked: userProgress.totalLikes >= 50,
        current: Math.min(userProgress.totalLikes, 50),
        target: 50,
        points: 250,
        level: 'or',
        color: 'yellow'
      },
      {
        id: 'days30',
        name: 'Habitué',
        description: '30 jours de connexion au total',
        icon: <Calendar className="text-yellow-600" />,
        unlocked: userProgress.daysConnected >= 30,
        current: Math.min(userProgress.daysConnected, 30),
        target: 30,
        points: 300,
        level: 'or',
        color: 'yellow'
      },
      // Diamant
      {
        id: 'scan200',
        name: 'Scanner légendaire',
        description: 'Scanner 200 produits différents',
        icon: <Scan className="text-blue-600" />,
        unlocked: userProgress.totalScans >= 200,
        current: Math.min(userProgress.totalScans, 200),
        target: 200,
        points: 1000,
        level: 'diamant',
        color: 'blue'
      },
      {
        id: 'review50',
        name: 'Maître critique',
        description: 'Publier 50 avis vérifiés',
        icon: <Star className="text-blue-600" />,
        unlocked: userProgress.totalReviews >= 50,
        current: Math.min(userProgress.totalReviews, 50),
        target: 50,
        points: 2500,
        level: 'diamant',
        color: 'blue'
      },
      {
        id: 'first10',
        name: 'Découvreur légendaire',
        description: 'Être le premier à évaluer 10 produits',
        icon: <Trophy className="text-blue-600" />,
        unlocked: userProgress.firstReviews >= 10,
        current: Math.min(userProgress.firstReviews, 10),
        target: 10,
        points: 1500,
        level: 'diamant',
        color: 'blue'
      },
      {
        id: 'likes200',
        name: 'Star de la communauté',
        description: 'Obtenir 200 "j\'aime" sur ses avis',
        icon: <ThumbsUp className="text-blue-600" />,
        unlocked: userProgress.totalLikes >= 200,
        current: Math.min(userProgress.totalLikes, 200),
        target: 200,
        points: 1000,
        level: 'diamant',
        color: 'blue'
      },
      {
        id: 'cat5',
        name: 'Expert polyvalent',
        description: 'Avoir des avis sur 5 catégories différentes',
        icon: <Target className="text-blue-600" />,
        unlocked: userProgress.categories >= 5,
        current: Math.min(userProgress.categories, 5),
        target: 5,
        points: 500,
        level: 'diamant',
        color: 'blue'
      },
      {
        id: 'days90',
        name: 'Vétéran Fydo',
        description: '90 jours de connexion au total',
        icon: <Calendar className="text-blue-600" />,
        unlocked: userProgress.daysConnected >= 90,
        current: Math.min(userProgress.daysConnected, 90),
        target: 90,
        points: 900,
        level: 'diamant',
        color: 'blue'
      }
    ];
    
    // Filtrer intelligemment les achievements à afficher
    const filtered = allChallenges.filter(achievement => {
      // Toujours afficher les achievements débloqués
      if (achievement.unlocked) return true;
      
      // Afficher les achievements en cours (progression > 0)
      if (achievement.current > 0) return true;
      
      // Afficher les achievements du niveau actuel ou suivant
      const levelOrder = ['bronze', 'argent', 'or', 'diamant'];
      const currentLevelIndex = levelOrder.indexOf(calculatedStatus === 'nouveau' ? 'bronze' : calculatedStatus);
      const achievementLevelIndex = levelOrder.indexOf(achievement.level);
      
      return achievementLevelIndex <= currentLevelIndex + 1;
    });
    
    // Trier par : débloqués d'abord, puis par pourcentage de progression, puis par niveau
    return filtered.sort((a, b) => {
      // Débloqués en premier
      if (a.unlocked && !b.unlocked) return -1;
      if (!a.unlocked && b.unlocked) return 1;
      
      // Ensuite par proximité du déblocage (plus proche = mieux)
      if (!a.unlocked && !b.unlocked) {
        const progressA = (a.current / a.target);
        const progressB = (b.current / b.target);
        
        // Si l'un est proche du déblocage (>70%), le prioriser
        if (progressA >= 0.7 && progressB < 0.7) return -1;
        if (progressB >= 0.7 && progressA < 0.7) return 1;
        
        // Sinon trier par progression
        if (progressA !== progressB) return progressB - progressA;
      }
      
      // Enfin par niveau (bronze avant argent, etc.)
      const levelOrder = ['bronze', 'argent', 'or', 'diamant'];
      const levelDiff = levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level);
      if (levelDiff !== 0) return levelDiff;
      
      // Et par points si tout le reste est égal
      return a.points - b.points;
    }).slice(0, 8); // Limiter à 8 pour l'affichage
  }, [userProgress, calculatedStatus]);

  // Actions suggérées intelligentes
  const getSmartSuggestions = () => {
    const suggestions = [];
    
    // Pour les nouveaux membres, suggestion spéciale
    if (calculatedStatus === 'nouveau' && userProgress?.totalScans === 0) {
      suggestions.push({
        icon: <Scan className="text-green-600" />,
        title: 'Commencez votre aventure Fydo ! 🌱',
        description: 'Scannez votre premier produit et rejoignez la communauté',
        link: '/recherche-filtre',
        reward: '+10 points',
        priority: 0
      });
    }
    
    // Suggestion basée sur le prochain objectif de scan
    else if (userProgress?.totalScans < 5) {
      suggestions.push({
        icon: <Camera className="text-blue-600" />,
        title: `Plus que ${5 - userProgress.totalScans} scans pour débloquer Bronze !`,
        description: 'Scannez des produits pour progresser',
        link: '/recherche-filtre',
        reward: '+50 points',
        priority: 1
      });
    } else if (userProgress?.totalScans < 25) {
      suggestions.push({
        icon: <Scan className="text-purple-600" />,
        title: `${25 - userProgress.totalScans} scans avant le niveau Scanner Pro`,
        description: 'Continuez votre exploration',
        link: '/recherche-filtre',
        reward: '+100 points',
        priority: 2
      });
    }
    
    // Suggestion pour les avis
    if (userProgress?.totalReviews === 0) {
      suggestions.push({
        icon: <Star className="text-amber-600" />,
        title: 'Publiez votre premier avis',
        description: 'Partagez votre expérience avec la communauté',
        link: '/historique-produits',
        reward: '+50 points',
        priority: 1
      });
    }
    
    // Suggestion pour compléter le profil
    if (!userProgress?.profileComplete) {
      suggestions.push({
        icon: <User className="text-green-600" />,
        title: 'Complétez votre profil',
        description: 'Ajoutez votre localisation pour des recommandations personnalisées',
        link: '/edit-profile',
        reward: '+20 points',
        priority: 1
      });
    }
    
    // Suggestion pour le plan premium
    if (subscriptionPlan?.name === 'Gratuit' && userProgress?.totalScans >= 3) {
      suggestions.push({
        icon: <Crown className="text-purple-600" />,
        title: 'Passez à Premium',
        description: 'Débloquez toutes les fonctionnalités',
        link: '/abonnements',
        reward: 'Accès illimité',
        priority: 3
      });
    }
    
    // Retourner les 3 suggestions les plus prioritaires
    return suggestions.sort((a, b) => a.priority - b.priority).slice(0, 3);
  };

  // Message motivationnel basé sur l'activité récente
  const getPersonalizedMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
    
    if (userProgress?.totalScans === 0 && calculatedStatus === 'nouveau') {
      return `${greeting} ${currentUser.displayName || 'Nouvelle pousse'} ! Prêt à faire germer votre première découverte ? 🌱`;
    } else if (calculatedStatus === 'diamant') {
      return `${greeting} Maître ${currentUser.displayName} ! Vous êtes une légende vivante de Fydo 👑`;
    } else if (nextStatusInfo?.remainingChallenges === 1) {
      return `${greeting} ${currentUser.displayName} ! Plus qu'un challenge pour atteindre ${nextStatusInfo.nextStatus} ! 🎯`;
    } else {
      const messages = [
        `${greeting} ${currentUser.displayName} ! Votre progression est impressionnante 🌟`,
        `${greeting} ${currentUser.displayName} ! La communauté compte sur vous 💪`,
        `${greeting} ${currentUser.displayName} ! Continuez votre belle aventure Fydo 🚀`
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
  };

  // Fonction pour obtenir le drapeau emoji d'un pays
  const getCountryFlag = (countryCode) => {
    const flags = {
      'FR': '🇫🇷', 'BE': '🇧🇪', 'CH': '🇨🇭', 'CA': '🇨🇦', 'LU': '🇱🇺',
      'DE': '🇩🇪', 'IT': '🇮🇹', 'ES': '🇪🇸', 'PT': '🇵🇹', 'NL': '🇳🇱',
      'GB': '🇬🇧', 'US': '🇺🇸', 'MA': '🇲🇦', 'DZ': '🇩🇿', 'TN': '🇹🇳',
      'SN': '🇸🇳', 'CI': '🇨🇮', 'CM': '🇨🇲'
    };
    return flags[countryCode] || '🌍';
  };

  if (!currentUser || !userDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center pt-20">
        <div className="text-center">
          <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <p className="text-green-700 font-medium">Connectez-vous pour voir votre profil</p>
        </div>
      </div>
    );
  }

  return (
    <ProfileLayout 
      title=""
      onLogout={handleLogout}
      logoutLoading={loading}
    >
      <Helmet>
        <title>Mon Profil Dynamique | Fydo</title>
        <meta name="description" content="Votre tableau de bord personnel Fydo - Suivez votre progression en temps réel" />
      </Helmet>

      {/* Confetti animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="confetti" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'][Math.floor(Math.random() * 5)]
              }}></div>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section Ultra Dynamique */}
      <div className={`relative mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Background avec gradient animé selon le statut */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentStatusConfig.gradient} rounded-3xl opacity-90`}></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-3xl animate-gradient"></div>
        
        {/* Particules flottantes */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 0.5}s`
            }}></div>
          ))}
        </div>
        
        {/* Contenu */}
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar avec statut dynamique */}
            <div className="relative group">
              <div className="relative">
                <UserAvatar 
                  userId={userDetails?.firebase_uid || currentUser?.uid}
                  size={120}
                  status={calculatedStatus}
                  displayName={currentUser?.displayName || currentUser?.email}
                  customAvatarUrl={userDetails?.avatarUrl}
                  avatarSeed={userDetails?.avatarSeed}
                  className={`shadow-2xl ring-4 ring-white/50 ${currentStatusConfig.glow} shadow-2xl`}
                  showBorder={true}
                />
                {/* Badge de statut animé */}
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-3 shadow-lg animate-bounce-in">
                  <span className="text-3xl">{currentStatusConfig.icon}</span>
                </div>
                {/* Points flottants */}
                <div className="absolute -top-4 -right-4 bg-white rounded-full px-3 py-1 shadow-lg animate-float">
                  <span className="text-sm font-bold text-gray-800">{animatedNumbers.points ?? totalPoints ?? 0} pts</span>
                </div>
              </div>
              
              {/* Bouton de changement d'avatar */}
              <Link to="/edit-profile" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
              </Link>
            </div>
            
            {/* Informations et progression */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 animate-fade-in">
                {getPersonalizedMessage()}
              </h1>
              
              {/* Statut actuel avec progression vers le suivant */}
              <div className="mb-6">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm text-white animate-pulse-slow`}>
                    {currentStatusConfig.icon} Statut {currentStatusConfig.name}
                  </span>
                  {nextStatusInfo.nextStatus && (
                    <>
                      <ArrowRight className="text-white/60" size={20} />
                      <span className="text-white/80 font-medium">
                        Prochain: {statusConfig[nextStatusInfo.nextStatus]?.icon} {statusConfig[nextStatusInfo.nextStatus]?.name}
                      </span>
                    </>
                  )}
                </div>
                
                {/* Barre de progression vers le prochain statut */}
                {nextStatusInfo.nextStatus && (
                  <div className="bg-white/20 rounded-full p-1 max-w-md mx-auto md:mx-0">
                    <div className="bg-white rounded-full h-8 relative overflow-hidden">
                      <div 
                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${statusConfig[nextStatusInfo.nextStatus].gradient} transition-all duration-1000`}
                        style={{ width: `${nextStatusInfo.progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
                      </div>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800">
                        {nextStatusInfo.progress}% vers {statusConfig[nextStatusInfo.nextStatus].name}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Stats en temps réel avec animations */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: <Activity />, value: animatedNumbers.scans ?? userProgress?.totalScans ?? 0, label: 'Scans', color: 'blue' },
                  { icon: <Star />, value: animatedNumbers.reviews ?? userProgress?.totalReviews ?? 0, label: 'Avis', color: 'amber' },
                  { icon: <Heart />, value: animatedNumbers.favorites ?? userProgress?.totalFavorites ?? 0, label: 'Favoris', color: 'pink' },
                  { icon: <Flame />, value: animatedNumbers.days ?? userProgress?.daysConnected ?? 0, label: 'Jours actifs', color: 'orange' }
                ].map((stat, index) => (
                  <div 
                    key={stat.label}
                    className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 transform hover:scale-105 transition-all cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {React.cloneElement(stat.icon, { className: 'text-white', size: 20 })}
                      <div className="text-left">
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-white/80">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques détaillées avec visualisation avancée */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {getDetailedStats().map((stat, index) => (
          <div
            key={stat.id}
            className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer ${
              selectedStat === stat.id ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={() => setSelectedStat(selectedStat === stat.id ? null : stat.id)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform`}>
                  {React.cloneElement(stat.icon, { size: 24 })}
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
              <span className="text-xs text-green-600 font-medium flex items-center bg-green-100 px-2 py-1 rounded-full">
                <TrendingUp size={12} className="mr-1" />
                {stat.trend}
              </span>
            </div>
            
            {/* Barre de progression vers les objectifs */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 mb-2">{stat.description}</p>
              <div className="flex items-center gap-2">
                {stat.progress.targets.map((target, i) => {
                  const reached = stat.progress.current >= target;
                  const isNext = !reached && (i === 0 || stat.progress.current >= stat.progress.targets[i - 1]);
                  
                  return (
                    <div key={target} className="flex-1 relative">
                      <div className={`h-2 rounded-full transition-all duration-500 ${
                        reached ? `bg-${stat.color}-500` : isNext ? `bg-${stat.color}-200` : 'bg-gray-200'
                      }`}>
                        {isNext && (
                          <div 
                            className={`h-full bg-${stat.color}-500 rounded-full transition-all duration-1000`}
                            style={{ width: `${(stat.progress.current / target) * 100}%` }}
                          />
                        )}
                      </div>
                      <span className={`text-xs ${reached ? `text-${stat.color}-600 font-bold` : 'text-gray-400'} mt-1 block text-center`}>
                        {target}
                      </span>
                      {reached && (
                        <CheckCircle2 className={`absolute -top-1 left-1/2 transform -translate-x-1/2 text-${stat.color}-500`} size={12} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Détails supplémentaires au clic */}
            {selectedStat === stat.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
                <p className="text-sm text-gray-600">
                  {stat.progress.current >= stat.progress.targets[0] 
                    ? `Bravo ! Prochain objectif : ${stat.progress.targets.find(t => t > stat.progress.current) || 'Maître'} ${stat.progress.unit}`
                    : `Plus que ${stat.progress.targets[0] - stat.progress.current} pour débloquer votre premier badge !`
                  }
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Section Achievements avec design gaming et couleurs dynamiques */}
      <div className={`bg-white rounded-3xl shadow-lg p-6 mb-8 transition-all duration-700 delay-300 border border-gray-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Trophy className="text-amber-500 mr-3" size={28} />
            Collection de Trophées
          </h2>
          <Link to="/challenges" className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center group">
            Voir tous les challenges
            <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {getDynamicAchievements.map((achievement, index) => {
            const colorMap = {
              amber: {
                bg: 'from-amber-100 to-amber-200',
                border: 'border-amber-300',
                text: 'text-amber-700',
                badge: 'from-amber-500 to-amber-600'
              },
              gray: {
                bg: 'from-gray-100 to-gray-200',
                border: 'border-gray-300',
                text: 'text-gray-700',
                badge: 'from-gray-500 to-gray-600'
              },
              yellow: {
                bg: 'from-yellow-100 to-yellow-200',
                border: 'border-yellow-300',
                text: 'text-yellow-700',
                badge: 'from-yellow-500 to-yellow-600'
              },
              blue: {
                bg: 'from-blue-100 to-blue-200',
                border: 'border-blue-300',
                text: 'text-blue-700',
                badge: 'from-blue-500 to-blue-600'
              }
            };
            
            const colors = colorMap[achievement.color] || colorMap.amber;
            
            return (
              <div
                key={achievement.id}
                className={`relative p-4 rounded-2xl border-2 transition-all duration-500 ${
                  achievement.unlocked 
                    ? `bg-white ${colors.border} shadow-lg hover:shadow-xl transform hover:scale-105` 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredAchievement(achievement.id)}
                onMouseLeave={() => setHoveredAchievement(null)}
              >
                {/* Badge "Bientôt" si proche du déblocage */}
                {!achievement.unlocked && achievement.current > 0 && (achievement.current / achievement.target) >= 0.7 && (
                  <div className="absolute -top-2 -left-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                    Bientôt !
                  </div>
                )}
                
                {achievement.unlocked && (
                  <div className={`absolute -top-2 -right-2 bg-gradient-to-r ${colors.badge} rounded-full p-1.5 animate-bounce-in`}>
                    <CheckCircle2 className="text-white" size={16} />
                  </div>
                )}
                
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 ${
                    achievement.unlocked 
                      ? `bg-gradient-to-br ${colors.bg} transform hover:rotate-12` 
                      : 'bg-gray-200'
                  }`}>
                    {React.cloneElement(achievement.icon, { 
                      size: 28, 
                      className: achievement.unlocked ? achievement.icon.props.className : 'text-gray-400' 
                    })}
                  </div>
                  <h3 className="font-bold text-sm text-gray-800">{achievement.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                  
                  {/* Badge du niveau */}
                  <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${
                    achievement.level === 'bronze' ? 'bg-amber-100 text-amber-700' :
                    achievement.level === 'argent' ? 'bg-gray-100 text-gray-700' :
                    achievement.level === 'or' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {achievement.level === 'bronze' ? '🥉' :
                     achievement.level === 'argent' ? '🥈' :
                     achievement.level === 'or' ? '🥇' : '💎'} {achievement.level.charAt(0).toUpperCase() + achievement.level.slice(1)}
                  </div>
                  
                  {/* Progression si pas encore débloqué */}
                  {!achievement.unlocked && (
                    <div className="w-full mt-2">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${colors.badge} rounded-full transition-all duration-1000`}
                          style={{ width: `${(achievement.current / achievement.target) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{achievement.current}/{achievement.target}</p>
                    </div>
                  )}
                  
                  {achievement.unlocked && (
                    <span className={`text-xs ${colors.text} font-bold mt-2`}>+{achievement.points} pts</span>
                  )}
                </div>
                
                {!achievement.unlocked && achievement.current === 0 && (
                  <div className="absolute inset-0 bg-white/90 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                {hoveredAchievement === achievement.id && achievement.unlocked && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className={`sparkle sparkle-1 ${colors.text}`}></div>
                    <div className={`sparkle sparkle-2 ${colors.text}`}></div>
                    <div className={`sparkle sparkle-3 ${colors.text}`}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Barre de progression globale des achievements */}
        <div className="mt-6 bg-white rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progression globale</span>
            <span className="text-sm font-bold text-green-600">
              {getDynamicAchievements.filter(a => a.unlocked).length} trophées débloqués
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 relative"
              style={{ 
                width: `${Math.min((getDynamicAchievements.filter(a => a.unlocked).length / 8) * 100, 100)}%` 
              }}
            >
              <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
            </div>
          </div>
          
          {/* Message motivationnel si proche du prochain déverrouillage */}
          {(() => {
            const nextToUnlock = getDynamicAchievements
              .filter(a => !a.unlocked && a.current > 0)
              .sort((a, b) => (b.current / b.target) - (a.current / a.target))[0];
            
            if (nextToUnlock && (nextToUnlock.current / nextToUnlock.target) >= 0.5) {
              const remaining = nextToUnlock.target - nextToUnlock.current;
              return (
                <p className="text-center text-sm text-gray-600 mt-3">
                  🎯 Plus que <span className="font-bold text-green-600">{remaining}</span> pour débloquer "{nextToUnlock.name}" !
                </p>
              );
            }
            return null;
          })()}
        </div>
        
        {/* Informations supplémentaires sur les trophées */}
        <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <span className="text-lg">🌱</span>
            <span>Nouveau</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg">🥉</span>
            <span>Bronze</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg">🥈</span>
            <span>Argent</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg">🥇</span>
            <span>Or</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg">💎</span>
            <span>Diamant</span>
          </div>
        </div>
      </div>

      {/* Actions suggérées ultra personnalisées */}
      {getSmartSuggestions().length > 0 && (
        <div className={`bg-gradient-to-r from-green-50 to-green-100 rounded-3xl p-6 mb-8 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Target className="text-green-600 mr-3 animate-pulse" />
            Vos prochains objectifs
          </h3>
          <div className="space-y-3">
            {getSmartSuggestions().map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="block bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-1">{action.title}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center text-sm text-green-600 font-bold bg-green-100 px-3 py-1 rounded-full">
                      <Gift size={14} className="mr-1" />
                      {action.reward}
                    </span>
                    <ChevronRight className="text-gray-400 group-hover:text-green-600 transition-colors mt-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Section Abonnement avec design premium animé */}
      <div className={`relative overflow-hidden rounded-3xl mb-8 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className={`p-8 ${
          subscriptionPlan?.name === 'Premium' 
            ? 'bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800' 
            : subscriptionPlan?.name === 'Essential'
              ? 'bg-gradient-to-br from-green-600 via-green-700 to-green-800'
              : 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800'
        }`}>
          {/* Motif animé de fond */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full transform translate-x-48 -translate-y-48 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full transform -translate-x-32 translate-y-32 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center mb-3">
                  {subscriptionPlan?.name === 'Premium' ? (
                    <Crown className="text-yellow-300 mr-3 animate-float" size={40} />
                  ) : subscriptionPlan?.name === 'Essential' ? (
                    <Zap className="text-green-300 mr-3 animate-pulse" size={40} />
                  ) : (
                    <Heart className="text-gray-300 mr-3" size={40} />
                  )}
                  <div>
                    <h3 className="text-3xl font-bold text-white">
                      Plan {subscriptionPlan?.name || 'Gratuit'}
                    </h3>
                    {subscription && (
                      <p className="text-sm text-white/80 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          subscription.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                          {subscription.is_active ? '● Actif' : '● Inactif'}
                        </span>
                        <span className="ml-2">Expire le {new Date(subscription.end_date).toLocaleDateString('fr-FR')}</span>
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Avantages avec icônes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                  {subscriptionPlan?.name === 'Premium' ? (
                    <>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-white flex items-center gap-2">
                        <Scan size={20} />
                        <span className="text-sm font-medium">Scans illimités</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-white flex items-center gap-2">
                        <Rocket size={20} />
                        <span className="text-sm font-medium">Accès prioritaire</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-white flex items-center gap-2">
                        <Diamond size={20} />
                        <span className="text-sm font-medium">Badges exclusifs</span>
                      </div>
                    </>
                  ) : subscriptionPlan?.name === 'Essential' ? (
                    <>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-white flex items-center gap-2">
                        <Scan size={20} />
                        <span className="text-sm font-medium">50 scans/jour</span>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-white flex items-center gap-2">
                        <BarChart3 size={20} />
                        <span className="text-sm font-medium">Statistiques détaillées</span>
                      </div>
                    </>
                  ) : (
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-white flex items-center gap-2">
                      <Gift size={20} />
                      <span className="text-sm font-medium">3 scans gratuits/jour</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <Link
              to="/abonnements"
              className={`inline-flex items-center px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 group ${
                subscriptionPlan?.name === 'Gratuit'
                  ? 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white shadow-xl'
                  : 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white/30'
              }`}
            >
              {subscriptionPlan?.name === 'Gratuit' ? (
                <>
                  <Rocket className="mr-2 group-hover:rotate-12 transition-transform" />
                  Découvrir les plans Premium
                </>
              ) : (
                <>
                  <Settings className="mr-2 group-hover:rotate-180 transition-transform" />
                  Gérer mon abonnement
                </>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Actions rapides gamifiées */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {[
          { 
            icon: <Camera className="text-blue-600" />, 
            label: 'Scanner', 
            link: '/recherche-filtre',
            color: 'blue',
            reward: '+10 pts'
          },
          { 
            icon: <Trophy className="text-amber-600" />, 
            label: 'Challenges', 
            link: '/challenges',
            color: 'amber',
            badge: 'NEW'
          },
          { 
            icon: <Heart className="text-pink-600" />, 
            label: 'Favoris', 
            link: '/mes-favoris',
            color: 'pink',
            count: userProgress?.totalFavorites || 0
          },
          { 
            icon: <Share2 className="text-green-600" />, 
            label: 'Inviter', 
            link: '#',
            color: 'green',
            reward: '+50 pts'
          }
        ].map((action, index) => (
          <Link
            key={action.label}
            to={action.link}
            className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group relative overflow-hidden`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-${action.color}-50 to-${action.color}-100 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            
            <div className="relative">
              <div className={`w-14 h-14 bg-${action.color}-100 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                {React.cloneElement(action.icon, { size: 28 })}
              </div>
              <p className="font-bold text-gray-800">{action.label}</p>
              
              {action.badge && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  {action.badge}
                </span>
              )}
              
              {action.reward && (
                <span className="text-xs text-green-600 font-medium mt-1 block">
                  {action.reward}
                </span>
              )}
              
              {action.count !== undefined && (
                <span className="text-xs text-gray-600 mt-1 block">
                  {action.count} sauvegardés
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Styles pour animations */}
      <style jsx>{`
        @keyframes gradient {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes bounce-in {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-gradient {
          animation: gradient 3s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        /* Particules */
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: particle-float 10s linear infinite;
        }
        
        @keyframes particle-float {
          0% {
            transform: translateY(100px) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(30px);
            opacity: 0;
          }
        }
        
        /* Sparkles dynamiques selon la couleur */
        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          animation: sparkle 1.5s ease-out forwards;
        }
        
        .sparkle-1 { 
          background: currentColor;
          top: 20%; 
          left: 20%; 
          animation-delay: 0s; 
        }
        .sparkle-2 { 
          background: currentColor;
          top: 50%; 
          left: 70%; 
          animation-delay: 0.2s; 
        }
        .sparkle-3 { 
          background: currentColor;
          bottom: 30%; 
          right: 20%; 
          animation-delay: 0.4s; 
        }
        
        @keyframes sparkle {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
          }
        }
        
        /* Confetti */
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: confetti-fall 3s linear infinite;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </ProfileLayout>
  );
};

export default UserProfile;