// src/supabaseClient.js - Version corrigée avec bridge Firebase-Supabase
import { createClient } from '@supabase/supabase-js';
import { auth } from './firebase';
// Utilisation Log/console Pour prod
import {logger } from './utils/logger';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;


// Votre création du client existante - NE CHANGEZ RIEN
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// NOUVELLE FONCTION - Ajoutez ça après export const supabase = ...
export const getSupabaseWithAuth = async () => {
  const headers = {};
  
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      headers['x-firebase-uid'] = auth.currentUser.uid;
      headers['x-firebase-token'] = token;
      headers['x-firebase-email'] = auth.currentUser.email || '';
    } catch (error) {
      console.warn('Erreur récupération token Firebase:', error);
    }
  }
logger.debug(' ---> HEADERS:', headers);
  // Créer un nouveau client avec les headers
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: headers
    }
  });
};

/**
 * NOUVEAU: Fonction pour authentifier Supabase avec le token Firebase
 * @param {string} firebaseToken - Token Firebase JWT
 */
export const authenticateSupabaseWithFirebase = async (firebaseToken) => {
  try {
    if (!firebaseToken) {
      console.warn('Pas de token Firebase fourni');
      return null;
    }

    // Option 1: Utiliser Supabase Auth avec le token Firebase custom
    // Cette méthode nécessite une configuration spéciale côté Supabase
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'firebase',
      token: firebaseToken,
    });

    if (error) {
      console.warn('Échec auth Supabase avec Firebase:', error);
      return null;
    }

    console.log('✅ Authentification Supabase réussie avec token Firebase');
    return data;
  } catch (error) {
    console.warn('Erreur auth Firebase->Supabase:', error);
    return null;
  }
};

/**
 * Alternative: Créer un client Supabase avec token personnalisé
 * @param {string} firebaseUid - UID Firebase de l'utilisateur
 * @param {string} firebaseToken - Token Firebase JWT
 */
export const createAuthenticatedSupabaseClient = (firebaseUid, firebaseToken) => {
  const authenticatedClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        'Authorization': `Bearer ${firebaseToken}`,
        'X-Firebase-UID': firebaseUid, // Header personnalisé pour identifier l'utilisateur
      }
    }
  });

  return authenticatedClient;
};

// Reste de votre code existant...
export const syncUserWithSupabase = async (firebaseUser, additionalInfo = {}) => {
  if (!firebaseUser) return null;

  try {
    // Vérifier si l'utilisateur existe déjà dans Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', firebaseUser.uid)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingUser) {
      // Mettre à jour les informations si nécessaire
      const updates = {
        email: firebaseUser.email,
        display_name: firebaseUser.displayName || existingUser.display_name,
        updated_at: new Date()
      };

      if (additionalInfo.country) updates.country = additionalInfo.country;
      if (additionalInfo.city) updates.city = additionalInfo.city;
      if (additionalInfo.postalCode) updates.postal_code = additionalInfo.postalCode;
      if (additionalInfo.language) updates.language = additionalInfo.language;

      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('firebase_uid', firebaseUser.uid)
        .select('*');

      if (updateError) throw updateError;
      
      return updatedUser[0];
    } else {
      // Créer un nouvel utilisateur dans Supabase
      const newUser = {
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
        display_name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        user_type: 'Visiteur',
        created_at: new Date(),
        updated_at: new Date(),
        review_count: 0,
        favorite_count: 0,
        search_by_name_count: 0,
        manual_search_count: 0,
        scan_count: 0,
        status: 'bronze',
        is_suspended: false,
        country: additionalInfo.country || null,
        city: additionalInfo.city || null,
        postal_code: additionalInfo.postalCode || null,
        language: additionalInfo.language || 'fr',
        avatar_seed: firebaseUser.uid,
        avatar_url: null
      };

      const { data: createdUser, error: createError } = await supabase
        .from('users')
        .insert([newUser])
        .select('*');

      if (createError) throw createError;
      
      if (createdUser && createdUser[0]) {
        await createWelcomeSubscription(createdUser[0].id);
      }
      return createdUser[0];
    }
  } catch (error) {
    console.error("Erreur lors de la synchronisation avec Supabase:", error);
    throw error;
  }
};

/**
 * Récupère les détails de l'abonnement actif d'un utilisateur
 * @param {string} firebaseUid - L'identifiant Firebase de l'utilisateur
 * @returns {Promise<Object>} - L'abonnement actif et les détails du plan
 */
// Exemple de modification dans getUserSubscription
export const getUserSubscription = async (firebaseUid) => {
    if (!firebaseUid) return { subscription: null, plan: null };
    
    try {
      // 1. Récupérer l'ID Supabase de l'utilisateur
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('firebase_uid', firebaseUid)
        .single();
        
      if (userError) throw userError;
      
      // 2. Récupérer tous les abonnements actifs de l'utilisateur
const { data: subscriptionsData, error: subscriptionError } = await supabase
  .from('user_subscriptions_with_plans')
  .select(`
          *,
          subscription_plans:plan_id (*)
        `)
  .eq('user_id', userData.id)
  .eq('is_active', true)
  .gte('end_date', new Date().toISOString())
  .order('plan_priority', { ascending: false })
  .order('end_date', { ascending: false });
        
      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        throw subscriptionError;
      }
      
      // Utiliser l'abonnement avec la priorité la plus élevée
      if (subscriptionsData && subscriptionsData.length > 0) {
        const highestPrioritySubscription = subscriptionsData[0];
        return { 
          subscription: highestPrioritySubscription, 
          plan: highestPrioritySubscription.subscription_plans 
        };
      }
      // Si aucun abonnement actif, retourner le plan gratuit par défaut
      const { data: freePlan, error: freePlanError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('name', 'Gratuit')
        .single();
        
      if (freePlanError) throw freePlanError;
      
      return { subscription: null, plan: freePlan }; 
      
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'abonnement:', error);
      return { subscription: null, plan: null };
    }
};
/**
 * Met à jour les informations d'adresse et de langue d'un utilisateur
 * @param {string} firebaseUid - L'identifiant Firebase de l'utilisateur
 * @param {Object} userInfo - Les informations utilisateur (country, city, postalCode, language)
 * @returns {Promise<Object>} - Résultat de l'opération
 */
export const updateUserInfo = async (firebaseUid, userInfo) => {
  if (!firebaseUid) return { success: false, error: 'Identifiant utilisateur requis' };
  
  try {
    // Récupérer l'ID Supabase de l'utilisateur
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', firebaseUid)
      .single();
      
    if (userError) throw userError;
    
    // Préparer les champs à mettre à jour
    const updates = {
      updated_at: new Date()
    };
    
    if (userInfo.country !== undefined) updates.country = userInfo.country;
    if (userInfo.city !== undefined) updates.city = userInfo.city;
    if (userInfo.postalCode !== undefined) updates.postal_code = userInfo.postalCode;
    if (userInfo.language !== undefined) updates.language = userInfo.language;
    
    // Mettre à jour l'utilisateur
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userData.id)
      .select('*');
      
    if (error) throw error;
    
    return { success: true, user: data[0] };
  } catch (error) {
    console.error('Erreur lors de la mise à jour des informations utilisateur:', error);
    return { success: false, error: error.message };
  }
};
/**
 * Met à jour les informations d'adresse d'un utilisateur
 * @param {string} firebaseUid - L'identifiant Firebase de l'utilisateur
 * @param {Object} addressInfo - Les informations d'adresse (country, city, postalCode)
 * @returns {Promise<Object>} - Résultat de l'opération
 */
export const updateUserAddress = async (firebaseUid, addressInfo) => {
  return updateUserInfo(firebaseUid, addressInfo);
};

/**
 * Vérifie si l'utilisateur a atteint son quota de tickets de caisse
 * @param {string} firebaseUid - L'identifiant Firebase de l'utilisateur
 * @returns {Promise<boolean>} - True si le quota est atteint
 */
export const hasReachedReceiptQuota = async (firebaseUid) => {
  try {
    const { subscription, plan } = await getUserSubscription(firebaseUid);
    
    if (!plan) return true; // Par sécurité, considérer le quota comme atteint
    
    // Si l'utilisateur n'a pas d'abonnement actif, vérifier le plan gratuit
    const maxReceipts = plan.max_receipts || 0;
    
    // Si le quota est illimité
    if (maxReceipts < 0) return false;
    
    // 1. Récupérer l'ID Supabase de l'utilisateur
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', firebaseUid)
      .single();
      
    if (userError) throw userError;
    
    // 2. Compter les tickets de caisse de l'utilisateur pour le mois en cours
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const { count, error: countError } = await supabase
      .from('receipts')
      .select('id', { count: 'exact' })
      .eq('user_id', userData.id)
      .gte('upload_date', firstDayOfMonth.toISOString());
      
    if (countError) throw countError;
    
    return count >= maxReceipts;
  } catch (error) {
    console.error('Erreur lors de la vérification du quota:', error);
    return true; // Par sécurité, considérer le quota comme atteint
  }
};

/**
 * Crée un abonnement Essential gratuit d'une semaine pour les nouveaux utilisateurs
 * @param {string} userId - L'ID Supabase de l'utilisateur
 * @returns {Promise<Object>} - L'abonnement créé
 */
export const createWelcomeSubscription = async (userId) => {
  try {
    // Récupérer le plan Essential
    const { data: essentialPlan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('name', 'Essential')
      .eq('is_active', true)
      .single();
      
    if (planError || !essentialPlan) {
      console.error('Plan Essential non trouvé:', planError);
      return null;
    }
    
    // Calculer les dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // Ajouter 7 jours
    
    // Créer l'abonnement
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan_id: essentialPlan.id,
        billing_cycle: 'monthly', // Requis par la contrainte check
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        is_active: true,
        status: 'active', // Requis par la contrainte check
        is_auto_renew: false, // Pas de renouvellement automatique pour l'offre de bienvenue
        payment_method: 'offert', // Différent de 'stripe' pour indiquer que c'est gratuit
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {
          type: 'offert',
          description: 'Abonnement Essential offert pendant 7 jours à l\'inscription',
          original_price: essentialPlan.price_monthly,
          discount: '100%'
        }
      })
      .select('*');
      
    if (subError) {
      console.error('Erreur lors de la création de l\'abonnement de bienvenue:', subError);
      return null;
    }
    
    console.log('Abonnement de bienvenue créé avec succès:', subscription[0]);
    return subscription[0];
  } catch (error) {
    console.error('Erreur lors de la création de l\'abonnement de bienvenue:', error);
    return null;
  }
};

export const createWelcomeEssentialSubscription = async (userId, planId) => {
  try {
    // Vérifier que le plan souscrit est bien un Essential 
    const { data: essentialPlan, error: planEssentialError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('name', 'Essential')
      .eq('is_active', true)
      .eq('id', planId)
      .single(); 

    if (planEssentialError || !essentialPlan) {
      console.error('Le Plan souscrit n\'est pas Essential :', planEssentialError);
      return null;
    }    
        
    // Récupérer le plan Premium
    const { data: premiumPlan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('name', 'Premium')
      .eq('is_active', true)
      .single();
      
    if (planError || !premiumPlan) {
      console.error('Plan Premium non trouvé:', planError);
      return null;
    }

    // ✅ CORRECTION 1: Vérifier les abonnements Premium existants (sans .single())
    const { data: existingPremiumSubs, error: userPremiumError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('plan_id', premiumPlan.id);
    
    if (userPremiumError) {
      console.error('Erreur lors de la vérification des abonnements Premium:', userPremiumError);
      return null;
    }

    // ✅ CORRECTION 2: Vérifier si l'utilisateur a déjà eu ou a un Premium
    if (existingPremiumSubs && existingPremiumSubs.length > 0) {
      console.log('L\'utilisateur a déjà eu un abonnement Premium:', existingPremiumSubs);
      return null;
    }

    // ✅ CORRECTION 3: Vérifier s'il y a déjà un abonnement Premium actif (sécurité supplémentaire)
    const { data: activePremiumSubs, error: activePremiumError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('plan_id', premiumPlan.id)
      .eq('is_active', true)
      .eq('status', 'active');

    if (activePremiumError) {
      console.error('Erreur lors de la vérification des abonnements Premium actifs:', activePremiumError);
      return null;
    }

    if (activePremiumSubs && activePremiumSubs.length > 0) {
      console.log('L\'utilisateur a déjà un abonnement Premium actif:', activePremiumSubs);
      return null;
    }

    // Calculer les dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // Ajouter 7 jours
    
    // Créer l'abonnement
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan_id: premiumPlan.id,
        billing_cycle: 'monthly',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        is_active: true,
        status: 'active',
        is_auto_renew: false,
        payment_method: 'offert',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {
          type: 'welcome_offer',  // ✅ Plus descriptif
          description: 'Abonnement Premium offert pendant 7 jours à l\'inscription',
          original_price: premiumPlan.price_monthly,
          discount: '100%'
        }
      })
      .select('*');
      
    if (subError) {
      console.error('Erreur lors de la création de l\'abonnement de bienvenue:', subError);
      return null;
    }
    
    console.log('Abonnement de bienvenue Premium créé avec succès:', subscription[0]);
    return subscription[0];

  } catch (error) {
    console.error('Erreur lors de la création de l\'abonnement de bienvenue:', error);
    return null;
  }
};