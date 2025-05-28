// src/components/PageAvisEnhanced.js
import React, { useState } from 'react';
import ReviewsDisplay from './Review/ReviewsDisplay';
import ReviewForm from './Review/ReviewForm';
//import ReviewForm from './Review/ReviewForm/index';
import useProductReviews from '../hooks/useProductReviews';
import { formatDate } from '../utils/formatters';
import { AlertCircle } from 'lucide-react';
import UserProfileModal from './profile/UserProfileModal';

const PageAvisEnhanced = ({ product }) => {
  const [showAddReview, setShowAddReview] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const {
    loading,
    reviews,
    totalReviews,
    averageRating,
    verifiedReviews,
    tasteRating,
    quantityRating,
    priceRating,
    averagePrice,
    totalFavorites,
    submitReview,
    getUserPermissions,
    refreshReviews
  } = useProductReviews(product?.code);
  
  const { userReviewed, canLeaveReview, lastReviewDate, isLoggedIn } = getUserPermissions();

  const handleShowAddReview = () => {
    if (!isLoggedIn) {
      setError("Vous devez être connecté pour laisser un avis");
      setTimeout(() => setError(null), 5000);
      return;
    }
    
    if (userReviewed && !canLeaveReview) {
      return;
    }
    
    setShowAddReview(true);
  };

  const handleCancelAddReview = () => {
    setShowAddReview(false);
  };

  const handleReviewSuccess = async (reviewData) => {
    const result = await submitReview(reviewData);
    
    if (result.success) {
      setShowAddReview(false);
      setTimeout(() => {
        refreshReviews();
      }, 1000);
    }
    
    return result;
  };

  const getButtonMessage = () => {
    if (userReviewed && !canLeaveReview) {
      return "Avis déjà donné";
    }
    
    if (userReviewed && canLeaveReview) {
      return "Donner un nouvel avis";
    }
    
    return "Donner mon avis";
  };

  const getButtonTooltip = () => {
    if (userReviewed && !canLeaveReview && lastReviewDate) {
const nextMonth = new Date(new Date(lastReviewDate).setMonth(new Date(lastReviewDate).getMonth() + 1));
      
      return `Vous avez déjà laissé un avis le ${formatDate(lastReviewDate)}. 
              Vous pourrez laisser un nouvel avis à partir du ${formatDate(nextMonth)}.`;
    }
    return '';
  };

  if (!product) return null;
  
  // Enrichir l'objet product avec les données du hook
  const enrichedProduct = {
    ...product,
    average_rating: averageRating || product.average_rating || 0,
    total_reviews: totalReviews || product.total_reviews || 0,
    taste_rating: tasteRating || product.taste_rating || 0,
    quantity_rating: quantityRating || product.quantity_rating || 0,
    price_rating: priceRating || product.price_rating || 0,
    average_price: averagePrice || product.average_price || 0,
    total_favorites: totalFavorites || product.total_favorites || 0
  };
  
  return (
    <div className="animate-fadeIn">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
          <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
        </div>
      )}
      
      {showAddReview ? (
        <ReviewForm 
          product={enrichedProduct}
          onSuccess={handleReviewSuccess}
          onCancel={handleCancelAddReview}
        />
      ) : (
        <ReviewsDisplay 
          product={enrichedProduct}
          onAddReviewClick={handleShowAddReview}
          buttonState={{
            disabled: userReviewed && !canLeaveReview,
            message: getButtonMessage(),
            tooltip: getButtonTooltip()
          }}
          loading={loading}
          reviews={reviews}
          totalReviews={totalReviews}
          averageRating={averageRating}
          verifiedReviews={verifiedReviews}
          onUserClick={(userId, userName) => setSelectedUser({ userId, userName })}
        />
      )}
      
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
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
      
      {/* Modal du profil utilisateur */}
      <UserProfileModal
        userId={selectedUser?.userId}
        userName={selectedUser?.userName}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
};

export default PageAvisEnhanced;