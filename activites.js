document.addEventListener('DOMContentLoaded', function () {
  // Met à jour le tableau des activités en utilisant les données de localStorage
  function updateActivitiesTable() {
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    const activitiesLog = document.getElementById('activities-log');

    // Supprime toutes les lignes existantes sauf l'en-tête
    while (activitiesLog.rows.length > 1) {
      activitiesLog.deleteRow(1);
    }

    // Ajoute les activités dans le tableau avec les heures prévues et réalisées
    activities.forEach(activity => {
      const row = activitiesLog.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);

      // Nom de l'activité
      cell1.innerHTML = activity.activityName;

      // Heures prévues
      const totalHours = parseFloat(activity.totalHours);
      cell2.innerHTML = !isNaN(totalHours) && totalHours > 0 ? totalHours.toFixed(2) : '0.00';

      // Heures réalisées (Initialisation à 0 pour l'exemple)
      const realizedHours = parseFloat(activity.realizedHours) || 0; // Mettre à jour avec la logique appropriée pour les heures réalisées
      cell3.innerHTML = realizedHours.toFixed(2);

      // Temps restant (différence entre heures prévues et réalisées)
      const remainingHours = totalHours - realizedHours;
      cell4.innerHTML = remainingHours.toFixed(2);
    });
  }

  // Ajoute un écouteur d'événement pour réinitialiser le tableau des activités (heures réalisées uniquement)
  const resetButton = document.getElementById('reset-button');
  resetButton.addEventListener('click', function () {
    // Demande une confirmation avant de réinitialiser les heures réalisées
    const confirmReset = confirm('Voulez-vous vraiment réinitialiser le tableau des heures réalisées ? Cette action est irréversible.');
    if (confirmReset) {
      // Récupère les activités actuelles
      let activities = JSON.parse(localStorage.getItem('activities')) || [];

      // Réinitialise les heures réalisées pour chaque activité
      activities = activities.map(activity => {
        activity.realizedHours = 0; // Réinitialise les heures réalisées à 0
        return activity;
      });

      // Sauvegarde les activités mises à jour dans le localStorage
      localStorage.setItem('activities', JSON.stringify(activities));

      // Met à jour le tableau des activités dans le DOM
      updateActivitiesTable();
      alert('Les heures réalisées ont été réinitialisées.');
    }
  });

  // Charge les activités au chargement initial de la page
  updateActivitiesTable();

  // Mise à jour du tableau lorsque le stockage local est modifié
  window.addEventListener('storage', function (event) {
    if (event.key === 'activities') {
      updateActivitiesTable();
    }
  });
});
