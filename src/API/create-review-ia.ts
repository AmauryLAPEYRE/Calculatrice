// supabase/functions/create-review-ia/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "npm:openai";
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
// Configuration CORS
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "https://fydo.app",
  "https://www.fydo.fr"
];
// Fonction pour ajouter les en-têtes CORS
const addCorsHeaders = (response, origin)=>{
  const headers = new Headers(response.headers);
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "*";
  headers.set("Access-Control-Allow-Origin", allowOrigin);
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Max-Age", "86400");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};
// Fonction pour créer ou mettre à jour un produit dans la table products
const ensureProductExists = async (supabase, productCode, productName = null)=>{
  try {
    console.log(`🔍 Vérification existence produit: ${productCode}`);
    // Vérifier si le produit existe
    const { data: existingProduct, error: checkError } = await supabase.from('products').select('code').eq('code', productCode).single();
    if (checkError && checkError.code !== 'PGRST116') {
      console.error("❌ Erreur vérification produit:", checkError);
      return false;
    }
    if (existingProduct) {
      console.log(`✅ Produit ${productCode} existe déjà`);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("❌ Erreur dans ensureProductExists:", error);
    return false;
  }
};
// Fonction pour insérer les produits similaires (bidirectionnel)
const insertSimilarProducts = async (supabase, productCode, similarProducts)=>{
  try {
    if (!similarProducts || typeof similarProducts !== 'object') {
      console.log("ℹ️ Aucun produit similaire à insérer");
      return {
        success: true,
        inserted: 0
      };
    }
    console.log("🔗 Début insertion produits similaires...");
    console.log("📊 Données reçues:", JSON.stringify(similarProducts, null, 2));
    let insertedCount = 0;
    const insertPromises = [];
    // Parcourir chaque produit similaire
    for (const [key, similarProduct] of Object.entries(similarProducts)){
      try {
        // Validation des données du produit similaire
        if (!similarProduct.similar_product_code || !similarProduct.similarity_score) {
          console.warn(`⚠️ Produit similaire ${key} incomplet:`, similarProduct);
          continue;
        }
        const similarCode = similarProduct.similar_product_code;
        const score = parseFloat(similarProduct.similarity_score);
        const reason = 'similar_product';
        const description = similarProduct.similarity_description || '';
        // Valider le score de similarité
        if (isNaN(score) || score < 0 || score > 1) {
          console.warn(`⚠️ Score de similarité invalide pour ${key}:`, score);
          continue;
        }
        // Éviter l'auto-référence
        if (productCode === similarCode) {
          console.warn(`⚠️ Auto-référence détectée pour ${productCode}, ignorée`);
          return {
            success: false,
            error: 'Auto-référence',
            inserted: 0
          };
        }
        console.log(`🔗 Traitement relation: ${productCode} ↔ ${similarCode} (score: ${score})`);
        // S'assurer que les deux produits existent dans la table products
        const productExistsPromise = ensureProductExists(supabase, productCode);
        const similarExistsPromise = true; // Commenté dans votre code original
        const [productExists, similarExists] = await Promise.all([
          productExistsPromise,
          similarExistsPromise
        ]);
        if (!productExists || !similarExists) {
          console.warn(`⚠️ Un des produits n'existe pas: ${productCode}=${productExists}, ${similarCode}=${similarExists}`);
          continue;
        }
        // Préparer les deux relations (bidirectionnelles)
        console.info(` --> Traitement des produits : ${productCode}, ${similarCode}`);
        const relations = [
          {
            product_code: productCode,
            similar_product_code: similarCode,
            similarity_score: score,
            similarity_reason: reason,
            similarity_description: description,
            created_at: new Date().toISOString()
          },
          {
            product_code: similarCode,
            similar_product_code: productCode,
            similarity_score: score,
            similarity_reason: reason,
            similarity_description: description,
            created_at: new Date().toISOString()
          }
        ];
        // Insérer chaque relation avec gestion des doublons
        for (const relation of relations){
          const insertPromise = supabase.from('similar_products').upsert([
            relation
          ], {
            onConflict: 'product_code,similar_product_code',
            ignoreDuplicates: false
          }).then(({ error })=>{
            if (error) {
              // Si c'est une erreur de contrainte unique, c'est normal
              if (error.code === '23505') {
                console.log(`ℹ️ Relation déjà existante: ${relation.product_code} → ${relation.similar_product_code}`);
              } else {
                console.error(`❌ Erreur insertion relation ${relation.product_code} → ${relation.similar_product_code}:`, error);
              }
            } else {
              console.log(`✅ Relation créée: ${relation.product_code} → ${relation.similar_product_code}`);
              insertedCount++;
            }
          });
          insertPromises.push(insertPromise);
        }
      } catch (productError) {
        console.error(`❌ Erreur traitement produit similaire ${key}:`, productError);
      }
    }
    // Attendre toutes les insertions
    await Promise.allSettled(insertPromises);
    console.log(`✅ Insertion produits similaires terminée: ${insertedCount} relations créées`);
    return {
      success: true,
      inserted: insertedCount
    };
  } catch (error) {
    console.error("❌ Erreur globale insertion produits similaires:", error);
    return {
      success: false,
      error: error.message,
      inserted: 0
    };
  }
};
// Fonction principale avec gestion d'erreurs robuste
Deno.serve(async (req)=>{
  const origin = req.headers.get("Origin") || "";
  console.log("🚀 === NOUVELLE REQUÊTE ===");
  console.log("📥 Méthode:", req.method);
  console.log("🌐 Origin:", origin);
  console.log("⏰ Timestamp:", new Date().toISOString());
  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    console.log("✅ Requête OPTIONS traitée");
    return addCorsHeaders(new Response(null, {
      status: 204
    }), origin);
  }
  try {
    // Vérification de la méthode HTTP
    if (req.method !== "POST") {
      console.log("❌ Méthode non autorisée:", req.method);
      return addCorsHeaders(new Response(JSON.stringify({
        error: "Méthode non autorisée",
        allowedMethods: [
          "POST"
        ],
        received: req.method
      }), {
        status: 405,
        headers: {
          "Content-Type": "application/json"
        }
      }), origin);
    }
    // Vérification des variables d'environnement
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    console.log("🔑 Vérification des variables d'environnement:");
    console.log("  - OPENAI_API_KEY:", openaiApiKey ? `✅ Présent (${openaiApiKey.substring(0, 7)}...)` : "❌ MANQUANT");
    console.log("  - SUPABASE_URL:", supabaseUrl ? "✅ Présent" : "❌ MANQUANT");
    console.log("  - SUPABASE_SERVICE_ROLE_KEY:", supabaseKey ? "✅ Présent" : "❌ MANQUANT");
    if (!openaiApiKey || !supabaseUrl || !supabaseKey) {
      const missingVars = [];
      if (!openaiApiKey) missingVars.push("OPENAI_API_KEY");
      if (!supabaseUrl) missingVars.push("SUPABASE_URL");
      if (!supabaseKey) missingVars.push("SUPABASE_SERVICE_ROLE_KEY");
      console.error("❌ Variables d'environnement manquantes:", missingVars);
      return addCorsHeaders(new Response(JSON.stringify({
        error: "Configuration du serveur incomplète",
        missingVariables: missingVars,
        hint: "Vérifiez la configuration des variables d'environnement sur Supabase"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }), origin);
    }
    // Lecture du body avec gestion d'erreurs robuste
    console.log("📖 Lecture du body de la requête...");
    let rawBody;
    let params;
    try {
      rawBody = await req.text();
      console.log("📄 Body reçu:", rawBody);
      console.log("📏 Taille:", rawBody.length, "caractères");
      if (!rawBody || rawBody.trim() === '') {
        throw new Error("Body vide");
      }
      params = JSON.parse(rawBody);
      console.log("🎯 Paramètres parsés:", JSON.stringify(params, null, 2));
    } catch (bodyError) {
      console.error("❌ Erreur lecture/parsing body:", bodyError);
      return addCorsHeaders(new Response(JSON.stringify({
        error: "Impossible de lire le corps de la requête",
        details: bodyError.message,
        receivedBody: rawBody || "undefined",
        hint: "Vérifiez que le Content-Type est 'application/json' et que le JSON est valide"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      }), origin);
    }
    // Validation des paramètres avec messages détaillés
    console.log("🔍 Validation des paramètres...");
    const requiredParams = [
      'productCode',
      'productName',
      'userId'
    ];
    const missingParams = requiredParams.filter((param)=>!params[param]);
    if (missingParams.length > 0) {
      console.error("❌ Paramètres manquants:", missingParams);
      return addCorsHeaders(new Response(JSON.stringify({
        error: "Paramètres obligatoires manquants",
        missing: missingParams,
        received: Object.keys(params),
        required: requiredParams,
        example: {
          productCode: "3017620425035",
          productName: "Nutella 400g",
          userId: "user-uuid-here"
        }
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      }), origin);
    }
    // Valeurs par défaut pour les critères
    const criteria1 = "Goût et texture";
    const criteria2 = "Rapport qualité/prix";
    const criteria3 = "Ingrédients et composition";
    console.log("📊 Configuration finale:");
    console.log(`  - Produit: ${params.productName} (${params.productCode})`);
    console.log(`  - Utilisateur: ${params.userId}`);
    console.log(`  - Critères: ${criteria1}, ${criteria2}, ${criteria3}`);
    // Initialisation Supabase avec test de connexion ET désactivation du realtime
    console.log("🗄️ Initialisation Supabase...");
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          'x-my-custom-header': 'my-app-name'
        }
      },
      realtime: {
        params: {
          eventsPerSecond: 2
        }
      },
      // Désactiver explicitement le realtime pour les Edge Functions
      auth: {
        persistSession: false
      }
    });
    // Test rapide de connexion
    try {
      const { error: testError } = await supabase.from('product_reviews').select('id').limit(1);
      if (testError) {
        throw new Error(`Connexion Supabase échouée: ${testError.message}`);
      }
      console.log("✅ Connexion Supabase OK");
    } catch (supabaseTestError) {
      console.error("❌ Test connexion Supabase:", supabaseTestError);
      return addCorsHeaders(new Response(JSON.stringify({
        error: "Erreur de connexion à la base de données",
        details: supabaseTestError.message
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }), origin);
    }
    // Vérifier l'avis existant
    console.log("🔍 Vérification avis existant...");
    const { data: existingReview, error: checkError } = await supabase.from('product_reviews').select('id, creation_date').eq('user_id', params.userId).eq('product_code', params.productCode).single();
    if (checkError && checkError.code !== 'PGRST116') {
      console.error("❌ Erreur vérification avis:", checkError);
      throw new Error(`Erreur de vérification: ${checkError.message}`);
    }
    if (existingReview) {
      console.log("⚠️ Avis existant trouvé:", existingReview);
      return addCorsHeaders(new Response(JSON.stringify({
        error: "Un avis existe déjà pour ce produit et cet utilisateur",
        existingReview: {
          id: existingReview.id,
          date: existingReview.creation_date
        }
      }), {
        status: 409,
        headers: {
          "Content-Type": "application/json"
        }
      }), origin);
    }
    console.log("✅ Aucun avis existant, génération possible");
    // Configuration OpenAI avec test
    console.log("🧠 Configuration OpenAI...");
    const openai = new OpenAI({
      apiKey: openaiApiKey
    });
    // Génération du prompt AMÉLIORÉ pour les produits similaires
    const promptText = `Tu es un expert en évaluation de produits alimentaires. Tu dois générer un avis éclairé détaillé, réaliste et original basé sur le conseil d'un achat éventuel sur le produit suivant : 

**Produit :** ${params.productName}
**Code produit :** ${params.productCode}
**Critères d'évaluation :**
1. ${criteria1} (note de 1 à 5)
2. ${criteria2} (note de 1 à 5)  
3. ${criteria3} (note de 1 à 5)

**Instructions :**
- Génère un avis constructif, réaliste et original (basé sur la philosophie de fydo, "je peux me fier a ce produit, il est bon et sain"
- Commentaire maximum de 10 lignes 
- Les notes doivent être cohérentes avec les commentaires
- si tu mets des notes extrême <2 ou >4.5 tu dois le justifié dans le commentaire
- Utilise un ton de conseil expert naturel, comme un vrai client qui a testé le produit
- IMPORTANT: calcul aussi un prix d'achat moyen réaliste et précis pour ce produit
- IMPORTANT : trouve et utilise uniquement des codes-barres réels, vérifiables en ligne (produits existants en base de données publique comme Open Food Facts, sites de marques ou distributeurs).
- Donne au moins 5 produits similaires avec leur vrai code-barre EAN-13, un score de similarité, et une description claire de la similarité.
- IMPORTANT: le code simalire ne peut pas etre le meme que le code Produit
- sur le genaralComment: peux-tu ajouter en fin de commentaire une note d'accompagnement possible ou de recette. 

**Format de réponse JSON attendu :**
{
  "generalComment": "2-3 lignes de commentaire général sur le produit",
  "tasteComment": "1-2 lignes sur le ${criteria1.toLowerCase()}",
  "quantityComment": "1-2 lignes sur la ${criteria2.toLowerCase()}",
  "priceComment": "1-2 lignes sur le ${criteria3.toLowerCase()}",
  "tasteRating": [note de 1.0 à 5.0  sur le ${criteria1.toLowerCase()}],
  "quantityRating": [note de 1.0 à 5.0  sur le ${criteria2.toLowerCase()}], 
  "priceRating": [note de 1.0 à 5.0  sur le ${criteria3.toLowerCase()}],
  "averageRating": [moyenne pondérée calculée],
  "estimatedPrice": [prix d'achat moyen estimé en euros, ex: 3.50],
  "Advice" :[commentaire sur un accompagnement possible original ou de recette original]
  "similar_products": {
    "product1": {
      "similar_product_code": "code-barre-réel-13-chiffres",
      "similarity_score": 0.85,
      "similarity_reason": "same_brand",
      "similarity_description": "Même marque, format différent"
    },
    "product2": {
      "similar_product_code": "autre-code-barre-réel-13-chiffres", 
      "similarity_score": 0.75,
      "similarity_reason": "same_category",
      "similarity_description": "Même catégorie alimentaire, marque concurrente"
    },
    "product3": {
      "similar_product_code": "autre-code-barre-réel-13-chiffres", 
      "similarity_score": 0.75,
      "similarity_reason": "same_category",
      "similarity_description": "Même catégorie alimentaire, marque concurrente"
    },
    "product4": {
      "similar_product_code": "autre-code-barre-réel-13-chiffres", 
      "similarity_score": 0.75,
      "similarity_reason": "same_category",
      "similarity_description": "Même catégorie alimentaire, marque concurrente"
    },    
    "product5": {
      "similar_product_code": "autre-code-barre-réel-13-chiffres", 
      "similarity_score": 0.75,
      "similarity_reason": "same_category",
      "similarity_description": "Même catégorie alimentaire, marque concurrente"
    },
    "product6": {
      "similar_product_code": "autre-code-barre-réel-13-chiffres", 
      "similarity_score": 0.75,
      "similarity_reason": "same_category",
      "similarity_description": "Même catégorie alimentaire, marque concurrente"
    },
    "product7": {
      "similar_product_code": "autre-code-barre-réel-13-chiffres", 
      "similarity_score": 0.75,
      "similarity_reason": "same_category",
      "similarity_description": "Même catégorie alimentaire, marque concurrente"
    }
  }
}

**Pour l'estimation de prix :**
- Base-toi sur les informations trouvées sur internet 
- Considère les prix moyens en supermarché français

Calcule la moyenne pondérée avec ces coefficients :
- ${criteria1}: coefficient 3.0
- ${criteria2}: coefficient 2.0
- ${criteria3}: coefficient 1.0

Retourne uniquement le JSON, sans explication supplémentaire.`;
    console.log("📝 Prompt généré avec demande de produits similaires, longueur:", promptText.length);
    // Appel OpenAI avec timeout
    const startTime = Date.now();
    console.log("⏳ Appel OpenAI...");
    let openaiResponse;
    try {
      openaiResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Tu es un assistant expert en évaluation de produits alimentaires. Tu génères des avis réalistes et équilibrés avec des recommandations de produits similaires."
          },
          {
            role: "user",
            content: promptText
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      });
      const processingTime = Date.now() - startTime;
      console.log(`✅ Réponse OpenAI reçue en ${processingTime}ms`);
    } catch (openaiError) {
      console.error("❌ Erreur OpenAI:", openaiError);
      return addCorsHeaders(new Response(JSON.stringify({
        error: "Erreur lors de la génération par IA",
        details: openaiError.message,
        type: openaiError.type || "unknown"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }), origin);
    }
    // Parsing de la réponse IA
    let aiReview;
    try {
      const textContent = openaiResponse.choices[0].message.content;
      console.log("📄 Contenu OpenAI:", textContent?.substring(0, 200) + "...");
      const jsonMatch = textContent?.match(/```json\n([\s\S]*?)\n```/) || textContent?.match(/```\n([\s\S]*?)\n```/) || [
        null,
        textContent
      ];
      const jsonToParse = jsonMatch[1] || textContent || '{}';
      aiReview = JSON.parse(jsonToParse);
      console.log("✅ Réponse IA parsée successfully");
      console.log("🔗 Produits similaires reçus:", aiReview.similar_products);
    } catch (parseError) {
      console.error("❌ Erreur parsing IA:", parseError);
      return addCorsHeaders(new Response(JSON.stringify({
        error: "Impossible d'analyser la réponse de l'IA",
        details: parseError.message,
        rawResponse: openaiResponse.choices[0].message.content?.substring(0, 500)
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }), origin);
    }
    // Validation réponse IA
    if (!aiReview.generalComment || !aiReview.averageRating || !aiReview.estimatedPrice) {
      console.error("❌ Réponse IA incomplète:", Object.keys(aiReview));
      return addCorsHeaders(new Response(JSON.stringify({
        error: "Réponse IA incomplète",
        received: Object.keys(aiReview),
        required: [
          "generalComment",
          "averageRating",
          "tasteComment",
          "quantityComment",
          "priceComment",
          "estimatedPrice",
          "Advice"
        ]
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }), origin);
    }
    console.log("🎯 Données complètes reçues de l'IA:", {
      taste: aiReview.tasteRating,
      quantity: aiReview.quantityRating,
      price: aiReview.priceRating,
      average: aiReview.averageRating,
      estimatedPrice: aiReview.estimatedPrice,
      similarProductsCount: aiReview.similar_products ? Object.keys(aiReview.similar_products).length : 0
    });
    // Construction du commentaire final
    const fullComment = [
      aiReview.generalComment,
      "",
      `  **${criteria1} :** ${aiReview.tasteComment}`,
      "",
      `  **${criteria2} :** ${aiReview.quantityComment}`,
      "",
      `  **${criteria3} :** ${aiReview.priceComment}`,
      "",
      `  ** CONSEIL :** ${aiReview.Advice}`
    ].join('\n');
    // Formatage des valeurs numériques avec le prix IA
    console.log("🔢 Formatage des valeurs numériques...");
    const averageRatingFormatted = Number(parseFloat(aiReview.averageRating).toFixed(2));
    const tasteRatingFormatted = Number(parseFloat(aiReview.tasteRating).toFixed(1));
    const quantityRatingFormatted = Number(parseFloat(aiReview.quantityRating).toFixed(1));
    const priceRatingFormatted = Number(parseFloat(aiReview.priceRating).toFixed(1));
    const purchasePriceFormatted = Number(parseFloat(aiReview.estimatedPrice).toFixed(2));
    console.log("🔢 Valeurs formatées AVANT insertion:", {
      average_rating: averageRatingFormatted,
      taste_rating: tasteRatingFormatted,
      quantity_rating: quantityRatingFormatted,
      price_rating: priceRatingFormatted,
      purchase_price: purchasePriceFormatted
    });
    // S'assurer que le produit principal existe
    await ensureProductExists(supabase, params.productCode, params.productName);
    // Insertion en base avec prix IA
    console.log("💾 Insertion en base de données...");
    const userId_ia = 'b3ca09ef-6759-4321-9539-12cda1a222ab';
    const { data: newReview, error: insertError } = await supabase.from('product_reviews').insert([
      {
        user_id: userId_ia,
        product_code: params.productCode,
        comment: fullComment,
        is_verified: false,
        status: 'approved_auto',
        average_rating: averageRatingFormatted,
        taste_rating: tasteRatingFormatted,
        quantity_rating: quantityRatingFormatted,
        price_rating: priceRatingFormatted,
        purchase_price: purchasePriceFormatted,
        creation_date: new Date().toISOString(),
        review_source: 'ai'
      }
    ]).select().single();
    if (insertError) {
      console.error("❌ Erreur insertion avis:", insertError);
      console.error("❌ Détails complets de l'erreur:", JSON.stringify(insertError, null, 2));
      throw new Error(`Insertion échouée: ${insertError.message}`);
    }
    console.log("✅ Avis inséré avec ID:", newReview.id);
    // Insertion des notes détaillées
    const TASTE_CRITERIA_ID = '43b1121b-0ffe-478c-aa8c-ed38ef37e234';
    const QUANTITY_CRITERIA_ID = 'e5f32be3-d08c-41be-bbae-db313ed0cb27';
    const PRICE_CRITERIA_ID = '9ad348fb-b617-4af8-97c7-ab9f22739f0c';
    const ratingsToInsert = [
      {
        review_id: newReview.id,
        criteria_id: TASTE_CRITERIA_ID,
        rating: Math.round(aiReview.tasteRating)
      },
      {
        review_id: newReview.id,
        criteria_id: QUANTITY_CRITERIA_ID,
        rating: Math.round(aiReview.quantityRating)
      },
      {
        review_id: newReview.id,
        criteria_id: PRICE_CRITERIA_ID,
        rating: Math.round(aiReview.priceRating)
      }
    ];
    const { error: ratingsError } = await supabase.from('review_ratings').insert(ratingsToInsert);
    if (ratingsError) {
      console.warn("⚠️ Erreur notes détaillées:", ratingsError.message);
    } else {
      console.log("✅ Notes détaillées insérées avec succès");
    }
    // NOUVELLE PARTIE : Insertion des produits similaires
    let similarProductsResult = {
      success: true,
      inserted: 0
    };
    if (aiReview.similar_products) {
      similarProductsResult = await insertSimilarProducts(supabase, params.productCode, aiReview.similar_products);
    }
    const totalTime = Date.now() - startTime;
    console.log(`🎉 === SUCCÈS TOTAL en ${totalTime}ms ===`);
    console.log(`🔗 ${similarProductsResult.inserted} relations de produits similaires créées`);
    // Réponse finale avec prix IA et produits similaires
    return addCorsHeaders(new Response(JSON.stringify({
      success: true,
      reviewId: newReview.id,
      review: {
        id: newReview.id,
        comment: fullComment,
        averageRating: aiReview.averageRating,
        tasteRating: aiReview.tasteRating,
        quantityRating: aiReview.quantityRating,
        priceRating: aiReview.priceRating,
        estimatedPrice: aiReview.estimatedPrice,
        source: 'ai'
      },
      similarProducts: {
        success: similarProductsResult.success,
        inserted: similarProductsResult.inserted,
        details: aiReview.similar_products
      },
      processingTime: totalTime,
      timestamp: new Date().toISOString(),
      dbValues: {
        average_rating: newReview.average_rating,
        taste_rating: newReview.taste_rating,
        quantity_rating: newReview.quantity_rating,
        price_rating: newReview.price_rating,
        purchase_price: newReview.purchase_price
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }), origin);
  } catch (error) {
    console.error("💥 === ERREUR CRITIQUE ===");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("Timestamp:", new Date().toISOString());
    return addCorsHeaders(new Response(JSON.stringify({
      error: "Erreur interne du serveur",
      message: error.message,
      timestamp: new Date().toISOString(),
      hint: "Consultez les logs Supabase pour plus de détails"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    }), origin);
  }
});
