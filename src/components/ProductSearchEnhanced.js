// src/components/ProductSearchEnhanced.js - Version avec scan ultra-rapide et design engageant - Optimisé mobile

import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Scan, 
  Star, 
  Shield, 
  Zap, 
  Heart, 
  TrendingUp, 
  ChevronRight,
  Sparkles,
  BarChart3,
  Users,
  MessageSquare,
  Camera,
  AlertCircle,
  Filter,
  Crown,
  Award,
  Globe,
  ShoppingBag,
  Coffee,
  Package,
  Eye,
  Clock,
  CheckCircle,
  Info,
  X,
  Barcode,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import useProductSearch from '../hooks/useProductSearch';
import useSubscriptionPermissions from '../hooks/useSubscriptionPermissions';
import AuthRequiredScreen from './common/AuthRequiredScreen';
import LoadingOverlay from './common/LoadingOverlay';
import BarcodeScanner from './BarcodeScanner';
import ProductDetails from './product/ProductDetails';
import SearchResults from './product/SearchResults';
import UsageQuotaDisplay from './product/UsageQuotaDisplay';
import AdvancedSearchFilters from './AdvancedSearchFilters';

const ProductSearchEnhanced = () => {
  const { currentUser } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showQuickScanner, setShowQuickScanner] = useState(false);
  const sectionRef = useRef(null);
  
  const {
    activeTab, setActiveTab,
    setProduct, setSearchResults,
    barcode, setBarcode,
    productName, setProductName,
    product, searchResults,
    loading, error, setError,
    totalResults,
    searchFilters, filtersApplied,
    showScanner, setShowScanner,
    barcodeSource, setBarcodeSource,
    searchOrigin,
    isSubscriptionLimited, setIsSubscriptionLimited,
    productDetailRef,
    handleBarcodeSearch,
    handleNameSearch,
    handleScanComplete,
    selectProduct,
    loadMoreResults,
    handleApplyFilters,
    exampleBarcodes
  } = useProductSearch();
  
  const { 
    isAuthorized, 
    checkAuthorization, 
    getQuotaExceededMessage,
    userQuotas,
    userLimits,
    loading: subscriptionLoading
  } = useSubscriptionPermissions();

  // Détecter si mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Observer pour les animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  // Animation automatique des features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Si l'utilisateur n'est pas connecté
  if (!currentUser) {
    return <AuthRequiredScreen redirectPath="/recherche-filtre" />;
  }
  
  // Scanner rapide avec overlay moderne - Optimisé mobile
  const QuickScanOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-sm sm:max-w-lg shadow-2xl animate-slideUp mx-2">
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 sm:p-4 md:p-6 rounded-t-2xl sm:rounded-t-3xl">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center">
              <Camera size={20} className="sm:w-6 sm:h-6 mr-2 sm:mr-3 animate-pulse" />
              <h3 className="text-base sm:text-lg md:text-2xl font-bold">
                <span className="hidden sm:inline">Scanner en cours...</span>
                <span className="sm:hidden">Scan...</span>
              </h3>
            </div>
            <button
              onClick={() => setShowQuickScanner(false)}
              className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
        <div className="p-3 sm:p-4 md:p-6">
          <BarcodeScanner 
            onScanComplete={(code) => {
              setShowQuickScanner(false);
              handleScanComplete(code);
            }} 
            autoStart={true} 
          />
        </div>
      </div>
    </div>
  );

  // Illustration moderne pour la recherche - MASQUÉE SUR MOBILE
  const SearchIllustration = () => (
    <svg viewBox="0 0 400 300" className="w-full h-auto">
      <defs>
        <linearGradient id="searchGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#81C784', stopOpacity:1}}>
            <animate attributeName="stop-color" values="#81C784;#66BB6A;#81C784" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" style={{stopColor:'#4CAF50', stopOpacity:1}}>
            <animate attributeName="stop-color" values="#4CAF50;#43A047;#4CAF50" dur="4s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
        <linearGradient id="searchGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#FFD54F', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#FFA726', stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Loupe centrale */}
      <g transform="translate(200, 150)">
        <circle cx="0" cy="0" r="60" fill="white" stroke="url(#searchGrad1)" strokeWidth="4" />
        <circle cx="0" cy="0" r="50" fill="none" stroke="#66BB6A" strokeWidth="2" opacity="0.5" />
        <line x1="35" y1="35" x2="70" y2="70" stroke="url(#searchGrad1)" strokeWidth="6" strokeLinecap="round" />
        
        <rect x="-30" y="-30" width="60" height="60" fill="none" stroke="#4CAF50" strokeWidth="2" strokeDasharray="5 5" opacity="0.3">
          <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
        </rect>
        
        <line x1="-30" y1="0" x2="30" y2="0" stroke="#4CAF50" strokeWidth="2" opacity="0.8">
          <animate attributeName="y1" values="-30;30;-30" dur="3s" repeatCount="indefinite" />
          <animate attributeName="y2" values="-30;30;-30" dur="3s" repeatCount="indefinite" />
        </line>
        
        <g opacity="0.6">
          <rect x="-15" y="-10" width="2" height="20" fill="#333" />
          <rect x="-10" y="-10" width="3" height="20" fill="#333" />
          <rect x="-5" y="-10" width="2" height="20" fill="#333" />
          <rect x="0" y="-10" width="4" height="20" fill="#333" />
          <rect x="6" y="-10" width="2" height="20" fill="#333" />
          <rect x="10" y="-10" width="3" height="20" fill="#333" />
        </g>
        
        <circle cx="0" cy="0" r="60" fill="none" stroke="#4CAF50" strokeWidth="2" opacity="0">
          <animate attributeName="r" values="60;80;60" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Produits flottants autour */}
      <g opacity="0.8">
        <g transform="translate(80, 80)">
          <rect x="-20" y="-25" width="40" height="50" rx="5" fill="url(#searchGrad2)" />
          <rect x="-15" y="-20" width="30" height="30" rx="3" fill="white" opacity="0.3" />
          <animateTransform attributeName="transform" type="translate" 
                            values="80,80; 85,75; 80,80" dur="4s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(320, 100)">
          <circle cx="0" cy="0" r="25" fill="#CE93D8" />
          <circle cx="0" cy="-10" r="8" fill="#9C27B0" />
          <animateTransform attributeName="transform" type="translate" 
                            values="320,100; 315,95; 320,100" dur="3s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(100, 220)">
          <rect x="-25" y="-15" width="50" height="30" rx="15" fill="#64B5F6" />
          <circle cx="0" cy="0" r="10" fill="white" opacity="0.3" />
          <animateTransform attributeName="transform" type="translate" 
                            values="100,220; 105,215; 100,220" dur="3.5s" repeatCount="indefinite" />
        </g>
      </g>
      
      <g opacity="0.6">
        <circle cx="50" cy="150" r="3" fill="#81C784">
          <animate attributeName="cy" values="150;140;150" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="350" cy="80" r="4" fill="#FFD54F">
          <animate attributeName="cy" values="80;70;80" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="300" cy="200" r="3" fill="#CE93D8">
          <animate attributeName="cy" values="200;190;200" dur="4s" repeatCount="indefinite" />
        </circle>
      </g>
      
      <g opacity="0.9">
        <g transform="translate(120, 50)">
          <rect x="-30" y="-12" width="60" height="24" rx="12" fill="white" stroke="#4CAF50" strokeWidth="2" />
          <text x="0" y="4" textAnchor="middle" fill="#4CAF50" fontSize="12" fontWeight="bold">Vérifié</text>
          <animateTransform attributeName="transform" type="rotate" 
                            from="-5 120 50" to="5 120 50" dur="3s" 
                            repeatCount="indefinite" autoReverse="true" />
        </g>
      </g>
    </svg>
  );

  // Features principales
  const searchFeatures = [
    {
      icon: <Scan size={24} />,
      title: "Scan instantané",
      description: "Scannez et trouvez en 2 secondes",
      color: "green"
    },
    {
      icon: <Shield size={24} />,
      title: "Avis vérifiés",
      description: "100% authentiques par ticket",
      color: "amber"
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Données complètes",
      description: "Nutrition, prix, composition",
      color: "sky"
    },
    {
      icon: <Users size={24} />,
      title: "Communauté active",
      description: "50K+ avis partagés",
      color: "purple"
    }
  ];

  // Stats de confiance - AVEC LABELS COURTS
  const trustStats = [
    { value: "2 sec", label: "Temps de scan", labelShort: "Scan", icon: <Zap size={16} /> },
    { value: "100%", label: "Avis vérifiés", labelShort: "Vérifiés", icon: <Shield size={16} /> },
    { value: "50K+", label: "Produits référencés", labelShort: "Produits", icon: <Package size={16} /> },
    { value: "24/7", label: "Disponible", labelShort: "Dispo", icon: <Clock size={16} /> }
  ];

  const checkAuthorizationWrapper = (action) => {
    if (typeof isAuthorized !== 'function') {
      return true;
    }
    
    try {
      return isAuthorized(action);
    } catch (error) {
      console.error('Erreur lors de l\'appel à isAuthorized:', error);
      return true;
    }
  };

  return (
    <section ref={sectionRef} className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 sm:py-12 lg:py-20 relative overflow-hidden">
      <Helmet>
        <title>Rechercher un Produit | Fydo - Scanner et Découvrir</title>
        <meta name="description" content="Scannez ou recherchez n'importe quel produit pour découvrir des avis vérifiés et des informations détaillées." />
      </Helmet>

     {/* Scanner rapide overlay */}
      {showQuickScanner && <QuickScanOverlay />}

      {/* Éléments décoratifs animés - RESPONSIVE */}
      <div className="absolute top-10 sm:top-20 left-2 sm:left-5 w-12 h-12 sm:w-20 sm:h-20 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-5 sm:bottom-10 right-2 sm:right-5 w-16 h-16 sm:w-24 sm:h-24 bg-amber-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-1/2 left-5 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 bg-sky-200 rounded-full opacity-20 animate-pulse"></div>

      <div className="container mx-auto px-3 sm:px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb - SIMPLIFIÉ SUR MOBILE */}
          <nav className={`mb-4 sm:mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <ol className="flex items-center space-x-2 text-xs sm:text-sm text-green-600">
              {/* Version mobile : seulement "Recherche" */}
              <li className="block sm:hidden">
                <span className="text-green-800 font-medium">Recherche</span>
              </li>
              {/* Version desktop : breadcrumb complet */}
              <li className="hidden sm:block"><Link to="/" className="hover:text-green-800 transition-colors">Accueil</Link></li>
              <li className="hidden sm:block"><ChevronRight size={16} /></li>
              <li className="hidden sm:block"><span className="text-green-800 font-medium">Rechercher un produit</span></li>
              <li className="hidden sm:block"><ChevronRight size={16} /></li>
              <li 
                className="text-green-800 font-medium cursor-pointer hover:text-green-600 hover:bg-green-50 px-2 py-1 rounded transition-all duration-200 flex items-center"
                onClick={() => {
                  if (!checkAuthorizationWrapper('scan')) {
                    setError("Limite de scans atteinte. Passez à un abonnement supérieur.");
                    return;
                  }
                  setShowScanner(true);
                }}
              >
                <Camera size={14} className="sm:w-4 sm:h-4 mr-1" />
                Scan
              </li>
            </ol>
          </nav>

          {/* Header Section avec animations et BOUTON SCAN FLOTTANT - MASQUÉ SUR MOBILE */}
          <div className={`mb-8 sm:mb-16 transition-all duration-700 hidden md:block ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Texte à gauche avec BOUTON SCAN ANIMÉ */}
              <div className="flex-1 text-center lg:text-left relative">
                <div className="relative inline-block">
                  <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-green-800 mb-4">
                    Trouvez <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">instantanément</span> vos produits
                  </h1>
                  
                  {/* BOUTON SCAN FLOTTANT ANIMÉ */}
                  <button
                    onClick={() => {
                      if (!checkAuthorizationWrapper('scan')) {
                        setError("Limite de scans atteinte. Passez à un abonnement supérieur.");
                        return;
                      }
                      setShowQuickScanner(true);
                    }}
                    className="absolute -right-20 top-0 lg:-right-28 group animate-bounce hover:animate-none"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                        <Camera size={28} className="lg:w-8 lg:h-8 text-white" />
                      </div>
                      <div className="absolute -inset-1 bg-green-400 rounded-full animate-ping opacity-30"></div>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        Scanner maintenant!
                      </div>
                      <Sparkles size={18} className="lg:w-5 lg:h-5 absolute -top-2 -right-2 text-yellow-400 animate-pulse" />
                    </div>
                  </button>
                </div>
                
                <p className="text-lg lg:text-xl text-green-700 max-w-2xl mx-auto lg:mx-0 mb-6 lg:mb-8">
                  Scannez un code-barres ou recherchez par nom pour accéder à des avis 100% vérifiés et des informations détaillées
                </p>
                
                {/* Trust indicators */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 lg:gap-4">
                  {trustStats.map((stat, index) => (
                    <div 
                      key={stat.label}
                      className={`flex items-center bg-white px-3 lg:px-4 py-2 rounded-full shadow-sm transition-all duration-500 hover:shadow-md ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                      }`}
                      style={{ transitionDelay: `${200 + index * 100}ms` }}
                    >
                      <div className="text-green-600 mr-2">{stat.icon}</div>
                      <div>
                        <span className="font-bold text-green-800">{stat.value}</span>
                        <span className="text-green-600 text-sm ml-1">{stat.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Illustration à droite */}
              <div className={`lg:w-1/2 transition-all duration-1000 delay-300 transform ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}>
                <SearchIllustration />
              </div>
            </div>
          </div>

          {/* Header simplifié pour mobile */}
          <div className={`mb-4 sm:mb-6 md:hidden text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">
              Recherche <span className="text-green-600">produits</span>
            </h1>
            <p className="text-green-700 text-sm px-4">
              Scannez ou recherchez pour voir les avis vérifiés
            </p>
          </div>

          {/* Features cards avec animation - MASQUÉES SUR MOBILE */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12 hidden md:grid">
            {searchFeatures.map((feature, index) => (
              <div 
                key={feature.title}
                className={`group bg-white rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-500 border border-green-100 cursor-pointer ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                } ${activeFeature === index ? 'ring-2 ring-green-500' : ''}`}
                style={{ transitionDelay: `${400 + index * 150}ms` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br ${
                  feature.color === 'green' ? 'from-green-100 to-green-200' :
                  feature.color === 'amber' ? 'from-amber-100 to-amber-200' :
                  feature.color === 'sky' ? 'from-sky-100 to-sky-200' :
                  'from-purple-100 to-purple-200'
                } flex items-center justify-center mb-3 lg:mb-4 group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(feature.icon, { 
                    className: `w-5 h-5 lg:w-6 lg:h-6 ${
                      feature.color === 'green' ? 'text-green-700' :
                      feature.color === 'amber' ? 'text-amber-600' :
                      feature.color === 'sky' ? 'text-sky-600' :
                      'text-purple-600'
                    }`
                  })}
                </div>
                <h3 className="font-semibold text-green-800 mb-2 text-sm lg:text-base">{feature.title}</h3>
                <p className="text-green-700 text-xs lg:text-sm">{feature.description}</p>
                
                {/* Indicateur actif */}
                {activeFeature === index && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-b-2xl animate-pulse"></div>
                )}
              </div>
            ))}
          </div>

          {/* Affichage des quotas pour l'utilisateur - MASQUÉ SUR MOBILE */}
          {currentUser && !subscriptionLoading && (
            <div className={`transition-all duration-700 delay-600 md:block ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <UsageQuotaDisplay 
                userQuotas={userQuotas}
                userLimits={userLimits}
                isSubscriptionLimited={isSubscriptionLimited}
              />
            </div>
          )}

          {/* ZONE DE RECHERCHE AVEC 2 BLOCS DISTINCTS ET ATTRACTIFS - RESPONSIVE */}
          <div className={`transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Message d'erreur stylisé - RESPONSIVE */}
            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl flex items-start animate-fadeIn">
                <AlertCircle size={18} className="sm:w-5 sm:h-5 text-red-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-700 text-sm sm:text-base">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-2 text-xs sm:text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-8">
              {/* BLOC 1: SCAN INSTANTANÉ - SUPER ATTRACTIF - RESPONSIVE */}
              <div className="group relative bg-gradient-to-br from-green-500 to-green-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl overflow-hidden cursor-pointer"
                   onClick={() => {
                     if (!checkAuthorizationWrapper('scan')) {
                       setError("Limite de scans atteinte. Passez à un abonnement supérieur.");
                       return;
                     }
                     setShowScanner(true);
                   }}>
                {/* Éléments décoratifs animés - RESPONSIVE */}
                <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white opacity-10 rounded-full transform translate-x-8 sm:translate-x-12 md:translate-x-16 -translate-y-8 sm:-translate-y-12 md:-translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-white opacity-10 rounded-full transform -translate-x-6 sm:-translate-x-8 md:-translate-x-12 translate-y-6 sm:translate-y-8 md:translate-y-12 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative z-10 text-center text-white">
                  {/* Icône animée - RESPONSIVE */}
                  <div className="inline-block mb-3 sm:mb-4 md:mb-6 relative">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                      <Camera size={24} className="sm:w-7 sm:h-7 md:w-10 md:h-10 text-white" />
                    </div>
                    <Zap size={14} className="sm:w-4 sm:h-4 md:w-6 md:h-6 absolute -top-1 sm:-top-2 -right-1 sm:-right-2 text-yellow-300 animate-pulse" />
                  </div>
                  
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 md:mb-3">
                    <span className="hidden sm:inline">Scan instantané</span>
                    <span className="sm:hidden">Scanner</span>
                  </h3>
                  <p className="text-green-100 text-xs sm:text-sm md:text-base lg:text-lg mb-3 sm:mb-4 md:mb-6">
                    <span className="hidden sm:inline">Scannez en 1 seconde</span>
                    <span className="sm:hidden">1 seconde</span>
                  </p>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-4 inline-flex items-center group-hover:bg-white/30 transition-colors">
                    <Scan size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3" />
                    <span className="font-semibold text-sm sm:text-base md:text-lg">Scanner</span>
                    <ArrowRight size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5 ml-2 sm:ml-3 group-hover:translate-x-2 transition-transform" />
                  </div>
                  
                  {/* Badge "Recommandé" - RESPONSIVE */}
                  <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 bg-yellow-400 text-green-800 px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center shadow-lg">
                    <Star size={12} className="sm:w-3 sm:h-3 md:w-4 md:h-4 mr-1" />
                    Top
                  </div>
                </div>
              </div>

              {/* BLOC 2: RECHERCHE MANUELLE - DESIGN MODERNE - RESPONSIVE */}
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-amber-100 transform transition-all duration-500 hover:shadow-3xl">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-3 sm:p-4 md:p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-1">
                        <span className="hidden sm:inline">Recherche manuelle</span>
                        <span className="sm:hidden">Recherche</span>
                      </h3>
                      <p className="text-amber-100 text-xs sm:text-sm md:text-base">
                        <span className="hidden sm:inline">Par nom ou code-barres</span>
                        <span className="sm:hidden">Nom ou code</span>
                      </p>
                    </div>
                    <Search size={20} className="sm:w-6 sm:h-6 md:w-8 md:h-8 opacity-50" />
                  </div>
                </div>
                
                <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const value = e.target.search.value.trim();
                    if (!value) return;
                    
                    // Détecter si c'est un code-barres (que des chiffres)
                    const isBarcode = /^\d+$/.test(value);
                    
                    if (isBarcode) {
                      setBarcode(value);
                      handleBarcodeSearch(value);
                    } else {
                      setProductName(value);
                      handleNameSearch(true);
                    }
                  }}>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="relative group">
                        <Search size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-amber-500 transition-colors" />
                        <input
                          name="search"
                          type="text"
                          className="w-full pl-9 sm:pl-10 md:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-amber-500 transition-all hover:border-amber-300"
                          placeholder="Nutella, 301762..."
                          defaultValue={productName || barcode || ''}
                        />
                        <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                          <Sparkles size={12} className="sm:w-3 sm:h-3" />
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full px-4 py-2.5 sm:px-6 sm:py-3 md:py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center group"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="hidden sm:inline">Recherche...</span>
                            <span className="sm:hidden">...</span>
                          </>
                        ) : (
                          <>
                            Rechercher
                            <ChevronRight size={14} className="sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                  
                  {/* Lien pour les filtres avancés - MASQUÉ SUR MOBILE */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full mt-3 md:mt-4 text-amber-600 hover:text-amber-700 text-sm font-medium items-center justify-center group hidden md:flex"
                  >
                    <Filter size={16} className="mr-2" />
                    Recherche avec filtres avancés
                    <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scanner en plein écran si activé - RESPONSIVE */}
            {showScanner && (
              <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
                <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-sm sm:max-w-lg shadow-2xl animate-slideUp mx-2">
                  <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 sm:p-4 md:p-6 rounded-t-2xl sm:rounded-t-3xl">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center">
                        <Camera size={20} className="sm:w-6 sm:h-6 mr-2 sm:mr-3 animate-pulse" />
                        <h3 className="text-base sm:text-lg md:text-2xl font-bold">
                          <span className="hidden sm:inline">Scanner en cours...</span>
                          <span className="sm:hidden">Scan...</span>
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowScanner(false)}
                        className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <X size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 md:p-6">
                    <BarcodeScanner onScanComplete={handleScanComplete} autoStart={true} />
                  </div>
                </div>
              </div>
            )}

            {/* Section des filtres avec animation - MASQUÉE SUR MOBILE */}
            {showFilters && (
              <div className="mt-6 animate-slideDown hidden md:block">
                <AdvancedSearchFilters 
                  onApplyFilters={(filters) => {
                    handleApplyFilters(filters);
                    if (productName) {
                      handleNameSearch(true);
                    }
                  }} 
                />
              </div>
            )}

            {/* Exemples de produits populaires - RESPONSIVE */}
            {!product && !loading && !searchResults.length && (
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl">
                <div className="flex items-center mb-3 sm:mb-4">
                  <Sparkles size={18} className="sm:w-5 sm:h-5 text-green-600 mr-2" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    <span className="hidden sm:inline">Essayez ces produits populaires</span>
                    <span className="sm:hidden">Produits populaires</span>
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {exampleBarcodes.slice(0, 3).map((example, index) => (
                    <button
                      key={example.code}
                      className="group p-3 sm:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] border border-gray-100 text-left"
                      onClick={() => {
                        setBarcode(example.code);
                        handleBarcodeSearch(example.code);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-800 group-hover:text-green-600 transition-colors text-sm sm:text-base truncate">
                            {example.name}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 font-mono mt-1">{example.code}</div>
                        </div>
                        <Scan size={16} className="sm:w-5 sm:h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Affichage du produit trouvé avec animation - RESPONSIVE */}
          {product && (
            <div className={`mt-6 sm:mt-8 transition-all duration-700 ${
              product ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 sm:p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle size={20} className="sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                      <h3 className="text-lg sm:text-xl font-bold">
                        <span className="hidden sm:inline">Produit trouvé !</span>
                        <span className="sm:hidden">Trouvé !</span>
                      </h3>
                    </div>
                    {/* Groupe des boutons caméra et fermeture collés ensemble */}
                    <div className="flex items-center gap-2">         
                      <button onClick={() => {
                        if (!checkAuthorizationWrapper('scan')) {
                          setError("Limite de scans atteinte. Passez à un abonnement supérieur.");
                          return;
                        }
                        setShowScanner(true);
                      }}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors">
                        <Camera size={18} className="sm:w-5 sm:h-5 text-white" />   
                      </button>
                    
                      <button
                        onClick={() => {
                          setProduct(null);
                          setSearchResults([]);
                        }}
                        className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                      >
                        <X size={18} className="sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <ProductDetails 
                  ref={productDetailRef}
                  product={product} 
                  showDetailedInfo={checkAuthorizationWrapper('detailed_info')}
                />
              </div>
            </div>
          )}

          {/* Résultats de recherche avec nouveau design - RESPONSIVE */}
          {searchResults.length > 0 && !product && (
            <div className="mt-6 sm:mt-8">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 sm:p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold">
                        {totalResults} résultats
                        <span className="hidden sm:inline"> pour "{productName}"</span>
                      </h3>
                      <p className="text-amber-100 text-xs sm:text-sm mt-1">
                        <span className="hidden sm:inline">Cliquez sur un produit pour voir les détails</span>
                        <span className="sm:hidden">Cliquez pour détails</span>
                      </p>
                    </div>
                    <TrendingUp size={20} className="sm:w-6 sm:h-6" />
                  </div>
                </div>
                <SearchResults
                  results={searchResults}
                  totalResults={totalResults}
                  searchTerm={productName}
                  onSelectProduct={selectProduct}
                  onLoadMore={loadMoreResults}
                  loading={loading}
                  searchFilters={searchFilters}
                />
              </div>
            </div>
          )}

          {/* Section aide et conseils - MASQUÉE SUR MOBILE */}
          <div className={`mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 transition-all duration-700 delay-1000 hidden md:grid ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-3 lg:mb-4">
                <Camera size={20} className="lg:w-6 lg:h-6 text-green-700" />
              </div>
              <h3 className="font-semibold text-green-800 mb-2 text-sm lg:text-base">Scanner rapidement</h3>
              <p className="text-green-700 text-xs lg:text-sm">
                Utilisez votre caméra pour scanner le code-barres et obtenir instantanément toutes les informations
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mb-3 lg:mb-4">
                <Filter size={20} className="lg:w-6 lg:h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-amber-800 mb-2 text-sm lg:text-base">Filtres avancés</h3>
              <p className="text-amber-700 text-xs lg:text-sm">
                Affinez votre recherche avec des filtres par ingrédients pour trouver exactement ce que vous cherchez
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-100">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-sky-100 to-sky-200 rounded-full flex items-center justify-center mb-3 lg:mb-4">
                <Heart size={20} className="lg:w-6 lg:h-6 text-sky-600" />
              </div>
              <h3 className="font-semibold text-sky-800 mb-2 text-sm lg:text-base">Sauvegardez vos favoris</h3>
              <p className="text-sky-700 text-xs lg:text-sm">
                Ajoutez vos produits préférés en favoris pour les retrouver facilement plus tard
              </p>
            </div>
          </div>

          {/* CTA Section - MASQUÉE SUR MOBILE */}
          <div className={`mt-12 lg:mt-16 text-center transition-all duration-700 delay-1200 hidden md:block ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 lg:p-12 text-white relative overflow-hidden">
              {/* Éléments décoratifs */}
              <div className="absolute top-0 right-0 w-32 lg:w-64 h-32 lg:h-64 bg-white opacity-5 rounded-full transform translate-x-16 lg:translate-x-32 -translate-y-16 lg:-translate-y-32"></div>
              <div className="absolute bottom-0 left-0 w-24 lg:w-48 h-24 lg:h-48 bg-white opacity-5 rounded-full transform -translate-x-12 lg:-translate-x-24 translate-y-12 lg:translate-y-24"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl lg:text-3xl font-bold mb-4">Besoin de plus de recherches ?</h2>
                <p className="text-green-100 mb-6 lg:mb-8 max-w-2xl mx-auto text-base lg:text-lg">
                  Passez à un abonnement supérieur pour débloquer des recherches illimitées et accéder à toutes les fonctionnalités premium
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center items-center">
                  <Link
                    to="/abonnements"
                    className="bg-white hover:bg-gray-50 text-green-700 font-bold py-3 px-6 lg:py-4 lg:px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 inline-flex items-center text-sm lg:text-base"
                  >
                    <Crown size={18} className="lg:w-5 lg:h-5 mr-2" />
                    Voir les abonnements
                  </Link>
                  
                  <Link
                    to="/top-produits"
                    className="bg-green-800 hover:bg-green-900 text-white font-bold py-3 px-6 lg:py-4 lg:px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 inline-flex items-center text-sm lg:text-base"
                  >
                    <Star size={18} className="lg:w-5 lg:h-5 mr-2" />
                    Top produits
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Loading overlay moderne */}
      {loading && <LoadingOverlay />}

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default ProductSearchEnhanced;