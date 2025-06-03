// src/components/profile/ProductHistory.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Clock, 
  Search, 
  Camera, 
  Keyboard, 
  ExternalLink, 
  Loader, 
  AlertCircle, 
  Filter, 
  Hash, 
  ChevronDown, 
  ChevronUp, 
  Lock,
  TrendingUp,
  Package,
  Calendar,
  Sparkles,
  BarChart3,
  Eye,
  Star,
  ShoppingBag,
  History,
  Check,
  CheckCircle
} from 'lucide-react';
import { getUserHistory } from '../../services/productService';
import { Link } from 'react-router-dom';
import ProfileLayout from './ProfileLayout';
import FavoriteButton from '../FavoriteButton';
import useSubscriptionPermissions from '../../hooks/useSubscriptionPermissions';

const ProductHistory = () => {
  const { currentUser, userDetails } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedHistory, setGroupedHistory] = useState({});
  const [expandedProducts, setExpandedProducts] = useState({});
  const [filter, setFilter] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  
  // Utiliser le hook de permissions d'abonnement avec useMemo pour éviter les re-renders
  const { isAuthorized } = useSubscriptionPermissions();
  const canAccessHistory = useMemo(() => isAuthorized('history'), [isAuthorized]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Illustration pour l'historique
  const HistoryIllustration = () => (
    <svg viewBox="0 0 400 300" className="w-full h-auto">
      <defs>
        <linearGradient id="historyGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#81C784', stopOpacity:1}}>
            <animate attributeName="stop-color" values="#81C784;#66BB6A;#81C784" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" style={{stopColor:'#4CAF50', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="historyGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#FFD54F', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#FFA726', stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Fond circulaire */}
      <circle cx="200" cy="150" r="120" fill="url(#historyGrad1)" opacity="0.1" />
      
      {/* Horloge centrale */}
      <g transform="translate(200, 150)">
        <circle cx="0" cy="0" r="50" fill="white" stroke="#4CAF50" strokeWidth="3" />
        <circle cx="0" cy="0" r="3" fill="#4CAF50" />
        
        {/* Aiguilles animées */}
        <line x1="0" y1="0" x2="0" y2="-20" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="60s" repeatCount="indefinite" />
        </line>
        <line x1="0" y1="0" x2="15" y2="0" stroke="#66BB6A" strokeWidth="2" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="5s" repeatCount="indefinite" />
        </line>
        
        {/* Cercle de pulsation */}
        <circle cx="0" cy="0" r="50" fill="none" stroke="#4CAF50" strokeWidth="2" opacity="0">
          <animate attributeName="r" values="50;70;50" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Icônes de méthodes flottantes */}
      <g opacity="0.8">
        {/* Scan */}
        <g transform="translate(100, 80)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#42A5F5" strokeWidth="2" />
          <rect x="-8" y="-10" width="16" height="20" rx="2" fill="none" stroke="#42A5F5" strokeWidth="2" />
          <line x1="0" y1="-8" x2="0" y2="8" stroke="#42A5F5" strokeWidth="2" />
          <animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur="3s" repeatCount="indefinite" />
        </g>
        
        {/* Recherche */}
        <g transform="translate(300, 100)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#4CAF50" strokeWidth="2" />
          <circle cx="-3" cy="-3" r="7" fill="none" stroke="#4CAF50" strokeWidth="2" />
          <line x1="2" y1="2" x2="8" y2="8" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
          <animateTransform attributeName="transform" type="rotate" from="0 300 100" to="360 300 100" dur="20s" repeatCount="indefinite" />
        </g>
        
        {/* Saisie manuelle */}
        <g transform="translate(80, 220)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#CE93D8" strokeWidth="2" />
          <rect x="-10" y="-3" width="20" height="6" rx="1" fill="#CE93D8" />
          <rect x="-8" y="-8" width="2" height="2" fill="#CE93D8" />
          <rect x="-3" y="-8" width="2" height="2" fill="#CE93D8" />
          <rect x="2" y="-8" width="2" height="2" fill="#CE93D8" />
          <rect x="6" y="-8" width="2" height="2" fill="#CE93D8" />
          <animateTransform attributeName="transform" type="translate" values="80,220; 85,215; 80,220" dur="4s" repeatCount="indefinite" />
        </g>
      </g>
    </svg>
  );

  // Fonction pour récupérer l'historique - avec useCallback pour éviter les re-créations
  const fetchHistory = useCallback(async (currentOffset = 0, append = false) => {
    if (!currentUser || !userDetails) {
      setLoading(false);
      return;
    }
    
    // Vérifier les permissions une seule fois
    if (!canAccessHistory) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { success, data, total: totalCount, error: fetchError } = await getUserHistory(
        userDetails.id, 
        50, 
        currentOffset
      );
      
      if (success) {
        setHistory(prev => append ? [...prev, ...data] : data);
        setTotal(totalCount);
        setHasMore(currentOffset + data.length < totalCount);
        
        if (!append) {
          setOffset(0);
        }
      } else {
        setError(fetchError || "Impossible de récupérer votre historique");
      }
    } catch (err) {
      setError("Une erreur est survenue lors du chargement de votre historique");
    } finally {
      setLoading(false);
    }
  }, [currentUser, userDetails, canAccessHistory]);

  // Effet initial pour charger l'historique
  useEffect(() => {
    fetchHistory(0, false);
  }, [fetchHistory]);

  // Regrouper l'historique par produit et filtrer selon les critères
  useEffect(() => {
    let filtered = [...history];
    
    if (filter !== 'all') {
      if (filter === 'search') {
        // Pour "Recherches", inclure à la fois 'search' et 'searchName'
        filtered = filtered.filter(item => 
          item.interaction_type === 'search' || item.interaction_type === 'searchName'
        );
      } else {
        filtered = filtered.filter(item => item.interaction_type === filter);
      }
    }
    
    if (searchTerm) {
      filtered = filtered.filter(
        item => {
          if (item.interaction_type === 'searchName' && item.search_criteria) {
            return (
              item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.search_criteria.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          
          return (
            item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.product_brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.product_code?.includes(searchTerm)
          );
        }
      );
    }
    
    // Regrouper les produits
    const grouped = {};
    
    filtered.forEach(item => {
      const key = item.interaction_type === 'searchName' 
        ? `search_${item.product_name}` 
        : item.product_code;
      
      if (!grouped[key]) {
        grouped[key] = {
          productInfo: {
            product_code: item.product_code,
            product_name: item.product_name,
            product_brand: item.product_brand,
            product_image_url: item.product_image_url,
            interaction_type: item.interaction_type,
            search_criteria: item.search_criteria,
            total_results: item.total_results,
            last_interaction_date: item.interaction_date
          },
          interactions: []
        };
      }
      
      const currentLastDate = new Date(grouped[key].productInfo.last_interaction_date);
      const newDate = new Date(item.interaction_date);
      
      if (newDate > currentLastDate) {
        grouped[key].productInfo.last_interaction_date = item.interaction_date;
      }
      
      grouped[key].interactions.push({
        id: item.id,
        interaction_type: item.interaction_type,
        interaction_date: item.interaction_date
      });
      
      grouped[key].interactions.sort((a, b) => {
        return new Date(b.interaction_date) - new Date(a.interaction_date);
      });
    });
    
    setGroupedHistory(grouped);
  }, [history, searchTerm, filter]);

  // Basculer l'état d'expansion d'un produit
  const toggleProductExpansion = useCallback((productKey) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productKey]: !prev[productKey]
    }));
  }, []);

  // Charger plus d'éléments d'historique
  const loadMoreHistory = useCallback(() => {
    if (hasMore && !loading) {
      const newOffset = offset + 50;
      setOffset(newOffset);
      fetchHistory(newOffset, true);
    }
  }, [hasMore, loading, offset, fetchHistory]);

  // Formatage de la date pour l'affichage
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      if (hours < 1) {
        const minutes = Math.floor(diff / 60000);
        return minutes <= 1 ? 'Il y a une minute' : `Il y a ${minutes} minutes`;
      }
      return hours === 1 ? 'Il y a une heure' : `Il y a ${hours} heures`;
    }
    
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return days === 1 ? 'Hier' : `Il y a ${days} jours`;
    }
    
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Formater l'heure
  const formatTime = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // Configuration des types d'interaction
  const interactionTypes = {
    scan: {
      icon: <Camera size={20} />,
      label: 'Scanné',
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      gradient: 'from-blue-400 to-blue-600'
    },
    search: {
      icon: <Search size={20} />,
      label: 'Recherché',
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      gradient: 'from-green-400 to-green-600'
    },
    manual_entry: {
      icon: <Keyboard size={20} />,
      label: 'Saisi manuellement',
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600',
      gradient: 'from-purple-400 to-purple-600'
    },
    searchName: {
      icon: <Filter size={20} />,
      label: 'Recherche par nom',
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-600',
      gradient: 'from-orange-400 to-orange-600'
    }
  };

  // Statistiques
  const stats = useMemo(() => {
    const scanCount = history.filter(h => h.interaction_type === 'scan').length;
    const searchCount = history.filter(h => h.interaction_type === 'search').length;
    const manualCount = history.filter(h => h.interaction_type === 'manual_entry').length;
    const searchNameCount = history.filter(h => h.interaction_type === 'searchName').length;
    
    return [
      {
        label: 'Total consultations',
        value: total,
        icon: <Eye size={24} />,
        color: 'green',
        bgColor: 'bg-green-50',
        filterValue: 'all'
      },
      {
        label: 'Produits scannés',
        value: scanCount,
        icon: <Camera size={24} />,
        color: 'blue',
        bgColor: 'bg-blue-50',
        filterValue: 'scan'
      },
      {
        label: 'Recherches',
        value: searchCount + searchNameCount,
        icon: <Search size={24} />,
        color: 'amber',
        bgColor: 'bg-amber-50',
        filterValue: 'search' // Note: ceci filtrera seulement 'search', pas 'searchName'
      },
      {
        label: 'Saisies manuelles',
        value: manualCount,
        icon: <Keyboard size={24} />,
        color: 'purple',
        bgColor: 'bg-purple-50',
        filterValue: 'manual_entry'
      }
    ];
  }, [history, total]);

  // Afficher un placeholder pour l'historique vide
  const renderPlaceholder = () => (
    <div className="bg-white p-12 rounded-2xl shadow-lg text-center max-w-2xl mx-auto">
      <HistoryIllustration />
      <h3 className="text-2xl font-bold text-gray-800 mb-3 mt-8">Historique vide</h3>
      <p className="text-gray-600 mb-6">
        Commencez à scanner et rechercher des produits pour construire votre historique personnel
      </p>
      <Link 
        to="/recherche-filtre" 
        className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-all transform hover:scale-105 shadow-lg"
      >
        <Camera size={20} className="mr-2" />
        Scanner mon premier produit
      </Link>
    </div>
  );

  // Afficher un message pour les utilisateurs sans autorisation
  const renderSubscriptionUpgrade = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-4 rounded-full">
            <Lock size={40} className="text-amber-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Débloquez votre historique
        </h3>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          L'historique des produits est une fonctionnalité exclusive de nos abonnements payants. 
          Gardez une trace de tous vos scans et recherches !
        </p>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 mb-8 border border-green-200">
          <h4 className="text-green-800 font-bold mb-4 flex items-center justify-center">
            <Sparkles className="mr-2" size={20} />
            Avantages de l'historique
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="flex items-start">
              <CheckCircle className="text-green-600 mr-2 flex-shrink-0 mt-0.5" size={16} />
              <span className="text-sm text-gray-700">Retrouvez facilement vos produits consultés</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-green-600 mr-2 flex-shrink-0 mt-0.5" size={16} />
              <span className="text-sm text-gray-700">Suivez vos habitudes de consommation</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="text-green-600 mr-2 flex-shrink-0 mt-0.5" size={16} />
              <span className="text-sm text-gray-700">Comparez vos recherches dans le temps</span>
            </div>
          </div>
        </div>
        
        <Link 
          to="/abonnements" 
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-bold transition-all transform hover:scale-105 shadow-lg"
        >
          <TrendingUp className="mr-2" size={20} />
          Découvrir nos abonnements
        </Link>
      </div>
    </div>
  );

  return (
    <ProfileLayout title="">
      <Helmet>
        <title>Mon Historique | Fydo</title>
        <meta name="description" content="Consultez l'historique de tous les produits que vous avez scannés et recherchés sur Fydo" />
      </Helmet>

      {!canAccessHistory ? (
        renderSubscriptionUpgrade()
      ) : loading && history.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de votre historique...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-red-800 mb-2">Une erreur est survenue</h3>
          <p className="text-red-700 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchHistory(0, false);
            }}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-all"
          >
            Réessayer
          </button>
        </div>
      ) : Object.keys(groupedHistory).length === 0 && history.length === 0 ? (
        renderPlaceholder()
      ) : (
        <div>
          {/* Header avec titre et stats */}
          <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-3">
                Mon <span className="text-green-600">Historique</span>
              </h1>
              <p className="text-base text-green-700">Retrouvez tous les produits que vous avez consultés</p>
            </div>
            
            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <button 
                  key={stat.label}
                  onClick={() => setFilter(stat.filterValue)}
                  className={`${stat.bgColor} rounded-xl p-4 text-center transition-all duration-500 hover:scale-105 cursor-pointer group relative overflow-hidden ${
                    filter === stat.filterValue ? `ring-2 ring-offset-2 shadow-lg scale-105 ${
                      stat.color === 'green' ? 'ring-green-500' :
                      stat.color === 'blue' ? 'ring-blue-500' :
                      stat.color === 'amber' ? 'ring-amber-500' :
                      'ring-purple-500'
                    }` : 'hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Indicateur de sélection */}
                  {filter === stat.filterValue && (
                    <div className={`absolute top-0 right-0 text-white px-2 py-1 rounded-bl-lg text-xs font-bold flex items-center ${
                      stat.color === 'green' ? 'bg-green-500' :
                      stat.color === 'blue' ? 'bg-blue-500' :
                      stat.color === 'amber' ? 'bg-amber-500' :
                      'bg-purple-500'
                    }`}>
                      <Check size={12} />
                    </div>
                  )}
                  
                  <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md group-hover:shadow-lg transition-shadow`}>
                    <div className={
                      stat.color === 'green' ? 'text-green-600' :
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'amber' ? 'text-amber-600' :
                      'text-purple-600'
                    }>
                      {stat.icon}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Barre de recherche et filtres */}
          <div className={`mb-6 bg-white rounded-2xl shadow-lg p-4 border border-gray-100 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setFilter('all');
                    setSearchTerm('');
                  }}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    filter === 'all' && searchTerm === '' 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                  disabled={filter === 'all' && searchTerm === ''}
                >
                  Réinitialiser
                </button>
                
                <div className="flex items-center space-x-2 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200">
                  <Filter size={18} className="text-gray-500" />
                  <select 
                    className="bg-transparent border-0 focus:outline-none py-1 text-gray-700 font-medium"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">Toutes les méthodes</option>
                    <option value="scan">Scannés uniquement</option>
                    <option value="search">Toutes les recherches</option>
                    <option value="manual_entry">Saisis manuellement</option>
                  </select>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Compteur de résultats */}
          {filter !== 'all' && Object.keys(groupedHistory).length > 0 && (
            <div className="mb-4 text-center">
              <p className="text-gray-600">
                {Object.keys(groupedHistory).length} {
                  filter === 'scan' ? 'produit(s) scanné(s)' : 
                  filter === 'search' ? 'recherche(s)' : 
                  'saisie(s) manuelle(s)'
                } trouvé(s)
              </p>
            </div>
          )}
          
          {/* Liste de l'historique */}
          {Object.keys(groupedHistory).length === 0 ? (
            <div className="bg-gray-50 p-12 rounded-2xl text-center">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">
                {filter !== 'all' 
                  ? `Aucun produit ${
                      filter === 'scan' ? 'scanné' : 
                      filter === 'search' ? 'recherché' : 
                      'saisi manuellement'
                    }`
                  : 'Aucun résultat pour cette recherche'
                }
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {filter !== 'all' 
                  ? 'Essayez de changer de filtre ou ' 
                  : 'Essayez avec d\'autres mots-clés ou '
                }
                <button 
                  onClick={() => {
                    setFilter('all');
                    setSearchTerm('');
                  }}
                  className="text-green-600 hover:text-green-700 font-medium underline"
                >
                  réinitialisez les filtres
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedHistory).sort(([keyA, dataA], [keyB, dataB]) => {
                const dateA = new Date(dataA.productInfo.last_interaction_date);
                const dateB = new Date(dataB.productInfo.last_interaction_date);
                return dateB - dateA;
              }).map(([productKey, productData], index) => {
                const { productInfo, interactions } = productData;
                const isExpanded = expandedProducts[productKey] || false;
                const interactionConfig = interactionTypes[productInfo.interaction_type] || interactionTypes.search;
                
                const productUrl = productInfo.interaction_type === 'searchName'
                  ? `/recherche-filtre?q=${encodeURIComponent(productInfo.product_name || '')}`
                  : `/recherche-filtre?barcode=${productInfo.product_code}`;
                
                return (
                  <div 
                    key={productKey} 
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 border border-gray-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ animationDelay: `${300 + index * 50}ms` }}
                  >
                    <div className="p-6">
                      <div className="flex items-start">
                        {/* Image ou icône du produit */}
                        <div className="flex-shrink-0 mr-5">
                          {productInfo.interaction_type === 'searchName' ? (
                            <div className={`w-20 h-20 ${interactionConfig.bgColor} rounded-xl flex items-center justify-center`}>
                              {React.cloneElement(interactionConfig.icon, { 
                                size: 32, 
                                className: interactionConfig.iconColor 
                              })}
                            </div>
                          ) : (
                            <Link 
                              to={productUrl}
                              className="block w-20 h-20 bg-gray-100 rounded-xl overflow-hidden hover:scale-105 transition-transform"
                            >
                              {productInfo.product_image_url ? (
                                <img 
                                  src={productInfo.product_image_url} 
                                  alt={productInfo.product_name || 'Produit'} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/placeholder.png';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <Package size={32} className="text-gray-400" />
                                </div>
                              )}
                            </Link>
                          )}
                        </div>
                        
                        {/* Informations du produit */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              {productInfo.interaction_type === 'searchName' ? (
                                <>
                                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                                    Recherche : "{productInfo.product_name || 'Terme de recherche'}"
                                  </h3>
                                  {productInfo.total_results !== undefined && (
                                    <div className="inline-flex items-center bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                                      <Hash size={14} className="mr-1" />
                                      <span className="font-semibold">{productInfo.total_results}</span> résultats trouvés
                                    </div>
                                  )}
                                </>
                              ) : (
                                <Link to={productUrl} className="hover:text-green-700 transition-colors">
                                  <h3 className="text-xl font-bold text-gray-800 mb-1 hover:underline">
                                    {productInfo.product_name || 'Produit sans nom'}
                                  </h3>
                                  {productInfo.product_brand && (
                                    <p className="text-gray-600 flex items-center">
                                      <span className="font-medium">{productInfo.product_brand}</span>
                                      <span className="mx-2 text-gray-400">•</span>
                                      <span className="text-sm text-gray-500">{productInfo.product_code}</span>
                                    </p>
                                  )}
                                </Link>
                              )}
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center space-x-3">
                              {productInfo.interaction_type !== 'searchName' && (
                                <FavoriteButton 
                                  productCode={productInfo.product_code}
                                  productData={{
                                    product_name: productInfo.product_name,
                                    brands: productInfo.product_brand,
                                    image_url: productInfo.product_image_url
                                  }}
                                  size="sm"
                                />
                              )}
                              
                              {productInfo.interaction_type === 'searchName' ? (
                                <Link
                                  to={productUrl}
                                  className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors font-medium text-sm"
                                >
                                  Relancer <ExternalLink size={14} className="ml-1" />
                                </Link>
                              ) : (
                                <Link
                                  to={productUrl}
                                  className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium text-sm"
                                >
                                  Voir <ExternalLink size={14} className="ml-1" />
                                </Link>
                              )}
                            </div>
                          </div>
                          
                          {/* Dernière interaction */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`inline-flex items-center px-3 py-1.5 rounded-lg ${interactionConfig.bgColor} ${interactionConfig.borderColor} border`}>
                                {React.cloneElement(interactionConfig.icon, { 
                                  size: 16, 
                                  className: interactionConfig.iconColor 
                                })}
                                <span className={`ml-2 text-sm font-medium ${interactionConfig.iconColor}`}>
                                  {interactionConfig.label}
                                </span>
                              </div>
                              
                              <div className="flex items-center text-gray-500 text-sm">
                                <Calendar size={16} className="mr-1" />
                                <time dateTime={interactions[0].interaction_date}>
                                  {formatDate(interactions[0].interaction_date)}
                                </time>
                              </div>
                            </div>
                            
                            {/* Bouton pour afficher l'historique */}
                            {interactions.length > 1 && (
                              <button
                                onClick={() => toggleProductExpansion(productKey)}
                                className="flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp size={18} className="mr-1" />
                                    Masquer ({interactions.length})
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown size={18} className="mr-1" />
                                    Historique ({interactions.length})
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Historique détaillé */}
                      {isExpanded && interactions.length > 1 && (
                        <div className="mt-6 pl-25 border-t border-gray-100 pt-5">
                          <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                            <Clock size={16} className="mr-2" />
                            Historique détaillé des interactions
                          </h4>
                          <div className="space-y-3">
                            {interactions.map((interaction, idx) => {
                              const config = interactionTypes[interaction.interaction_type] || interactionTypes.search;
                              return (
                                <div key={interaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center">
                                    <div className={`w-8 h-8 ${config.bgColor} rounded-full flex items-center justify-center mr-3`}>
                                      {React.cloneElement(config.icon, { 
                                        size: 14, 
                                        className: config.iconColor 
                                      })}
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-800">{config.label}</span>
                                      <span className="mx-2 text-gray-400">•</span>
                                      <span className="text-gray-600 text-sm">
                                        {formatDate(interaction.interaction_date)} à {formatTime(interaction.interaction_date)}
                                      </span>
                                    </div>
                                  </div>
                                  <span className="text-xs text-gray-500">#{idx + 1}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Bouton charger plus */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMoreHistory}
                className="px-6 py-3 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-xl hover:from-green-200 hover:to-green-300 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader size={18} className="animate-spin mr-2" />
                    Chargement...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <ChevronDown size={18} className="mr-2" />
                    Charger plus d'historique
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </ProfileLayout>
  );
};

export default ProductHistory;