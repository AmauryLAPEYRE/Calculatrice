import React, { useState, useRef, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import Quagga from 'quagga';

const BarcodeScanner = ({ onScanComplete, autoStart = false }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const scannerRef = useRef(null);
  const scanAreaRef = useRef(null);
  const initialized = useRef(false);

  const calculateScanArea = () => {
    if (!scanAreaRef.current || !scannerRef.current) return null;

    const scannerRect = scannerRef.current.getBoundingClientRect();
    const scanAreaRect = scanAreaRef.current.getBoundingClientRect();

    return {
      top: (scanAreaRect.top - scannerRect.top) / scannerRect.height,
      right: (scannerRect.right - scanAreaRect.right) / scannerRect.width,
      bottom: (scannerRect.bottom - scanAreaRect.bottom) / scannerRect.height,
      left: (scanAreaRect.left - scannerRect.left) / scannerRect.width,
    };
  };

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err) {
      console.error("Erreur d'accès à la caméra:", err);
      setHasPermission(false);
      return false;
    } finally {
      setPermissionRequested(true);
    }
  };

  const startScanner = async () => {
    if (!scannerRef.current) {
      console.error("Élément DOM manquant pour le scanner");
      return;
    }

    if (hasPermission === null && !permissionRequested) {
      const hasAccess = await checkCameraPermission();
      if (!hasAccess) return;
    }

    console.log("Tentative d'initialisation de Quagga...");
    
    setTimeout(() => {
      const scanArea = calculateScanArea();
      console.log("Zone de scan calculée:", scanArea);

      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            facingMode: "environment",
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 }
          },
          area: scanArea ? {
            top: `${scanArea.top * 100}%`,
            right: `${scanArea.right * 100}%`,
            bottom: `${scanArea.bottom * 100}%`,
            left: `${scanArea.left * 100}%`
          } : undefined
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
          boxSizing: 0.65
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        frequency: 15,
        decoder: {
          readers: [
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "code_128_reader"
          ],
          multiple: false,
          debug: {
            showCanvas: false,
            showPatches: false,
            showFoundPatches: false,
            showSkeleton: false,
            showLabels: false,
            showPatchLabels: false,
            showRemainingPatchLabels: false
          }
        },
        locate: true
      }, function(err) {
        if (err) {
          console.error("Erreur d'initialisation de Quagga:", err);
          setHasPermission(false);
          setIsScanning(false);
          return;
        }

        console.log("Quagga initialisé avec succès");
        initialized.current = true;
        setHasPermission(true);

        Quagga.start();
        setIsScanning(true);

        Quagga.onDetected((result) => {
          if (result && result.codeResult) {
            const code = result.codeResult.code;
            console.log("Code-barres détecté:", code);

            stopScanner();

            if (onScanComplete) {
              onScanComplete(code);
            }
          }
        });
      });
    }, 300);
  };

  const stopScanner = () => {
    if (initialized.current) {
      Quagga.stop();
      initialized.current = false;
      setIsScanning(false);
    }
  };

  const handleStartScan = async () => {
    if (hasPermission === false) {
      const hasAccess = await checkCameraPermission();
      if (!hasAccess) return;
    }

    setIsScanning(true);
  };

  useEffect(() => {
    if (autoStart && !initialized.current && !permissionRequested) {
      checkCameraPermission().then(hasAccess => {
        if (hasAccess) setTimeout(() => setIsScanning(true), 300);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  useEffect(() => {
    if (isScanning && !initialized.current) {
      const timeout = setTimeout(() => startScanner(), 100);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScanning]);

  useEffect(() => {
    return () => {
      console.log("Démontage du composant BarcodeScanner");
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div className="w-full">
      {!isScanning ? (
        <div className="text-center">
          <button
            onClick={handleStartScan}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center mx-auto"
          >
            <Camera className="mr-2" size={20} />
            Scanner un produit
          </button>
          <p className="mt-2 text-green-700 text-sm">
            Scannez le code-barre d'un produit alimentaire ou cosmétique
          </p>
        </div>
      ) : (
        <div className="relative">
          <div 
            ref={scannerRef}
            className="relative bg-black rounded-lg overflow-hidden aspect-[3/4] max-w-md mx-auto"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div 
                ref={scanAreaRef}
                className="w-64 h-40 relative"
              >
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-600 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-600 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-600 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-600 rounded-br-lg"></div>
              </div>
            </div>

            <div className="absolute bottom-5 left-0 right-0 text-center">
              <p className="text-white text-sm font-medium bg-black bg-opacity-50 py-1 px-2 rounded-md inline-block">
                Alignez le code-barre dans le cadre
              </p>
            </div>
          </div>

          <button
            onClick={stopScanner}
            className="mt-4 bg-red-600 text-white rounded-full p-2 flex items-center justify-center mx-auto hover:bg-red-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      )}

      {hasPermission === false && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          <p>L'accès à la caméra a été refusé. Veuillez autoriser l'accès dans les paramètres de votre navigateur.</p>
          <button 
            className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
            onClick={checkCameraPermission}
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;