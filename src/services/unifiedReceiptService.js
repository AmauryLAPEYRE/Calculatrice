// src/services/unifiedReceiptService.js - Service consolidé et optimisé
import { supabase } from '../supabaseClient';

/**
 * =====================================================
 * GESTION DES ENSEIGNES
 * =====================================================
 */

/**
 * Recherche ou crée une enseigne dans la base de données
 * @param {Object} enseigneData - Données de l'enseigne
 * @param {string} enseigneData.nom - Nom de l'enseigne
 * @param {string} enseigneData.code_postal - Code postal
 * @param {string} enseigneData.pays - Code pays (FR, DE, etc.)
 * @param {string} [enseigneData.adresse1] - Adresse ligne 1
 * @param {string} [enseigneData.adresse2] - Adresse ligne 2  
 * @param {string} [enseigneData.ville] - Ville
 * @param {string} [enseigneData.siret] - SIRET
 * @returns {Promise<Object>} - Résultat avec l'ID de l'enseigne
 */
export const findOrCreateEnseigne = async (enseigneData) => {
  try {
    console.log('🏬 Recherche ou création d\'enseigne:', enseigneData);
    
    if (!enseigneData?.nom) {
      throw new Error('Le nom de l\'enseigne est requis');
    }

    // Rechercher d'abord une enseigne existante
    const { data: existingEnseigne, error: searchError } = await supabase
      .from('enseignes')
      .select('id, nom, code_postal, pays')
      .eq('nom', enseigneData.nom.trim())
      .eq('code_postal', enseigneData.code_postal || '00000')
      .eq('pays', enseigneData.pays || 'FR')
      .maybeSingle(); // Utiliser maybeSingle pour éviter l'erreur si pas trouvé
    
    if (searchError) {
      console.error('❌ Erreur lors de la recherche d\'enseigne:', searchError);
      throw searchError;
    }
    
    if (existingEnseigne) {
      console.log('✅ Enseigne existante trouvée:', existingEnseigne.id);
      return {
        success: true,
        enseigne: existingEnseigne,
        created: false
      };
    }
    
    // Créer une nouvelle enseigne si pas trouvée
    console.log('➕ Création d\'une nouvelle enseigne');
    const { data: newEnseigne, error: createError } = await supabase
      .from('enseignes')
      .insert([{
        nom: enseigneData.nom.trim(),
        adresse1: enseigneData.adresse1 || 'Adresse inconnue',
        adresse2: enseigneData.adresse2 || null,
        code_postal: enseigneData.code_postal || '00000',
        ville: enseigneData.ville || 'Ville inconnue',
        pays: enseigneData.pays || 'FR',
        siret: enseigneData.siret || null,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Erreur lors de la création d\'enseigne:', createError);
      throw createError;
    }
    
    console.log('✅ Nouvelle enseigne créée:', newEnseigne.id);
    return {
      success: true,
      enseigne: newEnseigne,
      created: true
    };
  } catch (error) {
    console.error('❌ Erreur dans findOrCreateEnseigne:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Met à jour une enseigne existante
 * @param {string} enseigneId - ID de l'enseigne
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>} - Résultat de la mise à jour
 */
export const updateEnseigne = async (enseigneId, updateData) => {
  try {
    console.log('🔄 Mise à jour de l\'enseigne:', enseigneId, updateData);
    
    const { data: updatedEnseigne, error } = await supabase
      .from('enseignes')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', enseigneId)
      .select()
      .single();
    
    if (error) throw error;
    
    console.log('✅ Enseigne mise à jour avec succès');
    return {
      success: true,
      enseigne: updatedEnseigne
    };
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de l\'enseigne:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * =====================================================
 * GESTION DES TICKETS DE CAISSE
 * =====================================================
 */

/**
 * Met à jour un ticket de caisse avec de nouvelles informations
 * @param {string} receiptId - ID du ticket
 * @param {Object} updateData - Données à mettre à jour
 * @param {string} [updateData.receipt_date] - Date du ticket
 * @param {number} [updateData.total_ttc] - Montant TTC
 * @param {number} [updateData.total_ht] - Montant HT
 * @param {string} [updateData.pays] - Code pays
 * @param {string} [updateData.devise] - Code devise
 * @param {string} [updateData.enseigne_id] - ID de l'enseigne
 * @returns {Promise<Object>} - Résultat de la mise à jour
 */
export const updateReceipt = async (receiptId, updateData) => {
  try {
    console.log('🧾 Mise à jour du ticket:', receiptId, updateData);
    
    if (!receiptId) {
      throw new Error('ID du ticket requis');
    }

    // Préparer les données pour la mise à jour
    const dataToUpdate = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    // S'assurer que les montants sont des nombres valides
    if (updateData.total_ttc !== undefined) {
      dataToUpdate.total_ttc = parseFloat(updateData.total_ttc) || 0;
    }
    if (updateData.total_ht !== undefined) {
      dataToUpdate.total_ht = parseFloat(updateData.total_ht) || 0;
    }

    const { data: updatedReceipt, error } = await supabase
      .from('receipts')
      .update(dataToUpdate)
      .eq('id', receiptId)
      .select(`
        *,
        enseignes(*)
      `)
      .single();
    
    if (error) throw error;
    
    console.log('✅ Ticket mis à jour avec succès');
    return {
      success: true,
      receipt: updatedReceipt
    };
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du ticket:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Met à jour les informations d'achat (ticket + enseigne)
 * @param {string} receiptId - ID du ticket
 * @param {Object} purchaseData - Données d'achat
 * @param {string} purchaseData.purchaseDate - Date d'achat
 * @param {number} purchaseData.purchasePrice - Prix d'achat
 * @param {string} purchaseData.storeName - Nom du magasin
 * @param {string} purchaseData.postalCode - Code postal
 * @param {string} purchaseData.country - Code pays
 * @param {boolean} purchaseData.allowPublicDisplay - Autorisation d'affichage public
 * @returns {Promise<Object>} - Résultat de la mise à jour
 */
export const updateReceiptAndEnseigne = async (receiptId, purchaseData) => {
  try {
    console.log('🔄 Mise à jour complète des informations d\'achat:', receiptId, purchaseData);
    
    // 1. Récupérer le ticket actuel pour obtenir l'enseigne_id
    const { data: currentReceipt, error: fetchError } = await supabase
      .from('receipts')
      .select('*, enseignes(*)')
      .eq('id', receiptId)
      .single();
    
    if (fetchError) throw fetchError;
    
    let enseigneId = currentReceipt.enseigne_id;
    
    // 2. Récupérer les informations du pays pour obtenir la devise
    let currencyCode = 'EUR'; // Devise par défaut
    if (purchaseData.country) {
      const countryResult = await getCountryInfo(purchaseData.country);
      if (countryResult.success && countryResult.country.currency_code) {
        currencyCode = countryResult.country.currency_code;
      }
    }
    
    // 3. Gérer l'enseigne si les informations ont changé
    if (purchaseData.storeName || purchaseData.postalCode || purchaseData.country) {
      const enseigneData = {
        nom: purchaseData.storeName,
        code_postal: purchaseData.postalCode,
        pays: purchaseData.country || 'FR'
      };
      
      // Si l'enseigne actuelle est différente, créer ou trouver la nouvelle
      const currentEnseigne = currentReceipt.enseignes;
      const isDifferentEnseigne = !currentEnseigne || 
        currentEnseigne.nom !== enseigneData.nom ||
        currentEnseigne.code_postal !== enseigneData.code_postal ||
        currentEnseigne.pays !== enseigneData.pays;
      
      if (isDifferentEnseigne) {
        const enseigneResult = await findOrCreateEnseigne(enseigneData);
        if (enseigneResult.success) {
          enseigneId = enseigneResult.enseigne.id;
        }
      }
    }
    
    // 4. Mettre à jour le ticket avec les nouvelles colonnes
    const receiptUpdateData = {
      receipt_date: purchaseData.purchaseDate,
      total_ttc: purchaseData.purchasePrice,
      country_code: purchaseData.country || 'FR',
      currency_code: currencyCode,
      enseigne_id: enseigneId,
      allow_public_display: purchaseData.allowPublicDisplay || false,
      status: 'analyzed' // Marquer comme analysé
    };
    
    const receiptResult = await updateReceipt(receiptId, receiptUpdateData);
    
    if (!receiptResult.success) {
      throw new Error(receiptResult.error);
    }
    
    console.log('✅ Mise à jour complète réussie');
    return {
      success: true,
      data: {
        receipt: receiptResult.receipt,
        currencyCode: currencyCode,
        ...purchaseData
      }
    };
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour complète:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * =====================================================
 * GESTION DES ARTICLES DE TICKET (Fonctions consolidées)
 * =====================================================
 */

/**
 * Récupère les articles d'un ticket de caisse
 * @param {string} receiptId - ID du ticket de caisse
 * @returns {Promise<Object>} - Liste des articles avec informations de succès/erreur
 */
export const getReceiptItems = async (receiptId) => {
  try {
    console.log("🔍 Chargement des articles pour le ticket ID:", receiptId);
    
    if (!receiptId) {
      throw new Error("L'ID du ticket est requis pour charger les articles");
    }

    const { data, error } = await supabase
      .from('receipt_items')
      .select('*')
      .eq('receipt_id', receiptId)
      .order('ordre', { ascending: true });
      
    if (error) throw error;
    
    console.log(`✅ ${data.length} articles chargés avec succès`);
    
    // Ajouter un ID temporaire si besoin pour la gestion dans le composant
    const itemsWithIds = data.map(item => ({
      ...item,
      id: item.id || `db-item-${Math.random().toString(36).substr(2, 9)}`
    }));
    
    return {
      success: true,
      items: itemsWithIds
    };
  } catch (error) {
    console.error("❌ Erreur lors du chargement des articles:", error);
    return {
      success: false,
      error: error.message,
      items: []
    };
  }
};

/**
 * Met à jour un article de ticket dans la base de données
 * @param {string} itemId - ID de l'article à mettre à jour
 * @param {Object} updatedData - Nouvelles données pour l'article
 * @returns {Promise<Object>} - Résultat de la mise à jour
 */
export const updateReceiptItem = async (itemId, updatedData) => {
  try {
    console.log("🔄 Mise à jour de l'article ID:", itemId, "avec données:", updatedData);
    
    if (!itemId) {
      throw new Error("L'ID de l'article est requis pour la mise à jour");
    }

    // Si l'ID commence par "ai-item-" ou "temp-", c'est un ID temporaire 
    if (itemId.startsWith('ai-item-') || itemId.startsWith('temp-')) {
      console.log("⚠️ ID temporaire détecté, insertion d'un nouvel article");
      
      const { data: insertedItem, error: insertError } = await supabase
        .from('receipt_items')
        .insert([{
          receipt_id: updatedData.receipt_id,
          designation: updatedData.designation,
          product_code: updatedData.product_code || null,
          quantite: updatedData.quantite,
          prix_unitaire: updatedData.prix_unitaire,
          prix_total: updatedData.prix_total,
          ordre: updatedData.ordre || 0
        }])
        .select()
        .single();
        
      if (insertError) throw insertError;
      
      return {
        success: true,
        item: insertedItem,
        action: 'inserted'
      };
    }
    
    // Mise à jour de l'article existant
    const { data: updatedItem, error } = await supabase
      .from('receipt_items')
      .update({
        designation: updatedData.designation,
        product_code: updatedData.product_code,
        quantite: updatedData.quantite,
        prix_unitaire: updatedData.prix_unitaire,
        prix_total: updatedData.prix_total
      })
      .eq('id', itemId)
      .select()
      .single();
      
    if (error) throw error;
    
    console.log("✅ Article mis à jour avec succès:", updatedItem);
    
    return {
      success: true,
      item: updatedItem,
      action: 'updated'
    };
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour de l'article:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Supprime un article de ticket dans la base de données
 * @param {string} itemId - ID de l'article à supprimer
 * @returns {Promise<Object>} - Résultat de la suppression
 */
export const deleteReceiptItem = async (itemId) => {
  try {
    console.log("🗑️ Suppression de l'article ID:", itemId);
    
    // Si l'ID commence par "ai-item-" ou "temp-", c'est un ID temporaire 
    if (itemId.startsWith('ai-item-') || itemId.startsWith('temp-')) {
      console.log("⚠️ ID temporaire détecté, aucune suppression nécessaire en base de données");
      return {
        success: true,
        action: 'ignored'
      };
    }
    
    const { error } = await supabase
      .from('receipt_items')
      .delete()
      .eq('id', itemId);
      
    if (error) throw error;
    
    console.log("✅ Article supprimé avec succès");
    
    return {
      success: true,
      action: 'deleted'
    };
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de l'article:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * =====================================================
 * UTILITAIRES POUR LA GESTION DES PAYS ET DEVISES
 * =====================================================
 */

/**
 * Récupère la liste des pays actifs depuis la base de données
 * @returns {Promise<Object>} - Liste des pays avec informations de succès/erreur
 */
export const getActiveCountries = async () => {
  try {
    console.log('🌍 Récupération des pays actifs...');
    
    const { data, error } = await supabase
      .from('countries')
      .select('code, name_fr, name_en, currency_code, continent')
      .eq('is_active', true)
      .order('name_fr');
    
    if (error) throw error;
    
    console.log(`✅ ${data.length} pays chargés avec succès`);
    return {
      success: true,
      countries: data
    };
  } catch (error) {
    console.error('❌ Erreur lors du chargement des pays:', error);
    return {
      success: false,
      error: error.message,
      countries: []
    };
  }
};

/**
 * Récupère les informations d'un pays spécifique
 * @param {string} countryCode - Code pays (ex: 'FR', 'US')
 * @returns {Promise<Object>} - Informations du pays
 */
export const getCountryInfo = async (countryCode) => {
  try {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('code', countryCode)
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      country: data
    };
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du pays:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Récupère les détails complets d'un ticket avec ses items et enseigne
 * @param {string} receiptId - ID du ticket
 * @param {string} userId - ID de l'utilisateur (pour vérification de sécurité)
 * @returns {Promise<Object>} - Détails complets du ticket
 */
export const getReceiptDetails = async (receiptId, userId) => {
  try {
    if (!receiptId || !userId) {
      throw new Error("ID du ticket et ID utilisateur requis");
    }
    
    // Récupérer le ticket avec ses items et enseigne
    const { data: receipt, error } = await supabase
      .from('receipts')
      .select(`
        *,
        enseignes(*),
        receipt_items(*)
      `)
      .eq('id', receiptId)
      .eq('user_id', userId)
      .single();
      
    if (error) throw error;
    
    if (!receipt) {
      throw new Error("Ticket non trouvé");
    }
    
    return {
      success: true,
      receipt: receipt
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du ticket:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Exporte toutes les fonctions consolidées
 */
export default {
  // Gestion des enseignes
  findOrCreateEnseigne,
  updateEnseigne,
  
  // Gestion des tickets
  updateReceipt,
  updateReceiptAndEnseigne,
  getReceiptDetails,
  
  // Gestion des articles
  getReceiptItems,
  updateReceiptItem,
  deleteReceiptItem,
  
  // Utilitaires pays et devises
  getActiveCountries,
  getCountryInfo
};