// src/pages/TopProductsLive.js
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
  ChevronLeft,
  Search, 
  Crown,
  Zap,
  Shield,
  Sparkles,
  BarChart3,
  ShoppingBag,
  Scan,
  Calendar,
  Clock,
  Activity,
  RotateCcw
} from 'lucide-react';
import { getTopProductsLive } from '../services/topProductsService';
import SearchResultItem from '../components/product/SearchResultItem';
import { useAuth } from '../contexts/AuthContext';

const TopProductsLive = () => {
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
  const [timePeriod, setTimePeriod] = useState('week');
  
  // ✨ État pour la navigation temporelle
  const [currentPeriodDate, setCurrentPeriodDate] = useState(new Date());

  // ✨ Fonction pour calculer les dates avec une date de référence
  const getDateRange = (period, referenceDate = new Date()) => {
    let startDate, endDate;

    switch (period) {
      case 'day':
        startDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
        endDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate(), 23, 59, 59);
        break;
      case 'week':
        const dayOfWeek = referenceDate.getDay();
        const monday = new Date(referenceDate);
        monday.setDate(referenceDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        monday.setHours(0, 0, 0, 0);
        
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);
        
        startDate = monday;
        endDate = sunday;
        break;
      case 'month':
        startDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
        endDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59);
        break;
      case 'year':
        startDate = new Date(referenceDate.getFullYear(), 0, 1);
        endDate = new Date(referenceDate.getFullYear(), 11, 31, 23, 59, 59);
        break;
      default:
        startDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
        endDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate(), 23, 59, 59);
    }

    return { startDate, endDate };
  };

  // ✨ Fonctions de navigation temporelle
  const navigatePeriod = (direction) => {
    const newDate = new Date(currentPeriodDate);
    
    switch (timePeriod) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentPeriodDate(newDate);
  };

  // ✨ Vérifier si on peut aller vers le futur
  const canNavigateNext = () => {
    const now = new Date();
    const { endDate } = getDateRange(timePeriod, currentPeriodDate);
    return endDate < now;
  };

  // ✨ Vérifier si on est dans la période actuelle
  const isCurrentPeriod = () => {
    const now = new Date();
    const { startDate, endDate } = getDateRange(timePeriod, currentPeriodDate);
    return now >= startDate && now <= endDate;
  };

  // ✨ Revenir à la période actuelle
  const goToCurrentPeriod = () => {
    setCurrentPeriodDate(new Date());
  };

  // Configuration des filtres temporels
  const timePeriodOptions = [
    {
      value: 'day',
      label: 'Jour',
      labelShort: 'J',
      icon: <Clock size={18} />,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'Quotidien'
    },
    {
      value: 'week',
      label: 'Semaine',
      labelShort: 'S',
      icon: <Calendar size={18} />,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Hebdomadaire'
    },
    {
      value: 'month',
      label: 'Mois',
      labelShort: 'M',
      icon: <BarChart3 size={18} />,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Mensuel'
    },
    {
      value: 'year',
      label: 'Année',
      labelShort: 'A',
      icon: <TrendingUp size={18} />,
      color: 'amber',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-600',
      description: 'Annuel'
    }
  ];

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

  // Configuration des critères de tri
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

  // ✨ Charger les produits avec la date de référence
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { startDate, endDate } = getDateRange(timePeriod, currentPeriodDate);
        
        const options = {
          searchTerm,
          sortBy,
          sortAsc,
          limit: 20,
          offset: 0,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        };
        
        const { success, products: fetchedProducts, totalCount: count, error: fetchError } = 
          await getTopProductsLive(options);
        
        if (success) {
          setProducts(fetchedProducts || []);
          setTotalCount(count || 0);
        } else {
          setError(fetchError || 'Erreur lors du chargement des produits');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des top produits live:', err);
        setError('Une erreur est survenue lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, sortBy, sortAsc, timePeriod, currentPeriodDate]);

  // Si l'utilisateur n'est pas connecté
  if (!currentUser) {
    return <AuthRequiredScreen redirectPath="/top-produits-live" />;
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

  // ✨ Changer la période temporelle et réinitialiser à la période actuelle
  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
    setCurrentPeriodDate(new Date());
  };

  // Option actuellement sélectionnée
  const currentSortOption = sortOptions.find(option => option.value === sortBy);
  const currentTimePeriodOption = timePeriodOptions.find(option => option.value === timePeriod);

  // ✨ Formatage de la plage de dates avec la date de référence
  const getDateRangeText = (period, referenceDate = currentPeriodDate) => {
    const { startDate, endDate } = getDateRange(period, referenceDate);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    
    switch (period) {
      case 'day':
        return startDate.toLocaleDateString('fr-FR', options);
      case 'week':
        return `Du ${startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} au ${endDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`;
      case 'month':
        return startDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      case 'year':
        return startDate.getFullYear().toString();
      default:
        return '';
    }
  };

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
      value: products.reduce((sum, p) => sum + (p.total_reviews || 0), 0),
      label: 'Avis de la période',
      labelShort: 'Avis',
      color: 'amber',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
    {
      icon: <Activity size={20} />,
      value: currentTimePeriodOption?.labelShort || 'Période',
      label: 'Période active',
      labelShort: 'Période',
      color: 'blue',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: isCurrentPeriod() ? <Zap size={20} /> : <Clock size={20} />,
      value: isCurrentPeriod() ? 'LIVE' : 'HIST',
      label: isCurrentPeriod() ? 'Temps réel' : 'Données passées',
      labelShort: isCurrentPeriod() ? 'Live' : 'Hist',
      color: isCurrentPeriod() ? 'pink' : 'gray',
      bgColor: isCurrentPeriod() ? 'bg-pink-100' : 'bg-gray-100',
      iconColor: isCurrentPeriod() ? 'text-pink-600' : 'text-gray-600'
    }
  ];

  return (
    <section ref={sectionRef} className="py-8 sm:py-12 lg:py-20 bg-green-50 min-h-screen relative overflow-hidden">
      <Helmet>
        <title>Top Produits Live | Fydo - Classements en Temps Réel</title>
        <meta name="description" content="Découvrez les tendances en temps réel des produits les mieux notés par période. Classements quotidiens, hebdomadaires et mensuels basés sur les avis récents." />
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
              {/* Version mobile : seulement "Live" */}
              <li className="block sm:hidden">
                <span className="text-green-800 font-medium">Live</span>
              </li>
              {/* Version desktop : breadcrumb complet */}
              <li className="hidden sm:block"><Link to="/" className="hover:text-green-800 transition-colors">Accueil</Link></li>
              <li className="hidden sm:block"><ChevronRight size={16} /></li>
              <li className="hidden sm:block"><Link to="/top-produits" className="hover:text-green-800 transition-colors">Top Produits</Link></li>
              <li className="hidden sm:block"><ChevronRight size={16} /></li>
              <li className="hidden sm:block"><span className="text-green-800 font-medium">Live</span></li>
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
                  Classements <span className="text-green-600 block sm:inline">Temps Réel</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-green-700 max-w-3xl mx-auto lg:mx-0 mb-3 sm:mb-4">
                  {isCurrentPeriod() ? 'Tendances actuelles' : 'Données historiques'}
                </p>
               
                {/* Trust indicators avec animation - RESPONSIVE */}
                <div className={`flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 md:gap-4 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <span className="text-xs sm:text-sm text-green-700 flex items-center bg-white px-2 py-1 rounded-full shadow-sm">
                    <Activity size={12} className={`mr-1 ${isCurrentPeriod() ? 'text-red-500' : 'text-gray-500'}`} />
                    <span className="hidden sm:inline">{isCurrentPeriod() ? 'Calcul temps réel' : 'Données historiques'}</span>
                    <span className="sm:hidden">{isCurrentPeriod() ? 'Live' : 'Hist'}</span>
                  </span>
                  <span className="text-xs sm:text-sm text-green-700 flex items-center bg-white px-2 py-1 rounded-full shadow-sm">
                    <Crown size={12} className="mr-1 text-amber-500" />
                    <span className="hidden sm:inline">{isCurrentPeriod() ? 'Tendances actuelles' : 'Tendances passées'}</span>
                    <span className="sm:hidden">Tendances</span>
                  </span>
                  <span className="text-xs sm:text-sm text-green-700 flex items-center bg-white px-2 py-1 rounded-full shadow-sm">
                    <Zap size={12} className="mr-1 text-blue-500" />
                    <span className="hidden sm:inline">{isCurrentPeriod() ? 'Données fraîches' : 'Archive complète'}</span>
                    <span className="sm:hidden">Données</span>
                  </span>
                </div>
              </div>

              {/* Téléphone à droite - MASQUÉ SUR MOBILE POUR ÉCONOMISER L'ESPACE */}
              <div className="relative max-w-xs lg:max-w-sm hidden lg:block">
                <div className="relative">
                  {/* Fond décoratif */}
                  <div className={`absolute inset-0 bg-gradient-to-tr ${isCurrentPeriod() ? 'from-green-200 to-red-200' : 'from-gray-200 to-blue-200'} rounded-[40px] transform rotate-6 scale-105 opacity-50 animate-pulse`}></div>
                  
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
                        <div className="text-green-800 font-bold text-lg">
                          {isCurrentPeriod() ? 'Live Trends' : 'Archive'}
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 ${isCurrentPeriod() ? 'bg-red-500' : 'bg-gray-400'} rounded-full ${isCurrentPeriod() ? 'animate-pulse' : ''}`}></div>
                          <span className={`text-xs font-bold ${isCurrentPeriod() ? 'text-red-600' : 'text-gray-600'}`}>
                            {isCurrentPeriod() ? 'LIVE' : 'HIST'}
                          </span>
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
                            <div className="flex items-center flex-1">
                              <div className={`w-1 h-8 bg-gradient-to-b ${isCurrentPeriod() ? 'from-green-400 to-green-600' : 'from-gray-400 to-gray-600'} rounded-full mr-3 ${isCurrentPeriod() ? 'animate-pulse' : ''}`}></div>
                              <div className="flex-1">
                                <div className="h-2 bg-gray-200 rounded-full w-3/4 mb-1"></div>
                                <div className="h-2 bg-gray-100 rounded-full w-1/2"></div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <TrendingUp size={12} className={`${isCurrentPeriod() ? 'text-green-500' : 'text-gray-500'} mr-1`} />
                              <span className={`text-xs font-bold ${isCurrentPeriod() ? 'text-green-600' : 'text-gray-600'}`}>
                                +{index + 1}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Badge flottant */}
                      <div className={`absolute bottom-6 right-6 ${isCurrentPeriod() ? 'bg-red-600' : 'bg-gray-600'} text-white px-3 py-1.5 rounded-full shadow-lg text-xs font-bold ${isCurrentPeriod() ? 'animate-bounce' : ''}`}>
                        <Activity size={12} className="inline mr-1" />
                        {isCurrentPeriod() ? 'LIVE' : 'ARCHIVE'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques animées - RESPONSIVE */}
          <div className="mb-8 sm:mb-12">
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

            {/* Filtres par période temporelle - VERSION MOBILE COMPACTE */}
            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-5 border border-green-100 mb-3 sm:mb-4">
              <div className="flex items-center mb-3">
                <Calendar size={16} className="sm:w-5 sm:h-5 text-green-600 mr-2" />
                <h3 className="text-base sm:text-lg font-bold text-green-800">Période</h3>
                {isCurrentPeriod() && (
                  <div className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {timePeriodOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleTimePeriodChange(option.value)}
                    className={`relative p-2 sm:p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                      timePeriod === option.value
                        ? `bg-gradient-to-br from-${option.color}-50 to-${option.color}-100 border-2 border-${option.color}-500 shadow-lg`
                        : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                    }`}
                  >
                    {/* Badge actif */}
                    {timePeriod === option.value && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    )}

                    <div className={`w-6 h-6 sm:w-10 sm:h-10 ${option.bgColor} rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2`}>
                      {React.cloneElement(option.icon, { className: `${option.textColor} w-3 h-3 sm:w-5 sm:h-5` })}
                    </div>
                    <h4 className={`font-semibold text-xs sm:text-sm mb-1 ${
                      timePeriod === option.value ? option.textColor : 'text-gray-800'
                    }`}>
                      <span className="hidden sm:inline">{option.label}</span>
                      <span className="sm:hidden">{option.labelShort}</span>
                    </h4>
                    <p className="text-xs text-gray-600 hidden sm:block">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Filtres par catégorie - VERSION MOBILE COMPACTE */}
            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-5 border border-green-100">
              <div className="flex items-center mb-3">
                <Filter size={16} className="sm:w-5 sm:h-5 text-green-600 mr-2" />
                <h3 className="text-base sm:text-lg font-bold text-green-800">Critère</h3>
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

          {/* ✨ Navigation temporelle avec affichage de la période - RESPONSIVE */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
              {/* Bouton précédent */}
              <button
                onClick={() => navigatePeriod('prev')}
                className="p-1.5 sm:p-2 rounded-full bg-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border border-green-200"
                title="Période précédente"
              >
                <ChevronLeft size={16} className="sm:w-5 sm:h-5 text-green-600" />
              </button>

              {/* Affichage de la période actuelle - RESPONSIVE */}
              <div className={`inline-flex items-center px-3 py-2 sm:px-6 sm:py-3 rounded-full ${currentTimePeriodOption?.bgColor} ${currentTimePeriodOption?.textColor} font-semibold shadow-md relative`}>
                {React.cloneElement(currentTimePeriodOption?.icon || <Clock size={16} />, { className: 'w-4 h-4 sm:w-5 sm:h-5' })}
                <span className="ml-2 text-xs sm:text-sm md:text-base">{getDateRangeText(timePeriod)}</span>
                {isCurrentPeriod() && (
                  <div className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
                {!isCurrentPeriod() && (
                  <div className="ml-2 w-2 h-2 bg-gray-400 rounded-full"></div>
                )}
              </div>

              {/* Bouton suivant */}
              <button
                onClick={() => navigatePeriod('next')}
                disabled={!canNavigateNext()}
                className={`p-1.5 sm:p-2 rounded-full shadow-md transform transition-all duration-200 border ${
                  canNavigateNext() 
                    ? 'bg-white hover:shadow-lg hover:scale-105 border-green-200 text-green-600' 
                    : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                title={canNavigateNext() ? "Période suivante" : "Impossible d'aller dans le futur"}
              >
                <ChevronRight size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Bouton retour à aujourd'hui - RESPONSIVE */}
            {!isCurrentPeriod() && (
              <div className="flex justify-center">
                <button
                  onClick={goToCurrentPeriod}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-flex items-center"
                  title="Revenir à la période actuelle"
                >
                  <RotateCcw size={14} className="sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Aujourd'hui
                </button>
              </div>
            )}
          </div>

          {/* Liste des produits avec nouveau design - RESPONSIVE */}
          <div className={`transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-green-100">
              {/* Header de la liste - RESPONSIVE */}
              <div className={`bg-gradient-to-r ${isCurrentPeriod() ? 'from-green-600 to-green-700' : 'from-gray-600 to-gray-700'} p-3 sm:p-5 text-white`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center">
                    {currentSortOption && React.cloneElement(currentSortOption.icon, { className: 'text-white mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5' })}
                    <div>
                      <h2 className="text-lg sm:text-2xl font-bold flex items-center">
                        <span className="hidden sm:inline">Classement {isCurrentPeriod() ? 'Live' : 'Historique'} : </span>
                        <span className="sm:hidden">Top </span>
                        {currentSortOption?.labelShort || currentSortOption?.label}
                        <div className={`ml-2 w-2 h-2 ${isCurrentPeriod() ? 'bg-red-400' : 'bg-gray-400'} rounded-full ${isCurrentPeriod() ? 'animate-pulse' : ''}`}></div>
                      </h2>
                      <p className={`${isCurrentPeriod() ? 'text-green-100' : 'text-gray-200'} text-xs sm:text-sm mt-1`}>
                        <span className="hidden sm:inline">{currentTimePeriodOption?.description} • </span>
                        {getDateRangeText(timePeriod)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center bg-white bg-opacity-20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                    <Activity size={14} className="sm:w-4 sm:h-4 mr-1 sm:mr-2" />
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
                    <span className="text-green-700 mt-4 font-medium text-sm sm:text-base">
                      {isCurrentPeriod() ? 'Calcul en cours...' : 'Chargement...'}
                    </span>
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
                  <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-3">Aucune tendance trouvée</h3>
                  <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base">
                    Aucun produit pour cette période. Essayez une autre période.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {products.map((product, index) => (
                    <div key={product.code} className="relative hover:bg-green-50 transition-colors">
                      {/* Médaille de classement avec indicateur live - RESPONSIVE */}
                      <div className="absolute top-3 sm:top-6 left-3 sm:left-6 z-10">
                        <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg shadow-lg transform hover:scale-110 transition-transform relative ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' : 
                          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' : 
                          index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' : 
                          'bg-white border-2 border-green-200 text-green-600'
                        }`}>
                          {index === 0 ? '🥇' : 
                           index === 1 ? '🥈' : 
                           index === 2 ? '🥉' : 
                           index + 1}
                          {/* Indicateur live */}
                          <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 ${isCurrentPeriod() ? 'bg-red-500' : 'bg-gray-400'} rounded-full ${isCurrentPeriod() ? 'animate-pulse' : ''}`}></div>
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

          {/* Section CTA moderne - RESPONSIVE */}
          <div className={`text-center mt-8 sm:mt-16 mb-8 sm:mb-16 transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 sm:p-12 text-white relative overflow-hidden">
              {/* Éléments décoratifs */}
              <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white opacity-5 rounded-full transform translate-x-16 sm:translate-x-32 -translate-y-16 sm:-translate-y-32"></div>
              <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-white opacity-5 rounded-full transform -translate-x-12 sm:-translate-x-24 translate-y-12 sm:translate-y-24"></div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-20 sm:h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Activity size={24} className="sm:w-10 sm:h-10 text-white" />
                </div>
                
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                  {isCurrentPeriod() ? 'Suivez les tendances en temps réel' : 'Explorez l\'historique des tendances'}
                </h2>
                <p className="text-green-100 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
                  {isCurrentPeriod() 
                    ? 'Ne manquez aucune tendance ! Découvrez les produits qui cartonnent maintenant'
                    : 'Analysez les tendances passées et l\'évolution des goûts'
                  }
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                  <Link
                    to="/top-produits"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 inline-flex items-center text-sm sm:text-base"
                  >
                    <BarChart3 size={18} className="sm:w-5 sm:h-5 mr-2" />
                    Classement global
                  </Link>
                  
                  <Link
                    to="/recherche-filtre"
                    className="bg-white hover:bg-gray-50 text-green-700 font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 inline-flex items-center text-sm sm:text-base"
                  >
                    <Search size={18} className="sm:w-5 sm:h-5 mr-2" />
                    Explorer produits
                  </Link>
                </div>
                
                <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-green-100 text-xs sm:text-sm">
                  <span className="flex items-center">
                    <Activity size={14} className="sm:w-4 sm:h-4 mr-1" />
                    {isCurrentPeriod() ? 'Temps réel' : 'Archivées'}
                  </span>
                  <span className="flex items-center">
                    <Star size={14} className="sm:w-4 sm:h-4 mr-1" />
                    {isCurrentPeriod() ? 'Fraîches' : 'Complètes'}
                  </span>
                  <span className="flex items-center">
                    <TrendingUp size={14} className="sm:w-4 sm:h-4 mr-1" />
                    {isCurrentPeriod() ? 'Actuelles' : 'Historiques'}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TopProductsLive;