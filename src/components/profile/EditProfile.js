// src/components/profile/EditProfile.js
import React, { useState, useEffect, useRef } from 'react';
import { updateProfile } from 'firebase/auth';
import { auth, storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../contexts/AuthContext';
import { User, Check, AlertCircle, MapPin, Camera, RefreshCw, Upload, Loader ,ChevronDown, Globe} from 'lucide-react';
import ProfileLayout from './ProfileLayout';
import { supabase } from '../../supabaseClient';
import UserAvatar from './UserAvatar';

const EditProfile = () => {
  const { currentUser, refreshUserDetails, userDetails } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  // Ajouter les états pour les nouveaux champs
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // États pour la gestion de l'avatar
  const [avatarMode, setAvatarMode] = useState('dicebear'); // 'dicebear' ou 'custom'
  const [avatarSeed, setAvatarSeed] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const fileInputRef = useRef(null);
// Nouveaux states pour les listes
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState(''); // Nouveau champ langue
  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingLanguages, setLoadingLanguages] = useState(false);

  // Fonction pour récupérer les pays actifs
  const fetchCountries = async (countryP) => {
    if (countryP === '') {countryP="FR"}

    setLoadingCountries(true);
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('code, name_fr, name_en')
        .eq('is_active', true)
        .order('name_fr', { ascending: true });

      if (error) throw error;
      setCountries(data || []);
          // Auto-sélection de la France si elle existe dans la liste
    const franceExists = data?.some(country => country.code === countryP);
    if (franceExists && !country) { // Seulement si aucun pays n'est déjà sélectionné
      setCountry(countryP);
    }
    } catch (error) {
      console.error('Erreur lors du chargement des pays:', error);
    } finally {
      setLoadingCountries(false);
    }
  };

  // Fonction pour récupérer les langues actives
  const fetchLanguages = async () => {
    setLoadingLanguages(true);
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('code, name_fr, name_en, name_native')
        .eq('is_active', true)
        .order('name_fr', { ascending: true });

      if (error) throw error;
      setLanguages(data || []);

          // Auto-sélection du français
    const frenchExists = data?.some(lang => lang.code === 'fr');
    if (frenchExists && !language) { // Seulement si aucune langue n'est déjà sélectionnée
      setLanguage('fr');
    }
    } catch (error) {
      console.error('Erreur lors du chargement des langues:', error);
    } finally {
      setLoadingLanguages(false);
    }
  };
// 3. ALTERNATIVE : Fonction pour détecter automatiquement la langue du navigateur
const detectBrowserLanguage = () => {
  // Récupère la langue du navigateur
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0].toLowerCase(); // ex: 'fr-FR' -> 'fr'
  
  return langCode;
};

  // 4. ALTERNATIVE : Fonction plus sophistiquée avec détection automatique
const setupDefaultSelections = (countries, languages) => {
  // Auto-sélection du pays (France par défaut)
  if (countries.length > 0 && !country) {
    const franceExists = countries.some(c => c.code === 'FR');
    if (franceExists) {
      setCountry('FR');
    }
  }
  
  // Auto-sélection de la langue (basée sur le navigateur ou français par défaut)
  if (languages.length > 0 && !language) {
    const browserLang = detectBrowserLanguage();
    const browserLangExists = languages.some(l => l.code === browserLang);
    
    if (browserLangExists) {
      setLanguage(browserLang);
    } else {
      // Fallback vers le français si disponible
      const frenchExists = languages.some(l => l.code === 'fr');
      if (frenchExists) {
        setLanguage('fr');
      }
    }
  }
};

// 6. Ajoutez un nouvel useEffect pour gérer les sélections par défaut
useEffect(() => {
  // Attendre que les deux listes soient chargées
  if (countries.length > 0 && languages.length > 0) {
    setupDefaultSelections(countries, languages);
  }
}, [countries, languages]); // Se déclenche quand les données sont chargées

// 7. OPTION BONUS : Fonction pour détecter le pays via l'IP (nécessite une API externe)
const detectCountryByIP = async () => {
  try {
    // Utilise une API gratuite pour détecter le pays
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code; // Retourne le code pays (ex: 'FR')
  } catch (error) {
    console.error('Erreur détection pays:', error);
    return 'FR'; // Fallback vers France
  }
};
// 8. VERSION AVANCÉE avec détection IP (optionnelle)
const setupAdvancedDefaults = async (countries, languages) => {
  // Détection du pays
  if (countries.length > 0 && !country) {
    try {
      const detectedCountry = await detectCountryByIP();
      const countryExists = countries.some(c => c.code === detectedCountry);
      if (countryExists) {
        setCountry(detectedCountry);
      } else {
        // Fallback vers France
        const franceExists = countries.some(c => c.code === 'FR');
        if (franceExists) setCountry('FR');
      }
    } catch {
      // En cas d'erreur, utiliser France par défaut
      const franceExists = countries.some(c => c.code === 'FR');
      if (franceExists) setCountry('FR');
    }
  }
  
  // Détection de la langue (identique à la version précédente)
  if (languages.length > 0 && !language) {
    const browserLang = detectBrowserLanguage();
    const browserLangExists = languages.some(l => l.code === browserLang);
    
    if (browserLangExists) {
      setLanguage(browserLang);
    } else {
      const frenchExists = languages.some(l => l.code === 'fr');
      if (frenchExists) setLanguage('fr');
    }
  }
};

  useEffect(() => {
    // Remplir les champs avec les données actuelles de l'utilisateur
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setEmail(currentUser.email || '');
    }
    
    // Remplir les champs d'adresse et avatar s'ils existent dans userDetails
    if (userDetails) {
      setCountry(userDetails.country || '');
      setCity(userDetails.city || '');
      setPostalCode(userDetails.postalCode || '');
      setAvatarSeed(userDetails.avatarSeed || userDetails.firebase_uid || '');
      setCustomAvatarUrl(userDetails.avatarUrl || '');
      setAvatarMode(userDetails.avatarUrl ? 'custom' : 'dicebear');
    }
    fetchCountries(userDetails.country || 'FR');
    fetchLanguages();
  }, [currentUser, userDetails]);

  // Générer un nouveau seed aléatoire pour l'avatar
  const generateNewAvatarSeed = () => {
    const newSeed = `${userDetails?.firebase_uid || currentUser?.uid}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setAvatarSeed(newSeed);
    setAvatarMode('dicebear');
    setCustomAvatarUrl('');
  };

  // Gérer l'upload d'une image personnalisée
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Format de fichier non supporté. Utilisez JPG, PNG ou WebP.');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Le fichier est trop volumineux. Taille maximale : 5MB.');
      return;
    }

    setUploadingAvatar(true);
    setError('');

    try {
      // Créer une référence unique pour le fichier
      const fileName = `avatars/${currentUser.uid}_${Date.now()}.${file.name.split('.').pop()}`;
      const storageRef = ref(storage, fileName);

      // Uploader le fichier
      const snapshot = await uploadBytes(storageRef, file);
      
      // Obtenir l'URL de téléchargement
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setCustomAvatarUrl(downloadURL);
      setAvatarMode('custom');
      
    } catch (err) {
      console.error('Erreur lors de l\'upload de l\'avatar:', err);
      setError('Erreur lors de l\'upload de l\'image. Veuillez réessayer.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérification des champs
    if (!displayName.trim()) {
      setError('Le nom est obligatoire');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const user = auth.currentUser;
      
      if (!user) {
        setError('Vous devez être connecté pour modifier votre profil');
        setLoading(false);
        return;
      }
      
      // Mise à jour du profil dans Firebase
      await updateProfile(user, {
        displayName: displayName
      });
      
      // Mise à jour du profil dans Supabase
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('firebase_uid', user.uid)
        .single();
        
      if (!userError && userData) {
        const updateData = {
          display_name: displayName,
          country: country,
          city: city,
          postal_code: postalCode,
          avatar_seed: avatarMode === 'dicebear' ? avatarSeed : null,
          avatar_url: avatarMode === 'custom' ? customAvatarUrl : null
        };

        const { error: updateError } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', userData.id);
          
        if (updateError) throw updateError;
      }
      
      // Rafraîchir les informations utilisateur dans le contexte
      await refreshUserDetails();
      
      setSuccess(true);
      setShowAvatarOptions(false);
      
      // Réinitialiser le succès après 3 secondes
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (error) {
      setError(`Erreur lors de la modification du profil: ${error.message}`);
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser l'avatar à celui par défaut
  const resetToDefaultAvatar = () => {
    setAvatarSeed(userDetails?.firebase_uid || currentUser?.uid);
    setAvatarMode('dicebear');
    setCustomAvatarUrl('');
  };

  return (
    <ProfileLayout title="Modifier le profil">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex items-start">
          <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded flex items-center">
          <Check size={18} className="mr-2" />
          <span>Profil mis à jour avec succès !</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Section Avatar */}
        <div className="mb-6">
          <div className="flex flex-col items-center">
            {/* Avatar actuel */}
            <div className="relative group">
              {avatarMode === 'custom' && customAvatarUrl ? (
                <img 
                  src={customAvatarUrl}
                  alt="Avatar personnalisé"
                  className="w-32 h-32 rounded-full object-cover border-4 border-green-200"
                />
              ) : (
                <UserAvatar 
                  userId={avatarSeed}
                  size={128}
                  status={userDetails?.status || 'bronze'}
                  displayName={displayName || currentUser?.displayName}
                  className="border-4 border-green-200"
                  showBorder={false}
                />
              )}
              
              {/* Overlay au hover */}
              <div 
                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => setShowAvatarOptions(!showAvatarOptions)}
              >
                <Camera size={32} className="text-white" />
              </div>
              
              {/* Badge de statut */}
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Camera size={20} className="text-green-600" />
              </div>
            </div>
            
            {/* Bouton modifier */}
            <button
              type="button"
              onClick={() => setShowAvatarOptions(!showAvatarOptions)}
              className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium flex items-center"
            >
              <Camera size={16} className="mr-1" />
              Modifier l'avatar
            </button>
          </div>
          
          {/* Options de modification d'avatar */}
          {showAvatarOptions && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Choisir un avatar</h4>
              
              {/* Option 1: Générer un nouvel avatar */}
              <button
                type="button"
                onClick={generateNewAvatarSeed}
                className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-green-50 transition-colors border border-gray-200"
              >
                <div className="flex items-center">
                  <RefreshCw size={20} className="text-green-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Générer un nouvel avatar</p>
                    <p className="text-xs text-gray-500">Avatar aléatoire unique basé sur votre profil</p>
                  </div>
                </div>
              </button>
              
              {/* Option 2: Uploader une image */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-green-50 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center">
                  {uploadingAvatar ? (
                    <Loader size={20} className="text-green-600 mr-3 animate-spin" />
                  ) : (
                    <Upload size={20} className="text-green-600 mr-3" />
                  )}
                  <div className="text-left">
                    <p className="font-medium text-gray-800">
                      {uploadingAvatar ? 'Upload en cours...' : 'Uploader une image'}
                    </p>
                    <p className="text-xs text-gray-500">JPG, PNG ou WebP (max 5MB)</p>
                  </div>
                </div>
              </button>
              
              {/* Input file caché */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {/* Option 3: Réinitialiser */}
              {(avatarMode === 'custom' || avatarSeed !== (userDetails?.firebase_uid || currentUser?.uid)) && (
                <button
                  type="button"
                  onClick={resetToDefaultAvatar}
                  className="w-full text-sm text-gray-600 hover:text-gray-800 py-2"
                >
                  Réinitialiser à l'avatar par défaut
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Reste du formulaire */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="displayName">
            Nom / Pseudo
          </label>
          <div className="relative">
            <input
              type="text"
              id="displayName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pl-10"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
            <User size={18} className="text-gray-500 absolute left-3 top-2.5" />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100"
            value={email}
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">
            L'adresse email ne peut pas être modifiée
          </p>
        </div>
        
        {/* Nouveaux champs d'adresse */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Informations d'adresse</h3>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="country">
              Pays
            </label>
                  <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin size={16} className="text-gray-400" />
                          </div>
                          <select
                            id="country"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            disabled={loadingCountries}
                          >
                            <option value="">
                              {loadingCountries ? 'Chargement...' : 'Sélectionnez un pays'}
                            </option>
                            {countries.map((countryItem) => (
                              <option key={countryItem.code} value={countryItem.code}>
                                {countryItem.name_fr}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <ChevronDown size={16} className="text-gray-400" />
                          </div>
                  </div>
                  
                      {/* Nouveau champ Langue */}
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="language">
                          Langue préférée
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Globe size={16} className="text-gray-400" />
                          </div>
                          <select
                            id="language"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            disabled={loadingLanguages}
                          >
                            <option value="">
                              {loadingLanguages ? 'Chargement...' : 'Sélectionnez une langue'}
                            </option>
                            {languages.map((languageItem) => (
                              <option key={languageItem.code} value={languageItem.code}>
                                {languageItem.name_fr} ({languageItem.name_native})
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <ChevronDown size={16} className="text-gray-400" />
                          </div>
                        </div>
                      </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="city">
                Ville
              </label>
              <input
                type="text"
                id="city"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="postalCode">
                Code postal
              </label>
              <input
                type="text"
                id="postalCode"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            type="submit"
            className={`flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center transition ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </>
            ) : (
              'Enregistrer les modifications'
            )}
          </button>
        </div>
      </form>
    </ProfileLayout>
  );
};

export default EditProfile;