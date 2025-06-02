// src/components/Review/PriceHistory.js - Design Responsive + Méthode Simple
import React, { useState, useEffect } from 'react';
import { 
  Euro, 
  MapPin, 
  User, 
  Calendar, 
  Star, 
  Eye, 
  EyeOff,
  TrendingUp,
  ShoppingBag,
  CheckCircle,
  ChevronDown
} from 'lucide-react';
import { getProductRecentPrices } from '../../services/reviewService';

const PriceHistory = ({ productCode, averagePrice }) => {
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // SIMPLE: Par défaut replié
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      if (!productCode) return;
      
      setLoading(true);
      try {
        const { success, priceHistory } = await getProductRecentPrices(productCode);
        if (success) {
          setPriceHistory(priceHistory || []);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique des prix:", error);
      } finally {
        setLoading(false);
        setIsVisible(true);
      }
    };
    
    fetchPriceHistory();
  }, [productCode]);
  
  // MÉTHODE SIMPLE qui fonctionne
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Fonction pour obtenir le drapeau du pays
  const getCountryFlag = (countryCode) => {
    switch (countryCode?.toUpperCase()) {
      case 'FR': return '🇫🇷';
      case 'BE': return '🇧🇪';
      case 'CH': return '🇨🇭';
      case 'LU': return '🇱🇺';
      default: return '🌍';
    }
  };

  // Fonction pour obtenir la couleur de la note
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-50';
    if (rating >= 3.5) return 'text-amber-600 bg-amber-50';
    if (rating >= 2.5) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
            <TrendingUp size={18} className="sm:w-5 sm:h-5 mr-2 text-blue-600" />
            <span className="hidden sm:inline">Prix moyen: </span>
            <span className="sm:hidden">Prix: </span>
            <span className="text-blue-600 ml-1">{averagePrice?.toFixed(2) || '0.00'}€</span>
          </h3>
        </div>
        
        {/* Skeleton loading responsive */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded w-16 sm:w-20"></div>
                  <div className="h-3 bg-gray-300 rounded w-12 sm:w-16"></div>
                  <div className="h-3 bg-gray-300 rounded w-14 sm:w-20"></div>
                </div>
                <div className="text-right space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-8 ml-auto"></div>
                  <div className="h-6 bg-gray-300 rounded w-12 ml-auto"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!priceHistory.length) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
            <TrendingUp size={18} className="sm:w-5 sm:h-5 mr-2 text-blue-600" />
            <span className="hidden sm:inline">Prix moyen: </span>
            <span className="sm:hidden">Prix: </span>
            <span className="text-blue-600 ml-1">{averagePrice?.toFixed(2) || '0.00'}€</span>
          </h3>
        </div>
        <div className="text-center py-6">
          <ShoppingBag size={32} className="sm:w-10 sm:h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm sm:text-base">
            <span className="hidden sm:inline">Aucun historique de prix disponible</span>
            <span className="sm:hidden">Pas d'historique</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      
      {/* HEADER: Prix moyen à GAUCHE + Bouton à DROITE - RESPONSIVE */}
      <div className="flex items-center justify-between mb-4">
        
        {/* GAUCHE: Prix moyen avec icône */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
          <TrendingUp size={18} className="sm:w-5 sm:h-5 mr-2 text-green-600" />
          <span className="hidden sm:inline">Prix moyen: </span>
          <span className="sm:hidden">Prix: </span>
          <span className="text-green-600 ml-1">{averagePrice?.toFixed(2) || '0.00'}€</span>
        </h3>
        
        {/* DROITE: Bouton de repliage - RESPONSIVE */}
        {priceHistory.length > 0 && (
          <button
            onClick={toggleExpanded}
            className="text-blue-600 hover:text-green-700 text-sm font-medium flex items-center transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {isExpanded ? (
              // État déplié - Bouton pour replier
              <>
                <EyeOff size={14} className="sm:w-4 sm:h-4 mr-1 text-green-700" />
                <span className="hidden sm:inline text-green-700">Masquer les 10 derniers</span>
                <span className="sm:hidden text-green-700">Masquer</span>
              </>
            ) : (
              // État replié - Bouton pour déplier  
              <>
                <Eye size={14} className="sm:w-4 sm:h-4 mr-1 text-green-700" />
                <span className="hidden sm:inline text-green-700">Voir les 10 derniers</span>
                <span className="sm:hidden text-green-700">Voir plus</span>
              </>
            )}
            <ChevronDown size={14} className={`sm:w-4 sm:h-4 ml-1 transition-transform duration-200 text-green-700 ${
              isExpanded ? 'rotate-180' : ''
            }`} />
          </button>
        )}
      </div>

      {/* CONTENU REPLIABLE: Design responsive en 2 colonnes */}
      {isExpanded && (
        <div className="space-y-2 sm:space-y-3">
          {priceHistory.map((item, index) => (
            <div 
              key={`price-${item.purchase_date}-${item.user_display_name}-${index}`}
              className={`grid grid-cols-2 gap-3 p-3 rounded-lg border transition-all duration-300 hover:shadow-md ${
                item.is_verified ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              {/* COLONNE 1: Date, User, Code postal, Pays - RESPONSIVE */}
              <div className="space-y-1 sm:space-y-1.5">
                {/* Date */}
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <Calendar size={12} className="sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                  <span className="font-medium">{formatDate(item.purchase_date)}</span>
                </div>
                
                {/* User */}
                <div className="flex items-center text-xs sm:text-sm text-gray-700">
                  <User size={12} className="sm:w-3 sm:h-3 mr-1 flex-shrink-0 text-green-600" />
                  <span className="truncate font-medium">{item.user_display_name}</span>
                  {item.is_verified && (
                    <CheckCircle size={12} className="sm:w-3 sm:h-3 ml-1 text-green-600 flex-shrink-0" />
                  )}
                </div>
                
                {/* Localisation : Code postal + Pays */}
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <MapPin size={12} className="sm:w-3 sm:h-3 mr-1 flex-shrink-0 text-gray-500" />
                  <span className="flex items-center">
                    {item.code_postal && (
                      <span className="font-mono">{item.code_postal}</span>
                    )}
                    {item.code_postal && item.country_code && (
                      <span className="mx-1">•</span>
                    )}
                    <span className="flex items-center">
                      <span className="mr-1">{getCountryFlag(item.country_code)}</span>
                      <span className="hidden sm:inline uppercase text-xs">{item.country_code || 'FR'}</span>
                    </span>
                  </span>
                </div>
                
                {/* Store name si disponible */}
                {item.store_name && (
                  <div className="text-xs text-gray-500 truncate">
                    <ShoppingBag size={12} className="inline w-3 h-3 mr-1" />
                    {item.store_name}
                  </div>
                )}
              </div>

              {/* COLONNE 2: Note et Prix - RESPONSIVE */}
              <div className="text-right space-y-2">
                {/* Note */}
                {item.average_rating > 0 && (
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${getRatingColor(item.average_rating)}`}>
                    <Star size={12} className="sm:w-3 sm:h-3 mr-1 fill-current" />
                    <span>{item.average_rating.toFixed(1)}</span>
                  </div>
                )}
                
                {/* Prix */}
                <div className="text-lg sm:text-xl font-bold text-gray-900 flex items-center justify-end">
                  <Euro size={14} className="sm:w-4 sm:h-4 mr-0.5" />
                  <span>{item.purchase_price.toFixed(2)}</span>
                </div>
                
                {/* Badge vérifié si nécessaire */}
                {item.is_verified && (
                  <div className="text-xs text-green-600 font-medium">
                    <span className="hidden sm:inline">Vérifié</span>
                    <span className="sm:hidden">✓</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer informatif - RESPONSIVE */}
      {priceHistory.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle size={12} className="sm:w-3 sm:h-3 mr-1 text-green-600" />
              <span className="hidden sm:inline">Prix vérifiés par ticket de caisse</span>
              <span className="sm:hidden">Prix vérifiés</span>
            </div>
            <div className="text-right">
              <span className="font-medium">{priceHistory.length}</span>
              <span className="ml-1 hidden sm:inline">prix enregistrés</span>
              <span className="ml-1 sm:hidden">prix</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceHistory;