// src/pages/TopProducts.js
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
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
      icon: <Star size={18} />,
      color: 'amber',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-600',
      description: 'Les produits avec les meilleures notes globales'
    },
    { 
      value: 'total_reviews', 
      label: 'Plus commentés', 
      icon: <MessageSquare size={18} />,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Les produits avec le plus d\'avis vérifiés'
    },
    { 
      value: 'total_favorites', 
      label: 'Plus aimés', 
      icon: <Heart size={18} />,
      color: 'pink',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-600',
      description: 'Les favoris de notre communauté'
    },
    { 
      value: 'taste_rating', 
      label: 'Meilleur goût', 
      icon: <Award size={18} />,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Excellence gustative reconnue'
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
      color: 'green',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: <Star size={20} />,
      value: '100K+',
      label: 'Avis vérifiés',
      color: 'amber',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
    {
      icon: <Users size={20} />,
      value: '10K+',
      label: 'Membres actifs',
      color: 'blue',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: <Shield size={20} />,
      value: '100%',
      label: 'Avis authentiques',
      color: 'pink',
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600'
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-green-50 min-h-screen relative overflow-hidden">
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

      {/* Éléments décoratifs animés */}
      <div className="absolute top-20 left-5 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-5 w-24 h-24 bg-amber-200 rounded-full opacity-20 animate-pulse"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <ol className="flex items-center space-x-2 text-sm text-green-600">
              <li><Link to="/" className="hover:text-green-800 transition-colors">Accueil</Link></li>
              <li><ChevronRight size={16} /></li>
              <li className="text-green-800 font-medium">Top Produits</li>
            </ol>
          </nav>

          {/* Header Section avec animations */}
          <div className={`mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Texte à gauche */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
                  Le Palmarès des <span className="text-green-600">Produits d'Excellence</span>
                </h1>
                <p className="text-xl text-green-700 max-w-3xl mx-auto lg:mx-0 mb-8">
                  Découvrez les champions de chaque catégorie, plébiscités par notre communauté d'experts du quotidien
                </p>
                
                {/* Trust indicators avec animation */}
                <div className={`flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <span className="text-xs md:text-sm text-green-700 flex items-center bg-white px-2.5 py-1 rounded-full shadow-sm">
                    <Shield size={14} className="mr-1 text-green-600" />
                    Avis 100% vérifiés
                  </span>
                  <span className="text-xs md:text-sm text-green-700 flex items-center bg-white px-2.5 py-1 rounded-full shadow-sm">
                    <Crown size={14} className="mr-1 text-amber-500" />
                    Classement en temps réel
                  </span>
                  <span className="text-xs md:text-sm text-green-700 flex items-center bg-white px-2.5 py-1 rounded-full shadow-sm">
                    <Zap size={14} className="mr-1 text-blue-500" />
                    Mis à jour quotidiennement
                  </span>
                </div>
              </div>

              {/* Téléphone à droite */}
              <div className="relative max-w-xs lg:max-w-sm">
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

          {/* Statistiques animées avec élément décoratif intégré */}
          <div className="mb-12">
            {/* Bandeau animé de produits top - Version horizontale compacte */}
            <div className={`bg-gradient-to-r from-green-50 via-white to-amber-50 rounded-lg shadow-sm p-2 mb-6 border border-green-100 overflow-hidden transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 overflow-x-auto scrollbar-hide">
                  <div className="flex items-center flex-shrink-0">
                    <Sparkles size={16} className="text-amber-500 mr-1.5" />
                    <span className="text-sm font-semibold text-green-800 mr-3">Top 3</span>
                  </div>
                  
                  {[
                    { rank: "🥇", rating: 4.9 },
                    { rank: "🥈", rating: 4.8 },
                    { rank: "🥉", rating: 4.7 }
                  ].map((product, index) => (
                    <div 
                      key={index}
                      className="flex items-center bg-white rounded-md px-3 py-1.5 shadow-sm flex-shrink-0"
                    >
                      <span className="text-lg mr-2">{product.rank}</span>
                      <div className="flex items-center">
                        <Star size={12} className="text-amber-500 fill-amber-500 mr-1" />
                        <span className="font-semibold text-sm">{product.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs font-bold animate-pulse flex items-center ml-3 flex-shrink-0">
                  <TrendingUp size={10} className="mr-1" />
                  LIVE
                </span>
              </div>
            </div>

            {/* Grille de statistiques */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-500 border border-green-100 text-center ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                  }`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-3 transform hover:rotate-12 transition-transform`}>
                    {React.cloneElement(stat.icon, { className: stat.iconColor })}
                  </div>
                  <div className="text-xl font-bold text-green-800">{stat.value}</div>
                  <div className="text-green-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section de filtrage améliorée */}
          <div className={`mb-12 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Barre de recherche moderne */}
            <div className="bg-white rounded-xl shadow-sm p-3 md:p-4 mb-4 border border-green-100">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher parmi les meilleurs produits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 md:py-3 text-base md:text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs md:text-sm">
                  {totalCount} résultats
                </div>
              </div>
            </div>

            {/* Filtres par catégorie avec design cards */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-5 border border-green-100">
              <div className="flex items-center mb-3">
                <Filter size={20} className="text-green-600 mr-2" />
                <h3 className="text-lg font-bold text-green-800">Classement par critère</h3>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange(option.value)}
                    className={`relative p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                      activeFilter === option.value
                        ? `bg-gradient-to-br from-${option.color}-50 to-${option.color}-100 border-2 border-${option.color}-500 shadow-lg`
                        : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                    }`}
                  >
                    {/* Badge actif */}
                    {activeFilter === option.value && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    )}

                    <div className={`w-10 h-10 ${option.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      {React.cloneElement(option.icon, { className: option.textColor })}
                    </div>
                    <h4 className={`font-semibold text-sm mb-1 ${
                      activeFilter === option.value ? option.textColor : 'text-gray-800'
                    }`}>{option.label}</h4>
                    <p className="text-xs text-gray-600">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Liste des produits avec nouveau design */}
          <div className={`transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-green-100">
              {/* Header de la liste */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {currentSortOption && React.cloneElement(currentSortOption.icon, { className: 'text-white mr-3' })}
                    <div>
                      <h2 className="text-2xl font-bold">
                        Classement : {currentSortOption?.label}
                      </h2>
                      <p className="text-green-100 text-sm mt-1">{currentSortOption?.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                    <TrendingUp size={16} className="mr-2" />
                    <span className="font-medium">{totalCount} produits</span>
                  </div>
                </div>
              </div>

              {/* Contenu de la liste */}
              {loading ? (
                <div className="p-16 text-center">
                  <div className="inline-flex flex-col items-center">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-spin"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-green-600 rounded-full animate-spin border-t-transparent"></div>
                    </div>
                    <span className="text-green-700 mt-4 font-medium">Chargement du palmarès...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="p-16 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">😕</span>
                  </div>
                  <div className="text-red-600 mb-4 font-medium">{error}</div>
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Réessayer
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-3">Aucun produit trouvé</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Essayez de modifier vos critères de recherche ou explorez d'autres catégories
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {products.map((product, index) => (
                    <div key={product.code} className="relative hover:bg-green-50 transition-colors">
                      {/* Médaille de classement */}
                      <div className="absolute top-6 left-6 z-10">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg transform hover:scale-110 transition-transform ${
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
                      
                      <div className="pl-20">
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

          {/* Section témoignage avec nouveau design */}
          <div className={`mt-16 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-green-100">
              <div className="flex flex-col lg:flex-row">
                {/* Témoignage */}
                <div className="lg:w-2/5 bg-gradient-to-br from-green-600 to-green-700 p-8 text-white">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold">S</span>
                    </div>
                    <div>
                      <p className="font-bold text-lg">Sophie M.</p>
                      <div className="flex items-center mt-1">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} size={16} className="fill-current text-amber-400" />
                        ))}
                        <span className="ml-2 text-green-100 text-sm">Membre Diamant</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg italic mb-4">
                    "Le top produits Fydo est devenu ma référence avant chaque achat. Je sais que je peux faire confiance aux classements car tous les avis sont vérifiés !"
                  </p>
                  <div className="flex items-center text-green-100 text-sm">
                    <Award size={16} className="mr-2" />
                    <span>152 avis publiés • Membre depuis 2 ans</span>
                  </div>
                </div>

                {/* Pourquoi faire confiance */}
                <div className="lg:w-3/5 p-8">
                  <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                    <Shield size={28} className="mr-3 text-green-600" />
                    Pourquoi nos classements sont fiables ?
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <BarChart3 size={20} className="text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Algorithme transparent</h4>
                        <p className="text-gray-600 text-sm">Notes calculées sur la moyenne de tous les avis vérifiés, sans manipulation</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Users size={20} className="text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Communauté engagée</h4>
                        <p className="text-gray-600 text-sm">Plus de 10 000 contributeurs actifs partagent leurs expériences quotidiennes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Zap size={20} className="text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Actualisation en temps réel</h4>
                        <p className="text-gray-600 text-sm">Les classements évoluent instantanément avec chaque nouvel avis publié</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Award size={20} className="text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Multi-critères précis</h4>
                        <p className="text-gray-600 text-sm">Évaluation détaillée sur goût, qualité, prix, pour une vision complète</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section CTA moderne */}
          <div className={`text-center mt-16 mb-16 transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-white relative overflow-hidden">
              {/* Éléments décoratifs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full transform -translate-x-24 translate-y-24"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Scan size={40} className="text-white" />
                </div>
                
                <h2 className="text-3xl font-bold mb-4">Découvrez encore plus de produits d'exception</h2>
                <p className="text-green-100 mb-8 max-w-2xl mx-auto text-lg">
                  Scannez vos produits en magasin, consultez les avis instantanément et contribuez à notre communauté
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    to="/recherche-filtre"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 inline-flex items-center"
                  >
                    <Search size={20} className="mr-2" />
                    Explorer les produits
                  </Link>
                  
                  {!currentUser && (
                    <Link
                      to="/signup"
                      className="bg-white hover:bg-gray-50 text-green-700 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 inline-flex items-center"
                    >
                      <Users size={20} className="mr-2" />
                      Rejoindre Fydo
                    </Link>
                  )}
                </div>
                
                <div className="mt-6 flex items-center justify-center space-x-6 text-green-100 text-sm">
                  <span className="flex items-center">
                    <Shield size={16} className="mr-1" />
                    100% gratuit
                  </span>
                  <span className="flex items-center">
                    <Star size={16} className="mr-1" />
                    Sans engagement
                  </span>
                  <span className="flex items-center">
                    <Heart size={16} className="mr-1" />
                    Communauté bienveillante
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions de navigation avec nouveau design */}
          <div className={`bg-white rounded-2xl p-8 shadow-md border border-green-100 transition-all duration-700 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="text-xl font-bold text-green-800 mb-6">Continuez votre exploration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/recherche-filtre"
                className="group p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:scale-[1.02] border border-green-200"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow">
                  <Scan size={24} className="text-green-600 group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="font-semibold text-green-800 mb-2">Scanner & Rechercher</h4>
                <p className="text-green-700 text-sm">Trouvez instantanément n'importe quel produit et ses avis</p>
              </Link>
              
              <Link
                to="/challenges"
                className="group p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl hover:from-amber-100 hover:to-amber-200 transition-all duration-300 transform hover:scale-[1.02] border border-amber-200"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow">
                  <Sparkles size={24} className="text-amber-600 group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="font-semibold text-amber-800 mb-2">Challenges</h4>
                <p className="text-amber-700 text-sm">Participez aux défis et gagnez des récompenses</p>
              </Link>
              
              <Link
                to="/concept"
                className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-[1.02] border border-blue-200"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow">
                  <Heart size={24} className="text-blue-600 group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="font-semibold text-blue-800 mb-2">Notre mission</h4>
                <p className="text-blue-700 text-sm">Découvrez comment Fydo révolutionne vos achats</p>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TopProducts;