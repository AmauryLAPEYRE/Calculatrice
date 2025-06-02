// test git securisé
// src/components/paiement/SubscriptionHistory.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Search,
  Camera,
  Eye,
  ChevronDown,
  ChevronUp,
  Gift,
  DollarSign,
  Loader,
  Ban
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getSubscriptionHistory, cancelSubscription as cancelSubscriptionAPI } from '../../services/subscriptionService';
import { cancelSubscription as cancelStripeSubscription } from '../../services/stripeService';
import { formatDate, formatPrice } from '../../utils/formatters';
import ProfileLayout from '../profile/ProfileLayout';

const SubscriptionHistory = () => {
  const { currentUser, userDetails } = useAuth();
  const navigate = useNavigate();
  
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  // États pour gérer l'annulation d'abonnement
  const [cancelingSubscriptionId, setCancelingSubscriptionId] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  const fetchSubscriptionHistory = async () => {
    try {
      setLoading(true);
      
      if (!userDetails || !userDetails.id) {
        throw new Error("Données utilisateur non disponibles");
      }
      
      const historyData = await getSubscriptionHistory(userDetails.id);
      setHistory(historyData);
      // Initialiser avec tous les éléments fermés, sans exception
    setExpandedItems({});
      // Initialiser avec tous les éléments fermés
      //const expandMap = {};
      
      // Trouver les abonnements actifs
      //const now = new Date();
      //const activeSubscriptions = historyData.filter(sub => 
       // sub.is_active && new Date(sub.end_date) > now
      //);
      
      // N'ouvrir que les abonnements actifs (s'il y en a)
      //if (activeSubscriptions.length > 0) {
       // activeSubscriptions.forEach(sub => {
        //  expandMap[sub.id] = true;
        //});
      //}
      
      //setExpandedItems(expandMap);
    } catch (err) {
      console.error("Erreur lors de la récupération de l'historique:", err.message);
      setError("Impossible de charger l'historique des abonnements. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && userDetails) {
      fetchSubscriptionHistory();
    }
  }, [currentUser, userDetails]);

  // Fonction pour basculer l'état d'expansion d'un élément
  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Fonction pour gérer l'annulation d'un abonnement
  const handleCancelSubscription = (subscription) => {
    // Afficher la confirmation
    setCancelingSubscriptionId(subscription.id);
    setShowCancelConfirm(true);
  };

  // Fonction pour confirmer l'annulation
  const confirmCancelSubscription = async () => {
    if (!cancelingSubscriptionId) return;
    
    setCancelLoading(true);
    setCancelError(null);
    
    try {
      // Récupérer l'abonnement
      const subscription = history.find(sub => sub.id === cancelingSubscriptionId);
      
      // Si c'est un abonnement Stripe
      if (subscription.stripe_subscription_id) {
        const result = await cancelStripeSubscription(
          subscription.stripe_subscription_id,
          currentUser.uid,
          true // Annuler à la fin de la période en cours
        );
        
        if (!result.success) {
          throw new Error(result.error || "Erreur lors de l'annulation de l'abonnement");
        }
      } else {
        // Sinon, utiliser l'API locale d'annulation
        const result = await cancelSubscriptionAPI(cancelingSubscriptionId, userDetails.id);
        
        if (!result.success) {
          throw new Error(result.error || "Erreur lors de l'annulation de l'abonnement");
        }
      }
      
      // Mettre à jour l'interface
      setCancelSuccess(true);
      
      // Rafraîchir la liste après une courte pause
      setTimeout(() => {
        fetchSubscriptionHistory();
        setCancelSuccess(false);
        setShowCancelConfirm(false);
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      setCancelError(error.message);
    } finally {
      setCancelLoading(false);
    }
  };

  // Fonction pour fermer la confirmation
  const closeCancelConfirm = () => {
    setShowCancelConfirm(false);
    setCancelingSubscriptionId(null);
    setCancelError(null);
  };

  // Fonction pour afficher le statut de l'abonnement
  const renderStatus = (subscription) => {
    const now = new Date();
    const endDate = new Date(subscription.end_date);
    
    // Si l'abonnement a été annulé par l'utilisateur mais est encore actif jusqu'à la fin de la période
    if (subscription.cancellation_date && subscription.is_active && now <= endDate) {
      return (
        <span className="flex items-center text-orange-600 status-badge">
          <Ban className="h-4 w-4 mr-1" />
          Annulé par l'utilisateur.
        </span>
      );
    } else if (subscription.is_active && now <= endDate) {
      return (
        <span className="flex items-center text-green-600 status-badge status-active">
          <CheckCircle className="h-4 w-4 mr-1" />
          Actif
        </span>
      );
    } else if (subscription.is_active && now > endDate) {
      return (
        <span className="flex items-center text-orange-600 status-badge">
          <AlertTriangle className="h-4 w-4 mr-1" />
          Expiré
        </span>
      );
    } else {
      return (
        <span className="flex items-center text-gray-600 status-badge">
          <XCircle className="h-4 w-4 mr-1" />
          Inactif
        </span>
      );
    }
  };

  // Fonction pour afficher le statut du paiement
  const renderPaymentStatus = (status, method) => {
    if (method === 'offert') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 status-badge">
          <Gift size={12} className="mr-1" />
          Offert
        </span>
      );
    }
    
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 status-badge">
            <DollarSign size={12} className="mr-1" />
            Payé
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 status-badge">
            En attente
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 status-badge">
            Échec
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 status-badge">
            {status}
          </span>
        );
    }
  };

  // Fonction pour déterminer la couleur de la bordure en fonction du type d'abonnement
  const getBorderColorClass = (subscription, isActive) => {
    if (!isActive) return '';
    
    // Si l'abonnement est annulé mais encore actif, utiliser une bordure orange
    if (subscription.cancellation_date) {
      return 'border-l-4 border-orange-500';
    } else if (subscription.payment_method === 'offert' ) {
      return 'border-l-4 border-purple-500';
    } else {
      return 'border-l-4 border-green-500';
    }
  };

  // Fonction pour afficher une caractéristique avec valeur
  const renderFeatureWithValue = (label, value, icon = null, isOffered = false) => {
    const displayValue = typeof value === 'number' && value >= 9000 ? 'Illimité' : value;
    const textColor = isOffered ? 'text-purple-600' : 'text-green-600';
    
    return (
      <div className="flex items-center py-1">
        {icon || <CheckCircle className={`h-4 w-4 ${isOffered ? 'text-purple-500' : 'text-green-500'} mr-2 flex-shrink-0`} />}
        <span className="text-gray-700 text-sm">
          {label}: <span className={`font-medium ${textColor}`}>{displayValue}</span>
        </span>
      </div>
    );
  };

  // Rendre les informations de renouvellement automatique et d'annulation
  const renderAutoRenewal = (subscription) => {
    if (subscription.payment_method === 'offert') {
      return (
        <div className="flex items-center text-sm text-gray-500">
          <span>Renouvellement automatique: </span>
          <span className="ml-1 text-gray-500">Non applicable</span>
        </div>
      );
    } else if (subscription.cancellation_date) {
      return (
        <div className="space-y-2">
          <div className="flex items-center text-sm text-orange-600">
            <Ban size={16} className="mr-2 text-orange-600" />
            <span>Abonnement annulé par l'utilisateur</span>
          </div>
          <div className="text-sm text-gray-600 ml-6">
            Date d'annulation: <span className="font-medium">{formatDate(subscription.cancellation_date)}</span>
          </div>
          <div className="text-sm text-gray-600 ml-6">
            Fin de service le: <span className="font-medium">{formatDate(subscription.end_date)}</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-sm text-gray-600">
          <div className={subscription.is_auto_renew ? 'text-green-600' : 'text-gray-600'}>
            {subscription.is_auto_renew 
              ? 'Renouvellement automatique activé' 
              : 'Sans renouvellement automatique'}
          </div>
        </div>
      );
    }
  };

  // Fonction pour afficher le prix selon le type d'abonnement
  const renderPrice = (subscription) => {
    // Vérifier si l'abonnement est actif
    const now = new Date();
    const endDate = new Date(subscription.end_date);
    const isActive = subscription.is_active && now <= endDate;
    
    if (subscription.payment_method === 'offert') {
      return (
        <div className="text-2xl font-bold text-purple-700 subscription-price price-highlight">
          <span className="line-through text-purple-400">{formatPrice(subscription.price || (
            subscription.subscription_plans?.price_monthly || 0
          ))}</span>
          <span className="ml-2 text-sm font-normal">Offert</span>
        </div>
      );
    } else if (subscription.cancellation_date) {
      // Pour les abonnements annulés, afficher le prix différemment
      return (
        <div className="text-2xl font-bold text-orange-600 subscription-price price-highlight">
          {formatPrice(subscription.price || (
            subscription.subscription_plans?.price_monthly || 0
          ))}
        </div>
      );
    } else {
      return (
        <div className="text-2xl font-bold text-green-700 subscription-price price-highlight">
          {formatPrice(subscription.price || (
            subscription.subscription_plans?.price_monthly || 0
          ))}
        </div>
      );
    }
  };

  // Fonction pour déterminer l'icône à utiliser
  const getSubscriptionIcon = (subscription) => {
    if (subscription.payment_method === 'offert') {
      return <Gift className="mr-1.5 h-4 w-4 text-purple-500" />;
    } else if (subscription.cancellation_date) {
      return <Ban className="mr-1.5 h-4 w-4 text-orange-500" />;
    } else {
      return <CreditCard className="mr-1.5 h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <ProfileLayout title="Historique de vos abonnements">
      {/* Modal de confirmation d'annulation */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmer l'annulation</h3>
            
            {!cancelSuccess ? (
              <>
                <p className="text-gray-600 mb-6">
                  Êtes-vous sûr de vouloir annuler cet abonnement ? 
                  Vous pourrez continuer à utiliser les services jusqu'à la fin de la période en cours.
                </p>
                
                {cancelError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                    {cancelError}
                  </div>
                )}
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeCancelConfirm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={cancelLoading}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmCancelSubscription}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    disabled={cancelLoading}
                  >
                    {cancelLoading ? (
                      <span className="flex items-center">
                        <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                        Traitement...
                      </span>
                    ) : (
                      "Confirmer l'annulation"
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <p className="text-green-700 font-medium mb-4">
                  Votre abonnement a été annulé avec succès
                </p>
                <button
                  onClick={closeCancelConfirm}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-red-800">Une erreur est survenue</h3>
          <p className="mt-2 text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center subscription-fade-in">
          <div className="flex justify-center mb-4">
            <Clock className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun historique d'abonnement</h3>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas encore souscrit à un abonnement ou votre historique est vide.
          </p>
          <button
            onClick={() => navigate('/abonnements')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 subscription-action"
          >
            Découvrir nos abonnements
          </button>
        </div>
      ) : (
        <div className="subscription-fade-in">
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            {history.map((subscription, index) => {
              const isOffered = subscription.payment_method === 'offert';
              const isCancelled = !!subscription.cancellation_date;
              
              // Définir les classes CSS en fonction du statut de l'abonnement
              const bgHoverClass = isOffered ? 'hover:bg-purple-50' : 
                                  isCancelled ? 'hover:bg-orange-50' : 'hover:bg-gray-50';
              
              const headerBgClass = isOffered ? 'bg-purple-50' : 
                                   isCancelled ? 'bg-orange-50' : 'bg-white';
              
              const detailsBgClass = isOffered ? 'bg-purple-50' : 
                                    isCancelled ? 'bg-orange-50' : 'bg-gray-50';
              
              // Vérifier si l'abonnement est actif
              const now = new Date();
              const endDate = new Date(subscription.end_date);
              const isActive = subscription.is_active && now <= endDate;
              
              // Appliquer un style spécial pour les abonnements actifs
              let activeCardClass = 'opacity-80';
              if (isActive) {
                if (isCancelled) {
                  activeCardClass = 'shadow-md ring-2 ring-orange-400';
                } else if (isOffered) {
                  activeCardClass = 'shadow-md ring-2 ring-purple-400';
                } else {
                  activeCardClass = 'shadow-md ring-2 ring-green-400';
                }
              }
              
              return (
                <li key={subscription.id} className={`bg-white subscription-card ${getBorderColorClass(subscription, isActive)} ${activeCardClass} ${index > 0 ? 'mt-4' : ''}`}>
                  {/* En-tête toujours visible avec prix mis en évidence */}
                  <div 
                    className={`p-4 ${bgHoverClass} cursor-pointer ${headerBgClass} ${isActive ? 'font-medium' : ''}`}
                    onClick={() => toggleExpand(subscription.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Partie supérieure avec nom du plan et badge de statut */}
                        <div className="flex items-center mb-1">
                          <h4 className={`text-lg font-semibold ${isActive ? 'text-gray-900' : 'text-gray-700'} mr-2`}>
                            {subscription.subscription_plans?.name || 'Plan inconnu'}
                          </h4>
                          {renderStatus(subscription)}
                          <div className="ml-auto sm:hidden">
                            {expandedItems[subscription.id] ? 
                              <ChevronUp size={18} className="chevron-toggle expanded" /> : 
                              <ChevronDown size={18} className="chevron-toggle" />
                            }
                          </div>
                        </div>
                        
                        {/* Description courte du plan */}
                        <p className={`text-sm ${isActive ? 'text-gray-600' : 'text-gray-500'} mb-2 pr-6 truncate-2-lines`}>
                          {subscription.subscription_plans?.description || 'Description non disponible'}
                        </p>
                        
                        {/* Période d'abonnement, visible même sans expansion */}
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                          <span className="truncate">
                            Du {formatDate(subscription.start_date)} au {formatDate(subscription.end_date)}
                          </span>
                        </div>
                        
                        {/* Type d'abonnement et statut d'annulation */}
                        <div className="flex items-center text-sm mt-1">
                          {getSubscriptionIcon(subscription)}
                          {renderPaymentStatus(subscription.payment_status, subscription.payment_method)}
                          
                          {/* Badge "actif" si l'abonnement est en cours */}
                          {isActive && !isCancelled && (
                            <span className={`ml-3 px-2 py-0.5 rounded text-xs font-medium ${
                              isOffered ? 'bg-purple-200 text-purple-800' : 'bg-green-200 text-green-800'
                            }`}>
                              Abonnement en cours
                            </span>
                          )}
                          
                          {/* Badge "annulé" si l'abonnement est annulé mais encore actif */}
                          {isActive && isCancelled && (
                            <span className="ml-3 px-2 py-0.5 rounded text-xs font-medium bg-orange-200 text-orange-800">
                              Abonnement annulé le {formatDate(subscription.cancellation_date)} – reste actif jusqu’au {formatDate(subscription.end_date)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Prix mis en évidence à droite */}
                      <div className="mt-3 sm:mt-0 sm:ml-6 flex flex-row sm:flex-col items-center sm:items-end justify-between">
                        {renderPrice(subscription)}
                        <div className="hidden sm:flex">
                          {expandedItems[subscription.id] ? 
                            <ChevronUp size={18} className="chevron-toggle expanded" /> : 
                            <ChevronDown size={18} className="chevron-toggle" />
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Partie dépliable avec les détails */}
                  {expandedItems[subscription.id] && (
                    <div className={`px-4 pb-4 ${detailsBgClass} border-t border-gray-100 subscription-details`}>
                      {/* Caractéristiques du plan */}
                      <div className="mt-3 p-3 bg-white rounded-md shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 subscription-info-grid">
                        {subscription.subscription_plans?.max_scan_auto && (
                          renderFeatureWithValue(
                            "Scans par jour", 
                            subscription.subscription_plans.max_scan_auto,
                            <Camera className={`h-4 w-4 ${isOffered ? 'text-purple-500' : 'text-green-500'} mr-2 flex-shrink-0`} />,
                            isOffered
                          )
                        )}
                        
                        {subscription.subscription_plans?.max_scan_manuel && (
                          renderFeatureWithValue(
                            "Scans manuels par jour", 
                            subscription.subscription_plans.max_scan_manuel,
                            <Camera className={`h-4 w-4 ${isOffered ? 'text-purple-500' : 'text-green-500'} mr-2 flex-shrink-0`} />,
                            isOffered
                          )
                        )}
                        
                        {subscription.subscription_plans?.max_recherche && (
                          renderFeatureWithValue(
                            "Recherches par jour", 
                            subscription.subscription_plans.max_recherche,
                            <Search className={`h-4 w-4 ${isOffered ? 'text-purple-500' : 'text-green-500'} mr-2 flex-shrink-0`} />,
                            isOffered
                          )
                        )}
                        
                        {subscription.subscription_plans?.max_consult_avis && (
                          renderFeatureWithValue(
                            "Consultation avis par jour", 
                            subscription.subscription_plans.max_consult_avis,
                            <Eye className={`h-4 w-4 ${isOffered ? 'text-purple-500' : 'text-green-500'} mr-2 flex-shrink-0`} />,
                            isOffered
                          )
                        )}
                      </div>
                      
                      {/* Informations de paiement et d'annulation */}
                      <div className="mt-3 p-3 bg-white rounded-md shadow-sm">
                        <h5 className="font-medium text-gray-700 mb-2 subscription-header">Informations de paiement</h5>
                        <div className="grid grid-cols-1 gap-2 mt-3">
                          {renderAutoRenewal(subscription)}
                        </div>
                      </div>

                      {/* Bouton d'annulation pour les abonnements actifs avec renouvellement automatique qui ne sont pas déjà annulés */}
                      {isActive && subscription.is_auto_renew && !subscription.cancellation_date && (
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelSubscription(subscription);
                            }}
                            className="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
                          >
                            Annuler l'abonnement
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          
          <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
            <p>
              Pour toute question concernant vos abonnements, veuillez contacter notre service client à <a href="mailto:support@fydo.app" className="text-green-600 hover:text-green-800">support@fydo.app</a>
            </p>
          </div>
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate('/abonnements')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition subscription-action"
            >
              Voir les abonnements disponibles
            </button>
          </div>
        </div>
      )}
    </ProfileLayout>
  );
};

export default SubscriptionHistory;