// src/App.js - Mise à jour pour ajouter la route vers la gestion des challenges
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login, SignUp, UserProfile, ChangePassword } from './components/login';
import Header from './components/Header';
import Hero from './components/Hero';
import Concept from './components/Concept';
import HowItWorks from './components/HowItWorks';
import TopProducts from './pages/TopProducts'; // Nouvelle page Top Produits
import TopProductsLive from './pages/TopProductsLive';
import Download from './components/Download';
import Features from './components/Features';
import Footer from './components/Footer';
import ProductSearchEnhanced from './components/ProductSearchEnhanced';
import ProfileNavigationTabs from './components/profile/ProfileNavigationTabs';
// Importer les composants d'administration
import AdminPanel from './components/admin/AdminPanel';

import PendingReviews from './components/admin/PendingReviews'; 
import AdminPendingChallenges from './components/admin/ChallengesModeration'; 
import CategoryManagement from './components/admin/CategoryManagement';

import NotFound from './pages/NotFound';
import FAQ from './components/FAQ';
import ConceptPage from './pages/ConceptPage';

// Routes pour les abonnements
import SubscriptionPlans from './pages/SubscriptionPlans';
import SubscriptionPayment from './components/paiement/SubscriptionPayment';
import SubscriptionHistory from './components/paiement/SubscriptionHistory';
import UserSubscription from './components/profile/UserSubscription';
import EditProfile from './components/profile/EditProfile';

// Routes pour favoris et historique
import FavoritesList from './components/profile/FavoritesList';
import ProductHistory  from './components/profile/ProductHistory';
import UserReviews from './components/profile/UserReviews';
// N'oubliez pas d'importer le composant en haut du fichier:
import ReceiptsList from './components/profile/ReceiptsList';

// Import de la nouvelle page Challenges
import ChallengesPage from './pages/ChallengesPage';

import LegalNotice from './pages/LegalNotice';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

import Contact from './components/Contact';
import FeaturesPage from './pages/FeaturesPage'
// orientation mobile lock en portrait
import OrientationLock from './components/OrientationLock';

// Au début de votre fichier App.js, ajoutez ces imports:
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import SubscriptionCancel from './pages/SubscriptionCancel';
// Composant PrivateRoute amélioré pour protéger les routes qui nécessitent une authentification
const PrivateRoute = ({ element }) => {
  const { currentUser } = useAuth();
  return currentUser ? element : <Navigate to="/login" replace />;
};

// Composant AdminRoute pour protéger les routes admin
const AdminRoute = ({ element }) => {
  const { currentUser, userDetails } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!userDetails || userDetails.userType !== 'Admin') return <Navigate to="/profile" replace />;
  return element;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-green-50 flex flex-col">
          <OrientationLock />
          <Helmet>
            <title>Fydo - Avis Produits</title>
            <link rel="icon" href="/images/Fydo-icone.png" type="image/png" />
            <link rel="shortcut icon" href="/images/Fydo-icone.png" type="image/png" />
          </Helmet>
          
          <Header />
          {/* Augmenter le padding-top pour créer plus d'espace entre le header et le contenu */}
          <div className="pt-10"> {/* Augmenté de 14 à 20 */}
          
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={
              <>
                <Hero />
                <Concept />
                <HowItWorks />
                <Download />
                <Features />
                <FAQ />
              </>
            } />
            
            {/* Routes d'authentification */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            
            {/* Routes protégées pour le profil utilisateur */}
            <Route path="/profile" element={
              <PrivateRoute element={<UserProfile />} />
            } />
            <Route path="/edit-profile" element={
              <PrivateRoute element={<EditProfile />} />
            } />
            <Route path="/change-password" element={
              <PrivateRoute element={<ChangePassword />} />
            } />
            <Route path="/subscription/history" element={
              <PrivateRoute element={<SubscriptionHistory />} />
            } />
            <Route path="/my-subscription" element={
              <PrivateRoute element={<UserSubscription />} />
            } />
            {/* Routes protégées pour les favoris et l'historique */}
            <Route path="/mes-favoris" element={
              <PrivateRoute element={<FavoritesList />} />
            } />
            <Route path="/mes-avis" element={
              <PrivateRoute element={<UserReviews />} />
            } />
            {/* Route pour la liste des tickets */}
            <Route path="/mes-tickets" element={
              <PrivateRoute element={<ReceiptsList />} />
            } />
            <Route path="/historique-produits" element={
              <PrivateRoute element={<ProductHistory />} />
            } />
<Route path="/subscribe/success" element={
  <PrivateRoute element={<SubscriptionSuccess />} />
} />
<Route path="/subscribe/cancel" element={
  <PrivateRoute element={<SubscriptionCancel />} />
} />
            {/* Nouvelle route pour la page des challenges - Protégée car accessible seulement aux utilisateurs connectés */}
            <Route path="/challenges" element={
              <PrivateRoute element={<ChallengesPage />} />
            } />

            <Route path="/contact" element={<Contact />} />

            <Route path="/concept" element={<ConceptPage />} />
            <Route path="/fonctionnalites" element={<FeaturesPage />} />
            
            {/* Routes pour les fonctionnalités de recherche de produits */}
            <Route path="/recherche-filtre" element={<ProductSearchEnhanced />} />

            <Route path="/top-produits" element={<TopProducts />} /> {/* Nouvelle route pour Top Produits */}
            <Route path="/top-produits-live" element={<TopProductsLive />} />
            {/* Routes pour les abonnements */}
            <Route path="/abonnements" element={<SubscriptionPlans />} />
            <Route path="/subscribe/:planId" element={
              <PrivateRoute element={<SubscriptionPayment />} />
            } />
            
            {/* Routes pour l'administration */}
            <Route path="/admin" element={
              <AdminRoute element={<AdminPanel />} />
            } />

            {/* Nouvelle route pour les avis en attente */}
            <Route path="/admin/pending-reviews" element={
              <AdminRoute element={<PendingReviews />} />
            } />
            {/* Nouvelle route pour la gestion des challenges */}
            <Route path="/admin/challenges" element={
              <AdminRoute element={<AdminPendingChallenges />} />
            } />
            {/* NOUVELLE : Route pour la gestion des catégories */}
            <Route path="/admin/categories" element={
              <AdminRoute element={<CategoryManagement />} />
            } />
            
            {/* Nouvelle route pour les politiques de confidentialités */}
            <Route path="/conditions-utilisation" element={<TermsOfService />} />

            {/* Nouvelle route pour les politiques de confidentialités */}
            <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />

            {/* Nouvelle route pour les mentions légales */}
            <Route path="/mentions-legales" element={<LegalNotice />} />

            {/* Route fallback pour les URL inconnues */}
            <Route path="*" element={<Navigate to="/" replace />} />


            {/* Page 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </div>
          <Footer />
                {/* Navigation par onglets en bas d'écran (uniquement sur mobile) */}
      <div className="md:hidden">
        <ProfileNavigationTabs />
      </div>
        </div>
        
      </Router>
    </AuthProvider>
  );
}

export default App;