// src/components/review/StarRating.js
import React from 'react';
import { Star } from 'lucide-react';

/**
 * Composant pour afficher et gérer les étoiles de notation
 * @param {object} props - Propriétés du composant
 * @param {number} props.rating - Note actuelle (0-5)
 * @param {number} props.hoverRating - Note au survol (0-5)
 * @param {boolean} props.interactive - Si les étoiles sont cliquables
 * @param {function} props.onRatingChange - Callback pour le changement de note
 * @param {function} props.onRatingHover - Callback pour le survol
 * @param {number} props.size - Taille des étoiles (défaut: 18)
 */
const StarRating = ({ 
  rating = 0, 
  hoverRating = 0, 
  interactive = false, 
  onRatingChange, 
  onRatingHover,
  size = 18 
}) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          size={size} 
          className={`${
            star <= (interactive ? hoverRating || rating : rating) 
              ? "text-yellow-400 fill-yellow-400" 
              : "text-gray-300"
          } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
          onClick={() => interactive && onRatingChange && onRatingChange(star)}
          onMouseEnter={() => interactive && onRatingHover && onRatingHover(star)}
          onMouseLeave={() => interactive && onRatingHover && onRatingHover(0)}
        />
      ))}
    </div>
  );
};

/**
 * Composant pour afficher des étoiles avec notation décimale
 * @param {object} props - Propriétés du composant
 * @param {number} props.rating - Note décimale à afficher
 * @param {number} props.size - Taille des étoiles (défaut: 20)
 */
export const AverageStarRating = ({ rating = 0, size = 20 }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => {
        const difference = star - rating;
        let starClass = "text-gray-300";
        
        if (difference <= 0) {
          starClass = "text-yellow-400 fill-yellow-400";
        } else if (difference < 1 && difference > 0) {
          starClass = "text-yellow-400 fill-yellow-400 opacity-50";
        }
        
        return (
          <Star 
            key={star} 
            size={size} 
            className={starClass}
          />
        );
      })}
    </div>
  );
};

export default StarRating;