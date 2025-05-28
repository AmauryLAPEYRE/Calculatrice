// src/components/FavoriteButton.js
import React, { useState, useEffect } from 'react';
import { Star, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

const FavoriteButton = ({ productCode, productData, size = 'md' }) => {
  const { currentUser, userDetails, subscriptionPlan, refreshUserDetails } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const canUseFavorites = subscriptionPlan?.can_favorite || false;

  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 28
  };

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!currentUser || !userDetails || !productCode) return;
      
      try {
        const { data, error } = await supabase
          .from('favorite_products')
          .select('id')
          .eq('user_id', userDetails.id)
          .eq('product_code', productCode)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error("Erreur lors de la vérification des favoris:", error);
          return;
        }
        
        setIsFavorite(!!data);
      } catch (err) {
        console.error("Erreur lors de la vérification des favoris:", err);
      }
    };

    checkIfFavorite();
  }, [currentUser, userDetails, productCode]);

  const toggleFavorite = async () => {
    if (!currentUser) {
      setError("Connectez-vous pour ajouter aux favoris");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    if (!canUseFavorites) {
      setError("Fonctionnalité premium");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setLoading(true);
    setIsAnimating(true);
    
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorite_products')
          .delete()
          .eq('user_id', userDetails.id)
          .eq('product_code', productCode);
          
        if (error) throw error;
        
        setIsFavorite(false);
      } else {
        const { error } = await supabase
          .from('favorite_products')
          .insert([
            {
              user_id: userDetails.id,
              product_code: productCode,
              product_name: productData?.product_name || null,
              product_brand: productData?.brands || null,
              product_image_url: productData?.image_url || null,
      product_nutriscore: (productData?.nutriscore_grade && productData.nutriscore_grade.length === 1) 
        ? productData.nutriscore_grade 
        : null
            }
          ]);
          
        if (error) throw error;
        
        setIsFavorite(true);
      }
      
      if (refreshUserDetails) {
        refreshUserDetails();
      }
      
      setTimeout(() => setIsAnimating(false), 600);
    } catch (err) {
      console.error("Erreur lors de la modification des favoris:", err);
      setError("Une erreur est survenue");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleFavorite}
        disabled={loading}
        className={`
          ${sizes[size]} 
          relative rounded-full 
          flex items-center justify-center 
          transition-all duration-300 
          transform hover:scale-110 active:scale-95
          ${isFavorite 
            ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg hover:shadow-xl' 
            : 'bg-white border-2 border-gray-200 text-gray-400 hover:border-pink-300 hover:text-pink-500 shadow-md hover:shadow-lg'
          } 
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          ${isAnimating ? 'animate-bounce' : ''}
        `}
        title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <Heart 
          className={`
            transition-all duration-300
            ${isFavorite ? 'fill-current' : ''}
          `} 
          size={iconSizes[size]}
        />
        
        {/* Effet sparkle quand on ajoute aux favoris */}
        {isAnimating && isFavorite && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Sparkles 
              size={iconSizes[size] * 1.5} 
              className="text-yellow-300 animate-ping"
            />
          </div>
        )}
        
        {/* Badge pour le nombre de favoris si disponible */}
        {productData?.total_favorites > 0 && (
          <div className="absolute -bottom-1 -right-1 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm">
            {productData.total_favorites > 99 ? '99+' : productData.total_favorites}
          </div>
        )}
      </button>

      {/* Message d'erreur moderne */}
      {showError && (
        <div className="absolute top-full mt-3 right-0 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm px-4 py-2 rounded-lg shadow-xl whitespace-nowrap z-20 animate-fadeIn">
          <div className="relative">
            {error}
            {error === "Fonctionnalité premium" && (
              <Star size={14} className="inline ml-2 text-yellow-300" />
            )}
          </div>
          <div className="absolute -top-2 right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-red-500"></div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FavoriteButton;