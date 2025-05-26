// src/components/AdvancedSearchFilters.js
import React, { useState } from 'react';
import { Plus, X, RefreshCw, Check, Info } from 'lucide-react';

const AdvancedSearchFilters = ({ onApplyFilters }) => {
  const [withIngredients, setWithIngredients] = useState([]);
  const [withoutIngredients, setWithoutIngredients] = useState([]);
  const [currentWithIngredient, setCurrentWithIngredient] = useState('');
  const [currentWithoutIngredient, setCurrentWithoutIngredient] = useState('');

  const addIngredient = (type) => {
    const ingredient = type === 'with' ? currentWithIngredient : currentWithoutIngredient;
    if (ingredient.trim()) {
      if (type === 'with') {
        setWithIngredients([...withIngredients, ingredient.trim()]);
        setCurrentWithIngredient('');
      } else {
        setWithoutIngredients([...withoutIngredients, ingredient.trim()]);
        setCurrentWithoutIngredient('');
      }
    }
  };

  const removeIngredient = (type, index) => {
    if (type === 'with') {
      setWithIngredients(withIngredients.filter((_, i) => i !== index));
    } else {
      setWithoutIngredients(withoutIngredients.filter((_, i) => i !== index));
    }
  };

  const handleKeyPress = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient(type);
    }
  };

  const resetFilters = () => {
    setWithIngredients([]);
    setWithoutIngredients([]);
    setCurrentWithIngredient('');
    setCurrentWithoutIngredient('');
  };

  const applyFilters = () => {
    onApplyFilters({
      withIngredients,
      withoutIngredients
    });
  };

  const hasFilters = withIngredients.length > 0 || withoutIngredients.length > 0;

  return (
    <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-lg p-6 border border-green-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-green-800 flex items-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <Plus size={18} className="text-green-600" />
          </div>
          Filtres avancés
        </h3>
        {hasFilters && (
          <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
            {withIngredients.length + withoutIngredients.length} filtre(s) actif(s)
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* AVEC ces ingrédients */}
        <div>
          <label className="block text-sm font-medium text-green-700 mb-3">
            AVEC ces ingrédients :
          </label>
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Ex: céleri, tomate, etc."
                value={currentWithIngredient}
                onChange={(e) => setCurrentWithIngredient(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'with')}
              />
            </div>
            <button
              onClick={() => addIngredient('with')}
              className="p-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
              disabled={!currentWithIngredient.trim()}
            >
              <Plus size={20} />
            </button>
          </div>
          
          {/* Liste des ingrédients AVEC */}
          {withIngredients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {withIngredients.map((ingredient, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium animate-fadeIn"
                >
                  <Check size={14} className="mr-1.5" />
                  {ingredient}
                  <button
                    onClick={() => removeIngredient('with', index)}
                    className="ml-2 hover:text-green-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* SANS ces ingrédients */}
        <div>
          <label className="block text-sm font-medium text-red-700 mb-3">
            SANS ces ingrédients :
          </label>
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full px-4 py-3 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="Ex: gluten, lactose, etc."
                value={currentWithoutIngredient}
                onChange={(e) => setCurrentWithoutIngredient(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'without')}
              />
            </div>
            <button
              onClick={() => addIngredient('without')}
              className="p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
              disabled={!currentWithoutIngredient.trim()}
            >
              <Plus size={20} />
            </button>
          </div>
          
          {/* Liste des ingrédients SANS */}
          {withoutIngredients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {withoutIngredients.map((ingredient, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-sm font-medium animate-fadeIn"
                >
                  <X size={14} className="mr-1.5" />
                  {ingredient}
                  <button
                    onClick={() => removeIngredient('without', index)}
                    className="ml-2 hover:text-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info message */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start">
          <Info size={18} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            Les filtres s'appliquent sur tous les champs du produit : nom, ingrédients et traces éventuelles.
          </p>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={resetFilters}
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300 flex items-center"
          disabled={!hasFilters}
        >
          <RefreshCw size={18} className="mr-2" />
          Réinitialiser
        </button>
        <button
          onClick={applyFilters}
          className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02] flex items-center"
        >
          <Check size={18} className="mr-2" />
          Appliquer les filtres
        </button>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdvancedSearchFilters;