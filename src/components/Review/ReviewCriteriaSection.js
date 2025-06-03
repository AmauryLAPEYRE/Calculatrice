// src/components/review/ReviewCriteriaSection.js - Version mise à jour
import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Loader, Info, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import StarRating, { AverageStarRating } from './StarRating';

/**
 * Section pour l'évaluation par critères et la note moyenne
 * Version mise à jour pour les critères spécifiques aux produits
 */
const ReviewCriteriaSection = ({
  criterias,
  ratings,
  hoverRatings,
  averageRating,
  showZeroRatingAlert,
  validationErrors,
  // NOUVELLES PROPS
  criteriasLoading = false,
  criteriasError = null,
  categoryInfo = null,
  onRatingChange,
  onRatingHover
}) => {
  const [showCriteriaDetails, setShowCriteriaDetails] = useState(false);

  // Affichage pendant le chargement
  if (criteriasLoading) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-center space-x-3">
            <Loader size={20} className="animate-spin text-green-600" />
            <span className="text-gray-600">Chargement des critères d'évaluation...</span>
          </div>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (criteriasError) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-start">
            <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-700 font-medium">Impossible de charger les critères d'évaluation</p>
              <p className="text-red-600 text-sm mt-1">{criteriasError}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage si aucun critère
  if (!criterias || criterias.length === 0) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start">
            <AlertCircle size={20} className="text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-amber-700">
              Aucun critère d'évaluation disponible pour ce produit. 
              Veuillez réessayer plus tard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* NOUVELLE SECTION : Informations sur les critères spécialisés */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Tag size={18} className="text-blue-600" />
            <h4 className="font-medium text-blue-800">
              Critères d'évaluation
              {categoryInfo?.categoryDisplayName && (
                <span className="text-sm font-normal text-blue-600 ml-2">
                  ({categoryInfo.categoryDisplayName})
                </span>
              )}
            </h4>
          </div>
          
          <button
            type="button"
            onClick={() => setShowCriteriaDetails(!showCriteriaDetails)}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Info size={14} />
            <span>Détails</span>
            {showCriteriaDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
        
        {/* Vue compacte des critères */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
          {criterias.slice(0, 3).map((criteria) => (
            <div key={criteria.id} className="flex items-center justify-between text-sm bg-white rounded px-2 py-1">
              <span className="text-blue-700 truncate">{criteria.display_name}</span>
              <span className="text-blue-600 font-bold ml-2">×{criteria.weight}</span>
            </div>
          ))}
        </div>
        
        {/* Détails repliables */}
        {showCriteriaDetails && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-sm text-blue-800 mb-3">
              Ces critères sont spécialisés pour cette catégorie de produit :
            </p>
            <div className="space-y-2">
              {criterias.map((criteria) => (
                <div key={criteria.id} className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">{criteria.display_name}</span>
                    <span className="text-blue-600 font-bold">×{criteria.weight}</span>
                  </div>
                  {criteria.description && (
                    <p className="text-sm text-gray-600">{criteria.description}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center text-xs text-blue-700">
              <Info size={12} className="mr-1" />
              <span>Les coefficients (×) indiquent l'importance de chaque critère dans le calcul de votre note finale.</span>
            </div>
            {!categoryInfo?.hasCategory && (
              <div className="mt-2 p-2 bg-amber-100 rounded-lg">
                <p className="text-xs text-amber-800">
                  💡 Ce produit utilise les critères par défaut.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Affichage de la note moyenne calculée en temps réel */}
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="font-medium text-gray-800 mb-3">Note moyenne</h4>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <AverageStarRating rating={averageRating} />
          <span className="text-xl font-bold text-green-700">
            {averageRating > 0 ? averageRating.toFixed(2) : '0.0'}/5
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-3 leading-relaxed">
          Cette note est calculée automatiquement en fonction de vos évaluations et du poids de chaque critère spécialisé.
        </p>
      </div>
      
      {/* Alerte si une note est à zéro */}
      {showZeroRatingAlert && (
        <div className="p-3 bg-yellow-50 text-yellow-700 rounded-md flex items-start border border-yellow-200">
          <AlertTriangle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
          <span className="text-sm">
            Certains critères n'ont pas été notés. Vous pouvez laisser des notes à zéro, 
            mais nous recommandons d'évaluer tous les critères pour un avis plus complet.
          </span>
        </div>
      )}
      
      {/* Erreurs de validation */}
      {validationErrors.ratings && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-start border border-red-200">
          <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{validationErrors.ratings}</span>
        </div>
      )}

      {validationErrors.criterias && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-start border border-red-200">
          <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{validationErrors.criterias}</span>
        </div>
      )}
      
      {/* Notes par critère */}
      <div>
        <label className="block text-gray-700 font-medium mb-4">
          Notation <span className="text-red-500">*</span>
        </label>
        <div className="space-y-4">
          {criterias.map(criteria => (
            <CriteriaRatingItem
              key={criteria.id}
              criteria={criteria}
              rating={ratings[criteria.id] || 0}
              hoverRating={hoverRatings[criteria.id] || 0}
              onRatingChange={(value) => onRatingChange(criteria.id, value)}
              onRatingHover={(value) => onRatingHover(criteria.id, value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Item individuel pour un critère de notation - Version mise à jour
 */
const CriteriaRatingItem = ({ 
  criteria, 
  rating, 
  hoverRating, 
  onRatingChange, 
  onRatingHover 
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
      {/* Layout mobile-first : empilé verticalement */}
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Informations du critère - MISE À JOUR avec coefficient plus visible */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
            <div className="flex items-center space-x-2">
              <h5 className="font-medium text-gray-800 text-base">
                {criteria.display_name}
              </h5>
              {/* Badge coefficient plus visible */}
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                ×{criteria.weight}
              </span>
            </div>
          </div>
          {/* Description optionnelle si disponible */}
          {criteria.description && (
            <p className="text-xs text-gray-600 mt-1 hidden sm:block">
              {criteria.description}
            </p>
          )}
        </div>
        
        {/* Section notation */}
        <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-3">
          <div className="flex-shrink-0">
            <StarRating
              rating={rating}
              hoverRating={hoverRating}
              interactive={true}
              onRatingChange={onRatingChange}
              onRatingHover={onRatingHover}
            />
          </div>
          <div className="flex-shrink-0 min-w-[3rem] text-right">
            <span className="text-sm font-medium text-gray-700">
              {rating > 0 ? `${rating}/5` : '−'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Version compacte pour l'affichage en lecture seule - MISE À JOUR
 */
export const CriteriaRatingCompact = ({ criterias, ratings, showWeights = false }) => {
  return (
    <div className="space-y-2">
      {criterias.map(criteria => {
        const rating = ratings[criteria.id] || 0;
        return (
          <div key={criteria.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">{criteria.display_name}</span>
              {showWeights && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600">
                  ×{criteria.weight}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <AverageStarRating rating={rating} size="sm" />
              <span className="text-gray-700 font-medium min-w-[2rem]">
                {rating > 0 ? rating : '−'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * NOUVEAU : Composant pour afficher un résumé des critères utilisés
 */
export const CriteriaSummary = ({ criterias, categoryInfo }) => {
  if (!criterias || criterias.length === 0) return null;

  return (
    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
      <div className="flex items-center space-x-2 mb-2">
        <Tag size={16} className="text-blue-600" />
        <span className="text-sm font-medium text-blue-800">
          Critères d'évaluation
          {categoryInfo?.categoryDisplayName && (
            <span className="font-normal text-blue-600 ml-1">
              ({categoryInfo.categoryDisplayName})
            </span>
          )}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {criterias.map((criteria) => (
          <div key={criteria.id} className="flex items-center justify-between text-xs bg-white rounded px-2 py-1">
            <span className="text-blue-700 truncate">{criteria.display_name}</span>
            <span className="text-blue-600 font-bold ml-1">×{criteria.weight}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewCriteriaSection;