// src/components/Features.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  Scan, 
  Star, 
  Search, 
  Filter, 
  Info, 
  Heart, 
  ShoppingBag, 
  Leaf, 
  Shield, 
  Camera, 
  TrendingUp,
  Receipt,
  ChevronRight,
  Sparkles,
  Award,
  Users
} from 'lucide-react';

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Observer pour déclencher l'animation
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

  // Animation automatique des features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Illustration moderne des fonctionnalités
  const FeatureIllustration = ({ feature }) => {
    const illustrations = {
      scan: (
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <defs>
            <linearGradient id="scanFeatureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#81C784', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#4CAF50', stopOpacity:1}} />
            </linearGradient>
          </defs>
          
          {/* Fond animé */}
          <circle cx="150" cy="150" r="100" fill="url(#scanFeatureGrad)" opacity="0.1">
            <animate attributeName="r" values="100;110;100" dur="3s" repeatCount="indefinite" />
          </circle>
          
          {/* Zone de scan principale */}
          <g transform="translate(150, 150)">
            <rect x="-60" y="-60" width="120" height="120" fill="none" stroke="url(#scanFeatureGrad)" strokeWidth="3" strokeDasharray="10 5">
              <animate attributeName="stroke-dashoffset" from="0" to="15" dur="2s" repeatCount="indefinite" />
            </rect>
            
            {/* Coins de scan */}
            <path d="M-60,-60 L-60,-40 M-60,-60 L-40,-60" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
            <path d="M60,-60 L40,-60 M60,-60 L60,-40" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
            <path d="M-60,60 L-60,40 M-60,60 L-40,60" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
            <path d="M60,60 L60,40 M60,60 L40,60" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" />
            
            {/* Ligne de scan */}
            <line x1="-60" y1="0" x2="60" y2="0" stroke="#4CAF50" strokeWidth="2" opacity="0.8">
              <animate attributeName="y1" values="-60;60;-60" dur="3s" repeatCount="indefinite" />
              <animate attributeName="y2" values="-60;60;-60" dur="3s" repeatCount="indefinite" />
            </line>
            
            {/* Code-barres au centre */}
            <g opacity="0.7">
              <rect x="-25" y="-15" width="3" height="30" fill="#333" />
              <rect x="-20" y="-15" width="2" height="30" fill="#333" />
              <rect x="-16" y="-15" width="4" height="30" fill="#333" />
              <rect x="-10" y="-15" width="2" height="30" fill="#333" />
              <rect x="-6" y="-15" width="3" height="30" fill="#333" />
              <rect x="-1" y="-15" width="2" height="30" fill="#333" />
              <rect x="3" y="-15" width="4" height="30" fill="#333" />
              <rect x="9" y="-15" width="2" height="30" fill="#333" />
              <rect x="13" y="-15" width="3" height="30" fill="#333" />
              <rect x="18" y="-15" width="2" height="30" fill="#333" />
              <rect x="22" y="-15" width="3" height="30" fill="#333" />
            </g>
          </g>
          
          {/* Particules */}
          <g opacity="0.6">
            <circle cx="80" cy="80" r="2" fill="#4CAF50">
              <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="220" cy="100" r="3" fill="#81C784">
              <animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
      ),
      reviews: (
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <defs>
            <linearGradient id="reviewsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#FFD54F', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#FFA726', stopOpacity:1}} />
            </linearGradient>
          </defs>
          
          {/* Fond */}
          <ellipse cx="150" cy="150" rx="110" ry="100" fill="url(#reviewsGrad)" opacity="0.1" />
          
          {/* Étoiles principales */}
          <g transform="translate(150, 120)">
            {[-60, -30, 0, 30, 60].map((offset, i) => (
              <g key={i} transform={`translate(${offset}, 0)`}>
                <path d="M0,-20 L6,-6 L20,-6 L8,4 L12,18 L0,10 L-12,18 L-8,4 L-20,-6 L-6,-6 Z" 
                      fill={i < 4 ? "#FFD700" : "#E0E0E0"}>
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
          
          {/* Bulles de commentaires */}
          <g opacity="0.8">
            <g transform="translate(100, 180)">
              <rect x="-40" y="-15" width="80" height="30" rx="15" fill="white" stroke="#FFD700" strokeWidth="2" />
              <text x="0" y="5" textAnchor="middle" fill="#FFA726" fontSize="12" fontWeight="medium">Excellent!</text>
              <animateTransform attributeName="transform" type="translate" 
                                values="100,180; 105,175; 100,180" dur="3s" repeatCount="indefinite" />
            </g>
            
            <g transform="translate(200, 200)">
              <rect x="-35" y="-15" width="70" height="30" rx="15" fill="white" stroke="#4CAF50" strokeWidth="2" />
              <text x="0" y="5" textAnchor="middle" fill="#4CAF50" fontSize="12" fontWeight="medium">Vérifié</text>
              <animateTransform attributeName="transform" type="translate" 
                                values="200,200; 195,195; 200,200" dur="3.5s" repeatCount="indefinite" />
            </g>
          </g>
          
          {/* Ticket de caisse */}
          <g transform="translate(150, 250)">
            <path d="M-20,-20 L20,-20 L20,20 L15,22 L10,20 L5,22 L0,20 L-5,22 L-10,20 L-15,22 L-20,20 Z" 
                  fill="white" stroke="#E0E0E0" strokeWidth="1" />
            <circle cx="0" cy="0" r="10" fill="#4CAF50" />
            <path d="M-5,0 L-2,3 L5,-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      ),
      search: (
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <defs>
            <linearGradient id="searchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#42A5F5', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#1E88E5', stopOpacity:1}} />
            </linearGradient>
          </defs>
          
          {/* Loupe principale */}
          <g transform="translate(150, 150)">
            <circle cx="0" cy="0" r="60" fill="none" stroke="url(#searchGrad)" strokeWidth="8" />
            <line x1="42" y1="42" x2="80" y2="80" stroke="url(#searchGrad)" strokeWidth="8" strokeLinecap="round" />
            
            {/* Reflet */}
            <ellipse cx="-20" cy="-20" rx="15" ry="25" fill="white" opacity="0.3" transform="rotate(-45)" />
            
            {/* Contenu dans la loupe */}
            <g opacity="0.7">
              <rect x="-30" y="-30" width="15" height="20" rx="2" fill="#FFE082" />
              <circle cx="10" cy="-10" r="12" fill="#FF6B6B" />
              <rect x="-20" y="5" width="25" height="15" rx="7" fill="#CE93D8" />
            </g>
            
            {/* Animation de recherche */}
            <circle cx="0" cy="0" r="60" fill="none" stroke="#42A5F5" strokeWidth="2" opacity="0">
              <animate attributeName="r" values="60;80;60" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
            </circle>
          </g>
          
          {/* Particules de recherche */}
          <g opacity="0.6">
            <circle cx="80" cy="80" r="3" fill="#42A5F5">
              <animate attributeName="cx" values="80;230;80" dur="4s" repeatCount="indefinite" />
              <animate attributeName="cy" values="80;220;80" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="220" cy="80" r="2" fill="#1E88E5">
              <animate attributeName="cx" values="220;70;220" dur="4s" begin="1s" repeatCount="indefinite" />
              <animate attributeName="cy" values="80;220;80" dur="4s" begin="1s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
      ),
      nutrition: (
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <defs>
            <linearGradient id="nutritionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#66BB6A', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#43A047', stopOpacity:1}} />
            </linearGradient>
          </defs>
          
          {/* Assiette */}
          <g transform="translate(150, 150)">
            <ellipse cx="0" cy="0" rx="90" ry="90" fill="white" stroke="#E0E0E0" strokeWidth="3" />
            <ellipse cx="0" cy="0" rx="70" ry="70" fill="none" stroke="#E0E0E0" strokeWidth="1" />
            
            {/* Sections nutritionnelles */}
            <g>
              {/* Protéines */}
              <path d="M0,0 L0,-60 A60,60 0 0,1 52,30 Z" fill="#FF6B6B" opacity="0.8" />
              {/* Glucides */}
              <path d="M0,0 L52,30 A60,60 0 0,1 -52,30 Z" fill="#FFE082" opacity="0.8" />
              {/* Lipides */}
              <path d="M0,0 L-52,30 A60,60 0 0,1 0,-60 Z" fill="#81C784" opacity="0.8" />
            </g>
            
            {/* Icônes */}
            <text x="20" y="-20" fill="white" fontSize="20" fontWeight="bold">P</text>
            <text x="15" y="25" fill="#333" fontSize="20" fontWeight="bold">G</text>
            <text x="-30" y="5" fill="white" fontSize="20" fontWeight="bold">L</text>
          </g>
          
          {/* Badges nutritionnels */}
          <g opacity="0.8">
            <g transform="translate(80, 80)">
              <rect x="-25" y="-12" width="50" height="24" rx="12" fill="url(#nutritionGrad)" />
              <text x="0" y="4" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">BIO</text>
              <animateTransform attributeName="transform" type="scale" 
                                values="1;1.1;1" dur="3s" repeatCount="indefinite" />
            </g>
            
            <g transform="translate(220, 100)">
              <rect x="-25" y="-12" width="50" height="24" rx="12" fill="#4CAF50" />
              <text x="0" y="4" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">A</text>
              <animateTransform attributeName="transform" type="scale" 
                                values="1;1.1;1" dur="3s" begin="0.5s" repeatCount="indefinite" />
            </g>
          </g>
        </svg>
      ),
      favorites: (
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <defs>
            <linearGradient id="favGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#FF6B6B', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#FF5252', stopOpacity:1}} />
            </linearGradient>
          </defs>
          
          {/* Coeur principal */}
          <g transform="translate(150, 150)">
            <path d="M0,20 C0,-20 -40,-40 -40,-10 C-40,10 -20,30 0,50 C20,30 40,10 40,-10 C40,-40 0,-20 0,20 Z" 
                  fill="url(#favGrad)" transform="scale(2)">
              <animateTransform attributeName="transform" type="scale" 
                                values="2;2.2;2" dur="1.5s" repeatCount="indefinite" />
            </path>
            
            {/* Reflet */}
            <ellipse cx="-20" cy="-10" rx="15" ry="25" fill="white" opacity="0.3" />
          </g>
          
          {/* Petits coeurs flottants */}
          <g opacity="0.6">
            <g transform="translate(80, 100)">
              <path d="M0,5 C0,-2.5 -5,-5 -5,-2.5 C-5,0 -2.5,2.5 0,5 C2.5,2.5 5,0 5,-2.5 C5,-5 0,-2.5 0,5 Z" 
                    fill="#FF6B6B">
                <animateTransform attributeName="transform" type="translate" 
                                  values="0,0; 0,-20; 0,0" dur="3s" repeatCount="indefinite" />
              </path>
            </g>
            
            <g transform="translate(220, 120)">
              <path d="M0,5 C0,-2.5 -5,-5 -5,-2.5 C-5,0 -2.5,2.5 0,5 C2.5,2.5 5,0 5,-2.5 C5,-5 0,-2.5 0,5 Z" 
                    fill="#FF5252">
                <animateTransform attributeName="transform" type="translate" 
                                  values="0,0; 0,-20; 0,0" dur="3s" begin="1s" repeatCount="indefinite" />
              </path>
            </g>
            
            <g transform="translate(150, 80)">
              <path d="M0,5 C0,-2.5 -5,-5 -5,-2.5 C-5,0 -2.5,2.5 0,5 C2.5,2.5 5,0 5,-2.5 C5,-5 0,-2.5 0,5 Z" 
                    fill="#FF6B6B">
                <animateTransform attributeName="transform" type="translate" 
                                  values="0,0; 0,-20; 0,0" dur="3s" begin="0.5s" repeatCount="indefinite" />
              </path>
            </g>
          </g>
        </svg>
      ),
      history: (
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <defs>
            <linearGradient id="historyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#CE93D8', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#BA68C8', stopOpacity:1}} />
            </linearGradient>
          </defs>
          
          {/* Horloge */}
          <g transform="translate(150, 150)">
            <circle cx="0" cy="0" r="80" fill="white" stroke="url(#historyGrad)" strokeWidth="6" />
            <circle cx="0" cy="0" r="5" fill="#BA68C8" />
            
            {/* Aiguilles */}
            <line x1="0" y1="0" x2="0" y2="-50" stroke="#BA68C8" strokeWidth="4" strokeLinecap="round">
              <animateTransform attributeName="transform" type="rotate" 
                                from="0 0 0" to="360 0 0" dur="60s" repeatCount="indefinite" />
            </line>
            <line x1="0" y1="0" x2="30" y2="0" stroke="#CE93D8" strokeWidth="3" strokeLinecap="round">
              <animateTransform attributeName="transform" type="rotate" 
                                from="0 0 0" to="360 0 0" dur="5s" repeatCount="indefinite" />
            </line>
            
            {/* Marques des heures */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
              <line key={angle} x1="0" y1="-70" x2="0" y2="-75" 
                    stroke="#E0E0E0" strokeWidth="2" 
                    transform={`rotate(${angle})`} />
            ))}
          </g>
          
          {/* Flèche de retour */}
          <g transform="translate(220, 80)" opacity="0.7">
            <path d="M0,0 A20,20 0 1,0 -20,20" fill="none" stroke="#CE93D8" strokeWidth="3" />
            <path d="M-20,20 L-25,15 M-20,20 L-15,15" stroke="#CE93D8" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      )
    };
    
    return illustrations[feature] || illustrations.scan;
  };

  // Liste des fonctionnalités
  const features = [
    {
      id: 'scan',
      icon: <Scan size={32} />,
      title: 'Scan rapide',
      description: 'Scannez n\'importe quel code-barres pour accéder instantanément aux informations produit',
      benefits: ['Reconnaissance instantanée', 'Mode hors-ligne', 'Multi-formats supportés'],
      color: 'green'
    },
    {
      id: 'reviews',
      icon: <Star size={32} />,
      title: 'Avis vérifiés',
      description: 'Consultez des avis 100% authentiques vérifiés par ticket de caisse',
      benefits: ['Vérification par ticket', 'Notes multicritères', 'Photos des utilisateurs'],
      color: 'amber'
    },
    {
      id: 'search',
      icon: <Search size={32} />,
      title: 'Recherche avancée',
      description: 'Trouvez exactement ce que vous cherchez avec nos filtres intelligents',
      benefits: ['Filtres par ingrédients', 'Recherche par nom', 'Suggestions personnalisées'],
      color: 'blue'
    },
    {
      id: 'nutrition',
      icon: <Leaf size={32} />,
      title: 'Info nutritionnelles',
      description: 'Accédez aux valeurs nutritionnelles complètes et aux scores santé',
      benefits: ['Nutri-Score', 'Éco-Score', 'Allergènes signalés'],
      color: 'green'
    },
    {
      id: 'favorites',
      icon: <Heart size={32} />,
      title: 'Favoris',
      description: 'Sauvegardez vos produits préférés pour un accès rapide',
      benefits: ['Listes personnalisées', 'Notifications de prix', 'Partage facile'],
      color: 'pink'
    },
    {
      id: 'history',
      icon: <TrendingUp size={32} />,
      title: 'Historique',
      description: 'Suivez vos scans et consultations pour un suivi optimal',
      benefits: ['Statistiques détaillées', 'Export des données', 'Tendances personnelles'],
      color: 'purple'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: 'from-green-100 to-green-200 text-green-600',
      amber: 'from-amber-100 to-amber-200 text-amber-600',
      blue: 'from-blue-100 to-blue-200 text-blue-600',
      pink: 'from-pink-100 to-pink-200 text-pink-600',
      purple: 'from-purple-100 to-purple-200 text-purple-600'
    };
    return colors[color] || colors.green;
  };

  return (
    <section ref={sectionRef} className="py-20 bg-white relative overflow-hidden">
      {/* Motifs de fond */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full transform -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-200 rounded-full transform translate-x-48 translate-y-48"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Des fonctionnalités <span className="text-green-600">puissantes</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour faire des choix éclairés, dans une seule application
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          {/* Grille principale des fonctionnalités */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Illustration */}
            <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-xl">
                <FeatureIllustration feature={features[activeFeature].id} />
              </div>
            </div>
            
            {/* Contenu */}
            <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div
                    key={feature.id}
                    className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                      activeFeature === index 
                        ? 'bg-white shadow-xl scale-105 border-2 border-green-500' 
                        : 'bg-gray-50 hover:bg-white hover:shadow-lg'
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getColorClasses(feature.color)} flex items-center justify-center flex-shrink-0`}>
                        {React.cloneElement(feature.icon, { 
                          className: activeFeature === index ? 'scale-110' : '',
                          style: { transition: 'transform 0.3s' }
                        })}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {feature.description}
                        </p>
                        
                        {activeFeature === index && (
                          <div className="space-y-2 mt-4">
                            {feature.benefits.map((benefit, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <Sparkles size={16} className="text-green-500" />
                                <span className="text-sm text-gray-700">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <ChevronRight 
                        size={20} 
                        className={`text-gray-400 transition-transform ${
                          activeFeature === index ? 'rotate-90 text-green-500' : ''
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Section des badges */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 transition-all duration-700 delay-300 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}>
            {[
              { icon: <Shield size={24} />, value: '100%', label: 'Sécurisé' },
              { icon: <Users size={24} />, value: '10K+', label: 'Utilisateurs' },
              { icon: <Receipt size={24} />, value: '50K+', label: 'Avis vérifiés' },
              { icon: <Award size={24} />, value: '4.8/5', label: 'Note App Store' }
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-center"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-green-600 mb-3 flex justify-center">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* CTA Final */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-white shadow-xl">
              <Award size={48} className="mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-4">Prêt à découvrir toutes ces fonctionnalités ?</h3>
              <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                Téléchargez Fydo gratuitement et rejoignez des milliers d'utilisateurs satisfaits
              </p>
              <a 
                href="#telecharger"
                className="inline-flex items-center bg-white hover:bg-gray-50 text-green-700 font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Sparkles className="mr-2" size={20} />
                Télécharger maintenant
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;