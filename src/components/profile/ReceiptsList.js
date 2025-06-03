// src/components/profile/ReceiptsList.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { getUserReceipts, deleteReceipt, toggleReceiptPublicVisibility } from '../../services/storageService';
import ProfileLayout from './ProfileLayout';
import { 
  Receipt, 
  Calendar, 
  AlertCircle, 
  Trash2, 
  Loader, 
  Image, 
  ShoppingBag, 
  Search, 
  AlertTriangle, 
  DollarSign, 
  Filter, 
  ZoomIn, 
  ClipboardList, 
  MapPin, 
  Eye, 
  EyeOff, 
  Shield,
  Check,
  ChevronDown,
  Upload,
  TrendingUp,
  Clock,
  Store,
  FileText,
  Camera,
  Sparkles,
  Package,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';
import { supabase } from '../../supabaseClient';
import ReceiptZoomViewer from '../Receipt/ReceiptZoomViewer';
import ReceiptDetailModal from '../Receipt/ReceiptDetailModal';

const ReceiptsList = () => {
  const { currentUser, userDetails } = useAuth();
  
  // États pour gérer les tickets et l'interface
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalReceipts, setTotalReceipts] = useState(0);
  const [deletingReceipt, setDeletingReceipt] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [receiptToDelete, setReceiptToDelete] = useState(null);
  const [expandedReceipt, setExpandedReceipt] = useState({});
  const [loadingReviewCheck, setLoadingReviewCheck] = useState({});
  const [receiptReviewStatus, setReceiptReviewStatus] = useState({});
  const [filterMode, setFilterMode] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  
  // États pour la gestion de la visibilité publique
  const [togglePublicVisibility, setTogglePublicVisibility] = useState({});
  
  // États pour les visionneuses
  const [zoomViewerOpen, setZoomViewerOpen] = useState(false);
  const [currentZoomReceipt, setCurrentZoomReceipt] = useState(null);
  
  // Nouveaux états pour la visionneuse détaillée
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentDetailReceipt, setCurrentDetailReceipt] = useState(null);
  const [receiptItems, setReceiptItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Illustration pour les tickets
  const ReceiptsIllustration = () => (
    <svg viewBox="0 0 400 300" className="w-full h-auto">
      <defs>
        <linearGradient id="receiptsGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#81C784', stopOpacity:1}}>
            <animate attributeName="stop-color" values="#81C784;#66BB6A;#81C784" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" style={{stopColor:'#4CAF50', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="receiptsGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#FFD54F', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#FFA726', stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Fond circulaire */}
      <circle cx="200" cy="150" r="120" fill="url(#receiptsGrad1)" opacity="0.1" />
      
      {/* Ticket central */}
      <g transform="translate(200, 150)">
        <rect x="-40" y="-60" width="80" height="120" rx="5" fill="white" stroke="#4CAF50" strokeWidth="2" />
        
        {/* Lignes du ticket */}
        <line x1="-30" y1="-40" x2="30" y2="-40" stroke="#E0E0E0" strokeWidth="1" />
        <line x1="-30" y1="-25" x2="30" y2="-25" stroke="#E0E0E0" strokeWidth="1" />
        <line x1="-30" y1="-10" x2="30" y2="-10" stroke="#E0E0E0" strokeWidth="1" />
        <line x1="-30" y1="5" x2="30" y2="5" stroke="#E0E0E0" strokeWidth="1" />
        <line x1="-30" y1="20" x2="30" y2="20" stroke="#E0E0E0" strokeWidth="1" />
        <line x1="-30" y1="35" x2="30" y2="35" stroke="#E0E0E0" strokeWidth="1" />
        
        {/* Total */}
        <text x="0" y="55" textAnchor="middle" fill="#4CAF50" fontSize="16" fontWeight="bold">TOTAL</text>
        
        {/* Animation de scan */}
        <rect x="-45" y="-65" width="90" height="5" fill="#4CAF50" opacity="0.3">
          <animate attributeName="y" values="-65;65;-65" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
        </rect>
      </g>
      
      {/* Icônes flottantes */}
      <g opacity="0.8">
        {/* Magasin */}
        <g transform="translate(100, 80)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#FF9800" strokeWidth="2" />
          <rect x="-10" y="-5" width="20" height="15" fill="#FF9800" />
          <polygon points="-15,-5 15,-5 10,-15 -10,-15" fill="#FF9800" />
          <animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur="3s" repeatCount="indefinite" />
        </g>
        
        {/* Euro */}
        <g transform="translate(300, 100)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#4CAF50" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#4CAF50" fontSize="20" fontWeight="bold">€</text>
          <animateTransform attributeName="transform" type="rotate" from="0 300 100" to="360 300 100" dur="20s" repeatCount="indefinite" />
        </g>
        
        {/* Check */}
        <g transform="translate(80, 220)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#2196F3" strokeWidth="2" />
          <path d="M-8,-3 L-2,3 L8,-7" stroke="#2196F3" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <animateTransform attributeName="transform" type="translate" values="80,220; 85,215; 80,220" dur="4s" repeatCount="indefinite" />
        </g>
      </g>
    </svg>
  );
  
  // Chargement des tickets de l'utilisateur
  useEffect(() => {
    if (!currentUser || !userDetails) return;
    
    const fetchUserReceipts = async () => {
      setLoading(true);
      
      try {
        const { success, receipts: fetchedReceipts, total, error: fetchError } = 
          await getUserReceipts(userDetails.id, 10, offset);
        
        if (success) {
          setReceipts(prev => offset === 0 ? fetchedReceipts : [...prev, ...fetchedReceipts]);
          setTotalReceipts(total);
          setHasMore(offset + fetchedReceipts.length < total);
          
          // Pour chaque ticket, vérifier s'il est associé à un avis
          fetchedReceipts.forEach(receipt => {
            checkReceiptHasReviews(receipt.id);
          });
        } else {
          setError(fetchError || "Impossible de récupérer vos tickets");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des tickets:", err);
        setError("Une erreur est survenue lors du chargement de vos tickets");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserReceipts();
  }, [currentUser, userDetails, offset]);
  
  // Vérifier si un ticket est associé à un avis
  const checkReceiptHasReviews = async (receiptId) => {
    if (loadingReviewCheck[receiptId] || receiptReviewStatus[receiptId] !== undefined) return;
    
    setLoadingReviewCheck(prev => ({ ...prev, [receiptId]: true }));
    
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('id')
        .eq('receipt_id', receiptId)
        .limit(1);
      
      if (!error) {
        setReceiptReviewStatus(prev => ({ 
          ...prev, 
          [receiptId]: data && data.length > 0 
        }));
      }
    } catch (err) {
      console.error("Erreur lors de la vérification des avis pour le ticket:", err);
    } finally {
      setLoadingReviewCheck(prev => ({ ...prev, [receiptId]: false }));
    }
  };
  
  // Fonction pour basculer la visibilité publique d'un ticket
  const handleTogglePublicVisibility = async (receiptId, currentState) => {
    if (togglePublicVisibility[receiptId]) return;
    
    setTogglePublicVisibility(prev => ({ ...prev, [receiptId]: true }));
    
    try {
      const { success, error: visibilityError } = await toggleReceiptPublicVisibility(receiptId, !currentState);
      
      if (success) {
        setReceipts(prev => prev.map(receipt => 
          receipt.id === receiptId 
            ? { ...receipt, allow_public_display: !currentState }
            : receipt
        ));
      } else {
        console.error("Erreur lors du changement de visibilité:", visibilityError);
        alert("Erreur lors du changement de visibilité du ticket");
      }
    } catch (err) {
      console.error("Erreur lors du changement de visibilité:", err);
      alert("Une erreur est survenue lors du changement de visibilité");
    } finally {
      setTogglePublicVisibility(prev => ({ ...prev, [receiptId]: false }));
    }
  };
  
  // Filtrer les tickets selon le mode sélectionné
  const filteredReceipts = receipts.filter(receipt => {
    // Filtre par statut
    if (filterMode === 'used' && !receiptReviewStatus[receipt.id]) return false;
    if (filterMode === 'unused' && receiptReviewStatus[receipt.id]) return false;
    if (filterMode === 'public' && !receipt.allow_public_display) return false;
    if (filterMode === 'private' && receipt.allow_public_display) return false;
    
    // Filtre par recherche
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        receipt.id.toLowerCase().includes(search) ||
        receipt.enseignes?.nom?.toLowerCase().includes(search) ||
        receipt.enseignes?.code_postal?.includes(search) ||
        (receipt.total_ttc && receipt.total_ttc.toString().includes(search))
      );
    }
    
    return true;
  });

  // Statistiques
  const stats = [
    {
      label: 'Total tickets',
      value: totalReceipts,
      icon: <Receipt size={24} />,
      color: 'green',
      bgColor: 'bg-green-50',
      filterValue: 'all'
    },
    {
      label: 'Avec avis',
      value: Object.values(receiptReviewStatus).filter(status => status).length,
      icon: <FileText size={24} />,
      color: 'blue',
      bgColor: 'bg-blue-50',
      filterValue: 'used'
    },
    {
      label: 'Sans avis',
      value: Object.values(receiptReviewStatus).filter(status => status === false).length,
      icon: <Package size={24} />,
      color: 'orange',
      bgColor: 'bg-orange-50',
      filterValue: 'unused'
    },
    {
      label: 'Publics',
      value: receipts.filter(r => r.allow_public_display).length,
      icon: <Eye size={24} />,
      color: 'purple',
      bgColor: 'bg-purple-50',
      filterValue: 'public'
    }
  ];
  
  // Charger plus de tickets
  const loadMoreReceipts = () => {
    if (hasMore && !loading) {
      setOffset(prev => prev + 10);
    }
  };
  
  // Supprimer un ticket
  const handleDeleteReceipt = async (receipt) => {
    if (!receipt || !receipt.id) return;
    
    if (receiptReviewStatus[receipt.id]) {
      alert("Ce ticket est associé à un ou plusieurs avis et ne peut pas être supprimé.");
      return;
    }
    
    setReceiptToDelete(receipt);
    setShowConfirmModal(true);
  };
  
  // Confirmer la suppression du ticket
  const confirmDeleteReceipt = async () => {
    if (!receiptToDelete) return;
    
    setDeletingReceipt(prev => ({ ...prev, [receiptToDelete.id]: true }));
    
    try {
      const { success, error: deleteError } = await deleteReceipt(receiptToDelete.id, userDetails.id);
      
      if (success) {
        setReceipts(prev => prev.filter(r => r.id !== receiptToDelete.id));
        setTotalReceipts(prev => prev - 1);
      } else {
        alert("Erreur lors de la suppression: " + (deleteError || "Une erreur est survenue"));
      }
    } catch (err) {
      console.error("Erreur lors de la suppression du ticket:", err);
      alert("Erreur lors de la suppression du ticket");
    } finally {
      setDeletingReceipt(prev => ({ ...prev, [receiptToDelete.id]: false }));
      setShowConfirmModal(false);
      setReceiptToDelete(null);
    }
  };
  
  // Annuler la suppression
  const cancelDeleteReceipt = () => {
    setShowConfirmModal(false);
    setReceiptToDelete(null);
  };
  
  // Basculer l'affichage complet d'un ticket
  const toggleReceiptExpand = (receiptId) => {
    setExpandedReceipt(prev => ({
      ...prev,
      [receiptId]: !prev[receiptId]
    }));
  };
  
  // Ouvrir la visionneuse de zoom
  const openZoomViewer = (receipt, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    setCurrentZoomReceipt(receipt);
    setZoomViewerOpen(true);
  };
  
  // Fermer la visionneuse de zoom
  const closeZoomViewer = () => {
    setZoomViewerOpen(false);
    setCurrentZoomReceipt(null);
  };
  
  // Ouvrir la modale de détails
  const openDetailModal = async (receipt, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    setCurrentDetailReceipt(receipt);
    setDetailModalOpen(true);
    
    await loadReceiptItems(receipt.id);
  };
  
  // Fermer la modale de détails
  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setCurrentDetailReceipt(null);
    setReceiptItems([]);
  };
  
  // Charger les articles d'un ticket
  const loadReceiptItems = async (receiptId) => {
    if (!receiptId) return;
    
    setLoadingItems(true);
    
    try {
      const { data, error } = await supabase
        .from('receipt_items')
        .select('*')
        .eq('receipt_id', receiptId)
        .order('ordre', { ascending: true });
        
      if (error) throw error;
      
      setReceiptItems(data || []);
    } catch (err) {
      console.error("Erreur lors du chargement des articles:", err);
    } finally {
      setLoadingItems(false);
    }
  };

  // Placeholder pour tickets vides
  const renderPlaceholder = () => (
    <div className="bg-white p-12 rounded-2xl shadow-lg text-center max-w-2xl mx-auto">
      <ReceiptsIllustration />
      <h3 className="text-2xl font-bold text-gray-800 mb-3 mt-8">Aucun ticket de caisse</h3>
      <p className="text-gray-600 mb-6">
        Uploadez vos tickets de caisse pour valider vos avis et gagner la confiance de la communauté
      </p>
      <Link 
        to="/recherche-filtre" 
        className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-all transform hover:scale-105 shadow-lg"
      >
        <Camera size={20} className="mr-2" />
        Scanner un produit avec ticket
      </Link>
    </div>
  );

  return (
    <ProfileLayout title="">
      <Helmet>
        <title>Mes Tickets | Fydo</title>
        <meta name="description" content="Gérez vos tickets de caisse et preuves d'achat sur Fydo" />
      </Helmet>

      {loading && receipts.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de vos tickets...</p>
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
      ) : receipts.length === 0 ? (
        renderPlaceholder()
      ) : (
        <div>
          {/* Header avec titre et stats */}
          <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-3">
                Mes <span className="text-green-600">Tickets</span>
              </h1>
              <p className="text-base text-green-700">Gérez vos preuves d'achat et avis vérifiés</p>
            </div>
            
            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <button 
                  key={stat.label}
                  onClick={() => setFilterMode(stat.filterValue)}
                  className={`${stat.bgColor} rounded-xl p-4 text-center transition-all duration-500 hover:scale-105 cursor-pointer group relative overflow-hidden ${
                    filterMode === stat.filterValue ? `ring-2 ring-offset-2 shadow-lg scale-105 ${
                      stat.color === 'green' ? 'ring-green-500' :
                      stat.color === 'blue' ? 'ring-blue-500' :
                      stat.color === 'orange' ? 'ring-orange-500' :
                      'ring-purple-500'
                    }` : 'hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Indicateur de sélection */}
                  {filterMode === stat.filterValue && (
                    <div className={`absolute top-0 right-0 text-white px-2 py-1 rounded-bl-lg text-xs font-bold flex items-center ${
                      stat.color === 'green' ? 'bg-green-500' :
                      stat.color === 'blue' ? 'bg-blue-500' :
                      stat.color === 'orange' ? 'bg-orange-500' :
                      'bg-purple-500'
                    }`}>
                      <Check size={12} />
                    </div>
                  )}
                  
                  <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md group-hover:shadow-lg transition-shadow`}>
                    <div className={
                      stat.color === 'green' ? 'text-green-600' :
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'orange' ? 'text-orange-600' :
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
                  placeholder="Rechercher par magasin, montant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setFilterMode('all');
                    setSearchTerm('');
                  }}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    filterMode === 'all' && searchTerm === '' 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                  disabled={filterMode === 'all' && searchTerm === ''}
                >
                  Réinitialiser
                </button>
                
                <Link
                  to="/recherche-filtre"
                  className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 font-medium transition-all"
                >
                  <Upload size={18} className="mr-2" />
                  Ajouter un ticket
                </Link>
              </div>
            </div>
          </div>
          
          {/* Compteur de résultats */}
          {(filterMode !== 'all' || searchTerm) && filteredReceipts.length > 0 && (
            <div className="mb-4 text-center">
              <p className="text-gray-600">
                {filteredReceipts.length} ticket(s) trouvé(s)
              </p>
            </div>
          )}
          
          {/* Liste des tickets */}
          {filteredReceipts.length === 0 ? (
            <div className="bg-gray-50 p-12 rounded-2xl text-center">
              <Receipt size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">
                {searchTerm 
                  ? 'Aucun ticket ne correspond à votre recherche'
                  : filterMode === 'used' ? 'Aucun ticket avec avis'
                  : filterMode === 'unused' ? 'Aucun ticket sans avis'
                  : filterMode === 'public' ? 'Aucun ticket public'
                  : filterMode === 'private' ? 'Aucun ticket privé'
                  : 'Aucun ticket trouvé'
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReceipts.map((receipt, index) => (
                <div 
                  key={receipt.id} 
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 border border-gray-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ animationDelay: `${300 + index * 50}ms` }}
                >
                  {/* En-tête du ticket */}
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex items-center justify-center bg-white text-green-600 rounded-full shadow-md mr-4">
                          <Receipt size={24} strokeWidth={2} />
                        </div>
                        <div>
                          <h3 
                            className="font-bold text-gray-900 cursor-pointer hover:text-green-700 transition-colors text-lg"
                            onClick={(e) => openDetailModal(receipt, e)}
                          >
                            Ticket #{receipt.id.substring(0, 8)}
                          </h3>
                          <div className="text-sm text-gray-600 mt-0.5 flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {formatDate(receipt.upload_date, true)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Badges de statut */}
                      <div className="flex flex-col space-y-2">
                        {loadingReviewCheck[receipt.id] ? (
                          <div className="flex items-center text-gray-500 text-xs bg-gray-50 px-3 py-1.5 rounded-full animate-pulse">
                            <Loader size={12} className="animate-spin mr-1" />
                            Vérification...
                          </div>
                        ) : receiptReviewStatus[receipt.id] ? (
                          <div className="flex items-center text-blue-800 text-xs bg-blue-100 px-3 py-1.5 rounded-full border border-blue-200 font-medium">
                            <Check size={12} className="mr-1" />
                            Avis associé
                          </div>
                        ) : (
                          <div className="flex items-center text-orange-700 text-xs bg-orange-100 px-3 py-1.5 rounded-full border border-orange-200 font-medium">
                            <AlertTriangle size={12} className="mr-1" />
                            Sans avis
                          </div>
                        )}
                        
                        {/* Badge de visibilité publique */}
                        <div className={`flex items-center text-xs px-3 py-1.5 rounded-full border font-medium ${
                          receipt.allow_public_display 
                            ? 'text-purple-800 bg-purple-100 border-purple-200' 
                            : 'text-gray-600 bg-gray-100 border-gray-200'
                        }`}>
                          {receipt.allow_public_display ? (
                            <>
                              <Eye size={12} className="mr-1" />
                              Public
                            </>
                          ) : (
                            <>
                              <EyeOff size={12} className="mr-1" />
                              Privé
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contenu principal */}
                  <div className="p-6">
                    {/* Informations détaillées */}
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      {receipt.receipt_date && (
                        <div className="flex items-start">
                          <Calendar size={18} className="text-gray-400 mt-0.5 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Date du ticket</p>
                            <p className="text-sm font-semibold text-gray-800">{formatDate(receipt.receipt_date)}</p>
                          </div>
                        </div>
                      )}
                      
                      {receipt.total_ttc && (
                        <div className="flex items-start">
                          <CreditCard size={18} className="text-gray-400 mt-0.5 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Montant total</p>
                            <p className="text-sm font-semibold text-gray-800">{receipt.total_ttc.toFixed(2)} €</p>
                          </div>
                        </div>
                      )}
                      
                      {receipt.enseigne_id && (
                        <div className="flex items-start">
                          <Store size={18} className="text-gray-400 mt-0.5 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Magasin</p>
                            <p className="text-sm font-semibold text-gray-800">{receipt.enseignes?.nom || "Non spécifié"}</p>
                          </div>
                        </div>
                      )}
                      
                      {receipt.enseigne_id && (
                        <div className="flex items-start">
                          <MapPin size={18} className="text-gray-400 mt-0.5 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Code postal</p>
                            <p className="text-sm font-semibold text-gray-800">{receipt.enseignes?.code_postal || "Non spécifié"}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Aperçu de l'image du ticket */}
                    <div 
                      className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 mb-5 ${
                        expandedReceipt[receipt.id] ? 'shadow-lg' : 'shadow-sm border border-gray-200'
                      }`}
                      onClick={() => toggleReceiptExpand(receipt.id)}
                    >
                      {receipt.firebase_url ? (
                        <div className="relative group">
                          <div className={`w-full ${expandedReceipt[receipt.id] ? 'max-h-80' : 'h-40'} bg-gradient-to-br from-gray-50 to-gray-100`}>
                            <img 
                              src={receipt.firebase_url} 
                              alt="Ticket de caisse" 
                              className={`w-full h-full object-contain ${expandedReceipt[receipt.id] ? '' : 'p-2'}`}
                            />
                          </div>
                          
                          {/* Boutons flottants sur l'image */}
                          <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md"
                              onClick={(e) => openDetailModal(receipt, e)}
                              title="Voir les articles"
                            >
                              <ClipboardList size={16} />
                            </button>
                            
                            <button 
                              className="p-2 bg-black/70 hover:bg-black/90 text-white rounded-full shadow-md"
                              onClick={(e) => openZoomViewer(receipt, e)}
                              title="Zoom avancé"
                            >
                              <ZoomIn size={16} />
                            </button>
                          </div>
                          
                          {/* Overlay avec indication */}
                          <div className={`absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent ${
                            expandedReceipt[receipt.id] ? 'opacity-0 pointer-events-none' : 'opacity-100'
                          } transition-opacity duration-300`}>
                            <div className="flex justify-center items-center text-white text-sm">
                              <Image size={14} className="mr-1" strokeWidth={2.5} />
                              <span>Cliquez pour {expandedReceipt[receipt.id] ? 'réduire' : 'agrandir'}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-40 bg-gray-100 p-4">
                          <Receipt size={32} className="mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500 text-center">
                            Aperçu du ticket non disponible
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Section Visibilité publique */}
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl mb-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield size={18} className="text-gray-600" />
                          <span className="text-sm font-semibold text-gray-700">Visibilité</span>
                        </div>
                        <button
                          onClick={() => handleTogglePublicVisibility(receipt.id, receipt.allow_public_display)}
                          disabled={togglePublicVisibility[receipt.id]}
                          className={`inline-flex items-center px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                            receipt.allow_public_display 
                              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          } ${togglePublicVisibility[receipt.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {togglePublicVisibility[receipt.id] ? (
                            <Loader size={14} className="animate-spin mr-1" />
                          ) : receipt.allow_public_display ? (
                            <Eye size={14} className="mr-1" />
                          ) : (
                            <EyeOff size={14} className="mr-1" />
                          )}
                          {receipt.allow_public_display ? "Public" : "Privé"}
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        {receipt.allow_public_display 
                          ? "Ce ticket est visible par tous les utilisateurs" 
                          : "Ce ticket n'est visible que par vous"
                        }
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-end space-x-3">
                      {!receiptReviewStatus[receipt.id] && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteReceipt(receipt); }}
                          disabled={deletingReceipt[receipt.id]}
                          className="flex items-center px-4 py-2 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                          {deletingReceipt[receipt.id] ? (
                            <Loader size={16} className="animate-spin mr-2" />
                          ) : (
                            <Trash2 size={16} className="mr-2" />
                          )}
                          Supprimer
                        </button>
                      )}
                      
                      <Link
                        to={`/recherche-filtre?receipt=${receipt.id}`}
                        className="flex items-center px-4 py-2 text-green-700 bg-green-100 border border-green-200 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                      >
                        <ShoppingBag size={16} className="mr-2" />
                        Utiliser pour un avis
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Chargement de plus de résultats */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMoreReceipts}
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
                    Charger plus de tickets
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Modal de confirmation de suppression */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform scale-100 transition-transform">
            <div className="flex items-center mb-6">
              <div className="bg-red-100 rounded-full p-3 mr-4">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirmer la suppression</h3>
            </div>
            <p className="mb-8 text-gray-700">
              Êtes-vous sûr de vouloir supprimer ce ticket de caisse ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDeleteReceipt}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteReceipt}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center font-medium transition-colors"
              >
                {deletingReceipt[receiptToDelete?.id] && (
                  <Loader size={16} className="animate-spin mr-2" />
                )}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Visionneuse de zoom avancé */}
      {currentZoomReceipt && (
        <ReceiptZoomViewer
          imageUrl={currentZoomReceipt.firebase_url}
          isOpen={zoomViewerOpen}
          onClose={closeZoomViewer}
          receiptId={currentZoomReceipt.id}
        />
      )}
      
      {/* Modal des détails du ticket et ses articles */}
      {currentDetailReceipt && (
        <ReceiptDetailModal 
          isOpen={detailModalOpen}
          onClose={closeDetailModal}
          receipt={currentDetailReceipt}
          initialItems={receiptItems}
        />
      )}
    </ProfileLayout>
  );
};

export default ReceiptsList;