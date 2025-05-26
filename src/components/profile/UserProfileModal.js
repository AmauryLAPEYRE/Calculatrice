import React, { useState, useEffect } from 'react';
import { 
  X, Trophy, Star, ShoppingBag, Award, TrendingUp, Calendar, Heart,
  Target, Zap, Crown, Diamond, Shield, Sparkles, CheckCircle,
  Package, MessageSquare, Users, MapPin, DollarSign
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { userProfileService } from '../../services/userProfileService';
import { formatPrice } from '../../utils/formatters';

const UserProfileModal = ({ userId, userName, isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Icônes pour les types de badges/challenges
  const badgeIcons = {
    review: MessageSquare,
    food: ShoppingBag,
    cosmetics: Sparkles,
    engagement: Heart,
    photo: Package,
    shopping: ShoppingBag,
    streak: Calendar,
    achievement: Trophy,
    special: Star,
    bronze: Shield,
    silver: Award,
    gold: Crown,
    diamond: Diamond
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserData();
    }
  }, [isOpen, userId]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const result = await userProfileService.getUserProfileData(userId);
      
      if (result.success) {
        setProfileData(result.data);
      } else {
        console.error('Erreur:', result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (badge) => {
    const iconType = badge.badges?.type || badge.type || 'star';
    return badgeIcons[iconType] || Star;
  };
  
  const getBadgeColor = (badge) => {
    const type = badge.badges?.type || badge.type || 'default';
    const colors = {
      review: { color: 'text-blue-600', bg: 'bg-blue-50' },
      food: { color: 'text-green-600', bg: 'bg-green-50' },
      cosmetics: { color: 'text-pink-600', bg: 'bg-pink-50' },
      engagement: { color: 'text-red-600', bg: 'bg-red-50' },
      photo: { color: 'text-purple-600', bg: 'bg-purple-50' },
      shopping: { color: 'text-amber-600', bg: 'bg-amber-50' },
      streak: { color: 'text-indigo-600', bg: 'bg-indigo-50' },
      achievement: { color: 'text-yellow-600', bg: 'bg-yellow-50' },
      special: { color: 'text-teal-600', bg: 'bg-teal-50' },
      bronze: { color: 'text-orange-700', bg: 'bg-orange-50' },
      silver: { color: 'text-gray-600', bg: 'bg-gray-50' },
      gold: { color: 'text-yellow-500', bg: 'bg-yellow-50' },
      diamond: { color: 'text-cyan-600', bg: 'bg-cyan-50' }
    };
    return colors[type] || { color: 'text-gray-600', bg: 'bg-gray-50' };
  };
  
  const getLevelIcon = (levelName) => {
    const name = levelName?.toLowerCase();
    if (name?.includes('bronze')) return Shield;
    if (name?.includes('argent') || name?.includes('silver')) return Award;
    if (name?.includes('or') || name?.includes('gold')) return Crown;
    if (name?.includes('diamant') || name?.includes('diamond')) return Diamond;
    return Star;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold backdrop-blur-sm">
              {userName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{userName || 'Utilisateur'}</h2>
              {profileData?.stats?.created_at && (
                <p className="text-green-100 text-sm">
                  Membre depuis {formatDistanceToNow(new Date(profileData.stats.created_at), { locale: fr })}
                </p>
              )}
              {profileData?.level?.current && (
                <div className="flex items-center mt-1 gap-2">
                  {(() => {
                    const LevelIcon = getLevelIcon(profileData.level.current.name);
                    return <LevelIcon className="w-5 h-5 text-white/90" />;
                  })()}
                  <span className="text-white/90 font-medium">
                    {profileData.level.current.name}
                  </span>
                  {profileData.level.next && (
                    <span className="text-green-100 text-xs">
                      ({Math.round(profileData.level.progress)}% vers {profileData.level.next.name})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{profileData?.stats?.totalReviews || 0}</div>
              <div className="text-green-100 text-sm">Avis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profileData?.stats?.scannedProducts || 0}</div>
              <div className="text-green-100 text-sm">Scans</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profileData?.stats?.totalLikes || 0}</div>
              <div className="text-green-100 text-sm">J'aime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profileData?.stats?.totalPoints || 0}</div>
              <div className="text-green-100 text-sm">Points</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'reviews'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Avis récents
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'challenges'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Challenges
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Badges et trophées gagnés */}
                  {profileData?.badges?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                        Trophées & Badges
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {profileData.badges.map((userBadge) => {
                          const Icon = getBadgeIcon(userBadge);
                          const colors = getBadgeColor(userBadge);
                          return (
                            <div
                              key={userBadge.id}
                              className={`${colors.bg} rounded-lg p-4 flex items-center space-x-3 transform transition-all hover:scale-105`}
                            >
                              <Icon className={`w-8 h-8 ${colors.color}`} />
                              <div>
                                <div className="font-medium text-gray-800">
                                  {userBadge.badges?.name || 'Badge'}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {formatDistanceToNow(new Date(userBadge.earned_date), { locale: fr, addSuffix: true })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Statistiques détaillées */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                      Statistiques détaillées
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Produits scannés</span>
                          <span className="font-bold text-lg">{profileData?.stats?.scannedProducts || 0}</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Favoris</span>
                          <span className="font-bold text-lg">{profileData?.stats?.favorites || 0}</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Premier avis</span>
                          <span className="font-bold text-lg">{profileData?.stats?.firstReviews || 0}</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Catégories</span>
                          <span className="font-bold text-lg">{profileData?.stats?.uniqueCategories || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700 font-medium">Taux d'achats vérifiés</span>
                        <span className="font-bold text-blue-600">
                          {profileData?.stats?.totalReviews > 0
                            ? Math.round((profileData.stats.verifiedPurchases / profileData.stats.totalReviews) * 100)
                            : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${profileData?.stats?.totalReviews > 0 
                              ? (profileData.stats.verifiedPurchases / profileData.stats.totalReviews) * 100 
                              : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {profileData?.recentReviews?.length > 0 ? (
                    profileData.recentReviews.map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          {review.products?.image_url && (
                            <img
                              src={review.products.image_url}
                              alt={review.products.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium">{review.products?.name}</h4>
                            <p className="text-sm text-gray-600">{review.products?.brand}</p>
                            <div className="flex items-center mt-1 gap-4">
                              <div className="flex items-center">
                                {renderStars(review.overall_rating)}
                              </div>
                              {(review.is_verified || review.receipt_id) && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Achat vérifié
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDistanceToNow(new Date(review.creation_date || review.created_at), { locale: fr, addSuffix: true })}
                              {review.store_name && ` • ${review.store_name}`}
                              {review.purchase_price && ` • ${formatPrice(review.purchase_price)}€`}
                            </p>
                            {review.comment && (
                              <p className="mt-2 text-gray-700 text-sm line-clamp-2">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">Aucun avis récent</p>
                  )}
                </div>
              )}
              
              {activeTab === 'challenges' && (
                <div className="space-y-6">
                  {/* Challenges complétés */}
                  {profileData?.completedChallenges?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        Challenges complétés
                      </h3>
                      <div className="space-y-3">
                        {profileData.completedChallenges.map((userChallenge) => {
                          const Icon = getBadgeIcon({ type: userChallenge.challenges?.type });
                          return (
                            <div
                              key={userChallenge.id}
                              className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-3">
                                <Icon className="w-6 h-6 text-green-600" />
                                <div>
                                  <h4 className="font-medium text-gray-800">
                                    {userChallenge.challenges?.title}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Complété {formatDistanceToNow(new Date(userChallenge.completed_date), { locale: fr, addSuffix: true })}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-green-600">
                                  +{userChallenge.challenges?.reward_points} pts
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Challenges en cours */}
                  {profileData?.activeChallenges?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-amber-600" />
                        Challenges en cours
                      </h3>
                      <div className="space-y-3">
                        {profileData.activeChallenges.map((userChallenge) => {
                          const Icon = getBadgeIcon({ type: userChallenge.challenges?.type });
                          const progress = (userChallenge.current_progress / userChallenge.target_progress) * 100;
                          return (
                            <div
                              key={userChallenge.id}
                              className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                  <Icon className="w-6 h-6 text-amber-600" />
                                  <div>
                                    <h4 className="font-medium text-gray-800">
                                      {userChallenge.challenges?.title}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {userChallenge.current_progress}/{userChallenge.target_progress} {userChallenge.challenges?.unit}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-amber-600 font-bold">
                                  {Math.round(progress)}%
                                </div>
                              </div>
                              <div className="w-full bg-amber-200 rounded-full h-2">
                                <div
                                  className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {!profileData?.completedChallenges?.length && !profileData?.activeChallenges?.length && profileData?.stats && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                      <Trophy className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-800 mb-2">Système de challenges</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Participez aux challenges pour gagner des badges et des points !
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-white rounded p-3">
                          <div className="font-bold text-lg text-amber-600">{profileData.stats.totalReviews}</div>
                          <div className="text-gray-600">Avis postés</div>
                        </div>
                        <div className="bg-white rounded p-3">
                          <div className="font-bold text-lg text-amber-600">{profileData.stats.scannedProducts}</div>
                          <div className="text-gray-600">Produits scannés</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;