// src/components/AIReviewComponents.js
import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { generateAIReview } from '../services/aiReviewService';

/**
 * Hook React personnalisé pour la génération automatique d'avis IA
 * @returns {Object} - État et fonctions pour la génération d'avis IA
 */
export const useAIReviewGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [progressMessage, setProgressMessage] = useState('');
  const [generatedReview, setGeneratedReview] = useState(null);

  const generateReview = async (params) => {
    setIsGenerating(true);
    setError(null);
    setProgressMessage('');
    setGeneratedReview(null);

    try {
      const result = await generateAIReview({
        ...params,
        onProgress: (message) => setProgressMessage(message)
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      setGeneratedReview(result.review);
      return result;

    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de la génération d\'avis IA';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
      // Garder le message de progression pendant 2 secondes après la fin
      setTimeout(() => {
        setProgressMessage('');
      }, 2000);
    }
  };

  const reset = () => {
    setIsGenerating(false);
    setError(null);
    setProgressMessage('');
    setGeneratedReview(null);
  };

  return {
    generateReview,
    isGenerating,
    error,
    progressMessage,
    generatedReview,
    reset,
    clearError: () => setError(null)
  };
};

/**
 * Composant React pour afficher le statut de génération d'avis IA
 */
export const AIReviewGenerationStatus = ({ isGenerating, progressMessage, error }) => {
  if (!isGenerating && !progressMessage && !error) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`max-w-sm rounded-lg shadow-lg p-4 ${
        error 
          ? 'bg-red-50 border border-red-200' 
          : isGenerating 
            ? 'bg-blue-50 border border-blue-200'
            : 'bg-green-50 border border-green-200'
      }`}>
        <div className="flex items-center space-x-3">
          {isGenerating && (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          )}
          
          {error && (
            <div className="text-red-500">
              <AlertCircle size={20} />
            </div>
          )}
          
          {!isGenerating && !error && progressMessage && (
            <div className="text-green-500">
              <CheckCircle size={20} />
            </div>
          )}
          
          <div className={`text-sm font-medium ${
            error 
              ? 'text-red-700' 
              : isGenerating 
                ? 'text-blue-700'
                : 'text-green-700'
          }`}>
            {error || progressMessage || 'Génération d\'avis IA en cours...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  useAIReviewGeneration,
  AIReviewGenerationStatus
};