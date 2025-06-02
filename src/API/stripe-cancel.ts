// supabase/functions/stripe-cancel/index.js
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@12.4.0?target=deno&no-check';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    // Récupération des variables d'environnement
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Variables d\'environnement manquantes');
    }
    // Initialisation de Stripe et Supabase
    const stripe = Stripe(STRIPE_SECRET_KEY);
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    // Extraction des données de la requête
    const { subscriptionId, userId, cancelAtPeriodEnd = true } = await req.json();
    if (!subscriptionId || !userId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Les ID d\'abonnement et d\'utilisateur sont requis'
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      });
    }
    // Vérifier que l'utilisateur est bien le propriétaire de l'abonnement
    const { data: userData, error: userError } = await supabase.from('users').select('id').eq('firebase_uid', userId).single();
    if (userError || !userData) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Utilisateur non trouvé'
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 404
      });
    }
    const { data: subscription, error: subError } = await supabase.from('user_subscriptions').select('*').eq('stripe_subscription_id', subscriptionId).eq('user_id', userData.id).single();
    if (subError || !subscription) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Abonnement non trouvé ou vous n\'êtes pas autorisé à le modifier'
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 404
      });
    }
    // Annuler l'abonnement dans Stripe
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: cancelAtPeriodEnd
    });
    // Mettre à jour l'abonnement dans Supabase
    const { error: updateError } = await supabase.from('user_subscriptions').update({
      is_auto_renew: false,
      is_active: true,
      status: 'canceled',
      cancellation_date: new Date().toISOString()
    }).eq('stripe_subscription_id', subscriptionId);
    if (updateError) {
      throw new Error(`Erreur lors de la mise à jour de l'abonnement: ${updateError.message}`);
    }
    return new Response(JSON.stringify({
      success: true,
      canceledAt: new Date().toISOString(),
      currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
      status: updatedSubscription.status
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Erreur:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Une erreur inconnue est survenue'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});
