# TimeMate - Gestion du Temps et des Activités

**TimeMate** est une application de gestion du temps et des activités qui permet de planifier, suivre, et gérer efficacement les tâches quotidiennes, hebdomadaires, et projetées. Conçu spécifiquement pour offrir un contrôle détaillé du temps passé sur chaque activité, TimeMate propose également des outils de mise en forme pour les notes personnelles.

## Fonctionnalités principales

### 1. Création et Gestion des Activités

- Ajout d'activités avec sélection du nom, date de début et de fin, ainsi que des heures de début et de fin, et un bouton couleur pour attribuer une couleur différente au choix pour chaque activité.
- Sélection d'activités existantes via un menu déroulant pour les réutiliser facilement.
- Vérification des conflits d'activités : les activités ne peuvent pas être créées sur un créneau, dates et heures identique déjà réservé, mais avec la possibilité de mettre plusieurs activité différente sur une même journée a des heures différentes. .
- Affichage dynamique des activités sur un calendrier hebdomadaire, avec navigation entre les semaines.
- Suppression des activités partiel ou totale via un bouton dédié a l'activitée sur une journée.

### 2. Gestion des Semaines

- Navigation facile entre les semaines passées et futures.
- Affichage du numéro de semaine et des dates correspondantes dans le calendrier.

### 3. Timer et Suivi du Temps

- Démarrage d'un timer manuellement pour chaque activité grace à un bouton intégré dans l'activité avec calcul du temps restant qui sera reporté dans le tableau activites.html.
- Un timer devras étre visible dans app.html sous le bouton ajouter activité. D'un style moderme et visible avec des boutons pour une fonction pause et reprise pour le timer en cours.
- Alerte de fin de timer avec une notification sonore, visuel et suppression automatique de l'activité terminée.
- Gestion du temps passé : suivi précis du temps réellement passé sur chaque activité avec affichage dans un tableau récapitulatif dans activites.html.

## 4. Tableau des activités

- Création d'un tableau des activités en interraction avec le calendrier qui reprend les activités créer mon de l'activité le nombre d'heures prévues, le nombre d'heures réalisées optenu via le timer et temps restant.
- Le rôle de ce tableau est de suivre le temps passé sur une activités quotidiennement et de voir si l'activitée a étais réalié seli=on les estimations.
- Un bouton sera créer pour la navigation entre le calendrier et le tableau des activés.
- Un bouton de Réinitialisation du tableau sera également créer afin de pérmettre la suppréssion de l'ensemble des données présente dans le tableau.

### 5. Pense-Bête (à venir)

- Création, modification et suppression de notes.
- Mise en forme des notes (gras, italique, souligné, barré).
- Classement des notes par titre pour faciliter la navigation entre différentes notes.
- Sauvegarde des notes dans le `localStorage`
-

# Gestion des styles pour les fichiers HTML

Ce projet contient deux fichiers HTML (`index.html` et `activites.html`) auxquels des styles ont été appliqués pour améliorer l'apparence et la convivialité de l'application. Voici un résumé des styles appliqués à chaque fichier :

## index.html

- **Modal** :

  - La fenêtre modale a été stylisée avec une largeur maximale, une hauteur automatique, des marges, un arrière-plan blanc, des bordures arrondies et une ombre.
  - Le contenu de la fenêtre modale a été centré verticalement et horizontalement à l'aide de flexbox.
  - Le bouton de fermeture a été positionné en haut à droite de la fenêtre modale.

- **Formulaire d'activité** :

  - Les champs de saisie et les étiquettes ont été stylisés avec des marges, des paddings et des bordures pour une meilleure lisibilité.
  - Les champs de date et d'heure ont été disposés côte à côte à l'aide de flexbox.
  - Le sélecteur de couleur a été amélioré avec des options colorées affichant le nom de la couleur et un carré coloré correspondant.

- **Boutons** :

  - Le bouton "Ajouter une activité" a été stylisé avec une couleur de fond distinctive, une couleur de texte blanche, des bordures arrondies et un effet de survol pour une meilleure visibilité.
  - Le bouton "Enregistrer l'activité" dans la fenêtre modale a été stylisé de manière similaire pour maintenir une cohérence visuelle.
  - Le bouton "Voir les activités" a été stylisé avec une couleur de fond différente pour le distinguer des autres boutons.

- **Calendrier** :
  - Le calendrier a été stylisé avec une disposition en grille pour afficher les jours de la semaine avec la date.
  - Les en-têtes de jour ont été stylisés avec un arrière-plan coloré, une couleur de texte blanche et des bordures arrondies.
  - Le corps du calendrier a été stylisé avec un arrière-plan clair et des bordures pour une meilleure séparation visuelle.

## activites.html

- **Tableau des activités** :

  - Le tableau des activités a été stylisé avec des bordures, un espacement et un arrière-plan clair pour une meilleure lisibilité.
  - Les en-têtes de colonne ont été mis en évidence avec un arrière-plan coloré et une couleur de texte blanche.
  - Les lignes du tableau ont été stylisées avec des bordures et un espacement pour une meilleure séparation visuelle.

- **Boutons d'action** :
  - Les boutons "Réinitialiser le tableau" et "Retour au calendrier" ont été stylisés avec des couleurs distinctes, des bordures arrondies et des espacements pour une meilleure visibilité.
  - Les boutons ont été positionnés côte à côte à l'aide de flexbox.

Ces styles ont été appliqués à l'aide d'un fichier CSS externe (`style.css`) lié aux fichiers HTML. Le fichier CSS contient des sélecteurs et des propriétés spécifiques pour cibler et styliser les différents éléments des pages.

N'hésitez pas à personnaliser davantage les styles en fonction de vos préférences et des besoins de votre application.
