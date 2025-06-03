// src/components/admin/CategoryManagement.js - Version complète avec ProfileLayout et navigation
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Settings,
  Users,
  MessageSquare,
  Trophy,
  Package,
  BarChart3
} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import ProfileLayout from '../profile/ProfileLayout';

const CategoryManagement = () => {
  const location = useLocation();

  // Fonction pour déterminer l'onglet actif
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/admin') return 'users';
    if (path === '/admin/pending-reviews') return 'reviews';
    if (path === '/admin/challenges') return 'challenges';
    if (path === '/admin/categories') return 'categories';
    return 'categories';
  };

  // États principaux
  const [categories, setCategories] = useState([]);
  const [uncategorizedCount, setUncategorizedCount] = useState(0); // Produits non catégorisés
  const [loading, setLoading] = useState(true);
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
  
  // État pour l'expansion des catégories et le tri
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [sortBy, setSortBy] = useState('date'); // 'date', 'name', 'products', 'criterias'

  // Chargement initial
  useEffect(() => {
    fetchCategoriesWithCriterias();
  }, []);

  // Fonctions de récupération des données
  const fetchCategoriesWithCriterias = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Récupérer les catégories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('category_masters')
        .select('*')
        .order('display_name', { ascending: true });

      if (categoriesError) throw categoriesError;

      // Récupérer tous les critères
      const { data: criteriasData, error: criteriasError } = await supabase
        .from('review_criterias')
        .select('*')
        .order('weight', { ascending: false });

      if (criteriasError) throw criteriasError;

      // Compter les produits non catégorisés (category_master vide ou null)
      const { count: uncategorizedProductsCount, error: uncategorizedError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .or('category_master.is.null,category_master.eq.');

      if (uncategorizedError) {
        console.warn('Erreur lors du comptage des produits non catégorisés:', uncategorizedError);
        setUncategorizedCount(0);
      } else {
        setUncategorizedCount(uncategorizedProductsCount || 0);
      }

      // Récupérer le nombre de produits par catégorie (exclure les produits non catégorisés)
      const productCountsPromises = categoriesData.map(async (category) => {
        const { count, error } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .ilike('category_master', category.code);

        if (error) {
          console.warn(`Erreur lors du comptage des produits pour la catégorie ${category.code}:`, error);
          return { categoryCode: category.code, count: 0 };
        }

        return { categoryCode: category.code, count: count || 0 };
      });

      const productCounts = await Promise.all(productCountsPromises);
      const productCountMap = productCounts.reduce((acc, item) => {
        acc[item.categoryCode] = item.count;
        return acc;
      }, {});

      // Associer les critères et le nombre de produits aux catégories
      const categoriesWithCriterias = categoriesData.map(category => ({
        ...category,
        criterias: criteriasData.filter(criteria => criteria.category_master === category.code),
        productCount: productCountMap[category.code] || 0
      }));

      setCategories(categoriesWithCriterias);
    } catch (err) {
      setError(`Erreur lors du chargement: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fonctions de gestion des catégories
  const handleCreateCategory = () => {
    setCategoryForm({ code: '', display_name: '', description: '' });
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setCategoryForm({
      code: category.code,
      display_name: category.display_name,
      description: category.description || ''
    });
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async () => {
    setError(null);
    
    // Validation
    if (!categoryForm.code.trim() || !categoryForm.display_name.trim()) {
      setError('Le code et le nom d\'affichage sont obligatoires');
      return;
    }

    try {
      if (editingCategory) {
        // Mise à jour
        const { error } = await supabase
          .from('category_masters')
          .update({
            display_name: categoryForm.display_name,
            description: categoryForm.description
          })
          .eq('code', editingCategory.code);

        if (error) throw error;
        setSuccess('Catégorie mise à jour avec succès');
      } else {
        // Création
        const { error } = await supabase
          .from('category_masters')
          .insert([{
            code: categoryForm.code,
            display_name: categoryForm.display_name,
            description: categoryForm.description
          }]);

        if (error) throw error;
        setSuccess('Catégorie créée avec succès');
      }

      setShowCategoryModal(false);
      fetchCategoriesWithCriterias();
    } catch (err) {
      setError(`Erreur lors de la sauvegarde: ${err.message}`);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.display_name}" et tous ses critères ?`)) {
      return;
    }

    try {
      // Supprimer d'abord tous les critères associés
      const { error: criteriasError } = await supabase
        .from('review_criterias')
        .delete()
        .ilike('category_master', category.code);

      if (criteriasError) throw criteriasError;

      // Puis supprimer la catégorie
      const { error: categoryError } = await supabase
        .from('category_masters')
        .delete()
        .eq('code', category.code);

      if (categoryError) throw categoryError;

      setSuccess('Catégorie supprimée avec succès');
      fetchCategoriesWithCriterias();
    } catch (err) {
      setError(`Erreur lors de la suppression: ${err.message}`);
    }
  };

  // Fonctions de gestion des critères
  const handleCreateCriteria = (category) => {
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
  };

  const handleEditCriteria = (criteria, category) => {
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
  };

  const handleSaveCriteria = async () => {
    setError(null);
    
    // Validation
    if (!criteriaForm.name.trim() || !criteriaForm.display_name.trim()) {
      setError('Le nom et le nom d\'affichage sont obligatoires');
      return;
    }

    if (criteriaForm.weight < 0.1 || criteriaForm.weight > 10) {
      setError('Le poids doit être entre 0.1 et 10');
      return;
    }

    try {
      if (editingCriteria) {
        // Mise à jour
        const { error } = await supabase
          .from('review_criterias')
          .update({
            name: criteriaForm.name,
            display_name: criteriaForm.display_name,
            weight: criteriaForm.weight,
            description: criteriaForm.description,
            category_master: criteriaForm.category_master
          })
          .eq('id', editingCriteria.id);

        if (error) throw error;
        setSuccess('Critère mis à jour avec succès');
      } else {
        // Création
        const { error } = await supabase
          .from('review_criterias')
          .insert([{
            name: criteriaForm.name,
            display_name: criteriaForm.display_name,
            weight: criteriaForm.weight,
            description: criteriaForm.description,
            category_master: criteriaForm.category_master
          }]);

        if (error) throw error;
        setSuccess('Critère créé avec succès');
      }

      setShowCriteriaModal(false);
      fetchCategoriesWithCriterias();
    } catch (err) {
      setError(`Erreur lors de la sauvegarde: ${err.message}`);
    }
  };

  const handleDeleteCriteria = async (criteria) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le critère "${criteria.display_name}" ?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('review_criterias')
        .delete()
        .eq('id', criteria.id);

      if (error) throw error;

      setSuccess('Critère supprimé avec succès');
      fetchCategoriesWithCriterias();
    } catch (err) {
      setError(`Erreur lors de la suppression: ${err.message}`);
    }
  };

  // Fonctions utilitaires
  const toggleCategoryExpansion = (categoryCode) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryCode)) {
      newExpanded.delete(categoryCode);
    } else {
      newExpanded.add(categoryCode);
    }
    setExpandedCategories(newExpanded);
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Fonction pour trier les catégories
  const getSortedCategories = () => {
    const sorted = [...categories];
    
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.display_name.localeCompare(b.display_name));
      case 'products':
        return sorted.sort((a, b) => (b.productCount || 0) - (a.productCount || 0));
      case 'criterias':
        return sorted.sort((a, b) => b.criterias.length - a.criterias.length);
      case 'date':
      default:
        return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
  };

  if (loading) {
    return (
      <ProfileLayout title="Gestion des Catégories">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-3">
            <Loader size={24} className="animate-spin text-blue-600" />
            <span className="text-gray-600">Chargement des catégories...</span>
          </div>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout title="Gestion des Catégories">
      {/* Navigation entre les pages d'administration */}
      <div className="flex items-center space-x-4 mb-6 border-b border-gray-200 overflow-x-auto">
        <Link 
          to="/admin" 
          className={`px-4 py-2 whitespace-nowrap ${
            getActiveTab() === 'users'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          <Users className="inline-block mr-2" size={18} />
          Utilisateurs
        </Link>
        
        <Link 
          to="/admin/pending-reviews" 
          className={`px-4 py-2 whitespace-nowrap flex items-center ${
            getActiveTab() === 'reviews'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          <MessageSquare className="inline-block mr-2" size={18} />
          Avis à valider
        </Link>
        
        <Link 
          to="/admin/challenges" 
          className={`px-4 py-2 whitespace-nowrap flex items-center ${
            getActiveTab() === 'challenges'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          <Trophy className="inline-block mr-2" size={18} />
          Challenges
        </Link>
        
        <div className={`px-4 py-2 whitespace-nowrap ${
          getActiveTab() === 'categories'
            ? 'text-green-600 border-b-2 border-green-600'
            : 'text-gray-600 hover:text-green-600'
        }`}>
          <Tag className="inline-block mr-2" size={18} />
          Catégories
        </div>
      </div>

      <div className="space-y-6">
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <Tag size={24} className="text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Catégories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <Star size={24} className="text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Critères</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.reduce((total, cat) => total + cat.criterias.length, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <Package size={24} className="text-indigo-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Produits Catégorisés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.reduce((total, cat) => total + (cat.productCount || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <AlertCircle size={24} className="text-orange-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Non Catégorisés</p>
                <p className="text-2xl font-bold text-gray-900">{uncategorizedCount}</p>
                <p className="text-xs text-orange-600">Produits par défaut</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <BarChart3 size={24} className="text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Produits</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.reduce((total, cat) => total + (cat.productCount || 0), 0) + uncategorizedCount}
                </p>
                <p className="text-xs text-gray-500">
                  {categories.length > 0 ? 
                    Math.round((categories.reduce((total, cat) => total + (cat.productCount || 0), 0) + uncategorizedCount) / (categories.length + 1))
                    : uncategorizedCount} par catégorie
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contrôles de tri et filtres */}
        {(categories.length > 0 || uncategorizedCount > 0) && (
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Trier par :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date de création</option>
                <option value="name">Nom alphabétique</option>
                <option value="products">Nombre de produits</option>
                <option value="criterias">Nombre de critères</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {categories.length} catégorie{categories.length > 1 ? 's' : ''} • {' '}
              {categories.reduce((total, cat) => total + (cat.productCount || 0), 0)} produit{categories.reduce((total, cat) => total + (cat.productCount || 0), 0) > 1 ? 's' : ''} catégorisé{categories.reduce((total, cat) => total + (cat.productCount || 0), 0) > 1 ? 's' : ''}
              {uncategorizedCount > 0 && (
                <span className="text-orange-600">
                  {' '} + {uncategorizedCount} non catégorisé{uncategorizedCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Liste des catégories */}
        <div className="space-y-4">
          {categories.length === 0 && uncategorizedCount === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Tag size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune catégorie</h3>
              <p className="text-gray-600 mb-4">
                Commencez par créer votre première catégorie de produits pour organiser et évaluer vos articles
              </p>
              <button
                onClick={handleCreateCategory}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Créer une Catégorie</span>
              </button>
            </div>
          ) : (
            <>
              {/* Produits non catégorisés (s'affichent en premier) */}
              {uncategorizedCount > 0 && (
                <UncategorizedProductsCard 
                  count={uncategorizedCount}
                  onCreateCategory={handleCreateCategory}
                />
              )}
              
              {/* Catégories définies */}
              {getSortedCategories().map((category) => (
                <CategoryCard
                  key={category.code}
                  category={category}
                  isExpanded={expandedCategories.has(category.code)}
                  onToggleExpansion={() => toggleCategoryExpansion(category.code)}
                  onEdit={() => handleEditCategory(category)}
                  onDelete={() => handleDeleteCategory(category)}
                  onCreateCriteria={() => handleCreateCriteria(category)}
                  onEditCriteria={(criteria) => handleEditCriteria(criteria, category)}
                  onDeleteCriteria={handleDeleteCriteria}
                />
              ))}
              
              {/* Message pour encourager la création de catégories si seulement des produits non catégorisés */}
              {categories.length === 0 && uncategorizedCount > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <Tag size={32} className="text-blue-500 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-blue-900 mb-2">
                    Organisez vos {uncategorizedCount} produits
                  </h3>
                  <p className="text-blue-700 mb-4">
                    Créez des catégories pour mieux organiser vos produits et permettre une évaluation plus précise
                  </p>
                  <button
                    onClick={handleCreateCategory}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2"
                  >
                    <Plus size={20} />
                    <span>Créer une Catégorie</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal de catégorie */}
        {showCategoryModal && (
          <CategoryModal
            isEditing={!!editingCategory}
            categoryForm={categoryForm}
            setCategoryForm={setCategoryForm}
            onSave={handleSaveCategory}
            onCancel={() => setShowCategoryModal(false)}
          />
        )}

        {/* Modal de critère */}
        {showCriteriaModal && (
          <CriteriaModal
            isEditing={!!editingCriteria}
            criteriaForm={criteriaForm}
            setCriteriaForm={setCriteriaForm}
            categoryName={selectedCategoryForCriteria?.display_name}
            onSave={handleSaveCriteria}
            onCancel={() => setShowCriteriaModal(false)}
          />
        )}
      </div>
    </ProfileLayout>
  );
};

// Composant pour afficher les produits non catégorisés
const UncategorizedProductsCard = ({ count, onCreateCategory }) => {
  return (
    <div className="bg-orange-50 rounded-lg border-2 border-dashed border-orange-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <AlertCircle size={20} className="text-orange-600" />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-orange-900">Produits non catégorisés</h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    <Package size={14} className="mr-1" />
                    {count} produit{count > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-sm text-orange-700">Code de catégorie : "" (vide - valeur par défaut)</p>
              </div>
            </div>
            <p className="text-orange-700 mt-2">
              Ces produits utilisent la catégorie par défaut et n'ont pas de critères d'évaluation spécifiques. 
              Créez des catégories pour mieux les organiser.
            </p>
            <div className="flex items-center space-x-4 mt-3">
              <span className="text-sm text-orange-600 flex items-center">
                <X size={14} className="mr-1" />
                Aucun critère d'évaluation
              </span>
              <span className="text-sm text-orange-400">•</span>
              <span className="text-sm text-orange-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                Nécessite une catégorisation
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onCreateCategory}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center space-x-2 text-sm"
              title="Créer une catégorie pour organiser ces produits"
            >
              <Plus size={16} />
              <span>Catégoriser</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour une carte de catégorie
const CategoryCard = ({
  category,
  isExpanded,
  onToggleExpansion,
  onEdit,
  onDelete,
  onCreateCriteria,
  onEditCriteria,
  onDeleteCriteria
}) => {
  // Déterminer le badge de popularité basé sur le nombre de produits
  const getPopularityBadge = () => {
    const productCount = category.productCount || 0;
    if (productCount >= 100) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Package size={12} className="mr-1" />
          Très populaire
        </span>
      );
    } else if (productCount >= 50) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Package size={12} className="mr-1" />
          Populaire
        </span>
      );
    } else if (productCount >= 10) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Package size={12} className="mr-1" />
          Modérée
        </span>
      );
    } else if (productCount > 0) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <Package size={12} className="mr-1" />
          Peu utilisée
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <X size={12} className="mr-1" />
          Aucun produit
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* En-tête de la catégorie */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Tag size={20} className="text-blue-600" />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">{category.display_name}</h3>
                  {getPopularityBadge()}
                </div>
                <p className="text-sm text-gray-500">Code: {category.code}</p>
              </div>
            </div>
            {category.description && (
              <p className="text-gray-600 mt-2">{category.description}</p>
            )}
            <div className="flex items-center space-x-4 mt-3">
  {category.criterias.length === 0 ? (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
      Aucun critère -> prend "par defaut"
    </span>
  ) : (
    <span className="text-sm text-gray-500 flex bg-green-100 items-center">
      <Star size={14} className="mr-1 text-green-500" />
      {category.criterias.length} critère{category.criterias.length > 1 ? 's' : ''}
    </span>
  )}
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-500 flex items-center">
                <Package size={14} className="mr-1 text-indigo-500" />
                {category.productCount || 0} produit{(category.productCount || 0) > 1 ? 's' : ''}
              </span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-500">
                Créé le {new Date(category.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleExpansion}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title="Voir les critères"
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
              title="Modifier"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50"
              title="Supprimer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Section des critères (repliable) */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">Critères d'évaluation</h4>
              <button
                onClick={onCreateCriteria}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm flex items-center space-x-1"
              >
                <Plus size={16} />
                <span>Ajouter</span>
              </button>
            </div>
            
            {category.criterias.length === 0 ? (
              <div className="text-center py-8">
                <Star size={32} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Aucun critère défini</p>
                <button
                  onClick={onCreateCriteria}
                  className="text-green-600 hover:text-green-800 text-sm mt-2"
                >
                  Créer le premier critère
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.criterias.map((criteria) => (
                  <CriteriaCard
                    key={criteria.id}
                    criteria={criteria}
                    onEdit={() => onEditCriteria(criteria)}
                    onDelete={() => onDeleteCriteria(criteria)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Composant pour une carte de critère
const CriteriaCard = ({ criteria, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h5 className="font-medium text-gray-900">{criteria.display_name}</h5>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">
              ×{criteria.weight}
            </span>
          </div>
          <p className="text-sm text-gray-500">Nom: {criteria.name}</p>
          {criteria.description && (
            <p className="text-sm text-gray-600 mt-1">{criteria.description}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={onEdit}
            className="p-1.5 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50"
            title="Modifier"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
            title="Supprimer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal pour créer/modifier une catégorie
const CategoryModal = ({ isEditing, categoryForm, setCategoryForm, onSave, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isEditing ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={categoryForm.code}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, code: e.target.value }))}
                disabled={isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="ex: sweets, beverages"
              />
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1">Le code ne peut pas être modifié</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom d'affichage <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={categoryForm.display_name}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, display_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ex: Produits sucrés, Boissons"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={categoryForm.description}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Description de la catégorie..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save size={16} />
              <span>{isEditing ? 'Mettre à jour' : 'Créer'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal pour créer/modifier un critère
const CriteriaModal = ({ isEditing, criteriaForm, setCriteriaForm, categoryName, onSave, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isEditing ? 'Modifier le Critère' : 'Nouveau Critère'}
            {categoryName && (
              <span className="text-sm font-normal text-gray-600 block">
                pour {categoryName}
              </span>
            )}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom technique <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={criteriaForm.name}
                onChange={(e) => setCriteriaForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="ex: taste, texture, price"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom d'affichage <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={criteriaForm.display_name}
                onChange={(e) => setCriteriaForm(prev => ({ ...prev, display_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="ex: Goût et saveur, Texture"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Poids (coefficient) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="10"
                value={criteriaForm.weight}
                onChange={(e) => setCriteriaForm(prev => ({ ...prev, weight: parseFloat(e.target.value) || 1.0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Plus le poids est élevé, plus le critère influence la note finale
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={criteriaForm.description}
                onChange={(e) => setCriteriaForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Description du critère d'évaluation..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Save size={16} />
              <span>{isEditing ? 'Mettre à jour' : 'Créer'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;