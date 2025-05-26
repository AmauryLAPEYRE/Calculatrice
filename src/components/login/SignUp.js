// src/components/login/SignUp.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, signInWithGoogle } from '../../services/authService';
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
  ArrowRight
} from 'lucide-react';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [showAddressFields, setShowAddressFields] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  // Animation au chargement
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Illustration animée d'inscription
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
        city, 
        postalCode
      });
      navigate('/');
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
        navigate('/');
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

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 to-white py-20">
      <Helmet>
        <title>Inscription | Fydo - Rejoignez Notre Communauté</title>
        <meta name="description" content="Créez votre compte Fydo gratuitement et rejoignez des milliers d'utilisateurs qui partagent des avis vérifiés sur leurs produits du quotidien." />
      </Helmet>

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
            
            {/* Section gauche - Illustration et avantages */}
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
                  
                  {/* Bouton pour afficher/masquer les champs d'adresse */}
                  <button
                    type="button"
                    className="w-full py-3 px-4 mb-5 border-2 border-green-200 rounded-xl hover:border-green-300 hover:bg-green-50 flex items-center justify-center transition-all transform hover:scale-[1.01]"
                    onClick={() => setShowAddressFields(!showAddressFields)}
                  >
                    <MapPin size={20} className="mr-3 text-green-700" />
                    <span className="text-green-700 font-medium">
                      {showAddressFields ? 'Masquer les informations d\'adresse' : 'Ajouter une adresse (optionnel)'}
                    </span>
                    {showAddressFields ? (
                      <ChevronUp size={20} className="ml-auto text-green-700" />
                    ) : (
                      <ChevronDown size={20} className="ml-auto text-green-700" />
                    )}
                  </button>
                  
                  {/* Champs d'adresse (conditionnellement affichés) */}
                  {showAddressFields && (
                    <div className="mb-6 border-2 border-green-200 p-5 rounded-xl bg-green-50 animate-expand">
                      <h3 className="text-lg font-medium text-green-800 mb-4 flex items-center">
                        <MapPin size={20} className="mr-3" />
                        Informations d'adresse
                      </h3>
                      
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="country">
                          Pays
                        </label>
                        <input
                          type="text"
                          id="country"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="France"
                        />
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

          {/* Section garanties */}
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
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-expand {
          animation: expand 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default SignUp;