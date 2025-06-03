// src/components/login/UserProfile.js
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
  User
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
  const [activeTab, setActiveTab] = useState('overview');

  // Animation au chargement
  useEffect(() => {
    setIsVisible(true);
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

  // Illustration du profil
  const ProfileIllustration = () => (
    <svg viewBox="0 0 400 300" className="w-full h-auto">
      <defs>
        <linearGradient id="profileGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#81C784', stopOpacity:1}}>
            <animate attributeName="stop-color" values="#81C784;#66BB6A;#81C784" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" style={{stopColor:'#4CAF50', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="profileGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#FFD54F', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#FFA726', stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Fond circulaire */}
      <circle cx="200" cy="150" r="120" fill="url(#profileGrad1)" opacity="0.1" />
      
      {/* Avatar central */}
      <g transform="translate(200, 150)">
        <circle cx="0" cy="0" r="50" fill="white" stroke="#4CAF50" strokeWidth="3" />
        <circle cx="0" cy="-10" r="20" fill="#4CAF50" />
        <path d="M-30,20 Q0,35 30,20" fill="#4CAF50" />
        
        {/* Badge de statut */}
        <circle cx="35" cy="-35" r="15" fill="#FFD700" stroke="white" strokeWidth="3" />
        <path d="M35,-40 L37,-35 L42,-35 L38,-32 L40,-27 L35,-30 L30,-27 L32,-32 L28,-35 L33,-35 Z" 
              fill="white" transform="scale(0.8)" />
        
        {/* Animation de pulsation */}
        <circle cx="0" cy="0" r="50" fill="none" stroke="#4CAF50" strokeWidth="2" opacity="0">
          <animate attributeName="r" values="50;70;50" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Icônes flottantes */}
      <g opacity="0.7">
        <g transform="translate(100, 80)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#FFD700" strokeWidth="2" />
          <path d="M0,-10 L3,-3 L10,-3 L4,1 L6,8 L0,4 L-6,8 L-4,1 L-10,-3 L-3,-3 Z" 
                fill="#FFD700" />
          <animateTransform attributeName="transform" type="rotate" 
                            from="0 100 80" to="360 100 80" dur="20s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(300, 100)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#FF6B6B" strokeWidth="2" />
          <path d="M0,3 C0,-3 -5,-6 -5,-2 C-5,1 -2.5,4 0,7 C2.5,4 5,1 5,-2 C5,-6 0,-3 0,3 Z" 
                fill="#FF6B6B" />
          <animateTransform attributeName="transform" type="scale" 
                            values="1;1.2;1" dur="3s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(80, 220)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#42A5F5" strokeWidth="2" />
          <rect x="-8" y="-8" width="16" height="16" rx="2" fill="#42A5F5" />
          <path d="M-4,-4 L-2,-2 L4,-6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
          <animateTransform attributeName="transform" type="translate" 
                            values="80,220; 85,215; 80,220" dur="4s" repeatCount="indefinite" />
        </g>
      </g>
      
      {/* Barres de progression */}
      <g transform="translate(200, 250)">
        <rect x="-80" y="-10" width="160" height="6" rx="3" fill="#E0E0E0" />
        <rect x="-80" y="-10" width="120" height="6" rx="3" fill="url(#profileGrad1)">
          <animate attributeName="width" values="0;120" dur="2s" fill="freeze" />
        </rect>
      </g>
    </svg>
  );

  // Obtenir la couleur et l'icône du statut
  const getStatusInfo = (status) => {
    const statusMap = {
      bronze: {
        color: 'from-amber-400 to-amber-600',
        textColor: 'text-amber-700',
        bgColor: 'bg-amber-50',
        icon: <Award size={20} />,
        description: 'Membre débutant',
        emoji: '🥉'
      },
      argent: {
        color: 'from-gray-300 to-gray-500',
        textColor: 'text-gray-700',
        bgColor: 'bg-gray-50',
        icon: <Award size={20} />,
        description: 'Membre actif',
        emoji: '🥈'
      },
      or: {
        color: 'from-yellow-400 to-yellow-600',
        textColor: 'text-yellow-700',
        bgColor: 'bg-yellow-50',
        icon: <Trophy size={20} />,
        description: 'Membre expert',
        emoji: '🥇'
      },
      diamant: {
        color: 'from-blue-400 to-blue-600',
        textColor: 'text-blue-700',
        bgColor: 'bg-blue-50',
        icon: <Crown size={20} />,
        description: 'Membre élite',
        emoji: '💎'
      }
    };
    
    return statusMap[status?.toLowerCase()] || statusMap.bronze;
  };

  // Statistiques du profil
  const profileStats = [
    {
      icon: <Star size={24} className="text-amber-500" />,
      value: userDetails?.reviewCount || 0,
      label: 'Avis publiés',
      color: 'amber',
      link: '/mes-avis'
    },
    {
      icon: <Heart size={24} className="text-pink-500" />,
      value: userDetails?.favoriteCount || 0,
      label: 'Favoris',
      color: 'pink',
      link: '/mes-favoris'
    },
    {
      icon: <Camera size={24} className="text-blue-500" />,
      value: userDetails?.scanCount || 0,
      label: 'Scans',
      color: 'blue',
      link: '/historique-produits'
    },
    {
      icon: <Receipt size={24} className="text-green-500" />,
      value: userDetails?.searchByNameCount || 0,
      label: 'Recherches',
      color: 'green',
      link: '/historique-produits'
    }
  ];

  // Actions rapides
  const quickActions = [
    {
      icon: <Camera size={20} />,
      title: 'Scanner un produit',
      description: 'Scannez et découvrez',
      color: 'green',
      link: '/recherche-filtre'
    },
    {
      icon: <Trophy size={20} />,
      title: 'Challenges',
      description: 'Participez et gagnez',
      color: 'amber',
      link: '/challenges',
      badge: 'NEW'
    },
    {
      icon: <TrendingUp size={20} />,
      title: 'Top Produits',
      description: 'Les mieux notés',
      color: 'blue',
      link: '/top-produits'
    },
    {
      icon: <Crown size={20} />,
      title: 'Abonnements',
      description: 'Passez au niveau supérieur',
      color: 'purple',
      link: '/abonnements'
    }
  ];

  const statusInfo = getStatusInfo(userDetails?.status);

  return (
    <ProfileLayout 
      title=""
      onLogout={handleLogout}
      logoutLoading={loading}
    >
      <Helmet>
        <title>Mon Profil | Fydo</title>
        <meta name="description" content="Gérez votre profil Fydo, consultez vos statistiques et vos abonnements" />
      </Helmet>

      {/* Header avec titre stylisé */}
      <div className={`text-center mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-3">
          Vue <span className="text-green-600">d'ensemble</span>
        </h1>
        <p className="text-base text-green-700">Gérez votre profil et consultez vos statistiques</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start animate-shake">
          <AlertCircle size={20} className="text-red-600 mr-3 flex-shrink-0 mt-0.5" />
          <span className="text-red-700">{error}</span>
        </div>
      )}
      
      {/* Header du profil avec illustration - Premier élément avec fond blanc */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-green-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Informations utilisateur */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="flex items-center mb-6">
              <div className="relative">
                <UserAvatar 
                  userId={userDetails?.firebase_uid || currentUser?.uid}
                  size={96}
                  status={userDetails?.status || 'bronze'}
                  displayName={currentUser?.displayName || currentUser?.email}
                  customAvatarUrl={userDetails?.avatarUrl}
                  avatarSeed={userDetails?.avatarSeed}
                  className="shadow-xl"
                  showBorder={true}
                />
              </div>
              
              <div className="ml-6">
                <h2 className="text-3xl font-bold text-gray-800">{currentUser.displayName || 'Utilisateur'}</h2>
                <p className="text-gray-600 flex items-center mt-1">
                  <Mail size={16} className="mr-2" />
                  {currentUser.email}
                </p>
                
                {/* Badge de statut avec description */}
                <div className="mt-3 inline-flex items-center">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r ${statusInfo.color} text-white shadow-md`}>
                    <span className="mr-1">{statusInfo.emoji}</span>
                    <span className="capitalize">{userDetails?.status || 'Bronze'}</span>
                  </span>
                  <span className="ml-3 text-sm text-gray-600">{statusInfo.description}</span>
                </div>
              </div>
            </div>

            {/* Abonnement actuel */}
            <div className={`p-4 rounded-xl border-2 ${
              subscriptionPlan?.name === 'Premium' ? 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300' :
              subscriptionPlan?.name === 'Essential' ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300' :
              'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    {subscriptionPlan?.name === 'Premium' ? (
                      <Crown size={20} className="text-purple-600 mr-2" />
                    ) : subscriptionPlan?.name === 'Essential' ? (
                      <Zap size={20} className="text-blue-600 mr-2" />
                    ) : (
                      <Gift size={20} className="text-gray-600 mr-2" />
                    )}
                    <span className="font-semibold text-gray-800">
                      Plan {subscriptionPlan?.name || userDetails?.subscription_name || 'Gratuit'}
                    </span>
                  </div>
                  {subscription && (
                    <p className="text-sm text-gray-600 mt-1">
                      Expire le {new Date(subscription.end_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Link
                  to="/abonnements"
                  className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center transition-colors"
                >
                  {subscriptionPlan?.name === 'Gratuit' ? 'Passer Premium' : 'Gérer'}
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className={`hidden lg:block transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <ProfileIllustration />
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {profileStats.map((stat, index) => (
          <Link
            key={stat.label}
            to={stat.link}
            className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-500 border border-gray-100 group ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Actions rapides */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Sparkles size={24} className="text-green-600 mr-3" />
          Actions rapides
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={action.title}
              to={action.link}
              className={`bg-gradient-to-br from-${action.color}-50 to-white rounded-xl p-5 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-500 border border-${action.color}-100 group relative ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              {action.badge && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                  {action.badge}
                </span>
              )}
              <div className={`w-10 h-10 bg-${action.color}-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                {React.cloneElement(action.icon, { className: `text-${action.color}-600` })}
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">{action.title}</h4>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Informations personnelles */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Users size={24} className="text-green-600 mr-3" />
            Informations personnelles
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <User size={18} className="text-gray-500 mr-3" />
                <span className="text-gray-700">Nom d'utilisateur</span>
              </div>
              <span className="font-medium text-gray-800">{currentUser.displayName || 'Non défini'}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Mail size={18} className="text-gray-500 mr-3" />
                <span className="text-gray-700">Email</span>
              </div>
              <span className="font-medium text-gray-800">{currentUser.email}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Calendar size={18} className="text-gray-500 mr-3" />
                <span className="text-gray-700">Membre depuis</span>
              </div>
              <span className="font-medium text-gray-800">
                {userDetails?.createdAt ? new Date(userDetails.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
          
          <Link
            to="/edit-profile"
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center group"
          >
            <Edit3 size={18} className="mr-2" />
            Modifier mes informations
          </Link>
        </div>

        {/* Adresse */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <MapPin size={24} className="text-green-600 mr-3" />
            Adresse
          </h3>
          
          {userDetails?.country || userDetails?.city || userDetails?.postalCode ? (
            <div className="space-y-4">
              {userDetails?.country && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Pays</span>
                  <span className="font-medium text-gray-800">{userDetails.country}</span>
                </div>
              )}
              {userDetails?.city && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Ville</span>
                  <span className="font-medium text-gray-800">{userDetails.city}</span>
                </div>
              )}
              {userDetails?.postalCode && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Code postal</span>
                  <span className="font-medium text-gray-800">{userDetails.postalCode}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Aucune adresse renseignée</p>
              <Link
                to="/edit-profile"
                className="text-green-600 hover:text-green-700 font-medium flex items-center justify-center"
              >
                Ajouter une adresse
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Styles pour animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </ProfileLayout>
  );
};

export default UserProfile;