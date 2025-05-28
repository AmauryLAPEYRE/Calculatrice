// src/services/userProfileService.js
import { supabase } from '../supabaseClient';

export const userProfileService = {
  // Récupérer toutes les données du profil utilisateur
  async getUserProfileData(userId) {
    try {
      // 1. Récupérer les informations utilisateur de base
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // 2. Récupérer les statistiques des avis
      const { data: reviews, count: reviewCount } = await supabase
        .from('product_reviews')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      // 3. Récupérer les badges gagnés (si la table existe)
      let userBadges = [];
      try {
        const { data, error } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', userId);
        if (!error) userBadges = data || [];
      } catch (e) {
        console.log('Table user_badges non disponible');
      }

      // 4. Récupérer les challenges complétés
      let completedChallenges = [];
      try {
        const { data } = await supabase
          .from('user_challenges')
          .select('*')
          .eq('user_id', userId)
          .eq('is_completed', true)
          .order('completed_date', { ascending: false });
        completedChallenges = data || [];
      } catch (e) {
        console.log('Erreur challenges complétés');
      }

      // 5. Récupérer les challenges actifs
      let activeChallenges = [];
      try {
        const { data } = await supabase
          .from('user_challenges')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true)
          .eq('is_completed', false);
        activeChallenges = data || [];
      } catch (e) {
        console.log('Erreur challenges actifs');
      }

      // 6. Récupérer le niveau actuel (si disponible)
      let userLevel = null;
      let nextLevel = null;
      try {
        const { data: levelData } = await supabase
          .from('user_levels')
          .select('*')
          .lte('required_points', userProfile?.total_points || 0)
          .order('required_points', { ascending: false })
          .limit(1);
        userLevel = levelData?.[0] || null;
        
        const { data: nextData } = await supabase
          .from('user_levels')
          .select('*')
          .gt('required_points', userProfile?.total_points || 0)
          .order('required_points', { ascending: true })
          .limit(1);
        nextLevel = nextData?.[0] || null;
      } catch (e) {
        console.log('Tables de niveaux non disponibles');
      }

      // 8. Calculer les statistiques
      const verifiedCount = reviews?.filter(r => r.is_verified || r.receipt_id).length || 0;
      const totalLikes = reviews?.reduce((sum, r) => sum + (r.likes_count || 0), 0) || 0;
      
      // Pour les catégories, on devra les récupérer séparément
      let uniqueCategories = [];
      
      // Nombre de fois premier à évaluer (si la colonne existe)
      let firstReviewsCount = 0;
      try {
        const { count } = await supabase
          .from('product_reviews')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('is_first_review', true);
        firstReviewsCount = count || 0;
      } catch (e) {
        // La colonne is_first_review n'existe peut-être pas
        console.log('Colonne is_first_review non disponible');
      }

      // 9. Récupérer les avis récents
      const { data: recentReviews } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('user_id', userId)
        .order('creation_date', { ascending: false })
        .limit(5);
        
      // Enrichir avec les infos produits
      if (recentReviews && recentReviews.length > 0) {
        const productCodes = recentReviews.map(r => r.product_code).filter(Boolean);
        const { data: products } = await supabase
          .from('products')
          .select('code, product_name, brands, image_url')
          .in('code', productCodes);
          
        recentReviews.forEach(review => {
          const product = products?.find(p => p.code === review.product_code);
          if (product) {
            review.products = {
              name: product.product_name,
              brand: product.brands,
              image_url: product.image_url
            };
          }
        });
      }

      // 10. Récupérer le nombre de produits scannés depuis l'historique
      const { count: scannedProductsCount } = await supabase
        .from('product_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .in('interaction_type', ['scan', 'search', 'manual_entry', 'searchName']);

      // 11. Récupérer les favoris
      const { count: favoritesCount } = await supabase
        .from('favorite_products')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      return {
        success: true,
        data: {
          profile: userProfile,
          stats: {
            totalReviews: reviewCount || 0,
            verifiedPurchases: verifiedCount,
            totalLikes,
            firstReviews: firstReviewsCount || 0,
            uniqueCategories: 0, // À calculer différemment si nécessaire
            scannedProducts: scannedProductsCount || 0,
            favorites: favoritesCount || 0,
            memberSince: userProfile?.created_at,
            totalPoints: userProfile?.total_points || 0,
            created_at: userProfile?.created_at
          },
          level: {
            current: userLevel,
            next: nextLevel,
            progress: nextLevel ? ((userProfile?.total_points || 0) - (userLevel?.required_points || 0)) / 
                                 ((nextLevel?.required_points || 1) - (userLevel?.required_points || 0)) * 100 : 100
          },
          badges: userBadges || [],
          completedChallenges: completedChallenges || [],
          activeChallenges: activeChallenges || [],
          recentReviews: recentReviews || []
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Récupérer l'historique d'activité depuis product_history
  async getUserActivityHistory(userId, limit = 10) {
    try {
      const { data: activities } = await supabase
        .from('product_history')
        .select('*')
        .eq('user_id', userId)
        .order('interaction_date', { ascending: false })
        .limit(limit);

      return {
        success: true,
        data: activities || []
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'activité:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Calculer le rang de l'utilisateur
  async getUserRanking(userId) {
    try {
      // Fonction RPC peut ne pas exister, on fait une approche simple
      const { data: topUsers } = await supabase
        .from('users')
        .select('id, display_name, total_points')
        .order('total_points', { ascending: false })
        .limit(100);
        
      let userRank = null;
      if (topUsers) {
        const index = topUsers.findIndex(u => u.id === userId);
        if (index !== -1) {
          userRank = index + 1;
        }
      }

      return {
        success: true,
        data: {
          rank: userRank,
          topUsers: topUsers?.slice(0, 10) || []
        }
      };
    } catch (error) {
      console.error('Erreur lors du calcul du rang:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};