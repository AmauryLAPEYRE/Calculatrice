// src/components/login/SignUp.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, signInWithGoogle } from '../../services/authService';
import { supabase } from '../../supabaseClient'; // Ajout pour récupérer les pays et langues
// Import en haut
import { useAuth } from '../../contexts/AuthContext';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  MapPin, 
  ChevronDown, 
  ChevronUp,
  ChevronRight,
  UserPlus,
  Shield,
  Sparkles,
  Gift,
  Star,
  CheckCircle,
  AlertCircle,
  Zap,
  Trophy,
  Heart,
  ArrowRight,
  Globe, // Ajout pour l'icône de langue
  Crown, // Pour l'abonnement Essential
  Confetti // Pour l'effet de célébration
} from 'lucide-react';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [showAddressFields, setShowAddressFields] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Nouveau state pour le popup
  
  // Nouveaux states pour les listes
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState(''); // Nouveau champ langue
  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingLanguages, setLoadingLanguages] = useState(false);
  const { loginWithApple } = useAuth(); // ou loginWithGoogle selon le composant

  const navigate = useNavigate();

  // Animation au chargement
  useEffect(() => {
    setIsVisible(true);
    fetchCountries();
    fetchLanguages();
  }, []);

  // Composant Modal de Succès
  const SuccessModal = () => (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${showSuccessModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)} />
      
      {/* Modal Content */}
      <div className={`relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-500 ${showSuccessModal ? 'scale-100 rotate-0' : 'scale-95 rotate-3'}`}>
        {/* Confettis animés */}
        <div className="absolute -top-10 -left-10 text-yellow-400 animate-bounce-slow">
          <Sparkles size={40} />
        </div>
        <div className="absolute -top-10 -right-10 text-green-400 animate-bounce-slow" style={{ animationDelay: '0.3s' }}>
          <Star size={35} />
        </div>
        <div className="absolute -bottom-10 -left-10 text-blue-400 animate-bounce-slow" style={{ animationDelay: '0.6s' }}>
          <Gift size={35} />
        </div>
        
        {/* Icône de succès */}
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-up shadow-lg">
          <CheckCircle size={48} className="text-white" />
        </div>
        
        {/* Titre */}
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Bienvenue sur Fydo, {displayName} ! 🎉
        </h3>
        
        {/* Message principal */}
        <p className="text-gray-600 text-center mb-6">
          Votre compte a été créé avec succès.
        </p>
        
        {/* Cadeau Essential */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5 mb-6 relative overflow-hidden">
          <div className="absolute top-2 right-2 text-amber-400 animate-pulse">
            <Crown size={30} />
          </div>
          
          <h4 className="font-bold text-amber-800 mb-2 flex items-center">
            <Gift className="mr-2" size={20} />
            Cadeau de bienvenue
          </h4>
          
          <p className="text-amber-700 font-medium text-lg mb-1">
            1 semaine GRATUITE
          </p>
          <p className="text-amber-600 text-sm">
            Abonnement <span className="font-bold">Essential</span> offert
          </p>
          
          <div className="mt-3 space-y-1">
            <p className="text-xs text-amber-600 flex items-center">
              <CheckCircle size={14} className="mr-1" /> Scan illimité de produits
            </p>
            <p className="text-xs text-amber-600 flex items-center">
              <CheckCircle size={14} className="mr-1" /> Tickets de caisse illimités
            </p>
            <p className="text-xs text-amber-600 flex items-center">
              <CheckCircle size={14} className="mr-1" /> Accès aux statistiques avancées
            </p>
          </div>
        </div>
        
        {/* Bouton continuer */}
        <button
          onClick={() => {
            setShowSuccessModal(false);
            navigate('/');
          }}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] flex items-center justify-center group"
        >
          <span>Découvrir Fydo</span>
          <ArrowRight size={20} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
        </button>
        
        {/* Note de bas de page */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Aucune carte bancaire requise • Sans engagement
        </p>
      </div>
    </div>
  );

  // Fonction pour récupérer les pays actifs
  const fetchCountries = async () => {
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
    const franceExists = data?.some(country => country.code === 'FR');
    if (franceExists && !country) { // Seulement si aucun pays n'est déjà sélectionné
      setCountry('FR');
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


  // Illustration animée d'inscription (inchangée)
  const SignUpIllustration = () => (
    <svg viewBox="0 0 400 400" className="w-full h-auto">
      <defs>
        <linearGradient id="signupGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#81C784', stopOpacity:1}}>
            <animate attributeName="stop-color" values="#81C784;#66BB6A;#81C784" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" style={{stopColor:'#4CAF50', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="signupGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#FFD54F', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#FFA726', stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Fond circulaire */}
      <circle cx="200" cy="200" r="150" fill="url(#signupGrad1)" opacity="0.1" />
      
      {/* Groupe d'utilisateurs */}
      <g transform="translate(200, 200)">
        {/* Utilisateur central */}
        <circle cx="0" cy="-20" r="40" fill="white" stroke="#4CAF50" strokeWidth="3" />
        <circle cx="0" cy="-25" r="15" fill="#4CAF50" />
        <path d="M-20,-5 Q0,5 20,-5" fill="#4CAF50" />
        
        {/* Utilisateurs latéraux */}
        <g transform="translate(-60, 20)">
          <circle cx="0" cy="0" r="30" fill="white" stroke="#42A5F5" strokeWidth="2" opacity="0.8" />
          <circle cx="0" cy="-5" r="10" fill="#42A5F5" />
          <path d="M-15,5 Q0,12 15,5" fill="#42A5F5" />
        </g>
        
        <g transform="translate(60, 20)">
          <circle cx="0" cy="0" r="30" fill="white" stroke="#FFD700" strokeWidth="2" opacity="0.8" />
          <circle cx="0" cy="-5" r="10" fill="#FFD700" />
          <path d="M-15,5 Q0,12 15,5" fill="#FFD700" />
        </g>
        
        {/* Badge + au centre */}
        <circle cx="0" cy="-20" r="50" fill="none" stroke="#4CAF50" strokeWidth="2" strokeDasharray="5 5">
          <animateTransform attributeName="transform" type="rotate" from="0 0 -20" to="360 0 -20" dur="20s" repeatCount="indefinite" />
        </circle>
        
        <g transform="translate(30, -50)">
          <circle cx="0" cy="0" r="15" fill="#4CAF50" />
          <path d="M-8,0 L8,0 M0,-8 L0,8" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
      
      {/* Éléments flottants */}
      <g opacity="0.7">
        <g transform="translate(100, 100)">
          <rect x="-20" y="-20" width="40" height="40" rx="8" fill="white" stroke="#4CAF50" strokeWidth="2" />
          <path d="M-10,-5 L-5,0 L10,-10" stroke="#4CAF50" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="3s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(300, 120)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#FFD700" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#FFA726" fontSize="20" fontWeight="bold">★</text>
          <animateTransform attributeName="transform" type="rotate" from="0 300 120" to="360 300 120" dur="10s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(80, 300)">
          <rect x="-25" y="-15" width="50" height="30" rx="15" fill="white" stroke="#CE93D8" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#CE93D8" fontSize="12" fontWeight="bold">WELCOME</text>
          <animateTransform attributeName="transform" type="translate" values="80,300; 85,295; 80,300" dur="4s" repeatCount="indefinite" />
        </g>
      </g>
      
      {/* Confettis */}
      <g opacity="0.6">
        <rect x="120" y="150" width="10" height="4" rx="2" fill="#FFD700" transform="rotate(45 125 152)">
          <animate attributeName="y" values="150;350;150" dur="4s" repeatCount="indefinite" />
        </rect>
        <rect x="250" y="100" width="10" height="4" rx="2" fill="#4CAF50" transform="rotate(-30 255 102)">
          <animate attributeName="y" values="100;300;100" dur="4.5s" repeatCount="indefinite" />
        </rect>
        <rect x="320" y="200" width="10" height="4" rx="2" fill="#CE93D8" transform="rotate(60 325 202)">
          <animate attributeName="y" values="200;400;200" dur="5s" repeatCount="indefinite" />
        </rect>
      </g>
    </svg>
  );

  // Fonction pour nettoyer les erreurs après un délai
  const clearErrorAfterDelay = (delay = 5000) => {
    setTimeout(() => setError(''), delay);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      setError('Veuillez accepter les conditions d\'utilisation');
      clearErrorAfterDelay();
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await registerUser(email, password, displayName, {
        country, 
        language, // Ajout du champ langue
        city, 
        postalCode
      });
      
      // Afficher le modal de succès
      setShowSuccessModal(true);
      
      // Redirection après 5 secondes si l'utilisateur ne clique pas
      setTimeout(() => {
        if (showSuccessModal) {
          navigate('/');
        }
      }, 5000);
      
    } catch (error) {
      let errorMessage = '';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Cet email est déjà utilisé';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Adresse email invalide';
          break;
        case 'auth/weak-password':
          errorMessage = 'Le mot de passe est trop faible (minimum 6 caractères)';
          break;
        default:
          errorMessage = error.message;
      }
      setError(errorMessage);
      clearErrorAfterDelay();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (loading) return;

    setError('');
    setLoading(true);
    
    try {
      const result = await signInWithGoogle();
      
      if (result) {
        // Récupérer le displayName pour le popup
        const googleDisplayName = result.user?.displayName || result.user?.email?.split('@')[0] || 'Utilisateur';
        setDisplayName(googleDisplayName);
        
        // Afficher aussi le modal pour Google
        setShowSuccessModal(true);
        
        setTimeout(() => {
          if (showSuccessModal) {
            navigate('/');
          }
        }, 5000);
      }
      
    } catch (error) {
      if (error.message === 'Connexion annulée') {
        setLoading(false);
        return;
      }
      
      setError(error.message || "Erreur lors de l'inscription avec Google.");
      clearErrorAfterDelay(7000);
    } finally {
      setLoading(false);
    }
  };
// Fonction de gestion :
const handleAppleSignIn = async () => {
  if (loading) return;
  setError('');
  setLoading(true);
  
  try {
    const result = await loginWithApple();
    if (result) {
      navigate('/'); // ou autre redirection
    }
  } catch (error) {
    if (error.message !== 'Connexion annulée') {
      setError(error.message);
    }
  } finally {
    setLoading(false);
  }
};
  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 to-white py-20">
      <Helmet>
        <title>Inscription | Fydo - Rejoignez Notre Communauté</title>
        <meta name="description" content="Créez votre compte Fydo gratuitement et rejoignez des milliers d'utilisateurs qui partagent des avis vérifiés sur leurs produits du quotidien." />
      </Helmet>

      {/* Modal de succès */}
      <SuccessModal />

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-green-600">
              <li><Link to="/" className="hover:text-green-800 transition-colors">Accueil</Link></li>
              <li><ChevronRight size={16} /></li>
              <li className="text-green-800 font-medium">Inscription</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Section gauche - Illustration et avantages (inchangée) */}
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
                Rejoignez la <span className="text-green-600">révolution</span> des avis authentiques
              </h1>
              <p className="text-xl text-green-700 mb-8">
                Créez votre compte gratuitement et commencez à partager vos expériences
              </p>

              {/* Avantages de l'inscription */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mr-4">
                    <Gift className="text-green-600" size={20} />
                  </div>
                  <span className="text-gray-700">Inscription 100% gratuite et sans engagement</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mr-4">
                    <Trophy className="text-amber-600" size={20} />
                  </div>
                  <span className="text-gray-700">Gagnez des badges et du statut dans la communauté</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-4">
                    <Heart className="text-blue-600" size={20} />
                  </div>
                  <span className="text-gray-700">Sauvegardez vos produits favoris et vos avis</span>
                </div>
              </div>

              {/* Illustration */}
              <div className="hidden lg:block">
                <SignUpIllustration />
              </div>

              {/* Badges de confiance */}
              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-800">10K+</p>
                  <p className="text-sm text-gray-600">Membres actifs</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-600">50K+</p>
                  <p className="text-sm text-gray-600">Avis vérifiés</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">100%</p>
                  <p className="text-sm text-gray-600">Gratuit</p>
                </div>
              </div>
            </div>

            {/* Section droite - Formulaire */}
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-green-100">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserPlus size={32} className="text-green-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-800 mb-2">
                    Créer votre compte
                  </h2>
                  <p className="text-gray-600">
                    Rejoignez Fydo en quelques secondes
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start animate-shake">
                    <AlertCircle size={20} className="text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-sm text-red-700">{error}</span>
                    </div>
                    <button 
                      onClick={() => setError('')}
                      className="ml-3 text-red-500 hover:text-red-700 text-xl leading-none"
                    >
                      ×
                    </button>
                  </div>
                )}
                
                {/* Bouton d'inscription Google */}
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  className="w-full bg-white border-2 border-gray-200 py-4 px-6 rounded-xl hover:border-gray-300 hover:shadow-md transform hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mb-6"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-3"></div>
                      <span>Inscription...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 mr-3">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                      </svg>
                      <span className="text-gray-700 font-medium">S'inscrire avec Google</span>
                    </>
                  )}
                </button>
                <button
  type="button"
  onClick={handleAppleSignIn}
  className="w-full bg-black hover:bg-gray-800 text-white py-4 px-6 rounded-xl transform hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] flex items-center justify-center disabled:opacity-70"
  disabled={loading}
>
  {loading ? (
    <>
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
      <span>Connexion...</span>
    </>
  ) : (
    <>
      {/* Icône Apple */}
      <svg viewBox="0 0 24 24" width="20" height="20" className="mr-3" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
      <span className="font-medium">Continuer avec Apple</span>
    </>
  )}
</button>
                {/* Séparateur */}
                <div className="mb-6 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Ou inscrivez-vous avec email</span>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                  
                  <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-medium mb-3" htmlFor="email">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-3" htmlFor="password">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={20} className="text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength="6"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Le mot de passe doit contenir au moins 6 caractères</p>
                  </div>
                   <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-medium mb-3" htmlFor="displayName">
                      Nom d'utilisateur
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User size={20} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="displayName"
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Choisissez un pseudo"
                        required
                      />
                    </div>
                  </div>                 
                  
                  {/* Champs d'adresse (conditionnellement affichés) */}
                  {showAddressFields && (
                    <div className="mb-6 border-2 border-green-200 p-5 rounded-xl bg-green-50 animate-expand">
                      <h3 className="text-lg font-medium text-green-800 mb-4 flex items-center">
                        <MapPin size={20} className="mr-3" />
                        Informations d'adresse (optionnelles)
                      </h3>
                      
                      {/* Champ Pays modifié */}
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="country">
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
                      </div>

                      {/* Nouveau champ Langue */}
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="language">
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
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="city">
                            Ville
                          </label>
                          <input
                            type="text"
                            id="city"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Paris"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="postalCode">
                            Code postal
                          </label>
                          <input
                            type="text"
                            id="postalCode"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            placeholder="75000"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Conditions d'utilisation */}
                  <div className="mb-6">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 mr-3 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                      />
                      <span className="text-sm text-gray-600">
                        J'accepte les{' '}
                        <Link to="/conditions-utilisation" className="text-green-600 hover:text-green-700 font-medium">
                          conditions d'utilisation
                        </Link>
                        {' '}et la{' '}
                        <Link to="/politique-confidentialite" className="text-green-600 hover:text-green-700 font-medium">
                          politique de confidentialité
                        </Link>
                      </span>
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                    disabled={loading || !acceptTerms}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        <span>Création en cours...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={20} className="mr-3" />
                        <span>Créer mon compte gratuit</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
              
              {/* Lien de connexion */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Vous avez déjà un compte ?{' '}
                  <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                    Connectez-vous
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Section garanties (inchangée) */}
          <div className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 text-center">
              <Shield size={32} className="text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">100% Sécurisé</h3>
              <p className="text-gray-600 text-sm">Vos données sont protégées et jamais partagées</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 text-center">
              <Zap size={32} className="text-amber-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">Inscription rapide</h3>
              <p className="text-gray-600 text-sm">Compte créé en moins d'une minute</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 text-center">
              <Gift size={32} className="text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-800 mb-2">Gratuit à vie</h3>
              <p className="text-gray-600 text-sm">Accès gratuit aux fonctionnalités essentielles</p>
            </div>
          </div>

        </div>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
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
        
        @keyframes scale-up {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-expand {
          animation: expand 0.3s ease-out;
        }
        
        .animate-scale-up {
          animation: scale-up 0.5s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default SignUp;