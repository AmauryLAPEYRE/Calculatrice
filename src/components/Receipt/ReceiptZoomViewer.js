// src/components/ReceiptZoomViewer.js
import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, MaximizeIcon, Download } from 'lucide-react';

/**
 * Composant avancé pour visualiser un ticket de caisse avec des contrôles de zoom
 * @param {Object} props - Propriétés du composant
 * @param {string} props.imageUrl - URL de l'image du ticket
 * @param {boolean} props.isOpen - État d'ouverture de la visionneuse
 * @param {function} props.onClose - Fonction appelée pour fermer la visionneuse
 * @param {string} props.receiptId - Identifiant du ticket pour le titre
 * @returns {JSX.Element}
 */
const ReceiptZoomViewer = ({ imageUrl, isOpen, onClose, receiptId }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [setIsFullscreen] = useState(false);
  
  const viewerRef = useRef(null);
  const imageRef = useRef(null);
  
  // Gérer les raccourcis clavier
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  // Gérer le fullscreen
  useEffect(() => {
    const viewer = viewerRef.current;
    
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = document.fullscreenElement === viewer;
      setIsFullscreen(isCurrentlyFullscreen);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  // Zoom in - augmenter le niveau de zoom
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 4));
  };
  
  // Zoom out - diminuer le niveau de zoom
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };
  
  // Réinitialiser le zoom
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };
  
  // Télécharger l'image
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ticket-${receiptId || 'caisse'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Basculer le mode plein écran
  const toggleFullscreen = () => {
    if (!viewerRef.current) return;
    
    if (!document.fullscreenElement) {
      viewerRef.current.requestFullscreen().catch(err => {
        console.error(`Erreur de passage en plein écran: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  
  // Gérer le début du glissement
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Uniquement clic gauche
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    
    e.preventDefault();
  };
  
  // Gérer le mouvement pendant le glissement
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
    
    e.preventDefault();
  };
  
  // Gérer la fin du glissement
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Gérer le zoom avec la molette de la souris
  const handleWheel = (e) => {
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
    e.preventDefault();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      {/* Conteneur principal avec gestion des événements */}
      <div 
        ref={viewerRef}
        className="relative w-full h-full flex flex-col"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Barre d'outils */}
        <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 p-4 flex justify-between z-10">
          <div className="text-white text-lg font-semibold">
            Ticket #{receiptId?.substring(0, 8) || 'de caisse'}
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleZoomOut}
              className="text-white hover:text-gray-200 transition-colors focus:outline-none"
              title="Zoom arrière (-)"
            >
              <ZoomOut size={20} />
            </button>
            <div className="text-white text-sm">{Math.round(zoomLevel * 100)}%</div>
            <button 
              onClick={handleZoomIn}
              className="text-white hover:text-gray-200 transition-colors focus:outline-none"
              title="Zoom avant (+)"
            >
              <ZoomIn size={20} />
            </button>
            <button 
              onClick={handleResetZoom}
              className="text-white hover:text-gray-200 transition-colors focus:outline-none text-sm"
              title="Réinitialiser le zoom"
            >
              100%
            </button>
            <button 
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-200 transition-colors focus:outline-none"
              title="Plein écran"
            >
              <MaximizeIcon size={20} />
            </button>
            <button 
              onClick={handleDownload}
              className="text-white hover:text-gray-200 transition-colors focus:outline-none"
              title="Télécharger"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={onClose}
              className="text-white hover:text-red-400 transition-colors focus:outline-none"
              title="Fermer"
            >
              <X size={22} />
            </button>
          </div>
        </div>
        
        {/* Image avec zoom */}
        <div className="flex-1 overflow-hidden flex items-center justify-center">
          <div 
            ref={imageRef}
            className="relative cursor-grab transition-transform duration-100"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
          >
            <img 
              src={imageUrl} 
              alt="Ticket de caisse" 
              className="max-w-full max-h-full object-contain"
              draggable="false"
            />
          </div>
        </div>
        
        {/* Instructions */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-3 text-center">
          <p className="text-white text-xs">
            Utilisez la molette de la souris pour zoomer, cliquez-glissez pour déplacer l'image
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptZoomViewer;