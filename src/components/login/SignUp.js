// src/components/login/SignUp.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, signInWithGoogle } from '../../services/authService';
import { Eye, EyeOff, Mail, Lock, User, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  // États pour les informations d'adresse
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [showAddressFields, setShowAddressFields] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Fonction pour nettoyer les erreurs après un délai
  const clearErrorAfterDelay = (delay = 5000) => {
    setTimeout(() => setError(''), delay);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      // Personnaliser les messages d'erreur courants
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

  // Fonction SIMPLE pour l'inscription avec Google (popup)
  const handleGoogleSignUp = async () => {
    // Éviter les clics multiples
    if (loading) {
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      console.log('🚀 Démarrage de l\'inscription Google...');
      
      // Inscription avec popup (fluide et rapide)
      const result = await signInWithGoogle();
      
      if (result) {
        console.log('✅ Inscription Google réussie !');
        navigate('/');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription Google:', error);
      
      // Messages d'erreur user-friendly
      let userMessage = error.message || "Erreur lors de l'inscription avec Google.";
      
      // Gestion spéciale pour popup fermé (pas vraiment une erreur)
      if (error.message === 'Connexion annulée') {
        console.log('ℹ️ Utilisateur a fermé le popup');
        // Ne pas afficher d'erreur pour l'annulation
        setLoading(false);
        return;
      }
      
      setError(userMessage);
      clearErrorAfterDelay(7000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md mt-8 mb-8 hover:shadow-lg transition-all duration-300">
      <h2 className="text-2xl font-bold mb-2 text-center text-green-800">Créer un compte</h2>
      <p className="text-gray-600 text-sm text-center mb-6">Rejoignez la communauté Fydo</p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded flex items-start">
          <span className="text-sm">{error}</span>
          <button 
            onClick={() => setError('')}
            className="ml-auto text-red-500 hover:text-red-700 text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Bouton d'inscription Google avec popup */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        className="w-full bg-white border border-gray-300 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mb-6"
        disabled={loading}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Inscription...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 mr-2">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            <span>S'inscrire avec Google</span>
          </>
        )}
      </button>
      
      {/* Séparateur */}
      <div className="mb-6 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Ou s'inscrire avec email</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="displayName">
            Nom d'utilisateur
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="displayName"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-green-800 focus:border-green-800"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Votre nom d'utilisateur"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-green-800 focus:border-green-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
            Mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:ring-green-800 focus:border-green-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Créez un mot de passe sécurisé"
              required
              minLength="6"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={18} className="text-gray-500" />
              ) : (
                <Eye size={18} className="text-gray-500" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Le mot de passe doit contenir au moins 6 caractères</p>
        </div>
        
        {/* Bouton pour afficher/masquer les champs d'adresse */}
        <button
          type="button"
          className="w-full py-3 px-4 mb-4 border border-green-300 rounded-md hover:bg-green-50 flex items-center justify-center transition-colors"
          onClick={() => setShowAddressFields(!showAddressFields)}
        >
          <MapPin size={18} className="mr-2 text-green-800" />
          <span className="text-green-800">
            {showAddressFields ? 'Masquer les informations d\'adresse' : 'Ajouter des informations d\'adresse (optionnel)'}
          </span>
          {showAddressFields ? (
            <ChevronUp size={18} className="ml-2 text-green-800" />
          ) : (
            <ChevronDown size={18} className="ml-2 text-green-800" />
          )}
        </button>
        
        {/* Champs d'adresse (conditionnellement affichés) */}
        {showAddressFields && (
          <div className="mb-6 border p-4 rounded-md border-green-200 bg-green-50 transition-all duration-300">
            <h3 className="text-lg font-medium text-green-800 mb-3 flex items-center">
              <MapPin size={18} className="mr-2" />
              Informations d'adresse
            </h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="country">
                Pays
              </label>
              <input
                type="text"
                id="country"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-green-800 focus:border-green-800"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Votre pays"
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
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-green-800 focus:border-green-800"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Votre ville"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="postalCode">
                  Code postal
                </label>
                <input
                  type="text"
                  id="postalCode"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-green-800 focus:border-green-800"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Code postal"
                />
              </div>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-green-800 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Création en cours...
            </div>
          ) : (
            'Créer mon compte'
          )}
        </button>
      </form>
      
      <div className="mt-8 text-center relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative inline-block px-4 bg-white text-sm text-gray-500">
          Vous avez déjà un compte ?
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <Link to="/login" className="inline-block w-full py-2 px-4 border border-green-800 rounded-md text-green-800 hover:bg-green-50 transition-colors text-center">
          Se connecter
        </Link>
      </div>
    </div>
  );
};

export default SignUp;