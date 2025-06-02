// src/components/profile/UserAvatar.js
import React, { useState, useEffect, useRef } from 'react';
import { Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Cache global pour stocker les URLs d'avatars déjà générées
const avatarCache = new Map();

// Fonction pour nettoyer le cache après un certain temps
const cleanupCache = () => {
  const maxCacheAge = 1000 * 60 * 60; // 1 heure
  const now = Date.now();
  
  avatarCache.forEach((value, key) => {
    if (now - value.timestamp > maxCacheAge) {
      avatarCache.delete(key);
    }
  });
};

// Nettoyer le cache toutes les 30 minutes
setInterval(cleanupCache, 1000 * 60 * 30);

/**
 * Composant Avatar utilisant DiceBear Lorelei
 * @param {Object} props
 * @param {string} props.userId - ID unique de l'utilisateur (Firebase UID)
 * @param {number} props.size - Taille de l'avatar en pixels (défaut: 50)
 * @param {string} props.status - Statut de l'utilisateur (bronze, argent, or, diamant)
 * @param {string} props.className - Classes CSS additionnelles
 * @param {string} props.displayName - Nom d'affichage pour le fallback
 * @param {boolean} props.showBorder - Afficher la bordure colorée selon le statut
 * @param {function} props.onLoad - Callback appelé quand l'image est chargée
 * @param {function} props.onError - Callback appelé en cas d'erreur
 * @param {string} props.customAvatarUrl - URL d'un avatar personnalisé (prioritaire sur DiceBear)
 * @param {string} props.avatarSeed - Seed personnalisé pour DiceBear (sinon utilise userId)
 */
const UserAvatar = ({ 
  userId, 
  size = 50, 
  status = 'bronze', 
  className = '', 
  displayName = '',
  showBorder = true,
  onLoad,
  onError,
  customAvatarUrl = '',
  avatarSeed = ''
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const imgRef = useRef(null);
  
  // Couleurs par statut cohérentes avec ChallengesPage
  const colorsByStatus = {
    bronze: ['fef3c7', 'fed7aa'],  // Jaune/orange clair
    argent: ['e5e7eb', 'f3f4f6'],  // Gris clair
    or: ['fef3c7', 'fde68a'],       // Doré
    diamant: ['dbeafe', 'e0e7ff']   // Bleu clair
  };
  
  // Bordures par statut
  const borderColorsByStatus = {
    bronze: 'border-amber-300',
    argent: 'border-gray-300',
    or: 'border-yellow-400',
    diamant: 'border-blue-400'
  };
  
  // Obtenir la couleur de fond selon le statut
  const getBackgroundColor = () => {
    const colors = colorsByStatus[status?.toLowerCase()] || colorsByStatus.bronze;
    // Sélectionner aléatoirement une des deux couleurs basée sur l'userId
    const colorIndex = userId ? userId.charCodeAt(0) % colors.length : 0;
    return colors[colorIndex];
  };
  
  // Générer l'URL de l'avatar
  useEffect(() => {
    // Si un avatar personnalisé est fourni, l'utiliser en priorité
    if (customAvatarUrl) {
      setAvatarUrl(customAvatarUrl);
      return;
    }
    
    // Utiliser avatarSeed si fourni, sinon userId
    const seedToUse = avatarSeed || userId;
    
    if (!seedToUse) {
      setImageError(true);
      return;
    }
    
    // Clé de cache unique
    const cacheKey = `${seedToUse}-${size}-${status}`;
    
    // Vérifier le cache
    if (avatarCache.has(cacheKey)) {
      const cached = avatarCache.get(cacheKey);
      setAvatarUrl(cached.url);
      setImageLoaded(true);
      return;
    }
    
    // Générer l'URL DiceBear
    const bgColor = getBackgroundColor();
    const url = `https://api.dicebear.com/7.x/lorelei/png?seed=${encodeURIComponent(seedToUse)}&backgroundColor=${bgColor}&size=${size}`;
    
    // Stocker dans le cache
    avatarCache.set(cacheKey, {
      url,
      timestamp: Date.now()
    });
    
    setAvatarUrl(url);
  }, [userId, size, status, customAvatarUrl, avatarSeed]);
  
  // Précharger l'image
  useEffect(() => {
    if (!avatarUrl) return;
    
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      setImageError(false);
      onLoad?.();
    };
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(false);
      onError?.();
    };
    img.src = avatarUrl;
  }, [avatarUrl, onLoad, onError]);
  
  // Obtenir les initiales pour le fallback
  const getInitials = () => {
    if (displayName) {
      return displayName.charAt(0).toUpperCase();
    }
    if (userId) {
      return userId.charAt(0).toUpperCase();
    }
    return 'U';
  };
  
  // Classes de base
  const baseClasses = `relative inline-block rounded-full overflow-hidden transition-all duration-300`;
  const borderClass = showBorder ? `ring-2 ${borderColorsByStatus[status?.toLowerCase()] || borderColorsByStatus.bronze}` : '';
  
  // Style de taille
  const sizeStyle = {
    width: `${size}px`,
    height: `${size}px`
  };
  
  // Rendu du fallback (initiales)
  const renderFallback = () => (
    <div 
      className={`${baseClasses} ${borderClass} ${className} bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold`}
      style={sizeStyle}
    >
      <span style={{ fontSize: `${size * 0.4}px` }}>
        {getInitials()}
      </span>
    </div>
  );
  
  // Rendu du loader
  const renderLoader = () => (
    <div 
      className={`${baseClasses} ${borderClass} ${className} bg-gray-100 flex items-center justify-center`}
      style={sizeStyle}
    >
      <Loader 
        size={size * 0.4} 
        className="animate-spin text-green-600" 
      />
    </div>
  );
  
  // Si erreur ou pas d'identifiant valide, afficher le fallback
  if (imageError || (!userId && !avatarSeed && !customAvatarUrl)) {
    return renderFallback();
  }
  
  // Si pas encore chargé, afficher le loader
  if (!imageLoaded) {
    return renderLoader();
  }
  
  // Rendu de l'avatar
  return (
    <div 
      className={`${baseClasses} ${borderClass} ${className}`}
      style={sizeStyle}
    >
      <img
        ref={imgRef}
        src={avatarUrl}
        alt={displayName || 'Avatar utilisateur'}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={() => setImageError(true)}
      />
      
      {/* Effet de hover optionnel */}
      <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-200"></div>
    </div>
  );
};

// Fonction utilitaire pour précharger plusieurs avatars
export const preloadAvatars = (users) => {
  if (!Array.isArray(users)) return;
  
  users.forEach(user => {
    if (!user.userId) return;
    
    const cacheKey = `${user.userId}-${user.size || 50}-${user.status || 'bronze'}`;
    
    if (!avatarCache.has(cacheKey)) {
      const colors = {
        bronze: ['fef3c7', 'fed7aa'],
        argent: ['e5e7eb', 'f3f4f6'],
        or: ['fef3c7', 'fde68a'],
        diamant: ['dbeafe', 'e0e7ff']
      };
      
      const statusColors = colors[user.status?.toLowerCase()] || colors.bronze;
      const colorIndex = user.userId.charCodeAt(0) % statusColors.length;
      const bgColor = statusColors[colorIndex];
      
      const url = `https://api.dicebear.com/7.x/lorelei/png?seed=${encodeURIComponent(user.userId)}&backgroundColor=${bgColor}&size=${user.size || 50}`;
      
      // Précharger l'image
      const img = new Image();
      img.src = url;
      
      // Stocker dans le cache
      avatarCache.set(cacheKey, {
        url,
        timestamp: Date.now()
      });
    }
  });
};

// Hook personnalisé pour utiliser l'avatar avec le contexte Auth
export const useUserAvatar = () => {
  const { currentUser, userDetails } = useAuth();
  
  const avatarProps = {
    userId: userDetails?.firebase_uid || currentUser?.uid,
    displayName: userDetails?.display_name || currentUser?.displayName,
    status: userDetails?.status || 'bronze',
    customAvatarUrl: userDetails?.avatar_url || '',
    avatarSeed: userDetails?.avatar_seed || ''
  };
  
  return avatarProps;
};

export default UserAvatar;