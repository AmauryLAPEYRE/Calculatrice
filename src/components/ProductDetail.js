// src/components/ProductDetail.js
import React, { useState, useEffect, useRef } from 'react';
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
  AlertCircle
} from 'lucide-react';
import PageNutri from './PageNutri';
import PageEnvir from './PageEnvir';
import PageAvisEnhanced from './PageAvisEnhanced';
import PageInfos from './PageInfos';
import FavoriteButton from './FavoriteButton';
import { findProductInDatabase, saveProductToDatabase } from '../services/productDatabaseService';
import { getProductDetails } from '../services/productService';

// Dans ProductDetail.js, remplacez les imports par :

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
  
  const menuRef = useRef(null);
  const { currentUser, userDetails } = useAuth();

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

            {/* MEGA SECTION NOTATION - LE POINT FOCAL - VERSION RESPONSIVE */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-4 sm:p-6 shadow-xl transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                  {/* Note principale ÉNORME - RESPONSIVE */}
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                      {displayStats.average_rating ? displayStats.average_rating.toFixed(2) : '0.00'}
                    </div>
                    <div className="flex justify-center mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={20} 
                          className={`sm:w-6 sm:h-6 ${
                            star <= Math.round(displayStats.average_rating || 0) 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-white/30"
                          }`} 
                        />
                      ))}
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

              {/* Mini stats en dessous - RESPONSIVE */}
              {(displayStats.taste_rating > 0 || displayStats.quantity_rating > 0 || displayStats.price_rating > 0) && (
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20">
                  {displayStats.taste_rating > 0 && (
                    <div className="text-center">
                      <p className="text-green-100 text-xs sm:text-sm mb-1">Goût</p>
                      <div className="flex items-center justify-center">
                        <Star size={14} className="sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="text-white font-bold text-sm sm:text-base">{displayStats.taste_rating.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  {displayStats.quantity_rating > 0 && (
                    <div className="text-center">
                      <p className="text-green-100 text-xs sm:text-sm mb-1">Quantité</p>
                      <div className="flex items-center justify-center">
                        <Star size={14} className="sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="text-white font-bold text-sm sm:text-base">{displayStats.quantity_rating.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  {displayStats.price_rating > 0 && (
                    <div className="text-center">
                      <p className="text-green-100 text-xs sm:text-sm mb-1">Prix</p>
                      <div className="flex items-center justify-center">
                        <Star size={14} className="sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="text-white font-bold text-sm sm:text-base">{displayStats.price_rating.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Historique des prix - RESPONSIVE */}
            {product.average_price > 0 && (
              <div className="mt-4 sm:mt-6">
                <PriceHistory 
                  productCode={product.code} 
                  averagePrice={product.average_price} 
                />
              </div>
            )}

            {/* Prix moyen et favoris - RESPONSIVE */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-3 sm:mt-4">
              {displayStats.total_favorites > 0 && (
                <div className="flex items-center space-x-2 bg-pink-50 px-3 py-2 sm:px-4 rounded-full">
                  <Heart size={16} className="sm:w-5 sm:h-5 text-pink-500 fill-pink-500" />
                  <span className="text-pink-700 font-medium text-sm sm:text-base">
                    {displayStats.total_favorites} favoris
                  </span>
                </div>
              )}
            </div>
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
        {activeTab === 'avis' && <PageAvisEnhanced product={product} productStats={displayStats} />}
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