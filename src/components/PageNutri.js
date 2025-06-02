// src/components/PageNutri.js - Sections modernisées et responsives
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

// Style CSS pour les sections restreintes (floutées)
  const restrictedSectionStyle = {
    position: 'relative',
    filter: 'blur(8px)',
    pointerEvents: 'none',
    userSelect: 'none',
  };
  
  // Composant pour overlay de restriction avec message - Style cohérent avec PageEnvir
  const RestrictedOverlay = ({ title }) => (
    <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-10 rounded-md border border-gray-200">
      <Lock className="text-gray-500 mb-2 sm:mb-3" size={24} />
      <p className="text-center font-medium text-gray-800 mb-1 text-sm sm:text-base px-2">{title}</p>
      <p className="text-center text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 px-2">Disponible avec un abonnement premium</p>
      <button 
        className="px-4 py-2 sm:px-6 sm:py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm text-sm sm:text-base"
        onClick={() => window.location.href = '/abonnements'}
      >
        Voir les abonnements
      </button>
    </div>
  );

  // Fonction pour parser le texte des allergènes et convertir les balises HTML en composants React
  const parseAllergensText = (text) => {
    if (!text) return null;
    
    // Regex pour trouver les balises <span class="allergen">...</span>
    const allergenRegex = /<span class="allergen">(.*?)<\/span>/gi;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    // Parcourir toutes les occurrences de balises allergen
    while ((match = allergenRegex.exec(text)) !== null) {
      // Ajouter le texte avant la balise
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Ajouter l'allergène stylé
      parts.push(
        <span 
          key={match.index} 
          className="inline-block bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium mx-1"
        >
          {match[1]}
        </span>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Ajouter le texte restant après la dernière balise
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };

  if (!product) return null;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Valeurs nutritionnelles - Section moderne et responsive */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center">
          <div className="flex items-center mb-2 sm:mb-0">
            <BarChart3 size={20} className="sm:w-6 sm:h-6 mr-2 sm:mr-3 text-green-600" />
            <span>Valeurs nutritionnelles</span>
          </div>
          <span className="text-xs sm:text-sm font-normal text-gray-600 sm:ml-3">(pour 100g)</span>
        </h3>
        
        {product.nutriments ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Énergie - RESPONSIVE */}
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-600">Énergie</span>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <Sparkles size={12} className="sm:w-4 sm:h-4 text-amber-600" />
                </div>
              </div>
              <p className="text-base sm:text-lg font-bold text-gray-800">
                {product.nutriments.energy_100g || 'N/A'} {product.nutriments.energy_unit || 'kcal'}
              </p>
              {product.nutriments.energy_kcal_100g && (
                <p className="text-xs text-gray-500 mt-1">
                  ({product.nutriments.energy_kcal_100g} kcal)
                </p>
              )}
            </div>
            
            {/* Autres nutriments avec style moderne et responsive */}
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
                <div key={nutrient.key} className="bg-white rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-600">{nutrient.label}</span>
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-${nutrient.color}-100 rounded-full flex items-center justify-center`}>
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 bg-${nutrient.color}-500 rounded-full`}></div>
                    </div>
                  </div>
                  <p className="text-base sm:text-lg font-bold text-gray-800">
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
          <div className="bg-white rounded-xl p-6 sm:p-8 text-center">
            <Info size={36} className="sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-500 text-sm sm:text-base">Informations nutritionnelles non disponibles</p>
          </div>
        )}
      </div>
      
      {/* Ingrédients avec sélecteur de langue moderne et responsive */}
      {(product.ingredients_text_fr || product.ingredients_text_en || product.ingredients_text) && (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
              <Apple size={20} className="sm:w-6 sm:h-6 mr-2 sm:mr-3 text-green-600" />
              Ingrédients
            </h3>
            {/* Sélecteur de langue responsive */}
            <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto overflow-x-auto">
              {[
                { lang: 'fr', label: 'FR', disabled: !product.ingredients_text_fr },
                { lang: 'en', label: 'EN', disabled: !product.ingredients_text_en },
                { lang: 'origin', label: 'Original', disabled: !product.ingredients_text }
              ].map((btn) => (
                <button
                  key={btn.lang}
                  onClick={() => setIngredientsLanguage(btn.lang)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 flex-shrink-0 ${
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
          
          <div className="bg-green-50 rounded-xl p-3 sm:p-4">
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{renderIngredients()}</p>
            {product.ingredients_n && (
              <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 flex items-center">
                <Info size={14} className="sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                {product.ingredients_n} ingrédients identifiés
              </p>
            )}
          </div>
        </div>
      )}
   
      {/* Allergènes avec design moderne et responsive */}
{(product.allergens || product.allergens_tags?.length > 0 || product.traces || product.traces_tags?.length > 0 || product.ingredients_text_with_allergens_fr || product.ingredients_text_with_allergens_fr?.length > 0) && (
  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-lg p-4 sm:p-6">
    <h3 className="text-lg sm:text-xl font-bold text-red-800 mb-3 sm:mb-4 flex items-center">
      <AlertTriangle size={20} className="sm:w-6 sm:h-6 mr-2 sm:mr-3 text-red-600" />
      Allergènes
    </h3>
    
    <div className="space-y-3 sm:space-y-4">
      {/* Section Allergènes principaux - RESPONSIVE */}
      {(product.allergens || product.allergens_tags?.length > 0) && (
        <div>
          <p className="font-semibold text-red-700 mb-2 text-sm sm:text-base">Contient :</p>
          <div className="flex flex-wrap gap-2">
            {product.allergens_tags ? (
              product.allergens_tags.map((allergen, index) => (
                <span key={index} className="bg-red-100 text-red-800 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-sm">
                  {allergen.replace('en:', '')}
                </span>
              ))
            ) : (
              <span className="text-gray-700 text-sm sm:text-base">{product.allergens}</span>
            )}
          </div>
        </div>
      )}
      
      {/* Section Traces d'allergènes - RESPONSIVE */}
      {(product.traces || product.traces_tags?.length > 0) && (
        <div>
          <p className="font-semibold text-orange-700 mb-2 text-sm sm:text-base">Peut contenir (traces) :</p>
          <div className="flex flex-wrap gap-2">
            {product.traces_tags ? (
              product.traces_tags.map((trace, index) => (
                <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-sm">
                  {trace.replace('en:', '')}
                </span>
              ))
            ) : (
              <span className="text-gray-700 text-sm sm:text-base">{product.traces}</span>
            )}
          </div>
        </div>
      )}

      {/* Section Texte détaillé des allergènes - RESPONSIVE */}
      {product.ingredients_text_with_allergens_fr && product.ingredients_text_with_allergens_fr.length > 0 && (
        <div>
          <p className="font-semibold text-blue-700 mb-2 text-sm sm:text-base">Informations détaillées :</p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 rounded-r-lg">
            <div className="text-blue-800 text-xs sm:text-sm leading-relaxed">
              {parseAllergensText(product.ingredients_text_with_allergens_fr)}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}

{/* Additifs - RESPONSIVE */}
{product.additives_tags && product.additives_tags.length > 0 && (
        <div className="mt-4 sm:mt-6 relative">
          <div style={!hasNutriAccess ? restrictedSectionStyle : {}} className="relative">
            <h3 className="text-lg font-semibold mb-2 sm:text-xl">Additifs</h3>

            <div className="p-3 sm:p-4 bg-yellow-50 rounded-md relative">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {product.additives_tags.map((additive, index) => {
                  const additiveName = additive.replace('en:', '');
                  const additiveCode = additiveName.split(' - ')[0];
                  const additiveLabel = additiveName.includes(' - ') ? additiveName.split(' - ')[1] : '';
                  
                  return (
                    <div key={index} className="bg-yellow-100 px-2 py-1 sm:px-3 rounded-md m-1">
                      <span className="font-medium text-yellow-800 text-xs sm:text-sm">{additiveCode}</span>
                      {additiveLabel && <span className="text-gray-700 text-xs ml-1">({additiveLabel})</span>}
                    </div>
                  );
                })}
              </div>
              
              {product.additives_n && (
                <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  Nombre d'additifs : {product.additives_n}
                </p>
              )}
            </div>
          </div>
          
          {!hasNutriAccess && <RestrictedOverlay title="Informations sur les additifs" />}
        </div>
      )}

{/* Régimes spécifiques - RESPONSIVE */}
            {product.ingredients_analysis_tags && (
        <div className="mt-4 sm:mt-6 relative">
          <div style={!hasNutriAccess ? restrictedSectionStyle : {}} className="relative">
            <h3 className="text-lg sm:text-xl font-semibold mb-3">Régimes spécifiques</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Végétarien - RESPONSIVE */}
              {product.ingredients_analysis_tags.filter(tag => tag.includes('vegetarian')).length > 0 && (
                <div className="p-3 sm:p-4 rounded-md bg-green-50">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      product.ingredients_analysis_tags.find(tag => tag.includes('vegetarian')).includes('non-vegetarian') 
                        ? 'bg-red-500' 
                        : product.ingredients_analysis_tags.find(tag => tag.includes('vegetarian')).includes('vegetarian-status-unknown')
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}></div>
                    <h4 className="font-medium text-sm sm:text-base">Végétarien</h4>
                  </div>
                  <p className="text-xs sm:text-sm mt-1 ml-5">
                    {product.ingredients_analysis_tags.find(tag => tag.includes('vegetarian')).includes('vegetarian-status-unknown') 
                      ? 'Statut végétarien incertain' 
                      : product.ingredients_analysis_tags.find(tag => tag.includes('vegetarian')).includes('non-vegetarian') 
                        ? 'Non végétarien' 
                        : 'Végétarien'}
                  </p>
                </div>
              )}
              
              {/* Végan - RESPONSIVE */}
              {product.ingredients_analysis_tags.filter(tag => tag.includes('vegan')).length > 0 && (
                <div className="p-3 sm:p-4 rounded-md bg-green-50">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      product.ingredients_analysis_tags.find(tag => tag.includes('vegan')).includes('non-vegan') 
                        ? 'bg-red-500' 
                        : product.ingredients_analysis_tags.find(tag => tag.includes('vegan')).includes('vegan-status-unknown')
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}></div>
                    <h4 className="font-medium text-sm sm:text-base">Végan</h4>
                  </div>
                  <p className="text-xs sm:text-sm mt-1 ml-5">
                    {product.ingredients_analysis_tags.find(tag => tag.includes('vegan')).includes('vegan-status-unknown') 
                      ? 'Statut végan incertain' 
                      : product.ingredients_analysis_tags.find(tag => tag.includes('vegan')).includes('non-vegan') 
                        ? 'Non végan' 
                        : 'Végan'}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {!hasNutriAccess && <RestrictedOverlay title="Analyse des régimes alimentaires" />}
        </div>
      )}

{/* Nutri-Score - RESPONSIVE */}
      {product.nutriscore_grade && (
        <div className="mt-4 sm:mt-6 relative">
          <div style={!hasNutriAccess ? restrictedSectionStyle : {}} className="relative">
            <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Nutri-Score</h4>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0">
              <div className="flex space-x-1 sm:space-x-2 justify-center sm:justify-start">
                {['a', 'b', 'c', 'd', 'e'].map((grade) => (
                  <div 
                    key={grade} 
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-white text-sm sm:text-base
                      ${product.nutriscore_grade === grade ? 'ring-2 ring-offset-2 ring-green-500 transform scale-110' : ''}
                      ${grade === 'a' ? 'bg-green-500' : 
                        grade === 'b' ? 'bg-green-300' : 
                        grade === 'c' ? 'bg-yellow-400' : 
                        grade === 'd' ? 'bg-orange-400' : 
                        'bg-red-500'}`}
                  >
                    {grade.toUpperCase()}
                  </div>
                ))}
              </div>
              <div className="sm:ml-4 text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                <p>Le Nutri-Score est un indicateur nutritionnel qui note les produits de A à E, où A représente les produits les plus sains et E les moins sains.</p>
                {product.nutriscore_data && product.nutriscore_data.is_beverage && product.nutriments.alcohol_100g && (
                  <p className="mt-1 text-orange-600">(Non applicable car boisson alcoolisée)</p>
                )}
              </div>
            </div>
          </div>
          
          {!hasNutriAccess && <RestrictedOverlay title="Nutri-Score détaillé" />}
        </div>
      )}

{/* Classification NOVA - RESPONSIVE */}
{product.nova_group && (
        <div className="mt-4 sm:mt-6 relative">
          <div style={!hasNutriAccess ? restrictedSectionStyle : {}} className="relative">
            <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Classification NOVA</h4>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
              <div className={`px-3 py-2 sm:px-4 rounded-md text-white font-medium text-center sm:text-left text-sm sm:text-base
                ${product.nova_group === 1 ? 'bg-green-500' : 
                product.nova_group === 2 ? 'bg-yellow-400' : 
                product.nova_group === 3 ? 'bg-orange-400' : 
                'bg-red-500'}`}>
                Groupe {product.nova_group}
              </div>
              <span className="text-xs sm:text-sm text-gray-600 sm:ml-3 text-center sm:text-left">
                {product.nova_group === 1 ? 'Aliment non transformé ou peu transformé' : 
                 product.nova_group === 2 ? 'Ingrédient culinaire transformé' : 
                 product.nova_group === 3 ? 'Aliment transformé' : 
                 'Aliment ultra-transformé'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 text-center sm:text-left">La classification NOVA catégorise les aliments selon leur degré de transformation industrielle.</p>

          </div>
          
          {!hasNutriAccess && <RestrictedOverlay title="Classification NOVA" />}
        </div>
      )}

    
      
    </div>
  );
};

export default PageNutri;