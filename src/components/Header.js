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
  Crown,
  Camera,
  ScanLine,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import fydoLogo from '../assets/images/Fydo-logo.png';
import UserAvatar from './profile/UserAvatar';

// Fonction pour obtenir les classes du badge selon son type
const getBadgeClasses = (badgeText) => {
  if (!badgeText) return '';
  
  switch (badgeText) {
    case 'NEW':
      return 'bg-red-500 text-white animate-pulse shadow-sm';
    case 'Essential':
      return 'bg-green-100 text-green-700 border border-green-200';
    case 'Premium':
      return 'bg-amber-100 text-amber-700 border border-amber-200';
    case 'Gratuit':
      return 'bg-gray-100 text-gray-700 border border-gray-200';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};

// Fonction pour obtenir l'icône du badge
const getBadgeIcon = (badgeText) => {
  switch (badgeText) {
    case 'Essential':
      return <Zap size={10} className="mr-0.5" />;
    case 'Premium':
      return <Crown size={10} className="mr-0.5" />;
    case 'Gratuit':
      return <Heart size={10} className="mr-0.5" />;
    default:
      return null;
  }
};

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const mobileProfileRef = useRef(null);
  
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
  
  const toggleMobileProfile = () => {
    setMobileProfileOpen(!mobileProfileOpen);
  };
  
  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileProfileRef.current && !mobileProfileRef.current.contains(event.target) && 
          !event.target.closest('.mobile-profile-button')) {
        setMobileProfileOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Fermer les menus quand on change de page
  useEffect(() => {
    setMobileProfileOpen(false);
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

  // Fonction pour gérer les clics sur les liens de navigation
  const handleNavClick = (path, e) => {
    e.preventDefault();
    
    // Fermer les menus
    setMobileProfileOpen(false);
    setDropdownOpen(false);
    
    // Si on est déjà sur la page, forcer le refresh ou scroll vers le haut
    if (isActivePath(path)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };

  // Fonction spéciale pour les liens du dropdown
  const handleDropdownClick = (path, e) => {
    e.preventDefault();
    setDropdownOpen(false);
    
    if (isActivePath(path)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };

  // Navigation items avec animations
  const navItems = [
    { path: '/concept', label: 'Concept', icon: <Info size={18} /> },
    { path: '/fonctionnalites', label: 'Fonctionnalités', icon: <Zap size={18} /> },
    { path: '/recherche-filtre', label: 'Scanner', icon: <Search size={18} />, highlight: true },
    { path: '/top-produits-live', label: 'Top Produits', icon: <TrendingUp size={18} /> },
    { path: '/abonnements', label: 'Abonnements', icon: <Crown size={18} /> },
    { path: '/contact', label: 'Contact', icon: <Phone size={18} /> }
  ];

  const isChallengesPage = location.pathname === '/challenges';
  const isSearchPage = location.pathname === '/recherche-filtre';
  const isTopProductsPage = location.pathname === '/top-produits-live';

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
              {/* Badge "Nouveau" animé - masqué en mobile pour économiser l'espace */}
              <span className="ml-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse shadow-lg hidden md:inline-block">
                NOUVEAU
              </span>
            </Link>
            
            {/* Icônes Concept et Fonctionnalités à gauche (mobile uniquement) */}
            <div className="lg:hidden flex items-center space-x-1.5 ml-4">
              {/* Concept */}
              <a
                href="/concept"
                onClick={(e) => handleNavClick('/concept', e)}
                className={`relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                  isActivePath('/concept')
                    ? 'bg-white text-green-700 shadow-lg border-2 border-green-200' 
                    : 'bg-white text-gray-600 hover:text-green-700 shadow-sm border border-gray-200 hover:border-green-200'
                }`}
                aria-label="Concept"
              >
                <Info size={16} />
                {isActivePath('/concept') && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-600 rounded-full animate-ping"></span>
                )}
              </a>

              {/* Fonctionnalités */}
              <a
                href="/fonctionnalites"
                onClick={(e) => handleNavClick('/fonctionnalites', e)}
                className={`relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                  isActivePath('/fonctionnalites')
                    ? 'bg-white text-green-700 shadow-lg border-2 border-green-200' 
                    : 'bg-white text-gray-600 hover:text-green-700 shadow-sm border border-gray-200 hover:border-green-200'
                }`}
                aria-label="Fonctionnalités"
              >
                <Zap size={16} />
                {isActivePath('/fonctionnalites') && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-600 rounded-full animate-ping"></span>
                )}
              </a>
            </div>
          </div>

          {/* Icônes mobiles (4 icônes alignées à droite) */}
          <div className="lg:hidden flex items-center space-x-1.5">
            {currentUser ? (
              <>
                {/* Scanner */}
                <a
                  href="/recherche-filtre"
                  onClick={(e) => handleNavClick('/recherche-filtre', e)}
                  className={`relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                    isSearchPage 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' 
                      : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                  }`}
                  aria-label="Scanner"
                >
                  <Search size={16} />
                  {isSearchPage && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-ping"></span>
                  )}
                </a>

                {/* Top Produits */}
                <a
                  href="/top-produits-live"
                  onClick={(e) => handleNavClick('/top-produits-live', e)}
                  className={`relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                    isTopProductsPage 
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg' 
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                  aria-label="Top Produits"
                >
                  <TrendingUp size={16} />
                  {isTopProductsPage && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-ping"></span>
                  )}
                </a>

                {/* Challenges */}
                <a 
                  href="/challenges"
                  onClick={(e) => handleNavClick('/challenges', e)}
                  aria-label="Challenges"
                  className={`relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 transform hover:scale-110 group ${
                    isChallengesPage 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 hover:from-amber-200 hover:to-amber-300'
                  }`}
                >
                  <Trophy 
                    size={16} 
                    className={`transition-all duration-300 ${
                      isChallengesPage ? 'fill-white' : 'fill-amber-600'
                    }`} 
                  />
                  
                  {/* Badge "HOT" plus petit pour mobile */}
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] px-1 py-0.5 rounded-full font-bold animate-bounce shadow-sm">
                    HOT
                  </span>
                  
                  {isChallengesPage && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-ping"></span>
                  )}
                </a>

                {/* Avatar - Profil */}
                <div className="relative" ref={mobileProfileRef}>
                  <button
                    onClick={toggleMobileProfile}
                    className="mobile-profile-button relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 transform hover:scale-110 bg-green-50 hover:bg-green-100"
                    aria-label="Mon profil"
                  >
                    <UserAvatar 
                      userId={userDetails?.firebase_uid || currentUser?.uid}
                      size={28}
                      status={userDetails?.status || 'bronze'}
                      displayName={currentUser?.displayName || currentUser?.email}
                      customAvatarUrl={userDetails?.avatarUrl}
                      avatarSeed={userDetails?.avatarSeed}
                      className="shadow-sm"
                      showBorder={true}
                    />
                    
                    {/* Indicateur de statut animé */}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white animate-pulse"></span>
                  </button>

                  {/* Menu profil mobile */}
                  {mobileProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-10 py-2 ring-1 ring-black ring-opacity-5 animate-dropdown">
                      {/* Section profil */}
                      <div className="px-3 py-2 bg-gradient-to-r from-green-50 to-green-100 rounded-t-xl">
                        <p className="text-xs text-green-600">Connecté</p>
                        <p className="text-sm font-medium text-green-800 truncate">
                          {currentUser.displayName || 'Utilisateur'}
                        </p>
                        
                        {/* Stats compactes */}
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="flex items-center text-xs text-green-700">
                            <Camera size={10} className="text-sky-500 mr-0.5" />
                            {userDetails?.scanCount || 0}
                          </span>
                          <span className="flex items-center text-xs text-green-700">
                            <Star size={10} className="text-amber-500 mr-0.5 fill-amber-500" />
                            {userDetails?.reviewCount || 0}
                          </span>
                          <span className="flex items-center text-xs text-green-700">
                            <Heart size={10} className="text-pink-500 mr-0.5 fill-pink-500" />
                            {userDetails?.favoriteCount || 0}
                          </span>
                        </div>
                      </div>
                      
                      <div className="py-1">
                        <MobileDropdownLink to="/profile" icon={<User size={16} />} onClick={handleDropdownClick}>
                          Mon profil
                        </MobileDropdownLink>
                        
                        <MobileDropdownLink to="/historique-produits" icon={<Clock size={16} />} onClick={handleDropdownClick}>
                          Historique
                        </MobileDropdownLink>
                        
                        <MobileDropdownLink to="/mes-favoris" icon={<Heart size={16} />} onClick={handleDropdownClick}>
                          Mes favoris
                          {userDetails?.favoriteCount > 0 && (
                            <span className="ml-auto bg-pink-100 text-pink-600 text-xs px-1.5 py-0.5 rounded-full font-medium">
                              {userDetails.favoriteCount}
                            </span>
                          )}
                        </MobileDropdownLink>
                       
                        <MobileDropdownLink to="/mes-avis" icon={<MessageSquare size={16} />} onClick={handleDropdownClick}>
                          Mes avis
                          {userDetails?.reviewCount > 0 && (
                            <span className="ml-auto bg-green-100 text-green-600 text-xs px-1.5 py-0.5 rounded-full font-medium">
                              {userDetails.reviewCount}
                            </span>
                          )}
                        </MobileDropdownLink>
                          <MobileDropdownLink to="/mes-tickets" icon={<Receipt size={16} />} onClick={handleDropdownClick}>
                          Mes tickets
                        </MobileDropdownLink>
                        
                        <button 
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <LogOut size={16} className="mr-2" />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Utilisateur non connecté - Afficher Scanner + Top Produits + boutons de connexion
              <>
                {/* Scanner */}
                <a
                  href="/recherche-filtre"
                  onClick={(e) => handleNavClick('/recherche-filtre', e)}
                  className={`relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                    isSearchPage 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' 
                      : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                  }`}
                  aria-label="Scanner"
                >
                  <Search size={16} />
                  {isSearchPage && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-ping"></span>
                  )}
                </a>

                {/* Top Produits */}
                <a
                  href="/top-produits-live"
                  onClick={(e) => handleNavClick('/top-produits-live', e)}
                  className={`relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                    isTopProductsPage 
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg' 
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                  aria-label="Top Produits"
                >
                  <TrendingUp size={16} />
                  {isTopProductsPage && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-ping"></span>
                  )}
                </a>

                {/* Boutons connexion/inscription avec icônes */}
                <div className="flex items-center space-x-1.5 ml-1">
                  <Link 
                    to="/login" 
                    className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 transform hover:scale-110 bg-white text-green-700 hover:text-green-800 shadow-sm border border-gray-200 hover:border-green-200"
                    aria-label="Connexion"
                  >
                    <LogIn size={16} />
                  </Link>
                  <Link 
                    to="/signup" 
                    className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 transform hover:scale-110 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-md"
                    aria-label="Inscription"
                  >
                    <UserPlus size={16} />
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Liens de navigation desktop avec effets hover avancés */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.path} className="relative">
                <a
                  href={item.path}
                  onClick={(e) => handleNavClick(item.path, e)}
                  onMouseEnter={() => setHoveredNav(item.path)}
                  onMouseLeave={() => setHoveredNav(null)}
                  className={`relative flex items-center text-sm font-medium px-3 py-2 rounded-xl transition-all duration-300 transform cursor-pointer ${
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
                  
                  {/* Tooltip pour indiquer l'action sur page active */}
                  {isActivePath(item.path) && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Cliquez pour retourner en haut
                    </span>
                  )}
                  
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
                </a>
              </div>
            ))}
            
            {/* Bouton Challenges avec animation spéciale */}
            {currentUser && (
              <div className="mx-2">
                <a 
                  href="/challenges"
                  onClick={(e) => handleNavClick('/challenges', e)}
                  aria-label="Challenges"
                  className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 transform hover:scale-110 group cursor-pointer ${
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
                </a>
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
                  {/* Avatar animé avec UserAvatar */}
                  <div className="relative">
                    <UserAvatar 
                      userId={userDetails?.firebase_uid || currentUser?.uid}
                      size={40}
                      status={userDetails?.status || 'bronze'}
                      displayName={currentUser?.displayName}
                      customAvatarUrl={userDetails?.avatarUrl}
                      avatarSeed={userDetails?.avatarSeed}
                      className="mr-3 shadow-md group-hover:shadow-lg transition-all duration-300"
                      showBorder={true}
                    />
                    
                    {/* Indicateur de statut animé */}
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                  </div>
                  
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-green-800">
                      {currentUser.displayName || 'Utilisateur'}
                    </span>
                    
                    {/* Stats avec animations au hover */}
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center text-xs text-green-700 group-hover:scale-110 transition-transform duration-300">
                        <Camera size={12} className="text-sky-500 mr-0.5" />
                        {userDetails?.scanCount || 0}
                      </span>
                      <span className="flex items-center text-xs text-green-700 group-hover:scale-110 transition-transform duration-300">
                        <Star size={12} className="text-amber-500 mr-0.5 fill-amber-500" />
                        {userDetails?.reviewCount || 0}
                      </span>
                      <span className="flex items-center text-xs text-green-700 group-hover:scale-110 transition-transform duration-300">
                        <Heart size={12} className="text-pink-500 mr-0.5 fill-pink-500" />
                        {userDetails?.favoriteCount || 0}
                      </span>
                      
                      {/* Badge Premium si applicable */}
                      {(subscriptionPlan?.name || userDetails?.subscription_name) && 
                       (subscriptionPlan?.name || userDetails?.subscription_name) !== 'Gratuit' && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeClasses(subscriptionPlan?.name || userDetails?.subscription_name)}`}>
                          {getBadgeIcon(subscriptionPlan?.name || userDetails?.subscription_name)}
                          {subscriptionPlan?.name || userDetails?.subscription_name}
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
                      <DropdownLink 
                        to="/profile" 
                        icon={<User size={18} />} 
                        badge={
                          (subscriptionPlan?.name || userDetails?.subscription_name) !== 'Gratuit' 
                            ? (subscriptionPlan?.name || userDetails?.subscription_name) 
                            : null
                        } 
                        onClick={handleDropdownClick}
                      >
                        Mon profil
                      </DropdownLink>
                      
                      <DropdownLink to="/historique-produits" icon={<Clock size={18} />} onClick={handleDropdownClick}>
                        Historique
                      </DropdownLink>
                    </div>
                    
                    <div className="py-2">
                      <DropdownLink to="/mes-favoris" icon={<Heart size={18} />} count={userDetails?.favoriteCount} onClick={handleDropdownClick}>
                        Mes favoris
                      </DropdownLink>
                      
                      <DropdownLink to="/mes-tickets" icon={<Receipt size={18} />} onClick={handleDropdownClick}>
                        Mes tickets
                      </DropdownLink>
                      
                      <DropdownLink to="/mes-avis" icon={<MessageSquare size={18} />} count={userDetails?.reviewCount} onClick={handleDropdownClick}>
                        Mes avis
                      </DropdownLink>
                      
                      <DropdownLink to="/challenges" icon={<Trophy size={18} />} special badge="NEW" onClick={handleDropdownClick}>
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

// Composant pour les liens du menu déroulant avec badges et animations...
const DropdownLink = ({ to, children, icon, special, count, badge, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <a
      href={to}
      onClick={(e) => onClick(to, e)}
      className={`flex items-center justify-between px-4 py-2.5 text-sm transition-all duration-200 cursor-pointer ${
        special 
          ? 'text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100' 
          : 'text-gray-700 hover:bg-gray-50'
      } group ${isActive ? 'bg-green-50 text-green-700' : ''}`}
    >
      <div className="flex items-center">
        <span className={`mr-3 transition-transform duration-200 group-hover:scale-110 ${
          special ? 'text-amber-600' : isActive ? 'text-green-600' : 'text-gray-500'
        }`}>
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
          <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${getBadgeClasses(badge)}`}>
            {getBadgeIcon(badge)}
            {badge}
          </span>
        )}
      </div>
    </a>
  );
};

// Composant pour les liens du menu profil mobile
const MobileDropdownLink = ({ to, children, icon, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <a
      href={to}
      onClick={(e) => onClick(to, e)}
      className={`flex items-center justify-between px-3 py-2 text-sm transition-all duration-200 cursor-pointer hover:bg-gray-50 ${
        isActive ? 'bg-green-50 text-green-700' : 'text-gray-700'
      }`}
    >
      <div className="flex items-center">
        <span className={`mr-2 ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
          {icon}
        </span>
        {children}
      </div>
    </a>
  );
};

export default Header;