// src/components/paiement/StripePaymentForm.js
import React, { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { AlertCircle, Lock, CreditCard, Smartphone, Wallet } from 'lucide-react';

const StripePaymentForm = ({ onSubmit, processing, error, plan, billingCycle, isAnnualCommitment }) => {
  const stripe = useStripe();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [paymentMethodsAvailable, setPaymentMethodsAvailable] = useState({
    card: true,
    applePay: false,
    googlePay: false,
    paypal: true // PayPal est généralement toujours disponible
  });

  // Vérifier quelles méthodes de paiement sont disponibles dans le navigateur
  useEffect(() => {
    if (!stripe) return;

    // DEBUG: Afficher les informations de l'environnement
    console.log('🔍 Diagnostic des méthodes de paiement:');
    console.log('- Protocol:', window.location.protocol);
    console.log('- ApplePaySession exists:', !!window.ApplePaySession);
    console.log('- ApplePaySession.canMakePayments:', window.ApplePaySession?.canMakePayments?.());
    console.log('- PaymentRequest exists:', !!window.PaymentRequest);
    console.log('- User Agent:', navigator.userAgent.substring(0, 100) + '...');

    // Vérifier Apple Pay - nécessite HTTPS et appareil Apple
    const canUseApplePay = window.ApplePaySession && 
                          window.ApplePaySession.canMakePayments() &&
                          window.location.protocol === 'https:';
    
    // Vérifier Google Pay - REVENIR À LA MÉTHODE MOINS STRICTE
    // Stripe Checkout gère lui-même la vérification HTTPS
    const canUseGooglePay = !!window.PaymentRequest;
    
    console.log('✅ Résultats de détection:');
    console.log('- Apple Pay disponible:', canUseApplePay);
    console.log('- Google Pay disponible:', canUseGooglePay);
    
    setPaymentMethodsAvailable(prev => ({
      ...prev, 
      applePay: canUseApplePay,
      googlePay: canUseGooglePay
    }));
    
  }, [stripe]);

  // Soumettre le formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe) {
      return;
    }

    // Déterminer les méthodes de paiement à autoriser dans Stripe Checkout
    let paymentMethodTypes = ['card']; // Toujours inclure 'card'
    
    // Stripe Checkout peut gérer automatiquement toutes les méthodes de paiement
    // Si on veut laisser Stripe décider automatiquement :
    if (selectedPaymentMethod === 'auto') {
      paymentMethodTypes = ['card', 'apple_pay', 'google_pay', 'paypal'];
    } 
    // Ou si on veut forcer une méthode spécifique :
    else if (selectedPaymentMethod === 'applePay') {
      paymentMethodTypes = ['apple_pay', 'card']; // Card comme fallback
    } 
    else if (selectedPaymentMethod === 'googlePay') {
      paymentMethodTypes = ['google_pay', 'card']; // Card comme fallback
    }
    else if (selectedPaymentMethod === 'paypal') {
      paymentMethodTypes = ['paypal', 'card']; // Card comme fallback
    }
    
    // Appeler la méthode onSubmit avec les types de paiement acceptés
    onSubmit(null, paymentMethodTypes);
  };

  // Calculer le prix à afficher
  const displayPrice = billingCycle === 'monthly' 
    ? plan?.price_monthly.toFixed(2) 
    : plan?.price_yearly.toFixed(2);

  return (
    <form onSubmit={handleSubmit}>
      {/* Message concernant la sécurité */}
      <div className="mb-6 flex items-center bg-gray-50 p-3 rounded-md">
        <Lock size={18} className="text-gray-600 mr-2" />
        <p className="text-sm text-gray-600">
          Vos informations de paiement sont sécurisées par Stripe. Nous ne stockons jamais vos données de carte bancaire.
        </p>
      </div>

      {/* Sélection de la méthode de paiement */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Méthode de paiement
        </label>
        
        {/* Option automatique recommandée */}
        <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
          <button
            type="button"
            onClick={() => setSelectedPaymentMethod('auto')}
            className={`w-full flex items-center justify-between p-3 border rounded-md ${
              selectedPaymentMethod === 'auto' ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center">
              <Wallet className={`mr-3 ${selectedPaymentMethod === 'auto' ? 'text-blue-600' : 'text-gray-600'}`} />
              <div className="text-left">
                <span className={`font-medium ${selectedPaymentMethod === 'auto' ? 'text-blue-700' : 'text-gray-700'}`}>
                  Toutes les méthodes disponibles
                </span>
                <p className="text-xs text-gray-500">Recommandé - Stripe affichera automatiquement toutes vos options</p>
              </div>
            </div>
            {selectedPaymentMethod === 'auto' && (
              <div className="text-blue-600 text-sm font-medium">✓</div>
            )}
          </button>
        </div>

        {/* Options spécifiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setSelectedPaymentMethod('card')}
            className={`flex flex-col items-center justify-center p-4 border rounded-md ${
              selectedPaymentMethod === 'card' ? 'border-green-500 bg-green-50' : 'border-gray-300'
            }`}
          >
            <CreditCard className={`mb-2 ${selectedPaymentMethod === 'card' ? 'text-green-600' : 'text-gray-600'}`} />
            <span className={`text-sm ${selectedPaymentMethod === 'card' ? 'text-green-700' : 'text-gray-700'}`}>
              Carte bancaire
            </span>
          </button>
          
          <button
            type="button"
            onClick={() => setSelectedPaymentMethod('applePay')}
            className={`flex flex-col items-center justify-center p-4 border rounded-md ${
              !paymentMethodsAvailable.applePay ? 'opacity-50 cursor-not-allowed' : 
              selectedPaymentMethod === 'applePay' ? 'border-green-500 bg-green-50' : 'border-gray-300'
            }`}
            disabled={!paymentMethodsAvailable.applePay}
          >
            <div className="mb-2 text-2xl">🍎</div>
            <span className={`text-sm ${selectedPaymentMethod === 'applePay' ? 'text-green-700' : 'text-gray-700'}`}>
              Apple Pay
            </span>
            {!paymentMethodsAvailable.applePay && (
              <span className="text-xs text-red-500">Non disponible</span>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => setSelectedPaymentMethod('googlePay')}
            className={`flex flex-col items-center justify-center p-4 border rounded-md ${
              !paymentMethodsAvailable.googlePay ? 'opacity-50 cursor-not-allowed' : 
              selectedPaymentMethod === 'googlePay' ? 'border-green-500 bg-green-50' : 'border-gray-300'
            }`}
            disabled={!paymentMethodsAvailable.googlePay}
          >
            <div className="mb-2 text-2xl">🌐</div>
            <span className={`text-sm ${selectedPaymentMethod === 'googlePay' ? 'text-green-700' : 'text-gray-700'}`}>
              Google Pay
            </span>
            {!paymentMethodsAvailable.googlePay && (
              <span className="text-xs text-red-500">Non disponible</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSelectedPaymentMethod('paypal')}
            className={`flex flex-col items-center justify-center p-4 border rounded-md ${
              selectedPaymentMethod === 'paypal' ? 'border-green-500 bg-green-50' : 'border-gray-300'
            }`}
          >
            <div className="mb-2 text-2xl">💳</div>
            <span className={`text-sm ${selectedPaymentMethod === 'paypal' ? 'text-green-700' : 'text-gray-700'}`}>
              PayPal
            </span>
          </button>
        </div>
      </div>

      {/* Message pour informer l'utilisateur du processus */}
      <div className="mb-6 p-4 bg-blue-50 rounded-md">
        <p className="text-blue-700">
          {selectedPaymentMethod === 'auto' 
            ? "Vous serez redirigé vers une page sécurisée où toutes vos options de paiement disponibles seront affichées."
            : selectedPaymentMethod === 'applePay' 
            ? "Vous serez redirigé vers une page sécurisée pour finaliser votre paiement avec Apple Pay."
            : selectedPaymentMethod === 'googlePay'
            ? "Vous serez redirigé vers une page sécurisée pour finaliser votre paiement avec Google Pay."
            : selectedPaymentMethod === 'paypal'
            ? "Vous serez redirigé vers PayPal pour finaliser votre paiement."
            : "Vous serez redirigé vers une page sécurisée pour saisir vos informations de carte."}
        </p>
      </div>

      {/* Erreurs générales */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
          <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Résumé du montant */}
      <div className="mb-6 p-4 bg-green-50 rounded-md">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total à payer :</span>
          <span className="text-xl font-bold text-green-700">
            {`${displayPrice}€ ${billingCycle === 'monthly' ? '/mois' : '/an'}`}
          </span>
        </div>
        {isAnnualCommitment && (
          <p className="text-sm text-green-600 mt-1">
            Abonnement mensuel avec engagement de 12 mois
          </p>
        )}
      </div>

      {/* Bouton de soumission */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-3 px-4 bg-green-600 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
          (!stripe || processing) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
        }`}
      >
        {processing ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Traitement en cours...
          </div>
        ) : (
          `Continuer le paiement${
            selectedPaymentMethod === 'auto' ? '' :
            selectedPaymentMethod === 'applePay' ? ' avec Apple Pay' :
            selectedPaymentMethod === 'googlePay' ? ' avec Google Pay' :
            selectedPaymentMethod === 'paypal' ? ' avec PayPal' :
            ' avec Carte bancaire'
          }`
        )}
      </button>

      {/* Mentions légales */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        En cliquant sur "Continuer", vous acceptez nos conditions générales et notre politique de confidentialité.
        Votre abonnement {isAnnualCommitment ? 'comporte un engagement de 12 mois' : 'peut être annulé à tout moment'}.
      </p>
    </form>
  );
};

export default StripePaymentForm;