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
      <div className="p-4 bg-green-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Note moyenne</h4>
        <div className="flex items-center">
          <AverageStarRating rating={averageRating} />
          <span className="ml-3 text-lg font-bold text-green-700">
            {averageRating > 0 ? averageRating.toFixed(2) : '0.0'}/5
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Cette note est calculée automatiquement en fonction de vos évaluations et du poids de chaque critère.
        </p>
      </div>
      
      {/* Alerte si une note est à zéro */}
      {showZeroRatingAlert && (
        <div className="p-3 bg-yellow-50 text-yellow-700 rounded-md flex items-start">
          <AlertTriangle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
          <span>Certains critères n'ont pas été notés. Veuillez attribuer une note pour tous les critères.</span>
        </div>
      )}
      
      {validationErrors.ratings && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-start">
          <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
          <span>{validationErrors.ratings}</span>
        </div>
      )}
      
      {/* Notes par critère */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Notation <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
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
 * Item individuel pour un critère de notation
 */
const CriteriaRatingItem = ({ 
  criteria, 
  rating, 
  hoverRating, 
  onRatingChange, 
  onRatingHover 
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="w-1/3">
        <span className="font-medium text-gray-800">{criteria.display_name}</span>
        <span className="text-xs text-gray-500 ml-1 block">
          (coefficient {criteria.weight})
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <StarRating
          rating={rating}
          hoverRating={hoverRating}
          interactive={true}
          onRatingChange={onRatingChange}
          onRatingHover={onRatingHover}
        />
        <span className="text-sm text-gray-600 min-w-[3rem]">
          {rating > 0 ? `${rating}/5` : ''}
        </span>
      </div>
    </div>
  );
};

export default ReviewCriteriaSection;