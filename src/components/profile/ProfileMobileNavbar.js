// src/components/profile/ProfileMobileNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Menu, 
  X, 
  LogOut, 
  Settings,
  Star,
  Heart,
  History,
  ShoppingBag,
  Receipt,
  Crown,
  ChevronRight
} from 'lucide-react';

/**
 * Composant de navigation mobile pour les pages de profil
 * Applique le Design System Fydo - Mode PROFIL (compact, efficace, productif)
 */
const ProfileMobileNavbar = ({ 
  currentUser, 
  title, 
  isMenuOpen, 
  toggleMenu, 
  onLogout, 
  loading 
}) => {
  // Navigation principale du profil
  const profileNavItems = [
    {
      to: '/profile',
      icon: <User size={20} className="text-green-600" />,
      label: 'Mon Profil',
      description: 'Informations personnelles'
    },
    {
      to: '/edit-profile',
      icon: <Settings size={20} className="text-green-600" />,
      label: 'Paramètres',
      description: 'Modifier mes informations'
    },
    {
      to: '/mes-avis',
      icon: <Star size={20} className="text-amber-500" />,
      label: 'Mes Avis',
      description: 'Avis publiés'
    },
    {
      to: '/mes-favoris',
      icon: <Heart size={20} className="text-pink-500" />,
      label: 'Mes Favoris',
      description: 'Produits favoris'
    },
    {
      to: '/historique-produits',
      icon: <History size={20} className="text-blue-600" />,
      label: 'Historique',
      description: 'Produits consultés'
    },
    {
      to: '/mes-tickets',
      icon: <Receipt size={20} className="text-purple-600" />,
      label: 'Mes Tickets',
      description: 'Tickets de caisse'
    },
    {
      to: '/abonnements',
      icon: <Crown size={20} className="text-amber-600" />,
      label: 'Abonnement',
      description: 'Gérer mon plan'
    }
  ];

  return (
    <>
      {/* Barre de navigation mobile - Mode Profil */}
      <div className="bg-white shadow-md border-b border-green-100">
        <div className="flex items-center justify-between py-4 px-4">
          {/* Avatar + Info utilisateur */}
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm font-bold mr-3">
              {currentUser?.displayName ? 
                currentUser.displayName.charAt(0).toUpperCase() : 
                (currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U')
              }
            </div>
            <div>
              <h1 className="text-lg font-bold text-green-800">{title}</h1>
              <p className="text-xs text-gray-600 truncate max-w-[180px]">
                {currentUser?.displayName || currentUser?.email}
              </p>
            </div>
          </div>

          {/* Bouton Menu Hamburger */}
          <button
            onClick={toggleMenu}
            className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 hover:bg-green-200 transition-colors duration-150"
            aria-label="Menu de navigation"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menu déroulant mobile - Mode Profil */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 z-40 transition-opacity duration-200"
            onClick={toggleMenu}
          />
          
          {/* Menu contextuel */}
          <div className="fixed top-0 right-0 w-80 max-w-[85vw] h-full bg-white shadow-xl z-50 transform transition-transform duration-200">
            <div className="flex flex-col h-full">
              
              {/* En-tête du menu */}
              <div className="bg-green-50 border-b border-green-100 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-lg font-bold mr-3">
                      {currentUser?.displayName ? 
                        currentUser.displayName.charAt(0).toUpperCase() : 
                        (currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U')
                      }
                    </div>
                    <div>
                      <h2 className="font-bold text-green-800">
                        {currentUser?.displayName || 'Utilisateur'}
                      </h2>
                      <p className="text-sm text-green-600 truncate max-w-[160px]">
                        {currentUser?.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleMenu}
                    className="w-8 h-8 rounded-lg bg-green-200 flex items-center justify-center text-green-600 hover:bg-green-300 transition-colors duration-150"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Navigation du profil */}
              <div className="flex-1 overflow-y-auto py-2">
                <nav className="space-y-1">
                  {profileNavItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={toggleMenu}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors duration-150 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-green-100 transition-colors duration-150">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 group-hover:text-green-600 transition-colors duration-150" />
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Section Actions */}
              <div className="border-t border-gray-100 p-4 space-y-3">
                
                {/* Raccourci recherche */}
                <Link
                  to="/recherche-filtre"
                  onClick={toggleMenu}
                  className="flex items-center justify-center w-full py-2 px-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-150 group"
                >
                  <ShoppingBag size={18} className="mr-2" />
                  <span className="font-medium">Rechercher un produit</span>
                </Link>

                {/* Bouton déconnexion */}
                <button
                  onClick={() => {
                    toggleMenu();
                    onLogout();
                  }}
                  disabled={loading}
                  className="flex items-center justify-center w-full py-2 px-4 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
                      <span className="font-medium">Déconnexion...</span>
                    </>
                  ) : (
                    <>
                      <LogOut size={18} className="mr-2" />
                      <span className="font-medium">Se déconnecter</span>
                    </>
                  )}
                </button>
              </div>

              {/* Footer info */}
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Fydo - Avis Produits</p>
                  <Link 
                    to="/contact" 
                    onClick={toggleMenu}
                    className="text-xs text-green-600 hover:text-green-800 transition-colors duration-150"
                  >
                    Support & Contact
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProfileMobileNavbar;