// src/hooks/useReviewForm.js - Version modifiée pour critères spécifiques
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getProductCriteriasSimple, // CHANGEMENT : Utiliser le nouveau service
  addProductReview
} from '../services/reviewService';
import { findBestMatchingItem } from '../utils/textSimilarityUtils';
import { 
  getReceiptItems, 
  updateReceiptItem, 
  getActiveCountries,
  updateReceiptAndEnseigne 
} from '../services/unifiedReceiptService';

/**
 * Hook personnalisé pour gérer la logique du formulaire d'avis
 * Version mise à jour pour utiliser les critères spécifiques aux produits
 */
export const useReviewForm = (product, onSuccess) => {
  const { currentUser, userDetails } = useAuth();
  
  // États du formulaire
  const [ratings, setRatings] = useState({});
  const [hoverRatings, setHoverRatings] = useState({});
  const [comment, setComment] = useState('');
  const [criterias, setCriterias] = useState([]);
  
  // NOUVEAU : États pour les informations de critères
  const [criteriasLoading, setCriteriasLoading] = useState(false);
  const [criteriasError, setCriteriasError] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState(null);
  
  // États du ticket de caisse
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [receiptId, setReceiptId] = useState(null);
  const [receiptItems, setReceiptItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // États des informations d'achat (avec allowPublicDisplay)
  const [allowPublicDisplay, setAllowPublicDisplay] = useState(true);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchasePriceReceipt, setPurchasePriceReceipt] = useState('');
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
  
  // NOUVEAU : Calcul de la note moyenne avec les poids spécifiques
  const averageRating = useMemo(() => {
    if (!criterias.length) return 0;
    
    let totalWeightedRating = 0;
    let totalWeight = 0;
    
    criterias.forEach(criteria => {
      const rating = ratings[criteria.id] || 0;
      if (rating > 0) {
        const weight = criteria.weight || 1.0; // Utiliser le poids du critère
        totalWeightedRating += rating * weight;
        totalWeight += weight;
      }
    });
    
    if (totalWeight === 0) return 0;
    
    return Math.round((totalWeightedRating / totalWeight) * 100) / 100;
  }, [ratings, criterias]);
  
  // MODIFIÉ : Chargement des critères spécifiques au produit
  useEffect(() => {
    const fetchProductCriterias = async () => {
      if (!product || !product.code) {
        setCriterias([]);
        return;
      }

      setCriteriasLoading(true);
      setCriteriasError(null);
      
      try {
        console.log('🎯 Récupération des critères pour le produit:', product.code);
        
        // Utiliser le nouveau service pour les critères spécifiques
        const { success, data, error } = await getProductCriteriasSimple(product.code);
        
        if (success && data && data.length > 0) {
          setCriterias(data);
          console.log('✅ Critères spécifiques récupérés:', data);
          
          // Initialiser les ratings avec les nouveaux critères
          const initialRatings = {};
          const initialHoverRatings = {};
          data.forEach(criteria => {
            initialRatings[criteria.id] = 0;
            initialHoverRatings[criteria.id] = 0;
          });
          setRatings(initialRatings);
          setHoverRatings(initialHoverRatings);
          
        } else {
          console.warn('⚠️ Aucun critère spécifique trouvé, utilisation des critères par défaut');
          setCriteriasError("Aucun critère trouvé pour ce produit");
          setCriterias([]);
        }
      } catch (err) {
        console.error('💥 Exception lors du chargement des critères:', err);
        setCriteriasError(err.message);
        setCriterias([]);
      } finally {
        setCriteriasLoading(false);
      }
    };
    
    fetchProductCriterias();
  }, [product?.code]); // Dépendance sur le code produit
  
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
    } else if (comment.trim().length < 20) {
      errors.comment = "Le commentaire doit contenir au moins 20 caractères";
    }
    
    if (!selectedItem && receiptItems.length > 0) {
      errors.selectedItem = "Vous devez sélectionner un article du ticket";
    }
    
    const hasRating = Object.values(ratings).some(rating => rating > 0);
    if (!hasRating) {
      errors.ratings = "Veuillez attribuer au moins une note";
    }
    
    // NOUVEAU : Validation spécifique si aucun critère n'est chargé
    if (criterias.length === 0) {
      errors.criterias = "Impossible de charger les critères d'évaluation";
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
    
    if (e.target.value.trim().length >= 20) {
      setValidationErrors(prev => ({
        ...prev,
        comment: null
      }));
    }
  };
  
  // Gestionnaire d'upload de ticket (inchangé mais avec allowPublicDisplay)
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
    
    if (receipt.total_ttc) {
      setPurchasePriceReceipt(receipt.total_ttc.toString());
    }
    
    if (extractedData) {
      console.log("Données extraites par Claude AI:", extractedData);
      setAiData(extractedData);
      
      if (extractedData.date) {
        setPurchaseDate(extractedData.date);
      }
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
  
  // Autres gestionnaires (inchangés)
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
  
  // MODIFIÉ : Gestionnaire de soumission avec critères spécifiques
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
      // Préparer les ratings en utilisant les IDs des critères spécifiques
      const ratingsToSend = {};
      criterias.forEach(criteria => {
        if (ratings[criteria.id] && ratings[criteria.id] > 0) {
          ratingsToSend[criteria.id] = ratings[criteria.id];
        }
      });

      console.log('📊 Ratings à envoyer avec critères spécifiques:', ratingsToSend);
      console.log('📋 Critères utilisés:', criterias.map(c => ({ id: c.id, name: c.name, display_name: c.display_name, weight: c.weight })));

      const purchaseInfo = {
        price: purchasePrice ? parseFloat(purchasePrice) : null,
        priceReceipt: purchasePriceReceipt ? parseFloat(purchasePriceReceipt) : null,
        date: purchaseDate || null,
        location: null,
        storeName: storeName || null,
        postalCode: postalCode || null,
        allowPublicDisplay: allowPublicDisplay, // Utiliser allowPublicDisplay
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
        ratingsToSend, // Utiliser les ratings avec critères spécifiques
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
        if (error && error.includes("duplicate key value violates unique constraint")) {
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
    allowPublicDisplay, // Exposer allowPublicDisplay
    purchaseDate,
    purchasePrice,
    purchasePriceReceipt,
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
    
    // NOUVEAUX : États pour les critères
    criteriasLoading,
    criteriasError,
    categoryInfo,
    
    // Setters
    setAllowPublicDisplay, // Exposer setAllowPublicDisplay
    setPurchaseDate,
    setPurchasePrice,
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
    handleSubmitReview,
    
    // Utilitaires
    validateForm
  };
};