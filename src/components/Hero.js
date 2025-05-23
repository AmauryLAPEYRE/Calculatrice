// src/components/Hero.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Scan, Star, Shield, Users, Sparkles, Trophy, Heart, Zap, Receipt } from 'lucide-react';

const Hero = () => {
  // États pour les animations séquentielles
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showScanCard, setShowScanCard] = useState(false);
  const [showFeatureCards, setShowFeatureCards] = useState(false);
  const [hoverScan, setHoverScan] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  // Déclencher les animations séquentiellement
  useEffect(() => {
    const titleTimer = setTimeout(() => setShowTitle(true), 100);
    const subtitleTimer = setTimeout(() => setShowSubtitle(true), 200);
    const buttonsTimer = setTimeout(() => setShowButtons(true), 300);
    const scanCardTimer = setTimeout(() => setShowScanCard(true), 400);
    const cardsTimer = setTimeout(() => setShowFeatureCards(true), 500);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(subtitleTimer);
      clearTimeout(buttonsTimer);
      clearTimeout(scanCardTimer);
      clearTimeout(cardsTimer);
    };
  }, []);

  // Animation automatique des features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Illustration moderne du Hero
  const HeroIllustration = () => (
    <svg viewBox="0 0 600 500" className="w-full h-full">
      <defs>
        <linearGradient id="heroGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#81C784', stopOpacity:1}}>
            <animate attributeName="stop-color" values="#81C784;#4CAF50;#81C784" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" style={{stopColor:'#4CAF50', stopOpacity:1}}>
            <animate attributeName="stop-color" values="#4CAF50;#81C784;#4CAF50" dur="4s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
        <linearGradient id="heroGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#FFD54F', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#FFA726', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="heroGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#E1BEE7', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#CE93D8', stopOpacity:1}} />
        </linearGradient>
        <radialGradient id="phoneGlow">
          <stop offset="0%" style={{stopColor:'#ffffff', stopOpacity:0.8}} />
          <stop offset="100%" style={{stopColor:'#E8F5E9', stopOpacity:0.2}} />
        </radialGradient>
      </defs>
      
      {/* Blob de fond animé */}
      <path d="M300,50 Q450,100 480,250 Q510,400 350,450 Q200,500 100,430 Q0,360 30,220 Q60,80 180,40 Q240,20 300,50Z" 
            fill="url(#heroGrad1)" opacity="0.1">
        <animate attributeName="d" 
                 values="M300,50 Q450,100 480,250 Q510,400 350,450 Q200,500 100,430 Q0,360 30,220 Q60,80 180,40 Q240,20 300,50Z;
                         M300,40 Q480,90 510,240 Q540,390 380,440 Q220,490 120,420 Q20,350 50,210 Q80,70 200,30 Q260,10 300,40Z;
                         M300,50 Q450,100 480,250 Q510,400 350,450 Q200,500 100,430 Q0,360 30,220 Q60,80 180,40 Q240,20 300,50Z"
                 dur="10s" repeatCount="indefinite" />
      </path>
      
      {/* Smartphone central */}
      <g transform="translate(300, 250)">
        {/* Ombre du téléphone */}
        <ellipse cx="0" cy="120" rx="70" ry="20" fill="#000" opacity="0.1" />
        
        {/* Corps du téléphone */}
        <rect x="-70" y="-120" width="140" height="240" rx="20" fill="#333" />
        <rect x="-65" y="-115" width="130" height="230" rx="18" fill="white" />
        
        {/* Écran */}
        <rect x="-60" y="-110" width="120" height="220" rx="15" fill="#F5F5F5" />
        
        {/* Interface Fydo */}
        <rect x="-60" y="-110" width="120" height="40" rx="15" fill="url(#heroGrad1)" />
        <text x="0" y="-85" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">Fydo</text>
        <path d="M20,-85 L25,-80 L30,-85 L25,-75 L20,-85" fill="#FFD700" />
        
        {/* Zone de scan */}
        <g transform="translate(0, -20)">
          <rect x="-40" y="-40" width="80" height="80" fill="none" stroke="url(#heroGrad1)" strokeWidth="3" strokeDasharray="5 5">
            <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
          </rect>
          
          {/* Ligne de scan */}
          <line x1="-40" y1="0" x2="40" y2="0" stroke="#4CAF50" strokeWidth="2" opacity="0.8">
            <animate attributeName="y1" values="-40;40;-40" dur="3s" repeatCount="indefinite" />
            <animate attributeName="y2" values="-40;40;-40" dur="3s" repeatCount="indefinite" />
          </line>
          
          {/* Code-barres */}
          <g opacity="0.6">
            <rect x="-25" y="-10" width="3" height="20" fill="#333" />
            <rect x="-20" y="-10" width="2" height="20" fill="#333" />
            <rect x="-16" y="-10" width="4" height="20" fill="#333" />
            <rect x="-10" y="-10" width="2" height="20" fill="#333" />
            <rect x="-6" y="-10" width="3" height="20" fill="#333" />
            <rect x="-1" y="-10" width="2" height="20" fill="#333" />
            <rect x="3" y="-10" width="4" height="20" fill="#333" />
            <rect x="9" y="-10" width="2" height="20" fill="#333" />
            <rect x="13" y="-10" width="3" height="20" fill="#333" />
            <rect x="18" y="-10" width="2" height="20" fill="#333" />
            <rect x="22" y="-10" width="3" height="20" fill="#333" />
          </g>
        </g>
        
        {/* Boutons d'action */}
        <g transform="translate(0, 70)">
          <rect x="-50" y="-15" width="100" height="30" rx="15" fill="url(#heroGrad1)" />
          <text x="0" y="5" textAnchor="middle" fill="white" fontSize="14" fontWeight="medium">Scanner</text>
        </g>
        
        {/* Notification */}
        <g transform="translate(50, -90)" className={hoverScan ? 'opacity-100' : 'opacity-0'} style={{transition: 'opacity 0.3s'}}>
          <rect x="-30" y="-10" width="60" height="20" rx="10" fill="#4CAF50" />
          <text x="0" y="4" textAnchor="middle" fill="white" fontSize="10">Nouveau!</text>
        </g>
        
        {/* Effet de brillance */}
        <rect x="-60" y="-110" width="30" height="220" rx="15" fill="url(#phoneGlow)" opacity="0.3" />
      </g>
      
      {/* Produits flottants autour */}
      <g opacity="0.8">
        {/* Produit alimentaire */}
        <g transform="translate(120, 150)">
          <rect x="-30" y="-40" width="60" height="80" rx="5" fill="url(#heroGrad2)" />
          <rect x="-20" y="-30" width="40" height="40" rx="5" fill="white" opacity="0.3" />
          <circle cx="0" cy="0" r="15" fill="#8BC34A" opacity="0.8" />
          <animateTransform attributeName="transform" type="translate" 
                            values="120,150; 130,140; 120,150" dur="4s" repeatCount="indefinite" />
        </g>
        
        {/* Produit cosmétique */}
        <g transform="translate(480, 200)">
          <ellipse cx="0" cy="0" rx="25" ry="40" fill="url(#heroGrad3)" />
          <ellipse cx="0" cy="-30" rx="12" ry="8" fill="#BA68C8" />
          <circle cx="0" cy="-40" r="6" fill="#9C27B0" />
          <ellipse cx="-8" cy="-10" rx="8" ry="20" fill="white" opacity="0.3" />
          <animateTransform attributeName="transform" type="translate" 
                            values="480,200; 470,190; 480,200" dur="3s" repeatCount="indefinite" />
        </g>
        
        {/* Note et étoiles */}
        <g transform="translate(150, 320)">
          <rect x="-40" y="-20" width="80" height="40" rx="20" fill="white" stroke="#FFD700" strokeWidth="2" />
          <g transform="translate(-20, 0)">
            {[0, 12, 24, 36].map((offset, i) => (
              <path key={i} d={`M${offset},-5 L${offset+3},0 L${offset+9},0 L${offset+4},3 L${offset+6},9 L${offset},5 L${offset-6},9 L${offset-4},3 L${offset-9},0 L${offset-3},0 Z`} 
                    fill="#FFD700" transform="scale(0.8)" />
            ))}
          </g>
          <animateTransform attributeName="transform" type="scale" 
                            values="1;1.05;1" dur="2s" repeatCount="indefinite" additive="sum" />
        </g>
        
        {/* Ticket de caisse */}
        <g transform="translate(450, 350)">
          <path d="M-20,-25 L20,-25 L20,25 L15,28 L10,25 L5,28 L0,25 L-5,28 L-10,25 L-15,28 L-20,25 Z" 
                fill="white" stroke="#E0E0E0" strokeWidth="1" />
          <line x1="-15" y1="-15" x2="15" y2="-15" stroke="#E0E0E0" strokeWidth="1" />
          <line x1="-15" y1="-5" x2="15" y2="-5" stroke="#E0E0E0" strokeWidth="1" />
          <line x1="-15" y1="5" x2="15" y2="5" stroke="#E0E0E0" strokeWidth="1" />
          <circle cx="0" cy="15" r="8" fill="#4CAF50" />
          <path d="M-4,15 L-1,18 L4,12" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
          <animateTransform attributeName="transform" type="rotate" 
                            from="0 450 350" to="5 450 350" dur="3s" 
                            repeatCount="indefinite" autoReverse="true" />
        </g>
      </g>
      
      {/* Particules dynamiques */}
      <g opacity="0.6">
        <circle cx="100" cy="100" r="3" fill="#81C784">
          <animate attributeName="cy" values="100;90;100" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="500" cy="150" r="4" fill="#FFD54F">
          <animate attributeName="cy" values="150;140;150" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="180" cy="400" r="3" fill="#CE93D8">
          <animate attributeName="cy" values="400;390;400" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="520" cy="380" r="2.5" fill="#4CAF50">
          <animate attributeName="cy" values="380;370;380" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Icônes flottantes */}
      <g opacity="0.7">
        <g transform="translate(80, 250)">
          <circle cx="0" cy="0" r="20" fill="white" stroke="#4CAF50" strokeWidth="2" />
          <path d="M-5,0 L-2,3 L5,-4" stroke="#4CAF50" strokeWidth="3" fill="none" strokeLinecap="round" />
          <animateTransform attributeName="transform" type="rotate" 
                            from="0 80 250" to="360 80 250" dur="20s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(520, 280)">
          <circle cx="0" cy="0" r="20" fill="white" stroke="#FF6B6B" strokeWidth="2" />
          <path d="M0,3 C0,-3 -5,-6 -5,-2 C-5,1 -2.5,4 0,7 C2.5,4 5,1 5,-2 C5,-6 0,-3 0,3 Z" 
                fill="#FF6B6B" />
          <animateTransform attributeName="transform" type="scale" 
                            values="1;1.1;1" dur="2s" repeatCount="indefinite" />
        </g>
      </g>
    </svg>
  );

  // Caractéristiques principales affichées dans les cartes
  const features = [
    {
      id: 'scan',
      icon: <Scan className="text-green-600" size={24} />,
      title: 'Scan Produit',
      description: 'Scannez et accédez aux infos en un instant',
      color: 'green'
    },
    {
      id: 'reviews',
      icon: <Star className="text-amber-500 fill-amber-500" size={24} />,
      title: 'Avis Vérifiés',
      description: 'Des avis authentifiés par ticket de caisse',
      color: 'amber'
    },
    {
      id: 'community',
      icon: <Users className="text-sky-600" size={24} />,
      title: 'Communauté',
      description: 'Partagez votre expérience avec des milliers d\'utilisateurs',
      color: 'sky'
    },
    {
      id: 'trust',
      icon: <Shield className="text-purple-600" size={24} />,
      title: 'Fiabilité',
      description: 'Des avis fiables pour des choix éclairés',
      color: 'purple'
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-green-50 via-white to-green-50 pt-16 pb-24 overflow-hidden">
      {/* Motifs de fond */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full transform translate-x-48 -translate-y-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100 rounded-full transform -translate-x-48 translate-y-48 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Partie gauche: Texte et CTA */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 
              className={`text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 transition-all duration-700 transform ${
                showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              Des avis <span className="text-green-600 relative">
                fiables
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8">
                  <path d="M0 7 Q25 0 50 7 T100 7" stroke="#4CAF50" strokeWidth="2" fill="none" />
                </svg>
              </span> sur vos produits du quotidien
            </h1>
            
            <p 
              className={`text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 transition-all duration-700 delay-300 transform ${
                showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              Scannez, découvrez, partagez. <span className="font-semibold text-green-600">Fydo</span> révolutionne la façon dont vous choisissez vos produits alimentaires et cosmétiques grâce à une communauté d'avis vérifiés.
            </p>
            
            <div 
              className={`flex flex-wrap gap-4 justify-center lg:justify-start transition-all duration-700 delay-500 transform ${
                showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <Link 
                to="/recherche-filtre" 
                className="group bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Sparkles className="mr-2" size={20} />
                Essayer maintenant 
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
              
              <a 
                href="#telecharger" 
                className="bg-white hover:bg-gray-50 text-green-600 font-bold py-4 px-8 rounded-full transition-all duration-300 border-2 border-green-600 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                Télécharger l'app
              </a>
            </div>
            
            {/* Stats de confiance */}
            <div 
              className={`mt-12 flex items-center gap-8 justify-center lg:justify-start transition-all duration-700 delay-700 ${
                showButtons ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">10K+</div>
                <div className="text-sm text-gray-600">Utilisateurs actifs</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">50K+</div>
                <div className="text-sm text-gray-600">Avis vérifiés</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">100%</div>
                <div className="text-sm text-gray-600">Authentique</div>
              </div>
            </div>
          </div>
          
          {/* Partie droite: Illustration */}
          <div 
            className={`lg:w-1/2 transition-all duration-1000 delay-700 transform ${
              showScanCard ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'
            }`}
          >
            <div 
              className="relative max-w-xl mx-auto cursor-pointer"
              onMouseEnter={() => setHoverScan(true)}
              onMouseLeave={() => setHoverScan(false)}
            >
              <HeroIllustration />
              
              {/* CTA flottant */}
              <Link 
                to="/recherche-filtre"
                className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full font-medium shadow-lg transition-all duration-300 flex items-center gap-2 ${
                  hoverScan ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <Scan size={18} />
                Essayer le scan
              </Link>
            </div>
          </div>
        </div>
        
        {/* Cartes de caractéristiques avec animations */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 transition-all duration-1000 delay-1000 transform ${
            showFeatureCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          {features.map((feature, index) => (
            <div 
              key={feature.id}
              className={`relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-gray-100 overflow-hidden ${
                activeFeature === index ? 'ring-2 ring-green-500' : ''
              }`}
              style={{ transitionDelay: `${1000 + (index * 150)}ms` }}
            >
              {/* Motif de fond */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${
                feature.color === 'green' ? 'from-green-50 to-green-100' :
                feature.color === 'amber' ? 'from-amber-50 to-amber-100' :
                feature.color === 'sky' ? 'from-sky-50 to-sky-100' :
                'from-purple-50 to-purple-100'
              } rounded-full transform translate-x-16 -translate-y-16 opacity-50`}></div>
              
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                  feature.color === 'green' ? 'from-green-100 to-green-200' :
                  feature.color === 'amber' ? 'from-amber-100 to-amber-200' :
                  feature.color === 'sky' ? 'from-sky-100 to-sky-200' :
                  'from-purple-100 to-purple-200'
                } flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
                
                {/* Indicateur actif */}
                {activeFeature === index && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 animate-pulse"></div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Badge de confiance */}
        <div className="flex items-center justify-center mt-12 gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-green-600" />
            <span>100% sécurisé</span>
          </div>
          <div className="flex items-center gap-2">
            <Receipt size={16} className="text-green-600" />
            <span>Avis vérifiés par ticket</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-amber-500" />
            <span>App n°1 en France</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;