// src/components/Header.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { 
  User, 
  LogOut, 
  ChevronDown, 
  Clock, 
  Star, 
  MessageSquare, 
  Heart, 
  Award, 
  Menu, 
  X, 
  Trophy,
  Search,
  ShoppingBag,
  Info,
  Phone,
  Receipt,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  Crown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import fydoLogo from '../assets/images/Fydo-logo.png';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  
  const { currentUser, userDetails, subscriptionPlan } = useAuth();

  // Gestion du scroll pour l'effet de header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Fermer le menu mobile quand on change de page
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);
  
  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // Vérifier si l'URL actuelle contient un segment spécifique
  const isActivePath = (path) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  // Obtenir le badge et l'icône selon le statut
  const getBadgeInfo = (status) => {
    let color, bg, icon, glow;
    
    switch(status?.toLowerCase()) {
      case 'bronze':
        color = 'text-amber-800';
        bg = 'bg-gradient-to-r from-amber-400 to-amber-600';
        icon = <Award size={12} />;
        glow = 'shadow-amber-400/50';
        break;
      case 'argent': case 'silver':
        color = 'text-gray-700';
        bg = 'bg-gradient-to-r from-gray-300 to-gray-500';
        icon = <Award size={12} />;
        glow = 'shadow-gray-400/50';
        break;
      case 'or': case 'gold':
        color = 'text-amber-800';
        bg = 'bg-gradient-to-r from-yellow-400 to-yellow-600';
        icon = <Award size={12} />;
        glow = 'shadow-yellow-400/50';
        break;
      case 'diamant': case 'diamond':
        color = 'text-blue-700';
        bg = 'bg-gradient-to-r from-blue-400 to-blue-600';
        icon = <Award size={12} />;
        glow = 'shadow-blue-400/50';
        break;
      default:
        color = 'text-amber-800';
        bg = 'bg-gradient-to-r from-amber-400 to-amber-600';
        icon = <Award size={12} />;
        glow = 'shadow-amber-400/50';
    }
    
    return { color, bg, icon, glow };
  };

  // Navigation items avec animations
  const navItems = [
    { path: '/concept', label: 'Concept', icon: <Info size={18} /> },
    { path: '/fonctionnalites', label: 'Fonctionnalités', icon: <Zap size={18} /> },
    { path: '/recherche-filtre', label: 'Scanner', icon: <Search size={18} />, highlight: true },
    { path: '/top-produits', label: 'Top Produits', icon: <TrendingUp size={18} /> },
    { path: '/abonnements', label: 'Abonnements', icon: <Crown size={18} /> },
    { path: '/contact', label: 'Contact', icon: <Phone size={18} /> }
  ];

  const isChallengesPage = location.pathname === '/challenges';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
        : 'bg-white shadow-md py-3'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo Fydo avec animation */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <img 
                src={fydoLogo} 
                alt="Fydo Logo" 
                className="h-10 md:h-12 transition-transform duration-300 group-hover:scale-105" 
              />
              {/* Badge "Nouveau" animé */}
              <span className="ml-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse shadow-lg">
                NOUVEAU
              </span>
            </Link>
          </div>

          {/* Bouton du menu mobile avec animation */}
          <button 
            className="lg:hidden mobile-menu-button relative p-2 rounded-md hover:bg-green-50 text-green-800 transition-all duration-300 transform hover:scale-110"
            aria-label="Menu"
            onClick={toggleMobileMenu}
          >
            <div className="relative w-6 h-6">
              <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${mobileMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}>
                <Menu className="h-6 w-6" />
              </span>
              <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${mobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'}`}>
                <X className="h-6 w-6" />
              </span>
            </div>
          </button>

          {/* Liens de navigation desktop avec effets hover avancés */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.path} className="relative">
                <Link
                  to={item.path}
                  onMouseEnter={() => setHoveredNav(item.path)}
                  onMouseLeave={() => setHoveredNav(null)}
                  className={`relative flex items-center text-sm font-medium px-3 py-2 rounded-xl transition-all duration-300 transform ${
                    isActivePath(item.path)
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg scale-105'
                      : item.highlight
                        ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 hover:from-orange-100 hover:to-orange-200 hover:shadow-md hover:scale-105'
                        : 'text-green-800 hover:text-green-700 hover:bg-green-50'
                  }`}
                >
                  <span className={`mr-1.5 transition-transform duration-300 ${
                    hoveredNav === item.path ? 'rotate-12 scale-110' : ''
                  }`}>
                    {item.icon}
                  </span>
                  {item.label}
                  
                  {/* Effet de brillance au hover */}
                  {item.highlight && !isActivePath(item.path) && (
                    <span className="absolute inset-0 rounded-xl overflow-hidden">
                      <span className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-all duration-700 ${
                        hoveredNav === item.path ? 'opacity-30 translate-x-full' : '-translate-x-full'
                      }`}></span>
                    </span>
                  )}
                  
                  {/* Indicateur animé pour le lien actif */}
                  {isActivePath(item.path) && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-ping"></span>
                  )}
                </Link>
              </div>
            ))}
            
            {/* Bouton Challenges avec animation spéciale */}
            {currentUser && (
              <div className="mx-2">
                <Link 
                  to="/challenges"
                  aria-label="Challenges"
                  className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 transform hover:scale-110 group ${
                    isChallengesPage 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg scale-105'
                      : 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 hover:from-amber-200 hover:to-amber-300 hover:shadow-lg'
                  }`}
                >
                  <Trophy 
                    size={20} 
                    className={`transition-all duration-300 group-hover:rotate-12 ${
                      isChallengesPage ? 'fill-white' : 'fill-amber-600'
                    }`} 
                  />
                  
                  {/* Badge "HOT" animé */}
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-bounce shadow-md">
                    HOT
                  </span>
                  
                  {/* Effet de particules */}
                  <span className="absolute inset-0 rounded-xl overflow-hidden">
                    <span className="absolute top-0 left-1/4 w-1 h-1 bg-amber-300 rounded-full animate-float-1"></span>
                    <span className="absolute bottom-0 right-1/4 w-1 h-1 bg-amber-400 rounded-full animate-float-2"></span>
                    <span className="absolute top-1/2 right-0 w-1 h-1 bg-amber-500 rounded-full animate-float-3"></span>
                  </span>
                </Link>
              </div>
            )}
          </div>
        
          {/* Partie utilisateur desktop avec animations */}
          <div className="hidden lg:block relative" ref={dropdownRef}>
            {currentUser ? (
              <div>
                <button
                  onClick={toggleDropdown}
                  className="group flex items-center rounded-2xl py-2 px-3 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {/* Avatar animé */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-800 text-white flex items-center justify-center text-sm font-bold mr-3 shadow-md group-hover:shadow-lg transition-all duration-300">
                      {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'F'}
                    </div>
                    
                    {/* Indicateur de statut animé */}
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                  </div>
                  
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-green-800">
                      {currentUser.displayName || 'Utilisateur'}
                    </span>
                    
                    {/* Badges et stats avec micro-animations */}
                    <div className="flex items-center space-x-2">
                      {/* Badge de statut avec effet glow */}
                      {userDetails?.status && (
                        <div className="relative">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold text-white ${getBadgeInfo(userDetails.status).bg} shadow-md ${getBadgeInfo(userDetails.status).glow} transition-all duration-300 hover:shadow-lg`}>
                            <span className="mr-0.5">{getBadgeInfo(userDetails.status).icon}</span>
                            <span className="capitalize">{userDetails.status}</span>
                          </span>
                        </div>
                      )}
                      
                      {/* Stats avec animations au hover */}
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center text-xs text-green-700 group-hover:scale-110 transition-transform duration-300">
                          <Star size={12} className="text-amber-500 mr-0.5 fill-amber-500" />
                          {userDetails?.reviewCount || 0}
                        </span>
                        <span className="flex items-center text-xs text-green-700 group-hover:scale-110 transition-transform duration-300">
                          <Heart size={12} className="text-pink-500 mr-0.5 fill-pink-500" />
                          {userDetails?.favoriteCount || 0}
                        </span>
                      </div>
                      
                      {/* Badge Premium si applicable */}
                      {subscriptionPlan?.name && subscriptionPlan.name !== 'Gratuit' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md animate-shimmer">
                          <Sparkles size={10} className="mr-0.5" />
                          {subscriptionPlan.name}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <ChevronDown 
                    size={18} 
                    className={`ml-2 text-green-800 transition-all duration-300 ${dropdownOpen ? 'rotate-180' : ''} group-hover:text-green-600`} 
                  />
                </button>

                {/* Menu déroulant amélioré */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl z-10 py-2 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 animate-dropdown">
                    {/* Section profil avec effet hover */}
                    <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 rounded-t-2xl">
                      <p className="text-xs text-green-600">Connecté en tant que</p>
                      <p className="text-sm font-medium text-green-800 truncate">{currentUser.email}</p>
                    </div>
                    
                    <div className="py-2">
                      <DropdownLink to="/profile" icon={<User size={18} />} badge={subscriptionPlan?.name !== 'Gratuit' ? 'PRO' : null}>
                        Mon profil
                      </DropdownLink>
                      
                      <DropdownLink to="/historique-produits" icon={<Clock size={18} />}>
                        Historique
                      </DropdownLink>
                    </div>
                    
                    <div className="py-2">
                      <DropdownLink to="/mes-favoris" icon={<Heart size={18} />} count={userDetails?.favoriteCount}>
                        Mes favoris
                      </DropdownLink>
                      
                      <DropdownLink to="/mes-tickets" icon={<Receipt size={18} />}>
                        Mes tickets
                      </DropdownLink>
                      
                      <DropdownLink to="/mes-avis" icon={<MessageSquare size={18} />} count={userDetails?.reviewCount}>
                        Mes avis
                      </DropdownLink>
                      
                      <DropdownLink to="/challenges" icon={<Trophy size={18} />} special badge="NEW">
                        Challenges
                      </DropdownLink>
                    </div>
                    
                    <div className="py-2">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 group"
                      >
                        <LogOut size={18} className="mr-3 transition-transform duration-200 group-hover:-translate-x-1" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-sm text-green-800 hover:text-green-700 py-2 px-4 rounded-xl transition-all duration-300 hover:bg-green-50"
                >
                  Connexion
                </Link>
                <Link 
                  to="/signup" 
                  className="text-sm bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-5 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 relative overflow-hidden group"
                >
                  <span className="relative z-10">Inscription</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  
                  {/* Effet de brillance */}
                  <span className="absolute inset-0 rounded-xl overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* Menu mobile amélioré */}
          {mobileMenuOpen && (
            <div 
              ref={mobileMenuRef} 
              className="lg:hidden absolute top-16 inset-x-0 z-50 bg-white shadow-xl rounded-b-2xl animate-slideDown"
            >
              <div className="p-4 space-y-4 divide-y divide-gray-100">
                {/* Menu navigation mobile avec animations */}
                <div className="grid grid-cols-1 gap-2 py-2">
                  {navItems.map((item, index) => (
                    <MobileNavLink 
                      key={item.path}
                      to={item.path} 
                      icon={item.icon} 
                      active={isActivePath(item.path)}
                      highlight={item.highlight}
                      delay={index * 50}
                    >
                      {item.label}
                    </MobileNavLink>
                  ))}
                  
                  {/* Challenges mobile */}
                  {currentUser && (
                    <MobileNavLink 
                      to="/challenges" 
                      icon={<Trophy size={18} className={`${isChallengesPage ? 'text-white' : 'text-amber-600 fill-amber-600'}`} />} 
                      active={isActivePath('/challenges')}
                      specialStyle="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300"
                      delay={navItems.length * 50}
                    >
                      Challenges
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                        NEW
                      </span>
                    </MobileNavLink>
                  )}
                </div>
                
                {/* Section utilisateur mobile avec animations */}
                <div className="pt-3">
                  {currentUser ? (
                    <div className="space-y-3 animate-fadeIn">
                      {/* Carte utilisateur mobile */}
                      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-green-800 text-white flex items-center justify-center text-lg font-bold mr-3 shadow-md">
                            {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'F'}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-green-800">
                              {currentUser.displayName || 'Utilisateur'}
                            </div>
                            
                            <div className="flex items-center space-x-2 mt-1">
                              {/* Badge de statut mobile */}
                              {userDetails?.status && (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold text-white ${getBadgeInfo(userDetails.status).bg} shadow-sm`}>
                                  {getBadgeInfo(userDetails.status).icon}
                                  <span className="ml-0.5 capitalize">{userDetails.status}</span>
                                </span>
                              )}
                              
                              {/* Stats mobile */}
                              <div className="flex items-center space-x-2">
                                <span className="flex items-center text-xs text-green-700">
                                  <Star size={12} className="text-amber-500 mr-0.5 fill-amber-500" />
                                  {userDetails?.reviewCount || 0}
                                </span>
                                <span className="flex items-center text-xs text-green-700">
                                  <Heart size={12} className="text-pink-500 mr-0.5 fill-pink-500" />
                                  {userDetails?.favoriteCount || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Liens profil mobile avec animations */}
                      <div className="grid grid-cols-1 gap-1">
                        <MobileNavLink to="/profile" icon={<User size={18} />} delay={0}>
                          Mon profil
                        </MobileNavLink>
                        
                        <MobileNavLink to="/historique-produits" icon={<Clock size={18} />} delay={50}>
                          Historique
                        </MobileNavLink>
                        
                        <MobileNavLink to="/mes-favoris" icon={<Heart size={18} />} delay={100}>
                          Mes favoris
                          {userDetails?.favoriteCount > 0 && (
                            <span className="ml-auto bg-pink-100 text-pink-600 text-xs px-2 py-0.5 rounded-full font-medium">
                              {userDetails.favoriteCount}
                            </span>
                          )}
                        </MobileNavLink>

                        <MobileNavLink to="/mes-tickets" icon={<Receipt size={18} />} delay={150}>
                          Mes tickets
                        </MobileNavLink>
                        
                        <MobileNavLink to="/mes-avis" icon={<MessageSquare size={18} />} delay={200}>
                          Mes avis
                          {userDetails?.reviewCount > 0 && (
                            <span className="ml-auto bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full font-medium">
                              {userDetails.reviewCount}
                            </span>
                          )}
                        </MobileNavLink>
                        
                        <button 
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 mt-2 animate-fadeIn"
                          style={{ animationDelay: '250ms' }}
                        >
                          <LogOut size={18} className="mr-2" />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2 py-2 animate-fadeIn">
                      <Link 
                        to="/login" 
                        className="w-full text-center text-sm text-green-800 hover:bg-green-50 py-2.5 px-3 rounded-xl transition-all duration-300"
                      >
                        Connexion
                      </Link>
                      <Link 
                        to="/signup" 
                        className="w-full text-center text-sm bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 px-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg relative overflow-hidden group"
                      >
                        <span className="relative z-10">Inscription gratuite</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes float-1 {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0;
          }
        }

        @keyframes float-2 {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-15px) translateX(-10px);
            opacity: 0;
          }
        }

        @keyframes float-3 {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-25px) translateX(-5px);
            opacity: 0;
          }
        }

        .animate-dropdown {
          animation: dropdown 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        .animate-float-1 {
          animation: float-1 3s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 3s ease-in-out infinite 0.5s;
        }

        .animate-float-3 {
          animation: float-3 3s ease-in-out infinite 1s;
        }
      `}</style>
    </nav>
  );
};

// Composant pour les liens du menu déroulant avec badges et animations
const DropdownLink = ({ to, children, icon, special, count, badge }) => {
  return (
    <Link
      to={to}
      className={`flex items-center justify-between px-4 py-2.5 text-sm transition-all duration-200 ${
        special 
          ? 'text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100' 
          : 'text-gray-700 hover:bg-gray-50'
      } group`}
    >
      <div className="flex items-center">
        <span className={`mr-3 transition-transform duration-200 group-hover:scale-110 ${special ? 'text-amber-600' : 'text-gray-500'}`}>
          {icon}
        </span>
        {children}
      </div>
      <div className="flex items-center space-x-2">
        {count > 0 && (
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
            {count}
          </span>
        )}
        {badge && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
            badge === 'NEW' 
              ? 'bg-red-500 text-white animate-pulse' 
              : badge === 'PRO'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                : 'bg-gray-200 text-gray-700'
          }`}>
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
};

// Composant pour les liens du menu mobile avec animations décalées
const MobileNavLink = ({ to, children, icon, active, specialStyle, highlight, delay = 0 }) => {
  const baseStyle = "flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 animate-fadeIn";
  const defaultStyle = specialStyle || (highlight ? "bg-orange-50 text-orange-700" : "text-green-800");
  
  return (
    <Link
      to={to}
      className={`${baseStyle} ${active 
        ? `bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md` 
        : `hover:bg-green-50 ${defaultStyle}`}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center">
        <span className="mr-3">{icon}</span>
        {children}
      </div>
    </Link>
  );
};

export default Header;