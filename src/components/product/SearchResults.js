// src/components/product/SearchResults.js
import React from 'react';
import { Package, ChevronDown, TrendingUp } from 'lucide-react';
import SearchResultItem from './SearchResultItem';

const SearchResults = ({ 
  results, 
  totalResults, 
  searchTerm, 
  onSelectProduct, 
  onLoadMore, 
  loading,
  searchFilters
}) => {
  if (!results || results.length === 0) return null;
  
  return (
    <div className="animate-fadeIn">
      {/* Liste des résultats */}
      <div className="divide-y divide-green-100">
        {results.map((result, index) => (
          <div 
            key={result.code}
            className="transition-all duration-500 hover:bg-green-50"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <SearchResultItem 
              result={result}
              onSelect={onSelectProduct}
              searchFilters={searchFilters}
            />
          </div>
        ))}
      </div>
      
      {/* Bouton "Charger plus" modernisé */}
      {results.length < totalResults && (
        <div className="p-6 bg-gradient-to-b from-white to-green-50">
          <div className="text-center">
            <p className="text-sm text-green-600 mb-4">
              Affichage de {results.length} produits sur {totalResults}
            </p>
            <button
              onClick={onLoadMore}
              className="group px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Chargement...
                </>
              ) : (
                <>
                  <Package size={18} className="mr-2" />
                  Voir plus de produits
                  <ChevronDown size={18} className="ml-2 group-hover:translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn > div {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default SearchResults;