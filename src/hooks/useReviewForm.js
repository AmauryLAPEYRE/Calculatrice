// src/hooks/useReviewForm.js
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getReviewCriterias, 
  addProductReview
} from '../services/reviewService';
import { getReceiptItems } from '../services/receiptAnalysisService';
import { findBestMatchingItem } from '../utils/textSimilarityUtils';

/**
 * Hook personnalisé pour gérer la logique du formulaire d'avis
 * @param {object} product - Données du produit
 * @param {function} onSuccess - Callback de succès
 * @returns {object} État et fonctions du formulaire
 */
export const useReviewForm = (product, onSuccess) => {
  const { currentUser, userDetails } = useAuth();
  
  // États du formulaire
  const [ratings, setRatings] = useState({});
  const [hoverRatings, setHoverRatings] = useState({});
  const [comment, setComment] = useState('');
  const [criterias, setCriterias] = useState([]);
  
  // États du ticket de caisse
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [receiptId, setReceiptId] = useState(null);
  const [receiptItems, setReceiptItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // États des informations d'achat
  const [authorizeReceiptSharing, setAuthorizeReceiptSharing] = useState(true);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [storeName, setStoreName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [aiData, setAiData] = useState(null);
  const [aiDataAvailable, setAiDataAvailable] = useState(false);
  
  // États de l'interface
  const [isItemListExpanded, setIsItemListExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // États de validation
  const [validationErrors, setValidationErrors] = useState({});
  const [matchScore, setMatchScore] = useState(0);
  const [showLowMatchAlert, setShowLowMatchAlert] = useState(false);
  const [showZeroRatingAlert, setShowZeroRatingAlert] = useState(false);
  
  // Calcul de la note moyenne
  const averageRating = useMemo(() => {
    if (!criterias.length) return 0;
    
    let totalWeightedRating = 0;
    let totalWeight = 0;
    
    criterias.forEach(criteria => {
      const rating = ratings[criteria.id] || 0;
      if (rating > 0) {
        totalWeightedRating += rating * criteria.weight;
        totalWeight += criteria.weight;
      }
    });
    
    if (totalWeight === 0) return 0;
    
    return Math.round((totalWeightedRating / totalWeight) * 100) / 100;
  }, [ratings, criterias]);
  
  // Chargement des critères d'évaluation
  useEffect(() => {
    const fetchReviewCriterias = async () => {
      const { success, data, error } = await getReviewCriterias();
      
      if (success && data) {
        setCriterias(data);
        
        const initialRatings = {};
        data.forEach(criteria => {
          initialRatings[criteria.id] = 0;
        });
        setRatings(initialRatings);
        setHoverRatings(initialRatings);
      } else if (error) {
        console.error("Erreur lors du chargement des critères:", error);
        setError("Impossible de charger les critères d'évaluation. Veuillez réessayer plus tard.");
      }
    };
    
    fetchReviewCriterias();
  }, []);
  
  // Vérifier si des notes sont à zéro
  useEffect(() => {
    if (criterias.length > 0) {
      const hasZeroRating = criterias.some(criteria => ratings[criteria.id] === 0);
      setShowZeroRatingAlert(hasZeroRating);
    }
  }, [ratings, criterias]);
  
  // Validation du formulaire
  const validateForm = () => {
    const errors = {};
    
    if (!comment.trim()) {
      errors.comment = "Le commentaire est obligatoire";
    }
    
    if (!selectedItem && receiptItems.length > 0) {
      errors.selectedItem = "Vous devez sélectionner un article du ticket";
    }
    
    const hasRating = Object.values(ratings).some(rating => rating > 0);
    if (!hasRating) {
      errors.ratings = "Veuillez attribuer au moins une note";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Gestionnaires d'événements
  const handleRatingChange = (criteriaId, value) => {
    setRatings(prev => ({
      ...prev,
      [criteriaId]: value
    }));
    
    setValidationErrors(prev => ({
      ...prev,
      ratings: null
    }));
  };
  
  const handleRatingHover = (criteriaId, value) => {
    setHoverRatings(prev => ({
      ...prev,
      [criteriaId]: value
    }));
  };
  
  const handleCommentChange = (e) => {
    setComment(e.target.value);
    
    if (e.target.value.trim()) {
      setValidationErrors(prev => ({
        ...prev,
        comment: null
      }));
    }
  };
  
  const handleReceiptUpload = async (receipt, url, extractedData, receiptItems = []) => {
    setReceiptUploaded(true);
    setReceiptId(receipt.id);
    
    console.log("Ticket de caisse téléchargé avec ID:", receipt.id);
    
    let articleSelectionne = false;

    if (receiptItems && receiptItems.length > 0) {
      console.log("🛒 Utilisation des articles déjà chargés:", receiptItems.length);
      setReceiptItems(receiptItems);
    } else {
      try {
        console.log("🔍 Chargement des articles depuis la base de données pour le ticket:", receipt.id);
        const { success, items, error } = await getReceiptItems(receipt.id);
        
        if (success && items && items.length > 0) {
          console.log("🛒 Articles chargés depuis la base de données:", items.length);
          setReceiptItems(items);
        } else if (error) {
          console.error("❌ Erreur lors du chargement des articles:", error);
        } else {
          console.warn("⚠️ Aucun article trouvé pour ce ticket");
        }
      } catch (err) {
        console.error("❌ Erreur critique lors du chargement des articles:", err);
      }
    }
    
    if (receiptItems.length > 0 && product && product.product_name) {
      console.log("🔍 Recherche du meilleur article correspondant au produit:", product.product_name);
      const { item, score } = findBestMatchingItem(receiptItems, product);
      console.log(`Meilleure correspondance: ${item?.designation || 'Aucune'} (score: ${score})`);
      
      setMatchScore(score);
      setShowLowMatchAlert(score < 0.7);
      
      if (item) {
        setSelectedItem(item);
        articleSelectionne = true;
        if (item.prix_total) {
          setPurchasePrice(item.prix_total.toString());
        }
        
        setValidationErrors(prev => ({
          ...prev,
          selectedItem: null
        }));
      }
    }
    
    if (extractedData) {
      console.log("Données extraites par Claude AI:", extractedData);
      setAiData(extractedData);
      
      if (extractedData.date) {
        setPurchaseDate(extractedData.date);
      }
        // NOUVEAU : Extraction du code postal
        if (extractedData.code_postal) {
            setPostalCode(extractedData.code_postal);
            }
      if (extractedData.store) {
        setStoreName(extractedData.store);
      }
      
      if (extractedData.price && !articleSelectionne) {
        setPurchasePrice(extractedData.price.toString());
      }
      
      setAiDataAvailable(true);
    }
  };
  
  const handleReceiptItemsChange = (updatedItems) => {
    setReceiptItems(updatedItems);
    
    if (selectedItem) {
      const updatedSelectedItem = updatedItems.find(item => item.id === selectedItem.id);
      if (updatedSelectedItem) {
        setSelectedItem(updatedSelectedItem);
      } else {
        setSelectedItem(null);
        setValidationErrors(prev => ({
          ...prev,
          selectedItem: "Vous devez sélectionner un article du ticket"
        }));
      }
    }
    
    if (selectedItem) {
      setPurchasePrice(selectedItem.prix_total.toString());
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    
    if (item && item.prix_total) {
      setPurchasePrice(item.prix_total.toString());
    }
    
    setValidationErrors(prev => ({
      ...prev,
      selectedItem: null
    }));

    if (item && product && product.product_name) {
      const score = item.matchScore || findBestMatchingItem([item], product).score;
      setMatchScore(score);
      setShowLowMatchAlert(score < 0.7);
    }

    setIsItemListExpanded(false);
  };
  
  const toggleItemList = () => {
    setIsItemListExpanded(!isItemListExpanded);
    
    if (isItemListExpanded && !selectedItem && receiptItems.length > 0) {
      setValidationErrors(prev => ({
        ...prev,
        selectedItem: "Vous devez sélectionner un article du ticket"
      }));
    }
  };
  
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!currentUser || !userDetails) {
      setError("Vous devez être connecté pour laisser un avis");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const purchaseInfo = {
        price: purchasePrice ? parseFloat(purchasePrice) : null,
        date: purchaseDate || null,
        location: null,
        storeName: storeName || null,
        postalCode: postalCode || null,
        authorizeSharing: authorizeReceiptSharing,
        receiptItems: receiptItems,
        selectedItemId: selectedItem ? selectedItem.id : null,
        matchScore: matchScore
      };
      
      console.log("Envoi de l'avis avec les infos d'achat:", purchaseInfo);
      
      const { success, error } = await addProductReview(
        userDetails.id,
        product.code,
        comment,
        receiptId,
        ratings,
        purchaseInfo
      );

      if (success) {
        setSuccess(true);
        
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
        }, 2000);
      } else {
            // Vérifier si c'est une erreur de contrainte d'unicité
                if  (error && error.includes("duplicate key value violates unique constraint")) {
                    setError("Vous avez déjà donné votre avis pour ce produit avec ce ticket");
                   
                } else {
                setError(error || "Une erreur est survenue lors de l'envoi de votre avis");
                }
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi de votre avis");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    // États
    ratings,
    hoverRatings,
    comment,
    criterias,
    receiptUploaded,
    receiptId,
    receiptItems,
    selectedItem,
    authorizeReceiptSharing,
    purchaseDate,
    purchasePrice,
    storeName,
    postalCode,
    aiData,
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
    
    // Setters
    setAuthorizeReceiptSharing,
    setPurchaseDate,
    setPurchasePrice,
    setStoreName,
    
    // Gestionnaires
    handleRatingChange,
    handleRatingHover,
    handleCommentChange,
    handleReceiptUpload,
    handleReceiptItemsChange,
    handleSelectItem,
    toggleItemList,
    handleSubmitReview,
    
    // Utilitaires
    validateForm
  };
};