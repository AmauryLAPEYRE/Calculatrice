// src/pages/SubscriptionPlans.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Check, 
  X, 
  ChevronRight,
  Crown,
  Star,
  Zap,
  Shield,
  Gift,
  Users,
  Smartphone,
  Heart,
  Loader,
  ArrowRight,
  Sparkles,
  Award,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isVisible, setIsVisible] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const { currentUser, subscriptionPlan } = useAuth();
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const navigate = useNavigate();

  // Déclencher les animations au chargement
  useEffect(() => {
    setIsVisible(true);
    setTimeout(() => setAnimationDone(true), 100);
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
        
        setPlans(data || []);
      } catch (err) {
        console.error('Erreur lors du chargement des plans:', err.message);
        // Charger des plans par défaut si erreur
        setPlans([
          {
            id: 1,
            name: 'Gratuit',
            description: 'Accès limité aux fonctionnalités de base',
            price_monthly: 0,
            price_yearly: 0,
            max_scan_auto: 3,
            max_scan_manuel: 5,
            max_recherche: 5,
            max_consult_avis: 3,
            features: {
              'Déposer avis avec preuve d\'achat': true,
              'Gestion des favoris limité à 3': true,
              'Historique des consultations': false,
              'Accès aux informations Nutri/Eco Score': false,
              'Publicité / Annonce': true,
              '1 semaine Essential offert': true
            }
          },
          {
            id: 2,
            name: 'Essential',
            description: 'Pour utilisateurs réguliers',
            price_monthly: 1,
            price_yearly: 10,
            max_scan_auto: 9999,
            max_scan_manuel: 9999,
            max_recherche: 9999,
            max_consult_avis: 9999,
            features: {
              'Déposer Avis avec preuve d\'achat': true,
              'Gestion des favoris': true,
              'Historique des consultations': true,
              'Accès aux informations Nutri/Eco Score': false,
              'Publicité / Annonce': false,
              '1 semaine Premium offert': true
            }
          },
          {
            id: 3,
            name: 'Premium',
            description: 'Pour utilisateurs intensifs',
            price_monthly: 20,
            price_yearly: 200,
            max_scan_auto: 9999,
            max_scan_manuel: 9999,
            max_recherche: 9999,
            max_consult_avis: 9999,
            features: {
              'Déposer Avis avec preuve d\'achat': true,
              'Gestion des favoris': true,
              'Historique des consultations': true,
              'Accès aux informations Nutri/Eco Score': true,
              'Publicité / Annonce': false
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionPlans();
    
    if (currentUser && subscriptionPlan) {
      setCurrentPlanId(subscriptionPlan.id);
    }
  }, [currentUser, subscriptionPlan]);

  const isCurrentPlan = (planId) => {
    return currentPlanId === planId;
  };

  const handleSubscribe = (planId, planName) => {
    if (planName === 'Gratuit') {
      return;
    }
    
    if (isCurrentPlan(planId)) {
      console.log("Vous êtes déjà abonné à ce plan");
      return;
    }
    
    if (!currentUser) {
      navigate('/login', { 
        state: { 
          redirectTo: `/subscribe/${planId}?cycle=${billingCycle}`
        } 
      });
      return;
    }
    
    navigate(`/subscribe/${planId}`, { 
      state: { 
        billingCycle: billingCycle,
        planId: planId
      } 
    });
  };

  const calculateYearlySavingsPercent = (plan) => {
    const monthlyCost = plan.price_monthly * 12;
    const yearlyCost = plan.price_yearly;
    return Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
  };

  const renderFeatureWithValue = (label, value, included) => (
    <div className="flex items-center py-2.5">
      {included ? (
        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
          <Check className="h-3 w-3 text-green-600" />
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0">
          <X className="h-3 w-3 text-red-500" />
        </div>
      )}
      <span className={`${included ? "text-gray-800" : "text-gray-400"} text-sm`}>
        {label}: <span className="font-bold text-green-600">{value}</span>
      </span>
    </div>
  );

  const renderFeature = (feature, included) => (
    <div className="flex items-center py-2.5">
      {included ? (
        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
          <Check className="h-3 w-3 text-green-600" />
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0">
          <X className="h-3 w-3 text-red-500" />
        </div>
      )}
      <span className={`${included ? "text-gray-800" : "text-gray-400"} text-sm`}>{feature}</span>
    </div>
  );

  const getPlanIcon = (plan) => {
    const planName = plan.name.toLowerCase();
    if (planName.includes('gratuit') || planName.includes('free')) {
      return <Heart size={40} className="text-gray-600" />;
    }
    if (planName.includes('essential') || planName.includes('basic')) {
      return <Zap size={40} className="text-green-600" />;
    }
    if (planName.includes('premium') || planName.includes('pro')) {
      return <Crown size={40} className="text-amber-600" />;
    }
    return <Star size={40} className="text-blue-600" />;
  };

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

  const isPlanPopular = (plan) => {
    return plan.name.toLowerCase().includes('essential') || plan.name.toLowerCase().includes('basic');
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-green-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <Loader className="animate-spin h-10 w-10 text-green-600 mx-auto mb-4" />
          <p className="text-green-700">Chargement de vos offres...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-green-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-600 to-green-700 relative overflow-hidden">
      <Helmet>
        <title>Abonnements | Fydo - Choisissez Votre Plan Pour Des Choix Parfaits</title>
        <meta name="description" content="Découvrez nos plans d'abonnement Fydo : scans illimités, avis vérifiés et fonctionnalités avancées pour vos achats." />
      </Helmet>

      {/* Éléments décoratifs simplifiés */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-800 rounded-full transform translate-x-1/3 translate-y-1/3 opacity-20"></div>
      
      {/* Styles d'animation personnalisés */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(200px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .delay-200 { animation-delay: 200ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-600 { animation-delay: 600ms; }
        .delay-800 { animation-delay: 800ms; }
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>

      <div className="container mx-auto px-4 pt-24 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-green-100">
              <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
              <li><ChevronRight size={16} /></li>
              <li className="text-white font-medium">Abonnements</li>
            </ol>
          </nav>

          {/* Header Section avec animation */}
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ opacity: isVisible ? 1 : 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Tous les Plans pour <span className="text-amber-300">Choisir Parfaitement</span>
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Déverrouillez tout le potentiel de Fydo avec nos abonnements adaptés à vos besoins
            </p>
            
            {/* Trust indicators avec icônes */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-4 py-2 transform hover:scale-105 transition-all duration-300">
                <Shield size={20} className="mr-2 text-green-200" />
                <span className="text-sm text-white font-medium">30 jours satisfait ou remboursé</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-4 py-2 transform hover:scale-105 transition-all duration-300">
                <Crown size={20} className="mr-2 text-amber-300" />
                <span className="text-sm text-white font-medium">Résiliation à tout moment</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-4 py-2 transform hover:scale-105 transition-all duration-300">
                <Gift size={20} className="mr-2 text-green-200" />
                <span className="text-sm text-white font-medium">Plan gratuit à vie</span>
              </div>
            </div>
          </div>

          {/* Section illustration animée des économies */}
          <div className={`relative mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                
                {/* Illustration animée à gauche */}
                <div className="relative">
                  <div className="relative max-w-sm mx-auto">
                    {/* Fond décoratif */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-300 to-amber-200 rounded-2xl transform rotate-3 scale-105 opacity-30"></div>
                    
                    {/* Carte de crédit animée */}
                    <div className="relative bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-500" style={{ perspective: '1000px' }}>
                      <div className="absolute top-2 right-2">
                        <div className="w-12 h-12 bg-amber-400 rounded-full animate-pulse"></div>
                      </div>
                      
                      {/* Puce de carte */}
                      <div className="w-12 h-10 bg-amber-300 rounded mb-4"></div>
                      
                      {/* Numéro de carte masqué */}
                      <div className="flex space-x-2 mb-4">
                        <div className="flex space-x-1">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
                          ))}
                        </div>
                        <div className="flex space-x-1">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
                          ))}
                        </div>
                        <div className="flex space-x-1">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
                          ))}
                        </div>
                        <div className="text-white font-bold">FYDO</div>
                      </div>
                      
                      {/* Nom du titulaire */}
                      <div className="text-white text-sm">
                        <div className="text-xs opacity-70">MEMBRE</div>
                        <div className="font-bold">PREMIUM</div>
                      </div>
                      
                      {/* Badge Fydo */}
                      <div className="absolute bottom-4 right-4 text-white">
                        <div className="flex items-center">
                          <span className="text-2xl font-bold">Fydo</span>
                          <Star className="text-amber-400 fill-amber-400 ml-1" size={24} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Économies qui flottent autour */}
                    <div className="absolute -top-4 -right-4 bg-orange-500 text-white rounded-full p-3 shadow-lg animate-bounce">
                      <span className="font-bold text-sm">-17%</span>
                    </div>
                    
                    <div className="absolute -bottom-4 -left-4 bg-green-500 text-white rounded-full p-3 shadow-lg animate-bounce" style={{ animationDelay: '0.5s' }}>
                      <span className="font-bold text-sm">€€€</span>
                    </div>
                  </div>
                </div>
                
                {/* Texte à droite */}
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-4">Économisez plus avec l'abonnement annuel</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-400 bg-opacity-30 rounded-full flex items-center justify-center mr-3">
                        <Check size={16} className="text-white" />
                      </div>
                      <span>Jusqu'à 17% de réduction sur tous les plans</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-400 bg-opacity-30 rounded-full flex items-center justify-center mr-3">
                        <Check size={16} className="text-white" />
                      </div>
                      <span>Pas d'augmentation de prix pendant 1 an</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-400 bg-opacity-30 rounded-full flex items-center justify-center mr-3">
                        <Check size={16} className="text-white" />
                      </div>
                      <span>Accès prioritaire aux nouvelles fonctionnalités</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques de confiance */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <Users size={32} className="text-green-200 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">10,000+</div>
              <p className="text-green-100">Utilisateurs actifs</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <Star size={32} className="text-amber-300 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">4.8/5</div>
              <p className="text-green-100">Note moyenne</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300">
              <TrendingUp size={32} className="text-green-200 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">98%</div>
              <p className="text-green-100">Taux de satisfaction</p>
            </div>
          </div>

          {/* Section évolution des badges */}
          <div className={`bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 mb-16 transition-all duration-1000 delay-600 ${animationDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <h3 className="text-2xl font-bold text-white text-center mb-8">Évoluez avec votre abonnement</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Gratuit */}
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
                    <Award size={40} className="text-gray-600" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                    Bronze
                  </div>
                </div>
                <h4 className="text-white font-bold mb-2">Plan Gratuit</h4>
                <ul className="text-green-100 text-sm space-y-1">
                  <li>• Badge Bronze</li>
                  <li>• 3 scans/jour</li>
                  <li>• Communauté de base</li>
                </ul>
              </div>
              
              {/* Essential */}
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
                    <Award size={40} className="text-white" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                    Argent
                  </div>
                </div>
                <h4 className="text-white font-bold mb-2">Plan Essential</h4>
                <ul className="text-green-100 text-sm space-y-1">
                  <li>• Badge Argent</li>
                  <li>• Scans illimités</li>
                  <li>• Priorité support</li>
                </ul>
              </div>
              
              {/* Premium */}
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
                    <Crown size={40} className="text-white" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-2 py-1 rounded-full">
                    Or/Diamant
                  </div>
                </div>
                <h4 className="text-white font-bold mb-2">Plan Premium</h4>
                <ul className="text-green-100 text-sm space-y-1">
                  <li>• Badge Or/Diamant</li>
                  <li>• Accès VIP complet</li>
                  <li>• Nouvelles fonctionnalités</li>
                </ul>
              </div>
            </div>
            
            {/* Barre de progression */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="bg-white bg-opacity-20 rounded-full h-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-gray-400 via-gray-500 to-amber-500 rounded-full transition-all duration-1000" style={{ width: '100%' }}>
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-green-100">
                <span>Débutant</span>
                <span>Contributeur</span>
                <span>Expert</span>
              </div>
            </div>
          </div>

          {/* Sélecteur de cycle de facturation - déplacé ici */}
          <div className="flex justify-center mb-16 relative z-10">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-1.5 shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex relative">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                    billingCycle === 'monthly'
                      ? 'bg-green-600 text-white shadow-lg transform scale-105'
                      : 'text-green-700 hover:text-green-600'
                  }`}
                >
                  Mensuel
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-8 py-3 rounded-full font-medium transition-all duration-300 relative ${
                    billingCycle === 'yearly'
                      ? 'bg-green-600 text-white shadow-lg transform scale-105'
                      : 'text-green-700 hover:text-green-600'
                  }`}
                >
                  Annuel
                  <span className="absolute -top-3 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                    -17%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Grille des plans avec nouveau design */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 pt-2">
            {plans.map((plan, index) => {
              const planColor = getPlanColor(plan);
              const isPopular = isPlanPopular(plan);
              const isCurrentUserPlan = isCurrentPlan(plan.id);

              return (
                                <div 
                  key={plan.id}
                  className={`relative transition-all duration-700 transform ${
                    animationDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                  } ${isPopular ? 'lg:scale-105 z-10' : 'hover:scale-105'}`}
                  style={{ transitionDelay: `${animationDone ? 0 : 300 + index * 150}ms` }}
                >
                  {/* Badge recommandé ou plan actuel */}
                  {(isPopular || isCurrentUserPlan) && (
                    <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 z-30 ${
                      isCurrentUserPlan 
                        ? 'bg-blue-500' 
                        : 'bg-gradient-to-r from-amber-400 to-amber-500'
                    } text-white px-5 py-2 rounded-full text-xs font-bold shadow-lg flex items-center whitespace-nowrap`}>
                      {isCurrentUserPlan ? (
                        <>
                          <Award size={14} className="mr-1" />
                          VOTRE PLAN ACTUEL
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} className="mr-1" />
                          RECOMMANDÉ
                        </>
                      )}
                    </div>
                  )}

                  <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden h-full flex flex-col group ${
                    isPopular ? 'ring-4 ring-amber-400 ring-opacity-50' : ''
                  } ${isCurrentUserPlan ? 'ring-4 ring-blue-400 ring-opacity-50' : ''}`}>
                    
                    {/* En-tête du plan avec dégradé */}
                    <div className={`p-8 text-center bg-gradient-to-br ${
                      planColor === 'gray' ? 'from-gray-50 to-gray-100' :
                      planColor === 'green' ? 'from-green-50 to-green-100' : 
                      'from-amber-50 to-amber-100'
                    }`}>
                      <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        planColor === 'gray' ? 'bg-gray-200' :
                        planColor === 'green' ? 'bg-green-200' : 'bg-amber-200'
                      } transform transition-all duration-500 hover:rotate-12 hover:scale-110`}>
                        {getPlanIcon(plan)}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                      <p className="text-gray-600 text-sm">{plan.description}</p>
                    </div>

                    {/* Prix avec animation */}
                    <div className="px-8 py-6 text-center border-b border-gray-100">
                      <div className="flex items-baseline justify-center">
                        <span className="text-5xl font-bold text-gray-800">
                          {billingCycle === 'monthly' 
                            ? `${plan.price_monthly.toFixed(0)}` 
                            : `${(plan.price_yearly / 12).toFixed(0)}`}
                        </span>
                        <span className="text-xl text-gray-500 ml-1">€</span>
                        <span className="text-gray-500 ml-1">/mois</span>
                      </div>

                      {billingCycle === 'yearly' && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-500 line-through">
                            {(plan.price_monthly * 12).toFixed(0)}€/an
                          </p>
                          <p className="text-green-600 font-medium flex items-center justify-center">
                            <Gift size={16} className="mr-1" />
                            Économisez {calculateYearlySavingsPercent(plan)}% ({((plan.price_monthly * 12) - plan.price_yearly).toFixed(0)}€)
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Fonctionnalités */}
                    <div className="flex-1 px-8 py-6">
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
                          "Consultation avis", 
                          plan.max_consult_avis >= 9000 ? 'Illimité' : plan.max_consult_avis,
                          true
                        )}
                        
                        {plan.features && Object.entries(plan.features).map(([feature, included]) => (
                          <li key={feature}>
                            {renderFeature(feature, included)}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA avec nouveau style */}
                    <div className="p-8 pt-4 group">
                      {isCurrentUserPlan ? (
                        <div className="w-full px-6 py-3 text-base font-medium rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                          <Award className="mr-2" size={18} />
                          <span>Votre abonnement actuel</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSubscribe(plan.id, plan.name)}
                          className={`w-full px-6 py-4 text-base font-bold rounded-xl text-white transform transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group ${
                            planColor === 'gray' 
                              ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
                              : planColor === 'green'
                                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
                          }`}
                        >
                          {plan.name === 'Gratuit' ? 'Commencer gratuitement' : 'Souscrire maintenant'}
                          <ArrowRight size={20} className="inline-block ml-2 transition-transform group-hover:translate-x-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Témoignage */}
          <div className={`mb-16 transition-all duration-1000 delay-500 ${animationDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-gradient-to-br from-amber-500 to-amber-600 p-8 flex flex-col justify-center relative overflow-hidden">
                  {/* Effet de particules dans le fond */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-4 h-4 bg-white rounded-full animate-float"></div>
                    <div className="absolute bottom-20 right-20 w-3 h-3 bg-white rounded-full animate-float delay-200"></div>
                    <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-white rounded-full animate-float delay-400"></div>
                  </div>
                  <div className="text-white mb-4 relative z-10">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={20} className="text-white fill-white mr-1" />
                      ))}
                    </div>
                  </div>
                  <p className="text-white text-lg italic mb-4 relative z-10">
                    "L'abonnement Essential de Fydo vaut vraiment le coup ! Je scanne tous mes produits et j'ai accès à une base d'avis incroyable."
                  </p>
                  <div className="flex items-center relative z-10">
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-bold mr-3">
                      S
                    </div>
                    <div>
                      <p className="text-white font-bold">Sophie L.</p>
                      <p className="text-amber-100 text-sm">Abonnée Essential</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3 p-8 bg-gradient-to-br from-green-50 to-white">
                  <h3 className="text-2xl font-bold text-green-800 mb-6">Pourquoi nos utilisateurs adorent Fydo Premium</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <Smartphone size={20} className="text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Scans illimités</h4>
                        <p className="text-sm text-gray-600">Scannez autant de produits que vous voulez, où que vous soyez</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <Star size={20} className="text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Avis vérifiés</h4>
                        <p className="text-sm text-gray-600">Accédez à tous les avis avec photos de tickets validés</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <Heart size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Favoris illimités</h4>
                        <p className="text-sm text-gray-600">Sauvegardez tous vos produits préférés sans limite</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <TrendingUp size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Statistiques avancées</h4>
                        <p className="text-sm text-gray-600">Suivez vos habitudes et découvrez des tendances</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section FAQ rapide */}
          <div className={`bg-white rounded-2xl shadow-xl p-8 mb-16 transition-all duration-1000 delay-700 ${animationDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* FAQ à gauche */}
              <div>
                <h3 className="text-2xl font-bold text-green-800 mb-6">Questions fréquentes</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <span className="text-green-600 text-sm">?</span>
                      </div>
                      Puis-je changer de plan à tout moment ?
                    </h4>
                    <p className="text-gray-600 text-sm ml-8">
                      Oui ! Vous pouvez passer à un plan supérieur instantanément ou rétrograder à la fin de votre période de facturation actuelle.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <span className="text-green-600 text-sm">?</span>
                      </div>
                      Y a-t-il une période d'engagement ?
                    </h4>
                    <p className="text-gray-600 text-sm ml-8">
                      Non, tous nos abonnements sont sans engagement. Vous pouvez annuler à tout moment depuis votre espace personnel.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Illustration animée du scanner à droite */}
              <div className="relative">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 relative overflow-hidden">
                  {/* Téléphone avec scanner */}
                  <div className="relative max-w-xs mx-auto">
                    <div className="bg-gray-900 rounded-[2.5rem] p-4 shadow-2xl">
                      {/* Écran du téléphone */}
                      <div className="bg-white rounded-[2rem] p-4 relative" style={{ minHeight: '400px' }}>
                        {/* Header de l'app */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <span className="text-green-600 font-bold text-lg">Fydo</span>
                            <Star className="text-amber-400 fill-amber-400 ml-1" size={20} />
                          </div>
                          <div className="text-xs text-gray-500">Premium</div>
                        </div>
                        
                        {/* Zone de scan animée */}
                        <div className="border-2 border-dashed border-green-400 rounded-lg p-8 mb-4 relative overflow-hidden">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2m-2 0a1 1 0 00-1 1v6a1 1 0 001 1h2m14-8h2a1 1 0 011 1v6a1 1 0 01-1 1h-2" />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-600">Scanner illimité</p>
                          </div>
                          
                          {/* Ligne de scan animée */}
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-500 opacity-50" style={{
                            animation: 'scan 2s linear infinite',
                            boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)'
                          }}></div>
                        </div>
                        
                        {/* Produits scannés récemment */}
                        <div className="space-y-2">
                          <div className="bg-green-50 rounded-lg p-2 flex items-center animate-fade-in-up">
                            <div className="w-8 h-8 bg-green-200 rounded mr-2"></div>
                            <div className="flex-1">
                              <div className="text-xs font-medium">Produit scanné</div>
                              <div className="flex">
                                {[1,2,3,4,5].map(i => (
                                  <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-green-50 rounded-lg p-2 flex items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="w-8 h-8 bg-amber-200 rounded mr-2"></div>
                            <div className="flex-1">
                              <div className="text-xs font-medium">Avis vérifié</div>
                              <div className="text-xs text-green-600">✓ Ticket validé</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Badge illimité */}
                        <div className="absolute bottom-4 right-4">
                          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                            ∞ ILLIMITÉ
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Éléments flottants */}
                  <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg animate-float">
                    <Zap className="text-green-600" size={20} />
                  </div>
                  
                  <div className="absolute bottom-4 left-4 bg-white rounded-full p-2 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                    <Shield className="text-green-600" size={20} />
                  </div>
                </div>
              </div>
            </div>
            
            <style jsx>{`
              @keyframes scan {
                0% { transform: translateY(0); }
                100% { transform: translateY(200px); }
              }
            `}</style>
          </div>

          {/* CTA final avec effet de dégradé */}
          <div className={`text-center transition-all duration-1000 delay-900 ${animationDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <h2 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  Prêt à révolutionner vos choix de produits ?
                </span>
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Rejoignez des milliers d'utilisateurs qui font déjà confiance à Fydo pour leurs achats quotidiens.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => {
                    const essentialPlan = plans.find(p => p.name.toLowerCase().includes('essential'));
                    if (essentialPlan) handleSubscribe(essentialPlan.id, essentialPlan.name);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 flex items-center"
                >
                  <Sparkles size={20} className="mr-2" />
                  Commencer avec Essential
                </button>
                
                <Link
                  to="/recherche-filtre"
                  className="bg-green-50 hover:bg-green-100 text-green-700 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95 border-2 border-green-200"
                >
                  Essayer gratuitement d'abord
                </Link>
              </div>
              
              <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-gray-500">
                <span className="flex items-center">
                  <Shield size={16} className="mr-1 text-green-600" />
                  Paiement sécurisé
                </span>
                <span className="flex items-center">
                  <Gift size={16} className="mr-1 text-green-600" />
                  30 jours de garantie
                </span>
                <span className="flex items-center">
                  <Heart size={16} className="mr-1 text-green-600" />
                  Sans engagement
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlans;