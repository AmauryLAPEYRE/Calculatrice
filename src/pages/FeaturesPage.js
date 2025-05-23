// src/pages/FeaturesPage.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { 
  Scan, 
  Star, 
  Search, 
  Info, 
  Heart, 
  ShoppingBag, 
  Leaf, 
  Shield, 
  Camera, 
  Smartphone,
  MessageSquare,
  ChevronRight,
  Award,
  Users,
  Clock,
  Zap,
  Crown,
  BarChart3,
  CheckCircle,
  Globe,
  TrendingUp,
  Eye
} from 'lucide-react';

const FeaturesPage = () => {
  const [activeFeature, setActiveFeature] = useState('scan');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Déclencher les animations au chargement
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Catégories de fonctionnalités avec palette cohérente
  const featureCategories = [
    {
      id: 'scan',
      title: 'Scan & Recherche',
      icon: <Scan size={24} />,
      description: 'Découvrez instantanément',
      features: [
        {
          id: 'barcode-scan',
          title: 'Scan de code-barres',
          icon: <Camera size={20} />,
          description: 'Scannez n\'importe quel produit en 2 secondes',
          benefit: 'Identification instantanée'
        },
        {
          id: 'name-search',
          title: 'Recherche par nom',
          icon: <Search size={20} />,
          description: 'Trouvez par nom, marque ou ingrédients',
          benefit: '50,000+ produits'
        },
        {
          id: 'advanced-filters',
          title: 'Filtres avancés',
          icon: <BarChart3 size={20} />,
          description: 'Filtrez par catégorie, notes, ingrédients',
          benefit: 'Recherche précise'
        }
      ]
    },
    {
      id: 'reviews',
      title: 'Avis Vérifiés',
      icon: <Star size={24} />,
      description: '100% authentiques',
      features: [
        {
          id: 'verified-reviews',
          title: 'Vérification par ticket',
          icon: <CheckCircle size={20} />,
          description: 'Chaque avis est vérifié par preuve d\'achat',
          benefit: '100% fiables'
        },
        {
          id: 'multi-criteria',
          title: 'Notes multicritères',
          icon: <BarChart3 size={20} />,
          description: 'Goût, texture, qualité, rapport qualité-prix',
          benefit: 'Vision complète'
        },
        {
          id: 'community',
          title: 'Communauté engagée',
          icon: <Users size={20} />,
          description: 'Des milliers d\'utilisateurs actifs',
          benefit: '10,000+ membres'
        }
      ]
    },
    {
      id: 'product-info',
      title: 'Informations Détaillées',
      icon: <Info size={24} />,
      description: 'Tout savoir',
      features: [
        {
          id: 'nutritional-info',
          title: 'Valeurs nutritionnelles',
          icon: <Leaf size={20} />,
          description: 'Calories, protéines, glucides, lipides',
          benefit: 'Données complètes'
        },
        {
          id: 'eco-impact',
          title: 'Impact environnemental',
          icon: <Globe size={20} />,
          description: 'Éco-Score et empreinte carbone',
          benefit: 'Consommation responsable'
        },
        {
          id: 'allergens',
          title: 'Allergènes et additifs',
          icon: <Shield size={20} />,
          description: 'Identification claire des risques',
          benefit: 'Sécurité alimentaire'
        }
      ]
    }
  ];

  // Avantages principaux
  const mainBenefits = [
    {
      icon: <Zap size={24} />,
      title: "Instantané",
      description: "Résultats en 2 secondes"
    },
    {
      icon: <Shield size={24} />,
      title: "Fiable",
      description: "100% vérifié"
    },
    {
      icon: <Users size={24} />,
      title: "Communautaire",
      description: "10,000+ membres actifs"
    },
    {
      icon: <Crown size={24} />,
      title: "Complet",
      description: "Toutes les infos essentielles"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-green-50 to-white min-h-screen">
      <Helmet>
        <title>Fonctionnalités | Fydo - Tous les Outils pour Choisir Vos Produits</title>
        <meta name="description" content="Découvrez toutes les fonctionnalités de Fydo : scan de codes-barres, avis vérifiés, informations nutritionnelles complètes." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-green-600">
              <li><Link to="/" className="hover:text-green-800 transition-colors">Accueil</Link></li>
              <li><ChevronRight size={16} /></li>
              <li className="text-green-800 font-medium">Fonctionnalités</li>
            </ol>
          </nav>

          {/* Header Section */}
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
              Tous les Outils pour <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">Choisir Parfaitement</span>
            </h1>
            <p className="text-xl text-green-700 max-w-3xl mx-auto">
              Découvrez comment Fydo révolutionne vos choix de produits avec des fonctionnalités innovantes
            </p>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center space-x-8 opacity-80 mt-8">
              <span className="text-sm text-green-700 flex items-center">
                <Scan size={16} className="mr-1" />
                Scan instantané
              </span>
              <span className="text-sm text-green-700 flex items-center">
                <Star size={16} className="mr-1 text-amber-500 fill-amber-500" />
                Avis 100% vérifiés
              </span>
              <span className="text-sm text-green-700 flex items-center">
                <Crown size={16} className="mr-1 text-amber-500" />
                Données complètes
              </span>
            </div>
          </div>

          {/* Avantages principaux avec animation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {mainBenefits.map((benefit, index) => (
              <div 
                key={benefit.title}
                className={`group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-500 border border-green-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {React.cloneElement(benefit.icon, { className: "text-green-700" })}
                </div>
                <h3 className="font-bold text-green-800 mb-2">{benefit.title}</h3>
                <p className="text-green-700 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Section principale avec animation smartphone */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16 border border-green-100">
            <div className="flex flex-col lg:flex-row">
              
              {/* Navigation des fonctionnalités */}
              <div className="lg:w-1/3 bg-gradient-to-b from-green-50 to-green-100 p-8">
                <h2 className="text-2xl font-bold text-green-800 mb-6">Explorez nos fonctionnalités</h2>
                <div className="space-y-4">
                  {featureCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveFeature(category.id)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                        activeFeature === category.id
                          ? 'bg-white shadow-lg transform scale-105'
                          : 'hover:bg-white/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activeFeature === category.id
                              ? 'bg-gradient-to-br from-green-500 to-green-700 text-white'
                              : 'bg-white text-green-700'
                          }`}>
                            {category.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-green-800">{category.title}</h3>
                            <p className="text-sm text-green-600">{category.description}</p>
                          </div>
                        </div>
                        {activeFeature === category.id && (
                          <ChevronRight size={20} className="text-green-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contenu et animation */}
              <div className="lg:w-2/3 p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  
                  {/* Liste des fonctionnalités */}
                  <div className="space-y-6">
                    {featureCategories.find(cat => cat.id === activeFeature)?.features.map((feature, index) => (
                      <div
                        key={feature.id}
                        className={`group p-6 bg-gradient-to-br from-green-50 to-white rounded-xl hover:shadow-lg transition-all duration-500 transform hover:scale-105 border border-green-100 cursor-pointer ${
                          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                        }`}
                        style={{ transitionDelay: `${index * 200}ms` }}
                        onMouseEnter={() => setHoveredCard(feature.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                            {React.cloneElement(feature.icon, { className: "text-green-600" })}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-green-800 mb-1">{feature.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                            <span className="inline-flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                              <Zap size={12} className="mr-1" />
                              {feature.benefit}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Animation smartphone interactive */}
                  <div className="relative">
                    <div className="relative max-w-[280px] mx-auto">
                      {/* Effet de glow derrière le téléphone */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-green-300 rounded-[40px] blur-2xl opacity-30 transform scale-110"></div>
                      
                      {/* Smartphone */}
                      <div className="relative bg-gray-900 rounded-[40px] p-2 shadow-2xl">
                        <div className="bg-white rounded-[32px] overflow-hidden">
                          {/* Encoche */}
                          <div className="bg-gray-900 h-6 flex justify-center items-center">
                            <div className="bg-gray-800 w-20 h-4 rounded-b-xl"></div>
                          </div>
                          
                          {/* Écran avec contenu animé selon la fonctionnalité active */}
                          <div className="h-[500px] bg-gradient-to-b from-green-50 to-white p-4">
                            {/* Header de l'app */}
                            <div className="bg-green-600 -mx-4 -mt-4 px-4 py-3 mb-6">
                              <div className="flex items-center justify-between">
                                <h3 className="text-white font-bold text-lg">Fydo</h3>
                                <Star className="text-amber-400 fill-amber-400" size={20} />
                              </div>
                            </div>
                            
                            {/* Contenu animé selon activeFeature */}
                            {activeFeature === 'scan' && (
                              <div className="space-y-4">
                                <div className="bg-green-100 rounded-2xl p-6 relative overflow-hidden">
                                  <div className="relative z-10">
                                    <h4 className="text-green-800 font-semibold mb-4">Scanner un produit</h4>
                                    <div className="bg-white rounded-xl p-4 shadow-inner">
                                      <div className="aspect-square relative">
                                        {/* Zone de scan animée */}
                                        <div className="absolute inset-4 border-2 border-dashed border-green-600 rounded-lg animate-pulse"></div>
                                        
                                        {/* Ligne de scan animée */}
                                        <div className="absolute left-4 right-4 h-0.5 bg-green-500 top-1/2 transform -translate-y-1/2">
                                          <div className="h-full w-full bg-gradient-to-r from-transparent via-green-400 to-transparent animate-scan"></div>
                                        </div>
                                        
                                        {/* Code-barres */}
                                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1">
                                          {[...Array(12)].map((_, i) => (
                                            <div key={i} className={`bg-gray-800 ${i % 2 === 0 ? 'w-1' : 'w-0.5'} h-8`}></div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Particules flottantes */}
                                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-float"></div>
                                  <div className="absolute bottom-4 left-4 w-3 h-3 bg-green-300 rounded-full animate-float-delayed"></div>
                                </div>
                                
                                {/* Résultat du scan */}
                                {hoveredCard === 'barcode-scan' && (
                                  <div className="bg-white rounded-xl p-4 shadow-lg animate-slide-up">
                                    <div className="flex items-center space-x-3 mb-3">
                                      <div className="w-12 h-12 bg-amber-100 rounded-lg"></div>
                                      <div>
                                        <h5 className="font-semibold text-gray-800">Produit trouvé!</h5>
                                        <p className="text-sm text-gray-600">Céréales Bio</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                          <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                                        ))}
                                      </div>
                                      <span className="text-sm text-green-600 font-medium">152 avis</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {activeFeature === 'reviews' && (
                              <div className="space-y-4">
                                {/* Avis avec badge vérifié */}
                                <div className="bg-white rounded-xl p-4 shadow-md">
                                  <div className="flex items-start space-x-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                      <span className="text-green-800 font-bold">M</span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-semibold text-gray-800">Marie L.</h5>
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
                                          <CheckCircle size={12} className="mr-1" />
                                          Vérifié
                                        </span>
                                      </div>
                                      <div className="flex mb-2">
                                        {[...Array(5)].map((_, i) => (
                                          <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                                        ))}
                                      </div>
                                      <p className="text-sm text-gray-600">"Excellent produit, je recommande!"</p>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Ticket de caisse animé */}
                                {hoveredCard === 'verified-reviews' && (
                                  <div className="bg-gray-50 rounded-xl p-4 animate-slide-up">
                                    <div className="flex items-center justify-between mb-3">
                                      <h5 className="font-semibold text-gray-800">Ticket vérifié</h5>
                                      <Shield size={20} className="text-green-600" />
                                    </div>
                                    <div className="space-y-2 text-xs text-gray-600">
                                      <div className="flex justify-between">
                                        <span>CEREALES BIO</span>
                                        <span>4.99€</span>
                                      </div>
                                      <div className="border-t pt-2 flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>4.99€</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {activeFeature === 'product-info' && (
                              <div className="space-y-4">
                                {/* Valeurs nutritionnelles */}
                                <div className="bg-white rounded-xl p-4 shadow-md">
                                  <h5 className="font-semibold text-gray-800 mb-3">Valeurs nutritionnelles</h5>
                                  <div className="space-y-3">
                                    {[
                                      { label: 'Calories', value: '380 kcal', percent: 19 },
                                      { label: 'Protéines', value: '8g', percent: 16 },
                                      { label: 'Glucides', value: '72g', percent: 28 },
                                      { label: 'Lipides', value: '5g', percent: 7 }
                                    ].map((nutrient) => (
                                      <div key={nutrient.label} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                          <span className="text-gray-600">{nutrient.label}</span>
                                          <span className="font-medium text-gray-800">{nutrient.value}</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                                            style={{ width: `${nutrient.percent}%` }}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                {/* Eco-Score */}
                                {hoveredCard === 'eco-impact' && (
                                  <div className="bg-green-50 rounded-xl p-4 animate-slide-up">
                                    <div className="flex items-center justify-between mb-3">
                                      <h5 className="font-semibold text-green-800">Éco-Score</h5>
                                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                                        A
                                      </div>
                                    </div>
                                    <p className="text-sm text-green-700">Faible impact environnemental</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Section appel à l'action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-white shadow-2xl">
              <h2 className="text-3xl font-bold mb-4">Prêt à découvrir toutes ces fonctionnalités ?</h2>
              <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                Rejoignez des milliers d'utilisateurs qui font déjà confiance à Fydo pour leurs achats quotidiens.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/recherche-filtre"
                  className="bg-white hover:bg-gray-100 text-green-700 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 flex items-center"
                >
                  <Scan className="mr-2" size={20} />
                  Essayer maintenant
                </Link>
                
                <Link
                  to="/concept"
                  className="bg-green-800 hover:bg-green-900 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
                >
                  En savoir plus
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default FeaturesPage;