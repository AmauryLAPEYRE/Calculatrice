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
  Headphones
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
      icon: <MessageSquare size={24} className="text-green-600" />
    },
    {
      id: 'support',
      title: 'Support technique',
      description: 'Problème avec l\'application ou un bug',
      icon: <Headphones size={24} className="text-blue-600" />
    },
    {
      id: 'business',
      title: 'Partenariat / Business',
      description: 'Collaboration, partenariat ou proposition commerciale',
      icon: <Users size={24} className="text-amber-600" />
    },
    {
      id: 'feedback',
      title: 'Suggestion / Feedback',
      description: 'Idée d\'amélioration ou retour d\'expérience',
      icon: <Star size={24} className="text-pink-600" />
    }
  ];

  // Informations de contact
  const contactInfo = [
    {
      icon: <Mail size={20} className="text-green-600" />,
      title: 'Email',
      content: 'contact@fydo.fr',
      description: 'Écrivez-nous, nous répondons sous 24h'
    },
    {
      icon: <Clock size={20} className="text-green-600" />,
      title: 'Horaires',
      content: 'Lun - Ven : 9h - 18h',
      description: 'Support disponible en semaine'
    },
    {
      icon: <Globe size={20} className="text-green-600" />,
      title: 'Localisation',
      content: 'France',
      description: 'Service client basé en France'
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

  const selectedType = contactTypes.find(type => type.id === formData.type);

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

          {/* Informations de contact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <div 
                key={info.title}
                className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-500 border border-green-100 text-center ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {info.icon}
                </div>
                <h3 className="font-bold text-green-800 mb-2">{info.title}</h3>
                <p className="text-lg font-medium text-gray-800 mb-1">{info.content}</p>
                <p className="text-sm text-gray-600">{info.description}</p>
              </div>
            ))}
          </div>

          {/* Formulaire de contact et FAQ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            
            {/* Formulaire de contact */}
            <div className="bg-white rounded-2xl p-8 shadow-md border border-green-100">
              <h2 className="text-2xl font-bold text-green-800 mb-6">Envoyez-nous un message</h2>
              
              {/* Type de demande */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Type de demande</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {contactTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleTypeChange(type.id)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                        formData.type === type.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        {type.icon}
                        <span className="ml-2 font-medium text-gray-800">{type.title}</span>
                      </div>
                      <p className="text-xs text-gray-600">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={`Sujet de votre ${selectedType?.title.toLowerCase()}`}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
                    placeholder="Décrivez votre demande en détail..."
                  ></textarea>
                </div>

                {/* Status messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
                    <CheckCircle size={20} className="text-green-600 mr-2" />
                    <span className="text-green-800">Message envoyé avec succès ! Nous vous répondrons sous 24h.</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
                    <AlertCircle size={20} className="text-red-600 mr-2" />
                    <span className="text-red-800">Erreur lors de l'envoi. Veuillez réessayer ou nous contacter directement.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* FAQ rapide */}
            <div className="bg-white rounded-2xl p-8 shadow-md border border-green-100">
              <h2 className="text-2xl font-bold text-green-800 mb-6">Questions fréquentes</h2>
              
              <div className="space-y-6">
                {quickFaq.map((faq, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <h3 className="font-semibold text-green-800 mb-2 flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {faq.question}
                    </h3>
                    <p className="text-gray-700 ml-5 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-blue-800 mb-2">Besoin de plus d'informations ?</h4>
                <p className="text-blue-700 text-sm mb-3">
                  Consultez notre documentation complète ou explorez nos fonctionnalités.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    to="/fonctionnalites"
                    className="text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Voir les fonctionnalités
                  </Link>
                  <Link
                    to="/concept"
                    className="text-center bg-white hover:bg-gray-50 text-blue-600 font-medium py-2 px-4 rounded-lg border border-blue-200 transition-colors text-sm"
                  >
                    Notre concept
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Support premium */}
          <div className="bg-white rounded-2xl p-8 shadow-md mb-16 border border-green-100">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown size={40} className="text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-center text-green-800">Support Premium</h3>
              </div>
              
              <div className="md:w-2/3 md:pl-8">
                <h3 className="text-2xl font-bold text-green-800 mb-4">Besoin d'une aide prioritaire ?</h3>
                <p className="text-gray-700 mb-6">
                  Nos abonnés Essential et Premium bénéficient d'un support prioritaire avec des temps de réponse réduits et un accès à notre équipe technique spécialisée.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Zap size={18} className="text-green-600 mr-2" />
                    <span className="text-sm">Réponse sous 4h (Essential)</span>
                  </div>
                  <div className="flex items-center">
                    <Crown size={18} className="text-amber-600 mr-2" />
                    <span className="text-sm">Réponse sous 2h (Premium)</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={18} className="text-green-600 mr-2" />
                    <span className="text-sm">Support technique dédié</span>
                  </div>
                  <div className="flex items-center">
                    <Phone size={18} className="text-green-600 mr-2" />
                    <span className="text-sm">Chat en direct (Premium)</span>
                  </div>
                </div>
                
                <Link
                  to="/abonnements"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 inline-flex items-center"
                >
                  <Crown size={18} className="mr-2" />
                  Découvrir les abonnements
                </Link>
              </div>
            </div>
          </div>

          {/* Section CTA */}
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">Une question sur Fydo ?</h2>
              <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                Notre équipe est là pour vous accompagner dans votre découverte de Fydo et répondre à toutes vos questions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="mailto:contact@fydo.fr"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 inline-flex items-center"
                >
                  <Mail size={18} className="mr-2" />
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

          {/* Suggestions de navigation */}
          <div className="bg-white rounded-2xl p-8 shadow-md border border-green-100">
            <h3 className="text-xl font-bold text-green-800 mb-6">Découvrez aussi :</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/concept"
                className="group p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Heart size={32} className="text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-green-800 mb-2">Notre concept</h4>
                <p className="text-green-700 text-sm">Découvrez pourquoi Fydo révolutionne vos achats</p>
              </Link>
              
              <Link
                to="/fonctionnalites"
                className="group p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Star size={32} className="text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-blue-800 mb-2">Fonctionnalités</h4>
                <p className="text-blue-700 text-sm">Explorez tous les outils Fydo à votre disposition</p>
              </Link>
              
              <Link
                to="/abonnements"
                className="group p-6 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Crown size={32} className="text-amber-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-amber-800 mb-2">Abonnements</h4>
                <p className="text-amber-700 text-sm">Découvrez nos plans et support prioritaire.</p>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;