// src/components/ReceiptDetailModal.js
import React, { useState, useEffect, useRef } from 'react';
import { X,  ArrowLeft, Maximize2, Download } from 'lucide-react';
import ReceiptItemsDetailView from './ReceiptItemsDetailView';

/**
 * Modal pour afficher les détails d'un ticket avec la liste de ses articles
 * @param {Object} props - Propriétés du composant
 * @param {boolean} props.isOpen - État d'ouverture de la modale
 * @param {function} props.onClose - Fonction appelée pour fermer la modale
 * @param {Object} props.receipt - Données du ticket de caisse
 * @param {Array} props.initialItems - Articles pré-chargés (optionnel)
 * @returns {JSX.Element}
 */
const ReceiptDetailModal = ({ isOpen, onClose, receipt, initialItems = [] }) => {
  const [currentView, setCurrentView] = useState('details'); // 'details' ou 'image'
  const [fullscreen, setFullscreen] = useState(false);
  const modalRef = useRef(null);

  // Gérer l'échappement pour fermer la modale
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Gérer le clic à l'extérieur pour fermer la modale
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Gérer le plein écran
  const toggleFullscreen = () => {
    if (!fullscreen) {
      if (modalRef.current?.requestFullscreen) {
        modalRef.current.requestFullscreen().catch(err => {
          console.error(`Erreur lors du passage en plein écran: ${err.message}`);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Si la modale n'est pas ouverte, ne rien afficher
  if (!isOpen) return null;

  // Télécharger l'image du ticket
  const handleDownloadReceipt = () => {
    if (!receipt?.firebase_url) return;
    
    const link = document.createElement('a');
    link.href = receipt.firebase_url;
    link.download = `ticket-${receipt.id.substring(0, 8)}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div 
        ref={modalRef} 
        className={`relative bg-white rounded-lg shadow-xl overflow-hidden flex flex-col ${
          fullscreen ? 'w-full h-full' : 'w-full max-w-6xl max-h-[90vh]'
        }`}
      >
        {/* En-tête avec titre et contrôles */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center space-x-2">
            {currentView === 'image' && (
              <button 
                onClick={() => setCurrentView('details')}
                className="p-1.5 hover:bg-gray-200 rounded-full"
              >
                <ArrowLeft size={20} className="text-gray-700" />
              </button>
            )}
            <h2 className="text-xl font-bold text-gray-800">
              {currentView === 'details' ? 'Détails du ticket' : 'Visualisation du ticket'}
              {receipt && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  #{receipt.id.substring(0, 8)}
                </span>
              )}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            {currentView === 'details' && receipt?.firebase_url && (
              <button
                onClick={() => setCurrentView('image')}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-md flex items-center text-sm"
              >
                <Maximize2 size={16} className="mr-1.5" />
                Voir l'image
              </button>
            )}
            
            {receipt?.firebase_url && (
              <button
                onClick={handleDownloadReceipt}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-md flex items-center text-sm"
              >
                <Download size={16} className="mr-1.5" />
                Télécharger
              </button>
            )}
            
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Maximize2 size={18} />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-700 hover:bg-red-100 hover:text-red-600 rounded-md"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        {/* Corps principal */}
        <div className="flex-1 overflow-auto">
          {currentView === 'details' ? (
            <ReceiptItemsDetailView 
              receiptId={receipt?.id} 
              initialItems={initialItems} 
              receipt={receipt}
            />
          ) : (
            <div className="bg-gray-100 h-full flex items-center justify-center p-4">
              {receipt?.firebase_url ? (
                <img 
                  src={receipt.firebase_url} 
                  alt="Ticket de caisse" 
                  className="max-w-full max-h-full object-contain bg-white shadow-lg"
                />
              ) : (
                <div className="text-center p-8 bg-white rounded-lg shadow">
                  <p className="text-gray-500">Image du ticket non disponible</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptDetailModal;