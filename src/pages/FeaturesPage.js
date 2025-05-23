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
  ChevronDown,
  ChevronUp,
  ChevronRight,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Users,
  Clock,
  Award,
  Zap,
  Crown
} from 'lucide-react';

const FeaturesPage = () => {
  const [activeFeature, setActiveFeature] = useState('scan');
  const [expandedFeatures, setExpandedFeatures] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  // Déclencher les animations au chargement
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleFeature = (id) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Principales catégories de fonctionnalités
  const featureCategories = [
    {
      id: 'scan',
      title: 'Scan & Recherche',
      icon: <Scan size={32} className="text-green-600" />,
      description: 'Découvrez les produits instantanément par scan ou recherche avancée',
      color: 'green',
      features: [
        {
          id: 'barcode-scan',
          title: 'Scan de code-barres',
          icon: <Camera size={24} className="text-green-600" />,
          description: 'Utilisez l\'appareil photo de votre smartphone pour scanner n\'importe quel code-barres de produit alimentaire ou cosmétique et accéder instantanément à toutes ses informations et avis.',
          benefit: 'Identification instantanée en 2 secondes'
        },
        {
          id: 'name-search',
          title: 'Recherche par nom',
          icon: <Search size={24} className="text-green-600" />,
          description: 'Recherchez des produits par nom, marque ou ingrédients spécifiques. Utilisez nos filtres avancés pour une recherche précise.',
          benefit: 'Plus de 50,000 produits référencés'
        },
        {
          id: 'advanced-filters',
          title: 'Filtres avancés',
          icon: <BarChart3 size={24} className="text-green-600" />,
          description: 'Filtrez les résultats par catégorie, présence ou absence d\'ingrédients (SANS gluten, AVEC cacao), valeurs nutritionnelles, ou encore par évaluation moyenne.',
          benefit: 'Recherche ultra-précise selon vos besoins'
        }
      ]
    },
    {
      id: 'reviews',
      title: 'Avis Vérifiés',
      icon: <Star size={32} className="text-amber-500 fill-amber-500" />,
      description: 'Consultez et partagez des avis 100% authentiques vérifiés par ticket',
      color: 'amber',
      features: [
        {
          id: 'verified-reviews',
          title: 'Vérification par ticket',
          icon: <CheckCircle size={24} className="text-amber-600" />,
          description: 'Chaque avis sur Fydo est lié à un achat réel, vérifié par photo de ticket de caisse. Cette méthode garantit l\'authenticité des avis que vous consultez.',
          benefit: '100% des avis sont vérifiés'
        },
        {
          id: 'multi-criteria',
          title: 'Évaluation multicritères',
          icon: <BarChart3 size={24} className="text-amber-600" />,
          description: 'Évaluez les produits selon plusieurs critères : goût, texture, rapport qualité-prix, packaging... Obtenez une vision complète de chaque produit.',
          benefit: 'Notes précises sur 5 critères'
        },
        {
          id: 'community',
          title: 'Communauté active',
          icon: <Users size={24} className="text-amber-600" />,
          description: 'Rejoignez une communauté de consommateurs qui partagent leurs expériences authentiques pour aider les autres dans leurs choix.',
          benefit: 'Plus de 10,000 membres actifs'
        }
      ]
    },
    {
      id: 'product-info',
      title: 'Informations Détaillées',
      icon: <Info size={32} className="text-blue-600" />,
      description: 'Tout savoir sur les produits que vous consommez au quotidien',
      color: 'blue',
      features: [
        {
          id: 'nutritional-info',
          title: 'Nutrition complète',
          icon: <Leaf size={24} className="text-blue-600" />,
          description: 'Accédez aux valeurs nutritionnelles détaillées, à la liste complète des ingrédients, aux allergènes et au Nutri-Score pour chaque produit alimentaire.',
          benefit: 'Données nutritionnelles complètes'
        },
        {
          id: 'eco-impact',
          title: 'Impact environnemental',
          icon: <Leaf size={24} className="text-blue-600" />,
          description: 'Visualisez l\'Éco-Score et l\'empreinte carbone des produits. Identifiez la présence d\'huile de palme et l\'impact du packaging sur l\'environnement.',
          benefit: 'Consommation plus responsable'
        },
        {
          id: 'ingredient-analysis',
          title: 'Analyse des ingrédients',
          icon: <AlertTriangle size={24} className="text-blue-600" />,
          description: 'Identifiez facilement les additifs, conservateurs et ingrédients controversés. Comprenez rapidement ce que vous consommez réellement.',
          benefit: 'Transparence totale sur la composition'
        }
      ]
    },
    {
      id: 'personalization',
      title: 'Personnalisation',
      icon: <Heart size={32} className="text-pink-500 fill-pink-500" />,
      description: 'Une expérience sur mesure selon vos préférences et besoins',
      color: 'pink',
      features: [
        {
          id: 'favorites',
          title: 'Liste de favoris',
          icon: <Heart size={24} className="text-pink-600" />,
          description: 'Enregistrez vos produits préférés pour les retrouver facilement. Organisez-les en catégories personnalisées pour un accès rapide.',
          benefit: 'Accès instantané à vos préférés'
        },
        {
          id: 'preferences',
          title: 'Préférences alimentaires',
          icon: <Shield size={24} className="text-pink-600" />,
          description: 'Définissez vos allergies, régimes alimentaires (végétarien, sans gluten, etc.) et préférences pour recevoir des alertes personnalisées sur les produits.',
          benefit: 'Alertes automatiques personnalisées'
        },
        {
          id: 'activity',
          title: 'Suivi d\'activité',
          icon: <BarChart3 size={24} className="text-pink-600" />,
          description: 'Suivez votre activité sur l\'application avec un tableau de bord personnalisé. Avis publiés, produits scannés, interactions... tout est comptabilisé.',
          benefit: 'Dashboard complet de votre activité'
        }
      ]
    }
  ];

  // Avantages principaux
  const mainBenefits = [
    {
      icon: <Zap size={24} className="text-green-600" />,
      title: "Instantané",
      description: "Scannez et obtenez toutes les informations en 2 secondes"
    },
    {
      icon: <Shield size={24} className="text-green-600" />,
      title: "Fiable",
      description: "100% des avis sont vérifiés par preuve d'achat"
    },
    {
      icon: <Users size={24} className="text-green-600" />,
      title: "Communautaire",
      description: "Plus de 10,000 utilisateurs partagent leurs expériences"
    },
    {
      icon: <Award size={24} className="text-green-600" />,
      title: "Complet",
      description: "Nutrition, environnement, avis - tout en un seul endroit"
    }
  ];

  // Témoignages
  const testimonials = [
    {
      initial: "S",
      name: "Sophie M.",
      rating: 5,
      comment: "Fydo a complètement changé ma façon de faire mes courses. Je scanne tout avant d'acheter !",
      duration: "Utilisatrice depuis 8 mois"
    },
    {
      initial: "A",
      name: "Antoine L.",
      rating: 5,
      comment: "Les avis vérifiés sont un vrai plus. Je sais que je peux faire confiance aux notes.",
      duration: "Utilisateur depuis 1 an"
    },
    {
      initial: "M",
      name: "Marie D.",
      rating: 5,
      comment: "Perfect pour mes allergies au gluten. Les filtres sont très précis.",
      duration: "Utilisatrice depuis 6 mois"
    }
  ];

  // Obtenir la couleur de la fonctionnalité active
  const getActiveColor = () => {
    const active = featureCategories.find(cat => cat.id === activeFeature);
    return active ? active.color : 'green';
  };

  return (
    <section className="py-20 bg-green-50 min-h-screen">
      <Helmet>
        <title>Fonctionnalités | Fydo - Tous les Outils pour Choisir Vos Produits</title>
        <meta name="description" content="Découvrez toutes les fonctionnalités de Fydo : scan de codes-barres, avis vérifiés, informations nutritionnelles complètes et personnalisation avancée." />
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
              Tous les Outils pour <span className="text-green-600">Choisir Parfaitement</span>
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
                <Star size={16} className="mr-1 text-yellow-500 fill-yellow-500" />
                Avis 100% vérifiés
              </span>
              <span className="text-sm text-green-700 flex items-center">
                <Crown size={16} className="mr-1 text-amber-500" />
                Données complètes
              </span>
            </div>
          </div>

          {/* Avantages principaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {mainBenefits.map((benefit, index) => (
              <div 
                key={benefit.title}
                className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-500 border border-green-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-green-800 mb-2">{benefit.title}</h3>
                <p className="text-green-700 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Navigation des catégories de fonctionnalités */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-16 border border-green-100">
            <div className="flex flex-wrap border-b border-gray-200">
              {featureCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveFeature(category.id)}
                  className={`flex-1 min-w-[200px] py-6 px-4 flex flex-col items-center justify-center space-y-2 transition-all duration-300 ${
                    activeFeature === category.id 
                      ? `bg-${category.color}-50 border-b-4 border-${category.color}-500` 
                      : 'hover:bg-green-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    activeFeature === category.id ? `bg-${category.color}-100` : 'bg-green-100'
                  }`}>
                    {category.icon}
                  </div>
                  <span className={`font-medium ${
                    activeFeature === category.id ? `text-${category.color}-800` : 'text-gray-700'
                  }`}>{category.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contenu de la catégorie active */}
          {featureCategories.map((category) => (
            <div 
              key={category.id}
              className={`transition-all duration-300 mb-16 ${activeFeature === category.id ? 'block' : 'hidden'}`}
            >
              <div className="bg-white rounded-2xl p-8 shadow-md border border-green-100">
                <div className="flex flex-col lg:flex-row gap-8">
                  
                  {/* Description de la catégorie */}
                  <div className="lg:w-1/3">
                    <div className={`w-16 h-16 bg-${category.color}-100 rounded-full flex items-center justify-center mb-6`}>
                      {React.cloneElement(category.icon, { size: 32 })}
                    </div>
                    <h2 className="text-2xl font-bold text-green-800 mb-4">{category.title}</h2>
                    <p className="text-green-700 mb-6">{category.description}</p>
                    
                    {/* Mock-up de téléphone */}
                    <div className="relative max-w-[200px] mx-auto">
                      <div className="w-full aspect-[9/19] border-8 border-gray-800 rounded-[24px] overflow-hidden shadow-xl bg-white">
                        <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 z-10 flex justify-center items-end">
                          <div className="w-16 h-3 bg-gray-900 rounded-b-lg"></div>
                        </div>
                        <div className={`w-full h-full flex flex-col bg-gradient-to-br from-${category.color}-400 to-${category.color}-600 p-4 pt-8`}>
                          <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4">
                            <div className="text-white font-bold text-lg">Fydo</div>
                          </div>
                          <div className="flex-1 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                              {React.cloneElement(category.icon, { size: 32, className: "text-white" })}
                            </div>
                          </div>
                          <div className="text-center text-white text-sm opacity-90">
                            {category.title}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Liste des fonctionnalités */}
                  <div className="lg:w-2/3 space-y-4">
                    {category.features.map((feature) => (
                      <div
                        key={feature.id}
                        className="bg-gray-50 rounded-xl overflow-hidden transition-all duration-200"
                      >
                        <button 
                          onClick={() => toggleFeature(feature.id)}
                          className="w-full text-left p-6 flex items-center justify-between focus:outline-none hover:bg-green-50 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className={`w-12 h-12 rounded-full bg-${category.color}-100 flex items-center justify-center mr-4`}>
                              {feature.icon}
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-green-800">{feature.title}</h3>
                              <p className={`text-sm text-${category.color}-600 font-medium`}>{feature.benefit}</p>
                            </div>
                          </div>
                          {expandedFeatures[feature.id] ? 
                            <ChevronUp size={20} className="text-green-600" /> : 
                            <ChevronDown size={20} className="text-green-600" />
                          }
                        </button>
                        
                        {expandedFeatures[feature.id] && (
                          <div className="px-6 pb-6 bg-white animate-fade-in">
                            <p className="text-gray-700 pl-16">{feature.description}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Section application mobile */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-16 border border-green-100">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-3/5 p-8 flex flex-col justify-center">
                <div className="flex items-center mb-4">
                  <Smartphone size={32} className="text-green-800 mr-3" />
                  <h2 className="text-2xl font-bold text-green-800">Application Mobile Native</h2>
                </div>
                
                <p className="text-green-700 mb-6">
                  Fydo est disponible sur iOS et Android pour vous accompagner partout. Scannez les produits directement en magasin pour faire des choix éclairés au moment de l'achat.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="#" 
                    className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors transform hover:scale-105 duration-300"
                  >
                    <div className="mr-3">
                      <svg viewBox="0 0 24 24" width="24" height="24" className="fill-current">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-xs">Télécharger sur</div>
                      <div className="text-sm font-semibold">App Store</div>
                    </div>
                  </a>
                  
                  <a 
                    href="#" 
                    className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors transform hover:scale-105 duration-300"
                  >
                    <div className="mr-3">
                      <svg viewBox="0 0 24 24" width="24" height="24" className="fill-current">
                        <path d="M3,20.5C3,21.327,3.673,22,4.5,22h0c0.351,0,0.677-0.119,0.939-0.319l0.032-0.025l7.61-7.61l-2.549-2.549L3.02,19.51 l-0.025,0.032C2.795,19.803,2.676,20.149,2.676,20.5C2.675,20.5,3,20.5,3,20.5z"/>
                        <path d="M13.253,10.503L22.661,1.66c0.223-0.205,0.359-0.501,0.359-0.83c0-0.618-0.501-1.118-1.118-1.118 c-0.329,0-0.625,0.136-0.83,0.359l-0.069,0.072l-9.4,9.4L13.253,10.503z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-xs">Télécharger sur</div>
                      <div className="text-sm font-semibold">Google Play</div>
                    </div>
                  </a>
                </div>
              </div>
              
              <div className="md:w-2/5 bg-green-50 flex items-center justify-center p-8">
                <div className="relative max-w-[240px]">
                  <div className="w-full aspect-[9/19] border-8 border-gray-800 rounded-[28px] overflow-hidden shadow-xl bg-white">
                    <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 z-10 flex justify-center items-end">
                      <div className="w-20 h-4 bg-gray-900 rounded-b-lg"></div>
                    </div>
                    <div className="w-full h-full flex flex-col bg-gradient-to-br from-green-400 to-green-600 p-6 pt-8">
                      <div className="text-center text-white mb-8">
                        <div className="text-2xl font-bold mb-2">Fydo</div>
                        <div className="text-sm opacity-90">Scannez. Découvrez. Choisissez.</div>
                      </div>
                      
                      <div className="space-y-3 mb-8">
                        <div className="bg-white bg-opacity-20 rounded-lg p-3 flex items-center">
                          <Scan size={20} className="text-white mr-3" />
                          <span className="text-white text-sm">Scanner un produit</span>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-3 flex items-center">
                          <Search size={20} className="text-white mr-3" />
                          <span className="text-white text-sm">Rechercher</span>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-lg p-3 flex items-center">
                          <Heart size={20} className="text-white mr-3" />
                          <span className="text-white text-sm">Mes favoris</span>
                        </div>
                      </div>
                      
                      <div className="mt-auto flex justify-center">
                        <div className="w-16 h-1 bg-white bg-opacity-30 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section témoignages */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-green-800 mb-4">Ce que disent nos utilisateurs</h2>
              <p className="text-green-700 max-w-2xl mx-auto">
                Découvrez les retours authentiques de notre communauté d'utilisateurs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.name}
                  className={`bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-500 border border-green-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="font-bold text-green-800">{testimonial.initial}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{testimonial.name}</p>
                      <div className="flex text-yellow-400">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} size={14} className={star <= testimonial.rating ? "fill-current" : ""} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">"{testimonial.comment}"</p>
                  <p className="text-green-600 text-sm font-medium">{testimonial.duration}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white rounded-2xl p-6 shadow-md text-center transform hover:scale-[1.02] transition-all duration-500 border border-green-100">
              <div className="text-3xl font-bold text-green-800 mb-2">10,000+</div>
              <p className="text-green-700">Utilisateurs actifs</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md text-center transform hover:scale-[1.02] transition-all duration-500 border border-green-100">
              <div className="text-3xl font-bold text-green-800 mb-2">50,000+</div>
              <p className="text-green-700">Produits référencés</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md text-center transform hover:scale-[1.02] transition-all duration-500 border border-green-100">
              <div className="text-3xl font-bold text-green-800 mb-2">100,000+</div>
              <p className="text-green-700">Avis vérifiés</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md text-center transform hover:scale-[1.02] transition-all duration-500 border border-green-100">
              <div className="text-3xl font-bold text-green-800 mb-2">99%</div>
              <p className="text-green-700">Utilisateurs satisfaits</p>
            </div>
          </div>

          {/* Section CTA */}
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">Prêt à révolutionner vos choix de produits ?</h2>
              <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                Rejoignez des milliers d'utilisateurs qui font déjà confiance à Fydo pour leurs achats quotidiens.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/recherche-filtre"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
                >
                  Essayer maintenant
                </Link>
                
                <Link
                  to="/concept"
                  className="bg-white hover:bg-gray-50 text-green-700 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
                >
                  En savoir plus
                </Link>
              </div>
            </div>
          </div>

          {/* Suggestions de navigation */}
          <div className="bg-white rounded-2xl p-8 shadow-md border border-green-100">
            <h3 className="text-xl font-bold text-green-800 mb-6">Découvrez aussi :</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/top-produits"
                className="group p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Star size={32} className="text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-green-800 mb-2">Top Produits</h4>
                <p className="text-green-700 text-sm">Découvrez les produits les mieux notés par la communauté</p>
              </Link>
              
              <Link
                to="/concept"
                className="group p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Heart size={32} className="text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-blue-800 mb-2">Notre concept</h4>
                <p className="text-blue-700 text-sm">Découvrez la philosophie et la mission de Fydo</p>
              </Link>
              
              <Link
                to="/recherche-filtre"
                className="group p-6 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Search size={32} className="text-amber-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-amber-800 mb-2">Recherche avancée</h4>
                <p className="text-amber-700 text-sm">Utilisez nos outils de recherche et filtres avancés</p>
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

export default FeaturesPage;