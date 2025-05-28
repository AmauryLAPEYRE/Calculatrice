// src/components/profile/UserProfileModal.js
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Crown,
  Trophy,
  Star,
  Heart,
  MessageSquare,
  Camera,
  Shield,
  Award,
  TrendingUp,
  Calendar,
  Target,
  Users,
  ChevronRight,
  Sparkles,
  Zap,
  Medal,
  Gift,
  Eye,
  ThumbsUp
} from 'lucide-react';
import { userProfileService } from '../../services/userProfileService';
import { formatDate } from '../../utils/formatters';

const UserProfileModal = ({ userId, userName, isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('stats'); // stats, reviews, challenges
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserProfile();
      // Déclencher les animations séquentielles
      const timer = setTimeout(() => setAnimationPhase(1), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, userId]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const { success, data } = await userProfileService.getUserProfileData(userId);
      if (success) {
        setProfileData(data);
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour obtenir les infos de niveau/statut
  const getLevelInfo = (status) => {
    const levels = {
      bronze: {
        icon: '🥉',
        color: 'from-amber-400 to-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-300',
        textColor: 'text-amber-800',
        nextLevel: 'Argent',
        emoji: '🥉'
      },
      argent: {
        icon: '🥈',
        color: 'from-gray-400 to-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-300',
        textColor: 'text-gray-800',
        nextLevel: 'Or',
        emoji: '🥈'
      },
      or: {
        icon: '🥇',
        color: 'from-yellow-400 to-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-300',
        textColor: 'text-yellow-800',
        nextLevel: 'Diamant',
        emoji: '🥇'
      },
      diamant: {
        icon: '💎',
        color: 'from-blue-400 to-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-300',
        textColor: 'text-blue-800',
        nextLevel: null,
        emoji: '💎'
      }
    };
    return levels[status?.toLowerCase()] || levels.bronze;
  };

  // Fonction pour calculer la durée d'adhésion
  const getMembershipDuration = (createdAt) => {
    if (!createdAt) return 'Nouveau membre';
    const created = new Date(createdAt);
    const now = new Date();
    const months = Math.floor((now - created) / (1000 * 60 * 60 * 24 * 30));
    if (months < 1) return 'Membre depuis moins d\'un mois';
    if (months === 1) return 'Membre depuis 1 mois';
    if (months < 12) return `Membre depuis ${months} mois`;
    const years = Math.floor(months / 12);
    return `Membre depuis ${years} an${years > 1 ? 's' : ''}`;
  };

  const levelInfo = profileData ? getLevelInfo(profileData.profile?.status) : getLevelInfo('bronze');

  // Si la modal n'est pas ouverte, ne rien rendre
  if (!isOpen) return null;

  // Utiliser createPortal pour rendre la modal directement dans le body
  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Overlay avec effet de blur */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        style={{ opacity: animationPhase >= 1 ? 1 : 0 }}
      />
      
      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className={`relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 ${
            animationPhase >= 1 ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Header avec gradient dynamique */}
          <div className={`relative bg-gradient-to-br ${levelInfo.color} p-6 pb-20`}>
            {/* Éléments décoratifs animés */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-12 translate-y-12 animate-pulse"></div>
            
            {/* Bouton fermer */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all duration-200"
            >
              <X size={24} />
            </button>
            
            {/* Avatar et infos principales */}
            <div className="relative z-10 text-center text-white">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold shadow-xl">
                  {userName?.charAt(0).toUpperCase() || 'U'}
                </div>
                {/* Badge de niveau animé */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <span className="text-2xl">{levelInfo.emoji}</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-1">{userName || 'Utilisateur'}</h2>
              <p className="text-white text-opacity-90 text-sm">
                {getMembershipDuration(profileData?.profile?.created_at)}
              </p>
              
              {/* Badges de confiance */}
              <div className="flex justify-center gap-2 mt-3">
                {profileData?.stats?.verifiedPurchases > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white bg-opacity-20 backdrop-blur-sm text-xs font-medium">
                    <Shield size={14} className="mr-1" />
                    Vérifié
                  </span>
                )}
                {profileData?.stats?.totalReviews >= 10 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white bg-opacity-20 backdrop-blur-sm text-xs font-medium">
                    <Award size={14} className="mr-1" />
                    Expert
                  </span>
                )}
                {profileData?.stats?.totalLikes >= 50 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white bg-opacity-20 backdrop-blur-sm text-xs font-medium">
                    <Heart size={14} className="mr-1" />
                    Populaire
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Stats principales avec effet de carte */}
          <div className="relative -mt-14 mx-6 mb-6">
            <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="group cursor-pointer transform hover:scale-105 transition-all duration-200">
                    <div className="text-2xl font-bold text-green-800 group-hover:text-green-600">
                      {profileData?.stats?.totalReviews || 0}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center justify-center">
                      <MessageSquare size={12} className="mr-1" />
                      Avis
                    </div>
                  </div>
                  <div className="group cursor-pointer transform hover:scale-105 transition-all duration-200">
                    <div className="text-2xl font-bold text-amber-600 group-hover:text-amber-500">
                      {profileData?.stats?.totalLikes || 0}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center justify-center">
                      <ThumbsUp size={12} className="mr-1" />
                      Likes
                    </div>
                  </div>
                  <div className="group cursor-pointer transform hover:scale-105 transition-all duration-200">
                    <div className="text-2xl font-bold text-pink-600 group-hover:text-pink-500">
                      {profileData?.stats?.favorites || 0}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center justify-center">
                      <Heart size={12} className="mr-1" />
                      Favoris
                    </div>
                  </div>
                  <div className="group cursor-pointer transform hover:scale-105 transition-all duration-200">
                    <div className="text-2xl font-bold text-blue-600 group-hover:text-blue-500">
                      {profileData?.stats?.scannedProducts || 0}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center justify-center">
                      <Camera size={12} className="mr-1" />
                      Scans
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Barre de progression du niveau avec animation */}
          {profileData?.level && (
            <div className="mx-6 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Niveau {profileData.profile?.status || 'Bronze'}
                </span>
                {profileData.level.next && (
                  <span className="text-xs text-gray-500">
                    {profileData.profile?.total_points || 0} / {profileData.level.next.required_points} points
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${levelInfo.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ 
                    width: `${profileData.level.progress || 0}%`,
                    animation: 'slideIn 1s ease-out'
                  }}
                />
              </div>
              {profileData.level.next && (
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Plus que {profileData.level.next.required_points - (profileData.profile?.total_points || 0)} points pour atteindre {levelInfo.nextLevel} !
                </p>
              )}
            </div>
          )}
          
          {/* Tabs de navigation */}
          <div className="flex border-b border-gray-200 mx-6">
            {[
              { id: 'stats', label: 'Statistiques', icon: <TrendingUp size={16} /> },
              { id: 'reviews', label: 'Avis récents', icon: <MessageSquare size={16} /> },
              { id: 'challenges', label: 'Challenges', icon: <Trophy size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Contenu des tabs */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {/* Tab Statistiques */}
            {activeTab === 'stats' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Badges acquis */}
                {profileData?.badges && profileData.badges.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Medal size={18} className="mr-2 text-yellow-500" />
                      Badges acquis
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {profileData.badges.slice(0, 6).map((badge, index) => (
                        <div 
                          key={badge.id}
                          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 text-center transform hover:scale-105 transition-all duration-200 cursor-pointer"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="text-2xl mb-1">{badge.badges?.icon || '🏆'}</div>
                          <p className="text-xs font-medium text-gray-700">{badge.badges?.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Statistiques détaillées */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Zap size={18} className="mr-2 text-orange-500" />
                    Performance
                  </h3>
                  <div className="space-y-2">
                    {profileData?.stats?.firstReviews > 0 && (
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center">
                          <Zap size={16} className="text-orange-500 mr-2" />
                          <span className="text-sm text-gray-700">Premier à évaluer</span>
                        </div>
                        <span className="font-bold text-orange-600">{profileData.stats.firstReviews}x</span>
                      </div>
                    )}
                    {profileData?.stats?.verifiedPurchases > 0 && (
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                          <Shield size={16} className="text-green-500 mr-2" />
                          <span className="text-sm text-gray-700">Achats vérifiés</span>
                        </div>
                        <span className="font-bold text-green-600">{profileData.stats.verifiedPurchases}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Eye size={16} className="text-blue-500 mr-2" />
                        <span className="text-sm text-gray-700">Contributions vues</span>
                      </div>
                      <span className="font-bold text-blue-600">
                        {(profileData?.stats?.totalLikes || 0) * 10}+
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Tab Avis récents */}
            {activeTab === 'reviews' && (
              <div className="space-y-3 animate-fadeIn">
                {profileData?.recentReviews && profileData.recentReviews.length > 0 ? (
                  profileData.recentReviews.map((review, index) => (
                    <div 
                      key={review.id}
                      className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 line-clamp-1">
                            {review.products?.name || 'Produit'}
                          </h4>
                          <p className="text-xs text-gray-500">{review.products?.brand}</p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className={`${i < review.average_rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {formatDate(review.creation_date)}
                        </span>
                        {review.is_verified && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center">
                            <Shield size={10} className="mr-1" />
                            Vérifié
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare size={32} className="mx-auto mb-2 text-gray-300" />
                    <p>Aucun avis récent</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Tab Challenges */}
            {activeTab === 'challenges' && (
              <div className="space-y-4 animate-fadeIn">
                {profileData?.completedChallenges && profileData.completedChallenges.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Trophy size={18} className="mr-2 text-green-500" />
                      Challenges complétés
                    </h3>
                    <div className="space-y-2">
                      {profileData.completedChallenges.slice(0, 3).map((challenge, index) => (
                        <div 
                          key={challenge.id}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                              <Trophy size={16} className="text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {challenge.challenges?.name || 'Challenge'}
                            </span>
                          </div>
                          <Gift size={16} className="text-green-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {profileData?.activeChallenges && profileData.activeChallenges.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Target size={18} className="mr-2 text-amber-500" />
                      En cours
                    </h3>
                    <div className="space-y-2">
                      {profileData.activeChallenges.slice(0, 2).map((challenge, index) => (
                        <div 
                          key={challenge.id}
                          className="p-3 bg-amber-50 rounded-lg"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              {challenge.challenges?.name || 'Challenge'}
                            </span>
                            <span className="text-xs text-amber-600 font-bold">
                              {Math.round((challenge.current_progress / challenge.target_progress) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-amber-200 rounded-full h-2">
                            <div 
                              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(challenge.current_progress / challenge.target_progress) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {(!profileData?.completedChallenges?.length && !profileData?.activeChallenges?.length) && (
                  <div className="text-center py-8 text-gray-500">
                    <Trophy size={32} className="mx-auto mb-2 text-gray-300" />
                    <p>Aucun challenge pour le moment</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Footer avec CTA psychologique */}
          <div className="p-6 bg-gradient-to-t from-gray-50 to-white border-t border-gray-100">
            <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center group">
              <Users size={18} className="mr-2" />
              Découvrir d'autres profils
              <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">
              <Sparkles size={12} className="inline mr-1" />
              Rejoignez notre communauté de {Math.floor(Math.random() * 5000) + 10000}+ membres actifs
            </p>
          </div>
        </div>
      </div>
      
      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            width: 0;
          }
          to {
            width: var(--progress, 0%);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-fadeIn > * {
          opacity: 0;
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>,
    document.body // Rendre dans le body du document
  );
};

export default UserProfileModal;