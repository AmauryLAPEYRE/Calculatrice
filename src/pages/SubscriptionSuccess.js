// src/pages/SubscriptionSuccess.js
import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { checkSubscriptionIntent } from '../services/stripeService';
import { CheckCircle, Loader } from 'lucide-react';
import { createWelcomeEssentialSubscription } from '../supabaseClient';

const SubscriptionSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [welcomeGiftCreated, setWelcomeGiftCreated] = useState(false);
  
  // ✅ SOLUTION 1: Utiliser useRef pour suivre si la vérification a déjà été faite
  const verificationDone = useRef(false);
  const welcomeGiftProcessed = useRef(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, refreshUserDetails } = useAuth();

  useEffect(() => {
    const verifySubscription = async () => {
      // ✅ Éviter les appels multiples
      if (verificationDone.current) {
        console.log("Vérification déjà effectuée, ignorer");
        return;
      }

      try {
        verificationDone.current = true; // Marquer comme traité
        
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
          
          // ✅ Créer le cadeau de bienvenue UNE SEULE FOIS
          if (!welcomeGiftProcessed.current && 
              result.intent.subscription_plans.name === "Essential") {
            
            welcomeGiftProcessed.current = true; // Marquer comme traité
            
            try {
              console.log("Création du cadeau de bienvenue...");
              const PlanOffert = await createWelcomeEssentialSubscription(
                result.intent.user_id, 
                result.intent.plan_id
              );
              
              if (PlanOffert) {
                setWelcomeGiftCreated(true);
                console.log("Cadeau de bienvenue Premium créé avec succès");
              }
            } catch (giftError) {
              console.error("Erreur lors de la création du cadeau de bienvenue:", giftError);
              welcomeGiftProcessed.current = false; // Permettre une nouvelle tentative
            }
          }
          
          // Rafraîchir les détails utilisateur APRÈS la création du cadeau
          await refreshUserDetails();
        } else {
          console.log("L'abonnement est en cours de traitement:", result.status);
          setSubscription({ status: 'processing' });
        }
      } catch (error) {
        console.error("Erreur lors de la vérification:", error);
        setError(error.message);
        verificationDone.current = false; // Permettre une nouvelle tentative en cas d'erreur
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && !verificationDone.current) {
      verifySubscription();
    } else if (!currentUser) {
      setError("Vous devez être connecté pour accéder à cette page");
      setLoading(false);
    }
  }, [currentUser, location.search]); // ✅ Dépendances simplifiées

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
          
          <div className="text-gray-600 mb-6">
            <p className="mb-2">
              {subscription?.status === 'processing' 
                ? "Votre abonnement est en cours de traitement. Vous recevrez un email de confirmation bientôt."
                : "Votre abonnement a bien été activé. Vous pouvez maintenant profiter de toutes les fonctionnalités."}
            </p>
            
            {verificationDone.current  && welcomeGiftCreated && (
              <div className="bg-green-100 text-green-800 p-3 rounded-lg mt-3">
                <p className="font-semibold">🎁 Cadeau de bienvenue !</p>
                <p className="text-sm">1 semaine d'abonnement Premium offerte pour votre première souscription Essential.</p>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-500">
            Vous allez être redirigé vers votre profil dans quelques secondes...
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionSuccess;