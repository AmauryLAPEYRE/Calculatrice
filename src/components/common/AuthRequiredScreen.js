// src/components/common/AuthRequiredScreen.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { 
  Lock, 
  LogIn, 
  UserPlus, 
  Star, 
  Shield, 
  Heart, 
  TrendingUp,
  Sparkles,
  Award,
  Users,
  ChevronRight,
  Zap,
  Gift,
  CheckCircle
} from 'lucide-react';

const AuthRequiredScreen = ({ redirectPath = '/recherche-filtre' }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

  // Animation au chargement
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Illustration animée de verrouillage
  const LockIllustration = () => (
    <svg viewBox="0 0 400 400" className="w-full h-auto">
      <defs>
        <linearGradient id="lockGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#81C784', stopOpacity:1}}>
            <animate attributeName="stop-color" values="#81C784;#66BB6A;#81C784" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" style={{stopColor:'#4CAF50', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="lockGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#FFD54F', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#FFA726', stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Fond circulaire */}
      <circle cx="200" cy="200" r="150" fill="url(#lockGrad1)" opacity="0.1" />
      
      {/* Cadenas central */}
      <g transform="translate(200, 200)">
        {/* Corps du cadenas */}
        <rect x="-40" y="-20" width="80" height="60" rx="10" fill="white" stroke="#4CAF50" strokeWidth="3" />
        
        {/* Anse du cadenas */}
        <path d="M-30,-20 C-30,-50 -20,-60 0,-60 C20,-60 30,-50 30,-20" 
              fill="none" stroke="#4CAF50" strokeWidth="6" strokeLinecap="round" />
        
        {/* Trou de serrure */}
        <circle cx="0" cy="10" r="8" fill="#4CAF50" />
        <rect x="-3" y="10" width="6" height="15" fill="#4CAF50" />
        
        {/* Effet de brillance */}
        <ellipse cx="-15" cy="-5" rx="10" ry="20" fill="white" opacity="0.3" />
        
        {/* Animation de verrouillage */}
        <g>
          <circle cx="0" cy="10" r="15" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0">
            <animate attributeName="r" values="15;25;15" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.8;0" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      </g>
      
      {/* Éléments flottants */}
      <g opacity="0.7">
        {/* Clé */}
        <g transform="translate(100, 150)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#FFD700" strokeWidth="2" />
          <g transform="scale(0.8)">
            <circle cx="0" cy="0" r="8" fill="#FFD700" />
            <rect x="8" y="-3" width="20" height="6" fill="#FFD700" />
            <rect x="20" y="-3" width="3" height="10" fill="#FFD700" />
            <rect x="24" y="-3" width="3" height="8" fill="#FFD700" />
          </g>
          <animateTransform attributeName="transform" type="rotate" 
                            from="0 100 150" to="360 100 150" dur="15s" repeatCount="indefinite" />
        </g>
        
        {/* Étoiles */}
        <g transform="translate(300, 120)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#FFD700" strokeWidth="2" />
          <path d="M0,-10 L3,-3 L10,-3 L4,1 L6,8 L0,4 L-6,8 L-4,1 L-10,-3 L-3,-3 Z" 
                fill="#FFD700" />
          <animateTransform attributeName="transform" type="scale" 
                            values="1;1.2;1" dur="3s" repeatCount="indefinite" />
        </g>
        
        {/* Bouclier */}
        <g transform="translate(80, 280)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#42A5F5" strokeWidth="2" />
          <path d="M0,-10 C-10,-10 -10,0 -10,5 C-10,15 0,20 0,20 C0,20 10,15 10,5 C10,0 10,-10 0,-10 Z" 
                fill="#42A5F5" />
          <path d="M-5,-5 L-2,-2 L5,-8" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
          <animateTransform attributeName="transform" type="translate" 
                            values="80,280; 85,275; 80,280" dur="4s" repeatCount="indefinite" />
        </g>
        
        {/* Utilisateurs */}
        <g transform="translate(320, 250)">
          <circle cx="0" cy="0" r="25" fill="white" stroke="#CE93D8" strokeWidth="2" />
          <circle cx="0" cy="-5" r="6" fill="#CE93D8" />
          <path d="M-8,5 Q0,10 8,5" fill="#CE93D8" />
          <animateTransform attributeName="transform" type="translate" 
                            values="320,250; 315,245; 320,250" dur="3.5s" repeatCount="indefinite" />
        </g>
      </g>
      
      {/* Particules */}
      <g opacity="0.6">
        <circle cx="150" cy="100" r="3" fill="#81C784">
          <animate attributeName="cy" values="100;90;100" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="250" cy="150" r="4" fill="#FFD54F">
          <animate attributeName="cy" values="150;140;150" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="180" cy="300" r="3" fill="#42A5F5">
          <animate attributeName="cy" values="300;290;300" dur="4s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );

  // Avantages de la connexion
  const benefits = [
    {
      icon: <Star size={24} className="text-amber-500" />,
      title: "Avis vérifiés",
      description: "Publiez et consultez des avis 100% authentiques"
    },
    {
      icon: <Heart size={24} className="text-pink-500" />,
      title: "Favoris",
      description: "Sauvegardez vos produits préférés"
    },
    {
      icon: <TrendingUp size={24} className="text-blue-500" />,
      title: "Historique",
      description: "Retrouvez tous vos scans et recherches"
    },
    {
      icon: <Award size={24} className="text-purple-500" />,
      title: "Badges",
      description: "Gagnez des récompenses et du statut"
    }
  ];

  // Stats de la communauté
  const stats = [
    { value: "10K+", label: "Membres actifs" },
    { value: "50K+", label: "Avis vérifiés" },
    { value: "4.8/5", label: "Note moyenne" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-green-600">
              <li><Link to="/" className="hover:text-green-800 transition-colors">Accueil</Link></li>
              <li><ChevronRight size={16} /></li>
              <li className="text-green-800 font-medium">Connexion requise</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Section gauche - Contenu */}
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-6">
                  <Lock size={40} className="text-green-700" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
                  Oups ! Cette page est <span className="text-green-600">réservée</span>
                </h1>
                <p className="text-xl text-green-700 mb-8">
                  Connectez-vous pour accéder à toutes les fonctionnalités premium de Fydo
                </p>

                {/* Avantages */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={benefit.title}
                      className={`flex items-start space-x-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-500 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                      }`}
                      style={{ transitionDelay: `${200 + index * 100}ms` }}
                    >
                      <div className="flex-shrink-0">{benefit.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{benefit.title}</h3>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => navigate('/login', { state: { redirectTo: redirectPath } })}
                    onMouseEnter={() => setHoveredButton('login')}
                    onMouseLeave={() => setHoveredButton(null)}
                    className="relative bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 flex items-center justify-center overflow-hidden group"
                  >
                    <LogIn size={20} className="mr-3" />
                    <span className="relative z-10">Se connecter</span>
                    
                    {/* Effet de brillance */}
                    <span className="absolute inset-0 rounded-xl overflow-hidden">
                      <span className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-all duration-700 ${
                        hoveredButton === 'login' ? 'opacity-20 translate-x-full' : '-translate-x-full'
                      }`}></span>
                    </span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/signup', { state: { redirectTo: redirectPath } })}
                    onMouseEnter={() => setHoveredButton('signup')}
                    onMouseLeave={() => setHoveredButton(null)}
                    className="relative bg-white hover:bg-gray-50 text-green-700 font-bold py-4 px-8 rounded-xl border-2 border-green-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 flex items-center justify-center"
                  >
                    <UserPlus size={20} className="mr-3" />
                    <span>Créer un compte gratuit</span>
                  </button>
                </div>

                {/* Badge gratuit */}
                <div className="mt-6 inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full animate-pulse">
                  <Gift size={16} className="mr-2" />
                  <span className="text-sm font-medium">100% Gratuit - Sans engagement</span>
                </div>
              </div>
            </div>

            {/* Section droite - Illustration */}
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative">
                <LockIllustration />
                
                {/* Stats flottantes */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {stats.map((stat, index) => (
                      <div 
                        key={stat.label}
                        className="animate-fade-in"
                        style={{ animationDelay: `${800 + index * 100}ms` }}
                      >
                        <p className="text-2xl font-bold text-green-800">{stat.value}</p>
                        <p className="text-xs text-gray-600">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section témoignage */}
          <div className={`mt-24 bg-white rounded-3xl shadow-xl p-8 border border-green-100 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                  <Sparkles size={28} className="mr-3 text-green-600" />
                  Rejoignez la révolution des avis authentiques
                </h2>
                <p className="text-gray-700 mb-6">
                  Des milliers d'utilisateurs font déjà confiance à Fydo pour leurs achats quotidiens. 
                  Chaque avis est vérifié par ticket de caisse, garantissant une fiabilité totale.
                </p>
                
                <div className="flex items-center space-x-6">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map(num => (
                      <div 
                        key={num} 
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-3 border-white flex items-center justify-center text-white font-bold shadow-md"
                      >
                        {String.fromCharCode(65 + num - 1)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rejoignez</p>
                    <p className="font-bold text-green-800">10,000+ membres</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl">👩</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <h4 className="font-semibold text-gray-800 mr-3">Sophie M.</h4>
                      <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        <CheckCircle size={12} className="mr-1" />
                        Membre vérifié
                      </div>
                    </div>
                    <div className="flex mb-2">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} size={16} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic">
                      "Fydo a changé ma façon de faire les courses ! Je ne prends plus jamais un produit sans vérifier les avis. 
                      C'est rassurant de savoir que tous les commentaires sont authentiques."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA final */}
          <div className={`text-center mt-12 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-gray-600 mb-4">
              Vous préférez continuer sans compte ?
            </p>
            <Link 
              to="/"
              className="text-green-600 hover:text-green-700 font-medium inline-flex items-center transition-colors"
            >
              Retourner à l'accueil
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>

        </div>
      </div>

      {/* Styles pour animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default AuthRequiredScreen;