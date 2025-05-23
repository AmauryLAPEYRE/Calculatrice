// src/components/Download.js
import React, { useState, useEffect, useRef } from 'react';
import { Apple, Smartphone, QrCode, Download as DownloadIcon, Star, Users, Shield, Sparkles, ChevronRight, Heart } from 'lucide-react';

const Download = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showQrAnimation, setShowQrAnimation] = useState(false);
  const [hoveredStore, setHoveredStore] = useState(null);
  const sectionRef = useRef(null);

  // Observer pour déclencher l'animation lorsque la section est visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animation du QR code après l'apparition de la section
          setTimeout(() => {
            setShowQrAnimation(true);
          }, 1000);
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

  // Illustration moderne du téléphone
  const PhoneIllustration = () => (
    <svg viewBox="0 0 400 600" className="w-full h-full">
      <defs>
        <linearGradient id="phoneGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#81C784', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#4CAF50', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="phoneGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#FFD54F', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#FFA726', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="phoneGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#42A5F5', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#1E88E5', stopOpacity:1}} />
        </linearGradient>
        <radialGradient id="phoneGlow">
          <stop offset="0%" style={{stopColor:'#ffffff', stopOpacity:0.9}} />
          <stop offset="100%" style={{stopColor:'#ffffff', stopOpacity:0}} />
        </radialGradient>
      </defs>
      
      {/* Ombre du téléphone */}
      <ellipse cx="200" cy="550" rx="100" ry="30" fill="#000" opacity="0.1" />
      
      {/* Corps du téléphone */}
      <rect x="100" y="50" width="200" height="450" rx="40" fill="#1a1a1a" />
      <rect x="105" y="55" width="190" height="440" rx="35" fill="#000" />
      
      {/* Écran */}
      <rect x="110" y="80" width="180" height="390" rx="30" fill="#F5F5F5" />
      
      {/* Encoche */}
      <rect x="170" y="55" width="60" height="25" rx="12" fill="#000" />
      <circle cx="200" cy="67" r="3" fill="#333" />
      
      {/* Interface Fydo */}
      <g>
        {/* Header */}
        <rect x="110" y="80" width="180" height="60" fill="url(#phoneGrad1)" />
        <text x="200" y="115" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">Fydo</text>
        <path d="M230,105 L235,115 L245,115 L237,120 L240,130 L230,123 L220,130 L223,120 L215,115 L225,115 Z" 
              fill="#FFD700" transform="scale(0.8)" />
        
        {/* Module de scan */}
        <g transform="translate(200, 200)">
          <rect x="-70" y="-50" width="140" height="100" rx="10" fill="white" stroke="#E0E0E0" strokeWidth="2" />
          <text x="0" y="-30" textAnchor="middle" fill="#4CAF50" fontSize="14" fontWeight="medium">Scanner un produit</text>
          
          <rect x="-40" y="-20" width="80" height="60" fill="none" stroke="url(#phoneGrad1)" strokeWidth="3" strokeDasharray="5 5">
            <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
          </rect>
          
          <circle cx="0" cy="10" r="20" fill="url(#phoneGrad1)" opacity="0.1">
            <animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite" />
          </circle>
          
          <path d="M-20,10 L-10,10 M-20,10 L-20,0 M20,10 L10,10 M20,10 L20,0 M-20,-10 L-20,-20 M-20,-20 L-10,-20 M20,-10 L20,-20 M20,-20 L10,-20"
                stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
        
        {/* Avis récents */}
        <g transform="translate(200, 310)">
          <rect x="-70" y="-30" width="140" height="60" rx="10" fill="white" stroke="#E0E0E0" strokeWidth="1" />
          <text x="-60" y="-10" fill="#333" fontSize="12" fontWeight="medium">Avis récents</text>
          
          <g transform="translate(-50, 5)">
            {[0, 20, 40, 60, 80].map((offset, i) => (
              <path key={i} d={`M${offset},-5 L${offset+3},0 L${offset+9},0 L${offset+4},3 L${offset+6},9 L${offset},5 L${offset-6},9 L${offset-4},3 L${offset-9},0 L${offset-3},0 Z`} 
                    fill={i < 4 ? "#FFD700" : "#E0E0E0"} transform="scale(0.7)" />
            ))}
          </g>
          
          <text x="-60" y="25" fill="#666" fontSize="10">1 234 avis vérifiés</text>
        </g>
        
        {/* Menu du bas */}
        <g transform="translate(200, 430)">
          <rect x="-80" y="-25" width="160" height="50" rx="25" fill="#F5F5F5" stroke="#E0E0E0" strokeWidth="1" />
          
          <g transform="translate(-60, 0)">
            <circle cx="0" cy="0" r="15" fill="url(#phoneGrad1)" />
            <path d="M-5,-5 L5,-5 L5,5 L-5,5 Z M-7,0 L-10,0 M7,0 L10,0 M0,-7 L0,-10 M0,7 L0,10" 
                  stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
          
          <g transform="translate(-20, 0)">
            <circle cx="0" cy="0" r="15" fill="#F5F5F5" />
            <path d="M0,-8 L2.4,-2.4 L8,-0 L2.4,2.4 L0,8 L-2.4,2.4 L-8,0 L-2.4,-2.4 Z" 
                  fill="#FFA726" />
          </g>
          
          <g transform="translate(20, 0)">
            <circle cx="0" cy="0" r="15" fill="#F5F5F5" />
            <path d="M0,3 C0,-3 -5,-6 -5,-2 C-5,1 -2.5,4 0,7 C2.5,4 5,1 5,-2 C5,-6 0,-3 0,3 Z" 
                  fill="#FF6B6B" />
          </g>
          
          <g transform="translate(60, 0)">
            <circle cx="0" cy="0" r="15" fill="#F5F5F5" />
            <circle cx="0" cy="-3" r="5" fill="#666" />
            <path d="M-6,3 Q0,8 6,3" fill="#666" />
          </g>
        </g>
      </g>
      
      {/* Particules flottantes autour du téléphone */}
      <g opacity="0.6">
        <circle cx="50" cy="150" r="3" fill="#81C784">
          <animate attributeName="cy" values="150;140;150" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="350" cy="200" r="4" fill="#FFD54F">
          <animate attributeName="cy" values="200;190;200" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="60" cy="350" r="3" fill="#42A5F5">
          <animate attributeName="cy" values="350;340;350" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="340" cy="400" r="2.5" fill="#CE93D8">
          <animate attributeName="cy" values="400;390;400" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Badges flottants */}
      <g transform="translate(320, 150)" className="hover:scale-110 transition-transform">
        <rect x="-30" y="-15" width="60" height="30" rx="15" fill="white" stroke="#4CAF50" strokeWidth="2" />
        <text x="0" y="5" textAnchor="middle" fill="#4CAF50" fontSize="12" fontWeight="bold">Gratuit!</text>
        <animateTransform attributeName="transform" type="rotate" 
                          from="-5 320 150" to="5 320 150" dur="3s" 
                          repeatCount="indefinite" autoReverse="true" />
      </g>
      
      <g transform="translate(80, 250)">
        <rect x="-35" y="-15" width="70" height="30" rx="15" fill="white" stroke="#FFD700" strokeWidth="2" />
        <path d="M-20,0 L-17,3 L-11,-3" stroke="#FFD700" strokeWidth="2" fill="none" strokeLinecap="round" />
        <text x="5" y="5" textAnchor="middle" fill="#FFA726" fontSize="11" fontWeight="medium">Vérifié</text>
        <animateTransform attributeName="transform" type="rotate" 
                          from="5 80 250" to="-5 80 250" dur="3.5s" 
                          repeatCount="indefinite" autoReverse="true" />
      </g>
    </svg>
  );

  // Statistiques
  const stats = [
    { value: "10K+", label: "Téléchargements", icon: <DownloadIcon size={20} /> },
    { value: "4.8", label: "Note moyenne", icon: <Star size={20} className="fill-current" /> },
    { value: "50K+", label: "Avis vérifiés", icon: <Shield size={20} /> },
    { value: "24/7", label: "Support actif", icon: <Heart size={20} /> }
  ];

  return (
    <section ref={sectionRef} id="telecharger" className="py-20 bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
      {/* Motifs de fond */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-12 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Téléchargez <span className="text-green-600">FYDO</span> dès maintenant
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté d'utilisateurs et commencez à faire des choix éclairés pour vos produits du quotidien.
          </p>
          
          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-green-600 mb-2 flex justify-center">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl mx-auto">
          {/* Téléphone avec app */}
          <div className={`lg:w-1/2 mb-10 lg:mb-0 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="relative max-w-sm mx-auto">
              {/* Effet de brillance derrière le téléphone */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-green-100 rounded-full blur-3xl opacity-30 transform scale-110"></div>
              
              {/* Illustration du téléphone */}
              <div className="relative z-10">
                <PhoneIllustration />
              </div>
            </div>
          </div>
          
          {/* Boutons de téléchargement et QR code */}
          <div className={`lg:w-1/2 lg:pl-8 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="text-center lg:text-left mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Disponible sur <span className="text-green-600">iOS</span> et <span className="text-green-600">Android</span>
              </h3>
              <p className="text-gray-600 mb-8">
                Téléchargez l'application gratuitement et accédez à des milliers d'avis vérifiés instantanément.
              </p>
            </div>
            
            {/* Boutons de téléchargement avec effet hover moderne */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-10">
              <a 
                href="/#" 
                className={`group relative bg-black text-white rounded-2xl px-8 py-4 flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden ${
                  hoveredStore === 'apple' ? 'ring-2 ring-green-500' : ''
                }`}
                onMouseEnter={() => setHoveredStore('apple')}
                onMouseLeave={() => setHoveredStore(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Apple size={28} className="mr-3 relative z-10" />
                <div className="text-left relative z-10">
                  <div className="text-xs opacity-90">Télécharger sur</div>
                  <div className="text-xl font-semibold">App Store</div>
                </div>
                <Sparkles className="absolute top-2 right-2 text-white opacity-0 group-hover:opacity-50 transition-opacity" size={16} />
              </a>
              
              <a 
                href="/#" 
                className={`group relative bg-black text-white rounded-2xl px-8 py-4 flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden ${
                  hoveredStore === 'google' ? 'ring-2 ring-green-500' : ''
                }`}
                onMouseEnter={() => setHoveredStore('google')}
                onMouseLeave={() => setHoveredStore(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="mr-3 relative z-10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 20.69V3.31c0-.42.51-.63.81-.33l11.43 8.69c.25.19.25.57 0 .76L3.81 21.02c-.3.23-.81.02-.81-.33z" fill="currentColor"/>
                    <path d="M14 12l2.44 1.862 3.97-3.982c.29-.28.75-.1.75.45v15.34c0 .55-.46.83-.75.55l-3.97-3.98L14 24.001H21c1.66 0 3-1.34 3-3V3.001c0-1.66-1.34-3-3-3h-7L14 12z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="text-left relative z-10">
                  <div className="text-xs opacity-90">Télécharger sur</div>
                  <div className="text-xl font-semibold">Google Play</div>
                </div>
                <Sparkles className="absolute top-2 right-2 text-white opacity-0 group-hover:opacity-50 transition-opacity" size={16} />
              </a>
            </div>
            
            {/* QR Code avec animation moderne */}
            <div className="flex justify-center lg:justify-start">
              <div className={`bg-white p-6 rounded-2xl shadow-xl max-w-xs w-full transition-all duration-700 transform border border-gray-100 ${
                showQrAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-70'
              }`}>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <QrCode size={24} className="text-green-600 mr-2" />
                    <p className="text-gray-800 font-bold">Scanner le QR Code</p>
                  </div>
                  
                  <div className="relative w-48 h-48 bg-white p-4 mx-auto mb-4 rounded-xl shadow-inner">
                    <div className="w-full h-full border-2 border-gray-200 rounded-lg p-2">
                      {/* QR code moderne stylisé */}
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <defs>
                          <pattern id="qrPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                            <rect x="0" y="0" width="10" height="10" fill="white" />
                            <rect x="0" y="0" width="5" height="5" fill="#333" opacity={showQrAnimation ? "1" : "0"}>
                              <animate attributeName="opacity" values="0;1;1" dur="1s" repeatCount="1" />
                            </rect>
                            <rect x="5" y="5" width="5" height="5" fill="#333" opacity={showQrAnimation ? "1" : "0"}>
                              <animate attributeName="opacity" values="0;1;1" dur="1s" begin="0.1s" repeatCount="1" />
                            </rect>
                          </pattern>
                        </defs>
                        
                        {/* Coins du QR code */}
                        <rect x="5" y="5" width="20" height="20" fill="none" stroke="#333" strokeWidth="3" />
                        <rect x="5" y="5" width="10" height="10" fill="#333" />
                        
                        <rect x="75" y="5" width="20" height="20" fill="none" stroke="#333" strokeWidth="3" />
                        <rect x="85" y="5" width="10" height="10" fill="#333" />
                        
                        <rect x="5" y="75" width="20" height="20" fill="none" stroke="#333" strokeWidth="3" />
                        <rect x="5" y="85" width="10" height="10" fill="#333" />
                        
                        {/* Centre avec logo Fydo */}
                        <rect x="40" y="40" width="20" height="20" fill="#4CAF50" rx="5" />
                        <text x="50" y="53" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">F</text>
                        
                        {/* Pattern de fond */}
                        <rect x="30" y="30" width="40" height="40" fill="url(#qrPattern)" opacity="0.3" />
                        
                        {/* Animation de scan */}
                        {showQrAnimation && (
                          <line x1="0" y1="50" x2="100" y2="50" stroke="#4CAF50" strokeWidth="2" opacity="0.5">
                            <animate attributeName="y1" values="0;100;0" dur="3s" repeatCount="indefinite" />
                            <animate attributeName="y2" values="0;100;0" dur="3s" repeatCount="indefinite" />
                          </line>
                        )}
                      </svg>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    pour télécharger l'application
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section témoignage */}
        <div className={`mt-20 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 md:p-12 text-white max-w-4xl mx-auto shadow-xl transition-all duration-1000 delay-300 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 text-center">
              <Users size={48} className="mx-auto mb-4" />
              <p className="text-3xl font-bold mb-2">10,000+</p>
              <p className="text-green-100">Utilisateurs actifs</p>
            </div>
            
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-4">Rejoignez la communauté Fydo</h3>
              <p className="text-green-100 mb-6">
                Une communauté en pleine croissance qui partage des avis authentiques chaque jour. 
                Faites partie du mouvement pour une consommation plus éclairée et responsable.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map(num => (
                    <div 
                      key={num} 
                      className="w-10 h-10 rounded-full bg-white border-2 border-green-600 flex items-center justify-center text-green-600 text-sm font-bold"
                    >
                      {num}
                    </div>
                  ))}
                </div>
                <span className="text-green-100 text-sm">
                  et des milliers d'autres...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Download;