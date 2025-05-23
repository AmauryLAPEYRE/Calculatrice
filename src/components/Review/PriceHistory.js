// Composant PriceHistory modifié avec le pseudo et le code postal
import React, { useState, useEffect } from 'react';
import { getProductRecentPrices } from '../../services/reviewService';
import { formatPrice, formatDate } from '../../utils/formatters';
import { ChevronDown, ShoppingBag, Calendar, DollarSign, CheckCircle, Star, User } from 'lucide-react';

const PriceHistory = ({ productCode, averagePrice }) => {
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
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
      }
    };
    
    fetchPriceHistory();
  }, [productCode]);
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className="price-history">
      <div className="flex items-center justify-between">
        <div className="font-medium text-gray-700">Prix moyen: <span className="font-bold text-green-700">{formatPrice(averagePrice)}</span></div>
        
        {priceHistory.length > 0 && (
          <button 
            onClick={toggleExpanded}
            className="text-green-600 hover:text-green-800 flex items-center text-sm"
          >
            {isExpanded ? 'Masquer' : 'Voir'} les 10 derniers
            <ChevronDown size={16} className={`ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      
      {isExpanded && (
        <div className="mt-2 border border-gray-200 rounded-md max-h-60 overflow-y-auto">
          <ul className="divide-y divide-gray-200">
            {priceHistory.map((item, index) => (
              <li key={index} className="px-4 py-2 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center text-gray-700 text-sm">
                      <Calendar size={14} className="text-gray-500 mr-1" />
                      {formatDate(item.purchase_date)}
                    </span>
                    {/* Ajout du pseudo utilisateur */}
                    <span className="flex items-center text-gray-700 text-sm">
                      <User size={14} className="text-gray-500 mr-1" />
                      {item.user_display_name}
                    </span>
                    <span className="flex items-center text-gray-700 text-sm">
                      <ShoppingBag size={14} className="text-gray-500 mr-1" />
                      {item.store_name || 'Non spécifié'}
                      {/* Ajout du code postal si disponible */}
                      {item.code_postal && ` (${item.code_postal})`}
                    </span>
                    {item.average_rating && (
                      <span className="flex items-center text-gray-700 text-sm">
                        <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
                        {parseFloat(item.average_rating).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-green-700 font-medium">
                    <DollarSign size={14} className="text-green-500" />
                    {formatPrice(item.purchase_price)}
                    {item.is_verified && (
                      <CheckCircle size={14} className="ml-1 text-green-600" title="Prix vérifié" />
                    )}
                  </div>
                </div>
              </li>
            ))}
            {priceHistory.length === 0 && (
              <li className="px-4 py-3 text-center text-gray-500">
                Aucun historique de prix disponible
              </li>
            )}
          </ul>
        </div>
      )}
      
      {loading && (
        <div className="text-center py-2">
          <span className="text-sm text-gray-500">Chargement de l'historique...</span>
        </div>
      )}
    </div>
  );
};

export default PriceHistory;