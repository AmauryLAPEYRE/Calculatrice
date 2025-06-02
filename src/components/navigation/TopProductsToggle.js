// src/components/navigation/TopProductsToggle.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Activity, TrendingUp, Clock } from 'lucide-react';

const TopProductsToggle = () => {
  const location = useLocation();
  const isLivePage = location.pathname === '/top-produits-live';

  return (
    <div className="inline-flex bg-white rounded-xl shadow-sm border border-green-100 p-1 mb-6">
      <Link
        to="/top-produits"
        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          !isLivePage
            ? 'bg-green-600 text-white shadow-md'
            : 'text-green-600 hover:bg-green-50'
        }`}
      >
        <BarChart3 size={16} className="mr-2" />
        Classement Global
      </Link>
      
      <Link
        to="/top-produits-live"
        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative ${
          isLivePage
            ? 'bg-green-600 text-white shadow-md'
            : 'text-green-600 hover:bg-green-50'
        }`}
      >
        <Activity size={16} className="mr-2" />
        Tendances Live
        {isLivePage && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </Link>
    </div>
  );
};

export default TopProductsToggle;

// Utilisation dans TopProducts.js et TopProductsLive.js :
// Ajouter cet import en haut du fichier :
// import TopProductsToggle from '../components/navigation/TopProductsToggle';

// Ajouter ce composant juste après le breadcrumb :
/*
/* Navigation entre les modes */
/*
<div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
  <TopProductsToggle />
</div>
*/