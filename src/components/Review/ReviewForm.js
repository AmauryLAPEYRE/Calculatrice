// src/components/review/ReviewForm.js
import React from 'react';
import { AlertCircle, CheckCircle, Loader, X } from 'lucide-react';
import { useReviewForm } from '../../hooks/useReviewForm';
import ReviewCriteriaSection from './ReviewCriteriaSection';
import ReceiptSection from './ReceiptSection';
import PurchaseInfoSection from './PurchaseInfoSection';

/**
 * Composant de formulaire pour créer un avis - Version refactorisée
 * @param {object} props - Propriétés du composant
 * @param {object} props.product - Données du produit
 * @param {function} props.onSuccess - Fonction appelée après création réussie
 * @param {function} props.onCancel - Fonction appelée lors de l'annulation
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
    authorizeReceiptSharing,
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
    receiptId, // Ajout de l'ID du ticket
    
    // Setters
    setAuthorizeReceiptSharing,
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
    // Mettre à jour les états locaux avec les nouvelles données
    if (updatedData.purchaseDate) setPurchaseDate(updatedData.purchaseDate);
    if (updatedData.purchasePrice) setPurchasePrice(updatedData.purchasePrice);
    if (updatedData.purchasePriceReceipt) setPurchasePriceReceipt(updatedData.receipt.total_ttc);
    if (updatedData.storeName) setStoreName(updatedData.storeName);
    if (updatedData.postalCode) setPostalCode(updatedData.postalCode);
    
    // Afficher un message de succès ou déclencher d'autres actions si nécessaire
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
          {/* Section critères d'évaluation */}
          <ReviewCriteriaSection
            criterias={criterias}
            ratings={ratings}
            hoverRatings={hoverRatings}
            averageRating={averageRating}
            showZeroRatingAlert={showZeroRatingAlert}
            validationErrors={validationErrors}
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
            authorizeReceiptSharing={authorizeReceiptSharing}
            product={product}
            onReceiptUpload={handleReceiptUpload}
            onReceiptItemsChange={handleReceiptItemsChange}
            onSelectItem={handleSelectItem}
            onToggleItemList={toggleItemList}
            onAuthorizeReceiptSharingChange={setAuthorizeReceiptSharing}
          />
          
          {/* Section informations d'achat extraites - VERSION EDITABLE */}
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
            onCancel={onCancel}
          />
        </form>
      )}
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
 * Boutons d'action du formulaire
 */
const FormActions = ({ loading, receiptUploaded, onCancel }) => {
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
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        disabled={loading || !receiptUploaded}
      >
        {loading ? (
          <>
            <Loader size={18} className="mr-2 animate-spin" />
            Envoi en cours...
          </>
        ) : !receiptUploaded ? (
          'Téléchargez un ticket de caisse pour continuer'
        ) : (
          'Publier mon avis'
        )}
      </button>
    </div>
  );
};

export default ReviewForm;