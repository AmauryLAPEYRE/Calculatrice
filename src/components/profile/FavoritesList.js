// src/components/profile/FavoritesList.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Star, 
  Trash2, 
  Search, 
  ExternalLink, 
  Loader, 
  AlertCircle, 
  Lock, 
  Heart,
  Calendar,
  Package,
  Filter,
  ChevronDown,
  TrendingUp,
  Sparkles,
  ShoppingBag,
  BarChart3,
  CheckCircle,
  Grid,
  List,
  Eye,
  Zap
} from 'lucide-react';
import { getUserFavorites, toggleFavorite } from '../../services/productService';
import { Link } from 'react-router-dom';
import ProfileLayout from './ProfileLayout';
import useSubscriptionPermissions from '../../hooks/useSubscriptionPermissions';

const FavoritesList = () => {
  const { currentUser, userDetails, refreshUserDetails } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [removing, setRemoving] = useState({});
  const [filterMode, setFilterMode] = useState('all');
  const [sortMode, setSortMode] = useState('date-desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [isVisible, setIsVisible] = useState(false);
  
  // Utiliser le hook de permissions d'abonnement
  const { isAuthorized } = useSubscriptionPermissions();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Illustration pour les favoris
  const FavoritesIllustration = () => (
    <svg viewBox="0 0 400 300" className="w-full h-auto">
      <defs>
        <linearGradient id="favoritesGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#81C784', stopOpacity:1}}>
            <animate attributeName="stop-color" values="#81C784;#66BB6A;#81C784" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" style={{stopColor:'#4CAF50', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="favoritesGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#FFD54F', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#FFA726', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="favoritesGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#FF6B6B', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#FF8787', stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Fond circulaire */}
      <circle cx="200" cy="150" r="120" fill="url(#favoritesGrad1)" opacity="0.1" />
      
      {/* Cœur central */}
      <g transform="translate(200, 150)">
        <path d="M0,15 C0,-15 -30,-30 -30,0 C-30,15 -15,30 0,45 C15,30 30,15 30,0 C30,-30 0,-15 0,15 Z" 
              fill="url(#favoritesGrad3)" stroke="white" strokeWidth="3">
          <animateTransform attributeName="transform" type="scale" 
                            values="1;1.2;1" dur="2s" repeatCount="indefinite" />
        </path>
        
        {/* Étoile dans le cœur */}
        <path d="M0,-5 L3,2 L10,2 L4,7 L6,14 L0,10 L-6,14 L-4,7 L-10,2 L-3,2 Z" 
              fill="white" transform="scale(0.8)">
          <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
        </path>
      </g>
      
      {/* Étoiles flottantes */}
      <g opacity="0.8">
        <g transform="translate(100, 80)">
          <path d="M0,-10 L3,-3 L10,-3 L4,1 L6,8 L0,4 L-6,8 L-4,1 L-10,-3 L-3,-3 Z" 
                fill="#FFD700" stroke="#FFD700" strokeWidth="1">
            <animateTransform attributeName="transform" type="rotate" 
                              from="0 100 80" to="360 100 80" dur="20s" repeatCount="indefinite" />
          </path>
        </g>
        
        <g transform="translate(300, 100)">
          <path d="M0,-8 L2,-2 L8,-2 L3,1 L5,6 L0,3 L-5,6 L-3,1 L-8,-2 L-2,-2 Z" 
                fill="#FFA726" stroke="#FFA726" strokeWidth="1">
            <animateTransform attributeName="transform" type="rotate" 
                              from="0 300 100" to="-360 300 100" dur="15s" repeatCount="indefinite" />
          </path>
        </g>
        
        <g transform="translate(80, 220)">
          <path d="M0,-6 L2,-2 L6,-2 L2,1 L3,5 L0,3 L-3,5 L-2,1 L-6,-2 L-2,-2 Z" 
                fill="#FFD54F" stroke="#FFD54F" strokeWidth="1">
            <animateTransform attributeName="transform" type="rotate" 
                              from="0 80 220" to="360 80 220" dur="25s" repeatCount="indefinite" />
          </path>
        </g>
      </g>
      
      {/* Particules de cœur */}
      <g opacity="0.6">
        <path d="M150,150 C150,140 145,135 145,140 C145,143 147.5,145 150,148 C152.5,145 155,143 155,140 C155,135 150,140 150,150 Z" 
              fill="#FF6B6B">
          <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" 
                            values="0,0; -20,-30; 0,0" dur="3s" repeatCount="indefinite" />
        </path>
        
        <path d="M250,200 C250,190 245,185 245,190 C245,193 247.5,195 250,198 C252.5,195 255,193 255,190 C255,185 250,190 250,200 Z" 
              fill="#FF8787">
          <animate attributeName="opacity" values="0;1;0" dur="3.5s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" 
                            values="0,0; 20,-40; 0,0" dur="3.5s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  );

  // Récupérer les favoris de l'utilisateur
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser || !userDetails) return;
      
      setLoading(true);
      
      try {
        const { success, data, total, error } = await getUserFavorites(userDetails.id, 20, offset);
        
        if (success) {
          setFavorites(prev => offset === 0 ? data : [...prev, ...data]);
          setTotal(total);
          setHasMore(offset + data.length < total);
        } else {
          setError(error || "Impossible de récupérer vos produits favoris");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des favoris:", err);
        setError("Une erreur est survenue lors du chargement de vos favoris");
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, [currentUser, userDetails, offset]);

  // Filtrer et trier les favoris
  useEffect(() => {
    let filtered = [...favorites];
    
    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        fav => fav.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               fav.product_brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               fav.product_code?.includes(searchTerm)
      );
    }
    
    // Filtre par catégorie
    if (filterMode !== 'all') {
      filtered = filtered.filter(fav => {
        switch (filterMode) {
          case 'this-week':
            const addedDate = new Date(fav.added_date);
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return addedDate >= oneWeekAgo;
          case 'well-rated':
            return fav.average_rating >= 4;
          case 'to-discover':
            return !fav.average_rating || fav.total_reviews < 5;
          default:
            return true;
        }
      });
    }
    
    // Tri
    filtered.sort((a, b) => {
      switch (sortMode) {
        case 'date-desc':
          return new Date(b.added_date) - new Date(a.added_date);
        case 'date-asc':
          return new Date(a.added_date) - new Date(b.added_date);
        case 'name-asc':
          return (a.product_name || '').localeCompare(b.product_name || '');
        case 'name-desc':
          return (b.product_name || '').localeCompare(a.product_name || '');
        default:
          return 0;
      }
    });
    
    setFilteredFavorites(filtered);
  }, [searchTerm, favorites, filterMode, sortMode]);

  // Charger plus de favoris
  const loadMoreFavorites = () => {
    if (hasMore && !loading && isAuthorized('favorites')) {
      setOffset(offset + 20);
    }
  };

  // Supprimer un favori
  const removeFavorite = async (productCode) => {
    if (removing[productCode]) return;
    
    setRemoving(prev => ({ ...prev, [productCode]: true }));
    
    try {
      const { success, error } = await toggleFavorite(userDetails.id, productCode, false, {}, refreshUserDetails);
      
      if (success) {
        // Mettre à jour la liste des favoris
        setFavorites(prev => prev.filter(fav => fav.product_code !== productCode));
        setTotal(prev => prev - 1);
      } else {
        console.error("Erreur lors de la suppression du favori:", error);
      }
    } catch (err) {
      console.error("Erreur lors de la suppression du favori:", err);
    } finally {
      setRemoving(prev => ({ ...prev, [productCode]: false }));
    }
  };

  // Statistiques des favoris
  const stats = [
    {
      label: 'Total favoris',
      value: total,
      icon: <Heart size={24} />,
      color: 'pink',
      bgColor: 'bg-pink-50',
      filterValue: 'all'
    },
    {
      label: 'Cette semaine',
      value: favorites.filter(f => {
        const addedDate = new Date(f.added_date);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return addedDate >= oneWeekAgo;
      }).length,
      icon: <Calendar size={24} />,
      color: 'blue',
      bgColor: 'bg-blue-50',
      filterValue: 'this-week'
    },
    {
      label: 'Bien notés',
      value: favorites.filter(f => f.average_rating >= 4).length,
      icon: <Star size={24} />,
      color: 'amber',
      bgColor: 'bg-amber-50',
      filterValue: 'well-rated'
    },
    {
      label: 'À découvrir',
      value: favorites.filter(f => !f.average_rating || f.total_reviews < 5).length,
      icon: <Sparkles size={24} />,
      color: 'purple',
      bgColor: 'bg-purple-50',
      filterValue: 'to-discover'
    }
  ];

  // Afficher un placeholder pour les favoris vides
  const renderPlaceholder = () => (
    <div className="bg-white p-12 rounded-2xl shadow-lg text-center max-w-2xl mx-auto">
      <FavoritesIllustration />
      <h3 className="text-2xl font-bold text-gray-800 mb-3 mt-8">Aucun produit favori</h3>
      <p className="text-gray-600 mb-6">
        Commencez à ajouter vos produits préférés pour les retrouver facilement
      </p>
      <Link 
        to="/recherche-filtre" 
        className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-all transform hover:scale-105 shadow-lg"
      >
        <Search size={20} className="mr-2" />
        Rechercher des produits
      </Link>
    </div>
  );

  // Message d'abonnement pour les utilisateurs limités
  const renderSubscriptionMessage = () => (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8 mt-8 max-w-2xl mx-auto">
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-gradient-to-br from-amber-100 to-amber-200 p-3 rounded-full mr-5">
          <Lock size={28} className="text-amber-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-amber-800 mb-3">
            Accès limité aux favoris
          </h3>
          <p className="text-amber-700 mb-5">
            Avec votre abonnement actuel, vous pouvez voir uniquement vos 3 favoris les plus récents.
            Passez à un abonnement supérieur pour sauvegarder et accéder à un nombre illimité de produits favoris !
          </p>
          <div className="bg-white/50 rounded-xl p-4 mb-5 border border-amber-200">
            <h4 className="font-bold text-amber-800 mb-3 flex items-center">
              <Sparkles size={20} className="mr-2" />
              Avantages de l'abonnement Premium
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start">
                <CheckCircle size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Favoris illimités</span>
              </div>
              <div className="flex items-start">
                <CheckCircle size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Organisation par listes</span>
              </div>
              <div className="flex items-start">
                <CheckCircle size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Export de vos favoris</span>
              </div>
              <div className="flex items-start">
                <CheckCircle size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Synchronisation multi-appareils</span>
              </div>
            </div>
          </div>
          <Link 
            to="/abonnements" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            <TrendingUp size={20} className="mr-2" />
            Découvrir nos abonnements
          </Link>
        </div>
      </div>
    </div>
  );

  // Préparer les favoris à afficher en fonction de l'autorisation
  const getFavoritesToDisplay = () => {
    // Si l'utilisateur est autorisé, afficher tous les favoris filtrés
    if (isAuthorized('favorites')) {
      return filteredFavorites;
    }
    
    // Sinon, n'afficher que les 3 premiers favoris
    return filteredFavorites.slice(0, 3);
  };

  const favoritesToDisplay = getFavoritesToDisplay();

  return (
    <ProfileLayout title="">
      <Helmet>
        <title>Mes Favoris | Fydo</title>
        <meta name="description" content="Gérez vos produits favoris et retrouvez-les facilement sur Fydo" />
      </Helmet>

      {loading && favorites.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de vos favoris...</p>
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
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-all"
          >
            Réessayer
          </button>
        </div>
      ) : favorites.length === 0 ? (
        renderPlaceholder()
      ) : (
        <div>
          {/* Header avec titre et stats */}
          <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-3">
                Mes <span className="text-green-600">Favoris</span>
              </h1>
              <p className="text-base text-green-700">Retrouvez vos produits préférés en un clin d'œil</p>
            </div>
            
            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <button 
                  key={stat.label}
                  onClick={() => setFilterMode(stat.filterValue)}
                  className={`${stat.bgColor} rounded-xl p-4 text-center transition-all duration-500 hover:scale-105 cursor-pointer group relative overflow-hidden ${
                    filterMode === stat.filterValue ? `ring-2 ring-offset-2 shadow-lg scale-105 ${
                      stat.color === 'pink' ? 'ring-pink-500' :
                      stat.color === 'green' ? 'ring-green-500' :
                      stat.color === 'lime' ? 'ring-lime-500' :
                      'ring-orange-500'
                    }` : 'hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {filterMode === stat.filterValue && (
                    <div className={`absolute top-0 right-0 text-white px-2 py-1 rounded-bl-lg text-xs font-bold flex items-center ${
                      stat.color === 'pink' ? 'bg-pink-500' :
                      stat.color === 'green' ? 'bg-green-500' :
                      stat.color === 'lime' ? 'bg-lime-500' :
                      'bg-orange-500'
                    }`}>
                      <Heart size={12} fill="white" />
                    </div>
                  )}
                  
                  <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md group-hover:shadow-lg transition-shadow`}>
                    <div className={
                      stat.color === 'pink' ? 'text-pink-600' :
                      stat.color === 'green' ? 'text-green-600' :
                      stat.color === 'lime' ? 'text-lime-600' :
                      'text-orange-600'
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

          {/* Barre de recherche et options */}
          <div className={`mb-6 bg-white rounded-2xl shadow-lg p-4 border border-gray-100 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Rechercher dans vos favoris..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Bouton réinitialiser */}
                <button
                  onClick={() => {
                    setFilterMode('all');
                    setSearchTerm('');
                    setSortMode('date-desc');
                  }}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    filterMode === 'all' && searchTerm === '' && sortMode === 'date-desc'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                  disabled={filterMode === 'all' && searchTerm === '' && sortMode === 'date-desc'}
                >
                  Réinitialiser
                </button>
                
                {/* Sélecteur de filtre par catégorie */}
                <div className="flex items-center space-x-2 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200">
                  <Filter size={18} className="text-gray-500" />
                  <select 
                    className="bg-transparent border-0 focus:outline-none py-1 text-gray-700 font-medium"
                    value={filterMode}
                    onChange={(e) => setFilterMode(e.target.value)}
                  >
                    <option value="all">Tous les favoris</option>
                    <option value="this-week">Ajoutés cette semaine</option>
                    <option value="well-rated">Bien notés (★ 4+)</option>
                    <option value="to-discover">À découvrir</option>
                  </select>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
                
                {/* Sélecteur de tri */}
                <div className="flex items-center space-x-2 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200">
                  <BarChart3 size={18} className="text-gray-500" />
                  <select 
                    className="bg-transparent border-0 focus:outline-none py-1 text-gray-700 font-medium"
                    value={sortMode}
                    onChange={(e) => setSortMode(e.target.value)}
                  >
                    <option value="date-desc">Plus récents</option>
                    <option value="date-asc">Plus anciens</option>
                    <option value="name-asc">Nom A-Z</option>
                    <option value="name-desc">Nom Z-A</option>
                  </select>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
                
                {/* Switch vue grille/liste */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Compteur et message de limitation */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">
              {total} {total > 1 ? 'produits favoris' : 'produit favori'}
              {searchTerm && ` • ${favoritesToDisplay.length} résultat${favoritesToDisplay.length > 1 ? 's' : ''}`}
              {!isAuthorized('favorites') && total > 3 && ` • Affichage limité à 3`}
            </p>
          </div>
          
          {/* Liste des favoris */}
          {favoritesToDisplay.length === 0 ? (
            <div className="bg-gray-50 p-12 rounded-2xl text-center">
              <Heart size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">
                {searchTerm || filterMode !== 'all'
                  ? 'Aucun favori ne correspond à vos critères'
                  : 'Aucun produit favori'
                }
              </p>
              <button 
                onClick={() => {
                  setFilterMode('all');
                  setSearchTerm('');
                }}
                className="mt-4 text-green-600 hover:text-green-700 font-medium underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {favoritesToDisplay.map((favorite, index) => (
                <div 
                  key={favorite.id} 
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 border border-gray-100 group ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  } ${viewMode === 'list' ? 'flex' : ''}`}
                  style={{ animationDelay: `${300 + index * 50}ms` }}
                >
                  {/* Image du produit */}
                  {favorite.product_image_url && (
                    <div className={`${viewMode === 'list' ? 'w-32 h-32' : 'h-48 w-full'} bg-gray-100 overflow-hidden flex-shrink-0`}>
                      <img 
                        src={favorite.product_image_url} 
                        alt={favorite.product_name || 'Image produit'} 
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                        onError={(e) => e.target.src = '/placeholder.png'}
                      />
                    </div>
                  )}
                  
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 mr-3">
                        <h3 className="font-bold text-lg text-gray-800 line-clamp-2 mb-1">
                          {favorite.product_name || 'Produit sans nom'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {favorite.product_brand || 'Marque inconnue'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {favorite.average_rating && (
                          <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg">
                            <Star size={14} className="text-amber-500 fill-amber-500 mr-1" />
                            <span className="text-sm font-bold text-amber-700">
                              {favorite.average_rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                        {favorite.total_reviews > 0 && (
                          <span className="text-xs text-gray-500">
                            ({favorite.total_reviews} avis)
                          </span>
                        )}
                        <button
                          onClick={() => removeFavorite(favorite.product_code)}
                          disabled={removing[favorite.product_code]}
                          className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all ml-auto"
                          title="Retirer des favoris"
                        >
                          {removing[favorite.product_code] ? (
                            <Loader size={20} className="animate-spin" />
                          ) : (
                            <Trash2 size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-4 text-sm text-gray-500">
                      <Calendar size={16} className="mr-1" />
                      <span>Ajouté le {new Date(favorite.added_date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    
                    {/* Tags et infos supplémentaires */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {favorite.product_category && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {favorite.product_category}
                        </span>
                      )}
                      {favorite.total_reviews === 0 && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full flex items-center">
                          <Sparkles size={12} className="mr-1" />
                          Nouveau
                        </span>
                      )}
                      {favorite.average_rating >= 4.5 && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full flex items-center">
                          <Zap size={12} className="mr-1" />
                          Top produit
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Link
                        to={`/recherche-filtre?barcode=${favorite.product_code}`}
                        className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors"
                      >
                        Voir le produit 
                        <ExternalLink size={16} className="ml-1" />
                      </Link>
                      
                      <div className="flex items-center text-yellow-500">
                        <Star size={16} className="fill-current" />
                        <span className="ml-1 text-sm font-medium">Favori</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Message d'abonnement si limitation */}
          {!isAuthorized('favorites') && total > 3 && renderSubscriptionMessage()}
          
          {/* Chargement de plus de résultats */}
          {isAuthorized('favorites') && hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMoreFavorites}
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
                    Charger plus de favoris
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

export default FavoritesList;