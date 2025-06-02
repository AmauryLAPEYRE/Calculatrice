// src/components/ReceiptItemSelector.js
import React, { useState, useEffect } from 'react';
import { Edit, Check, X, Trash, ShoppingCart, Plus, Star } from 'lucide-react';
import { calculateMatchScore } from '../utils/textSimilarityUtils';
import { deleteReceiptItem } from '../services/receiptAnalysisService';
import { supabase } from '../supabaseClient';
import { 
  getReceiptItems, 
  updateReceiptItem, 
  getActiveCountries,
  updateReceiptAndEnseigne 
} from '../services/unifiedReceiptService';

/**
 * Composant permettant d'afficher et de sélectionner les articles du ticket de caisse
 * avec possibilité d'édition des informations détectées
 * @param {Array} items - Liste des articles du ticket
 * @param {Function} onChange - Fonction appelée lorsque les articles sont modifiés
 * @param {Object} selectedItem - Article actuellement sélectionné
 * @param {Function} onSelect - Fonction appelée lorsqu'un article est sélectionné
 * @param {string} productName - Nom du produit pour calculer le taux de correspondance
 */
const ReceiptItemSelector = ({ items = [], onChange, selectedItem, onSelect, productName }) => {
  // État local pour gérer l'article en cours d'édition
  const [editingItemId, setEditingItemId] = useState(null);
  // État local pour stocker les valeurs modifiées pendant l'édition
  const [editValues, setEditValues] = useState({});
  // État local pour gérer les articles
  const [receiptItems, setReceiptItems] = useState([]);
  // Nouvel état pour désactiver temporairement la sélection
  const [selectionDisabled, setSelectionDisabled] = useState(false);
  // Nouvel état pour suivre les articles déjà liés à des avis
  const [linkedItems, setLinkedItems] = useState({});

  // Mettre à jour les articles quand ils changent via les props
  useEffect(() => {
    console.log("📥 Mise à jour des articles dans ReceiptItemSelector:", items.length);
    
    // Ajouter les scores de correspondance à chaque article si un nom de produit est fourni
    if (productName) {
      const itemsWithScores = items.map(item => ({
        ...item,
        matchScore: item.matchScore || calculateMatchScore(item.designation || '', productName)
      }));
      
      // Trier par score de correspondance décroissant
      itemsWithScores.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      setReceiptItems(itemsWithScores);
    } else {
      setReceiptItems(items);
    }

    // Vérifier si des articles sont déjà liés à des avis
    if (items.length > 0 && items[0].receipt_id) {
      fetchLinkedItems(items[0].receipt_id);
    }
  }, [items, productName]);

  // Fonction pour récupérer les articles déjà liés à des avis
  const fetchLinkedItems = async (receiptId) => {
    try {
      // Récupérer les avis qui référencent ce ticket
      const { data: reviews, error } = await supabase
        .from('product_reviews')
        .select('receipt_item_id')
        .eq('receipt_id', receiptId);
      
      if (error) throw error;
      
      // Créer un objet indexé par ID d'article
      const linkedItemsMap = {};
      reviews.forEach(review => {
        if (review.receipt_item_id && (review.status === 'approved' || review.status === 'approved_auto')) {
          linkedItemsMap[review.receipt_item_id] = true;
        }
      });
      
      setLinkedItems(linkedItemsMap);
      console.log("🔗 Articles liés récupérés:", linkedItemsMap);
    } catch (err) {
      console.error("❌ Erreur lors de la récupération des articles liés:", err);
    }
  };

  // Sélection automatique du meilleur article
  useEffect(() => {
    // Ne faire la sélection automatique que si:
    // 1. Il y a des articles
    // 2. Un nom de produit est fourni (pour calculer les scores)
    // 3. Aucun article n'est déjà sélectionné
    // 4. Aucune édition n'est en cours
    if (receiptItems.length > 0 && productName && !selectedItem && !editingItemId) {
      console.log("🔍 Recherche de l'article avec la meilleure correspondance...");
      
      // Les articles sont déjà triés par score dans l'useEffect précédent
      // Donc le premier article a le meilleur score
      const bestMatch = receiptItems[0];
      
      // Vérifier si le score est suffisant (par exemple > 0.2 soit 20%)
      if (bestMatch && bestMatch.matchScore > 0.2) {
        console.log(`✅ Sélection automatique: ${bestMatch.designation} (${Math.round(bestMatch.matchScore * 100)}%)`);
        // Sélectionner cet article
        if (onSelect) {
          onSelect(bestMatch);
        }
      } else {
        console.log("⚠️ Aucun article n'a un score suffisant pour la sélection automatique");
      }
    } 
  }, [receiptItems, productName, selectedItem, onSelect, editingItemId]);

  // Démarrer l'édition d'un article
  const startEditing = (item) => {
    // Désactiver la sélection pendant l'édition
    setSelectionDisabled(true);
    setEditingItemId(item.id);
    setEditValues({
      designation: item.designation,
      quantite: item.quantite,
      prix_unitaire: item.prix_unitaire,
      prix_total: item.prix_total,
      receipt_id: item.receipt_id // Important pour les nouvelles insertions
    });
  };

  // Annuler l'édition
  const cancelEditing = () => {
    setEditingItemId(null);
    setEditValues({});
    // Réactiver la sélection après l'édition
    setTimeout(() => setSelectionDisabled(false), 100);
  };

  // Sauvegarder les modifications
  const saveEditing = async (itemId) => {
    const updatedItems = receiptItems.map(item => {
      if (item.id === itemId) {
        // Calculer automatiquement le prix total si nécessaire
        const quantite = parseFloat(editValues.quantite) || item.quantite;
        const prixUnitaire = parseFloat(editValues.prix_unitaire) || item.prix_unitaire;
        const prixTotal = parseFloat(editValues.prix_total) || (quantite * prixUnitaire);
        
        const updatedItem = {
          ...item,
          designation: editValues.designation || item.designation,
          quantite: quantite,
          prix_unitaire: prixUnitaire,
          prix_total: prixTotal
        };
        
        // Mettre à jour le score de correspondance si productName est disponible
        if (productName) {
          updatedItem.matchScore = calculateMatchScore(updatedItem.designation, productName);
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setReceiptItems(updatedItems);
    setEditingItemId(null);
    setEditValues({});
    
    // Persister les modifications dans la base de données
    if (itemId) {
      try {
        console.log("💾 Enregistrement des modifications pour l'article:", itemId);
        const result = await updateReceiptItem(itemId, {
          ...editValues,
          receipt_id: editValues.receipt_id // Nécessaire pour les nouvelles insertions
        });
        
        if (result.success) {
          console.log("✅ Article mis à jour avec succès:", result.item);
          
          // Si c'est un nouvel article inséré, mettre à jour l'ID dans le tableau local
          if (result.action === 'inserted' && result.item.id) {
            const finalUpdatedItems = updatedItems.map(item => 
              item.id === itemId ? { ...item, id: result.item.id } : item
            );
            setReceiptItems(finalUpdatedItems);
            
            // Notifier le parent des changements
            if (onChange) {
              onChange(finalUpdatedItems);
            }
            
            // Réactiver la sélection après l'édition
            setTimeout(() => setSelectionDisabled(false), 100);
            return;
          }
        } else {
          console.error("❌ Erreur lors de la mise à jour de l'article:", result.error);
        }
      } catch (error) {
        console.error("❌ Erreur critique lors de la mise à jour:", error);
      }
    }
    
    // Notifier le parent des changements
    if (onChange) {
      onChange(updatedItems);
    }
    
    // Réactiver la sélection après l'édition
    setTimeout(() => setSelectionDisabled(false), 100);
  };

  // Gérer les changements dans les champs d'édition
  const handleEditChange = (field, value) => {
    setEditValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Mise à jour automatique du prix total si quantité ou prix unitaire changent
    if (field === 'quantite' || field === 'prix_unitaire') {
      const quantite = field === 'quantite' 
        ? parseFloat(value) || 0 
        : parseFloat(editValues.quantite) || 0;
        
      const prixUnitaire = field === 'prix_unitaire' 
        ? parseFloat(value) || 0 
        : parseFloat(editValues.prix_unitaire) || 0;
        
      const prixTotal = (quantite * prixUnitaire).toFixed(2);
      
      setEditValues(prev => ({
        ...prev,
        prix_total: prixTotal
      }));
    }
  };

  // Supprimer un article
  const deleteItem = async (itemId) => {
    // Désactiver la sélection pendant la suppression
    setSelectionDisabled(true);
    
    try {
      console.log("🗑️ Suppression de l'article:", itemId);
      
      // Supprimer l'article de la base de données
      const result = await deleteReceiptItem(itemId);
      
      if (!result.success) {
        console.error("❌ Erreur lors de la suppression de l'article:", result.error);
      }
    } catch (error) {
      console.error("❌ Erreur critique lors de la suppression:", error);
    }
    
    // Mettre à jour l'état local, même en cas d'erreur de la base de données
    const updatedItems = receiptItems.filter(item => item.id !== itemId);
    setReceiptItems(updatedItems);
    
    // Notifier le parent des changements
    if (onChange) {
      onChange(updatedItems);
    }
    
    // Réactiver la sélection après la suppression
    setTimeout(() => setSelectionDisabled(false), 100);
  };

  // Ajouter un nouvel article
  const addNewItem = () => {
    // Désactiver la sélection avant d'ajouter un nouvel article
    setSelectionDisabled(true);
    
    // Trouver l'ID du ticket à partir des articles existants
    const receiptId = receiptItems.length > 0 ? receiptItems[0].receipt_id : null;
    
    if (!receiptId) {
      console.error("❌ Impossible d'ajouter un article: ID de ticket introuvable");
      setSelectionDisabled(false);
      return;
    }
    
    const newItemId = `temp-${Date.now()}`;
    const newItem = {
      id: newItemId,
      receipt_id: receiptId, // Important pour l'insertion en base de données
      designation: "Nouvel article",
      quantite: 1,
      prix_unitaire: 0,
      prix_total: 0,
      matchScore: productName ? calculateMatchScore("Nouvel article", productName) : 0
    };
    
    const updatedItems = [...receiptItems, newItem];
    setReceiptItems(updatedItems);
    
    // Commencer l'édition du nouvel article
    startEditing(newItem);
    
    // Notifier le parent des changements
    if (onChange) {
      onChange(updatedItems);
    }
  };

  // Sélectionner un article (seulement s'il n'est pas déjà lié)
  const handleSelectItem = (item) => {
    // Ne sélectionner que si la sélection n'est pas désactivée, 
    // qu'aucune édition n'est en cours, et que l'article n'est pas déjà lié
    if (!selectionDisabled && editingItemId === null && onSelect && !linkedItems[item.id]) {
      onSelect(item);
    }
  };

  // Obtenir la classe CSS pour le badge du taux de correspondance
  const getMatchScoreClass = (score) => {
    if (score >= 0.7) return "bg-green-100 text-green-800";
    if (score >= 0.5) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  // Obtenir le style de la ligne en fonction de l'état de sélection et de liaison
  const getRowStyle = (item) => {
    if (linkedItems[item.id]) {
      return "bg-gray-100 opacity-70"; // Article déjà lié - non sélectionnable
    }
    
    if (selectedItem && selectedItem.id === item.id) {
      return "bg-green-50 hover:bg-green-100 cursor-pointer"; // Article sélectionné
    }
    
    return "hover:bg-gray-50 cursor-pointer"; // Article normal
  };

  return (
    <div className="mt-4">
      {/* Article sélectionné - Version mobile simplifiée */}
      {selectedItem && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm font-medium text-blue-900">Article sélectionné</div>
              <div className="text-xs text-blue-700">{selectedItem.designation}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-blue-600">{(selectedItem.prix_unitaire || 0).toFixed(2)} €</span>
                {productName && selectedItem.matchScore && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getMatchScoreClass(selectedItem.matchScore)}`}>
                    {Math.round(selectedItem.matchScore * 100)}% correspondance
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* En-tête simplifié */}
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-gray-800 text-sm">
          Articles du ticket ({receiptItems.length})
        </h4>
        <button
          type="button"
          onClick={addNewItem}
          className="flex items-center text-sm text-green-600 hover:text-green-800"
          disabled={!receiptItems.some(item => item.receipt_id)}
        >
          <Plus size={16} className="mr-1" />
          Ajouter
        </button>
      </div>
      
      {receiptItems.length === 0 ? (
        <div className="text-center py-4 bg-gray-50 rounded-md">
          <ShoppingCart className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Aucun article détecté</p>
        </div>
      ) : (
        /* Liste des articles - Format mobile optimisé */
        <div className="space-y-2">
          {receiptItems.map((item, index) => (
            <div 
              key={item.id || index} 
              className={`${getRowStyle(item)} transition-colors p-3 rounded-lg ${
                selectedItem && selectedItem.id === item.id ? 'ring-2 ring-green-500' : ''
              }`}
              onClick={() => handleSelectItem(item)}
            >
              {/* Mode affichage - Format mobile amélioré */}
              <div className="space-y-2">
                {/* Nom du produit sur toute la largeur */}
                <div className="flex items-start w-full">
                  {linkedItems[item.id] && (
                    <Star size={14} className="mr-2 text-blue-500 fill-blue-500 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={`text-sm font-medium leading-tight ${linkedItems[item.id] ? "line-through text-gray-500" : "text-gray-900"}`}>
                    {item.designation || 'Sans nom'}
                  </span>
                </div>
                
                {/* Prix, score et boutons sur la même ligne */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700">
                      {(item.prix_unitaire || 0).toFixed(2)} €
                    </span>
                    {productName && item.matchScore && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getMatchScoreClass(item.matchScore)}`}>
                        {Math.round(item.matchScore * 100)}%
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(item);
                      }}
                      className="p-2 text-blue-600 hover:text-blue-900"
                      disabled={linkedItems[item.id]}
                    >
                      <Edit size={14} className={linkedItems[item.id] ? "opacity-50" : ""} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(item.id);
                      }}
                      className="p-2 text-red-600 hover:text-red-900"
                      disabled={linkedItems[item.id]}
                    >
                      <Trash size={14} className={linkedItems[item.id] ? "opacity-50" : ""} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Modale d'édition */}
      {editingItemId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editValues.designation === "Nouvel article" ? "Ajouter un article" : "Modifier l'article"}
              </h3>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Désignation
                </label>
                <input
                  type="text"
                  value={editValues.designation || ''}
                  onChange={(e) => handleEditChange('designation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom de l'article"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantité
                  </label>
                  <input
                    type="number"
                    value={editValues.quantite || ''}
                    onChange={(e) => handleEditChange('quantite', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix unitaire (€)
                  </label>
                  <input
                    type="number"
                    value={editValues.prix_unitaire || ''}
                    onChange={(e) => handleEditChange('prix_unitaire', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix total (€)
                </label>
                <input
                  type="number"
                  value={editValues.prix_total || ''}
                  onChange={(e) => handleEditChange('prix_total', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelEditing}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => saveEditing(receiptItems.find(item => item.id === editingItemId)?.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500 text-center">
        Touchez un article pour le sélectionner
      </div>
    </div>
  );
};

export default ReceiptItemSelector;