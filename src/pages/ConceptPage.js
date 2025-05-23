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
  Zap
} from 'lucide-react';

const ConceptPage = () => {
  const [activeSection, setActiveSection] = useState('mission');
  const [isVisible, setIsVisible] = useState(false);

  // Déclencher les animations au chargement
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Sections principales du concept
  const conceptSections = [
    {
      id: 'mission',
      icon: <Target size={32} className="text-green-600" />,
      title: "Notre Mission",
      subtitle: "Révolutionner vos choix de consommation",
      description: "Permettre aux consommateurs de partager leurs retours d'expérience authentiques sur les produits du quotidien.",
      color: "green"
    },
    {
      id: 'how-it-works',
      icon: <Lightbulb size={32} className="text-amber-600" />,
      title: "Comment ça fonctionne",
      subtitle: "Simple, rapide et fiable",
      description: "Un processus en 3 étapes pour découvrir, évaluer et partager vos expériences produits.",
      color: "amber"
    },
    {
      id: 'community',
      icon: <Users size={32} className="text-blue-600" />,
      title: "Communauté de confiance",
      subtitle: "Des avis 100% authentiques",
      description: "Une communauté collaborative où chaque membre contribue à améliorer l'expérience collective.",
      color: "blue"
    },
    {
      id: 'products',
      icon: <ShoppingBag size={32} className="text-pink-600" />,
      title: "Produits ciblés",
      subtitle: "Alimentaire et cosmétique",
      description: "Focus sur les deux catégories essentielles de votre quotidien avec des données précises.",
      color: "pink"
    }
  ];

  // Étapes du processus
  const processSteps = [
    {
      number: 1,
      icon: <Scan size={40} className="text-white" />,
      title: "Scannez",
      description: "Utilisez la caméra de votre smartphone pour scanner le code-barres d'un produit alimentaire ou cosmétique.",
      color: "bg-green-600",
      benefit: "Identification instantanée"
    },
    {
      number: 2,
      icon: <Eye size={40} className="text-white" />,
      title: "Découvrez",
      description: "Consultez les avis vérifiés des autres utilisateurs et la note moyenne détaillée.",
      color: "bg-amber-500",
      benefit: "Avis 100% vérifiés"
    },
    {
      number: 3,
      icon: <MessageSquare size={40} className="text-white" />,
      title: "Partagez",
      description: "Donnez votre propre avis après achat en téléchargeant une photo de votre ticket de caisse comme preuve.",
      color: "bg-green-600",
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
      badge: "bg-amber-100 border-amber-600"
    },
    {
      level: "Argent",
      color: "gray",
      icon: <Star className="text-gray-500 fill-gray-500" size={24} />,
      description: "Contributeurs actifs avec des avis réguliers et appréciés par la communauté.",
      badge: "bg-gray-100 border-gray-400"
    },
    {
      level: "Or",
      color: "yellow",
      icon: <Star className="text-yellow-600 fill-yellow-500" size={24} />,
      description: "Membres expérimentés reconnus pour la qualité et la pertinence de leurs contributions.",
      badge: "bg-yellow-100 border-yellow-500"
    },
    {
      level: "Diamant",
      color: "blue",
      icon: <Star className="text-blue-600 fill-blue-500" size={24} />,
      description: "Experts et contributeurs d'élite dont les avis sont particulièrement valorisés.",
      badge: "bg-blue-100 border-blue-400"
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
      ]
    },
    {
      title: "Produits cosmétiques", 
      icon: <Heart size={32} className="text-pink-600" />,
      items: [
        "Soins de la peau et du corps",
        "Maquillage et produits de beauté",
        "Parfums et eaux de toilette", 
        "Produits d'hygiène personnelle"
      ]
    }
  ];

  // Avantages clés
  const keyAdvantages = [
    {
      icon: <Shield size={24} className="text-green-600" />,
      title: "Avis fiables",
      description: "Tous les avis sont vérifiés par preuve d'achat pour une fiabilité maximale"
    },
    {
      icon: <Zap size={24} className="text-green-600" />,
      title: "Simple et rapide", 
      description: "Scannez et obtenez toutes les informations en quelques secondes"
    },
    {
      icon: <Users size={24} className="text-green-600" />,
      title: "Communauté active",
      description: "Rejoignez des milliers d'utilisateurs qui partagent leurs expériences"
    },
    {
      icon: <TrendingUp size={24} className="text-green-600" />,
      title: "Mise à jour continue",
      description: "Notre base de données s'enrichit chaque jour de nouveaux produits"
    }
  ];

  // Témoignage
  const testimonial = {
    initial: "L",
    name: "Lucas M.",
    rating: 5,
    comment: "Fydo a complètement changé ma façon de faire mes courses. Je ne me trompe plus jamais dans mes achats grâce aux avis de la communauté !",
    duration: "Utilisateur depuis 1 an"
  };

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

          {/* Header Section */}
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
              La Révolution des <span className="text-green-600">Avis Authentiques</span>
            </h1>
            <p className="text-xl text-green-700 max-w-3xl mx-auto">
              Une communauté qui transforme vos choix de produits grâce à des avis 100% vérifiés
            </p>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center space-x-8 opacity-80 mt-8">
              <span className="text-sm text-green-700 flex items-center">
                <Shield size={16} className="mr-1" />
                Avis vérifiés par ticket
              </span>
              <span className="text-sm text-green-700 flex items-center">
                <Users size={16} className="mr-1" />
                Communauté de confiance
              </span>
              <span className="text-sm text-green-700 flex items-center">
                <Crown size={16} className="mr-1 text-amber-500" />
                100% authentique
              </span>
            </div>
          </div>

          {/* Bannière concept principal */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-16 border border-green-100">
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
              <div className="w-full md:w-1/2 md:pl-8 flex justify-center p-8">
                <div className="w-64 h-64 bg-gradient-to-tr from-green-100 to-green-200 rounded-full flex items-center justify-center p-6 relative overflow-hidden">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-200 to-green-100 animate-pulse opacity-70"></div>
                  <div className="relative z-10 text-center">
                    <div className="text-green-800 font-bold text-3xl mb-2">Fydo</div>
                    <div className="text-amber-500 text-4xl mb-2">★</div>
                    <p className="text-sm text-green-700 max-w-[150px] mx-auto">
                      La communauté qui révolutionne vos choix
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation sections concept */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-16 border border-green-100">
            <div className="flex flex-wrap">
              {conceptSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex-1 min-w-[200px] py-6 px-4 flex flex-col items-center justify-center space-y-3 transition-all duration-300 ${
                    activeSection === section.id 
                      ? `bg-${section.color}-50 border-b-4 border-${section.color}-500` 
                      : 'hover:bg-green-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    activeSection === section.id ? `bg-${section.color}-100` : 'bg-green-100'
                  }`}>
                    {section.icon}
                  </div>
                  <div className="text-center">
                    <span className={`font-medium block ${
                      activeSection === section.id ? `text-${section.color}-800` : 'text-gray-700'
                    }`}>{section.title}</span>
                    <span className="text-xs text-gray-500">{section.subtitle}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contenu des sections */}
          {/* Section Mission */}
          {activeSection === 'mission' && (
            <div className="bg-white rounded-2xl p-8 shadow-md mb-16 border border-green-100 animate-fade-in">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Target size={32} className="text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-800">Notre Mission</h2>
                  <p className="text-green-600">Révolutionner vos choix de consommation</p>
                </div>
              </div>

              <p className="text-green-800 text-lg font-medium mb-6">
                Permettre aux consommateurs de partager leurs retours d'expérience authentiques sur les produits du quotidien.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <Check className="text-green-600" size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Espace d'expression authentique</h3>
                    <p className="text-gray-700 text-sm">
                      Créer un espace où les consommateurs peuvent s'exprimer sur la qualité, le goût, le rapport qualité-prix et d'autres critères pertinents.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <Check className="text-green-600" size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Garantie d'authenticité</h3>
                    <p className="text-gray-700 text-sm">
                      Garantir la fiabilité de chaque avis grâce à la vérification par ticket de caisse, éliminant les doutes sur leur authenticité.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <Check className="text-green-600" size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Feedback pour les marques</h3>
                    <p className="text-gray-700 text-sm">
                      Aider les marques à comprendre les attentes réelles de leurs clients pour mieux y répondre à travers leurs produits.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <Check className="text-green-600" size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Faciliter les choix</h3>
                    <p className="text-gray-700 text-sm">
                      Faciliter le choix des consommateurs en leur donnant accès à des retours d'expérience pertinents avant leurs achats.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section Comment ça marche */}
          {activeSection === 'how-it-works' && (
            <div className="bg-white rounded-2xl p-8 shadow-md mb-16 border border-green-100 animate-fade-in">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                  <Lightbulb size={32} className="text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-800">Comment ça fonctionne</h2>
                  <p className="text-amber-600">Simple, rapide et fiable</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {processSteps.map((step, index) => (
                  <div key={step.number} className="text-center relative">
                    {/* Ligne de connexion */}
                    {index < processSteps.length - 1 && (
                      <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gray-200 transform -translate-x-1/2 z-0"></div>
                    )}
                    
                    <div className={`relative z-10 w-24 h-24 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      {step.icon}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-sm font-bold text-gray-800">{step.number}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-green-800 mb-2">{step.title}</h3>
                    <p className="text-gray-700 mb-3">{step.description}</p>
                    <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      {step.benefit}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-amber-50 rounded-lg">
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
            <div className="bg-white rounded-2xl p-8 shadow-md mb-16 border border-green-100 animate-fade-in">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Users size={32} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-800">Communauté de confiance</h2>
                  <p className="text-blue-600">Des avis 100% authentiques</p>
                </div>
              </div>

              <p className="text-gray-700 mb-8">
                Fydo est une communauté collaborative où chaque membre contribue à améliorer l'expérience collective. Notre système de statut valorise les contributeurs réguliers et fiables :
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {communityLevels.map((level) => (
                  <div key={level.level} className={`bg-white p-6 rounded-xl shadow-sm border-t-4 ${level.badge} transform hover:scale-[1.02] transition-all duration-300`}>
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-full ${level.badge} flex items-center justify-center mr-3`}>
                        {level.icon}
                      </div>
                      <h4 className="font-semibold text-gray-800">{level.level}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{level.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <Globe size={24} className="text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">Une communauté grandissante</h3>
                    <p className="text-blue-700 text-sm">
                      Notre communauté grandit chaque jour, permettant à chacun de faire des choix plus éclairés pour sa santé et son bien-être grâce aux retours d'expérience partagés.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section Produits */}
          {activeSection === 'products' && (
            <div className="bg-white rounded-2xl p-8 shadow-md mb-16 border border-green-100 animate-fade-in">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                  <ShoppingBag size={32} className="text-pink-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-800">Produits ciblés</h2>
                  <p className="text-pink-600">Alimentaire et cosmétique</p>
                </div>
              </div>

              <p className="text-gray-700 mb-8">
                Fydo se concentre sur deux catégories essentielles qui font partie de votre quotidien :
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {productCategories.map((category) => (
                  <div key={category.title} className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                        {category.icon}
                      </div>
                      <h3 className="font-semibold text-green-800">{category.title}</h3>
                    </div>
                    <ul className="space-y-3">
                      {category.items.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <ChevronRight size={16} className="text-green-600 mr-2 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Avantages clés */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {keyAdvantages.map((advantage, index) => (
              <div 
                key={advantage.title}
                className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-500 border border-green-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  {advantage.icon}
                </div>
                <h3 className="font-bold text-green-800 mb-2">{advantage.title}</h3>
                <p className="text-green-700 text-sm">{advantage.description}</p>
              </div>
            ))}
          </div>

          {/* Section témoignage */}
          <div className="bg-white rounded-2xl p-8 shadow-md mb-16 border border-green-100">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <div className="bg-white p-6 rounded-xl shadow-md border border-green-100">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="font-bold text-green-800">{testimonial.initial}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{testimonial.name}</p>
                      <div className="flex text-yellow-400">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} size={16} className={star <= testimonial.rating ? "fill-current" : ""} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">"{testimonial.comment}"</p>
                  <p className="text-green-600 text-sm font-medium">{testimonial.duration}</p>
                </div>
              </div>
              
              <div className="md:w-2/3 md:pl-8">
                <h3 className="text-2xl font-bold text-green-800 mb-6">Pourquoi Fydo fait la différence ?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                      <Check className="text-green-600" size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Vérification unique</h4>
                      <p className="text-gray-600 text-sm">Seule plateforme à vérifier 100% des avis par ticket de caisse</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                      <Check className="text-green-600" size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Focus produits essentiels</h4>
                      <p className="text-gray-600 text-sm">Spécialisé dans l'alimentaire et le cosmétique</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                      <Check className="text-green-600" size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Communauté bienveillante</h4>
                      <p className="text-gray-600 text-sm">Membres motivés par l'entraide et le partage</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                      <Check className="text-green-600" size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Technologie accessible</h4>
                      <p className="text-gray-600 text-sm">Interface simple et intuitive pour tous</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section CTA */}
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">Rejoignez la révolution des avis authentiques</h2>
              <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                Partagez vos expériences avec des milliers d'autres consommateurs et contribuez à améliorer les produits que nous utilisons tous les jours.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/signup"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
                >
                  Créer un compte gratuit
                </Link>
                
                <Link
                  to="/recherche-filtre"
                  className="bg-white hover:bg-gray-50 text-green-700 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
                >
                  Essayer le scan
                </Link>
              </div>
            </div>
          </div>

          {/* Suggestions de navigation */}
          <div className="bg-white rounded-2xl p-8 shadow-md border border-green-100">
            <h3 className="text-xl font-bold text-green-800 mb-6">Découvrez aussi :</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/fonctionnalites"
                className="group p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Smartphone size={32} className="text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-green-800 mb-2">Fonctionnalités</h4>
                <p className="text-green-700 text-sm">Explorez tous les outils Fydo à votre disposition</p>
              </Link>
              
              <Link
                to="/top-produits"
                className="group p-6 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Star size={32} className="text-amber-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-amber-800 mb-2">Top Produits</h4>
                <p className="text-amber-700 text-sm">Découvrez les produits les mieux notés par la communauté</p>
              </Link>
              
              <Link
                to="/recherche-filtre"
                className="group p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Scan size={32} className="text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-blue-800 mb-2">Commencer</h4>
                <p className="text-blue-700 text-sm">Scannez votre premier produit dès maintenant</p>
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