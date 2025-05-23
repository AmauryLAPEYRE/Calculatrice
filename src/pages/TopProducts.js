// src/pages/TopProducts.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Star, TrendingUp, Heart, MessageSquare, Award, Users, Filter, ChevronRight, Search, Crown } from 'lucide-react';
import { getTopProducts } from '../services/topProductsService';
import SearchResultItem from '../components/product/SearchResultItem';
import { useAuth } from '../contexts/AuthContext';

const TopProducts = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // États pour les données
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('average_rating');
  const [sortAsc, setSortAsc] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Configuration des critères de tri
  const sortOptions = [
    { 
      value: 'average_rating', 
      label: 'Mieux notés', 
      icon: <Star size={20} className="text-yellow-500 fill-yellow-500" />,
      description: 'Les produits avec les meilleures notes communautaires'
    },
    { 
      value: 'total_reviews', 
      label: 'Plus commentés', 
      icon: <MessageSquare size={20} className="text-green-600" />,
      description: 'Les produits avec le plus d\'avis vérifiés'
    },
    { 
      value: 'total_favorites', 
      label: 'Plus suivis', 
      icon: <Heart size={20} className="text-pink-500 fill-pink-500" />,
      description: 'Les produits favoris de la communauté'
    },
    { 
      value: 'taste_rating', 
      label: 'Meilleur goût', 
      icon: <Award size={20} className="text-amber-500" />,
      description: 'Les produits les mieux notés pour leur goût'
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

  // Option actuellement sélectionnée
  const currentSortOption = sortOptions.find(option => option.value === sortBy);

  return (
    <section className="py-20 bg-green-50 min-h-screen">
      <Helmet>
        <title>Top Produits | Fydo - Les Meilleurs Produits Notés par la Communauté</title>
        <meta name="description" content="Découvrez les produits les mieux notés par notre communauté. Avis vérifiés, notes authentiques et recommandations fiables pour vos achats quotidiens." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-green-600">
              <li><Link to="/" className="hover:text-green-800 transition-colors">Accueil</Link></li>
              <li><ChevronRight size={16} /></li>
              <li className="text-green-800 font-medium">Top Produits</li>
            </ol>
          </nav>

          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
              Les Meilleurs Produits <span className="text-green-600">de la Communauté</span>
            </h1>
            <p className="text-xl text-green-700 max-w-3xl mx-auto">
              Découvrez les produits les mieux notés avec des avis 100% vérifiés par ticket de caisse
            </p>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center space-x-8 opacity-80 mt-8">
              <span className="text-sm text-green-700 flex items-center">
                <Users size={16} className="mr-1" />
                10,000+ utilisateurs actifs
              </span>
              <span className="text-sm text-green-700 flex items-center">
                <Star size={16} className="mr-1 text-yellow-500 fill-yellow-500" />
                50,000+ avis vérifiés
              </span>
              <span className="text-sm text-green-700 flex items-center">
                <Crown size={16} className="mr-1 text-amber-500" />
                100% authentique
              </span>
            </div>
          </div>

          {/* Contrôles de recherche et tri */}
          <div className="bg-white rounded-2xl p-8 shadow-md mb-16 border border-green-100">
            <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
              
              {/* Barre de recherche */}
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Sélecteur de tri */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium flex items-center">
                  <Filter size={18} className="mr-2" />
                  Trier par:
                </span>
                <div className="flex space-x-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        sortBy === option.value
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                      }`}
                    >
                      {option.icon}
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description du tri actuel */}
            {currentSortOption && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 text-sm flex items-center">
                  <TrendingUp size={16} className="mr-2" />
                  <strong>{currentSortOption.label}:</strong>
                  <span className="ml-2">{currentSortOption.description}</span>
                </p>
              </div>
            )}
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white rounded-2xl p-6 shadow-md text-center transform hover:scale-[1.02] transition-all duration-500 border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star size={24} className="text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-800 mb-1">{totalCount}</div>
              <div className="text-green-600 text-sm">Produits notés</div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-md text-center transform hover:scale-[1.02] transition-all duration-500 border border-green-100">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award size={24} className="text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-green-800 mb-1">4.5+</div>
              <div className="text-green-600 text-sm">Note moyenne</div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-md text-center transform hover:scale-[1.02] transition-all duration-500 border border-green-100">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart size={24} className="text-pink-600" />
              </div>
              <div className="text-2xl font-bold text-green-800 mb-1">25K+</div>
              <div className="text-green-600 text-sm">Produits favoris</div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-md text-center transform hover:scale-[1.02] transition-all duration-500 border border-green-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare size={24} className="text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-green-800 mb-1">100K+</div>
              <div className="text-green-600 text-sm">Avis vérifiés</div>
            </div>
          </div>

          {/* Liste des produits */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-green-100 mb-16">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-green-800 flex items-center">
                {currentSortOption?.icon}
                <span className="ml-3">{currentSortOption?.label}</span>
                <span className="ml-2 text-green-600">({totalCount} produits)</span>
              </h2>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mr-3"></div>
                  <span className="text-green-700">Chargement des meilleurs produits...</span>
                </div>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <div className="text-red-600 mb-4">{error}</div>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Réessayer
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center">
                <Search size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche ou de tri.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {products.map((product, index) => (
                  <div key={product.code} className="relative">
                    {/* Badge classement */}
                    <div className="absolute top-4 left-4 z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-amber-600' : 
                        'bg-green-600'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    
                    <SearchResultItem
                      result={product}
                      onSelect={handleProductSelect}
                      searchFilters={{}}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section testimonial */}
          <div className="bg-white rounded-2xl p-8 shadow-md mb-16 border border-green-100">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="font-bold text-green-800">M</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Marie L.</p>
                      <div className="flex text-yellow-400">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} size={16} className="fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">"Grâce à Fydo, je découvre les meilleurs produits sans me tromper. Les avis sont toujours fiables car vérifiés !"</p>
                </div>
              </div>
              
              <div className="md:w-2/3 md:pl-8">
                <h3 className="text-2xl font-bold text-green-800 mb-4">Pourquoi faire confiance aux top produits Fydo ?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-green-600 font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Avis 100% vérifiés</h4>
                      <p className="text-gray-600 text-sm">Chaque avis est validé par ticket de caisse</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-green-600 font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Communauté active</h4>
                      <p className="text-gray-600 text-sm">Des milliers d'utilisateurs partagent leurs expériences</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-green-600 font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Mise à jour continue</h4>
                      <p className="text-gray-600 text-sm">Le classement évolue avec les nouveaux avis</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-green-600 font-bold text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Critères détaillés</h4>
                      <p className="text-gray-600 text-sm">Notes par goût, qualité, rapport qualité-prix</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section CTA */}
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">Prêt à découvrir plus de produits ?</h2>
              <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                Utilisez notre recherche avancée pour trouver exactement ce que vous cherchez ou scannez directement vos produits en magasin.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/recherche-filtre"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
                >
                  Rechercher des produits
                </Link>
                
                {!currentUser && (
                  <Link
                    to="/signup"
                    className="bg-white hover:bg-gray-50 text-green-700 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
                  >
                    Rejoindre la communauté
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Suggestions de navigation */}
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <h3 className="text-xl font-bold text-green-800 mb-6">Découvrez aussi :</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/recherche-filtre"
                className="group p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Search size={32} className="text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-green-800 mb-2">Recherche avancée</h4>
                <p className="text-green-700 text-sm">Trouvez des produits selon vos critères spécifiques</p>
              </Link>
              
              <Link
                to="/concept"
                className="group p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Heart size={32} className="text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-blue-800 mb-2">Notre concept</h4>
                <p className="text-blue-700 text-sm">Découvrez comment Fydo révolutionne vos achats</p>
              </Link>
              
              <Link
                to="/fonctionnalites"
                className="group p-6 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Star size={32} className="text-amber-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-amber-800 mb-2">Fonctionnalités</h4>
                <p className="text-amber-700 text-sm">Explorez tous les outils Fydo à votre disposition</p>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TopProducts;