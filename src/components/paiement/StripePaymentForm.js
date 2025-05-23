// src/components/paiement/StripePaymentForm.js
import React, { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { AlertCircle, Lock, CreditCard, Smartphone } from 'lucide-react';

const StripePaymentForm = ({ onSubmit, processing, error, plan, billingCycle, isAnnualCommitment }) => {
  const stripe = useStripe();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [paymentMethodsAvailable, setPaymentMethodsAvailable] = useState({
    card: true,
    applePay: false,
    googlePay: false
  });

  // Vérifier quelles méthodes de paiement sont disponibles dans le navigateur
  useEffect(() => {
    if (!stripe) return;

    // Vérifier Apple Pay
    const canUseApplePay = window.ApplePaySession && window.ApplePaySession.canMakePayments();
    setPaymentMethodsAvailable(prev => ({...prev, applePay: canUseApplePay}));

    // Vérifier Google Pay (simplifié, car la détection complète nécessite plus de configuration)
    const canUseGooglePay = !!window.PaymentRequest;
    setPaymentMethodsAvailable(prev => ({...prev, googlePay: canUseGooglePay}));
    
  }, [stripe]);

  // Soumettre le formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe) {
      // Stripe.js n'est pas encore chargé
      return;
    }

    // Déterminer les méthodes de paiement à autoriser dans Stripe Checkout
    let paymentMethodTypes = ['card']; // Toujours inclure 'card'
    
    if (selectedPaymentMethod === 'applePay') {
      paymentMethodTypes = ['apple_pay', 'card']; // Apple Pay + carte comme fallback
    } 
    else if (selectedPaymentMethod === 'googlePay') {
      paymentMethodTypes = ['google_pay', 'card']; // Google Pay + carte comme fallback
    }
    
    // Appeler la méthode onSubmit avec null comme paymentMethodId (pas besoin avec Checkout)
    // et les types de paiement acceptés
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
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setSelectedPaymentMethod('card')}
            className={`flex flex-col items-center justify-center p-4 border rounded-md ${
              selectedPaymentMethod === 'card' ? 'border-green-500 bg-green-50' : 'border-gray-300'
            }`}
          >
            <CreditCard className={`mb-2 ${selectedPaymentMethod === 'card' ? 'text-green-600' : 'text-gray-600'}`} />
            <span className={selectedPaymentMethod === 'card' ? 'text-green-700' : 'text-gray-700'}>
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
            <svg className="h-6 w-6 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.72 13.063L17.9 12.5H15.5L15.7 13.063C15.889 13.542 16.334 13.855 16.816 13.855C17.297 13.855 17.731 13.542 17.92 13.063H17.72Z" 
                fill={selectedPaymentMethod === 'applePay' ? '#16A34A' : '#4B5563'} />
              <path d="M12.62 5.045C13.725 5.045 14.562 5.882 14.562 6.987C14.562 7.045 14.562 7.091 14.55 7.149C14.435 7.149 14.32 7.16 14.193 7.16C13.15 7.16 12.297 6.371 12.08 5.328C12.266 5.103 12.52 5.045 12.62 5.045Z" 
                fill={selectedPaymentMethod === 'applePay' ? '#16A34A' : '#4B5563'} />
              <path fillRule="evenodd" clipRule="evenodd" d="M7.5 5.5C5.29 5.5 3.5 7.29 3.5 9.5V14.5C3.5 16.71 5.29 18.5 7.5 18.5H16.5C18.71 18.5 20.5 16.71 20.5 14.5V9.5C20.5 7.29 18.71 5.5 16.5 5.5H7.5ZM8.816 10.855C8.334 10.855 7.889 11.168 7.7 11.647L7.5 12.21L7.3 11.647C7.111 11.168 6.666 10.855 6.184 10.855C5.703 10.855 5.269 11.168 5.08 11.647C4.88 12.126 4.994 12.681 5.364 13.051L7.2 14.887C7.361 15.037 7.639 15.037 7.8 14.887L9.636 13.051C10.006 12.681 10.12 12.126 9.92 11.647C9.731 11.168 9.297 10.855 8.816 10.855ZM12.816 10.855C12.334 10.855 11.889 11.168 11.7 11.647L11.5 12.21L11.3 11.647C11.111 11.168 10.666 10.855 10.184 10.855C9.703 10.855 9.269 11.168 9.08 11.647C8.88 12.126 8.994 12.681 9.364 13.051L11.2 14.887C11.361 15.037 11.639 15.037 11.8 14.887L13.636 13.051C14.006 12.681 14.12 12.126 13.92 11.647C13.731 11.168 13.297 10.855 12.816 10.855ZM15.7 11.647L15.5 12.21L15.3 11.647C15.111 11.168 14.666 10.855 14.184 10.855C13.703 10.855 13.269 11.168 13.08 11.647C12.88 12.126 12.994 12.681 13.364 13.051L15.2 14.887C15.361 15.037 15.639 15.037 15.8 14.887L17.636 13.051C18.006 12.681 18.12 12.126 17.92 11.647C17.731 11.168 17.297 10.855 16.816 10.855C16.334 10.855 15.889 11.168 15.7 11.647ZM14.4 9.3C14.4 8.04 13.36 7 12.1 7C11.24 7 10.5 7.44 10.1 8.1C9.7 7.44 8.96 7 8.1 7C6.84 7 5.8 8.04 5.8 9.3C5.8 9.76 5.92 10.2 6.16 10.56C6.88 11.72 9.2 14.08 10.1 15C11 14.08 13.32 11.72 14.04 10.56C14.28 10.2 14.4 9.76 14.4 9.3Z" 
                fill={selectedPaymentMethod === 'applePay' ? '#16A34A' : '#4B5563'} />
            </svg>
            <span className={selectedPaymentMethod === 'applePay' ? 'text-green-700' : 'text-gray-700'}>
              Apple Pay
            </span>
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
            <svg className="h-6 w-6 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.545 12.023L12 12.932L11.455 12.023H5.73C5.33 13.607 5.33 15.286 5.73 16.87H12.545H18.27C18.67 15.286 18.67 13.607 18.27 12.023H12.545Z"
                fill={selectedPaymentMethod === 'googlePay' ? '#16A34A' : '#4B5563'} />
              <path d="M11.455 11.131L12 10.222L12.545 11.131H18.27C17.87 9.547 16.87 8.155 15.546 7.245C14.223 6.335 12.631 5.953 11.063 6.159C9.495 6.365 8.037 7.148 6.935 8.382C5.833 9.615 5.156 11.222 5.026 12.915L5 13.023H11.455V11.131Z"
                fill={selectedPaymentMethod === 'googlePay' ? '#16A34A' : '#4B5563'} />
              <path d="M12.545 16.977H5.73C6.13 18.56 7.13 19.953 8.453 20.863C9.777 21.773 11.369 22.155 12.937 21.949C14.505 21.743 15.963 20.96 17.064 19.726C18.166 18.493 18.843 16.886 18.973 15.193L19 15.085H12.545V16.977Z"
                fill={selectedPaymentMethod === 'googlePay' ? '#16A34A' : '#4B5563'} />
            </svg>
            <span className={selectedPaymentMethod === 'googlePay' ? 'text-green-700' : 'text-gray-700'}>
              Google Pay
            </span>
          </button>
        </div>
      </div>

      {/* Message pour informer l'utilisateur du processus */}
      <div className="mb-6 p-4 bg-blue-50 rounded-md">
        <p className="text-blue-700">
          {selectedPaymentMethod === 'applePay' 
            ? "Vous serez redirigé vers une page sécurisée pour finaliser votre paiement avec Apple Pay."
            : selectedPaymentMethod === 'googlePay'
            ? "Vous serez redirigé vers une page sécurisée pour finaliser votre paiement avec Google Pay."
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
          `Continuer le paiement avec ${
            selectedPaymentMethod === 'applePay' ? 'Apple Pay' :
            selectedPaymentMethod === 'googlePay' ? 'Google Pay' :
            'Carte bancaire'
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