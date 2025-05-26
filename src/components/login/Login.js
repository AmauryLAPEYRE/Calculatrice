// src/components/login/Login.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser, resetPassword, signInWithGoogle } from '../../services/authService';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  LogIn,
  ChevronRight,
  Shield,
  Sparkles,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Zap,
  Heart
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Animation au chargement
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Illustration animée de connexion
  const LoginIllustration = () => (
    <svg viewBox="0 0 400 400" className="w-full h-auto">
      <defs>
        <linearGradient id="loginGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#81C784', stopOpacity:1}}>
            <animate attributeName="stop-color" values="#81C784;#66BB6A;#81C784" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" style={{stopColor:'#4CAF50', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="loginGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#FFD54F', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#FFA726', stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Fond circulaire */}
      <circle cx="200" cy="200" r="150" fill="url(#loginGrad1)" opacity="0.1" />
      
      {/* Smartphone central */}
      <g transform="translate(200, 200)">
        <rect x="-60" y="-100" width="120" height="200" rx="20" fill="#333" />
        <rect x="-55" y="-95" width="110" height="190" rx="18" fill="white" />
        
        {/* Écran du téléphone */}
        <g>
          {/* Header app */}
          <rect x="-55" y="-95" width="110" height="30" rx="18" fill="#4CAF50" />
          <text x="0" y="-75" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Fydo</text>
          <path d="M25,-82 L27,-77 L32,-77 L28,-74 L30,-69 L25,-72 L20,-69 L22,-74 L18,-77 L23,-77 Z" 
                fill="#FFD700" />
          
          {/* Zone de connexion */}
          <circle cx="0" cy="-20" r="25" fill="#E8F5E9" />
          <circle cx="0" cy="-25" r="10" fill="#4CAF50" />
          <path d="M-10,-10 Q0,0 10,-10" fill="#4CAF50" />
          
          {/* Champs de formulaire */}
          <rect x="-40" y="20" width="80" height="15" rx="7" fill="#F5F5F5" stroke="#E0E0E0" />
          <rect x="-40" y="45" width="80" height="15" rx="7" fill="#F5F5F5" stroke="#E0E0E0" />
          
          {/* Bouton connexion */}
          <rect x="-30" y="75" width="60" height="20" rx="10" fill="url(#loginGrad1)" />
          <text x="0" y="88" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Connexion</text>
        </g>
        
        {/* Animation de déverrouillage */}
        <circle cx="0" cy="-20" r="30" fill="none" stroke="#4CAF50" strokeWidth="2" opacity="0">
          <animate attributeName="r" values="30;50;30" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Icônes flottantes */}
      <g opacity="0.7">
        <g transform="translate(100, 100)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#4CAF50" strokeWidth="2" />
          <path d="M-10,-10 L10,-10 L10,10 L-10,10 Z M-10,-5 L10,-5 M-10,0 L10,0 M-10,5 L10,5" 
                stroke="#4CAF50" strokeWidth="1.5" fill="none" />
          <animateTransform attributeName="transform" type="rotate" 
                            from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(300, 120)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#FFD700" strokeWidth="2" />
          <path d="M0,-10 L3,-3 L10,-3 L4,1 L6,8 L0,4 L-6,8 L-4,1 L-10,-3 L-3,-3 Z" 
                fill="#FFD700" />
          <animateTransform attributeName="transform" type="rotate" 
                            from="0 300 120" to="-360 300 120" dur="15s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(80, 300)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#42A5F5" strokeWidth="2" />
          <path d="M0,-8 C-5,-8 -8,-5 -8,0 C-8,5 -5,8 0,8 C5,8 8,5 8,0 C8,-5 5,-8 0,-8 Z M-8,0 L-12,0 M8,0 L12,0 M0,-8 L0,-12 M0,8 L0,12" 
                stroke="#42A5F5" strokeWidth="1.5" fill="none" />
          <animateTransform attributeName="transform" type="scale" 
                            values="1;1.2;1" dur="3s" repeatCount="indefinite" />
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

  // Fonction pour nettoyer les erreurs après un délai
  const clearErrorAfterDelay = (delay = 5000) => {
    setTimeout(() => setError(''), delay);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginUser(email, password);
      navigate(location.state?.redirectTo || '/');
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        setError('Email ou mot de passe incorrect');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Trop de tentatives. Veuillez réessayer plus tard ou réinitialiser votre mot de passe');
      } else {
        setError(error.message);
      }
      clearErrorAfterDelay();
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    
    if (!email) {
      setError("Veuillez entrer votre email pour réinitialiser votre mot de passe");
      clearErrorAfterDelay();
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await resetPassword(email);
      setResetSent(true);
      setResetMode(false);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setError("Aucun compte ne correspond à cette adresse email");
      } else {
        setError(error.message);
      }
      clearErrorAfterDelay();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;

    setError('');
    setLoading(true);
    
    try {
      const result = await signInWithGoogle();
      
      if (result) {
        navigate(location.state?.redirectTo || '/');
      }
      
    } catch (error) {
      if (error.message === 'Connexion annulée') {
        setLoading(false);
        return;
      }
      
      setError(error.message || "Erreur lors de la connexion Google.");
      clearErrorAfterDelay(7000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 to-white py-20">
      <Helmet>
        <title>Connexion | Fydo - Accédez à Votre Compte</title>
        <meta name="description" content="Connectez-vous à votre compte Fydo pour scanner des produits, laisser des avis vérifiés et consulter vos favoris." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-green-600">
              <li><Link to="/" className="hover:text-green-800 transition-colors">Accueil</Link></li>
              <li><ChevronRight size={16} /></li>
              <li className="text-green-800 font-medium">Connexion</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Section gauche - Illustration et avantages */}
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
                Heureux de vous <span className="text-green-600">revoir !</span>
              </h1>
              <p className="text-xl text-green-700 mb-8">
                Connectez-vous pour accéder à toutes vos fonctionnalités préférées
              </p>

              {/* Avantages de la connexion */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Star className="text-green-600" size={20} />
                  </div>
                  <span className="text-gray-700">Retrouvez vos produits favoris et vos avis</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                    <Shield className="text-amber-600" size={20} />
                  </div>
                  <span className="text-gray-700">Publiez des avis vérifiés par ticket de caisse</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Users className="text-blue-600" size={20} />
                  </div>
                  <span className="text-gray-700">Rejoignez notre communauté de 10,000+ membres</span>
                </div>
              </div>

              {/* Illustration */}
              <div className="hidden lg:block">
                <LoginIllustration />
              </div>
            </div>

            {/* Section droite - Formulaire */}
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-green-100">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogIn size={32} className="text-green-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-800 mb-2">
                    {resetMode ? 'Réinitialisation du mot de passe' : 'Connexion à votre compte'}
                  </h2>
                  <p className="text-gray-600">
                    {resetMode 
                      ? 'Entrez votre email pour recevoir un lien de réinitialisation' 
                      : 'Entrez vos identifiants pour continuer'}
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
                
                {resetSent && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start animate-fade-in">
                    <CheckCircle size={20} className="text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Email envoyé !</p>
                      <p className="text-sm text-green-700 mt-1">Un lien de réinitialisation a été envoyé à {email}</p>
                    </div>
                  </div>
                )}
                
                {resetMode ? (
                  <form onSubmit={handleResetPassword}>
                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-medium mb-3" htmlFor="reset-email">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail size={20} className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="reset-email"
                          className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="votre@email.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-4">
                      <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Envoi en cours...
                          </>
                        ) : (
                          'Envoyer le lien de réinitialisation'
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setResetMode(false)}
                        className="w-full py-3 text-green-700 hover:text-green-800 font-medium transition-colors"
                      >
                        Retour à la connexion
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
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
                        <div className="flex justify-between items-center mb-3">
                          <label className="block text-gray-700 text-sm font-medium" htmlFor="password">
                            Mot de passe
                          </label>
                        </div>
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
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mb-4 flex items-center justify-center"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            <span>Connexion en cours...</span>
                          </>
                        ) : (
                          <>
                            <LogIn size={20} className="mr-3" />
                            <span>Se connecter</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setResetMode(true)}
                        className="w-full text-green-700 text-sm text-center hover:text-green-800 font-medium transition-colors"
                      >
                        Mot de passe oublié ?
                      </button>
                    </form>
                    
                    {/* Séparateur */}
                    <div className="my-8 relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">Ou connectez-vous avec</span>
                      </div>
                    </div>
                    
                    {/* Bouton de connexion Google */}
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full bg-white border-2 border-gray-200 py-4 px-6 rounded-xl hover:border-gray-300 hover:shadow-md transform hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-3"></div>
                          <span>Connexion...</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 mr-3">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                          </svg>
                          <span className="text-gray-700 font-medium">Continuer avec Google</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
              
              {/* Lien d'inscription */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Pas encore de compte ?{' '}
                  <Link to="/signup" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                    Inscrivez-vous gratuitement
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Section témoignage */}
          <div className={`mt-16 bg-white rounded-3xl shadow-xl p-8 border border-green-100 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-amber-600 fill-amber-600" size={32} />
                </div>
                <p className="text-3xl font-bold text-gray-800">4.8/5</p>
                <p className="text-gray-600">Note moyenne</p>
              </div>
              
              <div className="md:col-span-2">
                <blockquote className="text-lg text-gray-700 italic">
                  "Fydo m'a complètement changé ma façon de faire mes courses ! Je peux enfin faire confiance aux avis car je sais qu'ils sont vérifiés. C'est devenu mon réflexe avant chaque achat."
                </blockquote>
                <div className="mt-4 flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-700 font-bold">ML</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Marie L.</p>
                    <p className="text-gray-600 text-sm">Membre depuis 2 ans</p>
                  </div>
                </div>
              </div>
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
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Login;