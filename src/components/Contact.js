// src/components/Contact.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { 
  ChevronRight,
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Users,
  Shield,
  Zap,
  Heart,
  Star,
  Crown,
  Globe,
  Headphones,
  Sparkles,
  HelpCircle,
  Award
} from 'lucide-react';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [hoveredInfo, setHoveredInfo] = useState(null);

  // Déclencher les animations au chargement
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Types de demandes
  const contactTypes = [
    {
      id: 'general',
      title: 'Question générale',
      description: 'Informations sur Fydo, fonctionnalités, etc.',
      icon: <MessageSquare size={24} className="text-green-600" />,
      color: 'green'
    },
    {
      id: 'support',
      title: 'Support technique',
      description: 'Problème avec l\'application ou un bug',
      icon: <Headphones size={24} className="text-blue-600" />,
      color: 'blue'
    },
    {
      id: 'business',
      title: 'Partenariat / Business',
      description: 'Collaboration, partenariat ou proposition commerciale',
      icon: <Users size={24} className="text-amber-600" />,
      color: 'amber'
    },
    {
      id: 'feedback',
      title: 'Suggestion / Feedback',
      description: 'Idée d\'amélioration ou retour d\'expérience',
      icon: <Star size={24} className="text-purple-600" />,
      color: 'purple'
    }
  ];

  // Informations de contact
  const contactInfo = [
    {
      icon: <Mail size={24} className="text-green-600" />,
      title: 'Email',
      content: 'contact@fydo.fr',
      description: 'Écrivez-nous, nous répondons sous 24h',
      color: 'green'
    },
    {
      icon: <Clock size={24} className="text-blue-600" />,
      title: 'Horaires',
      content: 'Lun - Ven : 9h - 18h',
      description: 'Support disponible en semaine',
      color: 'blue'
    },
    {
      icon: <Globe size={24} className="text-purple-600" />,
      title: 'Localisation',
      content: 'France',
      description: 'Service client basé en France',
      color: 'purple'
    }
  ];

  // FAQ rapide
  const quickFaq = [
    {
      question: "Comment fonctionne la vérification des avis ?",
      answer: "Chaque avis est vérifié par photo du ticket de caisse pour garantir un achat réel."
    },
    {
      question: "L'application est-elle gratuite ?",
      answer: "Oui, Fydo propose un plan gratuit avec fonctionnalités de base, et des plans premium pour plus d'options."
    },
    {
      question: "Sur quels produits puis-je laisser des avis ?",
      answer: "Vous pouvez évaluer tous les produits alimentaires et cosmétiques avec code-barres."
    },
    {
      question: "Comment devenir membre Premium ?",
      answer: "Rendez-vous sur notre page abonnements pour découvrir nos offres Essential et Premium."
    }
  ];

  // Illustration animée du support
  const SupportIllustration = () => (
    <svg viewBox="0 0 400 300" className="w-full h-auto">
      <defs>
        <linearGradient id="supportGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#81C784', stopOpacity:1}}>
            <animate attributeName="stop-color" values="#81C784;#66BB6A;#81C784" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" style={{stopColor:'#4CAF50', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="supportGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#42A5F5', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#1E88E5', stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Cercle de fond */}
      <ellipse cx="200" cy="150" rx="120" ry="100" fill="url(#supportGrad1)" opacity="0.1" />
      
      {/* Opérateur support */}
      <g transform="translate(200, 150)">
        <circle cx="0" cy="-30" r="40" fill="white" stroke="#4CAF50" strokeWidth="3" />
        <circle cx="0" cy="-35" r="15" fill="#4CAF50" />
        <path d="M-20,-15 Q0,-5 20,-15" fill="#4CAF50" />
        
        {/* Casque audio */}
        <path d="M-30,-40 C-30,-55 -20,-65 0,-65 C20,-65 30,-55 30,-40" 
              fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        <rect x="-35" y="-45" width="10" height="20" rx="5" fill="#333" />
        <rect x="25" y="-45" width="10" height="20" rx="5" fill="#333" />
        
        {/* Micro */}
        <rect x="30" y="-30" width="20" height="4" rx="2" fill="#666" />
        <circle cx="52" cy="-28" r="6" fill="#666" />
      </g>
      
      {/* Bulles de message */}
      <g opacity="0.8">
        <g transform="translate(100, 80)">
          <rect x="-40" y="-15" width="80" height="30" rx="15" fill="white" stroke="#42A5F5" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#42A5F5" fontSize="12" fontWeight="medium">Bonjour !</text>
          <animateTransform attributeName="transform" type="translate" 
                            values="100,80; 105,75; 100,80" dur="3s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(300, 100)">
          <rect x="-45" y="-15" width="90" height="30" rx="15" fill="white" stroke="#4CAF50" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#4CAF50" fontSize="12" fontWeight="medium">Comment aider ?</text>
          <animateTransform attributeName="transform" type="translate" 
                            values="300,100; 295,95; 300,100" dur="3.5s" repeatCount="indefinite" />
        </g>
      </g>
      
      {/* Ondes de communication */}
      <g opacity="0.5">
        <circle cx="200" cy="120" r="80" fill="none" stroke="#4CAF50" strokeWidth="1">
          <animate attributeName="r" values="80;120;80" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="120" r="60" fill="none" stroke="#42A5F5" strokeWidth="1">
          <animate attributeName="r" values="60;100;60" dur="4s" begin="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="4s" begin="1s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Étoiles de satisfaction */}
      <g transform="translate(200, 230)">
        {[-40, -20, 0, 20, 40].map((offset, i) => (
          <path key={i} d={`M${offset},-10 L${offset+3},-3 L${offset+10},-3 L${offset+4},1 L${offset+6},8 L${offset},4 L${offset-6},8 L${offset-4},1 L${offset-10},-3 L${offset-3},-3 Z`}
                fill="#FFD700" opacity={i < 4 ? 1 : 0.3}>
            <animate attributeName="opacity" 
                     values={i < 4 ? "1;0.5;1" : "0.3;0.6;0.3"} 
                     dur="2s" 
                     begin={`${i * 0.2}s`} 
                     repeatCount="indefinite" />
          </path>
        ))}
      </g>
    </svg>
  );

  // Gestion du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulation d'envoi du formulaire
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Ici vous pouvez ajouter votre logique d'envoi d'email
      // const response = await sendContactForm(formData);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      green: 'from-green-100 to-green-200 border-green-300',
      blue: 'from-blue-100 to-blue-200 border-blue-300',
      amber: 'from-amber-100 to-amber-200 border-amber-300',
      purple: 'from-purple-100 to-purple-200 border-purple-300'
    };
    return colors[color] || colors.green;
  };

  return (
    <section className="py-20 bg-green-50 min-h-screen">
      <Helmet>
        <title>Contact | Fydo - Nous Sommes Là Pour Vous Aider</title>
        <meta name="description" content="Contactez l'équipe Fydo pour toute question, suggestion ou support technique. Nous répondons sous 24h à toutes vos demandes." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-green-600">
              <li><Link to="/" className="hover:text-green-800 transition-colors">Accueil</Link></li>
              <li><ChevronRight size={16} /></li>
              <li className="text-green-800 font-medium">Contact</li>
            </ol>
          </nav>

          {/* Header Section */}
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
              Nous Sommes Là pour <span className="text-green-600">Vous Aider</span>
            </h1>
            <p className="text-xl text-green-700 max-w-3xl mx-auto">
              Une question, une suggestion ou besoin d'aide ? Notre équipe vous répond rapidement
            </p>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center space-x-8 opacity-80 mt-8">
              <span className="text-sm text-green-700 flex items-center">
                <Clock size={16} className="mr-1" />
                Réponse sous 24h
              </span>
              <span className="text-sm text-green-700 flex items-center">
                <Shield size={16} className="mr-1" />
                Support en français
              </span>
              <span className="text-sm text-green-700 flex items-center">
                <Crown size={16} className="mr-1 text-amber-500" />
                Équipe dédiée
              </span>
            </div>
          </div>

          {/* Informations de contact avec animation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <div 
                key={info.title}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-500 border border-green-100 text-center cursor-pointer ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onMouseEnter={() => setHoveredInfo(info.title)}
                onMouseLeave={() => setHoveredInfo(null)}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${getColorClasses(info.color)} rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 ${
                  hoveredInfo === info.title ? 'scale-110' : ''
                }`}>
                  {info.icon}
                </div>
                <h3 className="font-bold text-green-800 mb-2">{info.title}</h3>
                <p className="text-lg font-medium text-gray-800 mb-1">{info.content}</p>
                <p className="text-sm text-gray-600">{info.description}</p>
              </div>
            ))}
          </div>

          {/* Section principale avec formulaire et illustration */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-16 border border-green-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              
              {/* Formulaire de contact */}
              <div className="p-8 lg:p-12">
                <h2 className="text-2xl font-bold text-green-800 mb-8">Envoyez-nous un message</h2>
                
                {/* Type de demande avec animation */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">Type de demande</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {contactTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleTypeChange(type.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                          formData.type === type.id
                            ? `bg-gradient-to-br ${getColorClasses(type.color)} border-${type.color}-500 shadow-lg transform scale-105`
                            : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          {type.icon}
                          <span className="ml-3 font-semibold text-gray-800">{type.title}</span>
                        </div>
                        <p className="text-xs text-gray-600">{type.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Votre nom"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Sujet *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Sujet de votre message"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-vertical"
                      placeholder="Décrivez votre demande en détail..."
                    ></textarea>
                  </div>

                  {/* Status messages */}
                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center animate-fade-in">
                      <CheckCircle size={20} className="text-green-600 mr-3" />
                      <span className="text-green-800">Message envoyé avec succès ! Nous vous répondrons sous 24h.</span>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center animate-fade-in">
                      <AlertCircle size={20} className="text-red-600 mr-3" />
                      <span className="text-red-800">Erreur lors de l'envoi. Veuillez réessayer ou nous contacter directement.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send size={20} className="mr-3" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Illustration et FAQ rapide */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 lg:p-12">
                <div className="mb-8">
                  <SupportIllustration />
                </div>
                
                {/* FAQ rapide */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center">
                    <HelpCircle size={24} className="mr-3 text-green-600" />
                    Questions fréquentes
                  </h3>
                  
                  <div className="space-y-4">
                    {quickFaq.map((faq, index) => (
                      <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-start">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {faq.question}
                        </h4>
                        <p className="text-gray-600 text-sm ml-5">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                  
                  <Link
                    to="/faq"
                    className="mt-6 text-green-600 hover:text-green-700 font-medium text-sm flex items-center justify-center transition-colors"
                  >
                    Voir toutes les FAQ
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Support premium */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 shadow-xl mb-16 border border-amber-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <Crown size={32} className="text-amber-600 mr-3" />
                  <h3 className="text-2xl font-bold text-amber-800">Support Premium</h3>
                </div>
                <p className="text-amber-700 mb-6">
                  Nos abonnés Essential et Premium bénéficient d'un support prioritaire avec des temps de réponse réduits et un accès à notre équipe technique spécialisée.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Zap size={20} className="text-amber-600 mr-3" />
                    <span className="text-sm text-amber-700">Réponse sous 4h (Essential)</span>
                  </div>
                  <div className="flex items-center">
                    <Crown size={20} className="text-amber-600 mr-3" />
                    <span className="text-sm text-amber-700">Réponse sous 2h (Premium)</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={20} className="text-amber-600 mr-3" />
                    <span className="text-sm text-amber-700">Support technique dédié</span>
                  </div>
                  <div className="flex items-center">
                    <Phone size={20} className="text-amber-600 mr-3" />
                    <span className="text-sm text-amber-700">Chat en direct (Premium)</span>
                  </div>
                </div>
                
                <Link
                  to="/abonnements"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 inline-flex items-center"
                >
                  <Crown size={20} className="mr-2" />
                  Découvrir les abonnements
                </Link>
              </div>
              
              <div className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                        <Award size={24} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Membre</p>
                        <p className="font-bold text-amber-600">Premium</p>
                      </div>
                    </div>
                    <Sparkles size={24} className="text-amber-500" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span>Support prioritaire 24/7</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span>Chat en direct</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span>Conseils personnalisés</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section CTA */}
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-white shadow-2xl relative overflow-hidden">
              {/* Motifs de fond */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full transform translate-x-48 -translate-y-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full transform -translate-x-48 translate-y-48"></div>
              </div>
              
              <div className="relative z-10">
                <MessageSquare size={48} className="mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4">Une question sur Fydo ?</h2>
                <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                  Notre équipe est là pour vous accompagner dans votre découverte de Fydo et répondre à toutes vos questions.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href="mailto:contact@fydo.fr"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 inline-flex items-center"
                  >
                    <Mail size={20} className="mr-2" />
                    Nous écrire directement
                  </a>
                  
                  <Link
                    to="/recherche-filtre"
                    className="bg-white hover:bg-gray-50 text-green-700 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
                  >
                    Essayer Fydo maintenant
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions de navigation */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-green-100">
            <h3 className="text-xl font-bold text-green-800 mb-6">Découvrez aussi :</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/concept"
                className="group p-6 bg-gradient-to-br from-green-50 to-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border border-green-100"
              >
                <Heart size={32} className="text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-green-800 mb-2">Notre concept</h4>
                <p className="text-green-700 text-sm">Découvrez pourquoi Fydo révolutionne vos achats</p>
              </Link>
              
              <Link
                to="/fonctionnalites"
                className="group p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border border-blue-100"
              >
                <Star size={32} className="text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-blue-800 mb-2">Fonctionnalités</h4>
                <p className="text-blue-700 text-sm">Explorez tous les outils Fydo à votre disposition</p>
              </Link>
              
              <Link
                to="/abonnements"
                className="group p-6 bg-gradient-to-br from-amber-50 to-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border border-amber-100"
              >
                <Crown size={32} className="text-amber-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-amber-800 mb-2">Abonnements</h4>
                <p className="text-amber-700 text-sm">Découvrez nos plans et support prioritaire</p>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Styles pour les animations */}
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
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Contact;