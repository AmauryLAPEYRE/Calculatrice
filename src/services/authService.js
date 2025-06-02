// src/services/authService.js - Version améliorée
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    onAuthStateChanged
} from "firebase/auth";
import { auth, db } from "../firebase";
import { syncUserWithSupabase } from "../supabaseClient"; // Import ajouté

// Créer un nouvel utilisateur
export const registerUser = async (email, password, displayName, addressInfo = {}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Mettre à jour le profil avec le nom d'affichage
    await updateProfile(user, { displayName });
    
    // Synchroniser immédiatement avec Supabase avec les informations d'adresse
    await syncUserWithSupabase(user, addressInfo);
    
    return user;
  } catch (error) {
    throw error;
  }
};

// Connecter un utilisateur
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Déconnecter l'utilisateur
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw error;
  }
};

// Réinitialiser le mot de passe
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    throw error;
  }
};

// Observer l'état de l'authentification
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Fonction ROBUSTE pour la connexion Google avec fallback
export const signInWithGoogle = async () => {
  try {
    // Configuration du provider avec paramètres essentiels
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    // CRUCIAL: Force la sélection de compte (évite les problèmes de cache)
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    // Connexion avec popup
    const result = await signInWithPopup(auth, provider);
    
    if (!result) {
      throw new Error('Connexion échouée: aucun résultat');
    }
    
    return result;
    
  } catch (error) {
    // Gestion spécifique des erreurs courantes
    switch (error.code) {
      case 'auth/popup-blocked':
        throw new Error('Popup bloqué par le navigateur. Veuillez autoriser les popups pour ce site.');
        
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        throw new Error('Connexion annulée');
        
      case 'auth/unauthorized-domain':
        throw new Error('Domaine non autorisé dans la configuration Firebase');
        
      case 'auth/invalid-oauth-client-id':
        throw new Error('Configuration OAuth incorrecte');
        
      case 'auth/network-request-failed':
        throw new Error('Erreur de connexion réseau');
        
      default:
        throw error;
    }
  }
};