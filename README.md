# 🌤️ rk-Weather - Modern Weather Dashboard

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

**rk-Weather** est une application météo moderne et intuitive construite avec React.js, offrant des prévisions météorologiques précises avec une interface utilisateur élégante et responsive.

🚀 **Live Demo :** [rk-wheather.netlify.app](https://rk-wheather.netlify.app/)

![Weather Web App Design Template _ Weather Web UI Design _ Uizard](https://github.com/user-attachments/assets/0bbbb36a-47f4-4d4d-93d4-e94c5af8bee4)

## ✨ Fonctionnalités

### 🌟 **Principales**
- **🌡️ Météo Actuelle** : Température, conditions, ressenti, humidité, vent, UV
- **📊 Prévisions** : Prévisions horaires et sur 7 jours avec graphiques
- **📍 Géolocalisation** : Détection automatique de la position
- **🔍 Recherche** : Recherche de villes avec autocomplétion
- **🌓 Thème** : Support mode clair/sombre

### 🎯 **Avancées**
- **📱 Responsive Design** : Interface optimisée pour tous les écrans
- **⚡ Performances** : Chargement rapide avec Vite
- **📈 Visualisation** : Graphiques interactifs pour les données météo
- **🔔 Alertes** : Notifications pour conditions météo extrêmes
- **💾 Cache local** : Stockage des données pour une expérience hors ligne

## 🏗️ Architecture Technique

### **Stack Principale**
- **Frontend** : React 18 avec Hooks
- **Build Tool** : Vite 5
- **Styling** : TailwindCSS + CSS Modules
- **API** : OpenWeatherMap API
- **Deployment** : Netlify avec CI/CD

### **Structure du Projet**
```
src/
├── components/
│   ├── core/
│   │   ├── WeatherCard/      # Carte météo principale
│   │   ├── ForecastChart/    # Graphiques de prévisions
│   │   └── SearchBar/        # Barre de recherche intelligente
│   ├── layout/
│   │   ├── Header/           # Navigation principale
│   │   ├── Sidebar/          # Menu latéral
│   │   └── MainLayout/       # Layout global
│   └── ui/
│       ├── Button/
│       ├── Card/
│       └── Loader/
├── pages/
│   ├── Dashboard/           # Page principale
│   ├── Forecast/           # Prévisions détaillées
│   └── Settings/           # Paramètres
├── hooks/
│   ├── useWeatherData/     # Hook météo
│   └── useGeolocation/     # Hook géolocalisation
├── services/
│   ├── weatherAPI/         # Service API météo
│   └── cacheService/       # Gestion du cache
├── utils/
│   ├── formatters/         # Formateurs de données
│   └── constants/          # Constantes globales
└── styles/
    └── globals.css         # Styles globaux
```

## 🚀 Installation Rapide

### **Prérequis**
- Node.js 18+ et npm/yarn/pnpm
- Clé API OpenWeatherMap (gratuite)

### **1. Cloner le projet**
```bash
git clone https://github.com/RobertKule/A_Weather_App.git
cd A_Weather_App
```

### **2. Configuration**
```bash
cp .env.example .env.local
# Ajouter votre clé API OpenWeatherMap dans .env.local
VITE_WEATHER_API_KEY=votre_clé_api_ici
```

### **3. Installation**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### **4. Développement**
```bash
npm run dev
# L'application sera disponible sur http://localhost:5173
```

### **5. Build Production**
```bash
npm run build
npm run preview  # Prévisualisation du build
```

## 📡 Configuration API

### **OpenWeatherMap API**
1. Créez un compte sur [OpenWeatherMap](https://openweathermap.org/api)
2. Obtenez votre clé API gratuite
3. Ajoutez-la au fichier `.env.local`

```env
VITE_WEATHER_API_KEY=votre_clé_api
VITE_API_BASE_URL=https://api.openweathermap.org/data/2.5
```

## 🎨 Personnalisation

### **Couleurs Thème**
Modifiez `tailwind.config.js` pour personnaliser le thème :
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        weather: {
          primary: '#3B82F6',
          sunny: '#FBBF24',
          cloudy: '#94A3B8',
          rainy: '#60A5FA'
        }
      }
    }
  }
}
```

### **Variables CSS**
```css
:root {
  --weather-primary: #3B82F6;
  --weather-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 📊 Scripts Disponibles

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint src --ext js,jsx --report-unused-disable-directives --max-warnings 0",
  "format": "prettier --write src/",
  "test": "vitest",
  "coverage": "vitest run --coverage"
}
```

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Lancer les tests avec couverture
npm run coverage

# Tests end-to-end (à venir)
npm run test:e2e
```

## 🚢 Déploiement

### **Netlify (Recommandé)**
1. Poussez votre code sur GitHub
2. Connectez votre repo à Netlify
3. Configurez les variables d'environnement
4. Déployez automatiquement

### **Variables d'environnement Netlify**
```bash
VITE_WEATHER_API_KEY=votre_clé_api
```

### **Build Settings Netlify**
- **Build Command** : `npm run build`
- **Publish Directory** : `dist`
- **Node Version** : 18

## 📈 Roadmap Développement

### **Phase 1 : MVP (En cours)**
- [x] Initialisation projet Vite + React + Tailwind
- [x] Configuration CI/CD Netlify
- [ ] Composant WeatherCard
- [ ] Header & Navigation
- [ ] Intégration API OpenWeatherMap
- [ ] Sidebar avec prévisions

### **Phase 2 : Améliorations**
- [ ] Graphiques interactifs
- [ ] Mode sombre/clair
- [ ] Géolocalisation automatique
- [ ] Cache local IndexedDB
- [ ] Tests unitaires (Vitest)

### **Phase 3 : Avancée**
- [ ] PWA (Installation native)
- [ ] Notifications push
- [ ] Multi-langues
- [ ] Dashboard admin
- [ ] Widgets personnalisables

## 🤝 Contribution

Nous adorons les contributions ! Voici comment participer :

### **Processus de Contribution**
1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Pushez sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### **Guide de Style**
- **Code Style** : ESLint + Prettier configurés
- **Commits** : Conventionnel Commits
- **Branches** : `feature/`, `fix/`, `docs/`, `refactor/`
- **Tests** : Requis pour les nouvelles fonctionnalités

## 🐛 Issues & Support

Utilisez notre template d'issues pour signaler un bug ou proposer une amélioration :

```markdown
## Description
[Description claire du problème ou de la fonctionnalité]

## Étapes pour reproduire
1. [Première étape]
2. [Deuxième étape]
3. ...

## Comportement attendu
[Ce qui devrait se passer]

## Comportement actuel
[Ce qui se passe actuellement]

## Captures d'écran
[Si applicable]

## Environnement
- OS: [ex: Windows 11]
- Navigateur: [ex: Chrome 120]
- Version App: [ex: 1.0.0]
```

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **OpenWeatherMap** pour l'API météo
- **TailwindCSS** pour l'incroyable framework CSS
- **Vite** pour l'expérience de développement
- **React** pour la bibliothèque UI

## 👨‍💻 Auteur

**Robert Kule**  
- GitHub: [@RobertKule](https://github.com/RobertKule)
- LinkedIn: [Robert Kule](https://www.linkedin.com/in/robert-kule-4a4a2a245/)

---

<div align="center">

### ⭐️ N'hésitez pas à donner une étoile au projet si vous l'aimez !

**Built with ❤️ and React**

</div>
