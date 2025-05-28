import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserReviews, getReceiptImage, toggleReceiptSharing } from '../../services/reviewService';
import ProfileLayout from '../profile/ProfileLayout';
import { 
  Star, 
  MessageSquare, 
  Loader, 
  AlertCircle, 
  Calendar, 
  Check, 
  ShoppingBag, 
  MapPin, 
  DollarSign, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Receipt, 
  Image,
  TrendingUp,
  Award,
  ThumbsUp,
  Clock,
  Scan,
  ChevronRight,
  Sparkles,
  Filter,
  Shield,
  Search,
  Trophy,
  Package,
  BarChart3,
  Target
} from 'lucide-react';

/**
 * Composant pour afficher tous les avis publiés par l'utilisateur connecté
 * Design moderne inspiré de la page profil Fydo
 */
const UserReviews = () => {
  const { currentUser, userDetails } = useAuth();
  
  // États
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);
  const [receiptImages, setReceiptImages] = useState({});
  const [loadingReceipt, setLoadingReceipt] = useState({});
  const [expandedReceipt, setExpandedReceipt] = useState({});
  const [toggleSharing, setToggleSharing] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  
  // Statistiques calculées
  const [stats, setStats] = useState({
    totalAvis: 0,
    avisVerifies: 0,
    moyenneNotes: 0,
    avisApprouves: 0,
    avisEnAttente: 0,
    produitsEvalues: 0
  });
  
  // Chargement des avis de l'utilisateur
  useEffect(() => {
    if (!currentUser || !userDetails) return;
    
    const fetchUserReviews = async () => {
      setLoading(true);
      
      try {
        const { success, reviews, total, error } = await getUserReviews(userDetails.id, 50, 0);
        
        if (success) {
          setReviews(reviews);
          setTotalReviews(total);
          setHasMore(false); // Pour simplifier, on charge tout d'un coup
          
          // Calculer les statistiques
          calculateStats(reviews);
        } else {
          setError(error || "Impossible de récupérer vos avis");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des avis:", err);
        setError("Une erreur est survenue lors du chargement de vos avis");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserReviews();
  }, [currentUser, userDetails]);
  
  // Calculer les statistiques
  const calculateStats = (reviewsList) => {
    const verified = reviewsList.filter(r => r.is_verified).length;
    const approved = reviewsList.filter(r => r.status === 'approved' || r.status === 'approved_auto').length;
    const pending = reviewsList.filter(r => r.status === 'pending').length;
    const avgRating = reviewsList.reduce((sum, r) => sum + r.average_rating, 0) / (reviewsList.length || 1);
    const uniqueProducts = new Set(reviewsList.map(r => r.product_code)).size;
    
    setStats({
      totalAvis: reviewsList.length,
      avisVerifies: verified,
      moyenneNotes: avgRating.toFixed(1),
      avisApprouves: approved,
      avisEnAttente: pending,
      produitsEvalues: uniqueProducts
    });
  };
  
  // Filtrer et trier les avis
  const getFilteredReviews = () => {
    let filtered = [...reviews];
    
    // Filtre par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(review => {
        if (filterStatus === 'verified') return review.is_verified;
        if (filterStatus === 'approved') return review.status === 'approved' || review.status === 'approved_auto';
        if (filterStatus === 'pending') return review.status === 'pending';
        return true;
      });
    }
    
    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(review => 
        review.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Tri
    filtered.sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'rating') return b.average_rating - a.average_rating;
      if (sortBy === 'product') return a.product_name.localeCompare(b.product_name);
      return 0;
    });
    
    return filtered;
  };
  
  // Fonction pour charger l'image du ticket de caisse
  const loadReceiptImage = async (reviewId) => {
    if (loadingReceipt[reviewId] || receiptImages[reviewId]) return;
    
    setLoadingReceipt(prev => ({ ...prev, [reviewId]: true }));
    
    try {
      const { success, receiptUrl, error: receiptError } = await getReceiptImage(reviewId);
      
      if (success && receiptUrl) {
        setReceiptImages(prev => ({ ...prev, [reviewId]: receiptUrl }));
      } else if (receiptError) {
        console.error("Erreur lors du chargement du ticket:", receiptError);
      }
    } catch (err) {
      console.error("Erreur lors du chargement du ticket:", err);
    } finally {
      setLoadingReceipt(prev => ({ ...prev, [reviewId]: false }));
    }
  };
  
  // Fonction pour basculer l'autorisation de partage du ticket
  const handleToggleSharing = async (reviewId, currentState) => {
    if (toggleSharing[reviewId]) return;
    
    setToggleSharing(prev => ({ ...prev, [reviewId]: true }));
    
    try {
      const { success, error: sharingError } = await toggleReceiptSharing(reviewId, !currentState);
      
      if (success) {
        setReviews(prev => prev.map(review => 
          review.id === reviewId 
            ? { ...review, authorize_receipt_sharing: !currentState } 
            : review
        ));
        
        if (currentState && receiptImages[reviewId]) {
          setReceiptImages(prev => {
            const newState = { ...prev };
            delete newState[reviewId];
            return newState;
          });
          
          setExpandedReceipt(prev => {
            const newState = { ...prev };
            delete newState[reviewId];
            return newState;
          });
        }
      } else if (sharingError) {
        console.error("Erreur lors du changement d'autorisation:", sharingError);
      }
    } catch (err) {
      console.error("Erreur lors du changement d'autorisation:", err);
    } finally {
      setToggleSharing(prev => ({ ...prev, [reviewId]: false }));
    }
  };
  
  // Fonction pour afficher les étoiles de notation
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={16} 
            className={`${star <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
          />
        ))}
      </div>
    );
  };
  
  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Obtenir l'icône et la couleur du statut
  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved':
      case 'approved_auto':
        return {
          icon: <Check size={14} />,
          color: 'bg-green-100 text-green-700 border-green-200',
          text: 'Approuvé'
        };
      case 'pending':
        return {
          icon: <Clock size={14} />,
          color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          text: 'En attente'
        };
      case 'rejected':
        return {
          icon: <AlertCircle size={14} />,
          color: 'bg-red-100 text-red-700 border-red-200',
          text: 'Rejeté'
        };
      default:
        return {
          icon: null,
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          text: 'Inconnu'
        };
    }
  };
  
  // Fonction pour basculer l'affichage du ticket
  const toggleReceiptDisplay = (reviewId) => {
    setExpandedReceipt(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
    
    if (!expandedReceipt[reviewId] && !receiptImages[reviewId]) {
      loadReceiptImage(reviewId);
    }
  };
  
  const filteredReviews = getFilteredReviews();
  
  return (
    <ProfileLayout title="Mes Avis">
      {loading && reviews.length === 0 ? (
        <div className="flex justify-center items-center py-24">
          <div className="text-center">
            <Loader size={48} className="animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Chargement de vos avis...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-red-800 mb-2">Une erreur est survenue</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
          >
            Réessayer
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare size={40} className="text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Aucun avis publié</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Commencez à partager vos expériences avec la communauté Fydo en scannant et évaluant vos premiers produits !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/recherche-filtre" 
              className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Scan size={20} className="mr-2" />
              Scanner un produit
            </Link>
            <Link 
              to="/top-produits" 
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-700 rounded-xl hover:bg-green-50 transition-all duration-200 border-2 border-green-200"
            >
              <TrendingUp size={20} className="mr-2" />
              Voir les top produits
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {/* Section Statistiques avec animations */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center">
                  <Star className="text-green-700" size={20} />
                </div>
                <ChevronRight size={16} className="text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-800">{stats.totalAvis}</div>
              <div className="text-sm text-green-600">Avis publiés</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center">
                  <Shield className="text-blue-700" size={20} />
                </div>
                <ChevronRight size={16} className="text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-800">{stats.avisVerifies}</div>
              <div className="text-sm text-blue-600">Avis vérifiés</div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-yellow-200 rounded-xl flex items-center justify-center">
                  <BarChart3 className="text-yellow-700" size={20} />
                </div>
                <ChevronRight size={16} className="text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-yellow-800">{stats.moyenneNotes}</div>
              <div className="text-sm text-yellow-600">Note moyenne</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-purple-200 rounded-xl flex items-center justify-center">
                  <Package className="text-purple-700" size={20} />
                </div>
                <ChevronRight size={16} className="text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-800">{stats.produitsEvalues}</div>
              <div className="text-sm text-purple-600">Produits évalués</div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-emerald-200 rounded-xl flex items-center justify-center">
                  <Check className="text-emerald-700" size={20} />
                </div>
                <ChevronRight size={16} className="text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-emerald-800">{stats.avisApprouves}</div>
              <div className="text-sm text-emerald-600">Approuvés</div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-orange-200 rounded-xl flex items-center justify-center">
                  <Clock className="text-orange-700" size={20} />
                </div>
                <ChevronRight size={16} className="text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-800">{stats.avisEnAttente}</div>
              <div className="text-sm text-orange-600">En attente</div>
            </div>
          </div>
          
          {/* Section Actions Rapides */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  <Sparkles className="mr-2" size={24} />
                  Continuez à partager vos expériences !
                </h3>
                <p className="text-green-100">
                  Votre contribution aide des milliers de consommateurs à faire les bons choix.
                </p>
              </div>
              <Link
                to="/recherche-filtre"
                className="bg-white text-green-700 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
              >
                <Scan size={20} className="mr-2" />
                Scanner un nouveau produit
              </Link>
            </div>
          </div>
          
          {/* Barre de filtres et recherche */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Recherche */}
              <div className="flex-1">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un produit ou un avis..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>
              
              {/* Filtres */}
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer hover:bg-gray-100 transition-all duration-200"
                >
                  <option value="all">Tous les avis</option>
                  <option value="verified">Vérifiés uniquement</option>
                  <option value="approved">Approuvés</option>
                  <option value="pending">En attente</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer hover:bg-gray-100 transition-all duration-200"
                >
                  <option value="recent">Plus récents</option>
                  <option value="rating">Meilleures notes</option>
                  <option value="product">Par produit</option>
                </select>
              </div>
            </div>
            
            {/* Résultats de recherche */}
            {(searchTerm || filterStatus !== 'all') && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {filteredReviews.length} résultat{filteredReviews.length > 1 ? 's' : ''} trouvé{filteredReviews.length > 1 ? 's' : ''}
                </p>
                {(searchTerm || filterStatus !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('all');
                    }}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Liste des avis avec nouveau design */}
          <div className="space-y-4">
            {filteredReviews.map((review, index) => (
              <div 
                key={review.id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 transform hover:scale-[1.01]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="p-6">
                  {/* En-tête de l'avis */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      {/* Image du produit */}
                      <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl overflow-hidden flex-shrink-0 group cursor-pointer">
                        {review.product_image_url ? (
                          <img 
                            src={review.product_image_url} 
                            alt={review.product_name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => e.target.src = '/placeholder.png'}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag size={32} className="text-green-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Informations du produit */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-1 hover:text-green-600 transition-colors cursor-pointer">
                          {review.product_name || 'Produit sans nom'}
                        </h3>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm text-gray-500">EAN: {review.product_code}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
                        </div>
                        
                        {/* Note globale */}
                        <div className="flex items-center gap-3">
                          {renderStars(review.average_rating)}
                          <span className="font-bold text-gray-800">{review.average_rating.toFixed(1)}</span>
                          
                          {/* Badges */}
                          <div className="flex items-center gap-2">
                            {review.is_verified && (
                              <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                <Shield size={12} className="mr-1" />
                                Vérifié
                              </span>
                            )}
                            
                            {/* Statut */}
                            {(() => {
                              const status = getStatusStyle(review.status);
                              return (
                                <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${status.color}`}>
                                  {status.icon}
                                  <span className="ml-1">{status.text}</span>
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/recherche-filtre?barcode=${review.product_code}`}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                        title="Voir le produit"
                      >
                        <ExternalLink size={20} />
                      </Link>
                    </div>
                  </div>
                  
                  {/* Notes détaillées par critère */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {Object.entries(review.ratings).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{value.display_name}</span>
                          <div className="flex items-center gap-2">
                            {renderStars(value.rating)}
                            <span className="text-sm font-medium text-gray-700">{value.rating}/5</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Commentaire */}
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                  
                  {/* Informations d'achat */}
                  {(review.purchase_date || review.purchase_price || review.store_name || review.has_location) && (
                    <div className="bg-green-50 rounded-xl p-4 mb-4">
                      <h4 className="text-sm font-semibold text-green-800 mb-3 flex items-center">
                        <ShoppingBag size={16} className="mr-2" />
                        Détails de l'achat
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {review.purchase_date && (
                          <div className="flex items-center text-sm">
                            <Calendar size={14} className="text-green-600 mr-2" />
                            <span className="text-green-700">{formatDate(review.purchase_date)}</span>
                          </div>
                        )}
                        
                        {review.purchase_price && (
                          <div className="flex items-center text-sm">
                            <DollarSign size={14} className="text-green-600 mr-2" />
                            <span className="text-green-700">{review.purchase_price} €</span>
                          </div>
                        )}
                        
                        {review.store_name && (
                          <div className="flex items-center text-sm">
                            <ShoppingBag size={14} className="text-green-600 mr-2" />
                            <span className="text-green-700">{review.store_name}</span>
                          </div>
                        )}
                        
                        {review.has_location && review.code_postal && (
                          <div className="flex items-center text-sm">
                            <MapPin size={14} className="text-green-600 mr-2" />
                            <span className="text-green-700">{review.code_postal}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Section Ticket de caisse */}
                  {review.is_verified && (
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Receipt size={20} className="text-purple-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800">Ticket de caisse</h4>
                            <p className="text-xs text-gray-500">
                              {review.authorize_receipt_sharing ? "Visible publiquement" : "Privé"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {/* Toggle partage */}
                          <button
                            onClick={() => handleToggleSharing(review.id, review.authorize_receipt_sharing)}
                            disabled={toggleSharing[review.id]}
                            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                              review.authorize_receipt_sharing 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            {toggleSharing[review.id] ? (
                              <Loader size={12} className="animate-spin mr-1" />
                            ) : review.authorize_receipt_sharing ? (
                              <Eye size={12} className="mr-1" />
                            ) : (
                              <EyeOff size={12} className="mr-1" />
                            )}
                            {review.authorize_receipt_sharing ? "Public" : "Privé"}
                          </button>
                          
                          {/* Bouton voir ticket */}
                          <button
                            onClick={() => toggleReceiptDisplay(review.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-xs font-medium transition-all duration-200"
                          >
                            <Image size={12} className="mr-1" />
                            {expandedReceipt[review.id] ? "Masquer" : "Afficher"}
                          </button>
                        </div>
                      </div>
                      
                      {/* Image du ticket */}
                      {expandedReceipt[review.id] && (
                        <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
                          {loadingReceipt[review.id] ? (
                            <div className="flex justify-center items-center h-64 bg-gray-50">
                              <Loader size={32} className="animate-spin text-purple-400" />
                            </div>
                          ) : receiptImages[review.id] ? (
                            <div className="max-h-96 overflow-auto bg-gray-50">
                              <img 
                                src={receiptImages[review.id]} 
                                alt="Ticket de caisse" 
                                className="w-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-64 bg-gray-50">
                              <Receipt size={48} className="text-gray-300 mb-3" />
                              <p className="text-sm text-gray-500">Impossible de charger le ticket</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Message si aucun résultat après filtrage */}
          {filteredReviews.length === 0 && (searchTerm || filterStatus !== 'all') && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun résultat trouvé</h3>
              <p className="text-gray-600 mb-4">Essayez de modifier vos critères de recherche</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
          
          {/* Call to action en bas */}
          {filteredReviews.length > 0 && (
            <div className="mt-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-8 text-white text-center">
              <Award size={48} className="mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Félicitations pour vos contributions !</h3>
              <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                Vous avez déjà partagé {stats.totalAvis} avis avec la communauté. 
                Continuez à aider les autres consommateurs en partageant vos expériences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/challenges"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
                >
                  <Trophy size={20} className="mr-2" />
                  Participer aux challenges
                </Link>
                <Link
                  to="/top-produits"
                  className="inline-flex items-center justify-center px-6 py-3 bg-purple-700 text-white rounded-xl hover:bg-purple-800 transition-all duration-200 font-semibold"
                >
                  <TrendingUp size={20} className="mr-2" />
                  Découvrir les top produits
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </ProfileLayout>
  );
};

export default UserReviews;