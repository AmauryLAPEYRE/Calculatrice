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
  Crown
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

  // Liens de navigation
  const navigationLinks = {
    produits: [
      { name: 'Scanner un produit', path: '/recherche-filtre', icon: <Scan size={16} /> },
      { name: 'Top Produits', path: '/top-produits', icon: <TrendingUp size={16} /> },
      { name: 'Challenges', path: '/challenges', icon: <Award size={16} />, badge: 'NEW' },
      { name: 'Avis récents', path: '/recherche-filtre', icon: <Star size={16} /> }
    ],
    entreprise: [
      { name: 'Notre concept', path: '/concept', icon: <Heart size={16} /> },
      { name: 'Fonctionnalités', path: '/fonctionnalites', icon: <Sparkles size={16} /> },
      { name: 'Abonnements', path: '/abonnements', icon: <Crown size={16} /> },
      { name: 'Contact', path: '/contact', icon: <Phone size={16} /> }
    ],
    legal: [
      { name: 'Conditions d\'utilisation', path: '/conditions-utilisation' },
      { name: 'Politique de confidentialité', path: '/politique-confidentialite' },
      { name: 'Mentions légales', path: '/mentions-legales' },
      { name: 'Cookies', path: '/politique-confidentialite' }
    ],
    support: [
      { name: 'Centre d\'aide', path: '/contact' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Nous contacter', path: '/contact' },
      { name: 'Signaler un bug', path: '/contact' }
    ]
  };

  // Badges de confiance
  const trustBadges = [
    { icon: <Shield size={20} />, text: '100% Sécurisé' },
    { icon: <CheckCircle size={20} />, text: 'Avis vérifiés' },
    { icon: <Users size={20} />, text: '10K+ membres' },
    { icon: <Star size={20} />, text: '4.8/5 Note' }
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
      {/* Motifs de fond */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-600 rounded-full transform translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-700 rounded-full transform -translate-x-48 translate-y-48"></div>
      </div>

      {/* Newsletter Section */}
      <div className="relative z-10 bg-green-700 bg-opacity-50">
        <div className="container mx-auto px-4 py-12">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center mb-4">
              <Mail size={32} className="text-green-300 mr-3" />
              <h3 className="text-2xl md:text-3xl font-bold">Restez informé avec Fydo</h3>
            </div>
            <p className="text-green-100 mb-8 max-w-2xl mx-auto">
              Recevez les dernières actualités, conseils produits et offres exclusives directement dans votre boîte mail
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="w-full px-6 py-4 pr-32 rounded-full text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-green-400 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg flex items-center"
                >
                  <Send size={18} className="mr-2" />
                  S'inscrire
                </button>
              </div>
              
              {isSubscribed && (
                <div className="mt-4 p-3 bg-green-600 bg-opacity-50 rounded-full inline-flex items-center animate-fade-in">
                  <CheckCircle size={20} className="mr-2" />
                  <span className="text-sm">Merci ! Vous êtes maintenant inscrit à notre newsletter.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Logo et description */}
          <div className={`lg:col-span-1 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="mb-6">
              <Link to="/" className="inline-flex items-center group">
                <div className="text-white text-4xl font-bold group-hover:scale-105 transition-transform">
                  Fydo
                </div>
                <Star className="text-yellow-400 fill-yellow-400 ml-2 animate-pulse" size={32} />
              </Link>
            </div>
            <p className="text-green-100 mb-6">
              La communauté qui révolutionne vos choix de produits au quotidien avec des avis 100% vérifiés.
            </p>
            
            {/* Badges de confiance */}
            <div className="grid grid-cols-2 gap-3">
              {trustBadges.map((badge, index) => (
                <div 
                  key={badge.text}
                  className="bg-green-700 bg-opacity-50 rounded-lg p-3 flex items-center space-x-2 hover:bg-opacity-70 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-green-300">{badge.icon}</span>
                  <span className="text-xs">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Liens de navigation */}
          <div className={`lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Produits */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <span className="w-8 h-1 bg-green-400 mr-3"></span>
                Produits
              </h3>
              <ul className="space-y-3">
                {navigationLinks.produits.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="flex items-center text-green-100 hover:text-white transition-colors group"
                    >
                      <span className="mr-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        {link.icon}
                      </span>
                      {link.name}
                      {link.badge && (
                        <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
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
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <span className="w-8 h-1 bg-amber-400 mr-3"></span>
                Entreprise
              </h3>
              <ul className="space-y-3">
                {navigationLinks.entreprise.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="flex items-center text-green-100 hover:text-white transition-colors group"
                    >
                      <span className="mr-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        {link.icon}
                      </span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Légal */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <span className="w-8 h-1 bg-blue-400 mr-3"></span>
                Légal
              </h3>
              <ul className="space-y-3">
                {navigationLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="text-green-100 hover:text-white transition-colors flex items-center group"
                    >
                      <ChevronRight size={14} className="mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <span className="w-8 h-1 bg-purple-400 mr-3"></span>
                Support
              </h3>
              <ul className="space-y-3">
                {navigationLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="text-green-100 hover:text-white transition-colors flex items-center group"
                    >
                      <ChevronRight size={14} className="mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact et App */}
          <div className={`lg:col-span-1 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-8 h-1 bg-pink-400 mr-3"></span>
              Contact
            </h3>
            
            <div className="space-y-4 mb-6">
              <a href="mailto:contact@fydo.fr" className="flex items-center text-green-100 hover:text-white transition-colors">
                <Mail size={18} className="mr-3 text-green-400" />
                contact@fydo.fr
              </a>
              <a href="tel:+33123456789" className="flex items-center text-green-100 hover:text-white transition-colors">
                <Phone size={18} className="mr-3 text-green-400" />
                01 23 45 67 89
              </a>
              <div className="flex items-start text-green-100">
                <MapPin size={18} className="mr-3 text-green-400 mt-1" />
                <span>Paris, France</span>
              </div>
            </div>

            {/* Boutons téléchargement app */}
            <div className="space-y-3">
              <a href="#" className="block bg-black hover:bg-gray-900 text-white px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center">
                  <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Télécharger sur</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </div>
              </a>
              
              <a href="#" className="block bg-black hover:bg-gray-900 text-white px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center">
                  <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Disponible sur</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-green-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            
            {/* Copyright */}
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-green-100">
                &copy; {new Date().getFullYear()} FYDO. Tous droits réservés.
              </p>
              <p className="text-sm text-green-200 mt-2">
                Fait avec <Heart size={14} className="inline text-red-400 fill-red-400" /> par l'équipe Fydo
              </p>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  aria-label={social.name}
                  className={`w-10 h-10 bg-green-700 bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-100 ${social.color} transition-all duration-300 transform hover:scale-110`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bouton retour en haut */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 animate-bounce"
          aria-label="Retour en haut"
        >
          <ArrowUp size={20} />
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