// src/components/review/ReceiptSection.js
import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import ReceiptUploadEnhanced from '../ReceiptUploadEnhanced';
import ReceiptItemSelector from '../ReceiptItemSelector';
import { formatPrice } from '../../utils/formatters';

/**
 * Section pour la gestion du ticket de caisse
 */
const ReceiptSection = ({
  receiptUploaded,
  receiptItems,
  selectedItem,
  isItemListExpanded,
  showLowMatchAlert,
  matchScore,
  validationErrors,
  authorizeReceiptSharing,
  product,
  onReceiptUpload,
  onReceiptItemsChange,
  onSelectItem,
  onToggleItemList,
  onAuthorizeReceiptSharingChange
}) => {
  if (!receiptUploaded) {
    return (
      <div>
        <label className="block text-gray-700 font-medium mb-2">Ticket de caisse</label>
        <p className="text-sm text-gray-600 mb-3">
          Pour valider votre avis, veuillez télécharger une photo de votre ticket de caisse montrant l'achat du produit.
        </p>
        <ReceiptUploadEnhanced 
          onUploadComplete={onReceiptUpload} 
          productCode={product.code}
          productName={product.product_name}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Confirmation du ticket uploadé */}
      <ReceiptConfirmation 
        authorizeReceiptSharing={authorizeReceiptSharing}
        onAuthorizeReceiptSharingChange={onAuthorizeReceiptSharingChange}
      />
      
      {/* Sélection des articles si disponibles */}
      {receiptItems.length > 0 && (
        <ReceiptItemsSelection
          receiptItems={receiptItems}
          selectedItem={selectedItem}
          isItemListExpanded={isItemListExpanded}
          showLowMatchAlert={showLowMatchAlert}
          matchScore={matchScore}
          validationErrors={validationErrors}
          product={product}
          onReceiptItemsChange={onReceiptItemsChange}
          onSelectItem={onSelectItem}
          onToggleItemList={onToggleItemList}
        />
      )}
    </div>
  );
};

/**
 * Sous-composant pour la confirmation du ticket
 */
const ReceiptConfirmation = ({ authorizeReceiptSharing, onAuthorizeReceiptSharingChange }) => {
  return (
    <div className="p-3 bg-green-50 rounded-md">
      <p className="text-green-700 flex items-center mb-3">
        <CheckCircle size={16} className="mr-2" />
        Ticket de caisse validé
      </p>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="authorizeSharing"
          className="mr-2 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          checked={authorizeReceiptSharing}
          onChange={(e) => onAuthorizeReceiptSharingChange(e.target.checked)}
        />
        <label htmlFor="authorizeSharing" className="text-sm text-gray-700">
          J'autorise le partage anonymisé de mon ticket de caisse
        </label>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Cette option permet aux autres utilisateurs de voir votre ticket pour vérifier l'authenticité de l'avis.
        Votre ticket sera anonymisé avant d'être partagé.
      </p>
    </div>
  );
};

/**
 * Sous-composant pour la sélection des articles du ticket
 */
const ReceiptItemsSelection = ({
  receiptItems,
  selectedItem,
  isItemListExpanded,
  showLowMatchAlert,
  matchScore,
  validationErrors,
  product,
  onReceiptItemsChange,
  onSelectItem,
  onToggleItemList
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h4 className="font-medium text-gray-800 mb-3">
        Articles détectés sur votre ticket <span className="text-red-500">*</span>
      </h4>
      <p className="text-sm text-gray-600 mb-3">
        Vous devez sélectionner l'article correspondant à ce produit, ou modifier les informations détectées si nécessaire.
        Le taux de correspondance vous aide à identifier l'article correspondant au produit <strong>{product.product_name}</strong>.
      </p>
      
      {/* Alerte si le taux de correspondance est faible */}
      {showLowMatchAlert && (
        <LowMatchAlert />
      )}
      
      {validationErrors.selectedItem && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
          <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
          <span>{validationErrors.selectedItem}</span>
        </div>
      )}
      
      {/* Article sélectionné ou bouton de sélection */}
      {selectedItem ? (
        <SelectedItemDisplay 
          selectedItem={selectedItem}
          matchScore={matchScore}
          isItemListExpanded={isItemListExpanded}
          onToggleItemList={onToggleItemList}
        />
      ) : (
        <button
          type="button"
          onClick={() => onToggleItemList()}
          className="w-full py-2 px-4 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition flex items-center justify-center mb-3"
        >
          <span>Sélectionner un article</span>
          <ChevronDown size={18} className="ml-2" />
        </button>
      )}

      {/* Liste d'articles repliable */}
      <div 
        className={`transition-all duration-300 overflow-auto border ${
          isItemListExpanded ? 'border-gray-200 max-h-[500px] opacity-100 p-3 mb-3' : 'border-transparent max-h-0 opacity-0 p-0'
        }`}
        style={{ marginTop: isItemListExpanded ? '0.75rem' : '0' }}
      >
        <ReceiptItemSelector 
          items={receiptItems}
          onChange={onReceiptItemsChange}
          selectedItem={selectedItem}
          onSelect={onSelectItem}
          productName={product.product_name}
        />
      </div>
    </div>
  );
};

/**
 * Affichage de l'article sélectionné
 */
const SelectedItemDisplay = ({ selectedItem, matchScore, isItemListExpanded, onToggleItemList }) => {
  const getMatchScoreColor = (score) => {
    if (score >= 0.7) return 'bg-green-100 text-green-800';
    if (score >= 0.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-3 bg-blue-50 rounded-md mb-3">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center mb-1">
            <p className="text-blue-700 font-medium">Article sélectionné</p>
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getMatchScoreColor(matchScore)}`}>
              {Math.round(matchScore * 100)}% de correspondance
            </span>
          </div>
          <p className="text-gray-800 font-bold">{selectedItem.designation}</p>
          <div className="text-sm text-gray-700 mt-1">
            <span className="inline-block mr-3">Quantité: {selectedItem.quantite}</span>
            <span className="inline-block mr-3">Prix: {formatPrice(selectedItem.prix_total)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleItemList}
          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full focus:outline-none"
          aria-label={isItemListExpanded ? "Masquer la liste d'articles" : "Afficher la liste d'articles"}
        >
          {isItemListExpanded ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </button>
      </div>
    </div>
  );
};

/**
 * Alerte pour faible correspondance
 */
const LowMatchAlert = () => {
  return (
    <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-md flex items-start">
      <AlertTriangle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium">Faible taux de correspondance détecté</p>
        <p className="text-sm">Le taux de correspondance de l'article sélectionné est inférieur à 70%. 
        Votre avis sera soumis à modération avant publication.</p>
      </div>
    </div>
  );
};

export default ReceiptSection;