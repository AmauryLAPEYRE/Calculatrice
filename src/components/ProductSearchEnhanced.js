// src/components/ProductSearchEnhanced.js - Version avec scan ultra-rapide et design engageant

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
  
  // Scanner rapide avec overlay moderne
  const QuickScanOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-slideUp">
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center">
              <Camera size={28} className="mr-3 animate-pulse" />
              <h3 className="text-2xl font-bold">Scanner en cours...</h3>
            </div>
            <button
              onClick={() => setShowQuickScanner(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="p-6">
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


  // Illustration moderne pour la recherche
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
        
        {/* Animation de scan à l'intérieur */}
        <rect x="-30" y="-30" width="60" height="60" fill="none" stroke="#4CAF50" strokeWidth="2" strokeDasharray="5 5" opacity="0.3">
          <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
        </rect>
        
        {/* Ligne de scan animée */}
        <line x1="-30" y1="0" x2="30" y2="0" stroke="#4CAF50" strokeWidth="2" opacity="0.8">
          <animate attributeName="y1" values="-30;30;-30" dur="3s" repeatCount="indefinite" />
          <animate attributeName="y2" values="-30;30;-30" dur="3s" repeatCount="indefinite" />
        </line>
        
        {/* Code-barres au centre */}
        <g opacity="0.6">
          <rect x="-15" y="-10" width="2" height="20" fill="#333" />
          <rect x="-10" y="-10" width="3" height="20" fill="#333" />
          <rect x="-5" y="-10" width="2" height="20" fill="#333" />
          <rect x="0" y="-10" width="4" height="20" fill="#333" />
          <rect x="6" y="-10" width="2" height="20" fill="#333" />
          <rect x="10" y="-10" width="3" height="20" fill="#333" />
        </g>
        
        {/* Pulsation */}
        <circle cx="0" cy="0" r="60" fill="none" stroke="#4CAF50" strokeWidth="2" opacity="0">
          <animate attributeName="r" values="60;80;60" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Produits flottants autour */}
      <g opacity="0.8">
        {/* Produit 1 */}
        <g transform="translate(80, 80)">
          <rect x="-20" y="-25" width="40" height="50" rx="5" fill="url(#searchGrad2)" />
          <rect x="-15" y="-20" width="30" height="30" rx="3" fill="white" opacity="0.3" />
          <animateTransform attributeName="transform" type="translate" 
                            values="80,80; 85,75; 80,80" dur="4s" repeatCount="indefinite" />
        </g>
        
        {/* Produit 2 */}
        <g transform="translate(320, 100)">
          <circle cx="0" cy="0" r="25" fill="#CE93D8" />
          <circle cx="0" cy="-10" r="8" fill="#9C27B0" />
          <animateTransform attributeName="transform" type="translate" 
                            values="320,100; 315,95; 320,100" dur="3s" repeatCount="indefinite" />
        </g>
        
        {/* Produit 3 */}
        <g transform="translate(100, 220)">
          <rect x="-25" y="-15" width="50" height="30" rx="15" fill="#64B5F6" />
          <circle cx="0" cy="0" r="10" fill="white" opacity="0.3" />
          <animateTransform attributeName="transform" type="translate" 
                            values="100,220; 105,215; 100,220" dur="3.5s" repeatCount="indefinite" />
        </g>
      </g>
      
      {/* Particules flottantes */}
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
      
      {/* Badges flottants */}
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

  // Stats de confiance
  const trustStats = [
    { value: "2 sec", label: "Temps de scan", icon: <Zap size={16} /> },
    { value: "100%", label: "Avis vérifiés", icon: <Shield size={16} /> },
    { value: "50K+", label: "Produits référencés", icon: <Package size={16} /> },
    { value: "24/7", label: "Disponible", icon: <Clock size={16} /> }
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
    <section ref={sectionRef} className="min-h-screen bg-gradient-to-b from-green-50 to-white py-20 relative overflow-hidden">
      <Helmet>
        <title>Rechercher un Produit | Fydo - Scanner et Découvrir</title>
        <meta name="description" content="Scannez ou recherchez n'importe quel produit pour découvrir des avis vérifiés et des informations détaillées." />
      </Helmet>

     {/* Scanner rapide overlay */}
      {showQuickScanner && <QuickScanOverlay />}

      {/* Éléments décoratifs animés */}
      <div className="absolute top-20 left-5 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-5 w-24 h-24 bg-amber-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-sky-200 rounded-full opacity-20 animate-pulse"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <ol className="flex items-center space-x-2 text-sm text-green-600">
              <li><Link to="/" className="hover:text-green-800 transition-colors">Accueil</Link></li>
              <li><ChevronRight size={16} /></li>
              <li className="text-green-800 font-medium">Rechercher un produit</li>
              <li><ChevronRight size={16} /></li>
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
  <Camera size={16} className="mr-1" />
  Scan
</li>
            </ol>
          </nav>

          {/* Header Section avec animations et BOUTON SCAN FLOTTANT */}
          <div className={`mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Texte à gauche avec BOUTON SCAN ANIMÉ */}
              <div className="flex-1 text-center lg:text-left relative">
                <div className="relative inline-block">
                  <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
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
                        <Camera size={32} className="text-white" />
                      </div>
                      <div className="absolute -inset-1 bg-green-400 rounded-full animate-ping opacity-30"></div>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        Scanner maintenant!
                      </div>
                      <Sparkles size={20} className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" />
                    </div>
                  </button>
                </div>
                
                <p className="text-xl text-green-700 max-w-2xl mx-auto lg:mx-0 mb-8">
                  Scannez un code-barres ou recherchez par nom pour accéder à des avis 100% vérifiés et des informations détaillées
                </p>
                
                {/* Trust indicators */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  {trustStats.map((stat, index) => (
                    <div 
                      key={stat.label}
                      className={`flex items-center bg-white px-4 py-2 rounded-full shadow-sm transition-all duration-500 hover:shadow-md ${
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

          {/* Features cards avec animation */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {searchFeatures.map((feature, index) => (
              <div 
                key={feature.title}
                className={`group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-500 border border-green-100 cursor-pointer ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                } ${activeFeature === index ? 'ring-2 ring-green-500' : ''}`}
                style={{ transitionDelay: `${400 + index * 150}ms` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                  feature.color === 'green' ? 'from-green-100 to-green-200' :
                  feature.color === 'amber' ? 'from-amber-100 to-amber-200' :
                  feature.color === 'sky' ? 'from-sky-100 to-sky-200' :
                  'from-purple-100 to-purple-200'
                } flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(feature.icon, { 
                    className: feature.color === 'green' ? 'text-green-700' :
                               feature.color === 'amber' ? 'text-amber-600' :
                               feature.color === 'sky' ? 'text-sky-600' :
                               'text-purple-600'
                  })}
                </div>
                <h3 className="font-semibold text-green-800 mb-2">{feature.title}</h3>
                <p className="text-green-700 text-sm">{feature.description}</p>
                
                {/* Indicateur actif */}
                {activeFeature === index && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-b-2xl animate-pulse"></div>
                )}
              </div>
            ))}
          </div>

          {/* Affichage des quotas pour l'utilisateur */}
          {currentUser && !subscriptionLoading && (
            <div className={`transition-all duration-700 delay-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <UsageQuotaDisplay 
                userQuotas={userQuotas}
                userLimits={userLimits}
                isSubscriptionLimited={isSubscriptionLimited}
              />
            </div>
          )}

          {/* ZONE DE RECHERCHE AVEC 2 BLOCS DISTINCTS ET ATTRACTIFS */}
          <div className={`transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Message d'erreur stylisé */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start animate-fadeIn">
                <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* BLOC 1: SCAN INSTANTANÉ - SUPER ATTRACTIF */}
              <div className="group relative bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl overflow-hidden cursor-pointer"
                   onClick={() => {
                     if (!checkAuthorizationWrapper('scan')) {
                       setError("Limite de scans atteinte. Passez à un abonnement supérieur.");
                       return;
                     }
                     setShowScanner(true);
                   }}>
                {/* Éléments décoratifs animés */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-12 translate-y-12 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative z-10 text-center text-white">
                  {/* Icône animée */}
                  <div className="inline-block mb-6 relative">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                      <Camera size={40} className="text-white" />
                    </div>
                    <Zap size={24} className="absolute -top-2 -right-2 text-yellow-300 animate-pulse" />
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-3">Scan instantané</h3>
                  <p className="text-green-100 text-lg mb-6">Scannez le code-barres en 1 seconde</p>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 inline-flex items-center group-hover:bg-white/30 transition-colors">
                    <Scan size={24} className="mr-3" />
                    <span className="font-semibold text-lg">Appuyez pour scanner</span>
                    <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
                  </div>
                  
                  {/* Badge "Recommandé" */}
                  <div className="absolute top-4 right-4 bg-yellow-400 text-green-800 px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                    <Star size={16} className="mr-1" />
                    Recommandé
                  </div>
                </div>
              </div>

              {/* BLOC 2: RECHERCHE MANUELLE - DESIGN MODERNE */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-100 transform transition-all duration-500 hover:shadow-3xl">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">Recherche manuelle</h3>
                      <p className="text-amber-100">Par nom ou code-barres</p>
                    </div>
                    <Search size={32} className="opacity-50" />
                  </div>
                </div>
                
                <div className="p-8">
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
                    <div className="space-y-4">
                      <div className="relative group">
                        <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-amber-500 transition-colors" />
                        <input
                          name="search"
                          type="text"
                          className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 transition-all hover:border-amber-300"
                          placeholder="Ex: Nutella, 3017620422003..."
                          defaultValue={productName || barcode || ''}
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                          <Sparkles size={16} />
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center group"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Recherche...
                          </>
                        ) : (
                          <>
                            Rechercher
                            <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                  
                  {/* Lien pour les filtres avancés */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full mt-4 text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center justify-center group"
                  >
                    <Filter size={16} className="mr-2" />
                    Recherche avec filtres avancés
                    <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

{/* Scanner en plein écran si activé */}
            {showScanner && (
              <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-slideUp">
                  <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-t-3xl">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center">
                        <Camera size={28} className="mr-3 animate-pulse" />
                        <h3 className="text-2xl font-bold">Scanner en cours...</h3>
                      </div>
                      <button
                        onClick={() => setShowScanner(false)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <BarcodeScanner onScanComplete={handleScanComplete} autoStart={true} />
                  </div>
                </div>
              </div>
            )}

            {/* Section des filtres avec animation */}
            {showFilters && (
              <div className="mt-6 animate-slideDown">
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

            {/* Exemples de produits populaires */}
            {!product && !loading && !searchResults.length && (
              <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl">
                <div className="flex items-center mb-4">
                  <Sparkles size={20} className="text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Essayez ces produits populaires</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {exampleBarcodes.slice(0, 3).map((example, index) => (
                    <button
                      key={example.code}
                      className="group p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] border border-gray-100 text-left"
                      onClick={() => {
                        setBarcode(example.code);
                        handleBarcodeSearch(example.code);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-800 group-hover:text-green-600 transition-colors">
                            {example.name}
                          </div>
                          <div className="text-sm text-gray-500 font-mono mt-1">{example.code}</div>
                        </div>
                        <Scan size={18} className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Affichage du produit trouvé avec animation */}
          {product && (
            <div className={`mt-8 transition-all duration-700 ${
              product ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle size={24} className="mr-3" />
                      <h3 className="text-xl font-bold">Produit trouvé !</h3>
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
                        <Camera size={20} className="text-white" />   
                      </button>
                    
                      <button
                        onClick={() => {
                          setProduct(null);
                          setSearchResults([]);
                        }}
                        className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                      >
                        <X size={20} />
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

          {/* Résultats de recherche avec nouveau design */}
          {searchResults.length > 0 && !product && (
            <div className="mt-8">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">
                        {totalResults} résultats pour "{productName}"
                      </h3>
                      <p className="text-amber-100 text-sm mt-1">
                        Cliquez sur un produit pour voir les détails
                      </p>
                    </div>
                    <TrendingUp size={24} />
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

          {/* Section aide et conseils */}
          <div className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 delay-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-4">
                <Camera size={24} className="text-green-700" />
              </div>
              <h3 className="font-semibold text-green-800 mb-2">Scanner rapidement</h3>
              <p className="text-green-700 text-sm">
                Utilisez votre caméra pour scanner le code-barres et obtenir instantanément toutes les informations
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mb-4">
                <Filter size={24} className="text-amber-600" />
              </div>
              <h3 className="font-semibold text-amber-800 mb-2">Filtres avancés</h3>
              <p className="text-amber-700 text-sm">
                Affinez votre recherche avec des filtres par ingrédients pour trouver exactement ce que vous cherchez
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-100">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-sky-200 rounded-full flex items-center justify-center mb-4">
                <Heart size={24} className="text-sky-600" />
              </div>
              <h3 className="font-semibold text-sky-800 mb-2">Sauvegardez vos favoris</h3>
              <p className="text-sky-700 text-sm">
                Ajoutez vos produits préférés en favoris pour les retrouver facilement plus tard
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className={`mt-16 text-center transition-all duration-700 delay-1200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-white relative overflow-hidden">
              {/* Éléments décoratifs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full transform -translate-x-24 translate-y-24"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4">Besoin de plus de recherches ?</h2>
                <p className="text-green-100 mb-8 max-w-2xl mx-auto text-lg">
                  Passez à un abonnement supérieur pour débloquer des recherches illimitées et accéder à toutes les fonctionnalités premium
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    to="/abonnements"
                    className="bg-white hover:bg-gray-50 text-green-700 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 inline-flex items-center"
                  >
                    <Crown size={20} className="mr-2" />
                    Voir les abonnements
                  </Link>
                  
                  <Link
                    to="/top-produits"
                    className="bg-green-800 hover:bg-green-900 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 inline-flex items-center"
                  >
                    <Star size={20} className="mr-2" />
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