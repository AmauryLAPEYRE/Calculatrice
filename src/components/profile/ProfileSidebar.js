// src/components/profile/ProfileSidebar.js
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { calculateUserStatus, buildUserProgress } from '../../utils/statusCalculator';
import { 
  User, 
  Settings, 
  Star, 
  Heart, 
  History, 
  Receipt, 
  Crown, 
  LogOut,
  ShoppingBag,
  Award,
  Calendar,
  ChevronRight,
  Home,
  Sparkles,
  Trophy,
  Shield,
  Zap,
  Gift,
  TrendingUp
} from 'lucide-react';
import UserAvatar from './UserAvatar';

/**
 * Composant de navigation latérale pour les pages de profil (Desktop)
 * Design moderne et animé pour Fydo
 */
const ProfileSidebar = ({ currentUser, onLogout, loading }) => {
  const location = useLocation();
  const { userDetails } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Calculer le statut dynamiquement
  const userProgress = useMemo(() => buildUserProgress(userDetails), [userDetails]);
  const calculatedStatus = useMemo(() => {
    if (!userProgress) return 'nouveau';
    return calculateUserStatus(userProgress);
  }, [userProgress]);

  // Navigation principale du profil avec groupes logiques
  const profileNavGroups = [
    {
      title: "Mon Compte",
      icon: <User size={16} />,
      color: 'green',
      items: [
        {
          to: '/profile',
          icon: <User size={18} />,
          label: 'Vue d\'ensemble',
          description: 'Tableau de bord',
          color: 'green'
        },
        {
          to: '/edit-profile',
          icon: <Settings size={18} />,
          label: 'Paramètres',
          description: 'Modifier mes infos',
          color: 'gray'
        }
      ]
    },
    {
      title: "Mon Activité",
      icon: <TrendingUp size={16} />,
      color: 'blue',
      items: [
        {
          to: '/mes-avis',
          icon: <Star size={18} />,
          label: 'Mes Avis',
          description: 'Avis publiés',
          badge: userDetails?.reviewCount || 0,
          color: 'amber'
        },
        {
          to: '/mes-favoris',
          icon: <Heart size={18} />,
          label: 'Mes Favoris',
          description: 'Produits sauvés',
          badge: userDetails?.favoriteCount || 0,
          color: 'pink'
        },
        {
          to: '/historique-produits',
          icon: <History size={18} />,
          label: 'Historique',
          description: 'Produits consultés',
          badge: userDetails?.scanCount || 0,
          color: 'blue'
        },
        {
          to: '/mes-tickets',
          icon: <Receipt size={18} />,
          label: 'Mes Tickets',
          description: 'Preuves d\'achat',
          color: 'purple'
        }
      ]
    },
    {
      title: "Abonnement",
      icon: <Crown size={16} />,
      color: 'amber',
      items: [
        {
          to: '/abonnements',
          icon: <Crown size={18} />,
          label: 'Mon Plan',
          description: 'Gérer l\'abonnement',
          color: 'amber',
          highlight: userDetails?.subscription_name === 'Gratuit'
        },
        {
          to: '/subscription/history',
          icon: <Calendar size={18} />,
          label: 'Historique',
          description: 'Factures',
          color: 'gray'
        }
      ]
    }
  ];

  // Vérifier si un lien est actif
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // Obtenir le statut utilisateur avec style approprié
  const getUserStatusInfo = (status) => {
    const statusMap = {
      nouveau: {
        color: 'from-gray-400 to-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        icon: <Award size={16} />,
        emoji: ''  // Pas d'emoji pour nouveau
      },
      bronze: {
        color: 'from-amber-400 to-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        icon: <Award size={16} />,
        emoji: '🥉'
      },
      argent: {
        color: 'from-gray-400 to-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        icon: <Award size={16} />,
        emoji: '🥈'
      },
      or: {
        color: 'from-yellow-400 to-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        icon: <Trophy size={16} />,
        emoji: '🥇'
      },
      diamant: {
        color: 'from-blue-400 to-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: <Crown size={16} />,
        emoji: '💎'
      }
    };
    
    return statusMap[status?.toLowerCase()] || statusMap.nouveau;
  };

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-600 group-hover:bg-green-200',
      blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
      amber: 'bg-amber-100 text-amber-600 group-hover:bg-amber-200',
      pink: 'bg-pink-100 text-pink-600 group-hover:bg-pink-200',
      purple: 'bg-purple-100 text-purple-600 group-hover:bg-purple-200',
      gray: 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
    };
    return colors[color] || colors.gray;
  };

  const statusInfo = getUserStatusInfo(calculatedStatus);

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden h-fit sticky top-40 transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
    }`}>
      
      {/* En-tête utilisateur avec gradient */}
      <div className={`relative bg-gradient-to-br from-green-50 to-green-100 p-6 border-b border-green-100`}>
        {/* Motif de fond */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-300 rounded-full transform translate-x-12 -translate-y-12"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-green-400 rounded-full transform -translate-x-8 translate-y-8"></div>
        </div>
        
        <div className="relative flex flex-col items-center text-center">
          {/* Avatar sans badge */}
          <div className="mb-3">
            <UserAvatar 
              userId={userDetails?.firebase_uid || currentUser?.uid}
              size={80}
              status={calculatedStatus}
              displayName={currentUser?.displayName || currentUser?.email}
              customAvatarUrl={userDetails?.avatarUrl}
              avatarSeed={userDetails?.avatarSeed}
              className="shadow-lg transform hover:scale-105 transition-transform"
              showBorder={true}
            />
          </div>
          
          {/* Informations utilisateur */}
          <h2 className="font-bold text-green-800 text-lg mb-1">
            {currentUser?.displayName || 'Utilisateur'}
          </h2>
          <p className="text-sm text-green-600 mb-3 truncate max-w-full px-2">
            {currentUser?.email}
          </p>
          
          {/* Badge de statut avec style moderne */}
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full ${statusInfo.bgColor} ${statusInfo.borderColor} border`}>
            {statusInfo.emoji && <span className="mr-1.5 text-base">{statusInfo.emoji}</span>}
            <span className="text-xs font-semibold text-gray-700 capitalize">
              {calculatedStatus === 'nouveau' ? 'Nouveau' : calculatedStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation par groupes avec animations */}
      <div className="p-4 space-y-6">
        {profileNavGroups.map((group, groupIndex) => (
          <div 
            key={groupIndex}
            className={`transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${groupIndex * 100}ms` }}
          >
            {/* Titre du groupe avec icône */}
            <div className="flex items-center mb-3 px-2">
              <div className={`w-6 h-6 rounded-md bg-${group.color}-100 flex items-center justify-center mr-2`}>
                {React.cloneElement(group.icon, { className: `text-${group.color}-600` })}
              </div>
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {group.title}
              </h3>
            </div>
            
            {/* Items du groupe */}
            <nav className="space-y-1">
              {group.items.map((item, itemIndex) => {
                const isActive = isActiveLink(item.to);
                
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`relative flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                      isActive 
                        ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {/* Barre active */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-green-600 rounded-r-full"></div>
                    )}
                    
                    {/* Icône avec animation */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all duration-200 ${
                      isActive 
                        ? 'bg-green-200 text-green-700 scale-110' 
                        : getColorClasses(item.color)
                    }`}>
                      {item.icon}
                    </div>
                    
                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{item.label}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className={`${
                            isActive ? 'bg-green-600' : 'bg-gray-500'
                          } text-white text-xs px-2 py-0.5 rounded-full animate-pulse`}>
                            {item.badge}
                          </span>
                        )}
                        {item.highlight && (
                          <Sparkles size={14} className="text-amber-500 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Flèche au hover */}
                    <ChevronRight size={16} className={`transition-all duration-200 ${
                      isActive 
                        ? 'opacity-100 text-green-600' 
                        : 'opacity-0 group-hover:opacity-100 text-gray-400'
                    }`} />
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Section Actions rapides avec nouveau design */}
      <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50">
        
        {/* Carte d'upgrade si plan gratuit */}
        {userDetails?.subscription_name === 'Gratuit' && (
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white mb-3">
            <div className="flex items-center mb-2">
              <Crown size={20} className="mr-2" />
              <span className="font-semibold">Passez Premium</span>
            </div>
            <p className="text-xs text-purple-100 mb-3">
              Débloquez toutes les fonctionnalités
            </p>
            <Link
              to="/abonnements"
              className="block w-full bg-white text-purple-600 text-center py-2 rounded-lg font-medium text-sm hover:bg-purple-50 transition-colors"
            >
              Découvrir
            </Link>
          </div>
        )}
        
        {/* Raccourci recherche avec nouveau style */}
        <Link
          to="/recherche-filtre"
          className="flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] group"
        >
          <ShoppingBag size={18} className="mr-2 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Scanner un produit</span>
        </Link>

        {/* Bouton déconnexion avec style moderne */}
        <button
          onClick={onLogout}
          disabled={loading}
          className="flex items-center justify-center w-full py-3 px-4 bg-white border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
              <span className="font-medium">Déconnexion...</span>
            </>
          ) : (
            <>
              <LogOut size={18} className="mr-2 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Se déconnecter</span>
            </>
          )}
        </button>
      </div>

      {/* Footer avec animation */}
      <div className="border-t border-gray-100 p-4 bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Shield size={14} className="text-green-600 mr-1" />
            <span className="text-xs font-medium text-green-700">Membre Fydo vérifié</span>
          </div>
          <Link 
            to="/contact" 
            className="text-xs text-gray-500 hover:text-green-600 transition-colors inline-flex items-center"
          >
            Besoin d'aide ?
            <ChevronRight size={12} className="ml-1" />
          </Link>
        </div>
      </div>

    </div>
  );
};

export default ProfileSidebar;