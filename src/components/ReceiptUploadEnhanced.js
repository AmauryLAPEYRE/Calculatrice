// src/components/ReceiptUploadEnhanced.js (version responsive améliorée)
import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Check, AlertCircle, FileText, Camera, FileQuestion, AlertTriangle, Clock, ArrowRight, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { uploadReceipt, getRecentReceipts, deleteReceipt } from '../services/storageService';
import { analyzeAndProcessReceipt} from '../services/receiptAnalysisService';
import { 
  getReceiptItems, 
  updateReceiptItem, 
  getActiveCountries,
  updateReceiptAndEnseigne 
} from '../services/unifiedReceiptService';
import { formatDate } from '../utils/formatters';


const ReceiptUploadEnhanced = ({ onUploadComplete, productCode = null, productName = null }) => {
  const { currentUser, userDetails } = useAuth();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  // Nouvel état pour les tickets récents
  const [recentReceipts, setRecentReceipts] = useState([]);
  const [loadingReceipts, setLoadingReceipts] = useState(false);
  
  // AJOUT: État pour contrôler l'affichage complet des tickets
  const [showAllReceipts, setShowAllReceipts] = useState(false);

  const fileInputRef = useRef(null);

  // Charger les tickets récents au chargement du composant
  useEffect(() => {
    if (currentUser && userDetails) {
      fetchRecentReceipts();
    }
  }, [currentUser, userDetails]);

  // Fonction pour charger les tickets récents
  const fetchRecentReceipts = async () => {
    if (!currentUser || !userDetails) return;

    setLoadingReceipts(true);
    try {
      const result = await getRecentReceipts(userDetails.id, 20);
      if (result.success) {
        setRecentReceipts(result.receipts || []);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des tickets récents:", err);
    } finally {
      setLoadingReceipts(false);
    }
  };

  // Gestion de la sélection du fichier
  const handleFileChange = async (e) => {
    setError(null);
    setAnalysisError(null);

    // Vérifier si l'utilisateur est connecté
    if (!currentUser) {
      setError("Vous devez être connecté pour télécharger des tickets de caisse.");
      return;
    }
    
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Vérification du type de fichier
    if (!selectedFile.type.includes('image/')) {
      setError("Veuillez sélectionner une image (JPG, PNG)");
      return;
    }

    // Vérification de la taille du fichier (max 5 MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("La taille de l'image ne doit pas dépasser 5 MB");
      return;
    }

    setFile(selectedFile);
    
    // Création d'un aperçu
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };
  
  // Gestion de l'envoi du fichier vers Firebase et Supabase
  const handleUpload = async () => {
    if (!file) {
      setError("Veuillez sélectionner un ticket de caisse");
      return;
    }
    
    if (!currentUser || !userDetails) {
      setError("Vous devez être connecté pour télécharger des tickets de caisse.");
      return;
    }
    
    console.log("🔄 Début du processus d'upload et d'analyse du ticket");
    setUploading(true);
    setError(null);
    setAnalysisError(null);
    setProgress(0);
    
    // Simulation de progression pendant l'upload
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 5, 80));
    }, 200);
    
    try {
      // 1. Télécharger l'image vers Firebase Storage
      console.log("⬆️ Téléchargement de l'image vers Firebase...");
      const uploadResult = await uploadReceipt(
        file, 
        userDetails.id, 
        currentUser.uid, 
        productCode
      );
      
      clearInterval(progressInterval);
      console.log("✅ Résultat du téléchargement:", uploadResult);
      
      if (!uploadResult.success) {
        console.error("❌ Erreur pendant le téléchargement:", uploadResult.error);
        throw new Error(uploadResult.error || "Le téléchargement a échoué. Veuillez réessayer.");
      }
      
      setProgress(85);
      setAiProcessing(true);
      
      // 2. Analyser le ticket avec l'API et traiter les données
      console.log("🧠 Début de l'analyse du ticket avec URL:", uploadResult.url);
      console.log("👤 User ID:", userDetails.id);
      console.log("🧾 Receipt ID:", uploadResult.receipt.id);
      
      const analysisResult = await analyzeAndProcessReceipt(
        uploadResult.url,
        userDetails.id,
        uploadResult.receipt.id
      );

      console.log("📊 Résultat de l'analyse:", analysisResult);

      // NOUVELLE PARTIE: Vérifier si c'est un duplicata
      if (analysisResult.success && analysisResult.isDuplicate) {
        console.log("🔄 Ticket similaire détecté:", analysisResult.existingReceiptId);
        
        // Préparer l'interface pour afficher que c'est un ticket existant
        setProgress(100);
        setUploadSuccess(true);

        // Afficher un message de duplicata à l'utilisateur
        setAnalysisError({
          type: 'duplicate',
          message: "Ticket similaire déjà traité",
          details: "Ce ticket semble être un duplicata d'un ticket que vous avez déjà importé. Le ticket existant sera utilisé."
        });

        // Rafraîchir la liste des tickets récents
        fetchRecentReceipts();
          try {
            const deleteResult = await deleteReceipt(uploadResult.receipt.id, userDetails.id);

            if (deleteResult.success) {
              console.log("✅ Document duplicata supprimé avec succès");
            } else {
              console.error("⚠️ Échec de la suppression du document non-ticket:", deleteResult.error);
            }
          } catch (deleteError) {
            console.error("❌ Erreur lors de la suppression du document non-ticket:", deleteError);
          }
        // Appeler le callback avec les données du ticket existant
        if (onUploadComplete) {
          onUploadComplete(
            analysisResult.receipt,
            analysisResult.receipt.firebase_url,
            analysisResult.data,
            analysisResult.createdItems || []
          );
        }

        // Terminer le traitement ici
        setUploading(false);
        setAiProcessing(false);
        return;
      }
      
      // 3. Vérifier si l'analyse a réussi (cas d'échec standard)
      if (!analysisResult.success) {
        console.warn("⚠️ Analyse du ticket échouée:", analysisResult.error);

        // Si l'erreur est due au fait que l'image n'est pas un ticket
        if (analysisResult.data && analysisResult.data.is_receipt === false) {
          // MODIFICATION: Supprimer le document qui n'est pas un ticket
          console.log("🗑️ Suppression du document non-ticket:", uploadResult.receipt.id);

          try {
            const deleteResult = await deleteReceipt(uploadResult.receipt.id, userDetails.id);

            if (deleteResult.success) {
              console.log("✅ Document non-ticket supprimé avec succès");
            } else {
              console.error("⚠️ Échec de la suppression du document non-ticket:", deleteResult.error);
            }
          } catch (deleteError) {
            console.error("❌ Erreur lors de la suppression du document non-ticket:", deleteError);
          }

          // Afficher le message d'erreur à l'utilisateur
          setAnalysisError({
            type: 'not_receipt',
            message: "Ce document n'est pas un ticket de caisse",
            details: analysisResult.data.detection_reason || "Veuillez télécharger une image claire d'un ticket de caisse."
          });
        } else {
          // Autres erreurs d'analyse
          setAnalysisError({
            type: 'analysis_failed',
            message: "L'analyse du ticket a échoué",
            details: analysisResult.error || "Veuillez vérifier que l'image est claire et réessayer."
          });
        }

        setProgress(0);
        setUploading(false);
        setAiProcessing(false);
        return;
      }
      
      // Cas de succès standard (ni duplicata, ni erreur)
      setProgress(100);
      setUploadSuccess(true);
      
      // Rafraîchir la liste des tickets récents
      fetchRecentReceipts();
      
      // 4. Appeler le callback avec toutes les données
      console.log("🏁 Processus terminé, transmission des données au parent");
      if (onUploadComplete) {
        if (!uploadResult.receipt.receipt_date) {
          // Format YYYY-MM-DD
          uploadResult.receipt.receipt_date = new Date().toISOString().split('T')[0];
          console.log("📅 Date du ticket manquante, définie à la date du jour:", uploadResult.receipt.receipt_date);
        }
        const analysisData = analysisResult.data;
        const receiptItems = analysisResult.createdItems;
        
        onUploadComplete(
          uploadResult.receipt,
          uploadResult.url,
          analysisData,
          receiptItems
        );
      }
    } catch (err) {
      clearInterval(progressInterval);
      console.error("❌ Erreur critique dans le processus:", err);
      setError(err.message || "Le téléchargement a échoué. Veuillez réessayer.");
      setProgress(0);
    } finally {
      setUploading(false);
      setAiProcessing(false);
    }
  };

  // Fonction pour utiliser un ticket existant
  const handleUseExistingReceipt = async (receipt) => {
    setUploading(true);
    setError(null);
    setProgress(50);

    try {
      console.log("🔄 Utilisation d'un ticket existant:", receipt.id);

      // Charger les articles du ticket
      const { success, items } = await getReceiptItems(receipt.id);

      if (!success) {
        throw new Error("Impossible de charger les articles du ticket");
      }

      setProgress(100);
      setUploadSuccess(true);

      // Appeler le callback avec toutes les données
      if (onUploadComplete) {
        // Si receipt_date est null, utiliser la date du jour
        const receiptDate = receipt.receipt_date || new Date().toISOString().split('T')[0];
        // Extraire les informations de base du ticket
        const basicData = {
          is_receipt: true,
          date: receiptDate,
          store: receipt.enseignes.nom, // Pourrait être amélioré si l'enseigne est stockée
          code_postal: receipt.enseignes.code_postal,
          price: receipt.total_ttc,
          items: items.length
        };

        onUploadComplete(receipt, receipt.firebase_url, basicData, items);
      }
    } catch (err) {
      console.error("❌ Erreur lors de l'utilisation du ticket existant:", err);
      setError(err.message || "Impossible d'utiliser ce ticket. Veuillez réessayer.");
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  // Réinitialisation du formulaire
  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setUploading(false);
    setUploadSuccess(false);
    setError(null);
    setAnalysisError(null);
    setProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Ouverture de la caméra/galerie
  const handleOpenFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Ouverture directe de la caméra sur mobile
  const handleOpenCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.capture = 'environment';
      fileInputRef.current.click();
    }
  };

  // Déterminer s'il faut afficher l'erreur d'analyse
  const shouldShowAnalysisError = analysisError && (file || preview);

  // Fonction pour obtenir le nom de l'enseigne
  const getEnseigneName = (receipt) => {
    // Si l'enseigne est directement liée et chargée
    if (receipt.enseignes && receipt.enseignes.nom) {
      return receipt.enseignes.nom;
    }

    // Si on a l'ID d'enseigne mais pas l'objet complet
    if (receipt.enseigne_id) {
      return "Magasin enregistré";
    }

    return "Magasin inconnu";
  };

  // MODIFICATION: Rendu des tickets récents avec limitation d'affichage
  const renderRecentReceipts = () => {
    if (loadingReceipts) {
      return (
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
          <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      );
    }

    if (!recentReceipts.length) {
      return null;
    }

    // Déterminer quels tickets afficher
    const receiptsToShow = showAllReceipts ? recentReceipts : recentReceipts.slice(0, 3);
    const hasMoreReceipts = recentReceipts.length > 3;

    return (
      <div className="mb-4 sm:mb-6">
        <h4 className="text-sm font-medium mb-2 flex items-center text-gray-700">
          <Clock size={14} className="mr-1 text-green-600" />
          Tickets récents (14 derniers jours)
        </h4>

        <div className="space-y-2">
          {receiptsToShow.map(receipt => (
            <div 
              key={receipt.id}
              className="p-2 sm:p-3 bg-green-50 hover:bg-green-100 rounded-lg flex justify-between items-center cursor-pointer border border-green-200 transition"
              onClick={() => handleUseExistingReceipt(receipt)}
            >
              {/* Miniature du ticket si disponible */}
              {receipt.firebase_url && (
                <div className="w-12 h-12 sm:w-16 sm:h-16 mr-2 sm:mr-3 rounded-md overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                  <img 
                    src={receipt.firebase_url} 
                    alt="Miniature du ticket" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'%3E%3C/path%3E%3Cpolyline points='17 8 12 3 7 8'%3E%3C/polyline%3E%3Cline x1='12' y1='3' x2='12' y2='15'%3E%3C/line%3E%3C/svg%3E";
                    }}
                  />
                </div>
              )}

              <div className="flex-grow min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                  Ticket du {formatDate(receipt.upload_date)}
                </p>
                <div className="flex flex-wrap items-center text-xs text-gray-600 mt-1">
                  {receipt.total_ttc && (
                    <span className="inline-flex items-center mr-2">
                      <span>Total: {receipt.total_ttc.toFixed(2)}€</span>
                    </span>
                  )}
                  <span className="inline-flex items-center">
                    <span className="truncate">{getEnseigneName(receipt)}</span>
                  </span>
                </div>
              </div>

              <button className="p-1 text-green-600 hover:text-green-800 ml-2 flex-shrink-0">
                <ArrowRight size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* AJOUT: Bouton pour afficher plus/moins de tickets */}
        {hasMoreReceipts && (
          <div className="mt-3 text-center">
            <button
              onClick={() => setShowAllReceipts(!showAllReceipts)}
              className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md border border-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
            >
              {showAllReceipts ? (
                <>
                  <ChevronUp size={14} className="mr-1" />
                  Afficher moins
                </>
              ) : (
                <>
                  <ChevronDown size={14} className="mr-1" />
                  Tout afficher ({recentReceipts.length} tickets)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
          Ajouter un ticket de caisse
        </h2>

        <div className="mb-3 sm:mb-4">
          <p className="text-sm sm:text-base text-gray-600 mb-2">
            Pour valider votre avis, veuillez télécharger une photo de votre ticket de caisse montrant l'achat du produit.
          </p>

          <div className="text-xs text-gray-500 flex items-start mb-3 sm:mb-4">
            <AlertCircle size={12} className="sm:w-3.5 sm:h-3.5 mr-1 flex-shrink-0 mt-0.5" />
            <span>Assurez-vous que le nom du produit et la date d'achat sont clairement visibles</span>
          </div>
        </div>

        {/* Affichage des tickets récents */}
        {!file && !uploadSuccess && renderRecentReceipts()}

        {/* Message informatif pour les tickets dupliqués */}
        {analysisError && analysisError.type === 'duplicate' && (
          <div className="mb-3 sm:mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start">
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-700 text-sm sm:text-base">Ticket déjà existant</h3>
                <p className="text-xs sm:text-sm text-blue-600 mt-1">
                  Ce ticket semble identique à un ticket que vous avez déjà importé.
                  Pour éviter les doublons, le ticket existant sera utilisé automatiquement.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Affichage de l'erreur d'analyse */}
        {shouldShowAnalysisError && (
          <div className="mb-3 sm:mb-4 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start">
              {analysisError.type === 'not_receipt' ? (
                <FileQuestion className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <h3 className="font-medium text-red-700 text-sm sm:text-base">{analysisError.message}</h3>
                <p className="text-xs sm:text-sm text-red-600 mt-1">{analysisError.details}</p>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-xs sm:text-sm hover:bg-red-200 font-medium"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {!file ? (
          <div className="space-y-3 sm:space-y-4">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
              onClick={handleOpenFileSelector}
            >
              <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              <p className="mt-2 text-xs sm:text-sm text-gray-600">
                Cliquez pour sélectionner un fichier ou glissez-déposez une image ici
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG (max. 5 MB)
              </p>
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleOpenFileSelector}
                className="flex-1 flex items-center justify-center py-2.5 sm:py-2 px-3 sm:px-4 border border-green-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FileText size={16} className="sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Galerie
              </button>

              <button
                type="button"
                onClick={handleOpenCamera}
                className="flex-1 flex items-center justify-center py-2.5 sm:py-2 px-3 sm:px-4 border border-green-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Camera size={16} className="sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Appareil photo
              </button>
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <div className="relative">
              <img 
                src={preview} 
                alt="Aperçu du ticket de caisse" 
                className="w-full h-auto rounded-lg max-h-48 sm:max-h-64 object-contain bg-gray-100"
              />

              {!uploadSuccess && !shouldShowAnalysisError && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-700 hover:text-red-500"
                >
                  <X size={16} className="sm:w-4 sm:h-4" />
                </button>
              )}

              {uploadSuccess && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg">
                  <div className="bg-white rounded-full p-2">
                    <Check size={20} className="sm:w-6 sm:h-6 text-green-600" />
                  </div>
                </div>
              )}
            </div>

            {(uploading || aiProcessing) && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all" 
                  style={{ width: `${progress}%` }}
                ></div>
                <p className="text-xs text-gray-500 text-center mt-1">
                  {progress < 85 
                    ? `Téléchargement en cours (${progress}%)...` 
                    : "Analyse du ticket avec IA..."}
                </p>
              </div>
            )}

            {!uploadSuccess && !shouldShowAnalysisError ? (
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-2.5 sm:py-2 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  disabled={uploading || aiProcessing}
                >
                  Annuler
                </button>

                <button
                  type="button"
                  onClick={handleUpload}
                  className={`flex-1 flex items-center justify-center py-2.5 sm:py-2 px-3 sm:px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    (uploading || aiProcessing) ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={uploading || aiProcessing}
                >
                  {(uploading || aiProcessing) ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="truncate">
                        {progress < 85 ? "Envoi..." : "Analyse..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} className="sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      Valider
                    </>
                  )}
                </button>
              </div>
            ) : !shouldShowAnalysisError && (
              <div className="text-center">
                <div className="flex items-center justify-center text-green-600 mb-2">
                  <Check size={16} className="sm:w-4 sm:h-4 mr-1" />
                  <span className="font-medium text-sm sm:text-base">Ticket de caisse validé !</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Votre ticket de caisse a bien été enregistré et analysé. Vous pouvez maintenant donner votre avis sur le produit.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-3 py-2 px-4 text-xs sm:text-sm font-medium text-green-700 hover:text-green-800 focus:outline-none"
                >
                  Ajouter un autre ticket
                </button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-3 sm:mt-4 p-3 bg-red-50 text-red-700 rounded-md text-xs sm:text-sm flex items-start">
            <AlertCircle size={16} className="sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptUploadEnhanced;