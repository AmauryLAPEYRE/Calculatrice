// src/components/Concept.js
import React, { useState, useEffect } from 'react';
import { Camera, Star, ShoppingBag, Coffee, Shield, Check, ChevronRight, Sparkles, Receipt, Users, TrendingUp } from 'lucide-react';

const Concept = () => {
  const [activeSection, setActiveSection] = useState(1);
  const [animationDone, setAnimationDone] = useState(false);
  const [hoveredStep, setHoveredStep] = useState(null);

  // Déclencher l'animation initiale
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationDone(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const nextSection = () => {
    if (activeSection < 4) {
      setActiveSection(activeSection + 1);
    } else {
      setActiveSection(1);
    }
  };

  // Illustration moderne pour le concept
  const ConceptIllustration = () => (
    <svg viewBox="0 0 400 300" className="w-full h-auto">
      <defs>
        <linearGradient id="conceptGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#81C784', stopOpacity:1}}>
            <animate attributeName="stop-color" values="#81C784;#66BB6A;#81C784" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" style={{stopColor:'#4CAF50', stopOpacity:1}}>
            <animate attributeName="stop-color" values="#4CAF50;#43A047;#4CAF50" dur="4s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
        <linearGradient id="conceptGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#FFD54F', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#FFA726', stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Cercle central avec effet de pulsation */}
      <g transform="translate(200, 150)">
        <circle cx="0" cy="0" r="80" fill="white" stroke="url(#conceptGrad1)" strokeWidth="3" opacity="0.9" />
        <circle cx="0" cy="0" r="60" fill="none" stroke="#66BB6A" strokeWidth="2" opacity="0.5" />
        <circle cx="0" cy="0" r="40" fill="none" stroke="#81C784" strokeWidth="1" opacity="0.3" />
        
        {/* Logo Fydo au centre */}
        <text x="0" y="-5" textAnchor="middle" fill="#4CAF50" fontSize="24" fontWeight="bold">Fydo</text>
        <path d="M0,5 L5,15 L15,15 L7,20 L10,30 L0,23 L-10,30 L-7,20 L-15,15 L-5,15 Z" 
              fill="url(#conceptGrad2)" transform="scale(0.8)" />
        
        {/* Animation de pulsation */}
        <circle cx="0" cy="0" r="80" fill="none" stroke="#4CAF50" strokeWidth="2" opacity="0">
          <animate attributeName="r" values="80;120;80" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Éléments orbitaux */}
      <g>
        {/* Scanner */}
        <g transform="translate(120, 80)">
          <circle cx="0" cy="0" r="30" fill="white" stroke="#4CAF50" strokeWidth="2" />
          <path d="M-10,-10 L-10,-5 M-10,-10 L-5,-10 M10,-10 L5,-10 M10,-10 L10,-5 M-10,10 L-10,5 M-10,10 L-5,10 M10,10 L10,5 M10,10 L5,10"
                stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round" />
          <animateTransform attributeName="transform" type="rotate" from="0 200 150" to="360 200 150" dur="20s" repeatCount="indefinite" />
        </g>
        
        {/* Étoiles */}
        <g transform="translate(280, 80)">
          <circle cx="0" cy="0" r="30" fill="white" stroke="#FFD700" strokeWidth="2" />
          <path d="M0,-12 L3,-4 L12,-4 L5,2 L8,10 L0,5 L-8,10 L-5,2 L-12,-4 L-3,-4 Z" 
                fill="#FFD700" />
          <animateTransform attributeName="transform" type="rotate" from="0 200 150" to="360 200 150" dur="20s" repeatCount="indefinite" />
        </g>
        
        {/* Ticket */}
        <g transform="translate(280, 220)">
          <circle cx="0" cy="0" r="30" fill="white" stroke="#66BB6A" strokeWidth="2" />
          <path d="M-10,-12 L10,-12 L10,12 L5,14 L0,12 L-5,14 L-10,12 Z" 
                fill="#E8F5E9" stroke="#66BB6A" strokeWidth="1" />
          <line x1="-7" y1="-8" x2="7" y2="-8" stroke="#66BB6A" strokeWidth="1" />
          <line x1="-7" y1="-4" x2="7" y2="-4" stroke="#66BB6A" strokeWidth="1" />
          <line x1="-7" y1="0" x2="7" y2="0" stroke="#66BB6A" strokeWidth="1" />
          <animateTransform attributeName="transform" type="rotate" from="0 200 150" to="360 200 150" dur="20s" repeatCount="indefinite" />
        </g>
        
        {/* Produits */}
        <g transform="translate(120, 220)">
          <circle cx="0" cy="0" r="30" fill="white" stroke="#CE93D8" strokeWidth="2" />
          <rect x="-8" y="-10" width="16" height="20" rx="2" fill="#E1BEE7" />
          <circle cx="0" cy="-2" r="6" fill="#CE93D8" />
          <animateTransform attributeName="transform" type="rotate" from="0 200 150" to="360 200 150" dur="20s" repeatCount="indefinite" />
        </g>
      </g>
      
      {/* Lignes de connexion animées */}
      <g opacity="0.3">
        <line x1="200" y1="150" x2="120" y2="80" stroke="#4CAF50" strokeWidth="1" strokeDasharray="5 5">
          <animate attributeName="stroke-dashoffset" from="0" to="10" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="200" y1="150" x2="280" y2="80" stroke="#FFD700" strokeWidth="1" strokeDasharray="5 5">
          <animate attributeName="stroke-dashoffset" from="0" to="10" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="200" y1="150" x2="280" y2="220" stroke="#66BB6A" strokeWidth="1" strokeDasharray="5 5">
          <animate attributeName="stroke-dashoffset" from="0" to="10" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="200" y1="150" x2="120" y2="220" stroke="#CE93D8" strokeWidth="1" strokeDasharray="5 5">
          <animate attributeName="stroke-dashoffset" from="0" to="10" dur="2s" repeatCount="indefinite" />
        </line>
      </g>
      
      {/* Particules flottantes */}
      <g opacity="0.6">
        <circle cx="80" cy="120" r="2" fill="#81C784">
          <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="320" cy="120" r="3" fill="#FFD700">
          <animate attributeName="r" values="3;5;3" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="50" r="2" fill="#CE93D8">
          <animate attributeName="r" values="2;3;2" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="250" r="3" fill="#66BB6A">
          <animate attributeName="r" values="3;4;3" dur="4s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );

  const conceptSteps = [
    {
      id: 1,
      icon: <Camera size={32} className="text-green-600" />,
      title: "Sélection par Scan",
      description: "Scannez simplement le code-barres du produit pour accéder instantanément à ses informations.",
      color: "green"
    },
    {
      id: 2,
      icon: <Star size={32} className="text-amber-500 fill-amber-500" />,
      title: "Avis Utilisateurs",
      description: "Consultez les évaluations sur 5 étoiles et les commentaires des utilisateurs réels.",
      color: "amber"
    },
    {
      id: 3,
      icon: <Receipt size={32} className="text-green-600" />,
      title: "Preuve d'Achat",
      description: "Garantie de fiabilité: les avis sont vérifiés par tickets de caisse pour plus d'authenticité.",
      color: "green"
    },
    {
      id: 4,
      icon: <Coffee size={32} className="text-purple-600" />,
      title: "Produits Ciblés",
      description: "Spécialisé dans les produits alimentaires et cosmétiques pour des choix éclairés au quotidien.",
      color: "purple"
    }
  ];

  const detailedExplanations = {
    1: "Grâce à la technologie de reconnaissance optique, FYDO identifie instantanément le produit scanné. Il suffit de pointer la caméra de votre téléphone vers le code-barres, et en quelques secondes vous accédez à toutes les informations et avis sur ce produit.",
    2: "Contrairement à de nombreuses plateformes, FYDO assure que chaque avis provient d'un utilisateur ayant réellement acheté le produit. Notre système de notation sur 5 étoiles permet d'évaluer rapidement la satisfaction globale, complétée par des commentaires détaillés.",
    3: "Pour donner votre avis, il vous suffit de prendre en photo votre ticket de caisse. Notre système vérifie automatiquement la présence du produit sur le ticket, garantissant ainsi que tous les avis proviennent d'acheteurs réels.",
    4: "FYDO se concentre sur deux catégories essentielles de votre quotidien : les produits alimentaires (aliments, boissons, compléments) et les produits cosmétiques (soins, maquillage, parfums). Notre base de données s'enrichit chaque jour grâce à la contribution des utilisateurs."
  };

  return (
    <section id="concept" className="py-20 bg-white relative overflow-hidden">
      {/* Motifs de fond subtils */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full transform translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200 rounded-full transform -translate-x-48 translate-y-48"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-14 transition-all duration-700 transform ${animationDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Notre <span className="text-green-600">Concept</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Une approche innovante pour révolutionner vos choix de produits au quotidien avec des avis authentiques et vérifiés
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Illustration à gauche */}
          <div className={`transition-all duration-700 transform ${animationDone ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <ConceptIllustration />
          </div>
          
          {/* Étapes à droite */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {conceptSteps.map((step, index) => (
              <div 
                key={step.id}
                className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-500 hover:shadow-xl transform hover:scale-[1.02] ${
                  activeSection === step.id 
                    ? 'ring-2 ring-green-500' 
                    : 'border border-gray-100'
                } ${animationDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                onClick={() => setActiveSection(step.id)}
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
                style={{ transitionDelay: `${animationDone ? 0 : 300 + index * 100}ms` }}
              >
                <div className={`rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto transition-all duration-300 bg-gradient-to-br ${
                  step.color === 'green' ? 'from-green-100 to-green-200' :
                  step.color === 'amber' ? 'from-amber-100 to-amber-200' :
                  'from-purple-100 to-purple-200'
                } ${hoveredStep === step.id ? 'scale-110' : ''}`}>
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-center mb-2 text-gray-800">
                  {step.title}
                </h3>
                <p className="text-center text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Explication détaillée */}
        <div 
          className={`bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto transition-all duration-700 transform ${
            animationDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
          style={{ transitionDelay: `${animationDone ? 0 : 800}ms` }}
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mr-4">
              {conceptSteps[activeSection-1].icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {conceptSteps[activeSection-1].title}
            </h3>
          </div>
          
          <p className="text-gray-700 mb-6">
            {detailedExplanations[activeSection]}
          </p>
          
          <div className="flex flex-col sm:flex-row sm:justify-between items-center">
            <div className="flex mb-4 sm:mb-0">
              {[1, 2, 3, 4].map((num) => (
                <button 
                  key={num}
                  onClick={() => setActiveSection(num)}
                  className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
                    activeSection === num ? 'bg-green-500 w-8' : 'bg-gray-300'
                  }`}
                  aria-label={`Étape ${num}`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextSection}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 flex items-center shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Étape suivante
              <ChevronRight size={18} className="ml-2" />
            </button>
          </div>
        </div>
        
        {/* Pourquoi choisir Fydo */}
        <div className={`mt-20 transition-all duration-700 transform ${animationDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ transitionDelay: `${animationDone ? 0 : 1000}ms` }}>
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Pourquoi choisir <span className="text-green-600">FYDO</span> ?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield size={24} className="text-green-600" />,
                title: "Avis fiables",
                description: "Tous les avis sont vérifiés par preuve d'achat pour une fiabilité maximale.",
                color: "green"
              },
              {
                icon: <Sparkles size={24} className="text-amber-500" />,
                title: "Simple et rapide",
                description: "Scannez et obtenez toutes les informations en quelques secondes.",
                color: "amber"
              },
              {
                icon: <Users size={24} className="text-sky-600" />,
                title: "Communauté active",
                description: "Rejoignez des milliers d'utilisateurs qui partagent leurs expériences.",
                color: "sky"
              },
              {
                icon: <TrendingUp size={24} className="text-purple-600" />,
                title: "Mise à jour continue",
                description: "Notre base de données s'enrichit chaque jour de nouveaux produits.",
                color: "purple"
              }
            ].map((feature, index) => (
              <FeatureCard 
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Composant de carte de fonctionnalité
const FeatureCard = ({ icon, title, description, color, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1200 + delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${isHovered ? 'scale-[1.02]' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Motif de fond */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${
        color === 'green' ? 'from-green-50 to-green-100' :
        color === 'amber' ? 'from-amber-50 to-amber-100' :
        color === 'sky' ? 'from-sky-50 to-sky-100' :
        'from-purple-50 to-purple-100'
      } rounded-full transform translate-x-12 -translate-y-12 opacity-50`}></div>
      
      <div className="relative z-10">
        <div className={`flex items-center mb-4 ${isHovered ? 'scale-110' : ''} transition-transform duration-300`}>
          {icon}
        </div>
        <h3 className="font-bold text-lg text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Concept;