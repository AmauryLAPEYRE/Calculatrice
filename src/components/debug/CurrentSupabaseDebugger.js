// src/components/debug/CurrentSupabaseDebugger.js
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, syncUserWithSupabase } from '../../supabaseClient';

const CurrentSupabaseDebugger = () => {
  const { currentUser, userDetails } = useAuth();
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const logResult = (testName, result) => {
    setResults(prev => ({
      ...prev,
      [testName]: result
    }));
    console.log(`🧪 Test ${testName}:`, result);
  };

  // Test 1: Variables d'environnement
  const testEnvironmentVariables = () => {
    setCurrentTest('Variables d\'environnement');
    
    const envVars = {
      supabaseUrl: process.env.REACT_APP_SUPABASE_URL,
      supabaseKey: process.env.REACT_APP_SUPABASE_ANON_KEY
    };
    
    const result = {
      success: !!(envVars.supabaseUrl && envVars.supabaseKey),
      details: {
        urlPresent: !!envVars.supabaseUrl,
        keyPresent: !!envVars.supabaseKey,
        urlValue: envVars.supabaseUrl ? `${envVars.supabaseUrl.substring(0, 30)}...` : 'Non défini',
        keyValue: envVars.supabaseKey ? `${envVars.supabaseKey.substring(0, 30)}...` : 'Non défini'
      }
    };
    
    logResult('environmentVariables', result);
  };

  // Test 2: Connexion basique Supabase
  const testBasicConnection = async () => {
    setCurrentTest('Connexion de base');
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true });
      
      const result = {
        success: !error,
        error: error?.message,
        details: error ? null : `Table users accessible`
      };
      
      logResult('basicConnection', result);
    } catch (error) {
      logResult('basicConnection', {
        success: false,
        error: error.message,
        details: 'Erreur de connexion générale'
      });
    }
  };

  // Test 3: Structure de la table users
  const testTableStructure = async () => {
    setCurrentTest('Structure de table');
    try {
      // Essayer de récupérer les colonnes de la table users
      const { data, error } = await supabase
        .rpc('get_table_columns', { table_name: 'users' })
        .catch(async () => {
          // Fallback: essayer une requête simple pour voir les colonnes
          return await supabase
            .from('users')
            .select('*')
            .limit(1);
        });
      
      if (error) throw error;
      
      // Colonnes essentielles attendues
      const requiredColumns = [
        'id', 'firebase_uid', 'email', 'display_name', 
        'created_at', 'user_type', 'status'
      ];
      
      let availableColumns = [];
      if (data && data.length > 0) {
        availableColumns = Object.keys(data[0]);
      }
      
      const missingColumns = requiredColumns.filter(col => 
        !availableColumns.includes(col)
      );
      
      const result = {
        success: missingColumns.length === 0,
        details: {
          availableColumns,
          missingColumns,
          totalColumns: availableColumns.length
        }
      };
      
      logResult('tableStructure', result);
    } catch (error) {
      logResult('tableStructure', {
        success: false,
        error: error.message,
        details: 'Impossible de vérifier la structure'
      });
    }
  };

  // Test 4: Permissions de lecture
  const testReadPermissions = async () => {
    if (!currentUser) {
      logResult('readPermissions', {
        success: false,
        error: 'Aucun utilisateur connecté'
      });
      return;
    }

    setCurrentTest('Permissions de lecture');
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('firebase_uid', currentUser.uid);
      
      const result = {
        success: !error,
        error: error?.message,
        details: {
          userFound: data && data.length > 0,
          dataCount: data?.length || 0,
          errorCode: error?.code
        }
      };
      
      logResult('readPermissions', result);
    } catch (error) {
      logResult('readPermissions', {
        success: false,
        error: error.message
      });
    }
  };

  // Test 5: Permissions d'écriture
  const testWritePermissions = async () => {
    if (!currentUser) {
      logResult('writePermissions', {
        success: false,
        error: 'Aucun utilisateur connecté'
      });
      return;
    }

    setCurrentTest('Permissions d\'écriture');
    try {
      const testData = {
        firebase_uid: currentUser.uid,
        email: currentUser.email,
        display_name: currentUser.displayName || 'Test User',
        user_type: 'Visiteur',
        status: 'bronze',
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('users')
        .upsert([testData], { 
          onConflict: 'firebase_uid',
          ignoreDuplicates: false 
        })
        .select();
      
      const result = {
        success: !error,
        error: error?.message,
        details: {
          dataInserted: data && data.length > 0,
          errorCode: error?.code,
          errorHint: error?.hint
        }
      };
      
      logResult('writePermissions', result);
    } catch (error) {
      logResult('writePermissions', {
        success: false,
        error: error.message
      });
    }
  };

  // Test 6: Fonction de synchronisation
  const testSyncFunction = async () => {
    if (!currentUser) {
      logResult('syncFunction', {
        success: false,
        error: 'Aucun utilisateur connecté'
      });
      return;
    }

    setCurrentTest('Fonction de synchronisation');
    try {
      const result = await syncUserWithSupabase(currentUser, {
        country: 'Test Country',
        city: 'Test City',
        postalCode: '12345'
      });

      logResult('syncFunction', {
        success: !!result,
        details: {
          userSynced: !!result,
          userId: result?.id,
          userEmail: result?.email,
          syncedFields: Object.keys(result || {})
        }
      });
    } catch (error) {
      logResult('syncFunction', {
        success: false,
        error: error.message,
        details: {
          errorCode: error.code,
          errorHint: error.hint
        }
      });
    }
  };

  // Test 7: Politiques RLS
  const testRLSPolicies = async () => {
    setCurrentTest('Politiques RLS');
    try {
      // Essayer d'accéder aux politiques (peut ne pas marcher selon les permissions)
      const { data, error } = await supabase
        .from('pg_policies')
        .select('*')
        .eq('tablename', 'users')
        .catch(() => ({ data: null, error: { message: 'Accès aux politiques non autorisé' } }));
      
      const result = {
        success: !error || error.message.includes('non autorisé'),
        details: {
          policiesFound: data?.length || 0,
          canAccessPolicies: !error,
          note: 'Test limité - vérifiez manuellement dans Supabase Dashboard'
        },
        error: error?.message
      };
      
      logResult('rlsPolicies', result);
    } catch (error) {
      logResult('rlsPolicies', {
        success: false,
        error: error.message
      });
    }
  };

  // Lancer tous les tests
  const runAllTests = async () => {
    setLoading(true);
    setResults({});
    
    try {
      testEnvironmentVariables();
      await testBasicConnection();
      await testTableStructure();
      await testReadPermissions();
      await testWritePermissions();
      await testSyncFunction();
      await testRLSPolicies();
    } catch (error) {
      console.error('Erreur lors des tests:', error);
    } finally {
      setLoading(false);
      setCurrentTest('');
    }
  };

  // Analyser les résultats et donner des recommandations
  const getRecommendations = () => {
    const recommendations = [];
    
    if (results.environmentVariables && !results.environmentVariables.success) {
      recommendations.push({
        type: 'error',
        message: 'Variables d\'environnement manquantes',
        solution: 'Ajoutez REACT_APP_SUPABASE_URL et REACT_APP_SUPABASE_ANON_KEY dans votre .env'
      });
    }
    
    if (results.basicConnection && !results.basicConnection.success) {
      recommendations.push({
        type: 'error',
        message: 'Impossible de se connecter à Supabase',
        solution: 'Vérifiez vos URL et clés Supabase, et votre connexion internet'
      });
    }
    
    if (results.readPermissions && !results.readPermissions.success) {
      const error = results.readPermissions.error;
      if (error?.includes('row-level security') || error?.includes('RLS')) {
        recommendations.push({
          type: 'error',
          message: 'Problème de politiques RLS',
          solution: 'Configurez les politiques Row Level Security dans Supabase Dashboard'
        });
      }
    }
    
    if (results.writePermissions && !results.writePermissions.success) {
      recommendations.push({
        type: 'error',
        message: 'Impossible d\'écrire dans la base de données',
        solution: 'Vérifiez les permissions d\'écriture et les politiques RLS'
      });
    }
    
    if (results.syncFunction && !results.syncFunction.success) {
      recommendations.push({
        type: 'error',
        message: 'La fonction de synchronisation échoue',
        solution: 'Vérifiez la structure de la table et les permissions'
      });
    }
    
    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-800">
        🔧 Diagnostic Supabase - Version Actuelle
      </h2>
      
      {/* Informations utilisateur */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">👤 État actuel</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-700">🔥 Firebase</h4>
            {currentUser ? (
              <p className="text-green-600">✅ Utilisateur connecté: {currentUser.email}</p>
            ) : (
              <p className="text-red-600">❌ Aucun utilisateur connecté</p>
            )}
          </div>
          <div>
            <h4 className="font-medium text-purple-700">🗄️ Supabase</h4>
            {userDetails ? (
              <p className="text-green-600">✅ Données synchronisées</p>
            ) : (
              <p className="text-red-600">❌ Aucunes données Supabase</p>
            )}
          </div>
        </div>
      </div>

      {/* Bouton de test */}
      <div className="mb-6 text-center">
        <button
          onClick={runAllTests}
          disabled={loading}
          className="bg-purple-600 text-white py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-lg font-medium"
        >
          {loading ? `🔄 ${currentTest}...` : '🚀 Lancer le diagnostic complet'}
        </button>
      </div>

      {/* Résultats des tests */}
      {Object.keys(results).length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">📊 Résultats des tests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(results).map(([testName, result]) => (
              <div
                key={testName}
                className={`p-4 rounded-lg border ${
                  result.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <h4 className="font-medium mb-2 flex items-center">
                  {result.success ? '✅' : '❌'}
                  <span className="ml-2 capitalize">
                    {testName.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                </h4>
                
                {result.error && (
                  <p className="text-red-600 text-sm mb-2">
                    <strong>Erreur:</strong> {result.error}
                  </p>
                )}
                
                {result.details && (
                  <div className="text-xs">
                    <strong>Détails:</strong>
                    <pre className="mt-1 bg-white p-2 rounded border overflow-auto">
                      {typeof result.details === 'string' 
                        ? result.details 
                        : JSON.stringify(result.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommandations */}
      {recommendations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">💡 Recommandations</h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.type === 'error' 
                    ? 'bg-red-50 border-red-400' 
                    : 'bg-yellow-50 border-yellow-400'
                }`}
              >
                <h4 className="font-medium text-red-800 mb-1">
                  🚨 {rec.message}
                </h4>
                <p className="text-red-700 text-sm">
                  <strong>Solution:</strong> {rec.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">📖 Instructions</h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Connectez-vous d'abord avec Google</li>
          <li>Lancez le diagnostic complet</li>
          <li>Suivez les recommandations par ordre de priorité</li>
          <li>Consultez les logs de la console développeur pour plus de détails</li>
        </ol>
      </div>
    </div>
  );
};

export default CurrentSupabaseDebugger;