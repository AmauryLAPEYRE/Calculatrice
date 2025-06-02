// src/components/product/SearchResultItem.js
import React, { useState, useEffect, useRef } from 'react';
import { Star, MessageSquare, Heart, ChevronRight, TrendingUp, ShoppingBag } from 'lucide-react';
import { filterProductByAllFields } from '../../utils/searchUtils';
import FavoriteButton from '../FavoriteButton';
import { getProductDetails } from '../../services/productService';

const SearchResultItem = ({ result, onSelect, searchFilters = {} }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fetchAttempted = useRef(false);

  // S'assurer que searchFilters est bien un objet avec les propriétés attendues
  const filters = {
    withIngredients: Array.isArray(searchFilters?.withIngredients) ? searchFilters.withIngredients : [],
    withoutIngredients: Array.isArray(searchFilters?.withoutIngredients) ? searchFilters.withoutIngredients : []
  };

  // Récupérer les données détaillées du produit
  useEffect(() => {
    if (result.average_rating !== undefined && 
        result.average_price !== undefined && 
        result.total_favorites !== undefined) {
      return;
    }
    
    if (loading || productDetails || fetchAttempted.current) {
      return;
    }

    const fetchProductDetails = async () => {
      setLoading(true);
      fetchAttempted.current = true;
      
      try {
        const cachedProduct = localStorage.getItem(`product_details_${result.code}`);
        if (cachedProduct) {
          try {
            const parsedProduct = JSON.parse(cachedProduct);
            const cacheTime = parsedProduct._cacheTime || 0;
            if (Date.now() - cacheTime < 24 * 60 * 60 * 1000) {
              setProductDetails(parsedProduct);
              return;
            }
          } catch (e) {
            // Ignorer les erreurs de parsing
          }
        }

        const { success, data } = await getProductDetails(result.code);
        if (success && data) {
          data._cacheTime = Date.now();
          localStorage.setItem(`product_details_${result.code}`, JSON.stringify(data));
          setProductDetails(data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [result.code]);

  // Déterminer les valeurs à afficher
  const averageRating = productDetails?.average_rating || result.average_rating || 0;
  const averagePrice = productDetails?.average_price || result.average_price || 0;
  const totalReviews = productDetails?.total_reviews || result.reviews_count || 0;
  const totalFavorites = productDetails?.total_favorites || result.favorites_count || 0;

  // Fonction sécurisée pour vérifier les ingrédients
  const safelyCheckIngredient = (ingredient, isIncluded) => {
    try {
      if (isIncluded) {
        return filterProductByAllFields(result, { 
          withIngredients: [ingredient], 
          withoutIngredients: [] 
        });
      } else {
        return !filterProductByAllFields(result, { 
          withIngredients: [], 
          withoutIngredients: [ingredient] 
        });
      }
    } catch (error) {
      console.error('Erreur lors du filtrage:', error);
      return false;
    }
  };

  // Gestionnaire de clic
  const handleSelect = () => {
    if (typeof onSelect === 'function') {
      onSelect(result.code);
    }
  };

  return (
    <div 
      className="group p-6 hover:bg-gradient-to-r hover:from-green-50 hover:to-white cursor-pointer transition-all duration-300 relative"
      onClick={handleSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center">
        {/* Image du produit avec effet hover */}
        <div className="relative w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden mr-6 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
          {result.image_url ? (
            <img 
              src={result.image_url} 
              alt={result.product_name || 'Produit'} 
              className="w-full h-full object-cover"
              onError={(e) => e.target.src = '/placeholder.png'}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
              <ShoppingBag size={24} className="text-green-400" />
            </div>
          )}
          
          {/* Badge populaire si beaucoup de favoris */}
          {totalFavorites > 10 && (
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs px-2 py-0.5 rounded-full shadow-lg animate-pulse">
              <TrendingUp size={10} className="inline mr-1" />
              Populaire
            </div>
          )}
        </div>
        
        {/* Contenu principal */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-semibold text-green-800 text-lg group-hover:text-green-600 transition-colors">
                {result.product_name || 'Produit sans nom'}
              </h4>
              {result.brands && (
                <p className="text-sm text-gray-600 mt-1">{result.brands}</p>
              )}
            </div>
            
            {/* Bouton favori avec animation */}
            <div className="flex items-center space-x-2 ml-4" onClick={(e) => e.stopPropagation()}>
              <FavoriteButton 
                productCode={result.code}
                productData={{
                  product_name: result.product_name,
                  brands: result.brands,
                  image_url: result.image_url
                }}
                size="sm"
              />
            </div>
          </div>
          
          {/* Statistiques du produit avec design moderne */}
          <div className="flex flex-wrap items-center gap-4 mt-3">
            {/* Note moyenne avec étoiles */}
            <div className="flex items-center bg-amber-50 px-3 py-1 rounded-full">
              <div className="flex mr-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={14} 
                    className={`${star <= Math.round(averageRating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} 
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-amber-700">
                {averageRating.toFixed(2)}
              </span>
            </div>
            
            {/* Nombre d'avis */}
            <div className="flex items-center text-sm text-gray-600">
              <MessageSquare size={14} className="text-green-500 mr-1" />
              <span>{totalReviews} avis</span>
            </div>
            
            {/* Nombre de favoris */}
            <div className="flex items-center text-sm text-gray-600">
              <Heart size={14} className={`mr-1 ${totalFavorites > 0 ? "text-pink-500 fill-pink-500" : "text-gray-400"}`} />
              <span>{totalFavorites} suivis</span>
            </div>
            
            {/* Prix moyen */}
            {averagePrice > 0 && (
              <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                <span className="font-semibold">
                  {averagePrice.toFixed(2).replace('.', ',')} €
                </span>
              </div>
            )}
          </div>
          
          {/* Badges de filtres avec nouveau design */}
          {(filters.withIngredients.length > 0 || filters.withoutIngredients.length > 0) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {filters.withIngredients.map(ing => {
                const hasIngredient = safelyCheckIngredient(ing, true);
                return (
                  <span 
                    key={`with-${ing}`} 
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      hasIngredient 
                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300' 
                        : 'bg-red-100 text-red-700 line-through border border-red-200'
                    }`}
                  >
                    AVEC {ing}
                  </span>
                );
              })}
              
              {filters.withoutIngredients.map(ing => {
                const hasIngredient = !safelyCheckIngredient(ing, false);
                return (
                  <span 
                    key={`without-${ing}`} 
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      !hasIngredient 
                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300' 
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}
                  >
                    SANS {ing}
                  </span>
                );
              })}
            </div>
          )}
          
          {/* Code produit discret */}
          <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
            <span className="font-mono">Code: {result.code}</span>
          </div>
        </div>
        
        {/* Flèche animée au hover */}
        <ChevronRight 
          size={20} 
          className={`text-green-400 ml-4 transition-all duration-300 ${
            isHovered ? 'translate-x-2 text-green-600' : ''
          }`} 
        />
      </div>
    </div>
  );
};

export default SearchResultItem;