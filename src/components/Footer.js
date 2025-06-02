// src/components/Footer.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  Youtube,
  Send,
  Star,
  Shield,
  Award,
  Users,
  Heart,
  ArrowUp,
  Sparkles,
  CheckCircle,
  ChevronRight,
  Scan,
  TrendingUp,
  Crown, 
  Flame
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Observer pour les animations
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const footerElement = document.getElementById('footer');
    if (footerElement) {
      observer.observe(footerElement);
    }

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (footerElement) {
        observer.unobserve(footerElement);
      }
    };
  }, []);

  // Fonction pour remonter en haut
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fonction pour gérer l'inscription à la newsletter
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Simulation d'inscription
    setTimeout(() => {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }, 1000);
  };

  // Liens de navigation - AVEC LABELS COURTS
  const navigationLinks = {
    produits: [
      { name: 'Scanner un produit', nameShort: 'Scanner', path: '/recherche-filtre', icon: <Scan size={16} /> },
      { name: 'Top Produits', nameShort: 'Top', path: '/top-produits', icon: <TrendingUp size={16} /> },
      { name: 'Challenges', nameShort: 'Challenges', path: '/challenges', icon: <Award size={16} />, badge: 'NEW' },
      { name: 'Avis récents', nameShort: 'Avis', path: '/recherche-filtre', icon: <Star size={16} /> }
    ],
    entreprise: [
      { name: 'Notre concept', nameShort: 'Concept', path: '/concept', icon: <Heart size={16} /> },
      { name: 'Fonctionnalités', nameShort: 'Fonctions', path: '/fonctionnalites', icon: <Sparkles size={16} /> },
      { name: 'Abonnements', nameShort: 'Abonnements', path: '/abonnements', icon: <Crown size={16} /> },
      { name: 'Contact', nameShort: 'Contact', path: '/contact', icon: <Phone size={16} /> }
    ],
    legal: [
      { name: 'Conditions d\'utilisation', nameShort: 'CGU' },
      { name: 'Politique de confidentialité', nameShort: 'Confidentialité' },
      { name: 'Mentions légales', nameShort: 'Mentions' },
      { name: 'Cookies', nameShort: 'Cookies' }
    ],
    support: [
      { name: 'Centre d\'aide', nameShort: 'Aide' },
      { name: 'FAQ', nameShort: 'FAQ' },
      { name: 'Nous contacter', nameShort: 'Contact' },
      { name: 'Signaler un bug', nameShort: 'Bug' }
    ]
  };

  // Badges de confiance - AVEC LABELS COURTS
  const trustBadges = [
    { icon: <Shield size={20} />, text: '100% Sécurisé', textShort: 'Sécurisé' },
    { icon: <CheckCircle size={20} />, text: 'Avis vérifiés', textShort: 'Vérifiés' },
    { icon: <Users size={20} />, text: '10K+ membres', textShort: '10K+' },
    { icon: <Star size={20} />, text: '4.8/5 Note', textShort: '4.8/5' }
  ];

  // Réseaux sociaux
  const socialLinks = [
    { name: 'Facebook', icon: <Facebook size={20} />, url: '#', color: 'hover:bg-blue-600' },
    { name: 'Instagram', icon: <Instagram size={20} />, url: '#', color: 'hover:bg-pink-600' },
    { name: 'Twitter', icon: <Twitter size={20} />, url: '#', color: 'hover:bg-sky-500' },
    { name: 'LinkedIn', icon: <Linkedin size={20} />, url: '#', color: 'hover:bg-blue-700' },
    { name: 'YouTube', icon: <Youtube size={20} />, url: '#', color: 'hover:bg-red-600' }
  ];

  return (
    <footer id="footer" className="relative bg-gradient-to-br from-green-800 to-green-900 text-white overflow-hidden">
      {/* Motifs de fond - RESPONSIVE */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-green-600 rounded-full transform translate-x-24 sm:translate-x-32 lg:translate-x-48 -translate-y-24 sm:-translate-y-32 lg:-translate-y-48"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-green-700 rounded-full transform -translate-x-24 sm:-translate-x-32 lg:-translate-x-48 translate-y-24 sm:translate-y-32 lg:translate-y-48"></div>
      </div>

      {/* Newsletter Section - SIMPLIFIÉE SUR MOBILE */}
      <div className="relative z-10 bg-green-700 bg-opacity-50">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:py-12">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <Mail size={24} className="sm:w-8 sm:h-8 text-green-300 mr-2 sm:mr-3" />
              <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold">
                <span className="hidden sm:inline">Restez informé avec Fydo</span>
                <span className="sm:hidden">Newsletter Fydo</span>
              </h3>
            </div>
            <p className="text-green-100 mb-4 sm:mb-6 lg:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              <span className="hidden sm:inline">Recevez les dernières actualités, conseils produits et offres exclusives directement dans votre boîte mail</span>
              <span className="sm:hidden">Actualités et offres exclusives</span>
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="w-full px-4 py-3 sm:px-6 sm:py-4 pr-24 sm:pr-32 rounded-full text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-green-400 transition-all text-sm sm:text-base"
                />
                <button
                  type="submit"
                  className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 sm:px-6 sm:py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg flex items-center text-sm sm:text-base"
                >
                  <Send size={14} className="sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">S'inscrire</span>
                  <span className="sm:hidden">OK</span>
                </button>
              </div>
              
              {isSubscribed && (
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-green-600 bg-opacity-50 rounded-full inline-flex items-center animate-fade-in">
                  <CheckCircle size={16} className="sm:w-5 sm:h-5 mr-2" />
                  <span className="text-xs sm:text-sm">
                    <span className="hidden sm:inline">Merci ! Vous êtes maintenant inscrit à notre newsletter.</span>
                    <span className="sm:hidden">Inscrit avec succès !</span>
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content - RESPONSIVE */}
      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-12">
          
          {/* Logo et description - RESPONSIVE */}
          <div className={`sm:col-span-2 lg:col-span-1 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="mb-4 sm:mb-6">
              <Link to="/" className="inline-flex items-center group">
                <div className="text-white text-3xl sm:text-4xl font-bold group-hover:scale-105 transition-transform">
                  Fydo
                </div>
                <Star className="text-yellow-400 fill-yellow-400 ml-2 animate-pulse" size={24} />
              </Link>
            </div>
            <p className="text-green-100 mb-4 sm:mb-6 text-sm sm:text-base">
              <span className="hidden sm:inline">La communauté qui révolutionne vos choix de produits au quotidien avec des avis 100% vérifiés.</span>
              <span className="sm:hidden">Avis 100% vérifiés pour vos achats quotidiens.</span>
            </p>
            
            {/* Badges de confiance - RESPONSIVE */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {trustBadges.map((badge, index) => (
                <div 
                  key={badge.text}
                  className="bg-green-700 bg-opacity-50 rounded-lg p-2 sm:p-3 flex items-center space-x-2 hover:bg-opacity-70 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-green-300 flex-shrink-0">{React.cloneElement(badge.icon, { size: 16 })}</span>
                  <span className="text-xs sm:text-sm">
                    <span className="hidden sm:inline">{badge.text}</span>
                    <span className="sm:hidden">{badge.textShort}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Liens de navigation - VERSION MOBILE OPTIMISÉE */}
          <div className={`sm:col-span-2 lg:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Produits */}
            <div>
              <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 flex items-center">
                <span className="w-6 h-0.5 sm:w-8 sm:h-1 bg-green-400 mr-2 sm:mr-3"></span>
                <span className="hidden sm:inline">Produits</span>
                <span className="sm:hidden">App</span>
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {navigationLinks.produits.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="flex items-center text-green-100 hover:text-white transition-colors group text-xs sm:text-sm"
                    >
                      <span className="mr-1 sm:mr-2 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        {React.cloneElement(link.icon, { size: 14 })}
                      </span>
                      <span className="hidden sm:inline">{link.name}</span>
                      <span className="sm:hidden">{link.nameShort}</span>
                      {link.badge && (
                        <span className="ml-1 sm:ml-2 bg-red-500 text-white text-xs px-1 sm:px-2 py-0.5 rounded-full animate-pulse">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Entreprise */}
            <div>
              <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 flex items-center">
                <span className="w-6 h-0.5 sm:w-8 sm:h-1 bg-amber-400 mr-2 sm:mr-3"></span>
                <span className="hidden sm:inline">Entreprise</span>
                <span className="sm:hidden">Info</span>
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {navigationLinks.entreprise.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="flex items-center text-green-100 hover:text-white transition-colors group text-xs sm:text-sm"
                    >
                      <span className="mr-1 sm:mr-2 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        {React.cloneElement(link.icon, { size: 14 })}
                      </span>
                      <span className="hidden sm:inline">{link.name}</span>
                      <span className="sm:hidden">{link.nameShort}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Légal - MASQUÉ SUR TRÈS PETIT MOBILE, VISIBLE À PARTIR DE SM */}
            <div className="hidden sm:block">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 flex items-center">
                <span className="w-6 h-0.5 sm:w-8 sm:h-1 bg-blue-400 mr-2 sm:mr-3"></span>
                Légal
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {navigationLinks.legal.slice(0, 3).map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path || '/mentions-legales'} 
                      className="text-green-100 hover:text-white transition-colors flex items-center group text-xs sm:text-sm"
                    >
                      <ChevronRight size={12} className="sm:w-3 sm:h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="hidden lg:inline">{link.name}</span>
                      <span className="lg:hidden">{link.nameShort}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support - MASQUÉ SUR TRÈS PETIT MOBILE, VISIBLE À PARTIR DE SM */}
            <div className="hidden sm:block">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 flex items-center">
                <span className="w-6 h-0.5 sm:w-8 sm:h-1 bg-purple-400 mr-2 sm:mr-3"></span>
                Support
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {navigationLinks.support.slice(0, 3).map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path || '/contact'} 
                      className="text-green-100 hover:text-white transition-colors flex items-center group text-xs sm:text-sm"
                    >
                      <ChevronRight size={12} className="sm:w-3 sm:h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="hidden lg:inline">{link.name}</span>
                      <span className="lg:hidden">{link.nameShort}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact et App - RESPONSIVE */}
          <div className={`sm:col-span-2 lg:col-span-1 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 flex items-center">
              <span className="w-6 h-0.5 sm:w-8 sm:h-1 bg-pink-400 mr-2 sm:mr-3"></span>
              Contact
            </h3>
            
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <a href="mailto:contact@fydo.fr" className="flex items-center text-green-100 hover:text-white transition-colors text-xs sm:text-sm">
                <Mail size={16} className="sm:w-4 sm:h-4 mr-2 sm:mr-3 text-green-400 flex-shrink-0" />
                contact@fydo.fr
              </a>
              <div className="flex items-start text-green-100 text-xs sm:text-sm">
                <MapPin size={16} className="sm:w-4 sm:h-4 mr-2 sm:mr-3 text-green-400 mt-0.5 flex-shrink-0" />
                <span>France</span>
              </div>
            </div>

            {/* Boutons téléchargement app - RESPONSIVE */}
            <div className="space-y-2 sm:space-y-3">
              <a href="#" className="block bg-black hover:bg-gray-900 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">
                      <span className="hidden sm:inline">Télécharger sur</span>
                      <span className="sm:hidden">Sur</span>
                    </div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </div>
              </a>
              
              <a href="#" className="block bg-black hover:bg-gray-900 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">
                      <span className="hidden sm:inline">Disponible sur</span>
                      <span className="sm:hidden">Sur</span>
                    </div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section - RESPONSIVE */}
        <div className="border-t border-green-700 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            
            {/* Copyright - RESPONSIVE */}
            <div className="text-center sm:text-left">
              <p className="text-green-100 text-xs sm:text-sm">
                &copy; {new Date().getFullYear()} FYDO. 
                <span className="hidden sm:inline"> Tous droits réservés.</span>
              </p>
              <p className="text-xs sm:text-sm text-green-200 mt-1 sm:mt-2">
                <span className=" sm:inline">Fait avec </span>
                <Heart size={12} className="sm:w-3 sm:h-3 inline text-red-400 fill-red-400" />
                <span className=" sm:inline"> par l'équipe Fydo </span>
                <Flame size={16} className="sm:w-5 sm:h-5 inline text-purple-300 fill-purple-400 drop-shadow-[0_0_8px_rgb(147,51,234)]" />
              </p>
            </div>

            {/* Réseaux sociaux - RESPONSIVE */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  aria-label={social.name}
                  className={`w-8 h-8 sm:w-10 sm:h-10 bg-green-700 bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-100 ${social.color} transition-all duration-300 transform hover:scale-110`}
                >
                  {React.cloneElement(social.icon, { size: 16 })}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bouton retour en haut - RESPONSIVE */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 animate-bounce"
          aria-label="Retour en haut"
        >
          <ArrowUp size={18} className="sm:w-5 sm:h-5" />
        </button>
      )}

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
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </footer>
  );
};

export default Footer;