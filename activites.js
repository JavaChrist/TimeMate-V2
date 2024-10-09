document.addEventListener('DOMContentLoaded', function () {
  // Met à jour le tableau des activités en utilisant les données de localStorage
  const updateActivitiesTable = () => {
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    const activitiesLog = document.getElementById('activities-log');
    activitiesLog.innerHTML = ''; // Effacer les lignes existantes

    activities.forEach((activity, index) => {
      const row = activitiesLog.insertRow();
      const checkboxCell = row.insertCell(0);
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('select-activity');
      checkbox.setAttribute('data-activity-id', activity.id);
      checkboxCell.appendChild(checkbox);

      const nameCell = row.insertCell(1);
      nameCell.textContent = activity.activityName;

      const plannedHoursCell = row.insertCell(2);
      plannedHoursCell.textContent = activity.totalHours.toFixed(2);

      const realizedHoursCell = row.insertCell(3);
      realizedHoursCell.textContent = activity.realizedHours ? activity.realizedHours.toFixed(2) : '0.00';

      const remainingHoursCell = row.insertCell(4);
      const remainingHours = activity.totalHours - (activity.realizedHours || 0);
      remainingHoursCell.textContent = remainingHours.toFixed(2);
    });
  };

  // Ajoute un écouteur d'événement pour réinitialiser le tableau des activités (heures réalisées uniquement)
  const deleteSelectedActivities = () => {
    const selectedCheckboxes = document.querySelectorAll('.select-activity:checked');
    const activities = JSON.parse(localStorage.getItem('activities'));
    const remainingActivities = activities.filter(activity =>
      ![...selectedCheckboxes].some(checkbox => checkbox.getAttribute('data-activity-id') === activity.id)
    );

    localStorage.setItem('activities', JSON.stringify(remainingActivities));
    updateActivitiesTable(); // Mettre à jour le tableau après la suppression
  };

  const resetButton = document.getElementById('reset-button');
  resetButton.addEventListener('click', deleteSelectedActivities);

  // Charge les activités au chargement initial de la page
  updateActivitiesTable();

  // Mise à jour du tableau lorsque le stockage local est modifié
  window.addEventListener('storage', function (event) {
    if (event.key === 'activities') {
      updateActivitiesTable();
    }
  });

  // Fonction pour supprimer une activité du stockage local
  function removeActivityFromStorage(activityId, activityDate) {
    let activities = JSON.parse(localStorage.getItem('activities')) || [];
    activities.forEach(activity => {
      if (activity.id === activityId) {
        activity.activitiesDetails = activity.activitiesDetails.filter(detail => {
          if (detail.date === activityDate) {
            activity.totalHours -= parseFloat(detail.hours); // Soustraire les heures de l'activité supprimée
            return false; // Ne pas inclure ce détail dans le nouveau tableau
          }
          return true;
        });
      }
    });

    localStorage.setItem('activities', JSON.stringify(activities));
    updateActivitiesTable(); // Mettre à jour le tableau après la suppression
  }

  function loadActivities() {
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    const tableBody = document.getElementById('activities-log').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Effacer les lignes existantes

    activities.forEach(activity => {
      const row = tableBody.insertRow();
      const checkboxCell = row.insertCell(0);
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('select-activity');
      checkbox.setAttribute('data-activity-id', activity.id);
      checkboxCell.appendChild(checkbox);

      const nameCell = row.insertCell(1);
      nameCell.textContent = activity.activityName;

      const plannedHoursCell = row.insertCell(2);
      plannedHoursCell.textContent = activity.totalHours.toFixed(2);

      const realizedHoursCell = row.insertCell(3);
      realizedHoursCell.textContent = activity.hoursRealized ? activity.hoursRealized.toFixed(2) : '0.00';

      const remainingHoursCell = row.insertCell(4);
      const remainingHours = activity.totalHours - (activity.hoursRealized || 0);
      remainingHoursCell.textContent = remainingHours.toFixed(2);
    });
  }

  document.addEventListener('DOMContentLoaded', loadActivities);
});
