// src/pages/TopProducts.js
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import AuthRequiredScreen from '../components/common/AuthRequiredScreen';
import { Link, useNavigate } from 'react-router-dom';
import TopProductsToggle from '../components/navigation/TopProductsToggle';
import { 
  Star, 
  TrendingUp, 
  Heart, 
  MessageSquare, 
  Award, 
  Users, 
  Filter, 
  ChevronRight, 
  Search, 
  Crown,
  Zap,
  Shield,
  Sparkles,
  BarChart3,
  ShoppingBag,
  Scan
} from 'lucide-react';
import { getTopProducts } from '../services/topProductsService';
import SearchResultItem from '../components/product/SearchResultItem';
import { useAuth } from '../contexts/AuthContext';

const TopProducts = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const sectionRef = useRef(null);
  
  // États pour les données
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('average_rating');
  const [sortAsc, setSortAsc] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('average_rating');

  
  // Observer pour déclencher les animations
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

  
  // Configuration des critères de tri avec design amélioré
  const sortOptions = [
    { 
      value: 'average_rating', 
      label: 'Mieux notés',
      labelShort: 'Notes',
      icon: <Star size={18} />,
      color: 'amber',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-600',
      description: 'Meilleures notes'
    },
    { 
      value: 'total_reviews', 
      label: 'Plus commentés',
      labelShort: 'Avis',
      icon: <MessageSquare size={18} />,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Plus d\'avis'
    },
    { 
      value: 'total_favorites', 
      label: 'Plus aimés',
      labelShort: 'Favoris',
      icon: <Heart size={18} />,
      color: 'pink',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-600',
      description: 'Plus aimés'
    },
    { 
      value: 'taste_rating', 
      label: 'Meilleur goût',
      labelShort: 'Goût',
      icon: <Award size={18} />,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Meilleur goût'
    }
  ];

  // Charger les produits
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const options = {
          searchTerm,
          sortBy,
          sortAsc,
          limit: 20,
          offset: 0
        };
        
        const { success, products: fetchedProducts, totalCount: count, error: fetchError } = 
          await getTopProducts(options);
        
        if (success) {
          setProducts(fetchedProducts || []);
          setTotalCount(count || 0);
        } else {
          setError(fetchError || 'Erreur lors du chargement des produits');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des top produits:', err);
        setError('Une erreur est survenue lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, sortBy, sortAsc]);

  // Si l'utilisateur n'est pas connecté
  if (!currentUser) {
    return <AuthRequiredScreen redirectPath="/top-produits" />;
  }
  // Navigation vers la page de détail d'un produit
  const handleProductSelect = (productCode) => {
    navigate(`/recherche-filtre?barcode=${productCode}`);
  };

  // Changer le filtre actif
  const handleFilterChange = (value) => {
    setActiveFilter(value);
    setSortBy(value);
  };

  // Option actuellement sélectionnée
  const currentSortOption = sortOptions.find(option => option.value === sortBy);

  // Stats dynamiques basées sur les données
  const stats = [
    {
      icon: <BarChart3 size={20} />,
      value: totalCount,
      label: 'Produits évalués',
      labelShort: 'Produits',
      color: 'green',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: <Star size={20} />,
      value: '100K+',
      label: 'Avis vérifiés',
      labelShort: 'Avis',
      color: 'amber',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
    {
      icon: <Users size={20} />,
      value: '10K+',
      label: 'Membres actifs',
      labelShort: 'Membres',
      color: 'blue',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: <Shield size={20} />,
      value: '100%',
      label: 'Avis authentiques',
      labelShort: 'Authent.',
      color: 'pink',
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600'
    }
  ];

  return (
    <section ref={sectionRef} className="py-8 sm:py-12 lg:py-20 bg-green-50 min-h-screen relative overflow-hidden">
      <Helmet>
        <title>Top Produits | Fydo - Les Meilleurs Produits Notés par la Communauté</title>
        <meta name="description" content="Découvrez les produits les mieux notés par notre communauté. Avis vérifiés, notes authentiques et recommandations fiables pour vos achats quotidiens." />
      </Helmet>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Éléments décoratifs animés - RESPONSIVE */}
      <div className="absolute top-10 sm:top-20 left-2 sm:left-5 w-12 h-12 sm:w-20 sm:h-20 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-5 sm:bottom-10 right-2 sm:right-5 w-16 h-16 sm:w-24 sm:h-24 bg-amber-200 rounded-full opacity-20 animate-pulse"></div>

      <div className="container mx-auto px-3 sm:px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb - SIMPLIFIÉ SUR MOBILE */}
          <nav className={`mb-4 sm:mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <ol className="flex items-center space-x-2 text-xs sm:text-sm text-green-600">
              {/* Version mobile : seulement "Top Produits" */}
              <li className="block sm:hidden">
                <span className="text-green-800 font-medium">Top Produits</span>
              </li>
              {/* Version desktop : breadcrumb complet */}
              <li className="hidden sm:block"><Link to="/" className="hover:text-green-800 transition-colors">Accueil</Link></li>
              <li className="hidden sm:block"><ChevronRight size={16} /></li>
              <li className="hidden sm:block"><span className="text-green-800 font-medium">Top Produits</span></li>
            </ol>
          </nav>

         {/* Navigation entre les modes - RESPONSIVE */}
          <div className={`mb-4 sm:mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <TopProductsToggle />
          </div>

          {/* Header Section avec animations - VERSION MOBILE OPTIMISÉE */}
          <div className={`mb-8 sm:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
              {/* Texte à gauche - RESPONSIVE */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 mb-2 sm:mb-4">
                  Le Palmarès des <span className="text-green-600 block sm:inline">Produits d'Excellence</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-green-700 max-w-3xl mx-auto lg:mx-0 mb-4 sm:mb-8">
                  <span className="hidden sm:inline">Découvrez les champions de chaque catégorie, plébiscités par notre communauté d'experts du quotidien</span>
                  <span className="sm:hidden">Les champions plébiscités par notre communauté</span>
                </p>
                
                {/* Trust indicators avec animation - RESPONSIVE */}
                <div className={`flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 md:gap-4 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <span className="text-xs sm:text-sm text-green-700 flex items-center bg-white px-2 py-1 rounded-full shadow-sm">
                    <Shield size={12} className="mr-1 text-green-600" />
                    <span className="hidden sm:inline">Avis 100% vérifiés</span>
                    <span className="sm:hidden">Vérifiés</span>
                  </span>
                  <span className="text-xs sm:text-sm text-green-700 flex items-center bg-white px-2 py-1 rounded-full shadow-sm">
                    <Crown size={12} className="mr-1 text-amber-500" />
                    <span className="hidden sm:inline">Classement en temps réel</span>
                    <span className="sm:hidden">Temps réel</span>
                  </span>
                  <span className="text-xs sm:text-sm text-green-700 flex items-center bg-white px-2 py-1 rounded-full shadow-sm">
                    <Zap size={12} className="mr-1 text-blue-500" />
                    <span className="hidden sm:inline">Mis à jour quotidiennement</span>
                    <span className="sm:hidden">Quotidien</span>
                  </span>
                </div>
              </div>

              {/* Téléphone à droite - MASQUÉ SUR MOBILE POUR ÉCONOMISER L'ESPACE */}
              <div className="relative max-w-xs lg:max-w-sm hidden lg:block">
                <div className="relative">
                  {/* Fond décoratif */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-200 to-amber-200 rounded-[40px] transform rotate-6 scale-105 opacity-50 animate-pulse"></div>
                  
                  {/* Téléphone */}
                  <div className="relative w-full aspect-[9/19] border-8 border-gray-800 rounded-[32px] overflow-hidden shadow-2xl bg-white transform hover:scale-[1.02] transition-transform duration-300">
                    {/* Encoche du téléphone */}
                    <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 z-20 flex justify-center items-end">
                      <div className="w-20 h-4 bg-gray-900 rounded-b-lg"></div>
                    </div>
                    
                    {/* Contenu de l'écran */}
                    <div className="w-full h-full bg-gradient-to-b from-green-50 to-white p-6 pt-8">
                      {/* Header app */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="text-green-800 font-bold text-xl">Top Produits</div>
                        <div className="flex space-x-1">
                          <Star size={20} className="text-amber-500 fill-amber-500" />
                          <Star size={20} className="text-amber-500 fill-amber-500" />
                          <Star size={20} className="text-amber-500 fill-amber-500" />
                        </div>
                      </div>
                      
                      {/* Liste produits animée */}
                      <div className="space-y-3">
                        {[1, 2, 3].map((item, index) => (
                          <div 
                            key={item}
                            className={`bg-white rounded-lg p-3 shadow-sm flex items-center transition-all duration-700 transform ${
                              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                            }`}
                            style={{ transitionDelay: `${800 + index * 200}ms` }}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 ${
                              index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500' : 
                              index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' : 
                              'bg-gradient-to-br from-amber-600 to-amber-700'
                            }`}>
                              {index === 0 ? '🥇' : 
                               index === 1 ? '🥈' : 
                               '🥉'}
                            </div>
                            <div className="flex-1">
                              <div className="h-2 bg-gray-200 rounded-full w-3/4 mb-1"></div>
                              <div className="h-2 bg-gray-100 rounded-full w-1/2"></div>
                            </div>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} size={10} className="text-amber-400 fill-amber-400" />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Badge flottant */}
                      <div className="absolute bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold animate-bounce">
                        <TrendingUp size={16} className="inline mr-1" />
                        Live
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques animées avec élément décoratif intégré - RESPONSIVE */}
          <div className="mb-8 sm:mb-12">
            {/* Bandeau animé de produits top - Version horizontale compacte - RESPONSIVE */}
            <div className={`bg-gradient-to-r from-green-50 via-white to-amber-50 rounded-lg shadow-sm p-2 sm:p-3 mb-4 sm:mb-6 border border-green-100 overflow-hidden transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-4 flex-1 overflow-x-auto scrollbar-hide">
                  <div className="flex items-center flex-shrink-0">
                    <Sparkles size={14} className="sm:w-4 sm:h-4 text-amber-500 mr-1 sm:mr-1.5" />
                    <span className="text-xs sm:text-sm font-semibold text-green-800 mr-2 sm:mr-3">Top 3</span>
                  </div>
                  
                  {[
                    { rank: "🥇", rating: 4.9 },
                    { rank: "🥈", rating: 4.8 },
                    { rank: "🥉", rating: 4.7 }
                  ].map((product, index) => (
                    <div 
                      key={index}
                      className="flex items-center bg-white rounded-md px-2 py-1 sm:px-3 sm:py-1.5 shadow-sm flex-shrink-0"
                    >
                      <span className="text-sm sm:text-lg mr-1 sm:mr-2">{product.rank}</span>
                      <div className="flex items-center">
                        <Star size={10} className="sm:w-3 sm:h-3 text-amber-500 fill-amber-500 mr-1" />
                        <span className="font-semibold text-xs sm:text-sm">{product.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <span className="bg-green-600 text-white px-1.5 py-0.5 sm:px-2 rounded-full text-xs font-bold animate-pulse flex items-center ml-2 sm:ml-3 flex-shrink-0">
                  <TrendingUp size={8} className="sm:w-2.5 sm:h-2.5 mr-0.5 sm:mr-1" />
                  LIVE
                </span>
              </div>
            </div>

            {/* Grille de statistiques - RESPONSIVE */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className={`bg-white rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-500 border border-green-100 text-center ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                  }`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <div className={`w-8 h-8 sm:w-12 sm:h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 transform hover:rotate-12 transition-transform`}>
                    {React.cloneElement(stat.icon, { className: `${stat.iconColor} w-4 h-4 sm:w-5 sm:h-5` })}
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-green-800">{stat.value}</div>
                  <div className="text-green-600 text-xs sm:text-sm">
                    <span className="hidden sm:inline">{stat.label}</span>
                    <span className="sm:hidden">{stat.labelShort}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section de filtrage améliorée - VERSION MOBILE OPTIMISÉE */}
          <div className={`mb-8 sm:mb-12 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Barre de recherche moderne - RESPONSIVE */}
            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mb-3 sm:mb-4 border border-green-100">
              <div className="relative">
                <Search size={18} className="sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-16 sm:pr-20 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base md:text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                  {totalCount}
                </div>
              </div>
            </div>

            {/* Filtres par catégorie avec design cards - VERSION MOBILE COMPACTE */}
            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-5 border border-green-100">
              <div className="flex items-center mb-3">
                <Filter size={16} className="sm:w-5 sm:h-5 text-green-600 mr-2" />
                <h3 className="text-base sm:text-lg font-bold text-green-800">Classement</h3>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange(option.value)}
                    className={`relative p-2 sm:p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                      activeFilter === option.value
                        ? `bg-gradient-to-br from-${option.color}-50 to-${option.color}-100 border-2 border-${option.color}-500 shadow-lg`
                        : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                    }`}
                  >
                    {/* Badge actif */}
                    {activeFilter === option.value && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    )}

                    <div className={`w-6 h-6 sm:w-10 sm:h-10 ${option.bgColor} rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2`}>
                      {React.cloneElement(option.icon, { className: `${option.textColor} w-3 h-3 sm:w-5 sm:h-5` })}
                    </div>
                    <h4 className={`font-semibold text-xs sm:text-sm mb-1 ${
                      activeFilter === option.value ? option.textColor : 'text-gray-800'
                    }`}>
                      <span className="hidden sm:inline">{option.label}</span>
                      <span className="sm:hidden">{option.labelShort}</span>
                    </h4>
                    <p className="text-xs text-gray-600 hidden sm:block">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Liste des produits avec nouveau design - RESPONSIVE */}
          <div className={`transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-green-100">
              {/* Header de la liste - RESPONSIVE */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 sm:p-5 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center">
                    {currentSortOption && React.cloneElement(currentSortOption.icon, { className: 'text-white mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5' })}
                    <div>
                      <h2 className="text-lg sm:text-2xl font-bold">
                        <span className="hidden sm:inline">Classement : </span>
                        {currentSortOption?.labelShort || currentSortOption?.label}
                      </h2>
                      <p className="text-green-100 text-xs sm:text-sm mt-1">
                        <span className="hidden sm:inline">{currentSortOption?.description}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center bg-white bg-opacity-20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                    <TrendingUp size={14} className="sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="font-medium text-sm sm:text-base">{totalCount}</span>
                  </div>
                </div>
              </div>

              {/* Contenu de la liste */}
              {loading ? (
                <div className="p-8 sm:p-16 text-center">
                  <div className="inline-flex flex-col items-center">
                    <div className="relative">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-green-200 rounded-full animate-spin"></div>
                      <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-4 border-green-600 rounded-full animate-spin border-t-transparent"></div>
                    </div>
                    <span className="text-green-700 mt-4 font-medium text-sm sm:text-base">Chargement du palmarès...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="p-8 sm:p-16 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl sm:text-2xl">😕</span>
                  </div>
                  <div className="text-red-600 mb-4 font-medium text-sm sm:text-base">{error}</div>
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                  >
                    Réessayer
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="p-8 sm:p-16 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Search size={32} className="sm:w-10 sm:h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-3">Aucun produit trouvé</h3>
                  <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base">
                    Essayez de modifier vos critères de recherche
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {products.map((product, index) => (
                    <div key={product.code} className="relative hover:bg-green-50 transition-colors">
                      {/* Médaille de classement - RESPONSIVE */}
                      <div className="absolute top-3 sm:top-6 left-3 sm:left-6 z-10">
                        <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg shadow-lg transform hover:scale-110 transition-transform ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' : 
                          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' : 
                          index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' : 
                          'bg-white border-2 border-green-200 text-green-600'
                        }`}>
                          {index === 0 ? '🥇' : 
                           index === 1 ? '🥈' : 
                           index === 2 ? '🥉' : 
                           index + 1}
                        </div>
                      </div>
                      
                      <div className="pl-12 sm:pl-20">
                        <SearchResultItem
                          result={product}
                          onSelect={handleProductSelect}
                          searchFilters={{}}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section témoignage avec nouveau design - RESPONSIVE */}
          <div className={`mt-8 sm:mt-16 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-green-100">
              <div className="flex flex-col lg:flex-row">
                {/* Témoignage - RESPONSIVE */}
                <div className="lg:w-2/5 bg-gradient-to-br from-green-600 to-green-700 p-6 sm:p-8 text-white">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                      <span className="text-lg sm:text-2xl font-bold">S</span>
                    </div>
                    <div>
                      <p className="font-bold text-base sm:text-lg">Sophie M.</p>
                      <div className="flex items-center mt-1">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} size={14} className="sm:w-4 sm:h-4 fill-current text-amber-400" />
                        ))}
                        <span className="ml-2 text-green-100 text-xs sm:text-sm">Membre Diamant</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base lg:text-lg italic mb-3 sm:mb-4">
                    "Le top produits Fydo est devenu ma référence avant chaque achat. Je sais que je peux faire confiance aux classements !"
                  </p>
                  <div className="flex items-center text-green-100 text-xs sm:text-sm">
                    <Award size={14} className="sm:w-4 sm:h-4 mr-2" />
                    <span className="hidden sm:inline">152 avis publiés • Membre depuis 2 ans</span>
                    <span className="sm:hidden">152 avis • 2 ans</span>
                  </div>
                </div>

                {/* Pourquoi faire confiance - RESPONSIVE */}
                <div className="lg:w-3/5 p-6 sm:p-8">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-800 mb-4 sm:mb-6 flex items-center">
                    <Shield size={20} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7 mr-2 sm:mr-3 text-green-600" />
                    <span className="hidden sm:inline">Pourquoi nos classements sont fiables ?</span>
                    <span className="sm:hidden">Pourquoi fiables ?</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                        <BarChart3 size={16} className="sm:w-5 sm:h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                          <span className="hidden sm:inline">Algorithme transparent</span>
                          <span className="sm:hidden">Transparent</span>
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          <span className="hidden sm:inline">Notes calculées sur la moyenne de tous les avis vérifiés, sans manipulation</span>
                          <span className="sm:hidden">Avis vérifiés, sans manipulation</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                        <Users size={16} className="sm:w-5 sm:h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                          <span className="hidden sm:inline">Communauté engagée</span>
                          <span className="sm:hidden">Communauté</span>
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          <span className="hidden sm:inline">Plus de 10 000 contributeurs actifs partagent leurs expériences quotidiennes</span>
                          <span className="sm:hidden">10 000+ contributeurs actifs</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                        <Zap size={16} className="sm:w-5 sm:h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                          <span className="hidden sm:inline">Actualisation en temps réel</span>
                          <span className="sm:hidden">Temps réel</span>
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          <span className="hidden sm:inline">Les classements évoluent instantanément avec chaque nouvel avis publié</span>
                          <span className="sm:hidden">Classements instantanés</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                        <Award size={16} className="sm:w-5 sm:h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                          <span className="hidden sm:inline">Multi-critères précis</span>
                          <span className="sm:hidden">Multi-critères</span>
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          <span className="hidden sm:inline">Évaluation détaillée sur goût, qualité, prix, pour une vision complète</span>
                          <span className="sm:hidden">Goût, qualité, prix</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section CTA moderne - RESPONSIVE */}
          <div className={`text-center mt-8 sm:mt-16 mb-8 sm:mb-16 transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 sm:p-12 text-white relative overflow-hidden">
              {/* Éléments décoratifs */}
              <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white opacity-5 rounded-full transform translate-x-16 sm:translate-x-32 -translate-y-16 sm:-translate-y-32"></div>
              <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-white opacity-5 rounded-full transform -translate-x-12 sm:-translate-x-24 translate-y-12 sm:translate-y-24"></div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-20 sm:h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Scan size={24} className="sm:w-10 sm:h-10 text-white" />
                </div>
                
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                  <span className="hidden sm:inline">Découvrez encore plus de produits d'exception</span>
                  <span className="sm:hidden">Découvrez plus de produits</span>
                </h2>
                <p className="text-green-100 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
                  <span className="hidden sm:inline">Scannez vos produits en magasin, consultez les avis instantanément et contribuez à notre communauté</span>
                  <span className="sm:hidden">Scannez, consultez, contribuez à notre communauté</span>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                  <Link
                    to="/recherche-filtre"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 inline-flex items-center text-sm sm:text-base"
                  >
                    <Search size={18} className="sm:w-5 sm:h-5 mr-2" />
                    <span className="hidden sm:inline">Explorer les produits</span>
                    <span className="sm:hidden">Explorer</span>
                  </Link>
                  
                  {!currentUser && (
                    <Link
                      to="/signup"
                      className="bg-white hover:bg-gray-50 text-green-700 font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 inline-flex items-center text-sm sm:text-base"
                    >
                      <Users size={18} className="sm:w-5 sm:h-5 mr-2" />
                      <span className="hidden sm:inline">Rejoindre Fydo</span>
                      <span className="sm:hidden">Rejoindre</span>
                    </Link>
                  )}
                </div>
                
                <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-green-100 text-xs sm:text-sm">
                  <span className="flex items-center">
                    <Shield size={12} className="sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">100% gratuit</span>
                    <span className="sm:hidden">Gratuit</span>
                  </span>
                  <span className="flex items-center">
                    <Star size={12} className="sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Sans engagement</span>
                    <span className="sm:hidden">Libre</span>
                  </span>
                  <span className="flex items-center">
                    <Heart size={12} className="sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Communauté bienveillante</span>
                    <span className="sm:hidden">Communauté</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions de navigation avec nouveau design - RESPONSIVE */}
          <div className={`bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md border border-green-100 transition-all duration-700 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-4 sm:mb-6">Continuez votre exploration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <Link
                to="/recherche-filtre"
                className="group p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:scale-[1.02] border border-green-200"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:shadow-lg transition-shadow">
                  <Scan size={20} className="sm:w-6 sm:h-6 text-green-600 group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">
                  <span className="hidden sm:inline">Scanner & Rechercher</span>
                  <span className="sm:hidden">Scanner</span>
                </h4>
                <p className="text-green-700 text-xs sm:text-sm">
                  <span className="hidden sm:inline">Trouvez instantanément n'importe quel produit et ses avis</span>
                  <span className="sm:hidden">Trouvez produits et avis</span>
                </p>
              </Link>
              
              <Link
                to="/challenges"
                className="group p-4 sm:p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl hover:from-amber-100 hover:to-amber-200 transition-all duration-300 transform hover:scale-[1.02] border border-amber-200"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:shadow-lg transition-shadow">
                  <Sparkles size={20} className="sm:w-6 sm:h-6 text-amber-600 group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="font-semibold text-amber-800 mb-2 text-sm sm:text-base">Challenges</h4>
                <p className="text-amber-700 text-xs sm:text-sm">
                  <span className="hidden sm:inline">Participez aux défis et gagnez des récompenses</span>
                  <span className="sm:hidden">Défis et récompenses</span>
                </p>
              </Link>
              
              <Link
                to="/concept"
                className="group p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-[1.02] border border-blue-200"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:shadow-lg transition-shadow">
                  <Heart size={20} className="sm:w-6 sm:h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">
                  <span className="hidden sm:inline">Notre mission</span>
                  <span className="sm:hidden">Mission</span>
                </h4>
                <p className="text-blue-700 text-xs sm:text-sm">
                  <span className="hidden sm:inline">Découvrez comment Fydo révolutionne vos achats</span>
                  <span className="sm:hidden">Fydo révolutionne vos achats</span>
                </p>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TopProducts;