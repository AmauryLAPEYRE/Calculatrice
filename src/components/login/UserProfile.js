// src/components/login/UserProfile.js - Version complètement repensée
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getUserSubscription } from '../../services/subscriptionService';
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
  Smile
} from 'lucide-react';
import ProfileLayout from '../profile/ProfileLayout';
import UserAvatar from '../profile/UserAvatar';

const UserProfile = () => {
  const { currentUser, logout, userDetails } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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

  // Calcul du niveau de progression
  const calculateProgress = () => {
    const totalActions = (userDetails?.reviewCount || 0) + 
                       (userDetails?.scanCount || 0) + 
                       (userDetails?.favoriteCount || 0);
    const levels = [
      { min: 0, max: 10, name: 'Débutant', color: 'gray' },
      { min: 10, max: 50, name: 'Explorateur', color: 'green' },
      { min: 50, max: 100, name: 'Connaisseur', color: 'blue' },
      { min: 100, max: 200, name: 'Expert', color: 'purple' },
      { min: 200, max: Infinity, name: 'Maître', color: 'amber' }
    ];
    
    const currentLevel = levels.find(level => totalActions >= level.min && totalActions < level.max);
    const progress = currentLevel.max === Infinity ? 100 : 
                    ((totalActions - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100;
    
    return { totalActions, currentLevel, progress, nextLevel: currentLevel.max };
  };

  const { totalActions, currentLevel, progress, nextLevel } = calculateProgress();

  // Statistiques avec contexte motivant
  const getMotivationalMessage = () => {
    const messages = {
      0: "Bienvenue dans l'aventure Fydo ! 🎉",
      1: "Excellent début ! Continuez comme ça 💪",
      5: "Vous prenez le rythme ! 🚀",
      10: "Impressionnant ! Vous êtes sur la bonne voie 🌟",
      20: "Wow ! Vous devenez un expert Fydo 🏆",
      50: "Incroyable ! Vous faites partie de nos membres les plus actifs 💎",
      100: "Légendaire ! Vous êtes une inspiration pour la communauté 👑"
    };
    
    const key = Object.keys(messages).reverse().find(k => totalActions >= parseInt(k));
    return messages[key || 0];
  };

  // Achievements débloqués
  const achievements = [
    { 
      id: 1, 
      name: "Premier pas", 
      icon: <Smile className="text-green-600" />, 
      unlocked: totalActions >= 1,
      description: "Première action sur Fydo"
    },
    { 
      id: 2, 
      name: "Curieux", 
      icon: <Search className="text-blue-600" />, 
      unlocked: userDetails?.scanCount >= 5,
      description: "5 produits scannés"
    },
    { 
      id: 3, 
      name: "Critique", 
      icon: <MessageSquare className="text-purple-600" />, 
      unlocked: userDetails?.reviewCount >= 3,
      description: "3 avis publiés"
    },
    { 
      id: 4, 
      name: "Collectionneur", 
      icon: <Heart className="text-pink-600" />, 
      unlocked: userDetails?.favoriteCount >= 10,
      description: "10 favoris sauvegardés"
    },
    { 
      id: 5, 
      name: "Fidèle", 
      icon: <Trophy className="text-amber-600" />, 
      unlocked: userDetails?.createdAt && new Date(userDetails.createdAt) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      description: "Membre depuis 30 jours"
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // Actions suggérées basées sur le comportement
  const getSuggestedActions = () => {
    const actions = [];
    
    if (userDetails?.scanCount === 0) {
      actions.push({
        icon: <Camera className="text-green-600" />,
        title: "Scanner votre premier produit",
        description: "Découvrez les avis de la communauté",
        link: "/recherche-filtre",
        reward: "+10 points"
      });
    }
    
    if (userDetails?.reviewCount === 0) {
      actions.push({
        icon: <Star className="text-amber-600" />,
        title: "Publier votre premier avis",
        description: "Aidez la communauté avec votre expérience",
        link: "/historique-produits",
        reward: "+20 points"
      });
    }
    
    if (subscriptionPlan?.name === 'Gratuit') {
      actions.push({
        icon: <Crown className="text-purple-600" />,
        title: "Passer Premium",
        description: "Débloquez toutes les fonctionnalités",
        link: "/abonnements",
        reward: "Accès illimité"
      });
    }
    
    return actions.slice(0, 2); // Max 2 suggestions
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

  return (
    <ProfileLayout 
      title=""
      onLogout={handleLogout}
      logoutLoading={loading}
    >
      <Helmet>
        <title>Mon Profil | Fydo</title>
        <meta name="description" content="Votre espace personnel Fydo - Suivez votre progression et vos accomplissements" />
      </Helmet>

      {/* Confetti animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* Animation de confettis */}
        </div>
      )}

      {/* Hero Section Personnalisée */}
      <div className={`relative mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Background décoratif avec gradient animé */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-3xl opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-green-400/30 to-transparent rounded-3xl animate-gradient"></div>
        
        {/* Contenu */}
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar avec badge de statut */}
            <div className="relative group">
              <div className="relative">
                <UserAvatar 
                  userId={userDetails?.firebase_uid || currentUser?.uid}
                  size={120}
                  status={userDetails?.status || 'bronze'}
                  displayName={currentUser?.displayName || currentUser?.email}
                  customAvatarUrl={userDetails?.avatarUrl}
                  avatarSeed={userDetails?.avatarSeed}
                  className="shadow-2xl ring-4 ring-white/50"
                  showBorder={true}
                />
                {/* Badge de niveau flottant */}
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                  <Trophy className={`w-6 h-6 text-${currentLevel.color}-600`} />
                </div>
              </div>
              
              {/* Bouton de changement d'avatar au hover */}
              <Link to="/edit-profile" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
              </Link>
            </div>
            
            {/* Informations et message de bienvenue */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Bonjour {currentUser.displayName || 'Explorateur'} ! 👋
              </h1>
              <p className="text-green-100 text-lg mb-4">{getMotivationalMessage()}</p>
              
              {/* Barre de progression du niveau */}
              <div className="bg-white/20 rounded-full p-1 mb-4 max-w-md mx-auto md:mx-0">
                <div className="bg-white rounded-full h-6 relative overflow-hidden">
                  <div 
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r from-${currentLevel.color}-400 to-${currentLevel.color}-600 transition-all duration-1000`}
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
                  </div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800">
                    {currentLevel.name} • {totalActions}/{nextLevel === Infinity ? '∞' : nextLevel} actions
                  </span>
                </div>
              </div>
              
              {/* Quick stats */}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Activity className="text-white" size={20} />
                    <span className="text-white font-bold">{totalActions}</span>
                    <span className="text-green-100">actions totales</span>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Flame className="text-white" size={20} />
                    <span className="text-white font-bold">{userDetails?.searchByNameCount || 0}</span>
                    <span className="text-green-100">jours actifs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Achievements */}
      <div className={`bg-white rounded-3xl shadow-xl p-6 mb-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Trophy className="text-amber-500 mr-3" size={28} />
            Vos Accomplissements
          </h2>
          <span className="text-sm text-gray-600 bg-amber-100 px-3 py-1 rounded-full">
            {unlockedCount}/{achievements.length} débloqués
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className={`relative p-4 rounded-2xl border-2 transition-all duration-500 ${
                achievement.unlocked 
                  ? 'bg-gradient-to-br from-white to-gray-50 border-green-200 shadow-md hover:shadow-lg transform hover:scale-105' 
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {achievement.unlocked && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                  <CheckCircle2 className="text-white" size={16} />
                </div>
              )}
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  achievement.unlocked ? 'bg-gradient-to-br from-green-100 to-green-200' : 'bg-gray-200'
                }`}>
                  {React.cloneElement(achievement.icon, { 
                    size: 24, 
                    className: achievement.unlocked ? achievement.icon.props.className : 'text-gray-400' 
                  })}
                </div>
                <h3 className="font-semibold text-sm text-gray-800">{achievement.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions suggérées */}
      {getSuggestedActions().length > 0 && (
        <div className={`bg-gradient-to-r from-green-50 to-green-100 rounded-3xl p-6 mb-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Target className="text-green-600 mr-3" />
            Actions recommandées pour vous
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getSuggestedActions().map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{action.title}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                    <span className="inline-flex items-center text-xs text-green-600 font-bold mt-2">
                      <Gift size={14} className="mr-1" />
                      {action.reward}
                    </span>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Statistiques détaillées avec visualisation */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {[
          { 
            icon: <Star className="text-amber-500" />, 
            value: userDetails?.reviewCount || 0, 
            label: 'Avis publiés',
            color: 'amber',
            growth: '+12%'
          },
          { 
            icon: <Heart className="text-pink-500" />, 
            value: userDetails?.favoriteCount || 0, 
            label: 'Favoris',
            color: 'pink',
            growth: '+5%'
          },
          { 
            icon: <Camera className="text-blue-500" />, 
            value: userDetails?.scanCount || 0, 
            label: 'Scans',
            color: 'blue',
            growth: '+23%'
          },
          { 
            icon: <Receipt className="text-green-500" />, 
            value: userDetails?.searchByNameCount || 0, 
            label: 'Recherches',
            color: 'green',
            growth: '+8%'
          }
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {React.cloneElement(stat.icon, { size: 24 })}
              </div>
              <span className="text-xs text-green-600 font-medium flex items-center">
                <ArrowUp size={12} className="mr-1" />
                {stat.growth}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
            
            {/* Mini graph */}
            <div className="mt-3 h-8 flex items-end gap-1">
              {[40, 60, 45, 70, 85, 65, 90].map((height, i) => (
                <div
                  key={i}
                  className={`flex-1 bg-${stat.color}-200 rounded-t opacity-50`}
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Section Abonnement avec design premium */}
      <div className={`relative overflow-hidden rounded-3xl mb-8 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className={`p-8 ${
          subscriptionPlan?.name === 'Premium' 
            ? 'bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800' 
            : subscriptionPlan?.name === 'Essential'
              ? 'bg-gradient-to-br from-green-600 via-green-700 to-green-800'
              : 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800'
        }`}>
          {/* Motif de fond */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full transform -translate-x-24 translate-y-24"></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center mb-3">
                {subscriptionPlan?.name === 'Premium' ? (
                  <Crown className="text-yellow-300 mr-3" size={32} />
                ) : subscriptionPlan?.name === 'Essential' ? (
                  <Zap className="text-green-300 mr-3" size={32} />
                ) : (
                  <Heart className="text-gray-300 mr-3" size={32} />
                )}
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Plan {subscriptionPlan?.name || 'Gratuit'}
                  </h3>
                  {subscription && (
                    <p className="text-sm text-white/80">
                      {subscription.is_active ? 'Actif' : 'Inactif'} • Expire le {new Date(subscription.end_date).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Avantages du plan */}
              <div className="flex flex-wrap gap-3 mb-4">
                {subscriptionPlan?.name === 'Premium' ? (
                  <>
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      ✨ Scans illimités
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      🎯 Accès prioritaire
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      💎 Badges exclusifs
                    </span>
                  </>
                ) : subscriptionPlan?.name === 'Essential' ? (
                  <>
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      ⚡ 50 scans/jour
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      📊 Statistiques
                    </span>
                  </>
                ) : (
                  <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                    🎁 3 scans/jour gratuits
                  </span>
                )}
              </div>
            </div>
            
            <Link
              to="/abonnements"
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                subscriptionPlan?.name === 'Gratuit'
                  ? 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white shadow-lg'
                  : 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30'
              }`}
            >
              {subscriptionPlan?.name === 'Gratuit' ? 'Découvrir Premium' : 'Gérer mon plan'}
            </Link>
          </div>
        </div>
      </div>

      {/* Informations personnelles et adresse avec nouveau layout */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Carte d'identité */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <User className="text-green-600 mr-3" />
            Carte d'identité Fydo
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Photo et nom */}
            <div className="flex items-center gap-4">
              <UserAvatar 
                userId={userDetails?.firebase_uid || currentUser?.uid}
                size={80}
                status={userDetails?.status || 'bronze'}
                displayName={currentUser?.displayName || currentUser?.email}
                customAvatarUrl={userDetails?.avatarUrl}
                avatarSeed={userDetails?.avatarSeed}
                className="shadow-lg"
                showBorder={true}
              />
              <div>
                <p className="text-sm text-gray-600">Pseudo</p>
                <p className="font-bold text-gray-800">{currentUser.displayName || 'Non défini'}</p>
                <p className="text-sm text-gray-600 mt-1">Membre #{userDetails?.id?.slice(-6) || '000000'}</p>
              </div>
            </div>
            
            {/* Email */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-800">{currentUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Membre depuis</p>
                <p className="font-semibold text-gray-800">
                  {userDetails?.createdAt ? new Date(userDetails.createdAt).toLocaleDateString('fr-FR', { 
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Localisation */}
          {(userDetails?.country || userDetails?.city) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <MapPin className="text-green-600" size={20} />
                <span className="text-gray-800">
                  {userDetails?.city && <span className="font-semibold">{userDetails.city}</span>}
                  {userDetails?.city && userDetails?.country && ', '}
                  {userDetails?.country && (
                    <>
                      <span className="font-semibold">{userDetails.country}</span>
                      <span className="ml-2 text-xl">{getCountryFlag(userDetails.country)}</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          )}
          
          <Link
            to="/edit-profile"
            className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <Edit3 size={18} className="mr-2 group-hover:rotate-12 transition-transform" />
            Modifier mes informations
          </Link>
        </div>
        
        {/* Actions rapides */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Actions rapides</h3>
          <div className="space-y-3">
            <Link to="/recherche-filtre" className="flex items-center justify-between p-3 bg-white rounded-xl hover:shadow-md transition-all group">
              <div className="flex items-center">
                <Camera className="text-green-600 mr-3" size={20} />
                <span className="font-medium text-gray-800">Scanner</span>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-green-600 transition-colors" size={20} />
            </Link>
            
            <Link to="/challenges" className="flex items-center justify-between p-3 bg-white rounded-xl hover:shadow-md transition-all group">
              <div className="flex items-center">
                <Trophy className="text-amber-600 mr-3" size={20} />
                <span className="font-medium text-gray-800">Challenges</span>
              </div>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">NEW</span>
            </Link>
            
            <Link to="/mes-favoris" className="flex items-center justify-between p-3 bg-white rounded-xl hover:shadow-md transition-all group">
              <div className="flex items-center">
                <Heart className="text-pink-600 mr-3" size={20} />
                <span className="font-medium text-gray-800">Favoris</span>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-pink-600 transition-colors" size={20} />
            </Link>
            
            <button onClick={() => {}} className="w-full flex items-center justify-between p-3 bg-white rounded-xl hover:shadow-md transition-all group">
              <div className="flex items-center">
                <Share2 className="text-blue-600 mr-3" size={20} />
                <span className="font-medium text-gray-800">Inviter des amis</span>
              </div>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">+50 pts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Styles pour animations */}
      <style jsx>{`
        @keyframes gradient {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-gradient {
          animation: gradient 3s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </ProfileLayout>
  );
};

export default UserProfile;