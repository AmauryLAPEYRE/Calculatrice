// ===================================================================
// src/components/review/ReviewForm.js - Version modifiée
// ===================================================================

import React from 'react';
import { AlertCircle, CheckCircle, Loader, X, Tag, Info } from 'lucide-react';
import { useReviewForm } from '../../hooks/useReviewForm';
import ReviewCriteriaSection from './ReviewCriteriaSection';
import ReceiptSection from './ReceiptSection';
import PurchaseInfoSection from './PurchaseInfoSection';

/**
 * Composant de formulaire pour créer un avis - Version avec critères spécifiques
 */
const ReviewForm = ({ product, onSuccess, onCancel }) => {
  const {
    // États
    ratings,
    hoverRatings,
    comment,
    criterias,
    receiptUploaded,
    receiptItems,
    selectedItem,
    allowPublicDisplay, // CHANGEMENT : allowPublicDisplay au lieu de authorizeReceiptSharing
    purchaseDate,
    purchasePrice,
    purchasePriceReceipt,
    storeName,
    postalCode,
    aiDataAvailable,
    isItemListExpanded,
    loading,
    error,
    success,
    validationErrors,
    matchScore,
    showLowMatchAlert,
    showZeroRatingAlert,
    averageRating,
    receiptId,
    
    // NOUVEAUX : États pour les critères
    criteriasLoading,
    criteriasError,
    categoryInfo,
    
    // Setters
    setAllowPublicDisplay, // CHANGEMENT : setAllowPublicDisplay au lieu de setAuthorizeReceiptSharing
    setPurchaseDate,
    setPurchasePrice,
    setPurchasePriceReceipt,
    setStoreName,
    setPostalCode,
    
    // Gestionnaires
    handleRatingChange,
    handleRatingHover,
    handleCommentChange,
    handleReceiptUpload,
    handleReceiptItemsChange,
    handleSelectItem,
    toggleItemList,
    handleSubmitReview
  } = useReviewForm(product, onSuccess);

  if (!product) return null;

  // Gestionnaire pour la mise à jour des informations d'achat
  const handlePurchaseInfoUpdate = (updatedData) => {
    if (updatedData.purchaseDate) setPurchaseDate(updatedData.purchaseDate);
    if (updatedData.purchasePrice) setPurchasePrice(updatedData.purchasePrice);
    if (updatedData.purchasePriceReceipt) setPurchasePriceReceipt(updatedData.receipt.total_ttc);
    if (updatedData.storeName) setStoreName(updatedData.storeName);
    if (updatedData.postalCode) setPostalCode(updatedData.postalCode);
    
    console.log('Informations d\'achat mises à jour:', updatedData);
  };

  return (
    <div className="mb-8 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <ReviewFormHeader 
        productName={product.product_name} 
        onCancel={onCancel} 
      />
      
      {success ? (
        <ReviewSuccessMessage matchScore={matchScore} />
      ) : (
        <form onSubmit={handleSubmitReview} className="space-y-6">
          {/* NOUVELLE SECTION : Informations sur les critères utilisés */}
          <CriteriaInfoSection 
            criterias={criterias}
            criteriasLoading={criteriasLoading}
            criteriasError={criteriasError}
            categoryInfo={categoryInfo}
          />

          {/* Section critères d'évaluation */}
          <ReviewCriteriaSection
            criterias={criterias}
            ratings={ratings}
            hoverRatings={hoverRatings}
            averageRating={averageRating}
            showZeroRatingAlert={showZeroRatingAlert}
            validationErrors={validationErrors}
            criteriasLoading={criteriasLoading}
            criteriasError={criteriasError}
            onRatingChange={handleRatingChange}
            onRatingHover={handleRatingHover}
          />
          
          {/* Section commentaire */}
          <CommentSection
            comment={comment}
            validationErrors={validationErrors}
            onChange={handleCommentChange}
          />

          {/* Section ticket de caisse */}
          <ReceiptSection
            receiptUploaded={receiptUploaded}
            receiptItems={receiptItems}
            selectedItem={selectedItem}
            isItemListExpanded={isItemListExpanded}
            showLowMatchAlert={showLowMatchAlert}
            matchScore={matchScore}
            validationErrors={validationErrors}
            allowPublicDisplay={allowPublicDisplay} // CHANGEMENT
            product={product}
            onReceiptUpload={handleReceiptUpload}
            onReceiptItemsChange={handleReceiptItemsChange}
            onSelectItem={handleSelectItem}
            onToggleItemList={toggleItemList}
            onAllowPublicDisplayChange={setAllowPublicDisplay} // CHANGEMENT
          />
          
          {/* Section informations d'achat extraites */}
          <PurchaseInfoSection
            aiDataAvailable={aiDataAvailable}
            purchaseDate={purchaseDate}
            purchasePrice={purchasePriceReceipt}
            storeName={storeName}
            postalCode={postalCode}
            receiptId={receiptId}
            onUpdate={handlePurchaseInfoUpdate}
          />
          
          {/* Champs cachés pour les informations d'achat */}
          <input type="hidden" name="purchaseDate" value={purchaseDate} />
          <input type="hidden" name="purchasePrice" value={purchasePrice} />
          <input type="hidden" name="purchasePriceReceipt" value={purchasePriceReceipt} />
          <input type="hidden" name="storeName" value={storeName} />
          <input type="hidden" name="postalCode" value={postalCode} />
          
          {/* Message d'erreur global */}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-start">
              <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Boutons d'action */}
          <FormActions
            loading={loading}
            receiptUploaded={receiptUploaded}
            criteriasError={criteriasError}
            onCancel={onCancel}
          />
        </form>
      )}
    </div>
  );
};

/**
 * NOUVELLE SECTION : Informations sur les critères utilisés
 */
const CriteriaInfoSection = ({ criterias, criteriasLoading, criteriasError, categoryInfo }) => {
  if (criteriasLoading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center">
          <Loader size={16} className="animate-spin text-blue-600 mr-2" />
          <span className="text-blue-700">Chargement des critères d'évaluation...</span>
        </div>
      </div>
    );
  }

  if (criteriasError) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-start">
          <AlertCircle size={16} className="text-red-600 mr-2 mt-0.5" />
          <div>
            <span className="text-red-700 font-medium">Erreur de chargement des critères</span>
            <p className="text-red-600 text-sm mt-1">{criteriasError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (criterias.length === 0) {
    return null;
  }

  return (
    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
      <div className="flex items-center mb-3">
        <Tag size={18} className="text-green-600 mr-2" />
        <h4 className="font-medium text-green-800">
          Critères d'évaluation pour ce produit
          {categoryInfo?.categoryDisplayName && (
            <span className="text-sm font-normal text-green-600 ml-2">
              ({categoryInfo.categoryDisplayName})
            </span>
          )}
        </h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {criterias.map((criteria, index) => (
          <div key={criteria.id} className="bg-white rounded-lg p-3 border border-green-100">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-800 text-sm">{criteria.display_name}</span>
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                ×{criteria.weight}
              </span>
            </div>
            {criteria.description && (
              <p className="text-xs text-gray-600">{criteria.description}</p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center text-xs text-green-700">
        <Info size={12} className="mr-1" />
        <span>Ces critères sont spécialisés pour cette catégorie de produit et seront utilisés pour calculer votre note.</span>
      </div>
    </div>
  );
};

/**
 * En-tête du formulaire
 */
const ReviewFormHeader = ({ productName, onCancel }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">Votre avis sur {productName}</h3>
      <button
        onClick={onCancel}
        className="text-gray-500 hover:text-gray-700 transition-colors"
        title="Annuler"
      >
        <X size={20} />
      </button>
    </div>
  );
};

/**
 * Section commentaire
 */
const CommentSection = ({ comment, validationErrors, onChange }) => {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">
        Commentaire <span className="text-red-500">*</span>
      </label>
      <textarea
        className={`w-full px-3 py-2 border ${
          validationErrors.comment ? 'border-red-500' : 'border-gray-300'
        } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors`}
        rows="4"
        placeholder="Partagez votre expérience avec ce produit... (20 caractères minimum)"
        value={comment}
        onChange={onChange}
        required
      />
      {validationErrors.comment && (
        <p className="mt-1 text-sm text-red-600">{validationErrors.comment}</p>
      )}
    </div>
  );
};

/**
 * Message de succès
 */
const ReviewSuccessMessage = ({ matchScore }) => {
  return (
    <div className="p-4 bg-green-100 text-green-700 rounded-md flex items-center">
      <CheckCircle size={20} className="mr-2" />
      <span>
        Votre avis a été envoyé avec succès et sera {
          matchScore >= 0.75 ? "publié immédiatement" : "publié après modération"
        }. Merci !
      </span>
    </div>
  );
};

/**
 * Boutons d'action du formulaire (mis à jour)
 */
const FormActions = ({ loading, receiptUploaded, criteriasError, onCancel }) => {
  const isDisabled = loading || !receiptUploaded || criteriasError;
  
  let buttonText = 'Publier mon avis';
  if (loading) {
    buttonText = 'Envoi en cours...';
  } else if (!receiptUploaded) {
    buttonText = 'Téléchargez un ticket de caisse pour continuer';
  } else if (criteriasError) {
    buttonText = 'Erreur de chargement des critères';
  }

  return (
    <div className="flex justify-end space-x-3">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
      >
        Annuler
      </button>
      <button
        type="submit"
        className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 flex items-center ${
          isDisabled ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        disabled={isDisabled}
      >
        {loading ? (
          <>
            <Loader size={18} className="mr-2 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          buttonText
        )}
      </button>
    </div>
  );
};

export default ReviewForm;