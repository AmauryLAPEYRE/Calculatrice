// src/components/achievements/TrophyAnimations.js
import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy } from 'lucide-react';

// URLs des animations Lottie gratuites (depuis LottieFiles)
const LOTTIE_ANIMATIONS = {
  trophy_gold: 'https://assets2.lottiefiles.com/packages/lf20_touohxv0.json',
  medal_spin: 'https://assets9.lottiefiles.com/packages/lf20_lc0lqpbg.json',
  star_burst: 'https://assets1.lottiefiles.com/packages/lf20_kvdyp9s6.json',
  confetti: 'https://assets5.lottiefiles.com/packages/lf20_obhph3sh.json',
  crown: 'https://assets7.lottiefiles.com/packages/lf20_5kthfw5o.json',
  diamond: 'https://assets3.lottiefiles.com/packages/lf20_n9ryrmts.json',
  celebration: 'https://assets2.lottiefiles.com/packages/lf20_aEFaHc.json'
};

// Composant Trophée avec animation Lottie
export const LottieTrophy = ({ animationUrl, size = 100, loop = true }) => {
  const [animationData, setAnimationData] = useState(null);
  
  useEffect(() => {
    // Charger l'animation
    fetch(animationUrl)
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error('Erreur chargement animation:', err));
  }, [animationUrl]);
  
  if (!animationData) {
    return (
      <div style={{ width: size, height: size }} className="flex items-center justify-center">
        <Trophy className="animate-pulse text-gray-400" size={size * 0.6} />
      </div>
    );
  }
  
  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      style={{ width: size, height: size }}
    />
  );
};

// Notification de déblocage épique avec Lottie
export const EpicUnlockNotification = ({ trophy, onClose }) => {
  const [stage, setStage] = useState('entering'); // entering, showing, exiting
  
  useEffect(() => {
    // Séquence d'animation
    const timeline = [
      { delay: 0, action: () => setStage('entering') },
      { delay: 500, action: () => {
        // Confetti personnalisé
        const count = 200;
        const defaults = {
          origin: { y: 0.7 }
        };
        
        function fire(particleRatio, opts) {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
          });
        }
        
        fire(0.25, {
          spread: 26,
          startVelocity: 55,
        });
        fire(0.2, {
          spread: 60,
        });
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 45,
        });
      }},
      { delay: 1000, action: () => setStage('showing') },
      { delay: 5000, action: () => setStage('exiting') },
      { delay: 5500, action: onClose }
    ];
    
    const timers = timeline.map(({ delay, action }) => 
      setTimeout(action, delay)
    );
    
    return () => timers.forEach(clearTimeout);
  }, [onClose]);
  
  return (
    <AnimatePresence>
      {stage !== 'exiting' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: stage === 'showing' ? 1 : 1.2,
            opacity: 1
          }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none"
        >
          {/* Fond sombre */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black pointer-events-auto"
            onClick={onClose}
          />
          
          {/* Contenu de la notification */}
          <motion.div
            className="relative z-10"
            animate={{
              rotate: stage === 'entering' ? [0, 10, -10, 0] : 0
            }}
            transition={{ duration: 0.5 }}
          >
            {/* Effet de halo lumineux */}
            <div className="absolute inset-0 blur-3xl">
              <div className={`w-full h-full bg-gradient-to-r ${trophy.gradient || 'from-yellow-400 to-yellow-600'} opacity-50 animate-pulse`} />
            </div>
            
            {/* Carte du trophée */}
            <motion.div
              className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-yellow-400"
              whileHover={{ scale: 1.05 }}
            >
              {/* Animation Lottie de célébration en arrière-plan */}
              <div className="absolute inset-0 opacity-30">
                <LottieTrophy 
                  animationUrl={LOTTIE_ANIMATIONS.celebration}
                  size={400}
                  loop={false}
                />
              </div>
              
              {/* Contenu principal */}
              <div className="relative z-10 text-center">
                <motion.h2
                  className="text-4xl font-bold text-yellow-400 mb-4"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    textShadow: [
                      '0 0 20px rgba(251, 191, 36, 0.5)',
                      '0 0 40px rgba(251, 191, 36, 0.8)',
                      '0 0 20px rgba(251, 191, 36, 0.5)'
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  TROPHÉE DÉBLOQUÉ !
                </motion.h2>
                
                {/* Trophée animé */}
                <div className="my-8">
                  <LottieTrophy 
                    animationUrl={
                      trophy.special ? LOTTIE_ANIMATIONS.crown :
                      trophy.rarity === 'legendary' ? LOTTIE_ANIMATIONS.diamond :
                      trophy.rarity === 'epic' ? LOTTIE_ANIMATIONS.trophy_gold :
                      LOTTIE_ANIMATIONS.medal_spin
                    }
                    size={200}
                    loop={false}
                  />
                </div>
                
                {/* Infos du trophée */}
                <h3 className="text-2xl font-bold text-white mb-2">{trophy.name}</h3>
                <p className="text-gray-300 mb-4">{trophy.description}</p>
                
                {/* Points avec animation */}
                <motion.div
                  className="inline-flex items-center bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold text-xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  +{trophy.points} POINTS
                </motion.div>
                
                {/* Badges spéciaux */}
                <div className="flex justify-center gap-2 mt-4">
                  {trophy.limited && (
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      ÉDITION LIMITÉE
                    </span>
                  )}
                  {trophy.hidden && (
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      TROPHÉE SECRET
                    </span>
                  )}
                  {trophy.special && (
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      SPÉCIAL
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Galerie de trophées interactive
export const InteractiveTrophyGallery = ({ trophies, userTrophies = [] }) => {
  const [selectedTrophy, setSelectedTrophy] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unlocked, locked
  
  const filteredTrophies = trophies.filter(trophy => {
    if (filter === 'unlocked') return userTrophies.includes(trophy.id);
    if (filter === 'locked') return !userTrophies.includes(trophy.id);
    return true;
  });
  
  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex justify-center gap-2">
        {['all', 'unlocked', 'locked'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              filter === f
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {f === 'all' ? 'Tous' : f === 'unlocked' ? 'Débloqués' : 'Verrouillés'}
          </button>
        ))}
      </div>
      
      {/* Grille de trophées */}
      <motion.div 
        layout
        className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
      >
        <AnimatePresence>
          {filteredTrophies.map((trophy) => {
            const isUnlocked = userTrophies.includes(trophy.id);
            
            return (
              <motion.div
                key={trophy.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                className="relative cursor-pointer"
                onClick={() => setSelectedTrophy(trophy)}
              >
                <div className={`
                  relative rounded-2xl p-4 transition-all
                  ${isUnlocked 
                    ? `bg-gradient-to-br ${trophy.gradient} shadow-lg` 
                    : 'bg-gray-200'
                  }
                `}>
                  {/* Icône ou animation */}
                  {trophy.animationUrl ? (
                    <LottieTrophy
                      animationUrl={trophy.animationUrl}
                      size={60}
                      loop={isUnlocked}
                    />
                  ) : (
                    <div className={`text-4xl text-center ${!isUnlocked && 'grayscale opacity-50'}`}>
                      {trophy.emoji}
                    </div>
                  )}
                  
                  {/* Badge de verrouillage */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                      <Lock className="text-white" size={24} />
                    </div>
                  )}
                  
                  {/* Points */}
                  <div className="text-center mt-2">
                    <p className="text-xs font-bold text-white">
                      {trophy.points} pts
                    </p>
                  </div>
                </div>
                
                {/* Nom du trophée au hover */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap z-20"
                >
                  {trophy.name}
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      
      {/* Modal de détails */}
      <AnimatePresence>
        {selectedTrophy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedTrophy(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedTrophy.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{selectedTrophy.name}</h3>
                <p className="text-gray-600 mb-4">{selectedTrophy.description}</p>
                <div className="flex justify-center gap-4">
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                    {selectedTrophy.points} points
                  </span>
                  {selectedTrophy.rarity && (
                    <span className={`px-4 py-2 rounded-full font-bold ${
                      selectedTrophy.rarity === 'common' ? 'bg-gray-100 text-gray-700' :
                      selectedTrophy.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                      selectedTrophy.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedTrophy.rarity.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Hook pour gérer les animations de déblocage
export const useTrophyAnimations = () => {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  
  const addToQueue = (trophy) => {
    setQueue(prev => [...prev, trophy]);
  };
  
  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
      setQueue(prev => prev.slice(1));
    }
  }, [current, queue]);
  
  const onAnimationComplete = () => {
    setCurrent(null);
  };
  
  return {
    current,
    addToQueue,
    onAnimationComplete
  };
};

export default TrophyAnimations;