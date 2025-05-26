// src/pages/ChallengesPage.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Trophy, 
  Star, 
  Heart,
  Scan,
  Award, 
  Crown,
  Sparkles,
  Lock,
  Zap,
  ChevronRight,
  Users,
  TrendingUp,
  Target,
  Gift,
  Loader,
  CheckCircle,
  Camera,
  MessageSquare,
  ThumbsUp,
  Calendar,
  Shield,
  Diamond,
  Rocket,
  Medal
} from 'lucide-react';
import challengeService from '../services/challengeService';

const ChallengesPage = () => {
  const { currentUser, userDetails } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredChallenge, setHoveredChallenge] = useState(null);

  // Données utilisateur
  const [userProgress, setUserProgress] = useState({
    currentStatus: 'bronze',
    currentPoints: 0,
    totalScans: 0,
    totalReviews: 0,
    totalFavorites: 0,
    totalLikes: 0,
    firstReviews: 0,
    categories: 0,
    daysConnected: 0,
    profileComplete: false
  });

  // Configuration des statuts avec leurs challenges
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
      challenges: [
        { id: 'scan5', label: 'Scanner 5 produits différents', current: Math.min(userProgress.totalScans, 5), target: 5, icon: <Scan size={16} />, points: 50 },
        { id: 'review1', label: 'Publier 1 avis vérifié', current: Math.min(userProgress.totalReviews, 1), target: 1, icon: <Star size={16} />, points: 50 },
        { id: 'fav3', label: 'Ajouter 3 produits en favoris', current: Math.min(userProgress.totalFavorites, 3), target: 3, icon: <Heart size={16} />, points: 15 },
        { id: 'profile', label: 'Compléter son profil à 100%', current: userProgress.profileComplete ? 1 : 0, target: 1, icon: <Users size={16} />, points: 20 }
      ],
      rewards: [
        'Badge Bronze visible sur le profil',
        'Statut "Membre actif"'
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
      challenges: [
        { id: 'scan25', label: 'Scanner 25 produits différents', current: Math.min(userProgress.totalScans, 25), target: 25, icon: <Scan size={16} />, points: 100 },
        { id: 'review5', label: 'Publier 5 avis vérifiés', current: Math.min(userProgress.totalReviews, 5), target: 5, icon: <Star size={16} />, points: 250 },
        { id: 'likes10', label: 'Obtenir 10 "j\'aime" sur ses avis', current: Math.min(userProgress.totalLikes, 10), target: 10, icon: <ThumbsUp size={16} />, points: 50 },
        { id: 'days7', label: '7 jours de connexion', current: Math.min(userProgress.daysConnected, 7), target: 7, icon: <Calendar size={16} />, points: 70 }
      ],
      rewards: [
        'Badge Argent animé sur le profil',
        'Mention "Contributeur vérifié" sur les avis',
        'Apparition dans le top contributeurs'
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
      challenges: [
        { id: 'scan75', label: 'Scanner 75 produits différents', current: Math.min(userProgress.totalScans, 75), target: 75, icon: <Scan size={16} />, points: 300 },
        { id: 'review20', label: 'Publier 20 avis vérifiés', current: Math.min(userProgress.totalReviews, 20), target: 20, icon: <Star size={16} />, points: 1000 },
        { id: 'first3', label: 'Être le premier à évaluer 3 produits', current: Math.min(userProgress.firstReviews, 3), target: 3, icon: <Trophy size={16} />, points: 450 },
        { id: 'likes50', label: 'Obtenir 50 "j\'aime" sur ses avis', current: Math.min(userProgress.totalLikes, 50), target: 50, icon: <ThumbsUp size={16} />, points: 250 },
        { id: 'days30', label: '30 jours de connexion au total', current: Math.min(userProgress.daysConnected, 30), target: 30, icon: <Calendar size={16} />, points: 300 }
      ],
      rewards: [
        'Badge Or brillant sur le profil',
        'Mention "Expert Fydo" sur les avis',
        'Mise en avant dans la communauté',
        'Avis prioritaires dans l\'affichage'
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
      challenges: [
        { id: 'scan200', label: 'Scanner 200 produits différents', current: Math.min(userProgress.totalScans, 200), target: 200, icon: <Scan size={16} />, points: 1000 },
        { id: 'review50', label: 'Publier 50 avis vérifiés', current: Math.min(userProgress.totalReviews, 50), target: 50, icon: <Star size={16} />, points: 2500 },
        { id: 'first10', label: 'Être le premier à évaluer 10 produits', current: Math.min(userProgress.firstReviews, 10), target: 10, icon: <Trophy size={16} />, points: 1500 },
        { id: 'likes200', label: 'Obtenir 200 "j\'aime" sur ses avis', current: Math.min(userProgress.totalLikes, 200), target: 200, icon: <ThumbsUp size={16} />, points: 1000 },
        { id: 'cat5', label: 'Avoir des avis sur 5 catégories différentes', current: Math.min(userProgress.categories, 5), target: 5, icon: <Target size={16} />, points: 500 },
        { id: 'days90', label: '90 jours de connexion au total', current: Math.min(userProgress.daysConnected, 90), target: 90, icon: <Calendar size={16} />, points: 900 }
      ],
      rewards: [
        'Badge Diamant avec effets spéciaux',
        'Titre "Ambassadeur Fydo"',
        'Profil mis en avant',
        'Badge exclusif sur tous les avis',
        'Mention dans la section "Merci"'
      ]
    }
  ];

  // Calculer le statut actuel de l'utilisateur
  const getCurrentStatusIndex = () => {
    const statusMap = { 'bronze': 0, 'argent': 1, 'or': 2, 'diamant': 3 };
    return statusMap[userProgress.currentStatus] || 0;
  };

  // Déclencher l'animation de visibilité
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Effet de chargement
  useEffect(() => {
    const loadUserProgress = async () => {
      if (!userDetails?.id) return;
      
      setLoading(true);
      try {
        // Charger la progression de l'utilisateur
        const { success, data, error } = await challengeService.getUserProgress(userDetails.id);
        
        if (success && data) {
          setUserProgress({
            currentStatus: data.currentStatus || 'bronze',
            currentPoints: data.totalPointsEarned || 0,
            totalScans: data.totalScans || 0,
            totalReviews: data.totalReviews || 0,
            totalFavorites: data.totalFavorites || 0,
            totalLikes: data.totalLikes || 0,
            firstReviews: data.firstReviews || 0,
            categories: data.categories || 0,
            daysConnected: data.daysConnected || 0,
            profileComplete: data.profileComplete || false
          });
        } else if (error) {
          console.error("Erreur lors du chargement de la progression:", error);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserProgress();
  }, [userDetails?.id]);

  // Animer les barres de progression après le chargement
  useEffect(() => {
    if (!loading) {
      setActiveStatus(getCurrentStatusIndex());
      
      // Animer les barres de progression
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
    }
  }, [loading, userProgress]);

  // Récupérer les statuts
  const statusLevels = getStatusLevels();

  // Calculer la progression globale d'un statut
  const calculateStatusProgress = (challenges) => {
    const completed = challenges.filter(c => c.current >= c.target).length;
    return (completed / challenges.length) * 100;
  };

  // Calculer les points totaux possibles pour un statut
  const calculateTotalPoints = (challenges) => {
    return challenges.reduce((sum, c) => sum + c.points, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center pt-20">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4" />
          <p className="text-green-700 font-medium">Chargement de vos challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-white min-h-screen">
      <Helmet>
        <title>Challenges & Statuts | Fydo</title>
        <meta name="description" content="Progressez dans les niveaux Fydo et débloquez des statuts exclusifs en partageant vos avis produits." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-green-600">
              <li><Link to="/" className="hover:text-green-800 transition-colors">Accueil</Link></li>
              <li><ChevronRight size={16} /></li>
              <li className="text-green-800 font-medium">Challenges & Statuts</li>
            </ol>
          </nav>

          {/* Header Section avec animation */}
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
              Progressez et devenez un <span className="text-green-600 relative inline-block">
                Expert Fydo
                <svg className="absolute w-full" style={{ bottom: '-0.1em', left: '0', height: '10px' }} viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 8 Q30 4 60 3 T100 3" stroke="#16a34a" strokeWidth="4" fill="none" vectorEffect="non-scaling-stroke" className="animate-draw-line" />
                </svg>
              </span>
            </h1>
            <p className="text-xl text-green-700 max-w-3xl mx-auto">
              Relevez des défis, gagnez des points et débloquez des statuts exclusifs dans la communauté
            </p>
            
            {/* Trust indicators avec animations */}
            <div className="flex items-center justify-center space-x-8 opacity-80 mt-8">
              <span className="text-sm text-green-700 flex items-center group">
                <Trophy size={16} className="mr-1 group-hover:scale-110 transition-transform text-amber-500" />
                Challenges motivants
              </span>
              <span className="text-sm text-green-700 flex items-center group">
                <Medal size={16} className="mr-1 group-hover:scale-110 transition-transform text-green-600" />
                Badges exclusifs
              </span>
              <span className="text-sm text-green-700 flex items-center group">
                <Rocket size={16} className="mr-1 group-hover:scale-110 transition-transform text-blue-500" />
                Progression visible
              </span>
            </div>
          </div>

          {/* Carte du profil utilisateur avec animations */}
          <div className={`bg-white rounded-2xl shadow-xl p-8 mb-8 transform transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar et statut */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  {userDetails?.display_name?.charAt(0).toUpperCase() || 'F'}
                </div>
                {/* Badge de statut avec animation */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-2xl animate-bounce-in">
                  {statusLevels[getCurrentStatusIndex()].icon}
                </div>
                {/* Effet de brillance */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform group-hover:rotate-180 transition-all duration-500"></div>
              </div>

              {/* Informations utilisateur */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {userDetails?.display_name || currentUser?.displayName || 'Utilisateur'}
                </h2>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${statusLevels[getCurrentStatusIndex()].gradient} text-white animate-pulse-slow`}>
                    {statusLevels[getCurrentStatusIndex()].name}
                  </span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-600 font-medium">{userProgress.currentPoints} points</span>
                </div>

                {/* Stats rapides avec animations au hover */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 rounded-lg p-3 text-center transform hover:scale-105 transition-all duration-300 cursor-pointer group">
                    <Scan className="w-6 h-6 text-green-600 mx-auto mb-1 group-hover:animate-spin-slow" />
                    <p className="text-2xl font-bold text-green-800">{userProgress.totalScans}</p>
                    <p className="text-xs text-green-600">Scans</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3 text-center transform hover:scale-105 transition-all duration-300 cursor-pointer group">
                    <Star className="w-6 h-6 text-amber-600 mx-auto mb-1 group-hover:animate-pulse" />
                    <p className="text-2xl font-bold text-amber-800">{userProgress.totalReviews}</p>
                    <p className="text-xs text-amber-600">Avis</p>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-3 text-center transform hover:scale-105 transition-all duration-300 cursor-pointer group">
                    <Heart className="w-6 h-6 text-pink-600 mx-auto mb-1 group-hover:animate-heartbeat" />
                    <p className="text-2xl font-bold text-pink-800">{userProgress.totalFavorites}</p>
                    <p className="text-xs text-pink-600">Favoris</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center transform hover:scale-105 transition-all duration-300 cursor-pointer group">
                    <ThumbsUp className="w-6 h-6 text-blue-600 mx-auto mb-1 group-hover:animate-bounce" />
                    <p className="text-2xl font-bold text-blue-800">{userProgress.totalLikes}</p>
                    <p className="text-xs text-blue-600">J'aime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation des statuts avec animations */}
          <div className={`flex flex-wrap justify-center gap-4 mb-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {statusLevels.map((status, index) => {
              const isActive = activeStatus === index;
              const isUnlocked = index <= getCurrentStatusIndex();
              const progress = calculateStatusProgress(status.challenges);

              return (
                <button
                  key={status.name}
                  onClick={() => setActiveStatus(index)}
                  disabled={!isUnlocked && index > getCurrentStatusIndex() + 1}
                  className={`relative group transition-all duration-300 ${
                    isActive ? 'scale-110' : 'hover:scale-105'
                  } ${!isUnlocked && index > getCurrentStatusIndex() + 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Carte du statut avec effet de hover */}
                  <div className={`relative bg-white rounded-xl p-6 shadow-lg border-2 transition-all duration-300 ${
                    isActive ? `${status.borderColor} shadow-2xl transform -translate-y-1` : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    {/* Effet de brillance au hover */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform group-hover:translate-x-full transition-all duration-700"></div>
                    
                    {/* Badge du statut avec animation */}
                    <div className={`text-5xl mb-2 transform transition-transform duration-300 ${isActive ? 'animate-wiggle' : 'group-hover:scale-110'}`}>
                      {status.icon}
                    </div>
                    <h3 className={`font-bold ${isActive ? 'text-gray-800' : 'text-gray-600'}`}>
                      {status.name}
                    </h3>
                    
                    {/* Barre de progression circulaire */}
                    <div className="mt-3">
                      <svg className="w-16 h-16 mx-auto transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                          className="transition-all duration-1000"
                        />
                        <defs>
                          <linearGradient id="gradient">
                            <stop offset="0%" className={`${
                              status.color === 'amber' ? 'text-amber-400' :
                              status.color === 'gray' ? 'text-gray-400' :
                              status.color === 'yellow' ? 'text-yellow-400' :
                              'text-blue-400'
                            }`} />
                            <stop offset="100%" className={`${
                              status.color === 'amber' ? 'text-amber-600' :
                              status.color === 'gray' ? 'text-gray-600' :
                              status.color === 'yellow' ? 'text-yellow-600' :
                              'text-blue-600'
                            }`} />
                          </linearGradient>
                        </defs>
                      </svg>
                      <p className="text-xs text-gray-600 mt-2">{Math.round(progress)}%</p>
                    </div>

                    {/* Verrou pour les statuts non débloqués */}
                    {!isUnlocked && index > getCurrentStatusIndex() + 1 && (
                      <div className="absolute inset-0 bg-white bg-opacity-90 rounded-xl flex items-center justify-center">
                        <Lock className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Indicateur actif avec animation */}
                  {isActive && (
                    <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r ${status.gradient} rounded-full animate-pulse`}></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Contenu du statut sélectionné avec animations */}
          <div className={`grid lg:grid-cols-3 gap-8 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Challenges */}
            <div className="lg:col-span-2">
              <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border-2 ${statusLevels[activeStatus].borderColor} transform transition-all duration-500 hover:shadow-2xl`}>
                {/* Header avec effet de particules */}
                <div className={`bg-gradient-to-r ${statusLevels[activeStatus].gradient} p-6 text-white relative overflow-hidden`}>
                  {/* Particules animées */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="particle particle-1"></div>
                    <div className="particle particle-2"></div>
                    <div className="particle particle-3"></div>
                    <div className="particle particle-4"></div>
                  </div>
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <h3 className="text-2xl font-bold flex items-center gap-3">
                        <span className="text-3xl animate-float">{statusLevels[activeStatus].icon}</span>
                        Statut {statusLevels[activeStatus].name}
                      </h3>
                      <p className="text-white/80 mt-1">{statusLevels[activeStatus].description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold animate-count-up">{calculateTotalPoints(statusLevels[activeStatus].challenges)}</p>
                      <p className="text-sm text-white/80">points à gagner</p>
                    </div>
                  </div>
                </div>

                {/* Liste des challenges avec animations */}
                <div className="p-6 space-y-4">
                  {statusLevels[activeStatus].challenges.map((challenge, index) => {
                    const isCompleted = challenge.current >= challenge.target;
                    const progressKey = `${activeStatus}-${index}`;
                    const progress = animatedProgress[progressKey] || 0;

                    return (
                      <div
                        key={challenge.id}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                          isCompleted 
                            ? 'bg-green-50 border-green-300' 
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        } ${hoveredChallenge === challenge.id ? 'ring-2 ring-green-400' : ''}`}
                        onMouseEnter={() => setHoveredChallenge(challenge.id)}
                        onMouseLeave={() => setHoveredChallenge(null)}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start gap-4">
                          {/* Icône du challenge avec animation */}
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transform transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-green-500 text-white scale-110 animate-success-bounce' 
                              : `bg-gradient-to-br ${statusLevels[activeStatus].bgGradient} hover:scale-110`
                          }`}>
                            {isCompleted ? <CheckCircle size={20} className="animate-check-draw" /> : challenge.icon}
                          </div>

                          {/* Contenu du challenge */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className={`font-medium ${isCompleted ? 'text-green-700' : 'text-gray-800'}`}>
                                {challenge.label}
                              </h4>
                              <span className={`text-sm font-bold px-3 py-1 rounded-full transform transition-all duration-300 ${
                                isCompleted 
                                  ? 'bg-green-100 text-green-700 scale-110' 
                                  : 'bg-gray-100 text-gray-600 hover:scale-105'
                              }`}>
                                +{challenge.points} pts
                              </span>
                            </div>

                            {/* Barre de progression avec animation */}
                            <div className="relative">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span className="font-medium">{challenge.current} / {challenge.target}</span>
                                <span className={`font-bold ${progress >= 100 ? 'text-green-600' : ''}`}>{Math.round(progress)}%</span>
                              </div>
                              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                                    isCompleted 
                                      ? 'bg-green-500' 
                                      : `bg-gradient-to-r ${statusLevels[activeStatus].gradient}`
                                  }`}
                                  style={{ width: `${progress}%` }}
                                >
                                  {/* Effet de brillance sur la barre */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Badge de complétion avec animation */}
                        {isCompleted && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-bounce-in flex items-center gap-1">
                            <CheckCircle size={12} />
                            Terminé
                          </div>
                        )}

                        {/* Effet de particules au hover */}
                        {hoveredChallenge === challenge.id && !isCompleted && (
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="sparkle sparkle-1"></div>
                            <div className="sparkle sparkle-2"></div>
                            <div className="sparkle sparkle-3"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Footer avec progression globale */}
                <div className={`bg-gradient-to-r ${statusLevels[activeStatus].bgGradient} p-4`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Progression globale</p>
                    <p className="text-lg font-bold text-gray-800 animate-count">
                      {statusLevels[activeStatus].challenges.filter(c => c.current >= c.target).length} / {statusLevels[activeStatus].challenges.length} challenges
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Récompenses et informations avec animations */}
            <div className="space-y-6">
              {/* Récompenses du statut */}
              <div className="bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Gift className="text-amber-500 animate-bounce" />
                  Récompenses
                </h3>
                <div className="space-y-3">
                  {statusLevels[activeStatus].rewards.map((reward, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 transform transition-all duration-300 hover:translate-x-2"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 animate-pulse-slow">
                        <Sparkles size={12} className="text-amber-600" />
                      </div>
                      <p className="text-gray-700 text-sm">{reward}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teasing futur avec animation */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
                {/* Effet de vague animée */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="wave wave-1"></div>
                  <div className="wave wave-2"></div>
                  <div className="wave wave-3"></div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <Zap className="animate-pulse" />
                    Bientôt disponible !
                  </h3>
                  <p className="text-purple-100 text-sm mb-4">
                    Les membres Argent, Or et Diamant bénéficieront d'avantages exclusifs chez nos enseignes partenaires !
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white/20 text-xs px-3 py-1 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">Réductions</span>
                    <span className="bg-white/20 text-xs px-3 py-1 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">Offres VIP</span>
                    <span className="bg-white/20 text-xs px-3 py-1 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">Accès prioritaire</span>
                  </div>
                </div>
              </div>

              {/* Call to action avec animation */}
              <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Prêt à progresser ?
                </h3>
                <p className="text-gray-600 mb-4">
                  Scannez des produits et partagez vos avis pour débloquer de nouveaux statuts
                </p>
                <Link
                  to="/recherche-filtre"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
                >
                  <Camera className="transform group-hover:rotate-12 transition-transform" />
                  Scanner un produit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes draw-line {
          from {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
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

        @keyframes success-bounce {
          0%, 100% { transform: scale(1.1); }
          50% { transform: scale(1.2); }
        }

        @keyframes check-draw {
          from {
            stroke-dasharray: 20;
            stroke-dashoffset: 20;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        @keyframes count-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-draw-line {
          animation: draw-line 2s ease-out forwards;
        }

        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }

        .animate-success-bounce {
          animation: success-bounce 2s ease-in-out infinite;
        }

        .animate-check-draw {
          animation: check-draw 0.5s ease-out forwards;
        }

        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }

        .animate-count-up {
          animation: count-up 1s ease-out;
        }

        /* Particules */
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: particle-float 5s linear infinite;
        }

        .particle-1 { left: 10%; animation-delay: 0s; }
        .particle-2 { left: 30%; animation-delay: 1s; }
        .particle-3 { left: 60%; animation-delay: 2s; }
        .particle-4 { left: 80%; animation-delay: 3s; }

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
            transform: translateY(-100px) translateX(20px);
            opacity: 0;
          }
        }

        /* Sparkles */
        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #fbbf24;
          border-radius: 50%;
          animation: sparkle 1.5s ease-out forwards;
        }

        .sparkle-1 { top: 20%; left: 20%; animation-delay: 0s; }
        .sparkle-2 { top: 50%; left: 70%; animation-delay: 0.2s; }
        .sparkle-3 { bottom: 30%; right: 20%; animation-delay: 0.4s; }

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

        /* Waves */
        .wave {
          position: absolute;
          bottom: -50px;
          left: -50%;
          width: 200%;
          height: 100px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: wave 4s ease-in-out infinite;
        }

        .wave-1 { animation-delay: 0s; }
        .wave-2 { animation-delay: 1s; }
        .wave-3 { animation-delay: 2s; }

        @keyframes wave {
          0% {
            transform: translateY(0) scaleX(1);
          }
          50% {
            transform: translateY(-30px) scaleX(0.8);
          }
          100% {
            transform: translateY(0) scaleX(1);
          }
        }
      `}</style>
    </section>
  );
};

export default ChallengesPage;