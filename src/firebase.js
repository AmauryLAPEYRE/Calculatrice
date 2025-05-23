// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Configuration Firebase avec variables d'environnement
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Vérification que toutes les variables d'environnement sont présentes
const requiredEnvVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('❌ Variables d\'environnement Firebase manquantes:', missingEnvVars);
    console.error('Assurez-vous que votre fichier .env contient toutes les variables nécessaires');
}

// Initialiser Firebase
let app;
try {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialisé avec succès');
    
    // Afficher des informations de débogage en développement
    if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Mode développement - Configuration Firebase:');
        console.log('- Project ID:', firebaseConfig.projectId);
        console.log('- Auth Domain:', firebaseConfig.authDomain);
        console.log('- Storage Bucket:', firebaseConfig.storageBucket);
    }
} catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de Firebase:', error);
    throw error;
}

// Initialiser les services Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Configuration des émulateurs pour le développement local
const useEmulators = process.env.REACT_APP_USE_FIREBASE_EMULATORS === 'true';
const isEmulatorConnected = {
    auth: false,
    firestore: false,
    storage: false
};

if (process.env.NODE_ENV === 'development' && useEmulators) {
    try {
        // Émulateur Auth
        if (!isEmulatorConnected.auth) {
            connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
            isEmulatorConnected.auth = true;
            console.log('🔧 Émulateur Auth connecté sur le port 9099');
        }
        
        // Émulateur Firestore
        if (!isEmulatorConnected.firestore) {
            connectFirestoreEmulator(db, 'localhost', 8080);
            isEmulatorConnected.firestore = true;
            console.log('🔧 Émulateur Firestore connecté sur le port 8080');
        }
        
        // Émulateur Storage
        if (!isEmulatorConnected.storage) {
            connectStorageEmulator(storage, 'localhost', 9199);
            isEmulatorConnected.storage = true;
            console.log('🔧 Émulateur Storage connecté sur le port 9199');
        }
        
        console.log('✅ Tous les émulateurs Firebase sont connectés');
    } catch (error) {
        console.warn('⚠️ Erreur lors de la connexion aux émulateurs:', error.message);
        console.warn('Continuez en mode production...');
    }
}

// Fonction utilitaire pour vérifier la connexion
export const checkFirebaseConnection = async () => {
    try {
        // Test simple de connexion à Firebase
        const testPromise = new Promise((resolve, reject) => {
            const unsubscribe = auth.onAuthStateChanged(
                (user) => {
                    unsubscribe();
                    resolve(true);
                },
                (error) => {
                    unsubscribe();
                    reject(error);
                }
            );
        });
        
        await Promise.race([
            testPromise,
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout de connexion')), 5000)
            )
        ]);
        
        console.log('✅ Connexion Firebase vérifiée');
        return true;
    } catch (error) {
        console.error('❌ Problème de connexion Firebase:', error);
        return false;
    }
};

// Fonction utilitaire pour obtenir les informations de configuration
export const getFirebaseInfo = () => {
    return {
        projectId: firebaseConfig.projectId,
        authDomain: firebaseConfig.authDomain,
        storageBucket: firebaseConfig.storageBucket,
        isEmulatorMode: useEmulators && process.env.NODE_ENV === 'development',
        emulators: isEmulatorConnected
    };
};

// Fonction pour déboguer les problèmes d'authentification Google
export const debugGoogleAuth = () => {
    console.log('🔍 Débogage Google Auth:');
    console.log('- Auth Domain:', auth.app.options.authDomain);
    console.log('- Current Origin:', window.location.origin);
    console.log('- Is Emulator:', useEmulators);
    
    // Vérifier si le domaine d'authentification est correct
    const expectedAuthDomain = `${firebaseConfig.projectId}.firebaseapp.com`;
    if (auth.app.options.authDomain !== expectedAuthDomain) {
        console.warn(`⚠️ Auth Domain potentiellement incorrect. Attendu: ${expectedAuthDomain}, Actuel: ${auth.app.options.authDomain}`);
    }
};

// Exporter les services Firebase
export { auth, db, storage };

// Exporter l'app Firebase pour les cas d'usage avancés
export default app;