document.addEventListener('DOMContentLoaded', function () {
    // Vérifie si l'élément 'openModal' existe avant de continuer
    const openModalButton = document.getElementById('openModal');

    if (openModalButton) {
        const modal = document.getElementById('modal');
        const closeModalSpan = document.querySelector('.close');
        const saveEventButton = document.getElementById('save-event');

        // Ouvre la modale pour ajouter une nouvelle activité
        openModalButton.addEventListener('click', function () {
            modal.style.display = 'block';
        });

        // Ferme la modale lorsque le bouton de fermeture est cliqué
        closeModalSpan.addEventListener('click', function () {
            modal.style.display = 'none';
        });

        // Ferme la modale lorsqu'on clique à l'extérieur de celle-ci
        window.addEventListener('click', function (event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Vérifie les conflits d'activités avant d'enregistrer
        function isConflictingActivity(newActivityDetails) {
            const activities = JSON.parse(localStorage.getItem('activities')) || [];

            for (let activity of activities) {
                for (let detail of activity.activitiesDetails) {
                    const existingDate = new Date(detail.date).toISOString().slice(0, 10); // Date au format YYYY-MM-DD
                    const newActivityDate = new Date(newActivityDetails.date).toISOString().slice(0, 10);

                    // Vérifie la date et les heures pour éviter un conflit
                    if (
                        existingDate === newActivityDate &&
                        ((detail.startTime < newActivityDetails.endTime && detail.endTime > newActivityDetails.startTime) ||
                            (newActivityDetails.startTime < detail.endTime && newActivityDetails.endTime > detail.startTime))
                    ) {
                        return true; // Conflit trouvé
                    }
                }
            }

            return false; // Pas de conflit
        }

        // Enregistre une nouvelle activité après vérification des conflits
        saveEventButton.addEventListener('click', function () {
            const activityName = document.getElementById('activity-name').value;
            const startTime = document.getElementById('activity-time-start').value;
            const endTime = document.getElementById('activity-time-end').value;
            const startDate = new Date(document.getElementById('activity-start-date').value);
            const endDate = new Date(document.getElementById('activity-end-date').value);
            const color = document.getElementById('activity-color').value;

            const dayDifference = (endDate - startDate) / (1000 * 3600 * 24); // Calcul de la différence de jours
            const hoursPerDay = (new Date(`1970-01-01T${endTime}`) - new Date(`1970-01-01T${startTime}`)) / (1000 * 3600);
            const totalHours = parseFloat((hoursPerDay * (dayDifference + 1)).toFixed(2));
            let activitiesDetails = [];

            // Vérification des conflits et ajout des activités sans chevauchement
            for (let i = 0; i <= dayDifference; i++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + i);

                if (i === 0 && endTime < startTime) {
                    // Si l'activité s'étend sur deux jours
                    const firstDayEndTime = '23:59';
                    const secondDayStartTime = '00:00';

                    // Ajouter le premier jour jusqu'à 23:59
                    let firstDayDetail = {
                        color: color,
                        name: activityName,
                        startTime: startTime,
                        endTime: firstDayEndTime,
                        date: currentDate.toISOString()
                    };
                    if (!isConflictingActivity(firstDayDetail)) {
                        activitiesDetails.push(firstDayDetail);
                    } else {
                        alert('Conflit détecté avec une autre activité sur ce créneau.');
                        return;
                    }

                    // Ajouter le deuxième jour à partir de 00:00
                    let secondDay = new Date(currentDate);
                    secondDay.setDate(secondDay.getDate() + 1);

                    let secondDayDetail = {
                        color: color,
                        name: activityName,
                        startTime: secondDayStartTime,
                        endTime: endTime,
                        date: secondDay.toISOString()
                    };
                    if (!isConflictingActivity(secondDayDetail)) {
                        activitiesDetails.push(secondDayDetail);
                    } else {
                        alert('Conflit détecté avec une autre activité sur ce créneau.');
                        return;
                    }
                } else {
                    // Activité normale sur un seul jour ou la dernière partie de l'activité sur plusieurs jours
                    let newActivityDetail = {
                        color: color,
                        name: activityName,
                        startTime: startTime,
                        endTime: endTime,
                        date: currentDate.toISOString()
                    };

                    if (!isConflictingActivity(newActivityDetail)) {
                        activitiesDetails.push(newActivityDetail);
                    } else {
                        alert('Conflit détecté avec une autre activité sur ce créneau.');
                        return;
                    }
                }
            }

            saveActivityToStorage(activityName, totalHours, activitiesDetails);
            loadActivitiesFromStorage(currentViewDate); // Charger les activités pour la semaine actuelle
            modal.style.display = 'none';
        });

        // Sauvegarde l'activité dans le stockage local (localStorage)
        function saveActivityToStorage(activityName, totalHours, activitiesDetails) {
            const activities = JSON.parse(localStorage.getItem('activities')) || [];
            let activityFound = activities.find(activity => activity.activityName === activityName);

            if (activityFound) {
                activityFound.activitiesDetails = activityFound.activitiesDetails.concat(activitiesDetails);
                activityFound.totalHours = parseFloat((activityFound.totalHours + totalHours).toFixed(2));
            } else {
                activities.push({ activityName, totalHours, activitiesDetails });
            }

            localStorage.setItem('activities', JSON.stringify(activities));
            loadActivitiesFromStorage(currentViewDate);
        }

        // Charge les activités depuis le stockage local et les affiche dans le calendrier
        function loadActivitiesFromStorage(currentDate = new Date()) {
            const activities = JSON.parse(localStorage.getItem('activities')) || [];
            const dayMapping = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

            // Effacer les conteneurs de chaque jour avant de recharger les activités
            dayMapping.forEach(day => {
                const dayContainer = document.getElementById(day);
                dayContainer.innerHTML = ''; // Efface le contenu existant
            });

            activities.forEach(activity => {
                (activity.activitiesDetails || []).forEach(detail => {
                    const activityDate = new Date(detail.date);
                    const dayOfWeek = activityDate.getDay();
                    const dayContainer = document.getElementById(dayMapping[dayOfWeek]);

                    // Vérifie si la date de l'activité est dans la semaine affichée
                    if (isDateInCurrentView(activityDate, currentDate)) {
                        const activityElement = document.createElement('div');
                        activityElement.classList.add('activity');
                        activityElement.style.backgroundColor = detail.color;
                        activityElement.innerHTML = `
                            <span class="activity-name">${detail.name}</span>
                            <span class="activity-time">${detail.startTime} - ${detail.endTime}</span>
                            <span class="activity-dates">${activityDate.toLocaleDateString()}</span>
                            <button class="delete-day-btn">Supprimer ce jour</button>
                        `;
                        activityElement.dataset.activityId = detail.name;
                        activityElement.dataset.activityDate = activityDate.toISOString(); // Utiliser le même format pour la comparaison
                        activityElement.dataset.startTime = detail.startTime;
                        activityElement.dataset.endTime = detail.endTime;
                        dayContainer.appendChild(activityElement);
                    }
                });
            });

            // Ajouter les écouteurs d'événements de suppression après avoir ajouté tous les éléments
            attachDeleteEventListeners();
        }

        // Attache les écouteurs d'événements pour la suppression d'activités
        function attachDeleteEventListeners() {
            document.querySelectorAll('.delete-day-btn').forEach(button => {
                button.addEventListener('click', function (event) {
                    const parentActivity = event.target.parentElement;
                    const activityId = parentActivity.dataset.activityId;
                    const activityDate = parentActivity.dataset.activityDate;
                    const startTime = parentActivity.dataset.startTime;
                    const endTime = parentActivity.dataset.endTime;

                    // Appel de la fonction pour supprimer le jour spécifique de l'activité
                    deleteActivityDay(activityId, activityDate, startTime, endTime);

                    // Suppression de l'élément du DOM
                    parentActivity.remove();
                });
            });
        }

        // Supprime un jour spécifique d'une activité dans le stockage local
        function deleteActivityDay(activityId, activityDate, startTime, endTime) {
            let activities = JSON.parse(localStorage.getItem('activities')) || [];
            activities = activities.map(activity => {
                if (activity.activityName === activityId) {
                    // Filtrer pour supprimer uniquement le jour spécifique avec les heures correspondantes
                    activity.activitiesDetails = (activity.activitiesDetails || []).filter(detail =>
                        !(detail.date === activityDate && detail.startTime === startTime && detail.endTime === endTime)
                    );

                    // Recalculer les heures totales si des jours restent
                    if (activity.activitiesDetails.length > 0) {
                        const totalHours = activity.activitiesDetails.reduce((total, detail) => {
                            const hours = (new Date(`1970-01-01T${detail.endTime}`) - new Date(`1970-01-01T${detail.startTime}`)) / (1000 * 3600);
                            return total + hours;
                        }, 0);
                        activity.totalHours = parseFloat(totalHours.toFixed(2));
                    } else {
                        activity.totalHours = 0; // Définir explicitement à 0 si aucune journée n'est restante
                    }
                }
                return activity;
            }).filter(activity => activity.activitiesDetails.length > 0); // Filtrer les activités sans jours

            localStorage.setItem('activities', JSON.stringify(activities));
            loadActivitiesFromStorage(currentViewDate);
        }

        // Vérifie si une date d'activité est dans la semaine affichée
        function isDateInCurrentView(activityDate, currentDate) {
            // Calculez le début et la fin de la semaine courante basée sur 'currentDate'
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);

            return activityDate >= startOfWeek && activityDate <= endOfWeek;
        }

        // Met à jour les dates affichées sur le calendrier pour la semaine courante
        function updateCalendarDates(viewDate = currentViewDate) {
            const dayMapping = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

            const startOfWeek = new Date(viewDate);
            startOfWeek.setDate(viewDate.getDate() - viewDate.getDay() + 1);

            dayMapping.forEach((day, index) => {
                const dayContainer = document.querySelector(`.${day}`);
                const dayDate = new Date(startOfWeek);
                dayDate.setDate(startOfWeek.getDate() + index);
                const formattedDate = dayDate.getDate();

                if (dayContainer) {
                    dayContainer.textContent = `${dayNames[index]} ${formattedDate}`;
                }
            });
        }

        // Calcule et affiche le numéro de la semaine
        function getWeekNumber(date) {
            return moment(date).isoWeek();
        }

        function displayWeekNumber(date) {
            const weekNumber = moment(date).isoWeek();
            const weekNumberContainer = document.getElementById('week-number');
            weekNumberContainer.textContent = `Semaine ${weekNumber}`;
        }

        // Ajuste la vue du calendrier en avançant ou en reculant d'une semaine
        function adjustWeek(days) {
            currentViewDate.setDate(currentViewDate.getDate() + days);
            displayWeekNumber(currentViewDate);
            updateCalendarDates(currentViewDate);
            loadActivitiesFromStorage(currentViewDate);
        }

        // Afficher la semaine actuelle, mettre à jour le calendrier et charger les activités lors du chargement initial
        displayWeekNumber(currentViewDate);
        updateCalendarDates(currentViewDate);
        loadActivitiesFromStorage(currentViewDate);

        // Écouteurs pour la navigation entre les semaines
        const nextWeekButton = document.getElementById('next-week');
        const previousWeekButton = document.getElementById('previous-week');

        nextWeekButton.addEventListener('click', function () {
            adjustWeek(7);
        });

        previousWeekButton.addEventListener('click', function () {
            adjustWeek(-7);
        });
    } else {
        console.warn('Le bouton pour ouvrir la modale n\'existe pas sur cette page.');
    }
});

// Variable globale pour stocker la date actuelle affichée
let currentViewDate = new Date();
