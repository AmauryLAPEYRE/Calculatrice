// src/components/common/LoadingOverlay.js
import React from 'react';
import { Sparkles } from 'lucide-react';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center max-w-md w-full mx-4 border border-green-100 relative overflow-hidden">
        {/* Effet de fond animé */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white opacity-50"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Loader animé moderne */}
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 border-4 border-green-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-green-600 rounded-full animate-spin border-t-transparent"></div>
            <div className="absolute inset-2 border-4 border-green-400 rounded-full animate-spin animation-delay-200 border-b-transparent"></div>
            
            {/* Icône centrale */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles size={24} className="text-green-600 animate-pulse" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-green-800 mb-2">Recherche en cours...</h3>
          <p className="text-green-600 text-center text-sm">
            Veuillez patienter pendant que nous recherchons les informations du produit
          </p>
          
          {/* Barre de progression */}
          <div className="w-full h-2 bg-green-100 rounded-full mt-6 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-loading-bar"></div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading-bar {
          0% { width: 0%; transform: translateX(0); }
          50% { width: 100%; transform: translateX(0); }
          100% { width: 100%; transform: translateX(100%); }
        }
        
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;