// src/components/profile/EditProfile.js
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { updateProfile } from 'firebase/auth';
import { auth, storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  Check, 
  AlertCircle, 
  MapPin, 
  Camera, 
  RefreshCw, 
  Upload, 
  Loader,
  ChevronDown, 
  Globe,
  Mail,
  Shield,
  Sparkles,
  ChevronRight,
  Edit3,
  CheckCircle,
  Building,
  Hash,
  Flag,
  Languages
} from 'lucide-react';
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
  const [isVisible, setIsVisible] = useState(false);
  
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

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Illustration de modification de profil
  const EditProfileIllustration = () => (
    <svg viewBox="0 0 400 400" className="w-full h-auto">
      <defs>
        <linearGradient id="editGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#81C784', stopOpacity:1}}>
            <animate attributeName="stop-color" values="#81C784;#66BB6A;#81C784" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" style={{stopColor:'#4CAF50', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="editGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#FFD54F', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#FFA726', stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Fond circulaire */}
      <circle cx="200" cy="200" r="150" fill="url(#editGrad1)" opacity="0.1" />
      
      {/* Formulaire stylisé */}
      <g transform="translate(200, 200)">
        <rect x="-80" y="-100" width="160" height="200" rx="20" fill="white" stroke="#4CAF50" strokeWidth="2" />
        
        {/* Avatar avec icône de modification */}
        <circle cx="0" cy="-40" r="30" fill="#E8F5E9" />
        <circle cx="0" cy="-45" r="20" fill="#4CAF50" />
        <path d="M-10,-30 Q0,-20 10,-30" fill="#4CAF50" />
        
        {/* Badge caméra */}
        <circle cx="20" cy="-20" r="12" fill="white" stroke="#4CAF50" strokeWidth="2" />
        <path d="M15,-20 L25,-20 M20,-25 L20,-15" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
        
        {/* Champs de formulaire animés */}
        <rect x="-60" y="10" width="120" height="15" rx="7" fill="#F5F5F5" stroke="#E0E0E0">
          <animate attributeName="stroke" values="#E0E0E0;#4CAF50;#E0E0E0" dur="3s" repeatCount="indefinite" />
        </rect>
        <rect x="-60" y="35" width="120" height="15" rx="7" fill="#F5F5F5" stroke="#E0E0E0">
          <animate attributeName="stroke" values="#E0E0E0;#4CAF50;#E0E0E0" dur="3s" begin="0.5s" repeatCount="indefinite" />
        </rect>
        <rect x="-60" y="60" width="120" height="15" rx="7" fill="#F5F5F5" stroke="#E0E0E0">
          <animate attributeName="stroke" values="#E0E0E0;#4CAF50;#E0E0E0" dur="3s" begin="1s" repeatCount="indefinite" />
        </rect>
        
        {/* Animation de pulsation */}
        <circle cx="0" cy="-40" r="40" fill="none" stroke="#4CAF50" strokeWidth="2" opacity="0">
          <animate attributeName="r" values="40;60;40" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Icônes flottantes */}
      <g opacity="0.7">
        <g transform="translate(100, 100)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#4CAF50" strokeWidth="2" />
          <path d="M-8,-8 L-4,-4 M-4,-4 L8,8 M4,4 L8,8" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
          <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(300, 120)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#FFD700" strokeWidth="2" />
          <path d="M-10,0 L10,0 M0,-10 L0,10" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
          <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="3s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(80, 300)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#42A5F5" strokeWidth="2" />
          <path d="M-8,-3 L-2,3 L8,-7" stroke="#42A5F5" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <animateTransform attributeName="transform" type="translate" values="80,300; 85,295; 80,300" dur="4s" repeatCount="indefinite" />
        </g>
      </g>
      
      {/* Particules */}
      <g opacity="0.6">
        <circle cx="150" cy="150" r="3" fill="#81C784">
          <animate attributeName="cy" values="150;140;150" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="250" cy="200" r="4" fill="#FFD54F">
          <animate attributeName="cy" values="200;190;200" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="320" cy="280" r="3" fill="#42A5F5">
          <animate attributeName="cy" values="280;270;280" dur="4s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );

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
      setLanguage(userDetails.language || 'fr');
      setAvatarSeed(userDetails.avatarSeed || userDetails.firebase_uid || '');
      setCustomAvatarUrl(userDetails.avatarUrl || '');
      setAvatarMode(userDetails.avatarUrl ? 'custom' : 'dicebear');
    }
    fetchCountries(userDetails?.country || 'FR');
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
          language: language,
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
    <ProfileLayout title="">
      <Helmet>
        <title>Modifier mon profil | Fydo</title>
        <meta name="description" content="Modifiez vos informations personnelles et personnalisez votre profil Fydo" />
      </Helmet>

    
        {/* Header avec animation */}
        <div className={`text-center mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-3">
            Personnalisez votre <span className="text-green-600">profil</span>
          </h1>
          <p className="text-base text-green-700 max-w-xl mx-auto">
            Mettez à jour vos informations et personnalisez votre expérience Fydo
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start animate-shake max-w-2xl mx-auto">
            <AlertCircle size={20} className="text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center animate-fade-in max-w-2xl mx-auto">
            <CheckCircle size={20} className="text-green-600 mr-3" />
            <span className="text-green-700 font-medium">Profil mis à jour avec succès !</span>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section Avatar */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-shadow">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Camera className="text-green-600 mr-3" size={24} />
                  Photo de profil
                </h2>
                
                <div className="flex flex-col items-center">
                  {/* Avatar actuel */}
                  <div className="relative group mb-4">
                    {avatarMode === 'custom' && customAvatarUrl ? (
                      <img 
                        src={customAvatarUrl}
                        alt="Avatar personnalisé"
                        className="w-32 h-32 rounded-full object-cover border-4 border-green-200 shadow-lg"
                      />
                    ) : (
                      <UserAvatar 
                        userId={avatarSeed}
                        size={128}
                        status={userDetails?.status || 'bronze'}
                        displayName={displayName || currentUser?.displayName}
                        className="border-4 border-green-200 shadow-lg"
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
                  </div>
                  
                  {/* Bouton modifier */}
                  <button
                    type="button"
                    onClick={() => setShowAvatarOptions(!showAvatarOptions)}
                    className="text-green-600 hover:text-green-700 font-medium flex items-center transition-colors"
                  >
                    <Edit3 size={16} className="mr-1" />
                    Modifier l'avatar
                  </button>
                </div>
                
                {/* Options de modification d'avatar */}
                {showAvatarOptions && (
                  <div className="mt-6 space-y-3 animate-expand">
                    {/* Option 1: Générer un nouvel avatar */}
                    <button
                      type="button"
                      onClick={generateNewAvatarSeed}
                      className="w-full flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all border border-green-200 group"
                    >
                      <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <RefreshCw size={20} className="text-green-700" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium text-gray-800">Générer un nouvel avatar</p>
                        <p className="text-xs text-gray-600">Avatar unique basé sur votre profil</p>
                      </div>
                      <ChevronRight size={20} className="text-green-600 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    {/* Option 2: Uploader une image */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="w-full flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        {uploadingAvatar ? (
                          <Loader size={20} className="text-blue-700 animate-spin" />
                        ) : (
                          <Upload size={20} className="text-blue-700" />
                        )}
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium text-gray-800">
                          {uploadingAvatar ? 'Upload en cours...' : 'Uploader une image'}
                        </p>
                        <p className="text-xs text-gray-600">JPG, PNG ou WebP (max 5MB)</p>
                      </div>
                      <ChevronRight size={20} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
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
                        className="w-full text-sm text-gray-600 hover:text-gray-800 py-2 transition-colors"
                      >
                        Réinitialiser à l'avatar par défaut
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Informations personnelles */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-shadow">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <User className="text-green-600 mr-3" size={24} />
                  Informations personnelles
                </h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="displayName">
                      Nom d'utilisateur
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="displayName"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Votre nom d'utilisateur"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                      Adresse email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 cursor-not-allowed"
                        value={email}
                        disabled
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Shield size={12} className="mr-1" />
                      L'adresse email ne peut pas être modifiée pour des raisons de sécurité
                    </p>
                  </div>
                </div>
              </div>

              {/* Localisation et préférences */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-shadow">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <MapPin className="text-green-600 mr-3" size={24} />
                  Localisation et préférences
                </h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="country">
                      Pays
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Flag size={18} className="text-gray-400" />
                      </div>
                      <select
                        id="country"
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white"
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
                        <ChevronDown size={18} className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="language">
                      Langue préférée
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Languages size={18} className="text-gray-400" />
                      </div>
                      <select
                        id="language"
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white"
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
                        <ChevronDown size={18} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="city">
                        Ville
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Building size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="city"
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Paris"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="postalCode">
                        Code postal
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Hash size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="postalCode"
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="75000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bouton de soumission */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className={`px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] flex items-center ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin mr-3 h-5 w-5" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-3" size={20} />
                      Enregistrer les modifications
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {/* Card de sécurité */}
            <div className="mt-8 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 max-w-2xl mx-auto">
              <div className="flex items-center mb-3">
                <Shield className="text-green-600 mr-3" size={24} />
                <h3 className="font-bold text-green-800">Vos données sont protégées</h3>
              </div>
              <p className="text-green-700 text-sm">
                Toutes vos informations sont chiffrées et sécurisées. Nous ne partageons jamais vos données personnelles.
              </p>
            </div>
          </div>
      </div>

      {/* Styles pour animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes expand {
          from {
            opacity: 0;
            transform: scaleY(0.95);
            transform-origin: top;
          }
          to {
            opacity: 1;
            transform: scaleY(1);
          }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-expand {
          animation: expand 0.3s ease-out;
        }
      `}</style>
    </ProfileLayout>
  );
};

export default EditProfile;