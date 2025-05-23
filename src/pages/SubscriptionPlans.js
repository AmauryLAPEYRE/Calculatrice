// src/pages/SubscriptionPlans.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Check, 
  X, 
  Info, 
  ChevronRight,
  Crown,
  Star,
  Zap,
  Shield,
  Gift,
  Users,
  Search,
  Smartphone,
  Heart,
  Loader
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { calculateYearlySavings } from '../utils/formatters';

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' ou 'yearly'
  const [isVisible, setIsVisible] = useState(false);
  const { currentUser, subscriptionPlan } = useAuth();
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const navigate = useNavigate();

  // Déclencher les animations au chargement
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .order('price_monthly', { ascending: true });
        
        if (error) throw error;
        
        setPlans(data);
      } catch (err) {
        console.error('Erreur lors du chargement des plans:', err.message);
        setError('Impossible de charger les plans d\'abonnement. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionPlans();
    
    // Récupérer l'ID du plan actuel de l'utilisateur s'il est connecté
    if (currentUser && subscriptionPlan) {
      setCurrentPlanId(subscriptionPlan.id);
    }
  }, [currentUser, subscriptionPlan]);

  // Vérifier si l'utilisateur est déjà abonné à un plan
  const isCurrentPlan = (planId) => {
    return currentPlanId === planId;
  };

  const handleSubscribe = (planId, planName) => {
    // Si c'est le plan gratuit, ne rien faire
    if (planName === 'Gratuit') {
      return;
    }
    
    // Vérifier si l'utilisateur est déjà abonné à ce plan
    if (isCurrentPlan(planId)) {
      // L'utilisateur est déjà abonné à ce plan, afficher un message ou une notification
      console.log("Vous êtes déjà abonné à ce plan");
      return;
    }
    
    if (!currentUser) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      navigate('/login', { 
        state: { 
          redirectTo: `/subscribe/${planId}?cycle=${billingCycle}` // Ajout du paramètre dans l'URL
        } 
      });
      return;
    }
    
    // Rediriger vers la page de paiement avec l'ID du plan
    navigate(`/subscribe/${planId}`, { 
      state: { 
        billingCycle: billingCycle, // Assurez-vous que c'est explicite
        planId: planId
      } 
    });
    
    // Debug - pour vérifier ce qui est transmis
    console.log("Navigation avec état:", { billingCycle, planId });
  };

  // Calcul de l'économie annuelle en pourcentage
  const calculateYearlySavingsPercent = (plan) => {
    const monthlyCost = plan.price_monthly * 12;
    const yearlyCost = plan.price_yearly;
    return Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
  };

  // Rendu d'une caractéristique du plan avec label et valeur séparés
  const renderFeatureWithValue = (label, value, included) => (
    <div className="flex items-center py-2">
      {included ? (
        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
      ) : (
        <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
      )}
      <span className={included ? "text-gray-800" : "text-gray-500"}>
        {label}: <span className="font-bold text-green-600">{value}</span>
      </span>
    </div>
  );

  // Rendu d'une caractéristique du plan standard
  const renderFeature = (feature, included) => (
    <div className="flex items-center py-2">
      {included ? (
        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
      ) : (
        <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
      )}
      <span className={included ? "text-gray-800" : "text-gray-500"}>{feature}</span>
    </div>
  );

  // Obtenir l'icône selon le plan
  const getPlanIcon = (plan) => {
    const planName = plan.name.toLowerCase();
    if (planName.includes('gratuit') || planName.includes('free')) {
      return <Heart size={32} className="text-gray-600" />;
    }
    if (planName.includes('essential') || planName.includes('basic')) {
      return <Zap size={32} className="text-green-600" />;
    }
    if (planName.includes('premium') || planName.includes('pro')) {
      return <Crown size={32} className="text-amber-600" />;
    }
    return <Star size={32} className="text-blue-600" />;
  };

  // Obtenir la couleur selon le plan
  const getPlanColor = (plan) => {
    const planName = plan.name.toLowerCase();
    if (planName.includes('gratuit') || planName.includes('free')) {
      return 'gray';
    }
    if (planName.includes('essential') || planName.includes('basic')) {
      return 'green';
    }
    if (planName.includes('premium') || planName.includes('pro')) {
      return 'amber';
    }
    return 'blue';
  };

  // Déterminer si un plan est populaire
  const isPlanPopular = (plan) => {
    return plan.name.toLowerCase().includes('essential') || plan.name.toLowerCase().includes('basic');
  };

  if (loading) {
    return (
      <section className="py-20 bg-green-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-20">
              <Loader size={48} className="animate-spin text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-green-800 mb-2">Chargement des plans...</h2>
              <p className="text-green-600">Veuillez patienter</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-green-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-20">
              <div className="text-red-600 mb-4">{error}</div>
              <button 
                onClick={() => window.location.reload()}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-green-50 min-h-screen">
      <Helmet>
        <title>Abonnements | Fydo - Choisissez Votre Plan Pour Des Choix Parfaits</title>
        <meta name="description" content="Découvrez nos plans d'abonnement Fydo : scans illimités, avis vérifiés et fonctionnalités avancées pour vos achats." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-green-600">
              <li><Link to="/" className="hover:text-green-800 transition-colors">Accueil</Link></li>
              <li><ChevronRight size={16} /></li>
              <li className="text-green-800 font-medium">Abonnements</li>
            </ol>
          </nav>

          {/* Header Section */}
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
              Choisissez Votre Plan pour <span className="text-green-600">Des Choix Parfaits</span>
            </h1>
            <p className="text-xl text-green-700 max-w-3xl mx-auto">
              Déverrouillez tout le potentiel de Fydo avec nos abonnements adaptés à vos besoins
            </p>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center space-x-8 opacity-80 mt-8">
              <span className="text-sm text-green-700 flex items-center">
                <Shield size={16} className="mr-1" />
                30 jours satisfait ou remboursé
              </span>
              <span className="text-sm text-green-700 flex items-center">
                <Crown size={16} className="mr-1 text-amber-500" />
                Résiliation à tout moment
              </span>
              <span className="text-sm text-green-700 flex items-center">
                <Gift size={16} className="mr-1" />
                Plan gratuit à vie
              </span>
            </div>
          </div>

          {/* Sélecteur de cycle de facturation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-full p-2 shadow-md border border-green-100">
              <div className="flex">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    billingCycle === 'monthly'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  Mensuel
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 relative ${
                    billingCycle === 'yearly'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  Annuel
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    -17%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Grille des plans */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => {
              const planColor = getPlanColor(plan);
              const isPopular = isPlanPopular(plan);
              const isCurrentUserPlan = isCurrentPlan(plan.id);

              return (
                <div 
                  key={plan.id} 
                  className={`bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-500 border border-green-100 relative overflow-hidden ${
                    isPopular ? 'ring-2 ring-green-500' : ''
                  } ${isCurrentUserPlan ? 'ring-2 ring-blue-500' : ''} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  {isPopular && !isCurrentUserPlan && (
                    <div className="bg-green-500 text-white text-center py-2 text-sm font-bold">
                      RECOMMANDÉ
                    </div>
                  )}
                  
                  {isCurrentUserPlan && (
                    <div className="bg-blue-500 text-white text-center py-2 text-sm font-bold">
                      VOTRE ABONNEMENT ACTUEL
                    </div>
                  )}
                  
                  <div className="p-8">
                    {/* En-tête du plan */}
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 ${
                        planColor === 'gray' ? 'bg-gray-100' :
                        planColor === 'green' ? 'bg-green-100' : 'bg-amber-100'
                      } rounded-full flex items-center justify-center mx-auto mb-4`}>
                        {getPlanIcon(plan)}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-green-800 mb-2">{plan.name}</h3>
                      <p className="text-gray-600">{plan.description}</p>
                    </div>

                    {/* Prix */}
                    <div className="text-center mb-8">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-green-800">
                          {billingCycle === 'monthly' 
                            ? `${plan.price_monthly.toFixed(2)}€` 
                            : `${plan.price_yearly.toFixed(2)}€`}
                        </span>
                        <span className="text-gray-500 ml-1">
                          /{billingCycle === 'monthly' ? 'mois' : 'an'}
                        </span>
                      </div>

                      {billingCycle === 'yearly' && (
                        <p className="mt-2 text-center text-sm text-green-600 font-medium">
                          Économisez {calculateYearlySavingsPercent(plan)}% par rapport au paiement mensuel
                        </p>
                      )}
                    </div>

                    {/* Fonctionnalités */}
                    <div className="mb-8">
                      <ul className="space-y-3">
                        {renderFeatureWithValue(
                          "Scans par jour", 
                          plan.max_scan_auto >= 9000 ? 'Illimité' : plan.max_scan_auto,
                          true
                        )}
                        
                        {renderFeatureWithValue(
                          "Recherche par code", 
                          plan.max_scan_manuel >= 9000 ? 'Illimité' : plan.max_scan_manuel,
                          true
                        )}
                        
                        {renderFeatureWithValue(
                          "Recherche par nom", 
                          plan.max_recherche >= 9000 ? 'Illimité' : plan.max_recherche,
                          true
                        )}

                        {renderFeatureWithValue(
                          "Consultation avis par jour", 
                          plan.max_consult_avis >= 9000 ? 'Illimité' : plan.max_consult_avis,
                          true
                        )}
                        
                        {/* Afficher les fonctionnalités personnalisées depuis le champ JSONB */}
                        {plan.features && Object.entries(plan.features).map(([feature, included]) => (
                          <li key={feature}>
                            {renderFeature(feature, included)}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <div className="mt-8">
                      {isCurrentUserPlan ? (
                        // Si c'est le plan actuel, afficher un message au lieu du bouton
                        <div className="w-full px-6 py-3 text-base font-medium rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                          <Info className="mr-2" size={18} />
                          <span>Votre abonnement actuel</span>
                        </div>
                      ) : (
                        // Sinon, afficher le bouton d'abonnement normal
                        <button
                          onClick={() => handleSubscribe(plan.id, plan.name)}
                          className={`w-full px-6 py-3 text-base font-medium rounded-md text-white ${
                            plan.name === 'Essential'
                              ? 'bg-green-600 hover:bg-green-700'
                              : plan.name === 'Gratuit'
                                ? 'bg-gray-600 hover:bg-gray-700'
                                : 'bg-green-500 hover:bg-green-600'
                          } transition duration-150 ease-in-out`}
                        >
                          {plan.name === 'Gratuit' ? 'Commencer gratuitement' : 'Souscrire maintenant'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Section CTA finale */}
          <div className="text-center mb-16">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">Prêt à révolutionner vos choix de produits ?</h2>
              <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                Rejoignez des milliers d'utilisateurs qui font déjà confiance à Fydo pour leurs achats quotidiens.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => {
                    const essentialPlan = plans.find(p => p.name.toLowerCase().includes('essential'));
                    if (essentialPlan) handleSubscribe(essentialPlan.id, essentialPlan.name);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
                >
                  Commencer maintenant
                </button>
                
                <Link
                  to="/recherche-filtre"
                  className="bg-white hover:bg-gray-50 text-green-700 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
                >
                  Essayer gratuitement
                </Link>
              </div>
              
              <p className="text-green-100 text-sm mt-4">
                🛡️ Garantie 30 jours satisfait ou remboursé • 🔒 Résiliation en un clic
              </p>
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
                <p className="text-green-700 text-sm">Explorez toutes les capacités de Fydo en détail</p>
              </Link>
              
              <Link
                to="/concept"
                className="group p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Users size={32} className="text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-blue-800 mb-2">Notre concept</h4>
                <p className="text-blue-700 text-sm">Découvrez la philosophie et la mission de Fydo</p>
              </Link>
              
              <Link
                to="/recherche-filtre"
                className="group p-6 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Search size={32} className="text-amber-600 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-amber-800 mb-2">Essayer maintenant</h4>
                <p className="text-amber-700 text-sm">Commencez à scanner vos premiers produits</p>
              </Link>
            </div>
          </div>

          {/* Footer informatif */}
          <div className="mt-12 text-center">
            <p className="text-green-600">
              Tous nos abonnements incluent un support client 7j/7 et une garantie satisfait ou remboursé de 14 jours.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlans;