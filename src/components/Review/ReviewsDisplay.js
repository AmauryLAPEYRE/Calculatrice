// src/components/Review/ReviewsDisplay.js
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
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
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
  onUserClick
}) => {
  const { currentUser, userDetails } = useAuth();
  const [error, setError] = useState(null);
  const [showReceiptImage, setShowReceiptImage] = useState(null);
  const [reviewLikes, setReviewLikes] = useState({});
  const [hoveredReview, setHoveredReview] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

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

  if (!product) return null;

  const showDetailedRatings = product && (
    product.taste_rating > 0 || 
    product.quantity_rating > 0 || 
    product.price_rating > 0
  );

  return (
    <div className="space-y-8">
      {/* Hero Section des Avis */}
      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-white rounded-3xl p-8 shadow-xl border border-green-100">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Statistiques principales */}
          <div className="flex-1">
            <div className="flex items-center gap-6 mb-6">
              {/* Note principale GÉANTE */}
              <div className="text-center">
                <div className="text-6xl font-bold text-green-800 mb-2">
                  {averageRating.toFixed(2)}
                </div>
                <div className="flex justify-center mb-2">
                  {renderPreciseStars(averageRating, 28)}
                </div>
                <p className="text-green-600 font-medium">
                  {totalReviews} avis au total
                </p>
              </div>

              {/* Badges de confiance */}
              <div className="space-y-3">
                {verifiedReviews > 0 && (
                  <div className="flex items-center bg-green-100 px-4 py-2 rounded-full">
                    <CheckCircle size={20} className="text-green-600 mr-2" />
                    <span className="font-medium text-green-800">
                      {verifiedReviews} avis vérifiés
                    </span>
                  </div>
                )}

                {totalReviews > 10 && (
                  <div className="flex items-center bg-amber-100 px-4 py-2 rounded-full animate-pulse">
                    <TrendingUp size={20} className="text-amber-600 mr-2" />
                    <span className="font-medium text-amber-800">
                      Produit populaire
                    </span>
                  </div>
                )}

                {product.total_favorites > 0 && (
                  <div className="flex items-center bg-pink-100 px-4 py-2 rounded-full">
                    <Heart size={20} className="text-pink-600 fill-pink-600 mr-2" />
                    <span className="font-medium text-pink-800">
                      {product.total_favorites} favoris
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes détaillées avec barres de progression */}
            {showDetailedRatings && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {product.taste_rating > 0 && (
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Goût</span>
                      <span className="text-lg font-bold text-green-700">
                        {product.taste_rating.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${(product.taste_rating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {product.quantity_rating > 0 && (
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Quantité</span>
                      <span className="text-lg font-bold text-amber-700">
                        {product.quantity_rating.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-amber-400 to-amber-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${(product.quantity_rating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {product.price_rating > 0 && (
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Prix</span>
                      <span className="text-lg font-bold text-blue-700">
                        {product.price_rating.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${(product.price_rating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Historique des prix */}
            {product.average_price > 0 && (
              <div className="mt-6">
                <PriceHistory 
                  productCode={product.code} 
                  averagePrice={product.average_price} 
                />
              </div>
            )}
          </div>

          {/* CTA pour donner son avis */}
          <div className="text-center">
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

            {!currentUser && (
              <p className="text-sm text-gray-500 mt-3">
                Connectez-vous pour partager votre expérience
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section des avis */}
      <div>
        <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
          <MessageSquare size={28} className="mr-3 text-green-600" />
          Avis des utilisateurs
          {totalReviews > 0 && (
            <span className="ml-3 text-lg font-normal text-gray-600">
              ({totalReviews} avis)
            </span>
          )}
        </h3>

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
            {reviews.map((review, index) => (
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
<<<<<<< HEAD
                      {/* Avatar utilisateur cliquable */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 ${
                          review.review_source === 'ai'
                            ? 'bg-gradient-to-br from-red-400 to-red-600' // Avatar rouge pour IA
                            : 'bg-gradient-to-br from-green-400 to-green-600 cursor-pointer hover:from-green-500 hover:to-green-700 transition-all transform hover:scale-110 hover-pulse' // Avatar vert cliquable pour utilisateurs
                        }`}
                        onClick={() => review.review_source !== 'ai' && handleUserClick(review)}
                        >
                          {review.review_source === 'ai' ? '🤖' : review.user_name.charAt(0).toUpperCase()}
                        </div>                      
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
                          {review.review_source !== 'ai' && review.is_verified  && (
=======
                      {/* Avatar utilisateur */}
                      <div 
                        className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 cursor-pointer hover:from-green-500 hover:to-green-700 transition-all"
                        onClick={() => onUserClick && onUserClick(review.user_id, review.user_name)}
                      >
                        {review.user_name.charAt(0).toUpperCase()}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 
                            className="font-semibold text-green-800 cursor-pointer hover:text-green-600 transition-colors"
                            onClick={() => onUserClick && onUserClick(review.user_id, review.user_name)}
                          >
                            {review.user_name}
                          </h4>
                          {review.is_verified && (
>>>>>>> 2a08158ed3439faebfc2602d126eb315f82c366a
                            <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full flex items-center font-medium">
                              <CheckCircle size={14} className="mr-1" />
                              Achat vérifié
                            </span>
                          )}
          {review.review_source === 'ai' && (
            <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full flex items-center font-medium">
              <CheckCircle size={14} className="mr-1" />
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
                {review.review_source === 'ai' && (
  <div className="bg-red-100 border-l-4 border-red-400 p-4 mx-6 mt-4 rounded">
    <div className="flex items-center">
      <div className="text-red-600 text-sm">
        <strong>Avis simulé :</strong> Cet avis a été généré par intelligence artificielle à des fins de démonstration.
      </div>
    </div>
  </div>
)}
                {/* Corps de l'avis */}
                <div className="p-6">
                  {/* Notes détaillées */}
                  {Object.keys(review.ratings).length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {Object.entries(review.ratings).map(([key, value]) => (
                        <div 
                          key={key} 
                          className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-2"
                        >
                          <span className="text-sm text-gray-600">{value.display_name}:</span>
                          {renderPreciseStars(value.rating, 14)}
                          <span className="text-sm font-medium text-gray-800">
                            {value.rating}/5
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Commentaire */}
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>

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

                        {review.purchase_price && review.review_source != 'ai' &&(
                          <div className="flex items-center text-sm">
                            <span className="font-medium text-green-700">
                              {formatPrice(review.purchase_price)}
                            </span>
                          </div>
                        )}
                        {review.purchase_price && review.review_source === 'ai' &&(
                          <div className="flex items-center text-sm">
                            <span className="font-medium text-red-700">
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
            ))}
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