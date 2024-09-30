# 📒 Pense-Bête Développeur

Bienvenue sur "Pense-Bête Développeur", une application web conçue pour aider les développeurs à organiser et stocker des informations importantes liées à différentes technologies (HTML, CSS, JavaScript, React, etc.). Ce projet permet de créer, gérer, et rechercher facilement du contenu dans différentes catégories. Vous pouvez l'utiliser pour conserver des snippets de code, des notes techniques ou toute autre information utile.

## 🎯 Fonctionnalités

### Page d'Accueil

- **Création de Catégories** : Un formulaire permet de créer de nouvelles catégories personnalisées, en renseignant un nom et un logo (URL).
- **Affichage des Catégories** : Les catégories sont affichées sous forme de cartes interactives avec des logos distincts pour chaque technologie.
- **Recherche Globale** : Un champ de recherche permet de trouver du contenu à travers toutes les catégories. Les résultats sont affichés dynamiquement avec la possibilité de voir les détails du code et des descriptions associés.

### Pages de Catégorie (HTML, CSS, JavaScript, etc.)

- **Ajout de Contenu** : Pour chaque catégorie, vous pouvez ajouter du contenu en renseignant un titre, une description, et un snippet de code optionnel. Ce contenu est stocké dans le `localStorage` du navigateur.
- **Gestion du Contenu** : Chaque entrée peut être modifiée ou supprimée. Les modifications sont directement appliquées et sauvegardées dans le `localStorage`.
- **Affichage Dynamique du Contenu** : Le contenu ajouté s'affiche dynamiquement sous forme de sections avec le titre, la description et le code, stylisé grâce à Prism.js pour la coloration syntaxique.
- **Prism.js pour la Coloration Syntaxique** : La bibliothèque Prism.js est utilisée pour une coloration syntaxique claire et facile à lire pour différents langages (HTML, CSS, JavaScript, etc.).

### Fonctionnalités Techniques

- **Stockage Local (localStorage)** : Les données (contenus et catégories) sont stockées dans le `localStorage` pour être persistantes même après un rechargement de la page.
- **Prism.js pour le Code** : Prism.js est intégré pour colorer les snippets de code ajoutés, avec une prise en charge des langages HTML, CSS, et JavaScript.
- **Responsive Design** : Le design de l'application s'adapte aux différentes tailles d'écran, garantissant une bonne expérience utilisateur sur mobile, tablette, et ordinateur.

## 🚀 Comment Utiliser

1. **Cloner le dépôt :**  
   `git clone https://github.com/ton-compte/pense-bete-developpeur.git`

2. **Ouvrir l'application :**  
   Ouvrez `index.html` dans votre navigateur pour commencer à utiliser l'application.

3. **Ajouter des Catégories :**  
   Créez de nouvelles catégories à partir de la page d'accueil en remplissant le formulaire dédié.

4. **Ajouter du Contenu dans les Catégories :**  
   Naviguez dans une catégorie pour y ajouter du contenu spécifique (titre, description, code).

5. **Rechercher du Contenu :**  
   Utilisez la barre de recherche en haut de la page d'accueil pour trouver rapidement des informations à travers toutes les catégories.

## 📂 Structure du Projet

- `index.html` : Page d'accueil avec gestion des catégories.
- `html.html`, `css.html`, `javascript.html`, etc. : Pages spécifiques pour chaque catégorie.
- `style.css` : Feuille de style pour le design global de l'application.
- `script.js` : Code JavaScript pour gérer l'interaction utilisateur, la gestion des données, et l'affichage dynamique.
- `images/` : Répertoire contenant les icônes et logos utilisés pour chaque catégorie.

## 🛠 Technologies Utilisées

- HTML5
- CSS3
- JavaScript (ES6+)
- Prism.js (pour la coloration syntaxique)
- `localStorage` pour le stockage persistant des données
- json pour importation et l'exportation data du localstorage
