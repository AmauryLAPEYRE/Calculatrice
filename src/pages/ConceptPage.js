// src/pages/ConceptPage.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { 
  Lightbulb, 
  Target, 
  Users, 
  Shield, 
  Check, 
  Camera, 
  Star, 
  MessageSquare, 
  ShoppingBag,
  ChevronRight,
  Heart,
  Award,
  Scan,
  Crown,
  Coffee,
  Smartphone,
  Globe,
  TrendingUp,
  Eye,
  Zap,
  Sparkles,
  Receipt
} from 'lucide-react';

const ConceptPage = () => {
  const [activeSection, setActiveSection] = useState('mission');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Déclencher les animations au chargement
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Sections principales du concept avec couleurs cohérentes
  const conceptSections = [
    {
      id: 'mission',
      icon: <Target size={32} />,
      title: "Notre Mission",
      subtitle: "Révolutionner vos choix",
      description: "Permettre aux consommateurs de partager leurs retours d'expérience authentiques sur les produits du quotidien.",
      color: "emerald"
    },
    {
      id: 'how-it-works',
      icon: <Lightbulb size={32} />,
      title: "Comment ça fonctionne",
      subtitle: "Simple et efficace",
      description: "Un processus en 3 étapes pour découvrir, évaluer et partager vos expériences produits.",
      color: "amber"
    },
    {
      id: 'community',
      icon: <Users size={32} />,
      title: "Communauté",
      subtitle: "100% authentique",
      description: "Une communauté collaborative où chaque membre contribue à améliorer l'expérience collective.",
      color: "sky"
    },
    {
      id: 'products',
      icon: <ShoppingBag size={32} />,
      title: "Produits ciblés",
      subtitle: "L'essentiel du quotidien",
      description: "Focus sur les deux catégories essentielles de votre quotidien avec des données précises.",
      color: "purple"
    }
  ];

  // Illustration moderne pour la mission
  const MissionIllustration = () => (
    <svg viewBox="0 0 400 300" className="w-full h-auto">
      <defs>
        <linearGradient id="missionGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#81C784', stopOpacity:1}}>
            <animate attributeName="stop-color" values="#81C784;#4CAF50;#81C784" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" style={{stopColor:'#4CAF50', stopOpacity:1}}>
            <animate attributeName="stop-color" values="#4CAF50;#81C784;#4CAF50" dur="4s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
        <radialGradient id="glowEffect">
          <stop offset="0%" style={{stopColor:'#ffffff', stopOpacity:0.8}} />
          <stop offset="100%" style={{stopColor:'#E8F5E9', stopOpacity:0.2}} />
        </radialGradient>
      </defs>
      
      {/* Blob de fond animé */}
      <path d="M200,50 Q300,80 320,150 Q340,220 250,250 Q160,280 80,240 Q0,200 20,130 Q40,60 120,40 Q160,30 200,50Z" 
            fill="url(#missionGrad1)" opacity="0.2">
        <animate attributeName="d" 
                 values="M200,50 Q300,80 320,150 Q340,220 250,250 Q160,280 80,240 Q0,200 20,130 Q40,60 120,40 Q160,30 200,50Z;
                         M200,40 Q320,70 340,140 Q360,210 270,240 Q180,270 100,230 Q20,190 40,120 Q60,50 140,30 Q180,20 200,40Z;
                         M200,50 Q300,80 320,150 Q340,220 250,250 Q160,280 80,240 Q0,200 20,130 Q40,60 120,40 Q160,30 200,50Z"
                 dur="8s" repeatCount="indefinite" />
      </path>
      
      {/* Cible principale */}
      <g transform="translate(200, 150)">
        <circle cx="0" cy="0" r="80" fill="white" stroke="#4CAF50" strokeWidth="4" opacity="0.9" />
        <circle cx="0" cy="0" r="60" fill="none" stroke="#66BB6A" strokeWidth="3" opacity="0.7" />
        <circle cx="0" cy="0" r="40" fill="none" stroke="#81C784" strokeWidth="2" opacity="0.5" />
        <circle cx="0" cy="0" r="20" fill="url(#missionGrad1)" />
        
        {/* Flèche au centre */}
        <path d="M0,-15 L0,15 M-10,5 L0,15 L10,5" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Animation de pulsation */}
        <circle cx="0" cy="0" r="20" fill="none" stroke="#4CAF50" strokeWidth="2" opacity="0">
          <animate attributeName="r" values="20;100;20" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Particules flottantes */}
      <g opacity="0.6">
        <circle cx="80" cy="80" r="3" fill="#81C784">
          <animate attributeName="cy" values="80;70;80" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="320" cy="100" r="4" fill="#4CAF50">
          <animate attributeName="cy" values="100;90;100" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="300" cy="220" r="3" fill="#66BB6A">
          <animate attributeName="cy" values="220;210;220" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="200" r="2.5" fill="#81C784">
          <animate attributeName="cy" values="200;190;200" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Icônes flottantes autour */}
      <g opacity="0.7">
        {/* Étoile */}
        <g transform="translate(100, 100)">
          <path d="M0,-10 L3,-3 L10,-0 L3,3 L0,10 L-3,3 L-10,0 L-3,-3 Z" fill="#FFD700" />
          <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite" />
        </g>
        {/* Coeur */}
        <g transform="translate(300, 80)">
          <path d="M0,5 C0,-5 -10,-10 -10,-2 C-10,3 -5,8 0,12 C5,8 10,3 10,-2 C10,-10 0,-5 0,5 Z" fill="#FF6B6B" />
          <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="2s" repeatCount="indefinite" additive="sum" />
        </g>
      </g>
    </svg>
  );

  // Illustration du processus
  const ProcessIllustration = ({ step }) => {
    const illustrations = {
      1: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="scanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#4CAF50', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#2E7D32', stopOpacity:1}} />
            </linearGradient>
          </defs>
          
          {/* Smartphone */}
          <rect x="60" y="40" width="80" height="120" rx="10" fill="#333" />
          <rect x="65" y="45" width="70" height="110" rx="8" fill="white" />
          
          {/* Écran de scan */}
          <rect x="70" y="60" width="60" height="60" fill="none" stroke="url(#scanGrad)" strokeWidth="3" strokeDasharray="5 5">
            <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
          </rect>
          
          {/* Ligne de scan animée */}
          <line x1="70" y1="90" x2="130" y2="90" stroke="#4CAF50" strokeWidth="2" opacity="0.8">
            <animate attributeName="y1" values="60;120;60" dur="3s" repeatCount="indefinite" />
            <animate attributeName="y2" values="60;120;60" dur="3s" repeatCount="indefinite" />
          </line>
          
          {/* Code-barres */}
          <g transform="translate(100, 90)">
            <rect x="-20" y="-10" width="3" height="20" fill="#333" />
            <rect x="-15" y="-10" width="2" height="20" fill="#333" />
            <rect x="-11" y="-10" width="4" height="20" fill="#333" />
            <rect x="-5" y="-10" width="2" height="20" fill="#333" />
            <rect x="-1" y="-10" width="3" height="20" fill="#333" />
            <rect x="4" y="-10" width="2" height="20" fill="#333" />
            <rect x="8" y="-10" width="4" height="20" fill="#333" />
            <rect x="14" y="-10" width="2" height="20" fill="#333" />
            <rect x="18" y="-10" width="2" height="20" fill="#333" />
          </g>
          
          {/* Flash effect */}
          <circle cx="100" cy="90" r="0" fill="white" opacity="0">
            <animate attributeName="r" values="0;40;0" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.5;0" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>
      ),
      2: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#FFD700', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#FFA000', stopOpacity:1}} />
            </linearGradient>
          </defs>
          
          {/* Carte de produit */}
          <rect x="40" y="50" width="120" height="100" rx="10" fill="white" stroke="#E0E0E0" strokeWidth="2" />
          
          {/* Image produit placeholder */}
          <rect x="50" y="60" width="40" height="40" rx="5" fill="#E8F5E9" />
          
          {/* Étoiles de notation */}
          <g transform="translate(100, 80)">
            {[0, 20, 40].map((offset, i) => (
              <g key={i} transform={`translate(${offset - 20}, 0)`}>
                <path d="M0,-8 L2.4,-2.4 L8,-0 L2.4,2.4 L0,8 L-2.4,2.4 L-8,0 L-2.4,-2.4 Z" 
                      fill="url(#starGrad)">
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
          
          {/* Barres de stats */}
          <g transform="translate(50, 110)">
            <rect x="0" y="0" width="100" height="6" rx="3" fill="#E0E0E0" />
            <rect x="0" y="0" width="0" height="6" rx="3" fill="#4CAF50">
              <animate attributeName="width" values="0;80;0" dur="4s" repeatCount="indefinite" />
            </rect>
            
            <rect x="0" y="10" width="100" height="6" rx="3" fill="#E0E0E0" />
            <rect x="0" y="10" width="0" height="6" rx="3" fill="#2196F3">
              <animate attributeName="width" values="0;90;0" dur="4s" begin="0.5s" repeatCount="indefinite" />
            </rect>
            
            <rect x="0" y="20" width="100" height="6" rx="3" fill="#E0E0E0" />
            <rect x="0" y="20" width="0" height="6" rx="3" fill="#FF6B6B">
              <animate attributeName="width" values="0;70;0" dur="4s" begin="1s" repeatCount="indefinite" />
            </rect>
          </g>
          
          {/* Particules de célébration */}
          <g opacity="0.7">
            <circle cx="30" cy="30" r="2" fill="#FFD700">
              <animate attributeName="cy" values="30;20;30" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="170" cy="40" r="3" fill="#4CAF50">
              <animate attributeName="cy" values="40;30;40" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
      ),
      3: (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="uploadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#66BB6A', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#43A047', stopOpacity:1}} />
            </linearGradient>
          </defs>
          
          {/* Ticket de caisse */}
          <g transform="translate(100, 100)">
            <path d="M-40,-60 L40,-60 L40,60 L30,65 L20,60 L10,65 L0,60 L-10,65 L-20,60 L-30,65 L-40,60 Z" 
                  fill="white" stroke="#E0E0E0" strokeWidth="2" />
            
            {/* Lignes du ticket */}
            <line x1="-30" y1="-40" x2="30" y2="-40" stroke="#E0E0E0" strokeWidth="1" />
            <line x1="-30" y1="-25" x2="30" y2="-25" stroke="#E0E0E0" strokeWidth="1" />
            <line x1="-30" y1="-10" x2="30" y2="-10" stroke="#E0E0E0" strokeWidth="1" />
            <line x1="-30" y1="5" x2="30" y2="5" stroke="#E0E0E0" strokeWidth="1" />
            <line x1="-30" y1="20" x2="30" y2="20" stroke="#E0E0E0" strokeWidth="1" />
            
            {/* Check mark */}
            <circle cx="0" cy="40" r="15" fill="url(#uploadGrad)" />
            <path d="M-7,40 L-2,45 L7,35" stroke="white" strokeWidth="3" fill="none" 
                  strokeLinecap="round" strokeLinejoin="round" />
          </g>
          
          {/* Flèche d'upload */}
          <g transform="translate(100, 50)" opacity="0.8">
            <path d="M0,0 L0,-20 M-10,-10 L0,-20 L10,-10" 
                  stroke="url(#uploadGrad)" strokeWidth="3" 
                  fill="none" strokeLinecap="round" strokeLinejoin="round">
              <animateTransform attributeName="transform" type="translate" 
                                values="0,0; 0,-10; 0,0" dur="2s" repeatCount="indefinite" />
            </path>
          </g>
          
          {/* Particules montantes */}
          <g opacity="0.6">
            <circle cx="70" cy="150" r="2" fill="#66BB6A">
              <animate attributeName="cy" values="150;50;150" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="130" cy="150" r="3" fill="#43A047">
              <animate attributeName="cy" values="150;50;150" dur="3s" begin="1s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur="3s" begin="1s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
      )
    };
    
    return illustrations[step] || illustrations[1];
  };

  // Illustration de la communauté
  const CommunityIllustration = () => (
    <svg viewBox="0 0 400 300" className="w-full h-auto">
      <defs>
        <linearGradient id="communityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#42A5F5', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#1E88E5', stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Connexions réseau */}
      <g opacity="0.3">
        <line x1="100" y1="100" x2="200" y2="80" stroke="#42A5F5" strokeWidth="2" />
        <line x1="200" y1="80" x2="300" y2="120" stroke="#42A5F5" strokeWidth="2" />
        <line x1="200" y1="80" x2="250" y2="180" stroke="#42A5F5" strokeWidth="2" />
        <line x1="100" y1="100" x2="150" y2="200" stroke="#42A5F5" strokeWidth="2" />
        <line x1="300" y1="120" x2="250" y2="180" stroke="#42A5F5" strokeWidth="2" />
        <line x1="150" y1="200" x2="250" y2="180" stroke="#42A5F5" strokeWidth="2" />
      </g>
      
      {/* Utilisateurs */}
      <g>
        {/* Utilisateur central */}
        <g transform="translate(200, 80)">
          <circle cx="0" cy="0" r="25" fill="url(#communityGrad)" />
          <circle cx="0" cy="-5" r="8" fill="white" />
          <path d="M-10,5 Q0,15 10,5" fill="white" />
          <circle cx="0" cy="0" r="25" fill="none" stroke="#42A5F5" strokeWidth="2" opacity="0">
            <animate attributeName="r" values="25;35;25" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>
        
        {/* Autres utilisateurs */}
        <g transform="translate(100, 100)">
          <circle cx="0" cy="0" r="20" fill="#81C784" />
          <circle cx="0" cy="-3" r="6" fill="white" />
          <path d="M-8,3 Q0,10 8,3" fill="white" />
        </g>
        
        <g transform="translate(300, 120)">
          <circle cx="0" cy="0" r="20" fill="#FFB74D" />
          <circle cx="0" cy="-3" r="6" fill="white" />
          <path d="M-8,3 Q0,10 8,3" fill="white" />
        </g>
        
        <g transform="translate(150, 200)">
          <circle cx="0" cy="0" r="20" fill="#CE93D8" />
          <circle cx="0" cy="-3" r="6" fill="white" />
          <path d="M-8,3 Q0,10 8,3" fill="white" />
        </g>
        
        <g transform="translate(250, 180)">
          <circle cx="0" cy="0" r="20" fill="#FF6B6B" />
          <circle cx="0" cy="-3" r="6" fill="white" />
          <path d="M-8,3 Q0,10 8,3" fill="white" />
        </g>
      </g>
      
      {/* Messages flottants */}
      <g opacity="0.8">
        <g transform="translate(120, 70)">
          <rect x="-20" y="-10" width="40" height="20" rx="10" fill="white" stroke="#E0E0E0" />
          <circle cx="-10" cy="0" r="2" fill="#4CAF50" />
          <circle cx="0" cy="0" r="2" fill="#4CAF50" />
          <circle cx="10" cy="0" r="2" fill="#4CAF50" />
          <animateTransform attributeName="transform" type="translate" 
                            values="120,70; 120,60; 120,70" dur="3s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(280, 90)">
          <rect x="-15" y="-10" width="30" height="20" rx="10" fill="white" stroke="#E0E0E0" />
          <path d="M-8,0 L-3,5 L8,-5" stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round" />
          <animateTransform attributeName="transform" type="translate" 
                            values="280,90; 280,80; 280,90" dur="3.5s" repeatCount="indefinite" />
        </g>
      </g>
      
      {/* Badges de statut */}
      <g>
        <g transform="translate(200, 40)">
          <path d="M0,-10 L3,-3 L10,-0 L3,3 L0,10 L-3,3 L-10,0 L-3,-3 Z" fill="#FFD700" />
          <animateTransform attributeName="transform" type="rotate" 
                            from="0 200 40" to="360 200 40" dur="10s" repeatCount="indefinite" />
        </g>
      </g>
    </svg>
  );

  // Illustration des produits
  const ProductsIllustration = () => (
    <svg viewBox="0 0 400 300" className="w-full h-auto">
      <defs>
        <linearGradient id="foodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#C8E6C9', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#81C784', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="cosmeticGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#E1BEE7', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#CE93D8', stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Produits alimentaires */}
      <g transform="translate(120, 150)">
        {/* Boîte de céréales */}
        <rect x="-40" y="-60" width="80" height="100" rx="5" fill="url(#foodGrad)" />
        <rect x="-30" y="-40" width="60" height="60" rx="5" fill="white" opacity="0.3" />
        <circle cx="0" cy="-10" r="20" fill="#FFE082" opacity="0.8" />
        
        {/* Animation de rotation */}
        <animateTransform attributeName="transform" type="rotate" 
                          from="0 120 150" to="5 120 150" dur="3s" 
                          repeatCount="indefinite" autoreverseautoReverse="true" />
      </g>
      
      {/* Produits cosmétiques */}
      <g transform="translate(280, 150)">
        {/* Flacon */}
        <ellipse cx="0" cy="0" rx="30" ry="50" fill="url(#cosmeticGrad)" />
        <ellipse cx="0" cy="-40" rx="15" ry="10" fill="#BA68C8" />
        <circle cx="0" cy="-50" r="8" fill="#9C27B0" />
        
        {/* Reflet */}
        <ellipse cx="-10" cy="-10" rx="10" ry="25" fill="white" opacity="0.3" />
        
        {/* Animation de flottement */}
        <animateTransform attributeName="transform" type="translate" 
                          values="280,150; 280,140; 280,150" dur="4s" 
                          repeatCount="indefinite" />
      </g>
      
      {/* Particules décoratives */}
      <g opacity="0.6">
        <circle cx="80" cy="80" r="3" fill="#81C784">
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="320" cy="100" r="4" fill="#CE93D8">
          <animate attributeName="r" values="4;6;4" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="250" r="3" fill="#FFE082">
          <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Étiquettes flottantes */}
      <g opacity="0.8">
        <g transform="translate(200, 80)">
          <rect x="-30" y="-15" width="60" height="30" rx="15" fill="white" stroke="#4CAF50" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#4CAF50" fontSize="14" fontWeight="bold">BIO</text>
          <animateTransform attributeName="transform" type="translate" 
                            values="200,80; 200,70; 200,80" dur="3s" repeatCount="indefinite" />
        </g>
      </g>
    </svg>
  );

  // Étapes du processus
  const processSteps = [
    {
      number: 1,
      icon: <Scan size={40} className="text-white" />,
      title: "Scannez",
      description: "Utilisez la caméra de votre smartphone pour scanner le code-barres d'un produit alimentaire ou cosmétique.",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      benefit: "Identification instantanée"
    },
    {
      number: 2,
      icon: <Eye size={40} className="text-white" />,
      title: "Découvrez",
      description: "Consultez les avis vérifiés des autres utilisateurs et la note moyenne détaillée.",
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
      benefit: "Avis 100% vérifiés"
    },
    {
      number: 3,
      icon: <MessageSquare size={40} className="text-white" />,
      title: "Partagez",
      description: "Donnez votre propre avis après achat en téléchargeant une photo de votre ticket de caisse comme preuve.",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      benefit: "Contribution authentique"
    }
  ];

  // Niveaux de la communauté
  const communityLevels = [
    {
      level: "Bronze",
      color: "amber",
      icon: <Star className="text-amber-600 fill-amber-600" size={24} />,
      description: "Niveau débutant pour les nouveaux membres qui commencent à partager leurs avis.",
      badge: "bg-gradient-to-br from-amber-100 to-amber-200 border-amber-300"
    },
    {
      level: "Argent",
      color: "gray",
      icon: <Star className="text-gray-500 fill-gray-500" size={24} />,
      description: "Contributeurs actifs avec des avis réguliers et appréciés par la communauté.",
      badge: "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300"
    },
    {
      level: "Or",
      color: "yellow",
      icon: <Star className="text-yellow-600 fill-yellow-500" size={24} />,
      description: "Membres expérimentés reconnus pour la qualité et la pertinence de leurs contributions.",
      badge: "bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300"
    },
    {
      level: "Diamant",
      color: "blue",
      icon: <Crown className="text-blue-600 fill-blue-600" size={24} />,
      description: "Experts et contributeurs d'élite dont les avis sont particulièrement valorisés.",
      badge: "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300"
    }
  ];

  // Catégories de produits
  const productCategories = [
    {
      title: "Produits alimentaires",
      icon: <Coffee size={32} className="text-green-600" />,
      items: [
        "Aliments préparés et transformés",
        "Boissons et produits laitiers", 
        "Snacks et confiseries",
        "Compléments alimentaires"
      ],
      color: "green"
    },
    {
      title: "Produits cosmétiques", 
      icon: <Sparkles size={32} className="text-purple-600" />,
      items: [
        "Soins de la peau et du corps",
        "Maquillage et produits de beauté",
        "Parfums et eaux de toilette", 
        "Produits d'hygiène personnelle"
      ],
      color: "purple"
    }
  ];

  // Avantages clés
  const keyAdvantages = [
    {
      icon: <Shield size={24} />,
      title: "Avis fiables",
      description: "Tous les avis sont vérifiés par preuve d'achat pour une fiabilité maximale",
      color: "emerald"
    },
    {
      icon: <Zap size={24} />,
      title: "Simple et rapide", 
      description: "Scannez et obtenez toutes les informations en quelques secondes",
      color: "amber"
    },
    {
      icon: <Users size={24} />,
      title: "Communauté active",
      description: "Rejoignez des milliers d'utilisateurs qui partagent leurs expériences",
      color: "sky"
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Mise à jour continue",
      description: "Notre base de données s'enrichit chaque jour de nouveaux produits",
      color: "purple"
    }
  ];

  return (
    <section className="py-20 bg-green-50 min-h-screen">
      <Helmet>
        <title>Notre Concept | Fydo - La Révolution des Avis Produits Vérifiés</title>
        <meta name="description" content="Découvrez comment Fydo révolutionne vos choix de produits grâce à une communauté d'avis 100% vérifiés par ticket de caisse." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-green-600">
              <li><Link to="/" className="hover:text-green-800 transition-colors">Accueil</Link></li>
              <li><ChevronRight size={16} /></li>
              <li className="text-green-800 font-medium">Notre Concept</li>
            </ol>
          </nav>

          {/* Header Section avec animation */}
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
              La Révolution des <span className="text-green-600">Avis Authentiques</span>
            </h1>
            <p className="text-xl text-green-700 max-w-3xl mx-auto">
              Une communauté qui transforme vos choix de produits grâce à des avis 100% vérifiés
            </p>
            
            {/* Trust indicators avec animations */}
            <div className="flex items-center justify-center space-x-8 opacity-80 mt-8">
              <span className="text-sm text-green-700 flex items-center group">
                <Shield size={16} className="mr-1 group-hover:scale-110 transition-transform" />
                Avis vérifiés par ticket
              </span>
              <span className="text-sm text-green-700 flex items-center group">
                <Users size={16} className="mr-1 group-hover:scale-110 transition-transform" />
                Communauté de confiance
              </span>
              <span className="text-sm text-green-700 flex items-center group">
                <Crown size={16} className="mr-1 text-amber-500 group-hover:scale-110 transition-transform" />
                100% authentique
              </span>
            </div>
          </div>

          {/* Bannière concept principal avec illustration */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16 border border-gray-100">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 p-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">
                  La Genèse de Fydo
                </h2>
                <p className="text-gray-700 mb-4">
                  Fydo est né d'un constat simple : les consommateurs n'ont que très peu d'occasions de partager leurs expériences authentiques sur les produits qu'ils achètent au quotidien.
                </p>
                <p className="text-green-700 font-medium mb-4">
                  Qui n'a jamais été déçu par un changement de recette d'un produit favori ou enchanté par une découverte qui mérite d'être partagée ?
                </p>
                <p className="text-gray-700">
                  C'est pourquoi nous avons créé Fydo, la première plateforme communautaire d'avis vérifiés par ticket de caisse.
                </p>
              </div>
              <div className="w-full md:w-1/2 p-8 bg-gradient-to-br from-green-50 to-white">
                <MissionIllustration />
              </div>
            </div>
          </div>

          {/* Navigation sections concept avec hover amélioré */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16">
            <div className="flex flex-wrap">
              {conceptSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex-1 min-w-[200px] py-6 px-4 flex flex-col items-center justify-center space-y-3 transition-all duration-300 relative overflow-hidden group ${
                    activeSection === section.id 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Effet de fond au hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    section.color === 'emerald' ? 'from-emerald-100 to-emerald-200' :
                    section.color === 'amber' ? 'from-amber-100 to-amber-200' :
                    section.color === 'sky' ? 'from-sky-100 to-sky-200' :
                    'from-purple-100 to-purple-200'
                  } opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  
                  <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                    activeSection === section.id ? 'bg-white/20' : 'bg-gray-100'
                  } group-hover:scale-110 transition-transform duration-300`}>
                    {React.cloneElement(section.icon, { 
                      className: activeSection === section.id ? 'text-white' : 'text-gray-700'
                    })}
                  </div>
                  <div className="text-center relative z-10">
                    <span className={`font-medium block ${
                      activeSection === section.id ? 'text-white' : 'text-gray-700'
                    }`}>{section.title}</span>
                    <span className={`text-xs ${
                      activeSection === section.id ? 'text-gray-300' : 'text-gray-500'
                    }`}>{section.subtitle}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contenu des sections */}
          {/* Section Mission */}
          {activeSection === 'mission' && (
            <div className="bg-white rounded-2xl p-8 shadow-xl mb-16 border border-gray-100 animate-fade-in">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mr-4">
                  <Target size={32} className="text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-800">Notre Mission</h2>
                  <p className="text-emerald-600">Révolutionner vos choix de consommation</p>
                </div>
              </div>

              <p className="text-green-800 text-lg font-medium mb-6">
                Permettre aux consommateurs de partager leurs retours d'expérience authentiques sur les produits du quotidien.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Espace d'expression authentique",
                    description: "Créer un espace où les consommateurs peuvent s'exprimer sur la qualité, le goût, le rapport qualité-prix et d'autres critères pertinents."
                  },
                  {
                    title: "Garantie d'authenticité",
                    description: "Garantir la fiabilité de chaque avis grâce à la vérification par ticket de caisse, éliminant les doutes sur leur authenticité."
                  },
                  {
                    title: "Feedback pour les marques",
                    description: "Aider les marques à comprendre les attentes réelles de leurs clients pour mieux y répondre à travers leurs produits."
                  },
                  {
                    title: "Faciliter les choix",
                    description: "Faciliter le choix des consommateurs en leur donnant accès à des retours d'expérience pertinents avant leurs achats."
                  }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start group hover:bg-gradient-to-br hover:from-emerald-50 hover:to-white p-4 rounded-lg transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                      <Check className="text-emerald-600" size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-700 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section Comment ça marche */}
          {activeSection === 'how-it-works' && (
            <div className="bg-white rounded-2xl p-8 shadow-xl mb-16 border border-gray-100 animate-fade-in">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mr-4">
                  <Lightbulb size={32} className="text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-800">Comment ça fonctionne</h2>
                  <p className="text-amber-600">Simple, rapide et fiable</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {processSteps.map((step, index) => (
                  <div key={step.number} className="text-center relative group">
                    {/* Ligne de connexion */}
                    {index < processSteps.length - 1 && (
                      <div className="hidden md:block absolute top-24 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-transparent transform -translate-x-1/2 z-0"></div>
                    )}
                    
                    <div className="relative z-10">
                      {/* Illustration du processus */}
                      <div className="w-48 h-48 mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                        <ProcessIllustration step={step.number} />
                      </div>
                      
                      <h3 className="text-xl font-bold text-green-800 mb-2">{step.title}</h3>
                      <p className="text-gray-700 mb-3">{step.description}</p>
                      <div className="inline-block bg-gradient-to-r from-green-100 to-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                        {step.benefit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-amber-50 to-white rounded-xl">
                <h3 className="text-lg font-bold text-amber-800 mb-3">Pourquoi avons-nous créé Fydo ?</h3>
                <p className="text-amber-700 mb-3">
                  Nous avons constaté que les consommateurs manquaient d'un outil fiable pour partager et consulter des avis authentiques sur les produits qu'ils achètent quotidiennement.
                </p>
                <p className="text-amber-700">
                  Avec Fydo, chaque avis est vérifié par un ticket de caisse, garantissant que les retours d'expérience proviennent de personnes ayant réellement acheté et utilisé le produit.
                </p>
              </div>
            </div>
          )}

          {/* Section Communauté */}
          {activeSection === 'community' && (
            <div className="bg-white rounded-2xl p-8 shadow-xl mb-16 border border-gray-100 animate-fade-in">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-sky-200 rounded-full flex items-center justify-center mr-4">
                  <Users size={32} className="text-sky-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-800">Communauté de confiance</h2>
                  <p className="text-sky-600">Des avis 100% authentiques</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-gray-700 mb-6">
                    Fydo est une communauté collaborative où chaque membre contribue à améliorer l'expérience collective. Notre système de statut valorise les contributeurs réguliers et fiables :
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {communityLevels.map((level) => (
                      <div 
                        key={level.level} 
                        className={`p-4 rounded-xl shadow-sm border-2 ${level.badge} transform hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
                        onMouseEnter={() => setHoveredCard(level.level)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div className="flex items-center mb-3">
                          <div className={`w-10 h-10 rounded-full ${level.badge} flex items-center justify-center mr-3`}>
                            {level.icon}
                          </div>
                          <h4 className="font-semibold text-gray-800">{level.level}</h4>
                        </div>
                        <p className={`text-sm text-gray-600 transition-all duration-300 ${
                          hoveredCard === level.level ? 'opacity-100' : 'opacity-80'
                        }`}>{level.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <CommunityIllustration />
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-sky-50 to-white rounded-xl">
                <div className="flex items-start">
                  <Globe size={24} className="text-sky-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-sky-800 mb-2">Une communauté grandissante</h3>
                    <p className="text-sky-700 text-sm">
                      Notre communauté grandit chaque jour, permettant à chacun de faire des choix plus éclairés pour sa santé et son bien-être grâce aux retours d'expérience partagés.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section Produits */}
          {activeSection === 'products' && (
            <div className="bg-white rounded-2xl p-8 shadow-xl mb-16 border border-gray-100 animate-fade-in">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mr-4">
                  <ShoppingBag size={32} className="text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-800">Produits ciblés</h2>
                  <p className="text-purple-600">Alimentaire et cosmétique</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-700 mb-8">
                    Fydo se concentre sur deux catégories essentielles qui font partie de votre quotidien :
                  </p>
                  
                  <div className="space-y-4">
                    {productCategories.map((category) => (
                      <div 
                        key={category.title} 
                        className={`bg-gradient-to-br ${
                          category.color === 'green' ? 'from-green-50 to-white' : 'from-purple-50 to-white'
                        } p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300`}
                      >
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm`}>
                            {category.icon}
                          </div>
                          <h3 className="font-semibold text-green-800">{category.title}</h3>
                        </div>
                        <ul className="space-y-3">
                          {category.items.map((item, index) => (
                            <li key={index} className="flex items-center group">
                              <ChevronRight size={16} className={`${
                                category.color === 'green' ? 'text-green-600' : 'text-purple-600'
                              } mr-2 flex-shrink-0 group-hover:translate-x-1 transition-transform`} />
                              <span className="text-gray-700 text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <ProductsIllustration />
                </div>
              </div>
            </div>
          )}

          {/* Avantages clés avec animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {keyAdvantages.map((advantage, index) => (
              <div 
                key={advantage.title}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-500 border border-gray-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${
                  advantage.color === 'emerald' ? 'from-emerald-100 to-emerald-200' :
                  advantage.color === 'amber' ? 'from-amber-100 to-amber-200' :
                  advantage.color === 'sky' ? 'from-sky-100 to-sky-200' :
                  'from-purple-100 to-purple-200'
                } rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(advantage.icon, { 
                    className: `${
                      advantage.color === 'emerald' ? 'text-emerald-600' :
                      advantage.color === 'amber' ? 'text-amber-600' :
                      advantage.color === 'sky' ? 'text-sky-600' :
                      'text-purple-600'
                    }`
                  })}
                </div>
                <h3 className="font-bold text-green-800 mb-2">{advantage.title}</h3>
                <p className="text-green-700 text-sm">{advantage.description}</p>
              </div>
            ))}
          </div>

          {/* Section CTA avec illustration moderne */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-2xl">
            {/* Motif de fond */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full transform translate-x-48 -translate-y-48"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full transform -translate-x-48 translate-y-48"></div>
            </div>
            
            <div className="relative z-10 p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Rejoignez la révolution des avis authentiques
              </h2>
              <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                Partagez vos expériences avec des milliers d'autres consommateurs et contribuez à améliorer les produits que nous utilisons tous les jours.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/signup"
                  className="bg-white hover:bg-gray-50 text-green-700 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 flex items-center"
                >
                  <Users size={20} className="mr-2" />
                  Créer un compte gratuit
                </Link>
                
                <Link
                  to="/recherche-filtre"
                  className="bg-green-800 hover:bg-green-900 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 flex items-center"
                >
                  <Scan size={20} className="mr-2" />
                  Essayer le scan
                </Link>
              </div>
              
              {/* Stats de confiance */}
              <div className="flex items-center justify-center space-x-8 mt-8 text-green-100">
                <div className="flex items-center">
                  <Shield size={20} className="mr-2" />
                  <span className="text-sm">100% vérifiés</span>
                </div>
                <div className="flex items-center">
                  <Users size={20} className="mr-2" />
                  <span className="text-sm">10K+ membres</span>
                </div>
                <div className="flex items-center">
                  <Receipt size={20} className="mr-2" />
                  <span className="text-sm">50K+ avis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions de navigation avec hover amélioré */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mt-16">
            <h3 className="text-xl font-bold text-green-800 mb-6">Découvrez aussi :</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/fonctionnalites"
                className="group relative p-6 bg-gradient-to-br from-green-50 to-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full transform translate-x-16 -translate-y-16 opacity-50"></div>
                <Smartphone size={32} className="text-green-600 mb-3 relative z-10 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-green-800 mb-2 relative z-10">Fonctionnalités</h4>
                <p className="text-green-700 text-sm relative z-10">Explorez tous les outils Fydo à votre disposition</p>
              </Link>
              
              <Link
                to="/top-produits"
                className="group relative p-6 bg-gradient-to-br from-amber-50 to-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full transform translate-x-16 -translate-y-16 opacity-50"></div>
                <Star size={32} className="text-amber-600 mb-3 relative z-10 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-amber-800 mb-2 relative z-10">Top Produits</h4>
                <p className="text-amber-700 text-sm relative z-10">Découvrez les produits les mieux notés par la communauté</p>
              </Link>
              
              <Link
                to="/recherche-filtre"
                className="group relative p-6 bg-gradient-to-br from-sky-50 to-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100 rounded-full transform translate-x-16 -translate-y-16 opacity-50"></div>
                <Scan size={32} className="text-sky-600 mb-3 relative z-10 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-sky-800 mb-2 relative z-10">Commencer</h4>
                <p className="text-sky-700 text-sm relative z-10">Scannez votre premier produit dès maintenant</p>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default ConceptPage;