// src/components/login/Login.js - VERSION PROPRE
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, resetPassword, signInWithGoogle } from '../../services/authService';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetMode, setResetMode] = useState(false);
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
      await loginUser(email, password);
      navigate('/');
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
        navigate('/');
      }
      
    } catch (error) {
      // Gestion spéciale pour popup fermé (pas vraiment une erreur)
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
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md mt-8 mb-8 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Lock size={28} className="text-green-800" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-2 text-center text-green-800">
        {resetMode ? 'Réinitialisation du mot de passe' : 'Connexion'}
      </h2>
      <p className="text-gray-600 text-sm text-center mb-6">
        {resetMode 
          ? 'Entrez votre email pour recevoir un lien de réinitialisation' 
          : 'Accédez à votre compte Fydo'}
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-start">
          <span className="text-sm">{error}</span>
          <button 
            onClick={() => setError('')}
            className="ml-auto text-red-500 hover:text-red-700 text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}
      
      {resetSent && (
        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md">
          <p className="text-sm font-medium">Email envoyé !</p>
          <p className="text-sm mt-1">Un lien de réinitialisation a été envoyé à {email}</p>
        </div>
      )}
      
      {resetMode ? (
        <form onSubmit={handleResetPassword}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="reset-email">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                id="reset-email"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-green-800 focus:border-green-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                required
              />
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              className="w-full bg-green-800 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
            </button>
            
            <button
              type="button"
              onClick={() => setResetMode(false)}
              className="w-full py-2 text-green-800 hover:text-green-700 transition-colors"
            >
              Retour à la connexion
            </button>
          </div>
        </form>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
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
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 text-sm font-medium" htmlFor="password">
                  Mot de passe
                </label>
              </div>
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
                  placeholder="Votre mot de passe"
                  required
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
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-800 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed mb-4 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  <span>Se connecter</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => setResetMode(true)}
              className="w-full text-green-800 text-sm text-center hover:text-green-700 transition-colors mb-6"
            >
              Mot de passe oublié ?
            </button>
          </form>
          
          {/* Séparateur */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou</span>
            </div>
          </div>
          
          {/* Bouton de connexion Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-white border border-gray-300 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Connexion...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 mr-2">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                <span>Se connecter avec Google</span>
              </>
            )}
          </button>
        </>
      )}
      
      <div className="mt-8 text-center relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative inline-block px-4 bg-white text-sm text-gray-500">
          Pas encore inscrit ?
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <Link to="/signup" className="inline-block w-full py-3 px-4 border border-green-800 rounded-md text-green-800 hover:bg-green-50 transition-colors text-center">
          Créer un compte
        </Link>
      </div>
    </div>
  );
};

export default Login;