// utils/logger.js
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  info: (...args) => isDev && console.info(...args),
  warn: (...args) => console.warn(...args), // Toujours affiché
  error: (...args) => console.error(...args), // Toujours affiché
  debug: (...args) => isDev && console.log(...args)
};

// Utilisation
//import {logger } from './utils/logger';
//logger.debug('Debug info'); // Seulement en dev
//logger.error('Erreur critique'); // Toujours affiché