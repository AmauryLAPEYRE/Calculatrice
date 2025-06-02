// src/components/review/PurchaseInfoSection.js
import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, ShoppingBag, MapPin, Globe, Eye, EyeOff, Save, X,CheckCircle,Receipt } from 'lucide-react';
import { formatDate, formatPriceWithCurrency } from '../../utils/formatters';
import { getActiveCountries, updateReceiptAndEnseigne } from '../../services/unifiedReceiptService';

/**
 * Section pour afficher et éditer les informations d'achat
 * @param {Object} props - Propriétés du composant
 * @param {boolean} props.aiDataAvailable - Indique si des données IA sont disponibles
 * @param {string} props.purchaseDate - Date d'achat
 * @param {number} props.purchasePrice - Prix d'achat
 * @param {string} props.storeName - Nom du magasin
 * @param {string} props.postalCode - Code postal
 * @param {string} props.receiptId - ID du ticket de caisse
 * @param {function} props.onUpdate - Fonction appelée après mise à jour réussie
 */
const PurchaseInfoSection = ({ 
  aiDataAvailable, 
  purchaseDate, 
  purchasePrice, 
  storeName, 
  postalCode,
  receiptId,
  onUpdate
}) => {
  // États pour le mode édition
  const [isEditing, setIsEditing] = useState(false);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // États pour les valeurs éditables
  const [editedData, setEditedData] = useState({
    purchaseDate: purchaseDate || '',
    purchasePrice: purchasePrice || '',
    storeName: storeName || '',
    postalCode: postalCode || '',
    country: 'FR', // Valeur par défaut
    allowPublicDisplay: true
  });
  
  // État pour la devise
  const [currencyCode, setCurrencyCode] = useState('EUR');

  // Charger la liste des pays au montage
  useEffect(() => {
    loadCountries();
  }, []);

  // Mettre à jour les valeurs éditées quand les props changent
  useEffect(() => {
    setEditedData(prev => ({
      ...prev,
      purchaseDate: purchaseDate || '',
      purchasePrice: purchasePrice || '',
      storeName: storeName || '',
      postalCode: postalCode || ''
    }));
  }, [purchaseDate, purchasePrice, storeName, postalCode]);

  // Mettre à jour la devise quand le pays change
  useEffect(() => {
    const selectedCountry = countries.find(c => c.code === editedData.country);
    if (selectedCountry) {
      setCurrencyCode(selectedCountry.currency_code);
    }
  }, [editedData.country, countries]);

  // Effacer le message de succès après 3 secondes
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Charger la liste des pays actifs
  const loadCountries = async () => {
    try {
      const { success, countries: countryList } = await getActiveCountries();
      if (success) {
        setCountries(countryList);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des pays:', err);
    }
  };

  // Gérer les changements de valeurs
  const handleChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Activer le mode édition
  const startEditing = () => {
    setIsEditing(true);
    setError(null);
    setSuccessMessage(null);
  };

  // Annuler l'édition
  const cancelEditing = () => {
    setIsEditing(false);
    setError(null);
    setSuccessMessage(null);
    // Réinitialiser les valeurs
    setEditedData({
      purchaseDate: purchaseDate || '',
      purchasePrice: purchasePrice || '',
      storeName: storeName || '',
      postalCode: postalCode || '',
      country: 'FR',
      allowPublicDisplay: false
    });
  };

  // Sauvegarder les modifications
  const saveChanges = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validation des données
      if (!editedData.purchaseDate) {
        setError('La date d\'achat est requise');
        setLoading(false);
        return;
      }

      // Appeler le service pour mettre à jour le ticket et l'enseigne
      const result = await updateReceiptAndEnseigne(receiptId, editedData);
      
      if (result.success) {
        setIsEditing(false);
        setSuccessMessage('Informations mises à jour avec succès');
        
        // Appeler la fonction de callback si fournie
        if (onUpdate) {
          onUpdate(result.data);
        }
      } else {
        setError(result.error || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      setError('Erreur lors de la sauvegarde des modifications');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Ne pas afficher la section si pas de données AI et pas en mode édition
  if (!aiDataAvailable && !isEditing) {
    return null;
  }

  const hasAnyInfo = purchaseDate || purchasePrice || storeName || postalCode;
  if (!hasAnyInfo && !isEditing) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-gray-800">
          Informations d'achat {aiDataAvailable && 'extraites'}
        </h4>
        {!isEditing ? (
          <button
            onClick={startEditing}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            Modifier
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={saveChanges}
              disabled={loading}
              className="text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
              title="Enregistrer"
            >
              <Save size={18} />
            </button>
            <button
              onClick={cancelEditing}
              disabled={loading}
              className="text-gray-600 hover:text-gray-700 transition-colors disabled:opacity-50"
              title="Annuler"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Messages de feedback */}
      {error && (
        <div className="mb-3 p-2 bg-red-50 text-red-600 text-sm rounded">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-3 p-2 bg-green-50 text-green-600 text-sm rounded">
          {successMessage}
        </div>
      )}

      <div className="space-y-4">
        {/* Première ligne : Date et Magasin */}
        <div className="grid grid-cols-2 gap-4">
          {isEditing ? (
            <>
              <EditableField
                icon={<Calendar size={16} className="text-green-600" />}
                label="Date d'achat"
                type="date"
                value={editedData.purchaseDate}
                onChange={(value) => handleChange('purchaseDate', value)}
                required
              />
              <EditableField
                icon={<ShoppingBag size={16} className="text-green-600" />}
                label="Magasin"
                type="text"
                value={editedData.storeName}
                onChange={(value) => handleChange('storeName', value)}
                placeholder="Nom du magasin"
              />
            </>
          ) : (
            <>
              {purchaseDate && (
                <PurchaseInfoItem
                  icon={<Calendar size={16} className="text-green-600" />}
                  label="Date d'achat"
                  value={formatDate(purchaseDate)}
                />
              )}
              {storeName && (
                <PurchaseInfoItem
                  icon={<ShoppingBag size={16} className="text-green-600" />}
                  label="Magasin"
                  value={storeName}
                />
              )}
            </>
          )}
        </div>

        {/* Deuxième ligne : Prix et Code postal */}
        <div className="grid grid-cols-2 gap-4">
          {isEditing ? (
            <>
                <div className="col-span-1">
      <div className="flex items-start">
        <Globe size={16} className="text-green-600 mt-1" />
        <div className="ml-2 flex-1">
          <label className="text-gray-700 text-sm">Pays</label>
          <select
            value={editedData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className="mt-1 w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            disabled={loading}
          >
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.name_fr} ({country.code})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>

              <EditableField
                icon={<MapPin size={16} className="text-green-600" />}
                label="Code Postal"
                type="text"
                value={editedData.postalCode}
                onChange={(value) => handleChange('postalCode', value)}
                placeholder="00000"
                maxLength="10"
              />
            </>
          ) : (
            <>
               {postalCode && (
                <PurchaseInfoItem
                  icon={<MapPin size={16} className="text-green-600" />}
                  label="Code Postal"
                  value={postalCode}
                />
              )}
              
          
                  <div className="col-span-1 flex items-start">
                      <PurchaseInfoItem
                  icon={<Globe size={16} className="text-green-600 mt-1" />}
                  label="Pays"
                  value={
            countries.find(c => c.code === editedData.country)?.name_fr
            || editedData.country
          }
                />
      
    </div>
             
            </>
          )}
        </div>

        {/* Troisième ligne : Pays (uniquement en mode édition) */}
{isEditing ? (
  <div className="grid grid-cols-2 gap-4">
              <PurchaseInfoItem
                icon={<DollarSign size={16} className="text-green-600" />}
                label={`Montant total du ticket (${currencyCode})`}
                type="number"
                value={formatPriceWithCurrency(parseFloat(purchasePrice), currencyCode)}
                onChange={(value) => handleChange('purchasePrice', value)}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
    <div className="col-span-1 flex items-center">
      <span className="text-sm text-gray-600">
        Devise : <strong>{currencyCode}</strong>
      </span>
    </div>
  </div>
) : (
  <div className="grid grid-cols-2 gap-4">
    {purchasePrice && (
                <PurchaseInfoItem
                  icon={<DollarSign size={16} className="text-green-600" />}
                  label="Montant total du ticket"
                  value={formatPriceWithCurrency(parseFloat(purchasePrice), currencyCode)}
                />
              )}
    <div className="col-span-1 flex items-center">
                      <PurchaseInfoItem
                  icon={<Receipt size={16} className="text-green-600" />}
                  label="Devise"
                  value={currencyCode}
                />
    </div>
  </div>
)}

        {/* Case à cocher pour l'affichage public (uniquement en mode édition) */}
{/* Case à cocher pour l'affichage public */}
{isEditing ? (
  
  <div className="p-3 bg-green-50 rounded-md">
        <p className="text-green-700 flex items-center mb-3">
        <CheckCircle size={16} className="mr-2" />
        Ticket de caisse validé
      </p>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="authorizeSharing"
          className="mr-2 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          checked={editedData.allowPublicDisplay}
          onChange={(e) => handleChange('allowPublicDisplay', e.target.checked)}
        />
        <span className="flex items-center text-sm text-gray-700">
                  {editedData.allowPublicDisplay ? (
          <Eye size={16} className="mr-1 text-green-600" />
        ) : (
          <EyeOff size={16} className="mr-1 text-gray-400" />
        )}
          J'autorise le partage de mon ticket de caisse
        </span>
        
      </div>
            <p className="text-xs text-gray-500 mt-1">
        Cette option permet aux autres utilisateurs de voir votre ticket pour vérifier l'authenticité de l'avis.
        Votre ticket sera anonymisé avant d'être partagé.
      </p>
  </div>
) : (


  
<div className="p-3 bg-green-50 rounded-md">
    <p className="text-green-700 flex items-center mb-3">
        <CheckCircle size={16} className="mr-2" />
        Ticket de caisse validé
      </p>
            <div className="flex items-center">
        <input
          type="checkbox"
          id="authorizeSharing"
          className="mr-2 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
          checked={editedData.allowPublicDisplay}
          disabled
        />
        <span className="flex items-center text-sm text-gray-700">
                  {editedData.allowPublicDisplay ? (
          <Eye size={16} className="mr-1 text-green-600" />
        ) : (
          <EyeOff size={16} className="mr-1 text-gray-400" />
        )}
          J'autorise le partage de mon ticket de caisse
        </span>
        
      </div>
            <p className="text-xs text-gray-500 mt-1">
        Cette option permet aux autres utilisateurs de voir votre ticket pour vérifier l'authenticité de l'avis.
        Votre ticket sera anonymisé avant d'être partagé.
      </p>
</div>
)}

        {/* Note sur l'extraction IA */}
        {aiDataAvailable && !isEditing && (
          <p className="text-xs text-gray-500 italic mt-1">
            Ces informations ont été extraites automatiquement de votre ticket de caisse par IA.
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Champ éditable
 */
const EditableField = ({ 
  icon, 
  label, 
  type, 
  value, 
  onChange, 
  placeholder, 
  step, 
  min, 
  maxLength,
  required 
}) => {
  return (
    <div className="flex items-start">
      {icon}
      <div className="ml-2 flex-1">
        <label className="text-gray-700 text-sm">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          step={step}
          min={min}
          maxLength={maxLength}
          className="mt-1 w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-green-500"
        />
      </div>
    </div>
  );
};

/**
 * Item individuel pour une information d'achat (lecture seule)
 */
const PurchaseInfoItem = ({ icon, label, value }) => {
  return (
    <div className="flex items-center">
      {icon}
      <span className="ml-2 text-gray-700">
        {label} : <strong>{value}</strong>
      </span>
    </div>
  );
};

export default PurchaseInfoSection;