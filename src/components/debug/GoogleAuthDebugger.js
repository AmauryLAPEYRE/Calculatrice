// src/components/debug/GoogleAuthDebugger.js
// Dans votre Login.js, ajoutez temporairement :
//import GoogleAuthDebugger from '../debug/GoogleAuthDebugger';

// Ajoutez en haut de votre composant return :
//{process.env.NODE_ENV === 'development' && <GoogleAuthDebugger />}

import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { debugGoogleConfig, getFirebaseInfo } from '../../firebase';

const GoogleAuthDebugger = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostic = () => {
    console.log('🔍 === DIAGNOSTIC GOOGLE AUTH ===');
    
    // Informations système
    const info = {
      // Configuration Firebase
      firebaseConfig: {
        projectId: auth.app.options.projectId,
        authDomain: auth.app.options.authDomain,
        apiKey: auth.app.options.apiKey ? 'Configuré' : 'Manquant'
      },
      
      // Informations environnement
      environment: {
        nodeEnv: process.env.NODE_ENV,
        currentUrl: window.location.href,
        origin: window.location.origin,
        userAgent: navigator.userAgent.split(' ').pop()
      },
      
      // Variables d'environnement
      envVars: {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? 'Configuré' : 'Manquant',
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'Configuré' : 'Manquant',
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'Configuré' : 'Manquant'
      },
      
      // Vérifications
      checks: {
        authDomainMatch: auth.app.options.authDomain === `${auth.app.options.projectId}.firebaseapp.com`,
        popupsBlocked: false, // À déterminer lors du test
        corsHeaders: window.location.protocol === 'https:' || window.location.hostname === 'localhost'
      }
    };
    
    setDebugInfo(info);
    console.log('Informations de diagnostic:', info);
  };

  const testGoogleAuth = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      console.log('🧪 Test de connexion Google...');
      
      // Configuration minimale du provider
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      // Test de popup (sans réelle connexion)
      const result = await signInWithPopup(auth, provider);
      
      setTestResult({
        success: true,
        message: 'Connexion Google réussie !',
        userEmail: result.user.email,
        userID: result.user.uid
      });
      
      console.log('✅ Test réussi:', result.user.email);
      
    } catch (error) {
      console.error('❌ Erreur lors du test:', error);
      
      let errorType = 'Erreur inconnue';
      let solution = 'Vérifiez la console pour plus de détails';
      
      switch (error.code) {
        case 'auth/popup-blocked':
          errorType = 'Popup bloqué';
          solution = 'Autorisez les popups pour ce site';
          break;
        case 'auth/popup-closed-by-user':
          errorType = 'Popup fermé par l\'utilisateur';
          solution = 'Réessayez sans fermer le popup';
          break;
        case 'auth/unauthorized-domain':
          errorType = 'Domaine non autorisé';
          solution = 'Ajoutez votre domaine dans Firebase Console → Authentication → Settings';
          break;
        case 'auth/invalid-oauth-client-id':
          errorType = 'Client ID OAuth invalide';
          solution = 'Vérifiez la configuration dans Google Cloud Console';
          break;
        case 'auth/network-request-failed':
          errorType = 'Erreur réseau';
          solution = 'Vérifiez votre connexion internet';
          break;
      }
      
      setTestResult({
        success: false,
        error: error.code || 'unknown',
        message: error.message,
        errorType,
        solution
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(JSON.stringify(text, null, 2));
    alert('Informations copiées dans le presse-papiers !');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
        🔧 Diagnostic Google Auth
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={runDiagnostic}
          className="bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          📊 Analyser la configuration
        </button>
        
        <button
          onClick={testGoogleAuth}
          disabled={loading}
          className="bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          {loading ? '🔄 Test en cours...' : '🧪 Tester la connexion Google'}
        </button>
      </div>

      {/* Résultats du diagnostic */}
      {debugInfo && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">📋 Informations de configuration</h3>
            <button
              onClick={() => copyToClipboard(debugInfo)}
              className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
            >
              📋 Copier
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-700 mb-2">🔥 Firebase</h4>
              <ul className="space-y-1">
                <li>Project ID: <code className="bg-gray-200 px-1 rounded">{debugInfo.firebaseConfig.projectId}</code></li>
                <li>Auth Domain: <code className="bg-gray-200 px-1 rounded">{debugInfo.firebaseConfig.authDomain}</code></li>
                <li>API Key: <span className={debugInfo.firebaseConfig.apiKey === 'Configuré' ? 'text-green-600' : 'text-red-600'}>{debugInfo.firebaseConfig.apiKey}</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-700 mb-2">🌐 Environnement</h4>
              <ul className="space-y-1">
                <li>Mode: <code className="bg-gray-200 px-1 rounded">{debugInfo.environment.nodeEnv}</code></li>
                <li>Origin: <code className="bg-gray-200 px-1 rounded">{debugInfo.environment.origin}</code></li>
                <li>Navigateur: <code className="bg-gray-200 px-1 rounded">{debugInfo.environment.userAgent}</code></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium text-blue-700 mb-2">✅ Vérifications</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className={`p-2 rounded ${debugInfo.checks.authDomainMatch ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {debugInfo.checks.authDomainMatch ? '✅' : '❌'} Auth Domain
              </div>
              <div className={`p-2 rounded ${debugInfo.checks.corsHeaders ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {debugInfo.checks.corsHeaders ? '✅' : '⚠️'} CORS/HTTPS
              </div>
              <div className="p-2 rounded bg-gray-100">
                🔄 Popups (à tester)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Résultats du test */}
      {testResult && (
        <div className={`mb-6 p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <h3 className="text-lg font-semibold mb-3">
            {testResult.success ? '✅ Test réussi !' : '❌ Test échoué'}
          </h3>
          
          {testResult.success ? (
            <div>
              <p className="text-green-700 mb-2">La connexion Google fonctionne correctement !</p>
              <ul className="text-sm text-green-600">
                <li>Email: {testResult.userEmail}</li>
                <li>ID utilisateur: {testResult.userID}</li>
              </ul>
            </div>
          ) : (
            <div>
              <div className="mb-3">
                <p className="text-red-700 font-medium">{testResult.errorType}</p>
                <p className="text-sm text-red-600">{testResult.message}</p>
              </div>
              
              <div className="bg-red-100 p-3 rounded border border-red-200">
                <h4 className="font-medium text-red-800 mb-1">💡 Solution recommandée:</h4>
                <p className="text-sm text-red-700">{testResult.solution}</p>
              </div>
              
              {testResult.error && (
                <p className="text-xs text-gray-600 mt-2">
                  Code d'erreur: <code className="bg-gray-200 px-1 rounded">{testResult.error}</code>
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">📖 Instructions</h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Cliquez sur "Analyser la configuration" pour vérifier votre setup</li>
          <li>Cliquez sur "Tester la connexion Google" pour identifier les erreurs</li>
          <li>Suivez les solutions recommandées en cas d'erreur</li>
          <li>Copiez les informations si vous avez besoin d'aide supplémentaire</li>
        </ol>
        
        <div className="mt-3 p-2 bg-blue-100 rounded border border-blue-300">
          <p className="text-xs text-blue-600">
            ⚠️ Ce composant est uniquement pour le diagnostic. Supprimez-le une fois le problème résolu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthDebugger;