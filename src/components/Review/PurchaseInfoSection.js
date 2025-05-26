// src/components/review/PurchaseInfoSection.js
import React from 'react';
import { Calendar, DollarSign, ShoppingBag, MapPin } from 'lucide-react';
import { formatDate, formatPrice } from '../../utils/formatters';

/**
 * Section pour afficher les informations d'achat extraites
 */
const PurchaseInfoSection = ({
  aiDataAvailable,
  purchaseDate,
  purchasePrice,
  storeName,
  postalCode
}) => {
  if (!aiDataAvailable) {
    return null;
  }

  const hasAnyInfo = purchaseDate || purchasePrice || storeName || postalCode ;
  
  if (!hasAnyInfo) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium text-gray-800 mb-3">Informations d'achat extraites</h4>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
        {purchaseDate && (
          <PurchaseInfoItem
            icon={<Calendar size={16} className="text-green-600" />}
            label="Date d'achat"
            value={formatDate(purchaseDate)}
          />
        )}
                {storeName && (
          <PurchaseInfoItem
            icon={<ShoppingBag size={16} className="text-green-600" />}
            label="Magasin"
            value={storeName}
          />
        )}
        
        </div>
        <div className="grid grid-cols-2 gap-4">
                    {purchasePrice && (
          <PurchaseInfoItem
            icon={<DollarSign size={16} className="text-green-600" />}
            label="Prix d'achat"
            value={formatPrice(parseFloat(purchasePrice))}
          />
        )}


        {postalCode && (
          <PurchaseInfoItem
            icon={<MapPin size={16} className="text-green-600" />}
            label="Code Postal"
            value={postalCode}
          />
        )}
        </div>
        <p className="text-xs text-gray-500 italic mt-1">
          Ces informations ont été extraites automatiquement de votre ticket de caisse par IA.
        </p>
      </div>
    </div>
  );
};

/**
 * Item individuel pour une information d'achat
 */
const PurchaseInfoItem = ({ icon, label, value }) => {
  return (
    <div className="flex items-center">
      {icon}
      <span className="ml-2 text-gray-700">
        {label} : <strong>{value}</strong>
      </span>
    </div>
  );
};

export default PurchaseInfoSection;