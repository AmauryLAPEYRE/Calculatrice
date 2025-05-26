// src/components/PageNutri.js - Sections modernisées
import React from 'react';
import { 
  Star, 
  Lock, 
  Info, 
  AlertTriangle, 
  Leaf, 
  Apple,
  Sparkles,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import useSubscriptionPermissions from '../hooks/useSubscriptionPermissions';

const PageNutri = ({ product, renderIngredients, ingredientsLanguage, setIngredientsLanguage, languageButtonStyle }) => {
  const { isAuthorized } = useSubscriptionPermissions();
  const hasNutriAccess = isAuthorized('nutrition_info');
  
  const RestrictedOverlay = ({ title }) => (
    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-2xl">
      <div className="text-center p-8">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Lock className="text-amber-600" size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">Disponible avec un abonnement premium</p>
        <button 
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          onClick={() => window.location.href = '/abonnements'}
        >
          <Sparkles size={18} className="mr-2" />
          Débloquer cette fonctionnalité
        </button>
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="space-y-8">
      {/* Valeurs nutritionnelles - Section moderne */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center">
          <BarChart3 size={24} className="mr-3 text-green-600" />
          Valeurs nutritionnelles
          <span className="ml-3 text-sm font-normal text-gray-600">(pour 100g)</span>
        </h3>
        
        {product.nutriments ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Énergie */}
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Énergie</span>
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <Sparkles size={16} className="text-amber-600" />
                </div>
              </div>
              <p className="text-lg font-bold text-gray-800">
                {product.nutriments.energy_100g || 'N/A'} {product.nutriments.energy_unit || 'kcal'}
              </p>
              {product.nutriments.energy_kcal_100g && (
                <p className="text-xs text-gray-500 mt-1">
                  ({product.nutriments.energy_kcal_100g} kcal)
                </p>
              )}
            </div>
            
            {/* Autres nutriments avec style moderne */}
            {[
              { key: 'fat_100g', label: 'Matières grasses', saturated: 'saturated_fat_100g', color: 'orange' },
              { key: 'carbohydrates_100g', label: 'Glucides', sugars: 'sugars_100g', color: 'purple' },
              { key: 'proteins_100g', label: 'Protéines', color: 'blue' },
              { key: 'salt_100g', label: 'Sel', color: 'red' },
              { key: 'fiber_100g', label: 'Fibres', color: 'green' }
            ].map((nutrient) => {
              if (!product.nutriments[nutrient.key] && nutrient.key !== 'fiber_100g') return null;
              if (nutrient.key === 'fiber_100g' && !product.nutriments.fiber_100g) return null;
              
              return (
                <div key={nutrient.key} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">{nutrient.label}</span>
                    <div className={`w-8 h-8 bg-${nutrient.color}-100 rounded-full flex items-center justify-center`}>
                      <div className={`w-3 h-3 bg-${nutrient.color}-500 rounded-full`}></div>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {product.nutriments[nutrient.key] || 'N/A'}g
                  </p>
                  {nutrient.saturated && product.nutriments[nutrient.saturated] && (
                    <p className="text-xs text-gray-500 mt-1">
                      dont saturées: {product.nutriments[nutrient.saturated]}g
                    </p>
                  )}
                  {nutrient.sugars && product.nutriments[nutrient.sugars] && (
                    <p className="text-xs text-gray-500 mt-1">
                      dont sucres: {product.nutriments[nutrient.sugars]}g
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center">
            <Info size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Informations nutritionnelles non disponibles</p>
          </div>
        )}
      </div>
      
      {/* Ingrédients avec sélecteur de langue moderne */}
      {(product.ingredients_text_fr || product.ingredients_text_en || product.ingredients_text) && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <Apple size={24} className="mr-3 text-green-600" />
              Ingrédients
            </h3>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { lang: 'fr', label: 'FR', disabled: !product.ingredients_text_fr },
                { lang: 'en', label: 'EN', disabled: !product.ingredients_text_en },
                { lang: 'origin', label: 'Original', disabled: !product.ingredients_text }
              ].map((btn) => (
                <button
                  key={btn.lang}
                  onClick={() => setIngredientsLanguage(btn.lang)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
                    ingredientsLanguage === btn.lang
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  } ${btn.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={btn.disabled}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-gray-700 leading-relaxed">{renderIngredients()}</p>
            {product.ingredients_n && (
              <p className="text-sm text-gray-500 mt-4 flex items-center">
                <Info size={16} className="mr-2" />
                {product.ingredients_n} ingrédients identifiés
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Allergènes avec design moderne */}
      {(product.allergens || product.allergens_tags?.length > 0 || product.traces || product.traces_tags?.length > 0) && (
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
            <AlertTriangle size={24} className="mr-3 text-red-600" />
            Allergènes
          </h3>
          
          <div className="space-y-4">
            {(product.allergens || product.allergens_tags?.length > 0) && (
              <div>
                <p className="font-semibold text-red-700 mb-2">Contient :</p>
                <div className="flex flex-wrap gap-2">
                  {product.allergens_tags ? (
                    product.allergens_tags.map((allergen, index) => (
                      <span key={index} className="bg-red-100 text-red-800 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                        {allergen.replace('en:', '')}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-700">{product.allergens}</span>
                  )}
                </div>
              </div>
            )}
            
            {(product.traces || product.traces_tags?.length > 0) && (
              <div>
                <p className="font-semibold text-orange-700 mb-2">Peut contenir :</p>
                <div className="flex flex-wrap gap-2">
                  {product.traces_tags ? (
                    product.traces_tags.map((trace, index) => (
                      <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                        {trace.replace('en:', '')}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-700">{product.traces}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Les sections restreintes gardent leur structure mais avec le nouveau RestrictedOverlay */}
    </div>
  );
};

export default PageNutri;