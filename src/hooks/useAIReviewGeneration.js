// src/hooks/useAIReviewGeneration.js
import { useState } from 'react';
import { generateAIReview, checkExistingAIReview } from '../services/aiReviewService';

/**
 * Hook React personnalisé pour la génération automatique d'avis IA
 * @returns {Object} - État et fonctions pour la génération d'avis IA
 */
export const useAIReviewGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [progressMessage, setProgressMessage] = useState('');
  const [generatedReview, setGeneratedReview] = useState(null);
  const [success, setSuccess] = useState(false);

  const generateReview = async (params, onNewReviewGenerated = null) => {
    setIsGenerating(true);
    setError(null);
    setProgressMessage('');
    setGeneratedReview(null);
    setSuccess(false);

    try {
      // Vérifier d'abord s'il existe déjà un avis IA
      const existingCheck = await checkExistingAIReview(params.productCode);
      
      if (existingCheck.exists) {
        throw new Error('Un avis IA existe déjà pour ce produit');
      }

      const result = await generateAIReview({
        ...params,
        onProgress: (message) => setProgressMessage(message)
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      setGeneratedReview(result.review);
      setSuccess(true);
      setProgressMessage('Avis IA généré avec succès !');

      // Callback pour notifier le composant parent qu'un nouvel avis a été généré
      if (onNewReviewGenerated && result.review) {
        onNewReviewGenerated(result.review);
      }

      return result;

    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la génération d\'avis IA';
      setError(errorMessage);
      setProgressMessage('');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setIsGenerating(false);
    setError(null);
    setProgressMessage('');
    setGeneratedReview(null);
    setSuccess(false);
  };

  const clearError = () => {
    setError(null);
  };

  const clearSuccess = () => {
    setSuccess(false);
    setProgressMessage('');
  };

  return {
    generateReview,
    isGenerating,
    error,
    progressMessage,
    generatedReview,
    success,
    reset,
    clearError,
    clearSuccess
  };
};