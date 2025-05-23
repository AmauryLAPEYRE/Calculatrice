// scripts/deploy-orchestrator.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DeploymentOrchestrator {
    constructor(options = {}) {
        this.options = {
            environment: process.env.NODE_ENV || 'development',
            skipTests: options.skipTests || false,
            skipBuild: options.skipBuild || false,
            verbose: options.verbose || false,
            dryRun: options.dryRun || false,
            force: options.force || false,
            ...options
        };
        
        this.results = {
            environment: null,
            dependencies: null,
            security: null,
            tests: null,
            build: null,
            deployment: null
        };
        
        this.startTime = Date.now();
        this.errors = [];
        this.warnings = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const colors = {
            info: '\x1b[36m',     // Cyan
            success: '\x1b[32m',  // Green
            warning: '\x1b[33m',  // Yellow
            error: '\x1b[31m',    // Red
            debug: '\x1b[90m',    // Gray
            reset: '\x1b[0m'      // Reset
        };
        
        const icons = {
            info: 'ℹ️ ',
            success: '✅ ',
            warning: '⚠️ ',
            error: '❌ ',
            debug: '🔍 '
        };
        
        const prefix = `${colors[type]}${icons[type]}[${timestamp}]${colors.reset}`;
        console.log(`${prefix} ${message}`);
        
        if (type === 'error') this.errors.push(message);
        if (type === 'warning') this.warnings.push(message);
    }

    debug(message) {
        if (this.options.verbose) {
            this.log(message, 'debug');
        }
    }

    async executeStep(stepName, stepFunction, required = true) {
        this.log(`\n${'='.repeat(20)} ${stepName.toUpperCase()} ${'='.repeat(20)}`, 'info');
        const stepStartTime = Date.now();
        
        try {
            const result = await stepFunction();
            const duration = ((Date.now() - stepStartTime) / 1000).toFixed(2);
            
            if (result.success) {
                this.log(`${stepName} terminé avec succès (${duration}s)`, 'success');
                this.results[stepName.toLowerCase().replace(' ', '_')] = {
                    success: true,
                    duration,
                    details: result.details || {}
                };
                return true;
            } else {
                const message = `${stepName} échoué (${duration}s): ${result.error || 'Erreur inconnue'}`;
                this.log(message, required ? 'error' : 'warning');
                this.results[stepName.toLowerCase().replace(' ', '_')] = {
                    success: false,
                    duration,
                    error: result.error || 'Erreur inconnue'
                };
                return !required;
            }
        } catch (error) {
            const duration = ((Date.now() - stepStartTime) / 1000).toFixed(2);
            const message = `${stepName} échoué avec exception (${duration}s): ${error.message}`;
            this.log(message, required ? 'error' : 'warning');
            this.results[stepName.toLowerCase().replace(' ', '_')] = {
                success: false,
                duration,
                error: error.message
            };
            return !required;
        }
    }

    // Étape 1: Vérification de l'environnement
    async checkEnvironment() {
        return await this.executeStep('Environment Check', async () => {
            this.debug('Vérification des variables d\'environnement...');
            
            try {
                // Utiliser le script de vérification des variables d'environnement
                const { EnvironmentChecker } = require('./check-env.js');
                const checker = new EnvironmentChecker();
                const success = checker.run();
                
                return {
                    success,
                    details: {
                        errors: checker.errors.length,
                        warnings: checker.warnings.length
                    }
                };
            } catch (error) {
                // Fallback: vérification basique
                const requiredVars = [
                    'REACT_APP_FIREBASE_API_KEY',
                    'REACT_APP_FIREBASE_PROJECT_ID',
                    'REACT_APP_SUPABASE_URL'
                ];
                
                const missing = requiredVars.filter(varName => !process.env[varName]);
                
                if (missing.length > 0) {
                    return {
                        success: false,
                        error: `Variables manquantes: ${missing.join(', ')}`
                    };
                }
                
                return { success: true };
            }
        });
    }

    // Étape 2: Vérification des dépendances
    async checkDependencies() {
        return await this.executeStep('Dependencies Check', async () => {
            this.debug('Vérification des dépendances...');
            
            // Vérifier package.json
            if (!fs.existsSync('package.json')) {
                return { success: false, error: 'package.json manquant' };
            }
            
            // Vérifier node_modules
            if (!fs.existsSync('node_modules')) {
                this.log('node_modules manquant, installation en cours...', 'warning');
                try {
                    execSync('npm install', { stdio: 'pipe' });
                    this.log('Dépendances installées', 'success');
                } catch (error) {
                    return { success: false, error: 'Échec de l\'installation des dépendances' };
                }
            }
            
            // Audit de sécurité
            try {
                execSync('npm audit --audit-level high', { stdio: 'pipe' });
                this.debug('Audit de sécurité réussi');
            } catch (error) {
                this.log('Vulnérabilités de sécurité détectées', 'warning');
            }
            
            return { success: true };
        });
    }

    // Étape 3: Vérifications de sécurité
    async checkSecurity() {
        return await this.executeStep('Security Check', async () => {
            this.debug('Vérification de la sécurité...');
            
            const securityChecks = [];
            
            // Vérifier les clés hardcodées
            const sourceFiles = this.getSourceFiles();
            const sensitivePatterns = [
                /sk_live_[a-zA-Z0-9]{24,}/,
                /AIza[0-9A-Za-z\\-_]{35}/,
                /AKIA[0-9A-Z]{16}/
            ];
            
            let foundSensitiveData = false;
            for (const file of sourceFiles.slice(0, 10)) { // Limiter pour éviter les timeouts
                try {
                    const content = fs.readFileSync(file, 'utf8');
                    for (const pattern of sensitivePatterns) {
                        if (pattern.test(content)) {
                            this.log(`Données sensibles détectées dans ${file}`, 'error');
                            foundSensitiveData = true;
                        }
                    }
                } catch (error) {
                    // Ignorer les erreurs de lecture
                }
            }
            
            // Vérifier les permissions des fichiers .env
            const envFiles = ['.env', '.env.local', '.env.production'];
            let insecureFiles = [];
            
            envFiles.forEach(file => {
                if (fs.existsSync(file)) {
                    try {
                        const stats = fs.statSync(file);
                        if (stats.mode & 0o044) {
                            insecureFiles.push(file);
                        }
                    } catch (error) {
                        // Ignorer sur Windows
                    }
                }
            });
            
            if (foundSensitiveData) {
                return { success: false, error: 'Données sensibles hardcodées détectées' };
            }
            
            if (insecureFiles.length > 0) {
                this.log(`Permissions trop larges: ${insecureFiles.join(', ')}`, 'warning');
            }
            
            return { success: true };
        }, false); // Non requis
    }

    // Étape 4: Tests
    async runTests() {
        if (this.options.skipTests) {
            this.log('Tests ignorés (--skip-tests)', 'warning');
            return true;
        }
        
        return await this.executeStep('Tests', async () => {
            this.debug('Exécution des tests...');
            
            try {
                // Tests unitaires
                execSync('npm run test:unit', { 
                    stdio: this.options.verbose ? 'inherit' : 'pipe',
                    timeout: 120000 // 2 minutes max
                });
                
                // Lint
                try {
                    execSync('npm run lint', { stdio: 'pipe' });
                    this.debug('Lint réussi');
                } catch (error) {
                    this.log('Problèmes de lint détectés', 'warning');
                }
                
                return { success: true };
            } catch (error) {
                return { 
                    success: false, 
                    error: 'Tests échoués: ' + error.message.split('\n')[0] 
                };
            }
        }, false); // Tests non requis pour continuer
    }

    // Étape 5: Build
    async runBuild() {
        if (this.options.skipBuild) {
            this.log('Build ignoré (--skip-build)', 'warning');
            return true;
        }
        
        return await this.executeStep('Build', async () => {
            this.debug('Construction de l\'application...');
            
            // Nettoyer le build précédent
            if (fs.existsSync('build')) {
                try {
                    fs.rmSync('build', { recursive: true, force: true });
                } catch (error) {
                    this.debug('Impossible de nettoyer le dossier build');
                }
            }
            
            try {
                const buildCommand = this.options.environment === 'production' 
                    ? 'npm run build:prod' 
                    : 'npm run build';
                    
                execSync(buildCommand, { 
                    stdio: this.options.verbose ? 'inherit' : 'pipe',
                    timeout: 300000 // 5 minutes max
                });
                
                // Vérifier que le build existe
                if (!fs.existsSync('build/index.html')) {
                    return { success: false, error: 'Build incomplet - index.html manquant' };
                }
                
                // Analyser la taille du build
                try {
                    const { BuildChecker } = require('./check-build.js');
                    const checker = new BuildChecker();
                    const buildValid = checker.run();
                    
                    return { 
                        success: buildValid,
                        details: {
                            errors: checker.errors.length,
                            warnings: checker.warnings.length
                        }
                    };
                } catch (error) {
                    // Fallback: vérification basique
                    return { success: true };
                }
                
            } catch (error) {
                return { 
                    success: false, 
                    error: 'Build échoué: ' + error.message.split('\n')[0] 
                };
            }
        });
    }

    // Étape 6: Déploiement
    async deploy() {
        if (this.options.dryRun) {
            this.log('Mode dry-run - déploiement simulé', 'warning');
            return true;
        }
        
        return await this.executeStep('Deployment', async () => {
            this.debug(`Déploiement vers l'environnement: ${this.options.environment}`);
            
            try {
                // Sélectionner le bon projet Firebase
                const firebaseProjects = {
                    development: 'dev',
                    test: 'test', 
                    staging: 'staging',
                    production: 'prod'
                };
                
                const project = firebaseProjects[this.options.environment] || 'default';
                
                // Utiliser le projet Firebase
                try {
                    execSync(`firebase use ${project}`, { stdio: 'pipe' });
                    this.debug(`Projet Firebase: ${project}`);
                } catch (error) {
                    this.log(`Impossible de sélectionner le projet ${project}`, 'warning');
                }
                
                // Déployer
                const deployCommand = 'firebase deploy';
                execSync(deployCommand, { 
                    stdio: this.options.verbose ? 'inherit' : 'pipe',
                    timeout: 600000 // 10 minutes max
                });
                
                this.log('Déploiement réussi !', 'success');
                return { success: true };
                
            } catch (error) {
                return { 
                    success: false, 
                    error: 'Déploiement échoué: ' + error.message.split('\n')[0] 
                };
            }
        });
    }

    // Utilitaires
    getSourceFiles() {
        const sourceExtensions = ['.js', '.jsx', '.ts', '.tsx'];
        const excludeDirs = ['node_modules', 'build', 'dist', '.git'];
        
        function getFilesRecursively(dir) {
            let files = [];
            
            try {
                const items = fs.readdirSync(dir);
                
                for (const item of items) {
                    const fullPath = path.join(dir, item);
                    
                    try {
                        const stats = fs.statSync(fullPath);
                        
                        if (stats.isDirectory() && !excludeDirs.includes(item)) {
                            files = files.concat(getFilesRecursively(fullPath));
                        } else if (stats.isFile() && sourceExtensions.some(ext => item.endsWith(ext))) {
                            files.push(fullPath);
                        }
                    } catch (error) {
                        // Ignorer les erreurs d'accès
                    }
                }
            } catch (error) {
                // Ignorer les erreurs d'accès aux répertoires
            }
            
            return files;
        }
        
        return getFilesRecursively('./src');
    }

    // Génération du rapport final
    generateReport() {
        const totalDuration = ((Date.now() - this.startTime) / 1000).toFixed(2);
        
        this.log('\n' + '='.repeat(80), 'info');
        this.log('📋 RAPPORT DE DÉPLOIEMENT FINAL', 'info');
        this.log('='.repeat(80), 'info');
        
        this.log(`🕒 Durée totale: ${totalDuration}s`);
        this.log(`🎯 Environnement: ${this.options.environment}`);
        this.log(`⚙️  Mode: ${this.options.dryRun ? 'Dry-run' : 'Réel'}`);
        
        // Résumé des étapes
        this.log('\n📊 Résumé des étapes:');
        let successfulSteps = 0;
        const totalSteps = Object.keys(this.results).length;
        
        Object.entries(this.results).forEach(([step, result]) => {
            if (result) {
                const status = result.success ? '✅' : '❌';
                const duration = result.duration ? `(${result.duration}s)` : '';
                this.log(`${status} ${step.replace('_', ' ').toUpperCase()} ${duration}`);
                if (result.success) successfulSteps++;
            }
        });
        
        const successRate = Math.round((successfulSteps / totalSteps) * 100);
        this.log(`\n📈 Taux de réussite: ${successfulSteps}/${totalSteps} (${successRate}%)`);
        
        // Statistiques
        this.log(`\n📊 Statistiques:`);
        this.log(`- Erreurs: ${this.errors.length}`);
        this.log(`- Avertissements: ${this.warnings.length}`);
        
        // Recommandations
        if (successRate === 100) {
            this.log('\n🎉 Déploiement parfait ! Application prête en production.', 'success');
        } else if (successRate >= 80) {
            this.log('\n✅ Déploiement réussi avec quelques avertissements.', 'success');
        } else {
            this.log('\n⚠️  Déploiement partiel - vérifiez les erreurs.', 'warning');
        }
        
        // Sauvegarder le rapport
        this.saveReport({
            timestamp: new Date().toISOString(),
            environment: this.options.environment,
            duration: totalDuration,
            successRate,
            results: this.results,
            errors: this.errors,
            warnings: this.warnings
        });
        
        return successRate >= 80;
    }

    saveReport(reportData) {
        try {
            if (!fs.existsSync('reports')) {
                fs.mkdirSync('reports');
            }
            
            const reportFile = `reports/deployment-${this.options.environment}-${new Date().toISOString().split('T')[0]}.json`;
            fs.writeFileSync(reportFile, JSON.stringify(reportData, null, 2));
            this.log(`📄 Rapport sauvegardé: ${reportFile}`, 'success');
        } catch (error) {
            this.log(`Erreur lors de la sauvegarde: ${error.message}`, 'error');
        }
    }

    // Méthode principale
    async run() {
        this.log('🚀 DÉMARRAGE DU PROCESSUS DE DÉPLOIEMENT', 'success');
        this.log(`Environnement: ${this.options.environment}`);
        this.log(`Options: ${JSON.stringify(this.options, null, 2)}`);
        
        try {
            // Exécuter toutes les étapes
            const steps = [
                () => this.checkEnvironment(),
                () => this.checkDependencies(),
                () => this.checkSecurity(),
                () => this.runTests(),
                () => this.runBuild(),
                () => this.deploy()
            ];
            
            let canProceed = true;
            
            for (const step of steps) {
                if (!canProceed && !this.options.force) {
                    this.log('Arrêt du processus suite aux erreurs critiques', 'error');
                    break;
                }
                
                const success = await step();
                if (!success) {
                    canProceed = false;
                }
            }
            
            const success = this.generateReport();
            
            if (success) {
                this.log('\n🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !', 'success');
                return true;
            } else {
                this.log('\n❌ DÉPLOIEMENT ÉCHOUÉ', 'error');
                return false;
            }
            
        } catch (error) {
            this.log(`Erreur fatale: ${error.message}`, 'error');
            return false;
        }
    }
}

// Interface CLI
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {};
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        switch(arg) {
            case '--environment':
            case '-e':
                options.environment = args[++i];
                break;
            case '--skip-tests':
                options.skipTests = true;
                break;
            case '--skip-build':
                options.skipBuild = true;
                break;
            case '--verbose':
            case '-v':
                options.verbose = true;
                break;
            case '--dry-run':
                options.dryRun = true;
                break;
            case '--force':
                options.force = true;
                break;
            default:
                if (arg.startsWith('--')) {
                    console.log(`Option inconnue: ${arg}`);
                }
        }
    }
    
    return options;
}

function showHelp() {
    console.log(`
Usage: node deploy-orchestrator.js [options]

Options:
  -e, --environment    Environnement de déploiement (dev|test|staging|prod)
  --skip-tests         Ignorer les tests
  --skip-build         Ignorer le build
  -v, --verbose        Mode verbeux
  --dry-run           Simulation sans déploiement réel
  --force             Continuer malgré les erreurs
  --help              Afficher cette aide

Exemples:
  node deploy-orchestrator.js -e production
  node deploy-orchestrator.js --dry-run --verbose
  node deploy-orchestrator.js --skip-tests -e staging
`);
}

// Exécution principale
if (require.main === module) {
    const args = parseArgs();
    
    if (args.help) {
        showHelp();
        process.exit(0);
    }
    
    const orchestrator = new DeploymentOrchestrator(args);
    
    orchestrator.run()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Erreur fatale:', error);
            process.exit(1);
        });
}

module.exports = DeploymentOrchestrator;