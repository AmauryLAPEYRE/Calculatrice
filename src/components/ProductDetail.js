// src/components/ProductDetail.js - Version modifiée avec étoiles précises
import React, { useState, useEffect, useRef } from 'react';
// Dans n'importe quel composant React existant
import { supabase } from '../supabaseClient';
import PriceHistory from './Review/PriceHistory';
import { 
  Star, 
  MessageSquare, 
  Heart, 
  Shield, 
  TrendingUp,
  Award,
  Users,
  Sparkles,
  ChevronDown,
  CheckCircle,
  ThumbsUp,
  Eye,
  Crown,
  Zap,
  BarChart3,
  Bot,
  Clock,
  AlertCircle,
  Tag // Nouveau : icône pour les critères
} from 'lucide-react';
import PageNutri from './PageNutri';
import PageEnvir from './PageEnvir';
import PageAvisEnhanced from './PageAvisEnhanced';
import PageInfos from './PageInfos';
import FavoriteButton from './FavoriteButton';
import { findProductInDatabase, saveProductToDatabase } from '../services/productDatabaseService';
import { getProductDetails } from '../services/productService';

// Imports pour les nouveaux services de critères
import { 
  getProductCriteriasSimple, 
  getProductCategoryInfo,
  getAvailableCategoryMasters 
} from '../services/reviewService';

import { autoGenerateReviewIfNeeded } from '../services/aiReviewService';
import { AIReviewGenerationStatus } from '../components/AIReviewComponents';
import { useAuth } from '../contexts/AuthContext';

const ProductDetail = ({ product }) => {
  const [activeTab, setActiveTab] = useState('avis');
  const [isVisible, setIsVisible] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [ingredientsLanguage, setIngredientsLanguage] = useState('fr');
  
  // États pour la génération d'avis IA
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiProgressMessage, setAiProgressMessage] = useState('');
  const [aiError, setAiError] = useState(null);
  const [productStats, setProductStats] = useState(null);
  const [hasTriedAIGeneration, setHasTriedAIGeneration] = useState(false);
  const [aiGenerationTriggered, setAiGenerationTriggered] = useState(false);
  
  // NOUVEAUX ÉTATS POUR LES CRITÈRES SPÉCIFIQUES
  const [productCriterias, setProductCriterias] = useState([]);
  const [criteriasLoading, setCriteriasLoading] = useState(false);
  const [criteriasError, setCriteriasError] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [showCriteriaInfo, setShowCriteriaInfo] = useState(false);
  
  const menuRef = useRef(null);
  const { currentUser, userDetails } = useAuth();

  // NOUVELLE FONCTION : Affichage d'étoiles avec remplissage précis
  const renderPreciseStars = (rating, size = 20) => {
    const ratingNum = parseFloat(rating) || 0;

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          let fillPercentage = 0;

          if (ratingNum >= star) {
            fillPercentage = 100;
          } else if (ratingNum > star - 1) {
            fillPercentage = Math.round((ratingNum - (star - 1)) * 100);
          }

          return (
            <div key={star} className="relative" style={{ width: size, height: size }}>
              <Star size={size} className="absolute text-gray-300" />
              {fillPercentage > 0 && (
                <div 
                  className="absolute overflow-hidden" 
                  style={{ width: `${fillPercentage}%`, height: '100%' }}
                >
                  <Star size={size} className="text-yellow-400 fill-yellow-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
useEffect(() => {
  const debugAuth = async () => {
    console.log('🔍 DEBUG - Utilisateur connecté:', await supabase.auth.getUser());
    console.log('🔍 DEBUG - Session:', await supabase.auth.getSession());
  };
  debugAuth();
}, []);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Synchronisation avec la base de données
  useEffect(() => {
    const syncProductWithDatabase = async () => {
      if (!product || !product.code) return;
      
      try {
        const { success, exists, error: findError } = await findProductInDatabase(product.code);
        
        if (findError) {
          setSyncError(`Erreur de vérification: ${findError}`);
          return;
        }
        
        if (success && !exists) {
          const saveResult = await saveProductToDatabase(product);
          
          if (saveResult.success) {
            setIsSynced(true);
          } else {
            setSyncError(saveResult.error || "Erreur inconnue");
          }
        } else {
          setIsSynced(true);
        }
      } catch (error) {
        setSyncError(error.message || "Exception non identifiée");
      }
    };
    
    syncProductWithDatabase();
  }, [product]);

  // NOUVEAU : Récupération des critères spécifiques au produit
  useEffect(() => {
    const fetchProductCriterias = async () => {
      if (!product || !product.code) {
        setProductCriterias([]);
        return;
      }
      
      setCriteriasLoading(true);
      setCriteriasError(null);
      
      try {
        console.log('🎯 Récupération des critères pour le produit:', product.code);
        
        // Récupérer les critères spécifiques au produit
        const criteriasResult = await getProductCriteriasSimple(product.code);
        
        if (criteriasResult.success) {
          setProductCriterias(criteriasResult.data || []);
          console.log('✅ Critères récupérés:', criteriasResult.data);
          
          // Récupérer aussi les informations de catégorie
          const categoryResult = await getProductCategoryInfo(product.code);
          if (categoryResult.success) {
            setCategoryInfo(categoryResult.data);
            console.log('📁 Informations de catégorie:', categoryResult.data);
          }
        } else {
          setCriteriasError(criteriasResult.error);
          console.error('❌ Erreur récupération critères:', criteriasResult.error);
          
          // En cas d'erreur, essayer de récupérer les critères par défaut
          // (cette logique pourrait être dans le service, mais on ajoute une sécurité)
          setProductCriterias([]);
        }
      } catch (error) {
        console.error('💥 Exception lors de la récupération des critères:', error);
        setCriteriasError(error.message);
        setProductCriterias([]);
      } finally {
        setCriteriasLoading(false);
      }
    };
    
    fetchProductCriterias();
  }, [product?.code]); // Dépendance sur le code produit uniquement

  // Récupération des statistiques du produit depuis la base de données
  useEffect(() => {
    const fetchProductStats = async () => {
      if (!product || !product.code) return;
      
      try {
        const result = await getProductDetails(product.code);
        if (result.success && result.data) {
          setProductStats(result.data);
          console.log('📊 Statistiques produit récupérées:', result.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    };
    
    fetchProductStats();
  }, [product]);

  // Génération automatique d'avis IA si nécessaire
  useEffect(() => {
    const tryAutoGenerateAI = async () => {
      // Vérifications préalables
      if (!product || !product.code || !product.product_name) return;
      if (!currentUser || !userDetails) return;
      if (hasTriedAIGeneration) return;
      
      // Utiliser les stats de la DB si disponibles, sinon celles du produit
      const totalReviews = productStats?.total_reviews || product.total_reviews || 0;
      
      // Si le produit a déjà des avis, ne pas générer
      if (totalReviews > 0) {
        console.log('🚫 Produit a déjà des avis, génération IA non nécessaire');
        return;
      }
      
      console.log('🤖 Tentative de génération automatique d\'avis IA pour:', product.product_name);
      setHasTriedAIGeneration(true);
      
      const success = await autoGenerateReviewIfNeeded(
        product,
        userDetails.id,
        // onSuccess
        (result) => {
          console.log('✅ Avis IA généré avec succès:', result);
          setAiProgressMessage('Avis IA créé avec succès !');
          setAiGenerationTriggered(true);
          
          // Rafraîchir les statistiques du produit
          setTimeout(async () => {
            const refreshResult = await getProductDetails(product.code);
            if (refreshResult.success && refreshResult.data) {
              setProductStats(refreshResult.data);
              console.log('🔄 Statistiques produit rafraîchies:', refreshResult.data);
            }
          }, 1000);
        },
        // onError
        (errorMessage) => {
          console.error('❌ Erreur génération IA:', errorMessage);
          setAiError(errorMessage);
          setAiGenerationTriggered(true);
        },
        // onProgress
        (progressMessage) => {
          console.log('⏳ Progression IA:', progressMessage);
          setAiProgressMessage(progressMessage);
          setIsGeneratingAI(true);
          setAiGenerationTriggered(true);
        }
      );
      
      // Arrêter l'indicateur de chargement après un délai
      if (success) {
        setTimeout(() => {
          setIsGeneratingAI(false);
        }, 2000);
      } else {
        setIsGeneratingAI(false);
      }
    };
    
    // Délai pour éviter de déclencher trop tôt
    const timeoutId = setTimeout(tryAutoGenerateAI, 1500);
    
    return () => clearTimeout(timeoutId);
  }, [product, currentUser, userDetails, productStats, hasTriedAIGeneration]);

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun produit sélectionné</p>
      </div>
    );
  }

  // Utiliser les statistiques de la DB si disponibles, sinon celles du produit
  const displayStats = productStats || product;
  
  // Calculer les statistiques pour les badges
  const hasGoodRating = displayStats.average_rating >= 4;
  const isPopular = displayStats.total_favorites > 10 || displayStats.total_reviews > 20;
  const isVerified = displayStats.total_reviews > 0;

  const tabs = [
    { 
      id: 'avis', 
      label: 'AVIS', 
      icon: <MessageSquare size={18} />,
      badge: displayStats.total_reviews || 0,
      highlight: true
    },
    { 
      id: 'nutrition', 
      label: 'Nutrition', 
      icon: <BarChart3 size={18} />
    },
    { 
      id: 'environnement', 
      label: 'Environnement', 
      icon: <Shield size={18} />
    },
    { 
      id: 'infos', 
      label: 'Infos', 
      icon: <Eye size={18} />
    }
  ];

  // Fonction pour afficher les ingrédients selon la langue choisie
  const renderIngredients = () => {
    if (ingredientsLanguage === 'fr' && product.ingredients_text_fr) {
      return product.ingredients_text_fr;
    } else if (ingredientsLanguage === 'en' && product.ingredients_text_en) {
      return product.ingredients_text_en;
    } else if (ingredientsLanguage === 'origin' && product.ingredients_text) {
      return product.ingredients_text;
    } else {
      // Fallback
      if (product.ingredients_text_fr) {
        return product.ingredients_text_fr;
      } else if (product.ingredients_text_en) {
        return product.ingredients_text_en;
      } else if (product.ingredients_text) {
        return product.ingredients_text;
      }
      return "Ingrédients non disponibles";
    }
  };

  // Style commun pour les boutons de langue
  const languageButtonStyle = (activeLanguage, currentLanguage) => 
    `px-2 py-1 rounded text-xs ${activeLanguage === currentLanguage ? 'bg-green-500 text-white' : 'bg-gray-200'}`;

  // NOUVEAU : Fonction pour afficher les critères de notation
  const renderCriteriasInfo = () => {
    if (!productCriterias || productCriterias.length === 0) {
      return null;
    }

    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Tag size={18} className="text-blue-600" />
            <span className="font-semibold text-blue-800">
              Critères d'évaluation
              {categoryInfo?.categoryDisplayName && (
                <span className="text-sm font-normal text-blue-600 ml-2">
                  ({categoryInfo.categoryDisplayName})
                </span>
              )}
            </span>
          </div>
          <button
            onClick={() => setShowCriteriaInfo(!showCriteriaInfo)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ChevronDown 
              size={16} 
              className={`transform transition-transform ${showCriteriaInfo ? 'rotate-180' : ''}`} 
            />
          </button>
        </div>
        
        {showCriteriaInfo && (
          <div className="space-y-2">
            {productCriterias.map((criteria, index) => (
              <div key={criteria.id} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg">
                <div className="flex-1">
                  <span className="font-medium text-gray-800">{criteria.display_name}</span>
                  {criteria.description && (
                    <p className="text-sm text-gray-600 mt-1">{criteria.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Coef.</span>
                  <span className="font-bold text-blue-600">{criteria.weight}</span>
                </div>
              </div>
            ))}
            {!categoryInfo?.hasCategory && (
              <div className="mt-2 p-2 bg-amber-100 rounded-lg">
                <p className="text-xs text-amber-800">
                  💡 Ce produit utilise les critères par défaut. 
                  Une catégorisation pourrait permettre des critères plus spécifiques.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 transform ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}>
      {/* HERO SECTION PRODUIT AVEC FOCUS SUR LES AVIS - VERSION RESPONSIVE */}
      <div className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4 sm:p-6 lg:p-8 pb-4">
        {/* Badge de génération IA en cours - RESPONSIVE */}
        {isGeneratingAI && aiGenerationTriggered && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 animate-pulse z-10">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full shadow-lg flex items-center space-x-1 sm:space-x-2">
              <Bot size={14} className="sm:w-4 sm:h-4" />
              <span className="font-bold text-xs sm:text-sm">IA en cours...</span>
            </div>
          </div>
        )}

        {/* Badges flottants animés - RESPONSIVE */}
        {isPopular && !isGeneratingAI && (
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 animate-bounce z-10">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full shadow-lg flex items-center space-x-1 sm:space-x-2">
              <TrendingUp size={14} className="sm:w-4 sm:h-4" />
              <span className="font-bold text-xs sm:text-sm">Populaire</span>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Image produit - RESPONSIVE */}
          <div className="w-full lg:w-1/3">
            <div className="relative group">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.product_name || 'Produit'} 
                    className="w-full h-48 sm:h-56 lg:h-64 object-contain p-4 sm:p-6" 
                  />
                ) : (
                  <div className="h-48 sm:h-56 lg:h-64 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <span className="text-gray-400 text-sm">Image non disponible</span>
                  </div>
                )}
              </div>
              
              {/* Badge de qualité sur l'image - RESPONSIVE */}
              {hasGoodRating && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-lg flex items-center space-x-1 sm:space-x-2">
                    <Award size={14} className="sm:w-4 sm:h-4" />
                    <span className="font-bold text-xs sm:text-sm">Recommandé</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Infos produit avec MEGA FOCUS sur les avis - VERSION RESPONSIVE */}
          <div className="flex-1 mt-4 lg:mt-0">
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <div className="flex-1 pr-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-green-800 mb-2 leading-tight">
                  {product.product_name || 'Nom non disponible'}
                </h1>
                {product.brands && (
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 flex items-center">
                    <Award size={16} className="mr-2 text-green-600 flex-shrink-0" />
                    <span className="truncate">{product.brands}</span>
                  </p>
                )}
                {product.quantity && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">{product.quantity}</p>
                )}
              </div>
              
              {/* Bouton favori stylé - RESPONSIVE */}
              <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                <FavoriteButton 
                  productCode={product.code}
                  productData={product}
                  size="lg"
                />
              </div>
            </div>

            {/* MEGA SECTION NOTATION - LE POINT FOCAL - VERSION RESPONSIVE AVEC ÉTOILES PRÉCISES */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-4 sm:p-6 shadow-xl transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                  {/* Note principale ÉNORME - RESPONSIVE */}
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                      {displayStats.average_rating ? displayStats.average_rating.toFixed(2) : '0.00'}
                    </div>
                    {/* MODIFICATION : Utilisation des étoiles précises */}
                    <div className="flex justify-center mt-2">
                      {renderPreciseStars(displayStats.average_rating || 0, 24)}
                    </div>
                  </div>
                  
                  {/* Stats des avis - RESPONSIVE */}
                  <div className="text-white space-y-2 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <Users size={18} className="sm:w-5 sm:h-5" />
                      <span className="text-lg sm:text-xl font-semibold">
                        {displayStats.total_reviews || 0} avis
                      </span>
                    </div>
                    {displayStats.total_reviews > 0 && (
                      <div className="flex items-center justify-center sm:justify-start space-x-2 text-green-100">
                        <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">
                          100% vérifiés par ticket
                        </span>
                      </div>
                    )}
                    {displayStats.total_reviews > 0 && aiGenerationTriggered && (
                      <div className="flex items-center justify-center sm:justify-start space-x-2 text-blue-200">
                        <Bot size={14} className="sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">
                          Enrichi par IA
                        </span>
                      </div>
                    )}
                    {/* NOUVEAU : Indicateur de critères personnalisés */}
                    {categoryInfo?.hasCategory && (
                      <div className="flex items-center justify-center sm:justify-start space-x-2 text-yellow-200">
                        <Tag size={14} className="sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">
                          Critères spécialisés
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA pour voir les avis - RESPONSIVE ET TOUJOURS VISIBLE */}
                <button
                  onClick={() => setActiveTab('avis')}
                  className="bg-white text-green-700 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 group text-sm sm:text-base whitespace-nowrap"
                >
                  <MessageSquare size={18} className="sm:w-5 sm:h-5" />
                  <span>Voir les avis</span>
                  <ChevronDown size={14} className="sm:w-4 sm:h-4 group-hover:translate-y-1 transition-transform" />
                </button>
              </div>

              {/* NOUVEAU : Affichage des critères spécialisés dans la section notation AVEC ÉTOILES PRÉCISES */}
              {productCriterias.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20">
                  {productCriterias.slice(0, 3).map((criteria, index) => {
                    // Mapper les critères aux ratings correspondants
                    let ratingValue = 0;
                    if (criteria.name === 'taste' || criteria.name === 'critere1') ratingValue = displayStats.taste_rating;
                    else if (criteria.name === 'quantity' || criteria.name === 'critere2') ratingValue = displayStats.quantity_rating;
                    else if (criteria.name === 'price' ||  criteria.name === 'critere3') ratingValue = displayStats.price_rating;
                    
                    return (
                      <div key={criteria.id} className="text-center">
                        <p className="text-green-100 text-xs sm:text-sm mb-1 truncate">
                          {criteria.display_name}
                        </p>
                        {/* MODIFICATION : Utilisation des étoiles précises pour les critères */}
                        <div className="flex items-center justify-center mb-1">
                          {renderPreciseStars(ratingValue || 0, 16)}
                        </div>
                        <div className="flex items-center justify-center">
                          <span className="text-white font-bold text-sm sm:text-base">
                            {ratingValue > 0 ? ratingValue.toFixed(2) : '0.0'}
                          </span>
                          <span className="text-green-100 text-xs ml-1">
                            (×{criteria.weight})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* NOUVEAU : Section d'information sur les critères */}
            {renderCriteriasInfo()}

            {/* Historique des prix - RESPONSIVE */}
            {product.average_price > 0 && (
              <div className="mt-4 sm:mt-6">
                <PriceHistory 
                  productCode={product.code} 
                  averagePrice={product.average_price} 
                />
              </div>
            )}

            {/* NOUVEAU : Indicateur de chargement ou d'erreur des critères */}
            {criteriasLoading && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                <span className="text-sm text-gray-600">Chargement des critères...</span>
              </div>
            )}
            
            {criteriasError && (
              <div className="mt-3 p-3 bg-red-50 rounded-lg flex items-center space-x-2">
                <AlertCircle size={16} className="text-red-500" />
                <span className="text-sm text-red-600">
                  Erreur lors du chargement des critères: {criteriasError}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Navigation des onglets avec style moderne - VERSION RESPONSIVE */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <nav className="flex items-center px-4 sm:px-6 lg:px-8 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative py-3 sm:py-4 px-3 sm:px-6 font-medium transition-all duration-300 flex items-center space-x-1 sm:space-x-2 flex-shrink-0 ${
                activeTab === tab.id
                  ? tab.highlight 
                    ? 'text-green-700 border-b-4 border-green-600 bg-green-50'
                    : 'text-green-700 border-b-4 border-green-600'
                  : 'text-gray-500 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {/* Affichage conditionnel du label selon la taille d'écran et le type d'onglet */}
              <span className={`${tab.id === 'avis' ? 'block' : 'hidden sm:block'} text-sm sm:text-base`}>
                {tab.label}
              </span>
              {tab.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.id 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.badge}
                </span>
              )}
              {tab.highlight && activeTab === tab.id && (
                <Sparkles size={12} className="sm:w-4 sm:h-4 absolute -top-1 -right-1 text-amber-500 animate-pulse" />
              )}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Contenu des onglets - RESPONSIVE */}
      <div className="p-4 sm:p-6 lg:p-8">
        {activeTab === 'avis' && (
          <PageAvisEnhanced 
            product={product} 
            productStats={displayStats}
            productCriterias={productCriterias} // NOUVEAU : Passer les critères
            categoryInfo={categoryInfo} // NOUVEAU : Passer les infos de catégorie
          />
        )}
        {activeTab === 'nutrition' && <PageNutri product={product}           
          renderIngredients={renderIngredients}
          ingredientsLanguage={ingredientsLanguage}
          setIngredientsLanguage={setIngredientsLanguage}
          languageButtonStyle={languageButtonStyle} 
        />}
        {activeTab === 'environnement' && <PageEnvir product={product} />}
        {activeTab === 'infos' && <PageInfos product={product} />}
      </div>

      {/* Composant de statut de génération IA - RESPONSIVE */}
      {aiGenerationTriggered && (
        <AIReviewGenerationStatus 
          isGenerating={isGeneratingAI}
          progressMessage={aiProgressMessage}
          error={aiError}
        />
      )}
    </div>
  );
};

export default ProductDetail;