// src/components/review/ReviewCriteriaSection.js
import React from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import StarRating, { AverageStarRating } from './StarRating';

/**
 * Section pour l'évaluation par critères et la note moyenne
 */
const ReviewCriteriaSection = ({
  criterias,
  ratings,
  hoverRatings,
  averageRating,
  showZeroRatingAlert,
  validationErrors,
  onRatingChange,
  onRatingHover
}) => {
  return (
    <div className="space-y-6">
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
          Cette note est calculée automatiquement en fonction de vos évaluations et du poids de chaque critère.
        </p>
      </div>
      
      {/* Alerte si une note est à zéro */}
      {showZeroRatingAlert && (
        <div className="p-3 bg-yellow-50 text-yellow-700 rounded-md flex items-start border border-yellow-200">
          <AlertTriangle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
          <span className="text-sm">
            Certains critères n'ont pas été notés. Veuillez attribuer une note pour tous les critères.
          </span>
        </div>
      )}
      
      {validationErrors.ratings && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-start border border-red-200">
          <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{validationErrors.ratings}</span>
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
 * Item individuel pour un critère de notation - Version responsive
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
        
        {/* Informations du critère */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
            <h5 className="font-medium text-gray-800 text-base">
              {criteria.display_name}
            </h5>
            <span className="text-xs text-gray-500 mt-1 sm:mt-0">
              (coefficient {criteria.weight})
            </span>
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
 * Version compacte pour l'affichage en lecture seule (ex: liste des avis)
 */
export const CriteriaRatingCompact = ({ criterias, ratings }) => {
  return (
    <div className="space-y-2">
      {criterias.map(criteria => {
        const rating = ratings[criteria.id] || 0;
        return (
          <div key={criteria.id} className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{criteria.display_name}</span>
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

export default ReviewCriteriaSection;