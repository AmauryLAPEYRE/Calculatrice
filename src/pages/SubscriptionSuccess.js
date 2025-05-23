// src/pages/SubscriptionSuccess.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { checkSubscriptionIntent } from '../services/stripeService';
import { CheckCircle, Loader } from 'lucide-react';

const SubscriptionSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, refreshUserDetails } = useAuth();

  useEffect(() => {
    const verifySubscription = async () => {
      try {
        // Récupérer l'ID de l'intention d'abonnement depuis l'URL
        const params = new URLSearchParams(location.search);
        const intentId = params.get('intent_id');
        
        if (!intentId) {
          throw new Error("Paramètre d'intention manquant");
        }
        
        // Vérifier le statut de l'intention d'abonnement
        const result = await checkSubscriptionIntent(intentId);
        
        if (!result.success) {
          throw new Error(result.error || "Erreur lors de la vérification de l'abonnement");
        }
        
        // Si l'abonnement est complété, mettre à jour les détails utilisateur
        if (result.completed) {
          setSubscription(result.subscription);
          await refreshUserDetails();
        } else {
          // Si l'abonnement n'est pas encore complété, attendre un webhook Stripe
          // Ce cas est normal si vous utilisez des webhooks pour confirmer les paiements
          console.log("L'abonnement est en cours de traitement:", result.status);
          // On considère quand même que c'est un succès pour l'UX
          setSubscription({ status: 'processing' });
        }
      } catch (error) {
        console.error("Erreur lors de la vérification:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      verifySubscription();
    } else {
      setError("Vous devez être connecté pour accéder à cette page");
      setLoading(false);
    }
  }, [currentUser, location, refreshUserDetails]);

  // Rediriger vers le profil après 5 secondes
  useEffect(() => {
    let timer;
    if (subscription && !loading) {
      timer = setTimeout(() => {
        navigate('/profile');
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [subscription, loading, navigate]);

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      {loading ? (
        <div className="text-center py-8">
          <Loader className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Vérification de votre abonnement...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <p className="font-medium">Une erreur est survenue</p>
            <p className="text-sm">{error}</p>
          </div>
          <button 
            onClick={() => navigate('/abonnements')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retour aux abonnements
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Merci pour votre abonnement !</h1>
          <p className="text-gray-600 mb-6">
            {subscription?.status === 'processing' 
              ? "Votre abonnement est en cours de traitement. Vous recevrez un email de confirmation bientôt."
              : "Votre abonnement a bien été activé. Vous pouvez maintenant profiter de toutes les fonctionnalités."}
          </p>
          <p className="text-sm text-gray-500">
            Vous allez être redirigé vers votre profil dans quelques secondes...
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionSuccess;