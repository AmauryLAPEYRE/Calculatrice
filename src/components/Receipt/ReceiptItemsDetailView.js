// src/components/ReceiptItemsDetailView.js
import React, { useState, useEffect, useMemo } from 'react';
import { FilePlus, Search, Filter, ChevronDown, ChevronUp, ArrowUpDown, Download, HelpCircle, Info } from 'lucide-react';
import { formatDate, formatPrice } from '../../utils/formatters';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';

/**
 * Composant pour afficher la liste détaillée des articles d'un ticket de caisse
 * @param {Object} props - Propriétés du composant
 * @param {string} props.receiptId - ID du ticket de caisse
 * @param {Array} props.initialItems - Articles pré-chargés (optionnel)
 * @param {Object} props.receipt - Détails du ticket (optionnel)
 * @returns {JSX.Element}
 */
const ReceiptItemsDetailView = ({ receiptId, initialItems = null, receipt = null }) => {
  // États du composant
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [receiptDetails, setReceiptDetails] = useState(receipt);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'ordre', direction: 'asc' });
  const [expandedItem, setExpandedItem] = useState({});
  const [linkedStatus, setLinkedStatus] = useState({});
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'promo', 'normal'
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Stats du ticket
  const [stats, setStats] = useState({
    totalAmount: 0,
    itemCount: 0,
    avgPrice: 0,
    maxPrice: 0,
    minPrice: 0,
    promoCount: 0
  });
  
  // Charger les articles du ticket
  useEffect(() => {
    const fetchItems = async () => {
      // Si des articles ont été passés en props, les utiliser
      if (initialItems && initialItems.length > 0) {
        setItems(initialItems);
        calculateStats(initialItems);
        setLoading(false);
        
        // Vérifier quels articles sont liés à des avis
        checkLinkedArticles(receiptId, initialItems);
        return;
      }
      
      if (!receiptId) {
        setError("ID du ticket manquant");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Récupérer les articles du ticket
        const { data: fetchedItems, error: itemsError } = await supabase
          .from('receipt_items')
          .select('*')
          .eq('receipt_id', receiptId)
          .order('ordre', { ascending: true });
          
        if (itemsError) throw itemsError;
        
        // Récupérer les détails du ticket si non fournis
        if (!receiptDetails) {
          const { data: ticketData, error: ticketError } = await supabase
            .from('receipts')
            .select('*, enseignes:enseigne_id(nom, adresse1, ville, code_postal)')
            .eq('id', receiptId)
            .single();
            
          if (ticketError) {
            console.warn("Impossible de récupérer les détails du ticket:", ticketError);
          } else {
            setReceiptDetails(ticketData);
          }
        }
        
        setItems(fetchedItems || []);
        calculateStats(fetchedItems || []);
        
        // Vérifier quels articles sont liés à des avis
        checkLinkedArticles(receiptId, fetchedItems);
      } catch (err) {
        console.error("Erreur lors du chargement des articles:", err);
        setError(`Erreur lors du chargement des articles: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, [receiptId, initialItems, receiptDetails]);
  
  // Vérifier quels articles sont liés à des avis
  const checkLinkedArticles = async (ticketId, itemsList) => {
    try {
      if (!ticketId || !itemsList || itemsList.length === 0) return;
      
      // Récupérer les avis liés à ce ticket
      const { data: reviews, error } = await supabase
        .from('product_reviews')
        .select('receipt_item_id, product_code')
        .eq('receipt_id', ticketId);
        
      if (error) throw error;
      
      if (!reviews || reviews.length === 0) return;
      
      // Créer un objet avec les statuts liés
      const linkStatusMap = {};
      
      // Pour chaque article, vérifier s'il est lié à un avis
      itemsList.forEach(item => {
        const linkedReview = reviews.find(review => 
          review.receipt_item_id === item.id || 
          (item.product_code && review.product_code === item.product_code)
        );
        
        linkStatusMap[item.id] = !!linkedReview;
      });
      
      setLinkedStatus(linkStatusMap);
    } catch (err) {
      console.error("Erreur lors de la vérification des articles liés:", err);
    }
  };
  
  // Calculer les statistiques du ticket
  const calculateStats = (itemsList) => {
    if (!itemsList || itemsList.length === 0) {
      setStats({
        totalAmount: 0,
        itemCount: 0,
        avgPrice: 0,
        maxPrice: 0,
        minPrice: 0,
        promoCount: 0
      });
      return;
    }
    
    const validPrices = itemsList
      .map(item => parseFloat(item.prix_total || 0))
      .filter(price => !isNaN(price) && price > 0);
    
    const promoItems = itemsList.filter(item => 
      (item.designation || '').toLowerCase().includes('promo') || 
      (item.designation || '').toLowerCase().includes('remise') ||
      (item.prix_total || 0) < 0
    );
    
    if (validPrices.length === 0) {
      setStats({
        totalAmount: 0,
        itemCount: itemsList.length,
        avgPrice: 0,
        maxPrice: 0,
        minPrice: 0,
        promoCount: promoItems.length
      });
      return;
    }
    
    const total = validPrices.reduce((sum, price) => sum + price, 0);
    const avg = total / validPrices.length;
    const max = Math.max(...validPrices);
    const min = Math.min(...validPrices.filter(p => p > 0)); // Exclure les prix négatifs (remises)
    
    setStats({
      totalAmount: total,
      itemCount: itemsList.length,
      avgPrice: avg,
      maxPrice: max,
      minPrice: min,
      promoCount: promoItems.length
    });
  };
  
  // Basculer l'expansion d'un article
  const toggleItemExpand = (itemId) => {
    setExpandedItem(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  
  // Fonction de tri des articles
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Appliquer le tri et le filtrage
  const filteredAndSortedItems = useMemo(() => {
    // Filtrer d'abord
    let filteredItems = [...items];
    
    // Filtrer par recherche
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        (item.designation || '').toLowerCase().includes(lowerSearch) ||
        (item.product_code || '').toLowerCase().includes(lowerSearch) ||
        (item.prix_total?.toString() || '').includes(lowerSearch)
      );
    }
    
    // Filtrer par catégorie
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'promo') {
        filteredItems = filteredItems.filter(item => 
          (item.designation || '').toLowerCase().includes('promo') || 
          (item.designation || '').toLowerCase().includes('remise') ||
          (item.prix_total || 0) < 0
        );
      } else if (categoryFilter === 'normal') {
        filteredItems = filteredItems.filter(item => 
          !((item.designation || '').toLowerCase().includes('promo') || 
          (item.designation || '').toLowerCase().includes('remise') ||
          (item.prix_total || 0) < 0)
        );
      }
    }
    
    // Puis trier
    return filteredItems.sort((a, b) => {
      // Gérer les cas spéciaux pour différents types de colonnes
      if (sortConfig.key === 'designation') {
        // Tri alphabétique
        const aValue = a.designation || '';
        const bValue = b.designation || '';
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } 
      else if (sortConfig.key === 'prix_total' || sortConfig.key === 'prix_unitaire' || sortConfig.key === 'quantite') {
        // Tri numérique
        const aValue = parseFloat(a[sortConfig.key] || 0);
        const bValue = parseFloat(b[sortConfig.key] || 0);
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      else {
        // Tri par défaut (ordre dans le ticket)
        const aValue = a[sortConfig.key] || 0;
        const bValue = b[sortConfig.key] || 0;
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });
  }, [items, sortConfig, searchTerm, categoryFilter]);
  
  // Générer un CSV des articles
  const exportToCsv = () => {
    if (!items || items.length === 0) return;
    
    // En-têtes du CSV
    const headers = ['Désignation', 'Quantité', 'Prix unitaire', 'Prix total', 'Code produit'];
    
    // Lignes de données
    const dataRows = items.map(item => [
      item.designation || 'Non spécifié',
      item.quantite || '1',
      item.prix_unitaire || '0',
      item.prix_total || '0',
      item.product_code || ''
    ]);
    
    // Ajouter les informations du ticket
    const receiptInfo = [
      ['Informations ticket', '', '', '', ''],
      [`Date: ${receiptDetails ? formatDate(receiptDetails.receipt_date) : 'Non spécifiée'}`, '', '', '', ''],
      [`Total: ${receiptDetails ? formatPrice(receiptDetails.total_ttc) : 'Non spécifié'}`, '', '', '', ''],
      [`Magasin: ${receiptDetails?.enseignes?.nom || 'Non spécifié'}`, '', '', '', '']
    ];
    
    // Combiner tout
    const csvContent = [
      headers,
      ...dataRows,
      ['', '', '', '', ''],
      ...receiptInfo
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    // Créer un blob et déclencher le téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ticket_${receiptId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Détecter le type d'article (normal, promotion, etc.)
  const getItemType = (item) => {
    if (!item) return 'normal';
    
    const designation = (item.designation || '').toLowerCase();
    const price = parseFloat(item.prix_total || 0);
    
    if (designation.includes('promo') || designation.includes('remise') || price < 0) {
      return 'promotion';
    }
    
    if (designation.includes('total') || designation.includes('sous-total')) {
      return 'total';
    }
    
    return 'normal';
  };
  
  // Obtenir la classe CSS en fonction du type d'article
  const getItemRowClass = (item) => {
    const type = getItemType(item);
    const isLinked = linkedStatus[item.id];
    
    let baseClass = 'hover:bg-gray-50 transition-colors';
    
    if (type === 'promotion') {
      baseClass += ' text-purple-800 bg-purple-50 hover:bg-purple-100';
    } else if (type === 'total') {
      baseClass += ' font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200';
    } else if (isLinked) {
      baseClass += ' bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500';
    }
    
    return baseClass;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* En-tête avec titre et infos du ticket */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              <FilePlus className="h-5 w-5 text-green-600 mr-2" />
              Détails des articles du ticket
              {receiptDetails && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  #{receiptId.substring(0, 6)}
                </span>
              )}
            </h2>
            {receiptDetails && (
              <div className="text-sm text-gray-600 mt-1">
                {receiptDetails.receipt_date && (
                  <span className="mr-3">{formatDate(receiptDetails.receipt_date)}</span>
                )}
                {receiptDetails.enseignes?.nom && (
                  <span>{receiptDetails.enseignes.nom}</span>
                )}
              </div>
            )}
          </div>
          
          {/* Statistiques du ticket */}
          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {stats.itemCount} article{stats.itemCount !== 1 ? 's' : ''}
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Total: {formatPrice(stats.totalAmount)}
            </div>
            {stats.promoCount > 0 && (
              <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                {stats.promoCount} promotion{stats.promoCount !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Barre d'outils avec recherche et filtres */}
      <div className="p-3 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <div className="w-full sm:w-auto sm:flex-1 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un article..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="w-full sm:w-auto flex justify-between sm:justify-end space-x-2">
          <div className="flex items-center">
            <label className="text-sm text-gray-600 mr-2 whitespace-nowrap flex items-center">
              <Filter className="h-4 w-4 text-gray-500 mr-1" />
              Filtrer:
            </label>
            <select
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Tous</option>
              <option value="normal">Articles</option>
              <option value="promo">Promotions</option>
            </select>
          </div>
          
          <button
            className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={exportToCsv}
          >
            <Download className="h-4 w-4 mr-1" />
            CSV
          </button>
          
          <div className="relative">
            <button
              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              onClick={() => setShowTooltip(!showTooltip)}
            >
              <HelpCircle className="h-4 w-4" />
            </button>
            
            {showTooltip && (
              <div className="absolute right-0 mt-2 p-3 bg-white rounded-md shadow-lg z-10 text-sm w-64 border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-1">Légende</h4>
                <ul className="space-y-1">
                  <li className="flex items-center text-gray-700">
                    <div className="h-3 w-3 bg-blue-100 border-l-4 border-blue-500 mr-2"></div>
                    Article lié à un avis
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="h-3 w-3 bg-purple-50 mr-2"></div>
                    Promotion / Remise
                  </li>
                  <li className="flex items-center text-gray-700">
                    <div className="h-3 w-3 bg-gray-100 mr-2"></div>
                    Total / Sous-total
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Contenu principal - Tableau des articles */}
      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mb-3"></div>
          <p className="text-gray-600">Chargement des articles...</p>
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-600 bg-red-50">
          <p>{error}</p>
        </div>
      ) : filteredAndSortedItems.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p>Aucun article trouvé{searchTerm ? ` pour "${searchTerm}"` : ''}.</p>
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[600px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-6">
                  #
                </th>
                <th 
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                  onClick={() => requestSort('designation')}
                >
                  <div className="flex items-center">
                    Désignation
                    <ArrowUpDown 
                      className={`ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600 ${
                        sortConfig.key === 'designation' ? 'text-green-600' : ''
                      }`} 
                    />
                  </div>
                </th>
                <th 
                  className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                  onClick={() => requestSort('quantite')}
                >
                  <div className="flex items-center justify-end">
                    Qté
                    <ArrowUpDown 
                      className={`ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600 ${
                        sortConfig.key === 'quantite' ? 'text-green-600' : ''
                      }`} 
                    />
                  </div>
                </th>
                <th 
                  className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                  onClick={() => requestSort('prix_unitaire')}
                >
                  <div className="flex items-center justify-end">
                    Prix Unit.
                    <ArrowUpDown 
                      className={`ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600 ${
                        sortConfig.key === 'prix_unitaire' ? 'text-green-600' : ''
                      }`} 
                    />
                  </div>
                </th>
                <th 
                  className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                  onClick={() => requestSort('prix_total')}
                >
                  <div className="flex items-center justify-end">
                    Total
                    <ArrowUpDown 
                      className={`ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600 ${
                        sortConfig.key === 'prix_total' ? 'text-green-600' : ''
                      }`} 
                    />
                  </div>
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedItems.map((item, index) => (
                <React.Fragment key={item.id || index}>
                  <tr 
                    className={`${getItemRowClass(item)} cursor-pointer`}
                    onClick={() => toggleItemExpand(item.id)}
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {item.ordre || index + 1}
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <div className="flex items-center">
                        {expandedItem[item.id] ? (
                          <ChevronUp className="h-4 w-4 text-gray-400 mr-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400 mr-1" />
                        )}
                        <div className="font-medium">
                          {item.designation || 'Non spécifié'}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                      {item.quantite || '1'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                      {formatPrice(item.prix_unitaire || 0)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
                      {formatPrice(item.prix_total || 0)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-center">
                      <Link
                        to={`/recherche-filtre?q=${encodeURIComponent(item.designation || '')}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center p-1.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                        title="Rechercher ce produit"
                      >
                        <Search size={14} />
                      </Link>
                    </td>
                  </tr>
                  
                  {/* Détails étendus (affichés lorsque l'utilisateur clique sur une ligne) */}
                  {expandedItem[item.id] && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="px-4 py-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Détails de l'article</h4>
                            <div className="space-y-2">
                              {item.product_code && (
                                <div className="flex">
                                  <span className="text-xs text-gray-500 w-24">Code produit:</span>
                                  <span className="text-sm">{item.product_code}</span>
                                </div>
                              )}
                              <div className="flex">
                                <span className="text-xs text-gray-500 w-24">Quantité:</span>
                                <span className="text-sm">{item.quantite || '1'}</span>
                              </div>
                              <div className="flex">
                                <span className="text-xs text-gray-500 w-24">Prix unitaire:</span>
                                <span className="text-sm">{formatPrice(item.prix_unitaire || 0)}</span>
                              </div>
                              <div className="flex">
                                <span className="text-xs text-gray-500 w-24">Prix total:</span>
                                <span className="text-sm font-medium">{formatPrice(item.prix_total || 0)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Informations supplémentaires</h4>
                            <div className="space-y-2">
                              <div className="flex">
                                <span className="text-xs text-gray-500 w-24">Type:</span>
                                <span className="text-sm">
                                  {getItemType(item) === 'promotion' ? (
                                    <span className="text-purple-700">Promotion</span>
                                  ) : getItemType(item) === 'total' ? (
                                    <span className="text-gray-700">Total</span>
                                  ) : (
                                    <span className="text-green-700">Article standard</span>
                                  )}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="text-xs text-gray-500 w-24">Position:</span>
                                <span className="text-sm">{item.ordre || index + 1} sur {items.length}</span>
                              </div>
                              {linkedStatus[item.id] && (
                                <div className="mt-1 text-blue-700 bg-blue-50 p-2 rounded-md flex items-start text-sm">
                                  <Info className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                                  Cet article est lié à un avis
                                </div>
                              )}
                              <div className="mt-3">
                                <Link
                                  to={`/recherche-filtre?q=${encodeURIComponent(item.designation || '')}`}
                                  className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                                >
                                  <Search size={14} className="mr-1" />
                                  Rechercher ce produit
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pied de page avec résumé */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center text-sm">
        <div className="text-gray-600">
          {filteredAndSortedItems.length} article{filteredAndSortedItems.length !== 1 ? 's' : ''} 
          {searchTerm && items.length !== filteredAndSortedItems.length ? ` (sur ${items.length} total)` : ''}
        </div>
        
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <div className="text-gray-700">
            Total: <span className="font-medium">{formatPrice(stats.totalAmount)}</span>
          </div>
          <div className="text-gray-700">
            Prix moyen: <span className="font-medium">{formatPrice(stats.avgPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptItemsDetailView;