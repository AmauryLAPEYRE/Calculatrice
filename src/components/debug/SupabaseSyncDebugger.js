// src/components/debug/SupabaseSyncDebugger.js
// Dans Login.js, ajoutez temporairement :
//import SupabaseSyncDebugger from '../debug/SupabaseSyncDebugger';

// En haut de votre return :
//{process.env.NODE_ENV === 'development' && <SupabaseSyncDebugger />}

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabaseClient';

const SupabaseSyncDebugger = () => {
  const { currentUser, userDetails } = useAuth();
  const [debugResult, setDebugResult] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Test de connexion Supabase
  const testSupabaseConnection = async () => {
    setLoading(true);
    try {
      console.log('🔌 Test de connexion Supabase...');
      
      const { data, error } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true });
      
      if (error) throw error;
      
      setTestResult({
        success: true,
        message: 'Connexion Supabase OK',
        details: `Table users accessible (${data || 0} enregistrements)`
      });
      
    } catch (error) {
      console.error('❌ Erreur connexion Supabase:', error);
      setTestResult({
        success: false,
        message: 'Erreur de connexion Supabase',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Diagnostic complet de synchronisation
  const runSyncDiagnostic = async () => {
    setLoading(true);
    setDebugResult(null);
    
    try {
      console.log('🔍 === DIAGNOSTIC SYNCHRONISATION SUPABASE ===');
      
      const diagnostic = {
        firebase: {
          user: currentUser ? {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            emailVerified: currentUser.emailVerified,
            providerData: currentUser.providerData.map(p => ({
              providerId: p.providerId,
              uid: p.uid
            }))
          } : null
        },
        supabase: {
          userDetails: userDetails,
          connection: null,
          userRecord: null,
          policies: null
        },
        sync: {
          canRead: false,
          canWrite: false,
          errors: []
        }
      };

      if (currentUser) {
        // Test de lecture utilisateur
        try {
          const { data: userData, error: readError } = await supabase
            .from('users')
            .select('*')
            .eq('firebase_uid', currentUser.uid)
            .single();
          
          if (readError && readError.code !== 'PGRST116') { // PGRST116 = pas de résultat
            diagnostic.sync.errors.push(`Lecture: ${readError.message}`);
          } else {
            diagnostic.sync.canRead = true;
            diagnostic.supabase.userRecord = userData;
          }
        } catch (error) {
          diagnostic.sync.errors.push(`Erreur lecture: ${error.message}`);
        }

        // Test d'écriture (update ou insert)
        try {
          const testData = {
            firebase_uid: currentUser.uid,
            email: currentUser.email,
            display_name: currentUser.displayName || 'Test User',
            last_login: new Date().toISOString()
          };

          const { error: writeError } = await supabase
            .from('users')
            .upsert(testData, { 
              onConflict: 'firebase_uid',
              ignoreDuplicates: false 
            });
          
          if (writeError) {
            diagnostic.sync.errors.push(`Écriture: ${writeError.message}`);
          } else {
            diagnostic.sync.canWrite = true;
          }
        } catch (error) {
          diagnostic.sync.errors.push(`Erreur écriture: ${error.message}`);
        }

        // Test des politiques RLS
        try {
          const { data: policies } = await supabase.rpc('get_table_policies', { 
            table_name: 'users' 
          }).catch(() => ({ data: null }));
          
          diagnostic.supabase.policies = policies;
        } catch (error) {
          console.warn('Impossible de récupérer les politiques RLS');
        }
      }

      console.log('Résultat diagnostic:', diagnostic);
      setDebugResult(diagnostic);
      
    } catch (error) {
      console.error('❌ Erreur lors du diagnostic:', error);
      setDebugResult({
        error: error.message,
        firebase: { user: currentUser ? 'Connecté' : 'Non connecté' },
        supabase: { error: error.message }
      });
    } finally {
      setLoading(false);
    }
  };

  // Test de synchronisation manuelle
  const testManualSync = async () => {
    if (!currentUser) {
      alert('Aucun utilisateur connecté');
      return;
    }

    setLoading(true);
    try {
      console.log('🔄 Test de synchronisation manuelle...');
      
      // Import dynamique pour éviter les erreurs
      const { syncUserWithSupabase } = await import('../../supabaseClient');
      
      const result = await syncUserWithSupabase(currentUser, {
        country: 'France',
        city: 'Test City',
        postalCode: '75001'
      });
      
      setTestResult({
        success: true,
        message: 'Synchronisation manuelle réussie',
        details: `Utilisateur synchronisé: ${result?.email || currentUser.email}`
      });
      
    } catch (error) {
      console.error('❌ Erreur synchronisation manuelle:', error);
      setTestResult({
        success: false,
        message: 'Erreur de synchronisation manuelle',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Vérifier la structure de la table users
  const checkTableStructure = async () => {
    setLoading(true);
    try {
      console.log('🔍 Vérification structure table users...');
      
      // Récupérer les informations sur la table
      const { data, error } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_name', 'users')
        .eq('table_schema', 'public');
      
      if (error) throw error;
      
      setTestResult({
        success: true,
        message: 'Structure de la table users',
        details: data
      });
      
    } catch (error) {
      console.error('❌ Erreur vérification structure:', error);
      setTestResult({
        success: false,
        message: 'Impossible de vérifier la structure',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-800">
        🔧 Diagnostic Synchronisation Supabase
      </h2>
      
      {/* Informations utilisateur */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">👤 État utilisateur</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-700">🔥 Firebase</h4>
            {currentUser ? (
              <ul className="space-y-1">
                <li>UID: <code className="bg-gray-200 px-1 rounded">{currentUser.uid}</code></li>
                <li>Email: <code className="bg-gray-200 px-1 rounded">{currentUser.email}</code></li>
                <li>Nom: <code className="bg-gray-200 px-1 rounded">{currentUser.displayName || 'Non défini'}</code></li>
              </ul>
            ) : (
              <p className="text-red-600">Aucun utilisateur connecté</p>
            )}
          </div>
          
          <div>
            <h4 className="font-medium text-purple-700">🗄️ Supabase</h4>
            {userDetails ? (
              <ul className="space-y-1">
                <li>ID: <code className="bg-gray-200 px-1 rounded">{userDetails.id}</code></li>
                <li>Email: <code className="bg-gray-200 px-1 rounded">{userDetails.email}</code></li>
                <li>Status: <code className="bg-gray-200 px-1 rounded">{userDetails.status}</code></li>
              </ul>
            ) : (
              <p className="text-red-600">Aucunes données Supabase</p>
            )}
          </div>
        </div>
      </div>

      {/* Boutons de test */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button
          onClick={testSupabaseConnection}
          disabled={loading}
          className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-colors disabled:opacity-50"
        >
          {loading ? '🔄' : '🔌'} Test Connexion
        </button>
        
        <button
          onClick={runSyncDiagnostic}
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {loading ? '🔄' : '🔍'} Diagnostic Sync
        </button>
        
        <button
          onClick={testManualSync}
          disabled={loading || !currentUser}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          {loading ? '🔄' : '🔄'} Test Sync Manuel
        </button>
        
        <button
          onClick={checkTableStructure}
          disabled={loading}
          className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50"
        >
          {loading ? '🔄' : '🏗️'} Structure Table
        </button>
      </div>

      {/* Résultats des tests */}
      {testResult && (
        <div className={`mb-6 p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <h3 className="text-lg font-semibold mb-2">
            {testResult.success ? '✅ Test réussi' : '❌ Test échoué'}
          </h3>
          <p className={testResult.success ? 'text-green-700' : 'text-red-700'}>
            {testResult.message}
          </p>
          {testResult.details && (
            <div className="mt-2 p-2 bg-white rounded border">
              <pre className="text-xs overflow-auto">
                {typeof testResult.details === 'string' 
                  ? testResult.details 
                  : JSON.stringify(testResult.details, null, 2)}
              </pre>
            </div>
          )}
          {testResult.error && (
            <p className="text-red-600 text-sm mt-2">
              Erreur: {testResult.error}
            </p>
          )}
        </div>
      )}

      {/* Résultats du diagnostic */}
      {debugResult && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">📊 Résultat du diagnostic</h3>
          
          {debugResult.error ? (
            <div className="bg-red-100 p-3 rounded border border-red-200">
              <p className="text-red-700">Erreur: {debugResult.error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Statut de synchronisation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-3 rounded ${debugResult.sync?.canRead ? 'bg-green-100' : 'bg-red-100'}`}>
                  <h4 className="font-medium">📖 Lecture Supabase</h4>
                  <p className={debugResult.sync?.canRead ? 'text-green-700' : 'text-red-700'}>
                    {debugResult.sync?.canRead ? '✅ Fonctionnelle' : '❌ Problème'}
                  </p>
                </div>
                
                <div className={`p-3 rounded ${debugResult.sync?.canWrite ? 'bg-green-100' : 'bg-red-100'}`}>
                  <h4 className="font-medium">✏️ Écriture Supabase</h4>
                  <p className={debugResult.sync?.canWrite ? 'text-green-700' : 'text-red-700'}>
                    {debugResult.sync?.canWrite ? '✅ Fonctionnelle' : '❌ Problème'}
                  </p>
                </div>
              </div>

              {/* Erreurs de synchronisation */}
              {debugResult.sync?.errors?.length > 0 && (
                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <h4 className="font-medium text-red-800 mb-2">🚨 Erreurs détectées</h4>
                  <ul className="text-red-700 text-sm space-y-1">
                    {debugResult.sync.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Données utilisateur Supabase */}
              {debugResult.supabase?.userRecord && (
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">👤 Enregistrement utilisateur Supabase</h4>
                  <pre className="text-xs text-blue-700 overflow-auto">
                    {JSON.stringify(debugResult.supabase.userRecord, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-800 mb-2">📖 Instructions</h3>
        <ol className="text-sm text-purple-700 space-y-1 list-decimal list-inside">
          <li>Testez d'abord la connexion Supabase</li>
          <li>Lancez le diagnostic complet pour identifier les problèmes</li>
          <li>Vérifiez la structure de la table si nécessaire</li>
          <li>Testez la synchronisation manuelle</li>
          <li>Consultez les erreurs détaillées dans la console</li>
        </ol>
      </div>
    </div>
  );
};

export default SupabaseSyncDebugger;