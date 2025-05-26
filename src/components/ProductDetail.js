// src/components/ProductDetail.js
import React, { useState, useEffect, useRef } from 'react';
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
  const [aiGenerationTriggered, setAiGenerationTriggered] = useState(false); // NOUVEAU: pour savoir si la génération a été déclenchée
  
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
      if (hasTriedAIGeneration) return; // Éviter les tentatives multiples
      
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
          setAiGenerationTriggered(true); // La génération a été déclenchée
          
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
          setAiGenerationTriggered(true); // La génération a été tentée
        },
        // onProgress
        (progressMessage) => {
          console.log('⏳ Progression IA:', progressMessage);
          setAiProgressMessage(progressMessage);
          setIsGeneratingAI(true);
          setAiGenerationTriggered(true); // La génération a été déclenchée
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
      {/* HERO SECTION PRODUIT AVEC FOCUS SUR LES AVIS */}
      <div className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 p-8 pb-4">
        {/* Badge de génération IA en cours - SEULEMENT si la génération a été déclenchée */}
        {isGeneratingAI && aiGenerationTriggered && (
          <div className="absolute top-4 left-4 animate-pulse">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
              <Bot size={16} />
              <span className="font-bold text-sm">IA en cours...</span>
            </div>
          </div>
        )}

        {/* Badges flottants animés */}
        {isPopular && !isGeneratingAI && (
          <div className="absolute top-4 right-4 animate-bounce">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
              <TrendingUp size={16} />
              <span className="font-bold text-sm">Populaire</span>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image produit */}
          <div className="lg:w-1/3">
            <div className="relative group">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.product_name || 'Produit'} 
                    className="w-full h-64 object-contain p-6" 
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <span className="text-gray-400">Image non disponible</span>
                  </div>
                )}
              </div>
              
              {/* Badge de qualité sur l'image */}
              {hasGoodRating && (
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
                    <Award size={16} />
                    <span className="font-bold text-sm">Recommandé</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Infos produit avec MEGA FOCUS sur les avis */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-green-800 mb-2">
                  {product.product_name || 'Nom non disponible'}
                </h1>
                {product.brands && (
                  <p className="text-lg text-gray-600 flex items-center">
                    <Award size={18} className="mr-2 text-green-600" />
                    {product.brands}
                  </p>
                )}
                {product.quantity && (
                  <p className="text-sm text-gray-500 mt-1">{product.quantity}</p>
                )}
              </div>
              
              {/* Bouton favori stylé */}
              <div className="flex items-center space-x-3">
                <FavoriteButton 
                  productCode={product.code}
                  productData={product}
                  size="lg"
                />
              </div>
            </div>

            {/* MEGA SECTION NOTATION - LE POINT FOCAL */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 shadow-xl transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  {/* Note principale ÉNORME */}
                  <div className="text-center">
                    <div className="text-6xl font-bold text-white">
                      {displayStats.average_rating ? displayStats.average_rating.toFixed(2) : '0.0'}
                    </div>
                    <div className="flex justify-center mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={24} 
                          className={`${
                            star <= Math.round(displayStats.average_rating || 0) 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-white/30"
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Stats des avis */}
                  <div className="text-white space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users size={20} />
                      <span className="text-xl font-semibold">
                        {displayStats.total_reviews || 0} avis
                      </span>
                    </div>
                    {displayStats.total_reviews > 0 && (
                      <div className="flex items-center space-x-2 text-green-100">
                        <CheckCircle size={16} />
                        <span className="text-sm">
                          100% vérifiés par ticket
                        </span>
                      </div>
                    )}
                    {/* Indicateur si avis IA présent - SEULEMENT si il y a des avis ET que la génération a été déclenchée */}
                    {displayStats.total_reviews > 0 && aiGenerationTriggered && (
                      <div className="flex items-center space-x-2 text-blue-200">
                        <Bot size={16} />
                        <span className="text-sm">
                          Enrichi par IA
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA pour voir les avis */}
                <button
                  onClick={() => setActiveTab('avis')}
                  className="bg-white text-green-700 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 group"
                >
                  <MessageSquare size={20} />
                  <span>Voir les avis</span>
                  <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
                </button>
              </div>

              {/* Mini stats en dessous */}
              {(displayStats.taste_rating > 0 || displayStats.quantity_rating > 0 || displayStats.price_rating > 0) && (
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
                  {displayStats.taste_rating > 0 && (
                    <div className="text-center">
                      <p className="text-green-100 text-sm mb-1">Goût</p>
                      <div className="flex items-center justify-center">
                        <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="text-white font-bold">{displayStats.taste_rating.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  {displayStats.quantity_rating > 0 && (
                    <div className="text-center">
                      <p className="text-green-100 text-sm mb-1">Quantité</p>
                      <div className="flex items-center justify-center">
                        <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="text-white font-bold">{displayStats.quantity_rating.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  {displayStats.price_rating > 0 && (
                    <div className="text-center">
                      <p className="text-green-100 text-sm mb-1">Prix</p>
                      <div className="flex items-center justify-center">
                        <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="text-white font-bold">{displayStats.price_rating.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Prix moyen et favoris */}
            <div className="flex items-center space-x-6 mt-4">
              {displayStats.average_price > 0 && (
                <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
                  <span className="text-blue-700 font-medium">Prix moyen:</span>
                  <span className="text-blue-900 font-bold text-lg">
                    {displayStats.average_price.toFixed(2).replace('.', ',')} €
                  </span>
                </div>
              )}
              
              {displayStats.total_favorites > 0 && (
                <div className="flex items-center space-x-2 bg-pink-50 px-4 py-2 rounded-full">
                  <Heart size={18} className="text-pink-500 fill-pink-500" />
                  <span className="text-pink-700 font-medium">
                    {displayStats.total_favorites} favoris
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation des onglets avec style moderne */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <nav className="flex items-center px-8 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative py-4 px-6 font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeTab === tab.id
                  ? tab.highlight 
                    ? 'text-green-700 border-b-4 border-green-600 bg-green-50'
                    : 'text-green-700 border-b-4 border-green-600'
                  : 'text-gray-500 hover:text-green-600 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.id 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.badge}
                </span>
              )}
              {tab.highlight && activeTab === tab.id && (
                <Sparkles size={14} className="absolute -top-1 -right-1 text-amber-500 animate-pulse" />
              )}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Contenu des onglets */}
      <div className="p-8">
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

      {/* Composant de statut de génération IA - SEULEMENT si la génération a été déclenchée */}
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