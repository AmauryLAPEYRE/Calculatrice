// src/components/FAQ.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown,
  HelpCircle,
  Camera, 
  Star, 
  MessageSquare, 
  Shield,
  CreditCard,
  User,
  Globe,
  Sparkles,
  Receipt,
  ShoppingBag,
  Heart,
  Trophy,
  Search,
  Phone
} from 'lucide-react';

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
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
      { threshold: 0.1 }
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

  // Illustration moderne FAQ
  const FAQIllustration = () => (
    <svg viewBox="0 0 400 300" className="w-full h-auto">
      <defs>
        <linearGradient id="faqGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#81C784', stopOpacity:1}}>
            <animate attributeName="stop-color" values="#81C784;#66BB6A;#81C784" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" style={{stopColor:'#4CAF50', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="faqGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#42A5F5', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#1E88E5', stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Blob de fond */}
      <ellipse cx="200" cy="150" rx="150" ry="120" fill="url(#faqGrad1)" opacity="0.1" />
      
      {/* Point d'interrogation central */}
      <g transform="translate(200, 150)">
        <circle cx="0" cy="0" r="80" fill="white" stroke="url(#faqGrad1)" strokeWidth="3" />
        
        {/* Point d'interrogation stylisé */}
        <path d="M0,-40 Q-20,-40 -20,-20 Q-20,-10 -10,-5 Q0,0 0,10" 
              fill="none" stroke="#4CAF50" strokeWidth="6" strokeLinecap="round" />
        <circle cx="0" cy="30" r="6" fill="#4CAF50" />
        
        {/* Effet de brillance */}
        <ellipse cx="-20" cy="-20" rx="15" ry="25" fill="white" opacity="0.3" />
        
        {/* Animation de pulsation */}
        <circle cx="0" cy="0" r="80" fill="none" stroke="#4CAF50" strokeWidth="2" opacity="0">
          <animate attributeName="r" values="80;100;80" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Bulles de questions flottantes */}
      <g opacity="0.8">
        <g transform="translate(100, 80)">
          <rect x="-30" y="-15" width="60" height="30" rx="15" fill="white" stroke="#42A5F5" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#42A5F5" fontSize="20" fontWeight="bold">?</text>
          <animateTransform attributeName="transform" type="translate" 
                            values="100,80; 105,70; 100,80" dur="3s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(300, 100)">
          <rect x="-25" y="-15" width="50" height="30" rx="15" fill="white" stroke="#FFD700" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#FFA726" fontSize="16" fontWeight="bold">!</text>
          <animateTransform attributeName="transform" type="translate" 
                            values="300,100; 295,90; 300,100" dur="3.5s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(120, 200)">
          <rect x="-35" y="-15" width="70" height="30" rx="15" fill="white" stroke="#CE93D8" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#CE93D8" fontSize="12" fontWeight="medium">FAQ</text>
          <animateTransform attributeName="transform" type="translate" 
                            values="120,200; 125,195; 120,200" dur="4s" repeatCount="indefinite" />
        </g>
      </g>
      
      {/* Particules décoratives */}
      <g opacity="0.6">
        <circle cx="80" cy="150" r="3" fill="#81C784">
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="320" cy="180" r="4" fill="#42A5F5">
          <animate attributeName="r" values="4;6;4" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="250" cy="50" r="2" fill="#FFD700">
          <animate attributeName="r" values="2;3;2" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Icônes flottantes */}
      <g opacity="0.7">
        <g transform="translate(50, 120)">
          <circle cx="0" cy="0" r="20" fill="white" stroke="#4CAF50" strokeWidth="2" />
          <path d="M-8,-8 L-8,-3 M-8,-8 L-3,-8 M8,-8 L3,-8 M8,-8 L8,-3 M-8,8 L-8,3 M-8,8 L-3,8 M8,8 L8,3 M8,8 L3,8"
                stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round" />
          <animateTransform attributeName="transform" type="rotate" 
                            from="0 50 120" to="360 50 120" dur="20s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(350, 150)">
          <circle cx="0" cy="0" r="20" fill="white" stroke="#FFD700" strokeWidth="2" />
          <path d="M0,-8 L2,-2 L8,-2 L3,1 L5,7 L0,3 L-5,7 L-3,1 L-8,-2 L-2,-2 Z" 
                fill="#FFD700" />
          <animateTransform attributeName="transform" type="rotate" 
                            from="0 350 150" to="-360 350 150" dur="15s" repeatCount="indefinite" />
        </g>
      </g>
    </svg>
  );

  // Catégories de FAQ avec style moderne
  const categories = [
    { id: 'general', name: 'Questions générales', icon: <HelpCircle size={20} />, color: 'green' },
    { id: 'scan', name: 'Scan et recherche', icon: <Camera size={20} />, color: 'blue' },
    { id: 'reviews', name: 'Avis et évaluations', icon: <Star size={20} className="fill-current" />, color: 'amber' },
    { id: 'account', name: 'Compte et profil', icon: <User size={20} />, color: 'purple' },
    { id: 'subscription', name: 'Abonnements', icon: <CreditCard size={20} />, color: 'pink' },
    { id: 'data', name: 'Données et sécurité', icon: <Shield size={20} />, color: 'sky' }
  ];

  // Questions par catégorie
  const faqQuestions = {
    general: [
      {
        id: 'what-is-fydo',
        question: "Qu'est-ce que FYDO ?",
        answer: "FYDO est une application communautaire qui vous permet de scanner les codes-barres des produits alimentaires et cosmétiques pour accéder instantanément à leurs informations détaillées et aux avis d'autres utilisateurs. Notre objectif est de vous aider à faire des choix plus éclairés pour vos achats du quotidien.",
        icon: <Sparkles size={16} />
      },
      {
        id: 'how-fydo-works',
        question: "Comment fonctionne FYDO ?",
        answer: "FYDO fonctionne en 3 étapes simples : 1) Scannez le code-barres d'un produit avec votre smartphone, 2) Consultez les informations nutritionnelles, environnementales et les avis vérifiés des autres utilisateurs, 3) Donnez votre propre avis après achat en téléchargeant une photo de votre ticket de caisse comme preuve.",
        icon: <Trophy size={16} />
      },
      {
        id: 'fydo-cost',
        question: "FYDO est-il gratuit ?",
        answer: "FYDO propose une version gratuite avec des fonctionnalités de base ainsi que des abonnements payants (mensuel ou annuel) qui offrent des fonctionnalités supplémentaires comme un nombre illimité de scans, la possibilité de mettre des produits en favoris et d'accéder à davantage d'avis.",
        icon: <Heart size={16} />
      },
      {
        id: 'supported-products',
        question: "Quels types de produits sont supportés par FYDO ?",
        answer: "FYDO se concentre principalement sur les produits alimentaires et cosmétiques disponibles dans le commerce. Notre base de données s'enrichit quotidiennement grâce aux contributions des utilisateurs et à notre partenariat avec OpenFoodFacts.",
        icon: <ShoppingBag size={16} />
      }
    ],
    scan: [
      {
        id: 'scan-limit',
        question: "Y a-t-il une limite au nombre de scans que je peux effectuer ?",
        answer: "Le nombre de scans dépend de votre type d'abonnement. Avec un compte gratuit, vous disposez d'un nombre limité de scans par jour. Les abonnements payants offrent un nombre de scans plus élevé, voire illimité avec certaines formules premium.",
        icon: <Camera size={16} />
      },
      {
        id: 'scan-not-working',
        question: "Que faire si le scan du code-barres ne fonctionne pas ?",
        answer: "Si le scan ne fonctionne pas, vous pouvez saisir manuellement le code-barres dans l'onglet de recherche. Assurez-vous que l'éclairage est suffisant et que le code-barres est bien visible. Si un produit n'est pas reconnu, vous pouvez contribuer en ajoutant ses informations à notre base de données.",
        icon: <Search size={16} />
      },
      {
        id: 'search-by-name',
        question: "Puis-je rechercher un produit par son nom plutôt que par son code-barres ?",
        answer: "Oui, FYDO vous permet de rechercher des produits par leur nom. Utilisez l'onglet de recherche par nom et vous pourrez même appliquer des filtres avancés, comme la recherche par ingrédients inclus ou exclus (par exemple: rechercher des produits SANS gluten ou AVEC du céleri).",
        icon: <Search size={16} />
      }
    ],
    reviews: [
      {
        id: 'leave-review',
        question: "Comment puis-je laisser un avis sur un produit ?",
        answer: "Pour laisser un avis, recherchez d'abord le produit concerné, puis cliquez sur le bouton 'Donner mon avis'. Vous pourrez attribuer des notes sur différents critères (goût, quantité, rapport qualité/prix) et laisser un commentaire. Pour renforcer la fiabilité, vous devrez télécharger une photo de votre ticket de caisse prouvant votre achat.",
        icon: <MessageSquare size={16} />
      },
      {
        id: 'verified-reviews',
        question: "Qu'est-ce qu'un 'avis vérifié' ?",
        answer: "Un 'avis vérifié' signifie que l'utilisateur a fourni une preuve d'achat (ticket de caisse) qui a été validée par notre système. Ces avis sont considérés comme plus fiables car ils proviennent de personnes ayant réellement acheté et utilisé le produit. Les avis vérifiés sont identifiés par un badge spécial.",
        icon: <Receipt size={16} />
      }
    ],
    account: [
      {
        id: 'create-account',
        question: "Comment créer un compte FYDO ?",
        answer: "Pour créer un compte, cliquez sur 'Inscription' dans le menu principal. Vous devrez fournir une adresse e-mail valide et créer un mot de passe. Vous pouvez également vous inscrire via votre compte Google ou Facebook pour plus de simplicité. Une fois inscrit, vous pourrez personnaliser votre profil et accéder à toutes les fonctionnalités de FYDO.",
        icon: <User size={16} />
      },
      {
        id: 'account-benefits',
        question: "Quels sont les avantages d'avoir un compte ?",
        answer: "Avoir un compte vous permet de publier des avis, de sauvegarder vos produits favoris, de consulter votre historique de recherche, de recevoir des recommandations personnalisées et d'accéder à des fonctionnalités exclusives selon votre abonnement. De plus, vos paramètres et préférences sont sauvegardés entre les sessions.",
        icon: <Trophy size={16} />
      }
    ],
    subscription: [
      {
        id: 'subscription-plans',
        question: "Quels sont les différents plans d'abonnement ?",
        answer: "FYDO propose plusieurs formules d'abonnement : Gratuit (fonctionnalités de base), Essential (notre offre la plus populaire avec un nombre accru de scans et la possibilité d'ajouter des favoris), et Premium (accès illimité à toutes les fonctionnalités). Vous pouvez consulter le détail des offres et leurs tarifs dans la section 'Abonnements' de l'application.",
        icon: <CreditCard size={16} />
      },
      {
        id: 'payment-methods',
        question: "Quels moyens de paiement sont acceptés ?",
        answer: "FYDO accepte les cartes de crédit/débit (Visa, Mastercard, American Express), ainsi que les paiements via Apple Pay et Google Pay. Toutes les transactions sont sécurisées et vos informations de paiement ne sont jamais stockées sur nos serveurs.",
        icon: <Shield size={16} />
      }
    ],
    data: [
      {
        id: 'data-sources',
        question: "D'où proviennent les données sur les produits ?",
        answer: "Les données proviennent principalement de la base OpenFoodFacts, que nous enrichissons avec les contributions de notre communauté. Pour les informations nutritionnelles et environnementales, nous utilisons des sources officielles comme les étiquettes des produits et les bases de données Nutri-Score et Eco-Score. Les avis sont générés exclusivement par notre communauté d'utilisateurs.",
        icon: <Globe size={16} />
      },
      {
        id: 'data-privacy',
        question: "Comment mes données personnelles sont-elles protégées ?",
        answer: "FYDO respecte strictement le RGPD et autres réglementations sur la protection des données. Vos informations personnelles sont chiffrées et ne sont jamais partagées avec des tiers sans votre consentement explicite. Les tickets de caisse que vous téléchargez sont anonymisés automatiquement avant tout traitement. Pour plus de détails, consultez notre politique de confidentialité.",
        icon: <Shield size={16} />
      }
    ]
  };

  // Fonction pour gérer le clic sur une question
  const handleQuestionClick = (questionId) => {
    setActiveQuestion(activeQuestion === questionId ? null : questionId);
  };

  const getCategoryColor = (color) => {
    const colors = {
      green: 'from-green-100 to-green-200 border-green-300 text-green-700',
      blue: 'from-blue-100 to-blue-200 border-blue-300 text-blue-700',
      amber: 'from-amber-100 to-amber-200 border-amber-300 text-amber-700',
      purple: 'from-purple-100 to-purple-200 border-purple-300 text-purple-700',
      pink: 'from-pink-100 to-pink-200 border-pink-300 text-pink-700',
      sky: 'from-sky-100 to-sky-200 border-sky-300 text-sky-700'
    };
    return colors[color] || colors.green;
  };

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-white to-green-50 relative overflow-hidden" ref={sectionRef}>
      {/* Motifs de fond */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full transform translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200 rounded-full transform -translate-x-48 translate-y-48"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-12 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Foire Aux <span className="text-green-600">Questions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trouvez des réponses aux questions les plus fréquemment posées sur FYDO et son fonctionnement
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Illustration à gauche */}
            <div className={`lg:col-span-1 transition-all duration-700 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div className="sticky top-20">
                <FAQIllustration />
                
                {/* Carte de contact */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mt-8 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <Phone size={24} className="text-green-600 mr-3" />
                    <h3 className="text-lg font-bold text-gray-800">Besoin d'aide ?</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Notre équipe est là pour vous aider avec toutes vos questions.
                  </p>
                  <a 
                    href="mailto:support@fydo.app" 
                    className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 w-full justify-center"
                  >
                    <MessageSquare size={18} className="mr-2" />
                    Contacter le support
                  </a>
                </div>
              </div>
            </div>
            
            {/* Questions à droite */}
            <div className="lg:col-span-2">
              {/* Navigation par catégories */}
              <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 mb-8 transition-all duration-700 delay-200 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {categories.map((category, index) => {
                  const cat = categories.find(c => c.id === category.id);
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`relative p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                        activeCategory === category.id 
                          ? `bg-gradient-to-br ${getCategoryColor(cat.color)} shadow-lg ring-2 ring-${cat.color}-400` 
                          : 'bg-white hover:shadow-md border border-gray-200'
                      }`}
                      style={{ transitionDelay: `${100 + index * 50}ms` }}
                    >
                      <div className="flex flex-col items-center">
                        <div className={`mb-2 ${activeCategory === category.id ? '' : 'text-gray-600'}`}>
                          {React.cloneElement(category.icon, { 
                            className: category.id === 'reviews' && activeCategory === category.id ? 'text-amber-600' : ''
                          })}
                        </div>
                        <span className={`text-sm font-medium ${
                          activeCategory === category.id ? '' : 'text-gray-700'
                        }`}>{category.name}</span>
                      </div>
                      
                      {/* Indicateur actif */}
                      {activeCategory === category.id && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-green-500 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Contenu des FAQs */}
              <div className="space-y-4">
                {Object.keys(faqQuestions).map((categoryId) => (
                  <div 
                    key={categoryId}
                    className={`transition-all duration-500 ${
                      activeCategory === categoryId ? 'block' : 'hidden'
                    }`}
                  >
                    {faqQuestions[categoryId].map((item, index) => (
                      <div 
                        key={item.id}
                        className={`bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] ${
                          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                        style={{ transitionDelay: `${300 + index * 100}ms` }}
                      >
                        <button
                          onClick={() => handleQuestionClick(item.id)}
                          className={`w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none ${
                            activeQuestion === item.id ? 'bg-gradient-to-r from-green-50 to-white' : 'hover:bg-gray-50'
                          }`}
                          aria-expanded={activeQuestion === item.id}
                        >
                          <div className="flex items-center flex-1">
                            <div className="mr-4 text-green-600">
                              {item.icon}
                            </div>
                            <span className="font-medium text-gray-800 pr-4">{item.question}</span>
                          </div>
                          <ChevronDown 
                            className={`text-green-600 transition-transform duration-300 flex-shrink-0 ${
                              activeQuestion === item.id ? 'transform rotate-180' : ''
                            }`} 
                            size={20}
                          />
                        </button>
                        
                        {/* Contenu de la réponse avec animation */}
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            activeQuestion === item.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="px-6 py-5 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50">
                            <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Section CTA */}
          <div className={`mt-16 text-center transition-all duration-700 delay-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-white max-w-4xl mx-auto shadow-xl">
              <HelpCircle size={48} className="mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-4">Vous n'avez pas trouvé votre réponse ?</h3>
              <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                Notre équipe de support est là pour vous aider avec toutes vos questions spécifiques
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:support@fydo.app" 
                  className="inline-flex items-center bg-white hover:bg-gray-50 text-green-700 font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <MessageSquare size={20} className="mr-2" />
                  Contacter notre support
                </a>
                <a 
                  href="#telecharger"
                  className="inline-flex items-center bg-green-800 hover:bg-green-900 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Sparkles size={20} className="mr-2" />
                  Télécharger l'app
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;