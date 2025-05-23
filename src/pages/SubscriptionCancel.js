// src/pages/SubscriptionCancel.js
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const SubscriptionCancel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Optionnel: Vous pourriez vouloir nettoyer l'intention d'abonnement annulée
  useEffect(() => {
    // Récupérer l'ID de l'intention d'abonnement depuis l'URL
    const params = new URLSearchParams(location.search);
    const intentId = params.get('intent_id');
    
    // Vous pourriez implémenter une logique ici pour marquer l'intention comme annulée
    // dans votre base de données si nécessaire
    console.log("Abonnement annulé, intent_id:", intentId);
  }, [location]);

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-center">
      <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Paiement annulé</h1>
      <p className="text-gray-600 mb-6">
        Votre abonnement n'a pas été créé car le processus de paiement a été annulé.
      </p>
      <div className="flex justify-center">
        <button
          onClick={() => navigate('/abonnements')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retour aux abonnements
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCancel;