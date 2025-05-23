// src/pages/SubscriptionPayment.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabaseClient';
import StripePaymentForm from './StripePaymentForm';
import { createSubscription } from '../../services/stripeService';

// Chargez votre clé publique Stripe
const stripePromise = loadStripe('pk_test_51RQ8qgHBShqqZjDbEh0dfmlmTKBhymPdE2ntDyr6OComoIAWRIoEv57ypqZf5rMk2hUxQmRrCqHXC55PW6KZ8XYw00jeGd6WjE');

const SubscriptionPayment = () => {
  const { planId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userDetails, refreshUserDetails } = useAuth();
  
  // État pour le cycle de facturation - valeur standard ('monthly' ou 'yearly')
  const [billingCycle, setBillingCycle] = useState(location.state?.billingCycle || 'monthly');
  
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [requiresAction, setRequiresAction] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  // Pour calculer le prix en fonction du cycle de facturation
  const currentPrice = billingCycle === 'monthly' ? 
    (plan?.price_monthly || 0) : 
    (plan?.price_yearly || 0);

  useEffect(() => {
    // Rediriger vers la connexion si non connecté
    if (!currentUser) {
      navigate('/login', { state: { redirectTo: `/subscribe/${planId}` } });
      return;
    }

    const fetchPlanDetails = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('id', planId)
          .single();
        
        if (error) throw error;
        
        setPlan(data);
      } catch (err) {
        console.error('Erreur lors du chargement du plan:', err.message);
        setError("Impossible de charger les détails de l'abonnement. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, [planId, currentUser, navigate]);

  const handlePaymentMethodSubmit = async (paymentMethodId, paymentMethodTypes = ['card']) => {
    try {
      setProcessing(true);
      setError(null);

      // Création de l'abonnement Stripe avec le cycle de facturation standardisé
      const result = await createSubscription(
        paymentMethodId, 
        planId, 
        currentUser.uid, 
        billingCycle, // Passer directement 'monthly' ou 'yearly'
        paymentMethodTypes 
      );

      if (!result.success) {
        throw new Error(result.error || "Erreur lors de la création de l'abonnement");
      }

      // Redirection vers Stripe pour le paiement
      if (result.redirectUrl) {
        try {
          const response = await fetch(result.redirectUrl);
          
          if (!response.ok) {
            throw new Error(`Erreur lors de l'appel à la fonction edge: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.url) {
            // Sauvegarder l'ID de l'intention en session storage pour le récupérer après le retour
            sessionStorage.setItem('current_subscription_intent', result.intentId);
            window.location.href = data.url;
            return;
          } else {
            throw new Error("L'URL de paiement Stripe est manquante dans la réponse");
          }
        } catch (err) {
          console.error("Erreur lors de la redirection vers Stripe:", err);
          setError("Impossible de rediriger vers la page de paiement. Veuillez réessayer.");
          setProcessing(false);
        }
        return;
      }

      // Ce point ne devrait pas être atteint car nous utilisons toujours la redirection
      // mais gardons-le comme fallback
      setPaymentSuccess(true);
      setProcessing(false);
      
      // Rafraîchir les détails utilisateur pour afficher le nouvel abonnement
      await refreshUserDetails();
      
    } catch (err) {
      console.error("Erreur lors du traitement du paiement:", err);
      setError(err.message || "Une erreur est survenue lors du traitement du paiement.");
      setProcessing(false);
    }
  };

  // Fonction pour afficher une caractéristique avec une valeur
  const renderFeatureWithValue = (label, value) => (
    <li className="flex items-start">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span>
        {label}: <span className="font-bold text-green-600">{value}</span>
      </span>
    </li>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error && !paymentSuccess) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto max-w-4xl my-8" role="alert">
        <p>{error}</p>
        <button 
          onClick={() => navigate('/abonnements')}
          className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Retour aux abonnements
        </button>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Paiement réussi!</h2>
          <p className="mt-2 text-gray-600">
            Merci pour votre abonnement à notre offre {plan.name}. Votre abonnement est maintenant actif.
          </p>
          <p className="mt-2 text-blue-700">
            Vous serez facturé {billingCycle === 'monthly' ? 'chaque mois' : 'chaque année'}.
          </p>
          <div className="mt-6">
            <button 
              onClick={() => navigate('/profile')}
              className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700"
            >
              Accéder à mon profil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-12 p-4 md:p-0">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/abonnements')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft size={20} /> 
          Retour aux abonnements
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Résumé de la commande */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Résumé de votre abonnement</h2>
          
          <div className="border-t border-b border-gray-200 py-4 my-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Plan</span>
              <span className="font-bold text-green-600">{plan?.name}</span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="font-medium">Type d'abonnement</span>
              <span className="font-medium">
                {billingCycle === 'monthly' ? "Mensuel" : "Annuel"}
              </span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="font-medium">Prix</span>
              <span className="font-bold">
                {billingCycle === 'monthly' 
                  ? `${plan?.price_monthly.toFixed(2)}€ /mois` 
                  : `${plan?.price_yearly.toFixed(2)}€ /an`}
              </span>
            </div>
            
            {billingCycle === 'yearly' && (
              <div className="mt-2 bg-blue-50 p-2 rounded text-sm text-blue-700">
                Économisez {Math.round(((plan?.price_monthly * 12) - plan?.price_yearly) / (plan?.price_monthly * 12) * 100)}% par rapport à l'abonnement mensuel!
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <h3 className="font-bold text-lg mb-2">Ce qui est inclus:</h3>
            <ul className="space-y-2">
              {renderFeatureWithValue(
                "Scans par jour", 
                plan?.max_scan_auto >= 9000 ? 'Illimité' : plan?.max_scan_auto
              )}
              
              {renderFeatureWithValue(
                "Scans manuels par jour", 
                plan?.max_scan_manuel >= 9000 ? 'Illimité' : plan?.max_scan_manuel
              )}
              
              {renderFeatureWithValue(
                "Recherches produit par jour", 
                plan?.max_recherche >= 9000 ? 'Illimité' : plan?.max_recherche
              )}

              {renderFeatureWithValue(
                "Consultation avis par jour", 
                plan?.max_consult_avis >= 9000 ? 'Illimité' : plan?.max_consult_avis
              )}
              
              {/* Fonctionnalités supplémentaires */}
              {plan?.features && Object.entries(plan.features)
                .filter(([_, included]) => included)
                .map(([feature, _]) => (
                <li key={feature} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Formulaire de paiement Stripe */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Paiement sécurisé</h2>
          
          {/* Type de facturation */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Type de facturation</label>
            <div className="bg-gray-100 p-1 rounded-full flex mb-4">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`flex-1 py-2 px-4 rounded-full transition ${
                  billingCycle === 'monthly' 
                    ? 'bg-white shadow-sm text-green-700' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`flex-1 py-2 px-4 rounded-full transition ${
                  billingCycle === 'yearly' 
                    ? 'bg-white shadow-sm text-green-700' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Annuel
              </button>
            </div>
            
            {billingCycle === 'yearly' && (
              <div className="p-3 bg-green-50 rounded-md text-sm text-green-700 mb-4">
                <p className="font-medium">Économisez avec l'abonnement annuel!</p>
                <p>Payez {plan?.price_yearly.toFixed(2)}€ par an au lieu de {(plan?.price_monthly * 12).toFixed(2)}€.</p>
              </div>
            )}
          </div>
          
          {/* Formulaire de paiement Stripe */}
          <Elements stripe={stripePromise}>
            <StripePaymentForm
              onSubmit={handlePaymentMethodSubmit}
              processing={processing}
              error={error}
              plan={plan}
              billingCycle={billingCycle}
              currentPrice={currentPrice}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPayment;