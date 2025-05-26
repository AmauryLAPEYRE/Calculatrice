// src/components/HowItWorks.js
import React, { useState, useEffect, useRef } from 'react';
import { Scan, Star, Upload, ArrowRight, Check, Sparkles } from 'lucide-react';

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const sectionRef = useRef(null);

  // Observer pour déclencher l'animation lorsque la section est visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  // Rotation automatique des étapes
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible]);

  // Illustration moderne pour chaque étape
  const StepIllustration = ({ step }) => {
    const illustrations = {
      1: (
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <defs>
            <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#81C784', stopOpacity:1}}>
                <animate attributeName="stop-color" values="#81C784;#4CAF50;#81C784" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" style={{stopColor:'#4CAF50', stopOpacity:1}} />
            </linearGradient>
            <radialGradient id="scanGlow">
              <stop offset="0%" style={{stopColor:'#4CAF50', stopOpacity:0.6}} />
              <stop offset="100%" style={{stopColor:'#4CAF50', stopOpacity:0}} />
            </radialGradient>
          </defs>
          
          {/* Blob de fond */}
          <ellipse cx="150" cy="150" rx="120" ry="100" fill="url(#scanGradient)" opacity="0.1" />
          
          {/* Smartphone */}
          <g transform="translate(150, 150)">
            <rect x="-40" y="-70" width="80" height="140" rx="15" fill="#333" />
            <rect x="-35" y="-65" width="70" height="130" rx="12" fill="white" />
            
            {/* Écran avec interface de scan */}
            <rect x="-30" y="-60" width="60" height="120" rx="10" fill="#F5F5F5" />
            
            {/* Zone de scan */}
            <g>
              <rect x="-25" y="-30" width="50" height="50" fill="none" stroke="url(#scanGradient)" strokeWidth="3" strokeDasharray="5 5">
                <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
              </rect>
              
              {/* Ligne de scan animée */}
              <line x1="-25" y1="0" x2="25" y2="0" stroke="#4CAF50" strokeWidth="2" opacity="0.8">
                <animate attributeName="y1" values="-30;20;-30" dur="3s" repeatCount="indefinite" />
                <animate attributeName="y2" values="-30;20;-30" dur="3s" repeatCount="indefinite" />
              </line>
              
              {/* Code-barres */}
              <g opacity="0.7">
                <rect x="-15" y="-5" width="2" height="10" fill="#333" />
                <rect x="-11" y="-5" width="3" height="10" fill="#333" />
                <rect x="-6" y="-5" width="2" height="10" fill="#333" />
                <rect x="-2" y="-5" width="4" height="10" fill="#333" />
                <rect x="4" y="-5" width="2" height="10" fill="#333" />
                <rect x="8" y="-5" width="3" height="10" fill="#333" />
                <rect x="13" y="-5" width="2" height="10" fill="#333" />
              </g>
            </g>
            
            {/* Bouton scan */}
            <circle cx="0" cy="45" r="15" fill="url(#scanGradient)" />
            <circle cx="0" cy="45" r="12" fill="white" />
            <path d="M-6,45 L-3,48 L6,39" stroke="#4CAF50" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Effet de brillance */}
            <ellipse cx="-15" cy="-20" rx="10" ry="30" fill="white" opacity="0.3" />
          </g>
          
          {/* Particules de scan */}
          <g opacity="0.6">
            <circle cx="80" cy="100" r="3" fill="#4CAF50">
              <animate attributeName="cy" values="100;80;100" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="220" cy="120" r="2" fill="#81C784">
              <animate attributeName="cy" values="120;100;120" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="200" cy="200" r="2.5" fill="#66BB6A">
              <animate attributeName="cy" values="200;180;200" dur="3s" repeatCount="indefinite" />
            </circle>
          </g>
          
          {/* Halo de scan */}
          <circle cx="150" cy="150" r="0" fill="none" stroke="#4CAF50" strokeWidth="2" opacity="0">
            <animate attributeName="r" values="0;100;0" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>
      ),
      2: (
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <defs>
            <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#FFD54F', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#FFA726', stopOpacity:1}} />
            </linearGradient>
            <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#E8F5E9', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#C8E6C9', stopOpacity:1}} />
            </linearGradient>
          </defs>
          
          {/* Blob de fond */}
          <ellipse cx="150" cy="150" rx="110" ry="110" fill="url(#starGradient)" opacity="0.1" />
          
          {/* Carte produit */}
          <g transform="translate(150, 150)">
            <rect x="-70" y="-80" width="140" height="160" rx="15" fill="white" stroke="#E0E0E0" strokeWidth="2" />
            
            {/* Image produit */}
            <rect x="-60" y="-70" width="120" height="60" rx="10" fill="url(#cardGradient)" />
            <circle cx="0" cy="-40" r="25" fill="#81C784" opacity="0.8" />
            <path d="M-10,-40 Q0,-50 10,-40 Q5,-30 0,-25 Q-5,-30 -10,-40" fill="#4CAF50" />
            
            {/* Étoiles de notation */}
            <g transform="translate(-50, -5)">
              {[0, 20, 40, 60, 80].map((offset, i) => (
                <g key={i} transform={`translate(${offset}, 0)`}>
                  <path d="M0,-8 L2.4,-2.4 L8,-0 L2.4,2.4 L0,8 L-2.4,2.4 L-8,0 L-2.4,-2.4 Z" 
                        fill={i < 4 ? "url(#starGradient)" : "#E0E0E0"}>
                    <animateTransform 
                      attributeName="transform" 
                      type="scale" 
                      values="1;1.2;1" 
                      dur="2s" 
                      begin={`${i * 0.2}s`}
                      repeatCount="indefinite" />
                  </path>
                </g>
              ))}
            </g>
            
            {/* Stats */}
            <g transform="translate(-50, 20)">
              <rect x="0" y="0" width="100" height="8" rx="4" fill="#E0E0E0" />
              <rect x="0" y="0" width="85" height="8" rx="4" fill="#4CAF50">
                <animate attributeName="width" values="0;85" dur="2s" repeatCount="indefinite" />
              </rect>
              
              <rect x="0" y="15" width="100" height="8" rx="4" fill="#E0E0E0" />
              <rect x="0" y="15" width="92" height="8" rx="4" fill="#2196F3">
                <animate attributeName="width" values="0;92" dur="2s" begin="0.3s" repeatCount="indefinite" />
              </rect>
              
              <rect x="0" y="30" width="100" height="8" rx="4" fill="#E0E0E0" />
              <rect x="0" y="30" width="78" height="8" rx="4" fill="#FF6B6B">
                <animate attributeName="width" values="0;78" dur="2s" begin="0.6s" repeatCount="indefinite" />
              </rect>
            </g>
          </g>
          
          {/* Bulles d'avis flottantes */}
          <g opacity="0.8">
            <g transform="translate(80, 80)">
              <rect x="-25" y="-10" width="50" height="20" rx="10" fill="white" stroke="#4CAF50" strokeWidth="1" />
              <text x="0" y="4" textAnchor="middle" fill="#4CAF50" fontSize="10">Excellent!</text>
              <animateTransform attributeName="transform" type="translate" 
                                values="80,80; 85,70; 80,80" dur="3s" repeatCount="indefinite" />
            </g>
            
            <g transform="translate(220, 100)">
              <rect x="-20" y="-10" width="40" height="20" rx="10" fill="white" stroke="#FFD700" strokeWidth="1" />
              <text x="0" y="4" textAnchor="middle" fill="#FFA726" fontSize="10">Top!</text>
              <animateTransform attributeName="transform" type="translate" 
                                values="220,100; 215,90; 220,100" dur="3.5s" repeatCount="indefinite" />
            </g>
          </g>
          
          {/* Particules d'étoiles */}
          <g opacity="0.5">
            <path d="M50,50 L52,54 L56,54 L53,57 L55,61 L50,58 L45,61 L47,57 L44,54 L48,54 Z" 
                  fill="#FFD700">
              <animateTransform attributeName="transform" type="rotate" 
                                from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite" />
            </path>
            <path d="M250,80 L251,82 L253,82 L251.5,83.5 L252.5,85.5 L250,84 L247.5,85.5 L248.5,83.5 L247,82 L249,82 Z" 
                  fill="#FFD700">
              <animateTransform attributeName="transform" type="rotate" 
                                from="0 250 80" to="360 250 80" dur="8s" repeatCount="indefinite" />
            </path>
          </g>
        </svg>
      ),
      3: (
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <defs>
            <linearGradient id="uploadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#66BB6A', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#43A047', stopOpacity:1}} />
            </linearGradient>
          </defs>
          
          {/* Blob de fond */}
          <ellipse cx="150" cy="150" rx="110" ry="110" fill="url(#uploadGradient)" opacity="0.1" />
          
          {/* Ticket de caisse */}
          <g transform="translate(150, 150)">
            <path d="M-50,-70 L50,-70 L50,70 L40,75 L30,70 L20,75 L10,70 L0,75 L-10,70 L-20,75 L-30,70 L-40,75 L-50,70 Z" 
                  fill="white" stroke="#E0E0E0" strokeWidth="2" />
            
            {/* Lignes du ticket */}
            <line x1="-40" y1="-55" x2="40" y2="-55" stroke="#E0E0E0" strokeWidth="1" />
            <line x1="-40" y1="-40" x2="40" y2="-40" stroke="#E0E0E0" strokeWidth="1" />
            <line x1="-40" y1="-25" x2="40" y2="-25" stroke="#E0E0E0" strokeWidth="1" />
            <line x1="-40" y1="-10" x2="40" y2="-10" stroke="#E0E0E0" strokeWidth="1" />
            <line x1="-40" y1="5" x2="40" y2="5" stroke="#E0E0E0" strokeWidth="1" />
            <line x1="-40" y1="20" x2="40" y2="20" stroke="#E0E0E0" strokeWidth="1" />
            
            {/* Code-barres sur le ticket */}
            <g transform="translate(0, 40)">
              <rect x="-20" y="-5" width="2" height="10" fill="#333" />
              <rect x="-16" y="-5" width="3" height="10" fill="#333" />
              <rect x="-11" y="-5" width="2" height="10" fill="#333" />
              <rect x="-7" y="-5" width="4" height="10" fill="#333" />
              <rect x="-1" y="-5" width="2" height="10" fill="#333" />
              <rect x="3" y="-5" width="3" height="10" fill="#333" />
              <rect x="8" y="-5" width="2" height="10" fill="#333" />
              <rect x="12" y="-5" width="4" height="10" fill="#333" />
              <rect x="18" y="-5" width="2" height="10" fill="#333" />
            </g>
            
            {/* Check mark */}
            <circle cx="0" cy="0" r="25" fill="url(#uploadGradient)" opacity="0.9" />
            <path d="M-12,0 L-4,8 L12,-8" stroke="white" strokeWidth="4" fill="none" 
                  strokeLinecap="round" strokeLinejoin="round" />
          </g>
          
          {/* Flèche d'upload */}
          <g transform="translate(150, 80)" opacity="0.8">
            <path d="M0,20 L0,-10 M-10,0 L0,-10 L10,0" 
                  stroke="url(#uploadGradient)" strokeWidth="3" 
                  fill="none" strokeLinecap="round" strokeLinejoin="round">
              <animateTransform attributeName="transform" type="translate" 
                                values="0,0; 0,-10; 0,0" dur="2s" repeatCount="indefinite" />
            </path>
          </g>
          
          {/* Particules montantes */}
          <g opacity="0.6">
            <circle cx="100" cy="220" r="3" fill="#66BB6A">
              <animate attributeName="cy" values="220;80;220" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="200" cy="240" r="2" fill="#43A047">
              <animate attributeName="cy" values="240;100;240" dur="3s" begin="1s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur="3s" begin="1s" repeatCount="indefinite" />
            </circle>
            <circle cx="150" cy="250" r="2.5" fill="#81C784">
              <animate attributeName="cy" values="250;90;250" dur="3s" begin="0.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur="3s" begin="0.5s" repeatCount="indefinite" />
            </circle>
          </g>
          
          {/* Icône cloud */}
          <g transform="translate(150, 50)" opacity="0.7">
            <path d="M-30,0 Q-30,-15 -15,-15 Q-10,-25 5,-25 Q20,-25 25,-15 Q30,-15 30,-5 Q30,5 20,5 L-20,5 Q-30,5 -30,0" 
                  fill="white" stroke="#66BB6A" strokeWidth="2" />
            <path d="M0,-5 L5,0 L10,-5" stroke="#66BB6A" strokeWidth="2" fill="none" 
                  strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      )
    };
    
    return illustrations[step] || illustrations[1];
  };

  // Configuration des étapes
  const steps = [
    {
      number: 1,
      icon: <Scan size={32} className="text-white" />,
      title: "Scannez",
      description: "Utilisez la caméra de votre smartphone pour scanner le code-barres d'un produit alimentaire ou cosmétique.",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      benefit: "Identification instantanée en 2 secondes"
    },
    {
      number: 2,
      icon: <Star size={32} className="text-white" />,
      title: "Découvrez",
      description: "Consultez les avis vérifiés des autres utilisateurs et la note moyenne sur 5 étoiles.",
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
      benefit: "Avis 100% vérifiés par ticket de caisse"
    },
    {
      number: 3,
      icon: <Upload size={32} className="text-white" />,
      title: "Partagez",
      description: "Donnez votre propre avis après achat en téléchargeant une photo de votre ticket de caisse comme preuve.",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      benefit: "Contribuez à la communauté Fydo"
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Comment ça <span className="text-green-600">marche</span> ?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            FYDO simplifie l'accès à des informations fiables sur les produits que vous consommez au quotidien
          </p>
        </div>
        
        {/* Barre de progression */}
        <div className={`max-w-3xl mx-auto mb-16 transition-all duration-700 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-in-out"
              style={{ width: `${(activeStep / 3) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <button
                key={step.number}
                onClick={() => setActiveStep(step.number)}
                className={`relative flex flex-col items-center group cursor-pointer`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeStep >= step.number 
                    ? step.number === 2 ? 'bg-amber-500 text-white shadow-lg' : 'bg-green-600 text-white shadow-lg' 
                    : 'bg-white text-gray-400 border-2 border-gray-200'
                } group-hover:scale-110`}>
                  {step.number}
                </div>
                <span className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                  activeStep === step.number ? 'text-gray-800' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Illustration */}
            <div className={`transition-all duration-700 delay-500 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div className="relative">
                <StepIllustration step={activeStep} />
              </div>
            </div>
            
            {/* Contenu de l'étape active */}
            <div className={`transition-all duration-700 delay-700 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className={`w-16 h-16 rounded-full ${steps[activeStep - 1].color} flex items-center justify-center mr-4 shadow-lg`}>
                    {steps[activeStep - 1].icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Étape {activeStep}: {steps[activeStep - 1].title}
                    </h3>
                    <p className="text-green-600 text-sm font-medium">
                      {steps[activeStep - 1].benefit}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 text-lg">
                  {steps[activeStep - 1].description}
                </p>
                
                {/* Points clés */}
                <div className="space-y-3">
                  {activeStep === 1 && (
                    <>
                      <div className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">Compatible avec tous les codes-barres standards</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">Fonctionne même hors connexion</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">Résultats instantanés en moins de 2 secondes</span>
                      </div>
                    </>
                  )}
                  {activeStep === 2 && (
                    <>
                      <div className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">Notes détaillées sur 5 critères différents</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">Commentaires authentiques et détaillés</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">Filtres par critères spécifiques</span>
                      </div>
                    </>
                  )}
                  {activeStep === 3 && (
                    <>
                      <div className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">Vérification automatique du ticket</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">Anonymat garanti pour vos avis</span>
                      </div>
                      <div className="flex items-start">
                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                        <span className="text-gray-600">Badges et récompenses pour les contributeurs</span>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Navigation entre étapes */}
                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={() => setActiveStep(activeStep === 1 ? 3 : activeStep - 1)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    ← Précédent
                  </button>
                  <button
                    onClick={() => setActiveStep(activeStep === 3 ? 1 : activeStep + 1)}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 flex items-center shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Suivant
                    <ArrowRight size={18} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section CTA */}
        <div className={`mt-20 text-center transition-all duration-700 delay-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-white max-w-4xl mx-auto shadow-xl">
            <Sparkles className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-4">Prêt à essayer Fydo ?</h3>
            <p className="text-green-100 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui font déjà confiance à Fydo pour leurs achats quotidiens
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#telecharger" 
                className="bg-white hover:bg-gray-50 text-green-700 font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Télécharger l'application
              </a>
              <button className="bg-green-800 hover:bg-green-900 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                En savoir plus
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;