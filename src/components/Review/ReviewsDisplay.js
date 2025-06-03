// src/components/Review/ReviewsDisplay.js - Version modifiée
import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  AlertCircle, 
  Loader, 
  ShoppingBag, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Heart,
  CheckCircle,
  TrendingUp,
  Award,
  Users,
  Sparkles,
  Shield,
  Camera,
  BarChart3,
  ChevronRight,
  Tag, // Nouveau : pour les critères
  Bot,  // Nouveau : pour les avis IA
  Info  // Nouveau : pour les informations
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import UserAvatar from '../profile/UserAvatar';
import { 
  toggleReviewLike,
  checkUserLike,
  getReceiptImage
} from '../../services/reviewService';
import { formatPrice } from '../../utils/formatters';
import PriceHistory from './PriceHistory';
import UserProfileModal from '../profile/UserProfileModal';

const ReviewsDisplay = ({ 
  product, 
  onAddReviewClick, 
  buttonState = {},
  loading = false,
  reviews = [],
  totalReviews = 0,
  averageRating = 0,
  verifiedReviews = 0,
  // NOUVELLES PROPS
  productCriterias = [], // Critères spécifiques au produit
  categoryInfo = null    // Informations de catégorie
}) => {
  const { currentUser, userDetails } = useAuth();
  const [error, setError] = useState(null);
  const [showReceiptImage, setShowReceiptImage] = useState(null);
  const [reviewLikes, setReviewLikes] = useState({});
  const [hoveredReview, setHoveredReview] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCriteriaInfo, setShowCriteriaInfo] = useState(false); // NOUVEAU

  // Vérifier les likes
  useEffect(() => {
    const checkLikes = async () => {
      if (!currentUser || !userDetails || reviews.length === 0) return;

      const newLikes = {};
      for (const review of reviews) {
        const { success, hasLiked } = await checkUserLike(userDetails.id, review.id);
        if (success) {
          newLikes[review.id] = hasLiked;
        }
      }
      setReviewLikes(newLikes);
    };

    checkLikes();
  }, [currentUser, userDetails, reviews]);

  const handleUserClick = (review) => {
    // Ne pas ouvrir la modal pour les avis IA
    if (review.review_source === 'ai') {
      return;
    }
    
    // Vérifier qu'on a bien les données nécessaires
    if (review.user_id && review.user_name) {
      console.log('Opening modal for user:', review.user_id, review.user_name); // Debug
      setSelectedUser({ 
        userId: review.user_id,
        userName: review.user_name 
      });
      setShowUserModal(true);
    } else {
      console.error('Missing user data:', review); // Debug si données manquantes
    }
  };

  const handleViewReceipt = async (reviewId) => {
    try {
      const { success, receiptUrl, error } = await getReceiptImage(reviewId);
      if (success && receiptUrl) {
        setShowReceiptImage(receiptUrl);
      } else {
        console.error("Erreur lors de la récupération du ticket:", error);
      }
    } catch (err) {
      console.error("Erreur lors de l'affichage du ticket:", err);
    }
  };

  const handleCloseReceiptModal = () => {
    setShowReceiptImage(null);
  };

  const handleLikeReview = async (reviewId) => {
    if (!currentUser || !userDetails) {
      setError("Vous devez être connecté pour aimer un avis");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const currentlyLiked = reviewLikes[reviewId] || false;

    try {
      const { success } = await toggleReviewLike(userDetails.id, reviewId, !currentlyLiked);

      if (success) {
        setReviewLikes(prev => ({
          ...prev,
          [reviewId]: !currentlyLiked
        }));
      }
    } catch (err) {
      console.error("Erreur lors de l'ajout/retrait du like:", err);
    }
  };

  const renderPreciseStars = (rating, size = 20) => {
    const ratingNum = parseFloat(rating);

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          let fillPercentage = 0;

          if (ratingNum >= star) {
            fillPercentage = 100;
          } else if (ratingNum > star - 1) {
            fillPercentage = Math.round((ratingNum - (star - 1)) * 100);
          }

          return (
            <div key={star} className="relative" style={{ width: size, height: size }}>
              <Star size={size} className="absolute text-gray-300" />
              {fillPercentage > 0 && (
                <div 
                  className="absolute overflow-hidden" 
                  style={{ width: `${fillPercentage}%`, height: '100%' }}
                >
                  <Star size={size} className="text-amber-400 fill-amber-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // NOUVELLE FONCTION : Mapper les critères avec les ratings
  const getCriteriaDisplayInfo = (review) => {
    if (!productCriterias || productCriterias.length === 0) {
      // Fallback sur l'affichage existant si pas de critères spécifiques
      return Object.entries(review.ratings || {}).map(([key, value]) => ({
        id: key,
        name: key,
        display_name: value.display_name,
        rating: value.rating,
        weight: value.weight || 1.0,
        isFromProductCriteria: false
      }));
    }

    // Utiliser les critères spécifiques au produit
    return productCriterias.map(criteria => {
      // Trouver le rating correspondant dans l'avis
      const ratingEntry = Object.entries(review.ratings || {}).find(([key, value]) => {
        return criteria.name === key || criteria.id === value.criteria_id || criteria.name === value.name;
      });

      return {
        id: criteria.id,
        name: criteria.name,
        display_name: criteria.display_name,
        rating: ratingEntry ? ratingEntry[1].rating : 0,
        weight: criteria.weight,
        description: criteria.description,
        isFromProductCriteria: true
      };
    });
  };

  // NOUVELLE FONCTION : Afficher les informations sur les critères utilisés
  const renderCriteriaInfoSection = () => {
    if (!productCriterias || productCriterias.length === 0) return null;

    return (
      <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Tag size={18} className="text-blue-600" />
            <span className="font-semibold text-blue-800">
              Critères d'évaluation utilisés
              {categoryInfo?.categoryDisplayName && (
                <span className="text-sm font-normal text-blue-600 ml-2">
                  ({categoryInfo.categoryDisplayName})
                </span>
              )}
            </span>
          </div>
          <button
            onClick={() => setShowCriteriaInfo(!showCriteriaInfo)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ChevronRight 
              size={16} 
              className={`transform transition-transform ${showCriteriaInfo ? 'rotate-90' : ''}`} 
            />
          </button>
        </div>
        
        {showCriteriaInfo && (
          <div className="space-y-2">
            <p className="text-sm text-blue-700 mb-3">
              Les avis sont évalués selon ces critères spécifiques à la catégorie du produit :
            </p>
            {productCriterias.map((criteria, index) => (
              <div key={criteria.id} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg">
                <div className="flex-1">
                  <span className="font-medium text-gray-800">{criteria.display_name}</span>
                  {criteria.description && (
                    <p className="text-sm text-gray-600 mt-1">{criteria.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Coef.</span>
                  <span className="font-bold text-blue-600">{criteria.weight}</span>
                </div>
              </div>
            ))}
            {!categoryInfo?.hasCategory && (
              <div className="mt-2 p-2 bg-amber-100 rounded-lg">
                <p className="text-xs text-amber-800">
                  💡 Ce produit utilise les critères par défaut. 
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!product) return null;

  const showDetailedRatings = product && (
    product.taste_rating > 0 || 
    product.quantity_rating > 0 || 
    product.price_rating > 0
  );

  return (
    <div className="space-y-8">
      {/* NOUVELLE SECTION : Informations sur les critères */}
      {renderCriteriaInfoSection()}

      {/* Section des avis */}
      <div>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Avis utilisateur */}
          <div className="flex text-center">
            <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
              <MessageSquare size={28} className="mr-3 text-green-600" />
              Avis des utilisateurs
              {totalReviews > 0 && (
                <span className="ml-3 text-lg font-normal text-gray-600">
                  ({totalReviews} avis)
                </span>
              )}
            </h3>
          </div>
          {/* Bouton Donner mon avis */}
          <div className="flex text-center mb-4">
            <button
              onClick={onAddReviewClick}
              className={`group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center ${
                buttonState.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={buttonState.disabled}
              title={buttonState.tooltip || ''}
            >
              <MessageSquare size={24} className="mr-3" />
              <span className="text-lg">{buttonState.message || "Donner mon avis"}</span>
              <Sparkles size={16} className="ml-2 animate-pulse" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start animate-fadeIn">
            <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-green-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <p className="mt-4 text-green-600 font-medium">Chargement des avis...</p>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review, index) => {
              // NOUVEAU : Récupérer les informations des critères pour cet avis
              const criteriaDisplayInfo = getCriteriaDisplayInfo(review);
              
              return (
                <div 
                  key={review.id} 
                  className={`group rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] border overflow-hidden ${
                    review.review_source === 'ai' 
                      ? 'bg-white border-red-200' // Fond blanc avec bordure rouge pour les avis IA
                      : 'bg-white border-gray-100'  // Fond blanc avec bordure grise pour les avis utilisateurs
                  }`}
                  onMouseEnter={() => setHoveredReview(review.id)}
                  onMouseLeave={() => setHoveredReview(null)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* En-tête de l'avis */}
                  <div className={`${
                    review.review_source === 'ai' 
                      ? 'bg-gradient-to-r from-red-100 to-red-50' // En-tête rouge pour IA
                      : 'bg-gradient-to-r from-green-50 to-emerald-50' // En-tête verte pour utilisateurs
                  } p-6`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        {/* Avatar utilisateur avec UserAvatar ou emoji robot pour IA */}
                        {review.review_source === 'ai' ? (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                            <Bot size={24} />
                          </div>
                        ) : (
                          <div 
                            className="mr-4 cursor-pointer"
                            onClick={() => handleUserClick(review)}
                          >
                            <UserAvatar 
                              userId={review.user_firebase_uid || `user-${review.user_id}`}
                              size={48}
                              status={review.user_status || 'bronze'}
                              displayName={review.user_name}
                              customAvatarUrl={review.user_avatar_url}
                              avatarSeed={review.user_avatar_seed || review.user_firebase_uid || `user-${review.user_id}`}
                              className="hover:scale-110 transition-transform duration-300 shadow-md"
                              showBorder={true}
                            />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 
                              className={`font-semibold ${
                                review.review_source === 'ai' 
                                  ? 'text-gray-800' 
                                  : 'text-green-800 cursor-pointer hover:text-green-600 transition-colors hover:underline'
                              }`}
                              onClick={() => review.review_source !== 'ai' && handleUserClick(review)}
                            >
                              {review.user_name}
                            </h4>
                            {review.review_source !== 'ai' && review.is_verified && (
                              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full flex items-center font-medium">
                                <CheckCircle size={14} className="mr-1" />
                                Achat vérifié
                              </span>
                            )}
                            {review.review_source === 'ai' && (
                              <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full flex items-center font-medium">
                                <Bot size={14} className="mr-1" />
                                Généré par l'IA
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{formatDate(review.date)}</p>
                        </div>
                      </div>

                      {/* Bouton like */}
                      <button 
                        className={`group/like p-3 rounded-full transition-all duration-300 ${
                          reviewLikes[review.id] 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600'
                        }`}
                        onClick={() => handleLikeReview(review.id)}
                      >
                        <div className="flex items-center">
                          <ThumbsUp 
                            size={20} 
                            className={`transition-transform group-hover/like:scale-110 ${
                              reviewLikes[review.id] ? 'fill-green-600' : ''
                            }`} 
                          />
                          {review.likes_count > 0 && (
                            <span className="ml-2 font-medium">{review.likes_count}</span>
                          )}
                        </div>
                      </button>
                    </div>

                    {/* Note principale */}
                    <div className="mt-4 flex items-center gap-3">
                      {renderPreciseStars(review.average_rating, 24)}
                      <span className={`text-xl font-bold ${
                        review.review_source === 'ai' ? 'text-red-800' : 'text-green-800'
                      }`}>
                        {parseFloat(review.average_rating).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Bandeau d'information pour les avis IA */}
                  {review.review_source === 'ai' && (
                    <div className="bg-red-100 border-l-4 border-red-400 p-4 mx-6 mt-4 rounded">
                      <div className="flex items-center">
                        <Info size={16} className="text-red-600 mr-2" />
                        <div className="text-red-600 text-sm">
                          <strong>Avis simulé :</strong> Cet avis a été généré par intelligence artificielle à des fins de démonstration.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Corps de l'avis */}
                  <div className="p-6">
                    {/* NOUVELLE SECTION : Notes détaillées avec critères spécifiques */}
                    {criteriaDisplayInfo.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center mb-3">
                          <Tag size={16} className={`mr-2 ${
                            review.review_source === 'ai' ? 'text-red-600' : 'text-green-600'
                          }`} />
                          <span className="text-sm font-medium text-gray-700">
                            Évaluation par critères
                            {criteriaDisplayInfo[0]?.isFromProductCriteria && categoryInfo?.categoryDisplayName && (
                              <span className="text-xs text-gray-500 ml-2">
                                ({categoryInfo.categoryDisplayName})
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {criteriaDisplayInfo.map((criteria) => (
                            <div 
                              key={criteria.id} 
                              className={`rounded-lg px-3 py-3 flex flex-col gap-2 border ${
                                review.review_source === 'ai' 
                                  ? 'bg-red-50 border-red-200' 
                                  : 'bg-green-50 border-green-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-800">
                                  {criteria.display_name}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs text-gray-500">×</span>
                                  <span className={`text-xs font-bold ${
                                    review.review_source === 'ai' ? 'text-red-600' : 'text-green-600'
                                  }`}>
                                    {criteria.weight}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                {renderPreciseStars(criteria.rating, 16)}
                                <span className="text-sm font-medium text-gray-800">
                                  {criteria.rating}/5
                                </span>
                              </div>
                              {criteria.description && criteria.isFromProductCriteria && (
                                <p className="text-xs text-gray-600 mt-1">
                                  {criteria.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {/* Indication sur l'origine des critères */}
                        {criteriaDisplayInfo[0]?.isFromProductCriteria && (
                          <div className="mt-3 flex items-center text-xs text-gray-600">
                            <Info size={12} className="mr-1" />
                            <span>Critères spécialisés pour cette catégorie de produit</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Commentaire */}
                    {review.review_source === 'ai' ? (
                      <div className="bg-gradient-to-br from-red-50 to-red-25 rounded-lg p-4 border-l-4 border-red-300">
                        <p className="text-gray-700 leading-relaxed italic">
                          {review.comment}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-green-50 to-green-25 rounded-lg p-4 border-l-4 border-green-300">
                        <p className="text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    )}

                    {/* Informations d'achat */}
                    {(review.purchase_date || review.purchase_price || review.store_name) && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                          {review.review_source === 'ai' ? (
                            <BarChart3 size={16} className="mr-2 text-red-600" />     // Icône moyenne rouge pour IA
                          ) : (
                            <ShoppingBag size={16} className="mr-2 text-green-600" /> // Icône shopping verte pour utilisateurs
                          )}
                          {review.review_source === 'ai' ? 'Prix moyen' : 'Détails de l\'achat'}
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {review.purchase_date && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar size={14} className="text-gray-400 mr-2" />
                              {formatDate(review.purchase_date)}
                            </div>
                          )}

                          {review.purchase_price && (
                            <div className="flex items-center text-sm">
                              <DollarSign size={14} className="text-gray-400 mr-2" />
                              <span className={`font-medium ${
                                review.review_source === 'ai' ? 'text-red-700' : 'text-green-700'
                              }`}>
                                {formatPrice(review.purchase_price)}
                              </span>
                            </div>
                          )}
                          
                          {review.store_name && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin size={14} className="text-gray-400 mr-2" />
                              {review.store_name} {review.code_postal}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Bouton ticket de caisse */}
                    {review.can_show_receipt && (
                      <button
                        onClick={() => handleViewReceipt(review.id)}
                        className="mt-4 text-green-600 hover:text-green-700 text-sm font-medium flex items-center group/receipt"
                      >
                        <Camera size={16} className="mr-2 group-hover/receipt:scale-110 transition-transform" />
                        Voir le ticket de caisse
                        <ChevronRight size={14} className="ml-1 group-hover/receipt:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 text-center border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare size={32} className="text-gray-400" />
            </div>
            <h4 className="text-xl font-semibold text-gray-700 mb-3">
              Aucun avis pour le moment
            </h4>
            <p className="text-gray-500 mb-6">
              Soyez le premier à partager votre expérience avec ce produit !
            </p>
            <button
              onClick={onAddReviewClick}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center"
              disabled={buttonState.disabled}
            >
              <MessageSquare size={20} className="mr-2" />
              {buttonState.message || "Donner le premier avis"}
            </button>
          </div>
        )}
      </div>

      {/* Modal ticket de caisse */}
      {showReceiptImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl animate-fadeIn">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <Camera size={24} className="mr-3 text-green-600" />
                  Ticket de caisse vérifié
                </h3>
                <button
                  onClick={handleCloseReceiptModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-100 rounded-2xl p-4 flex justify-center max-h-[70vh] overflow-auto">
                <img
                  src={showReceiptImage}
                  alt="Ticket de caisse"
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleCloseReceiptModal}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de profil utilisateur */}
      <UserProfileModal
        userId={selectedUser?.userId}
        userName={selectedUser?.userName}
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
        }}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .hover-pulse:hover {
          animation: pulse 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default ReviewsDisplay;