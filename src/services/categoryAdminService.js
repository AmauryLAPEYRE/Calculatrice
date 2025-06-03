// src/services/categoryAdminService.js
import { supabase } from '../supabaseClient';

/**
 * Services pour l'administration des catégories et critères
 */

// ===== GESTION DES CATÉGORIES =====

/**
 * Récupère toutes les catégories avec leurs critères associés
 * @returns {Promise<object>} Résultat avec les catégories et critères
 */
export const getCategoriesWithCriterias = async () => {
  try {
    // Récupérer les catégories
    const { data: categories, error: categoriesError } = await supabase
      .from('category_masters')
      .select('*')
      .order('created_at', { ascending: true });

    if (categoriesError) throw categoriesError;

    // Récupérer tous les critères
    const { data: criterias, error: criteriasError } = await supabase
      .from('review_criterias')
      .select('*')
      .order('weight', { ascending: false });

    if (criteriasError) throw criteriasError;

    // Associer les critères aux catégories
    const categoriesWithCriterias = categories.map(category => ({
      ...category,
      criterias: criterias.filter(criteria => criteria.category_master === category.code)
    }));

    return {
      success: true,
      data: categoriesWithCriterias,
      statistics: {
        totalCategories: categories.length,
        totalCriterias: criterias.length,
        averageCriteriasPerCategory: categories.length > 0 ? criterias.length / categories.length : 0
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Crée une nouvelle catégorie
 * @param {object} categoryData - Données de la catégorie
 * @returns {Promise<object>} Résultat de l'opération
 */
export const createCategory = async (categoryData) => {
  try {
    // Validation
    if (!categoryData.code || !categoryData.display_name) {
      throw new Error('Le code et le nom d\'affichage sont obligatoires');
    }

    // Vérifier que le code n'existe pas déjà
    const { data: existing, error: checkError } = await supabase
      .from('category_masters')
      .select('code')
      .eq('code', categoryData.code)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      throw checkError;
    }

    if (existing) {
      throw new Error(`Une catégorie avec le code "${categoryData.code}" existe déjà`);
    }

    // Créer la catégorie
    const { data, error } = await supabase
      .from('category_masters')
      .insert([{
        code: categoryData.code.trim(),
        display_name: categoryData.display_name.trim(),
        description: categoryData.description?.trim() || null
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data,
      message: 'Catégorie créée avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Met à jour une catégorie existante
 * @param {string} categoryCode - Code de la catégorie
 * @param {object} updateData - Données à mettre à jour
 * @returns {Promise<object>} Résultat de l'opération
 */
export const updateCategory = async (categoryCode, updateData) => {
  try {
    // Validation
    if (!updateData.display_name) {
      throw new Error('Le nom d\'affichage est obligatoire');
    }

    const { data, error } = await supabase
      .from('category_masters')
      .update({
        display_name: updateData.display_name.trim(),
        description: updateData.description?.trim() || null
      })
      .eq('code', categoryCode)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data,
      message: 'Catégorie mise à jour avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Supprime une catégorie et tous ses critères associés
 * @param {string} categoryCode - Code de la catégorie
 * @returns {Promise<object>} Résultat de l'opération
 */
export const deleteCategory = async (categoryCode) => {
  try {
    // Commencer une transaction en supprimant d'abord les critères
    const { error: criteriasError } = await supabase
      .from('review_criterias')
      .delete()
      .eq('category_master', categoryCode);

    if (criteriasError) throw criteriasError;

    // Puis supprimer la catégorie
    const { error: categoryError } = await supabase
      .from('category_masters')
      .delete()
      .eq('code', categoryCode);

    if (categoryError) throw categoryError;

    return {
      success: true,
      message: 'Catégorie et ses critères supprimés avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ===== GESTION DES CRITÈRES =====

/**
 * Récupère tous les critères pour une catégorie donnée
 * @param {string} categoryCode - Code de la catégorie
 * @returns {Promise<object>} Résultat avec les critères
 */
export const getCriteriasByCategory = async (categoryCode) => {
  try {
    const { data, error } = await supabase
      .from('review_criterias')
      .select('*')
      .eq('category_master', categoryCode)
      .order('weight', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data: data || []
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des critères:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Crée un nouveau critère
 * @param {object} criteriaData - Données du critère
 * @returns {Promise<object>} Résultat de l'opération
 */
export const createCriteria = async (criteriaData) => {
  try {
    // Validation
    if (!criteriaData.name || !criteriaData.display_name || !criteriaData.category_master) {
      throw new Error('Le nom, nom d\'affichage et catégorie sont obligatoires');
    }

    if (criteriaData.weight < 0.1 || criteriaData.weight > 10) {
      throw new Error('Le poids doit être entre 0.1 et 10');
    }

    // Vérifier que le nom n'existe pas déjà pour cette catégorie
    const { data: existing, error: checkError } = await supabase
      .from('review_criterias')
      .select('name')
      .eq('name', criteriaData.name)
      .eq('category_master', criteriaData.category_master)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existing) {
      throw new Error(`Un critère avec le nom "${criteriaData.name}" existe déjà pour cette catégorie`);
    }

    // Créer le critère
    const { data, error } = await supabase
      .from('review_criterias')
      .insert([{
        name: criteriaData.name.trim(),
        display_name: criteriaData.display_name.trim(),
        weight: criteriaData.weight,
        description: criteriaData.description?.trim() || null,
        category_master: criteriaData.category_master
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data,
      message: 'Critère créé avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la création du critère:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Met à jour un critère existant
 * @param {string} criteriaId - ID du critère
 * @param {object} updateData - Données à mettre à jour
 * @returns {Promise<object>} Résultat de l'opération
 */
export const updateCriteria = async (criteriaId, updateData) => {
  try {
    // Validation
    if (!updateData.name || !updateData.display_name) {
      throw new Error('Le nom et nom d\'affichage sont obligatoires');
    }

    if (updateData.weight < 0.1 || updateData.weight > 10) {
      throw new Error('Le poids doit être entre 0.1 et 10');
    }

    const { data, error } = await supabase
      .from('review_criterias')
      .update({
        name: updateData.name.trim(),
        display_name: updateData.display_name.trim(),
        weight: updateData.weight,
        description: updateData.description?.trim() || null,
        category_master: updateData.category_master
      })
      .eq('id', criteriaId)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data,
      message: 'Critère mis à jour avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du critère:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Supprime un critère
 * @param {string} criteriaId - ID du critère
 * @returns {Promise<object>} Résultat de l'opération
 */
export const deleteCriteria = async (criteriaId) => {
  try {
    const { error } = await supabase
      .from('review_criterias')
      .delete()
      .eq('id', criteriaId);

    if (error) throw error;

    return {
      success: true,
      message: 'Critère supprimé avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la suppression du critère:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ===== FONCTIONS UTILITAIRES =====

/**
 * Vérifie si une catégorie existe
 * @param {string} categoryCode - Code de la catégorie
 * @returns {Promise<boolean>} True si la catégorie existe
 */
export const categoryExists = async (categoryCode) => {
  try {
    const { data, error } = await supabase
      .from('category_masters')
      .select('code')
      .eq('code', categoryCode)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Erreur lors de la vérification de la catégorie:', error);
    return false;
  }
};

/**
 * Récupère les statistiques des catégories et critères
 * @returns {Promise<object>} Statistiques
 */
export const getCategoryStatistics = async () => {
  try {
    // Compter les catégories
    const { count: categoriesCount, error: categoriesError } = await supabase
      .from('category_masters')
      .select('*', { count: 'exact', head: true });

    if (categoriesError) throw categoriesError;

    // Compter les critères
    const { count: criteriasCount, error: criteriasError } = await supabase
      .from('review_criterias')
      .select('*', { count: 'exact', head: true });

    if (criteriasError) throw criteriasError;

    // Récupérer les critères par catégorie
    const { data: criteriasByCategory, error: groupError } = await supabase
      .from('review_criterias')
      .select('category_master')
      .not('category_master', 'is', null);

    if (groupError) throw groupError;

    // Calculer la répartition
    const categoryDistribution = {};
    criteriasByCategory.forEach(criteria => {
      const category = criteria.category_master;
      categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
    });

    return {
      success: true,
      data: {
        totalCategories: categoriesCount || 0,
        totalCriterias: criteriasCount || 0,
        averageCriteriasPerCategory: categoriesCount > 0 ? (criteriasCount || 0) / categoriesCount : 0,
        categoryDistribution: categoryDistribution
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return {
      success: false,
      error: error.message,
      data: {
        totalCategories: 0,
        totalCriterias: 0,
        averageCriteriasPerCategory: 0,
        categoryDistribution: {}
      }
    };
  }
};

/**
 * Valide les données d'une catégorie
 * @param {object} categoryData - Données à valider
 * @returns {object} Résultat de la validation
 */
export const validateCategoryData = (categoryData) => {
  const errors = [];

  if (!categoryData.code?.trim()) {
    errors.push('Le code est obligatoire');
  } else if (!/^[a-z0-9_]+$/.test(categoryData.code)) {
    errors.push('Le code ne peut contenir que des lettres minuscules, chiffres et underscores');
  }

  if (!categoryData.display_name?.trim()) {
    errors.push('Le nom d\'affichage est obligatoire');
  }

  if (categoryData.description && categoryData.description.length > 500) {
    errors.push('La description ne peut pas dépasser 500 caractères');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Valide les données d'un critère
 * @param {object} criteriaData - Données à valider
 * @returns {object} Résultat de la validation
 */
export const validateCriteriaData = (criteriaData) => {
  const errors = [];

  if (!criteriaData.name?.trim()) {
    errors.push('Le nom technique est obligatoire');
  } else if (!/^[a-z0-9_]+$/.test(criteriaData.name)) {
    errors.push('Le nom technique ne peut contenir que des lettres minuscules, chiffres et underscores');
  }

  if (!criteriaData.display_name?.trim()) {
    errors.push('Le nom d\'affichage est obligatoire');
  }

  if (!criteriaData.category_master?.trim()) {
    errors.push('La catégorie est obligatoire');
  }

  const weight = parseFloat(criteriaData.weight);
  if (isNaN(weight) || weight < 0.1 || weight > 10) {
    errors.push('Le poids doit être un nombre entre 0.1 et 10');
  }

  if (criteriaData.description && criteriaData.description.length > 500) {
    errors.push('La description ne peut pas dépasser 500 caractères');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// Export par défaut avec toutes les fonctions
export default {
  // Catégories
  getCategoriesWithCriterias,
  createCategory,
  updateCategory,
  deleteCategory,
  
  // Critères
  getCriteriasByCategory,
  createCriteria,
  updateCriteria,
  deleteCriteria,
  
  // Utilitaires
  categoryExists,
  getCategoryStatistics,
  validateCategoryData,
  validateCriteriaData
};