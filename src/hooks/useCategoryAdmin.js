// src/hooks/useCategoryAdmin.js
import { useState, useEffect, useCallback } from 'react';
import {
  getCategoriesWithCriterias,
  createCategory,
  updateCategory,
  deleteCategory,
  createCriteria,
  updateCriteria,
  deleteCriteria,
  validateCategoryData,
  validateCriteriaData
} from '../services/categoryAdminService';

/**
 * Hook personnalisé pour gérer l'administration des catégories et critères
 */
export const useCategoryAdmin = () => {
  // États principaux
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // États pour les modals
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCriteria, setEditingCriteria] = useState(null);
  const [selectedCategoryForCriteria, setSelectedCategoryForCriteria] = useState(null);
  
  // États pour les formulaires
  const [categoryForm, setCategoryForm] = useState({
    code: '',
    display_name: '',
    description: ''
  });
  
  const [criteriaForm, setCriteriaForm] = useState({
    name: '',
    display_name: '',
    weight: 1.0,
    description: '',
    category_master: ''
  });
  
  // État pour l'expansion des catégories
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  
  // Statistiques
  const [statistics, setStatistics] = useState({
    totalCategories: 0,
    totalCriterias: 0,
    averageCriteriasPerCategory: 0
  });

  // Fonction de chargement des données
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getCategoriesWithCriterias();
      
      if (result.success) {
        setCategories(result.data);
        setStatistics(result.statistics || {
          totalCategories: 0,
          totalCriterias: 0,
          averageCriteriasPerCategory: 0
        });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(`Erreur lors du chargement: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fonctions utilitaires
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const showSuccessMessage = useCallback((message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 5000);
  }, []);

  const showErrorMessage = useCallback((message) => {
    setError(message);
    setTimeout(() => setError(null), 8000);
  }, []);

  // Fonctions de gestion des catégories
  const handleCreateCategory = useCallback(() => {
    setCategoryForm({ code: '', display_name: '', description: '' });
    setEditingCategory(null);
    setShowCategoryModal(true);
    clearMessages();
  }, [clearMessages]);

  const handleEditCategory = useCallback((category) => {
    setCategoryForm({
      code: category.code,
      display_name: category.display_name,
      description: category.description || ''
    });
    setEditingCategory(category);
    setShowCategoryModal(true);
    clearMessages();
  }, [clearMessages]);

  const handleSaveCategory = useCallback(async () => {
    setSaving(true);
    setError(null);
    
    try {
      // Validation côté client
      const validation = validateCategoryData(categoryForm);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return;
      }

      let result;
      if (editingCategory) {
        result = await updateCategory(editingCategory.code, categoryForm);
      } else {
        result = await createCategory(categoryForm);
      }

      if (result.success) {
        showSuccessMessage(result.message);
        setShowCategoryModal(false);
        await fetchData();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(`Erreur lors de la sauvegarde: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }, [categoryForm, editingCategory, fetchData, showSuccessMessage]);

  const handleDeleteCategory = useCallback(async (category) => {
    if (!window.confirm(
      `Êtes-vous sûr de vouloir supprimer la catégorie "${category.display_name}" et tous ses critères ?\n\nCette action est irréversible.`
    )) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const result = await deleteCategory(category.code);
      
      if (result.success) {
        showSuccessMessage(result.message);
        await fetchData();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(`Erreur lors de la suppression: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }, [fetchData, showSuccessMessage]);

  // Fonctions de gestion des critères
  const handleCreateCriteria = useCallback((category) => {
    setCriteriaForm({
      name: '',
      display_name: '',
      weight: 1.0,
      description: '',
      category_master: category.code
    });
    setSelectedCategoryForCriteria(category);
    setEditingCriteria(null);
    setShowCriteriaModal(true);
    clearMessages();
  }, [clearMessages]);

  const handleEditCriteria = useCallback((criteria, category) => {
    setCriteriaForm({
      name: criteria.name,
      display_name: criteria.display_name,
      weight: criteria.weight,
      description: criteria.description || '',
      category_master: criteria.category_master
    });
    setSelectedCategoryForCriteria(category);
    setEditingCriteria(criteria);
    setShowCriteriaModal(true);
    clearMessages();
  }, [clearMessages]);

  const handleSaveCriteria = useCallback(async () => {
    setSaving(true);
    setError(null);
    
    try {
      // Validation côté client
      const validation = validateCriteriaData(criteriaForm);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return;
      }

      let result;
      if (editingCriteria) {
        result = await updateCriteria(editingCriteria.id, criteriaForm);
      } else {
        result = await createCriteria(criteriaForm);
      }

      if (result.success) {
        showSuccessMessage(result.message);
        setShowCriteriaModal(false);
        await fetchData();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(`Erreur lors de la sauvegarde: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }, [criteriaForm, editingCriteria, fetchData, showSuccessMessage]);

  const handleDeleteCriteria = useCallback(async (criteria) => {
    if (!window.confirm(
      `Êtes-vous sûr de vouloir supprimer le critère "${criteria.display_name}" ?\n\nCette action est irréversible.`
    )) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const result = await deleteCriteria(criteria.id);
      
      if (result.success) {
        showSuccessMessage(result.message);
        await fetchData();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(`Erreur lors de la suppression: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }, [fetchData, showSuccessMessage]);

  // Fonctions de gestion de l'interface
  const toggleCategoryExpansion = useCallback((categoryCode) => {
    setExpandedCategories(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(categoryCode)) {
        newExpanded.delete(categoryCode);
      } else {
        newExpanded.add(categoryCode);
      }
      return newExpanded;
    });
  }, []);

  const closeCategoryModal = useCallback(() => {
    setShowCategoryModal(false);
    setEditingCategory(null);
    setCategoryForm({ code: '', display_name: '', description: '' });
  }, []);

  const closeCriteriaModal = useCallback(() => {
    setShowCriteriaModal(false);
    setEditingCriteria(null);
    setSelectedCategoryForCriteria(null);
    setCriteriaForm({
      name: '',
      display_name: '',
      weight: 1.0,
      description: '',
      category_master: ''
    });
  }, []);

  // Fonction de rafraîchissement
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    // États
    categories,
    loading,
    saving,
    error,
    success,
    statistics,
    
    // États des modals
    showCategoryModal,
    showCriteriaModal,
    editingCategory,
    editingCriteria,
    selectedCategoryForCriteria,
    
    // Formulaires
    categoryForm,
    setCategoryForm,
    criteriaForm,
    setCriteriaForm,
    
    // Interface
    expandedCategories,
    
    // Actions pour les catégories
    handleCreateCategory,
    handleEditCategory,
    handleSaveCategory,
    handleDeleteCategory,
    
    // Actions pour les critères
    handleCreateCriteria,
    handleEditCriteria,
    handleSaveCriteria,
    handleDeleteCriteria,
    
    // Actions interface
    toggleCategoryExpansion,
    closeCategoryModal,
    closeCriteriaModal,
    clearMessages,
    refresh,
    
    // Utilitaires
    isEditing: !!editingCategory || !!editingCriteria,
    canSave: !saving && (
      (showCategoryModal && categoryForm.code && categoryForm.display_name) ||
      (showCriteriaModal && criteriaForm.name && criteriaForm.display_name)
    )
  };
};

export default useCategoryAdmin;

// ======================================================
// src/components/admin/CategoryManagement.js - Version refactorisée
// ======================================================

import React from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Tag,
  Star,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Loader,
  Settings
} from 'lucide-react';
import { useCategoryAdmin } from '../../hooks/useCategoryAdmin';

const CategoryManagement = () => {
  const {
    // États
    categories,
    loading,
    saving,
    error,
    success,
    statistics,
    
    // États des modals
    showCategoryModal,
    showCriteriaModal,
    editingCategory,
    selectedCategoryForCriteria,
    
    // Formulaires
    categoryForm,
    setCategoryForm,
    criteriaForm,
    setCriteriaForm,
    
    // Interface
    expandedCategories,
    
    // Actions
    handleCreateCategory,
    handleEditCategory,
    handleSaveCategory,
    handleDeleteCategory,
    handleCreateCriteria,
    handleEditCriteria,
    handleSaveCriteria,
    handleDeleteCriteria,
    toggleCategoryExpansion,
    closeCategoryModal,
    closeCriteriaModal,
    clearMessages,
    
    // Utilitaires
    canSave
  } = useCategoryAdmin();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <Loader size={24} className="animate-spin text-blue-600" />
          <span className="text-gray-600">Chargement des catégories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Catégories</h1>
          <p className="text-gray-600 mt-1">
            Gérez les catégories de produits et leurs critères d'évaluation
          </p>
        </div>
        <button
          onClick={handleCreateCategory}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Nouvelle Catégorie</span>
        </button>
      </div>

      {/* Messages de notification */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-800">{error}</p>
          </div>
          <button onClick={clearMessages} className="text-red-500 hover:text-red-700">
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
          <CheckCircle size={20} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-green-800">{success}</p>
          </div>
          <button onClick={clearMessages} className="text-green-500 hover:text-green-700">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Tag size={24} className="text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Catégories</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalCategories}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Star size={24} className="text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Critères</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalCriterias}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Settings size={24} className="text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Critères par Catégorie</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(statistics.averageCriteriasPerCategory * 10) / 10}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des catégories */}
      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Tag size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune catégorie</h3>
            <p className="text-gray-600 mb-4">Commencez par créer votre première catégorie de produits</p>
            <button
              onClick={handleCreateCategory}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Créer une Catégorie</span>
            </button>
          </div>
        ) : (
          categories.map((category) => (
            <CategoryCard
              key={category.code}
              category={category}
              isExpanded={expandedCategories.has(category.code)}
              saving={saving}
              onToggleExpansion={() => toggleCategoryExpansion(category.code)}
              onEdit={() => handleEditCategory(category)}
              onDelete={() => handleDeleteCategory(category)}
              onCreateCriteria={() => handleCreateCriteria(category)}
              onEditCriteria={(criteria) => handleEditCriteria(criteria, category)}
              onDeleteCriteria={handleDeleteCriteria}
            />
          ))
        )}
      </div>

      {/* Modal de catégorie */}
      {showCategoryModal && (
        <CategoryModal
          isEditing={!!editingCategory}
          categoryForm={categoryForm}
          setCategoryForm={setCategoryForm}
          saving={saving}
          canSave={canSave}
          onSave={handleSaveCategory}
          onCancel={closeCategoryModal}
        />
      )}

      {/* Modal de critère */}
      {showCriteriaModal && (
        <CriteriaModal
          isEditing={!!editingCategory}
          criteriaForm={criteriaForm}
          setCriteriaForm={setCriteriaForm}
          categoryName={selectedCategoryForCriteria?.display_name}
          saving={saving}
          canSave={canSave}
          onSave={handleSaveCriteria}
          onCancel={closeCriteriaModal}
        />
      )}
    </div>
  );
};

// Les composants CategoryCard, CriteriaCard, CategoryModal, CriteriaModal restent identiques
// mais avec les nouvelles props (saving, canSave, etc.)

export default CategoryManagement;