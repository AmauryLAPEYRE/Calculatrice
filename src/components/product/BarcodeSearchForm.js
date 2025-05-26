// src/components/product/BarcodeSearchForm.js
import React, { useState } from 'react';
import { Camera, AlertCircle, Scan, Sparkles } from 'lucide-react';
import BarcodeScanner from '../BarcodeScanner';
import { Link } from 'react-router-dom';

const BarcodeSearchForm = ({
  barcode,
  setBarcode,
  onSearch,
  onScan,
  isMobile,
  showScanner,
  setShowScanner,
  setBarcodeSource,
  isAuthorized,
  loading
}) => {
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (isAuthorized && !isAuthorized('manual_entry')) {
        showAuthorizationAlert('manual_entry');
        return;
      }
      setBarcodeSource('manual_entry');
      onSearch();
    }
  };
  
  const handleOpenCamera = () => {
    if (!isAuthorized('scan')) {
      showAuthorizationAlert('scan');
      return;
    }
    setBarcodeSource('scan');
    setShowScanner(true);
  };
  
  const handleSearchClick = () => {
    if (!isAuthorized('manual_entry')) {
      showAuthorizationAlert('manual_entry');
      return;
    }
    setBarcodeSource('manual_entry');
    onSearch();
  };

  const showAuthorizationAlert = (type) => {
    setAlertType(type);
    setAlertMessage(
      type === 'scan' 
        ? "Vous avez atteint votre limite quotidienne de scans. Passez à un abonnement supérieur pour continuer." 
        : "Vous avez atteint votre limite quotidienne de recherches manuelles. Passez à un abonnement supérieur pour continuer."
    );
    
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 5000);
  };
  
  const dismissAlert = () => {
    setAlertMessage(null);
    setAlertType(null);
  };
  
  if (showScanner) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <BarcodeScanner onScanComplete={onScan} autoStart={true} />
        </div>
        <button
          className="mx-auto flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md"
          onClick={() => setShowScanner(false)}
        >
          Annuler le scan
        </button>
      </div>
    );
  }
  
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
      <div className="flex items-center bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="flex-1 relative">
          <Scan size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full pl-12 pr-4 py-4 text-lg focus:outline-none font-mono"
            placeholder="Saisissez le code-barres (ex: 3017620422003)"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        <div className="flex items-center pr-2 space-x-2">
          <button
            className={`p-3 ${!isAuthorized('scan') ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-100 hover:bg-green-200 text-green-700'} rounded-xl transition-all duration-300 transform hover:scale-[1.02]`}
            onClick={handleOpenCamera}
            aria-label="Scanner un code-barres"
          >
            <Camera size={22} />
          </button>
          
          <button
            className={`px-6 py-3 ${loading || !isAuthorized('manual_entry') ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'} text-white rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02] flex items-center`}
            onClick={handleSearchClick}
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
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default BarcodeSearchForm;