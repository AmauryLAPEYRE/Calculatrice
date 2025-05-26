// src/components/product/NameSearchForm.js
import React, { useState } from 'react';
import { Search, Filter, AlertCircle, Plus, X, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import AdvancedSearchFilters from '../AdvancedSearchFilters';
import { Link } from 'react-router-dom';

const NameSearchForm = ({
  productName,
  setProductName,
  onSearch,
  onApplyFilters,
  searchFilters,
  filtersApplied,
  isMobile,
  isAuthorized,
  loading
}) => {
  const [alertMessage, setAlertMessage] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const checkAuthorization = (action) => {
    if (typeof isAuthorized !== 'function') {
      return true;
    }
    
    try {
      return isAuthorized(action);
    } catch (error) {
      console.error('Erreur lors de l\'appel à isAuthorized:', error);
      return true;
    }
  };

  const handleSearch = () => {
    if (!checkAuthorization('searchName')) {
      showAuthorizationAlert();
      return;
    }
    
    if (typeof onSearch === 'function') {
      try {
        onSearch();
      } catch (error) {
        console.error('Erreur lors de l\'appel à onSearch:', error);
      }
    }
  };

  const showAuthorizationAlert = () => {
    setAlertMessage(
      "Vous avez atteint votre limite quotidienne de recherches par nom. Passez à un abonnement supérieur pour continuer."
    );
    
    setTimeout(() => {
      setAlertMessage(null);
    }, 5000);
  };
  
  const dismissAlert = () => {
    setAlertMessage(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  // Message d'alerte moderne
  const alertComponent = alertMessage && (
    <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl shadow-sm animate-fadeIn">
      <div className="flex items-start">
        <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
          <AlertCircle size={20} className="text-amber-600" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-amber-800">{alertMessage}</p>
          <div className="mt-3 flex space-x-3">
            <Link
              to="/abonnements"
              className="inline-flex items-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-full hover:bg-amber-700 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Sparkles size={14} className="mr-1.5" />
              S'abonner
            </Link>
            <button 
              className="inline-flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 transition-all duration-300 border border-gray-200"
              onClick={dismissAlert}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      {alertComponent}
      
      {/* Barre de recherche moderne */}
      <div className="relative">
        <div className="flex items-center bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-4 text-lg focus:outline-none"
              placeholder="Saisissez le nom du produit (ex: macaroni, yaourt...)"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          
          <div className="flex items-center pr-2">
            <button
              className={`px-6 py-3 ${loading || !checkAuthorization('searchName') ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'} text-white rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02] flex items-center`}
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Recherche...
                </>
              ) : 'Rechercher'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Bouton filtres avec indicateur */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center px-5 py-2.5 ${showFilters ? 'bg-green-600 text-white' : 'bg-white text-green-700 border border-green-200'} rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02]`}
        >
          <Filter size={18} className="mr-2" />
          {showFilters ? 'Masquer' : 'Afficher'} les filtres avancés
          {filtersApplied && (
            <span className="ml-2 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
          )}
          {showFilters ? <ChevronUp size={18} className="ml-2" /> : <ChevronDown size={18} className="ml-2" />}
        </button>
      </div>
      
      {/* Section des filtres avec animation */}
      {showFilters && (
        <div className="animate-slideDown">
          <AdvancedSearchFilters 
            onApplyFilters={(filters) => {
              if (typeof onApplyFilters === 'function') {
                try {
                  onApplyFilters(filters);
                } catch (error) {
                  console.error('Erreur lors de l\'appel à onApplyFilters:', error);
                }
              }
            }} 
          />
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 500px; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default NameSearchForm;