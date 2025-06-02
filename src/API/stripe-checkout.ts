import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import Stripe from 'https://esm.sh/stripe@12.18.0';
// Initialisation
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);
serve(async (req)=>{
  // Permettre les requêtes CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  // Obtenir les paramètres de la requête URL
  const url = new URL(req.url);
  const planId = url.searchParams.get('planId');
  const customerId = url.searchParams.get('customerId');
  const paymentMethodId = url.searchParams.get('paymentMethodId');
  // Utiliser billing_cycle au lieu de isAnnualCommitment
  const billingCycle = url.searchParams.get('billingCycle') || 'monthly';
  const returnUrl = url.searchParams.get('returnUrl');
  const cancelUrl = url.searchParams.get('cancelUrl');
  const intentId = url.searchParams.get('intentId');
  const paymentMethodTypes = url.searchParams.get('paymentMethodTypes') || 'card';
  const email = url.searchParams.get('email') || null;
  const paymentMethodTypesArray = paymentMethodTypes.split(',').map((type)=>type.trim());
  try {
    // Vérifier les paramètres obligatoires
    if (!planId || !customerId || !returnUrl || !cancelUrl || !intentId) {
      return new Response(JSON.stringify({
        error: 'Paramètres manquants'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    // Récupérer les informations du plan depuis Supabase
    const { data: planData, error: planError } = await supabase.from('subscription_plans').select('*').eq('id', planId).single();
    if (planError) {
      return new Response(JSON.stringify({
        error: `Erreur lors de la récupération du plan: ${planError.message}`
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    // Déterminer l'utilisateur Supabase à partir du Firebase UID
    const { data: userData, error: userError } = await supabase.from('users').select('id').eq('firebase_uid', customerId).single();
    if (userError) {
      return new Response(JSON.stringify({
        error: `Utilisateur non trouvé: ${userError.message}`
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    // Déterminer le prix en fonction du cycle de facturation
    const unitAmount = billingCycle === 'monthly' ? Math.round(planData.price_monthly * 100) : Math.round(planData.price_yearly * 100);
    // Vérifier ou créer le client Stripe
    let stripeCustomerId;
    try {
      // Vérifier si le client existe dans Stripe
      const customer = await stripe.customers.retrieve(customerId);
      stripeCustomerId = customer.id;
    } catch (error) {
      // Si le client n'existe pas, le créer
      console.log("Création d'un nouveau client Stripe pour:", customerId);
      const newCustomer = await stripe.customers.create({
        email: email,
        metadata: {
          firebase_uid: customerId,
          supabase_id: userData.id
        }
      });
      stripeCustomerId = newCustomer.id;
    }
    await stripe.customers.update(stripeCustomerId, {
      email: email
    });
    // Si un ID de méthode de paiement est fourni, l'attacher au client
    if (paymentMethodId) {
      try {
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: stripeCustomerId
        });
        await stripe.customers.update(stripeCustomerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId
          }
        });
      } catch (attachError) {
        console.error("Erreur lors de l'attachement de la méthode de paiement:", attachError);
      }
    }
    // Créer la session de checkout
    const sessionParams = {
      payment_method_types: paymentMethodTypesArray,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: planData.name || 'Abonnement Fydo',
              description: billingCycle === 'monthly' ? 'Mensuel sans engagement' : 'Engagement annuel'
            },
            unit_amount: unitAmount,
            recurring: {
              interval: billingCycle === 'monthly' ? 'month' : 'year'
            }
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: returnUrl,
      cancel_url: cancelUrl,
      customer: stripeCustomerId,
      client_reference_id: intentId
    };
    const session = await stripe.checkout.sessions.create(sessionParams);
    // Log pour afficher la valeur de intentId et d'autres données importantes
    console.log("Mise à jour subscription_intents pour intent ID:", intentId);
    console.log("Données de mise à jour:", {
      userId: userData.id,
      stripeCustomerId: stripeCustomerId,
      stripeSessionId: session.id,
      paymentIntentId: session.payment_intent,
      billingCycle: billingCycle,
      amount: unitAmount / 100
    });
    // Vérifiez d'abord que l'enregistrement existe
    const { data: intentRecord, error: intentCheckError } = await supabase.from('subscription_intents').select('id').eq('id', intentId).single();
    if (intentCheckError) {
      console.error("Erreur lors de la vérification de l'intention d'abonnement:", intentCheckError);
      throw new Error(`L'intention d'abonnement avec ID ${intentId} n'existe pas: ${intentCheckError.message}`);
    }
    console.log("Intention d'abonnement trouvée:", intentRecord);
    // Stocker toutes les informations nécessaires dans l'intention d'abonnement
    // avec capture explicite des erreurs
    try {
      const { data: updateData, error: updateError } = await supabase.from('subscription_intents').update({
        user_id: userData.id,
        stripe_customer_id: stripeCustomerId,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent,
        payment_method_id: paymentMethodId,
        payment_method_types: paymentMethodTypesArray,
        billing_cycle: billingCycle,
        amount: unitAmount / 100,
        currency: 'eur',
        status: 'pending',
        updated_at: new Date().toISOString()
      }).eq('id', intentId).select();
      if (updateError) {
        // Afficher l'erreur de mise à jour
        console.error("ERREUR de mise à jour subscription_intents:", updateError);
        console.error("Message d'erreur:", updateError.message);
        console.error("Détails de l'erreur:", updateError.details);
        throw new Error(`Erreur lors de la mise à jour de l'intention: ${updateError.message}`);
      }
      console.log("Mise à jour réussie de subscription_intents:", updateData);
    } catch (dbError) {
      console.error("Exception lors de la mise à jour de la base de données:", dbError);
      throw dbError;
    }
    // Retourner l'URL de paiement Stripe
    return new Response(JSON.stringify({
      url: session.url,
      session_id: session.id
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error("Erreur lors de la création de la session Stripe:", error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
});
