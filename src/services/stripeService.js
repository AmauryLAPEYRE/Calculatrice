// src/services/stripeService.js
import { supabase } from '../supabaseClient';

/**
 * Crée un abonnement Stripe via une URL de redirection
 * Cette méthode contourne les problèmes CORS en utilisant la redirection plutôt que l'API
 * @param {string} paymentMethodId - ID de la méthode de paiement Stripe
 * @param {string} planId - ID du plan d'abonnement dans notre système
 * @param {string} customerId - ID du client (généralement l'ID Firebase)
 * @param {string} billingCycle - Cycle de facturation ('monthly' ou 'yearly')
 * @param {Array} paymentMethodTypes - Types de paiement à proposer ['card', 'apple_pay', 'google_pay']
 * @returns {Promise<Object>} - URL de redirection pour compléter l'abonnement
 */
export const createSubscription = async (
  paymentMethodId, 
  planId, 
  customerId, 
  billingCycle = 'monthly',
  paymentMethodTypes = ['card']
) => {
  try {
    console.log("⏳ Préparation de la création d'un abonnement Stripe...", {
      paymentMethodId, 
      planId, 
      customerId, 
      billingCycle,
      paymentMethodTypes
    });
    
    // Récupérer l'ID Supabase de l'utilisateur
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', customerId)
      .single();
      
    if (userError) {
      console.error("❌ Erreur lors de la récupération de l'utilisateur:", userError);
      throw new Error(`Erreur lors de la récupération de l'utilisateur: ${userError.message}`);
    }
    
    // 1. Créer un enregistrement temporaire pour suivre l'intention d'abonnement
    const { data: intent, error: intentError } = await supabase
      .from('subscription_intents')
      .insert([{
        user_id: userData.id,
        plan_id: planId,
        payment_method_id: paymentMethodId || 'pending_payment_method',
        billing_cycle: billingCycle,
        payment_method_types: paymentMethodTypes,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
      
    if (intentError) {
      console.error("❌ Erreur lors de la création de l'intention d'abonnement:", intentError);
      throw new Error(`Erreur lors de la création de l'intention d'abonnement: ${intentError.message}`);
    }
    
    // 2. Construire les URLs de callback
    const returnUrl = window.location.origin + '/subscribe/success?intent_id=' + intent.id;
    const cancelUrl = window.location.origin + '/subscribe/cancel?intent_id=' + intent.id;
    
    // 3. Construction de l'URL pour la création de l'abonnement
    const checkoutUrl = `https://gwjkbtbtqntwaqtrflnq.supabase.co/functions/v1/stripe-checkout?` +
      `planId=${encodeURIComponent(planId)}` +
      `&customerId=${encodeURIComponent(customerId)}` +
      (paymentMethodId ? `&paymentMethodId=${encodeURIComponent(paymentMethodId)}` : '') +
      `&billingCycle=${encodeURIComponent(billingCycle)}` +
      `&returnUrl=${encodeURIComponent(returnUrl)}` +
      `&cancelUrl=${encodeURIComponent(cancelUrl)}` +
      `&intentId=${encodeURIComponent(intent.id)}` +
      `&paymentMethodTypes=${encodeURIComponent(paymentMethodTypes.join(','))}`+
    (userData.email ? `&email=${encodeURIComponent(userData.email)}` : ''); // Ajout de l'email s'il est fourni
    
    console.log("✅ URL de paiement générée:", checkoutUrl);
    
    return { 
      success: true, 
      redirectUrl: checkoutUrl,
      intentId: intent.id
    };
  } catch (error) {
    console.error('❌ Erreur lors de la préparation de l\'abonnement:', error);
    return { 
      success: false, 
      error: error.message || 'Une erreur est survenue lors de la préparation de l\'abonnement'
    };
  }
};

/**
 * Vérifie le statut d'une intention d'abonnement
 * @param {string} intentId - ID de l'intention d'abonnement
 * @returns {Promise<Object>} - Statut de l'intention
 */
export const checkSubscriptionIntent = async (intentId) => {
  try {
    console.log("⏳ Vérification du statut de l'intention d'abonnement:", intentId);
    
    const { data, error } = await supabase
      .from('subscription_intents')
      .select(`
        *,
        subscription_plans:plan_id(*)
      `)
      .eq('id', intentId)
      .single();
      
    if (error) {
      console.error("❌ Erreur lors de la vérification de l'intention:", error);
      throw new Error(`Erreur lors de la vérification de l'intention: ${error.message}`);
    }
    
    // Récupérer également l'abonnement associé si présent
    let subscription = null;
    if (data.subscription_id) {
      const { data: subData, error: subError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('stripe_subscription_id', data.subscription_id)
        .single();
        
      if (!subError) {
        subscription = subData;
      }
    }
    
    console.log("✅ Statut de l'intention récupéré:", data.status);
    
    return {
      success: true,
      intent: data,
      subscription: subscription,
      plan: data.subscription_plans, // Correction: utiliser subscription_plans au lieu de plan
      completed: data.status === 'completed',
      status: data.status
    };
  } catch (error) {
    console.error('❌ Erreur lors de la vérification de l\'intention:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Récupère les informations sur un abonnement Stripe existant
 * @param {string} subscriptionId - ID de l'abonnement Stripe
 * @returns {Promise<Object>} - Détails de l'abonnement
 */
export const getSubscriptionDetails = async (subscriptionId) => {
  try {
    console.log("⏳ Récupération des détails de l'abonnement:", subscriptionId);
    
    // Récupérer directement depuis Supabase avec les plans associés
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plans:plan_id(*)
      `)
      .eq('stripe_subscription_id', subscriptionId)
      .single();
      
    if (error) {
      console.error("❌ Erreur lors de la récupération des détails:", error);
      throw error;
    }
    
    console.log("✅ Détails d'abonnement récupérés avec succès");
    
    return { 
      success: true, 
      subscription: {
        id: data.stripe_subscription_id,
        status: data.status,
        is_active: data.is_active,
        billing_cycle: data.billing_cycle,
        currentPeriodEnd: data.end_date,
        planName: data.subscription_plans?.name, // Correction: utiliser subscription_plans au lieu de plans
        planDetails: data.subscription_plans, // Correction: utiliser subscription_plans au lieu de plans
        customerId: data.stripe_customer_id,
        metadata: data.metadata
        // Suppression de lastPayment car last_payment_id semble ne pas être lié à une table existante
      }
    };
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des détails de l\'abonnement:', error);
    return { 
      success: false, 
      error: error.message || 'Une erreur est survenue lors de la récupération des détails' 
    };
  }
};

/**
 * Vérifie si le statut d'une intention d'abonnement est 'completed'
 * @param {string} intentId - ID de l'intention d'abonnement
 * @returns {Promise<Object>} - Résultat indiquant si le statut est 'completed'
 */
export const isSubscriptionCompleted = async (intentId) => {
  try {
    console.log("⏳ Vérification si l'abonnement est complété:", intentId);
    
    const { data, error } = await supabase
      .from('subscription_intents')
      .select('status')
      .eq('id', intentId)
      .single();
      
    if (error) {
      console.error("❌ Erreur lors de la vérification du statut:", error);
      throw new Error(`Erreur lors de la vérification du statut: ${error.message}`);
    }
    
    const isCompleted = data.status === 'completed';
    console.log(`✅ Statut de l'abonnement: ${data.status}, complété: ${isCompleted}`);
    
    return {
      success: true,
      isCompleted: isCompleted,
      status: data.status
    };
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du statut:', error);
    return {
      success: false,
      isCompleted: false,
      error: error.message
    };
  }
};

/**
 * Annule un abonnement Stripe
 * @param {string} subscriptionId - ID de l'abonnement Stripe
 * @param {string} userId - ID de l'utilisateur Firebase
 * @param {boolean} cancelAtPeriodEnd - Si true, l'abonnement sera annulé à la fin de la période en cours
 * @returns {Promise<Object>} - Résultat de l'opération
 */
export const cancelSubscription = async (subscriptionId, userId, cancelAtPeriodEnd = true) => {
  try {
    console.log("⏳ Annulation de l'abonnement Stripe:", subscriptionId);
    
    // Appeler la fonction serverless pour annuler l'abonnement
    const response = await fetch('https://gwjkbtbtqntwaqtrflnq.supabase.co/functions/v1/stripe-cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
        userId,
        cancelAtPeriodEnd
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur lors de l'annulation: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    
    // Mettre à jour l'état de l'abonnement dans Supabase
    if (result.success) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('firebase_uid', userId)
        .single();
        
      if (userError) throw userError;
      
      // Marquer l'abonnement comme non-renouvelé automatiquement
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({ 
          is_auto_renew: false,
          cancellation_date: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscriptionId)
        .eq('user_id', userData.id);
        
      if (updateError) throw updateError;
    }
    
    console.log("✅ Abonnement annulé avec succès");
    
    return { 
      success: true, 
      canceledAt: result.canceledAt,
      currentPeriodEnd: result.currentPeriodEnd,
      status: result.status
    };
  } catch (error) {
    console.error('❌ Erreur lors de l\'annulation de l\'abonnement:', error);
    return { 
      success: false, 
      error: error.message || 'Une erreur est survenue lors de l\'annulation de l\'abonnement'
    };
  }
}

export default {
  createSubscription,
  getSubscriptionDetails,
  checkSubscriptionIntent,
  isSubscriptionCompleted, // Ajout de la nouvelle fonction
  cancelSubscription
};