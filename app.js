document.addEventListener('DOMContentLoaded', function () {
    const openModalButton = document.getElementById('openModal');
    let timerInterval;
    let isPaused = false;

    if (openModalButton) {
        const modal = document.getElementById('modal');
        const closeModalSpan = document.querySelector('.close');
        const saveEventButton = document.getElementById('save-event');

        // Ouvrir la modale pour créer une nouvelle activité
        openModalButton.addEventListener('click', function () {
            modal.style.display = 'block';
        });

        // Fermer la modale de création d'activité
        closeModalSpan.addEventListener('click', function () {
            modal.style.display = 'none';
            resetModalFields();
        });

        // Fermer la modale si l'utilisateur clique en dehors
        window.addEventListener('click', function (event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                resetModalFields();
            }
        });

        // Réinitialiser les champs de la modale
        function resetModalFields() {
            document.getElementById('activity-name').value = '';
            document.getElementById('activity-time-start').value = '';
            document.getElementById('activity-time-end').value = '';
            document.getElementById('activity-start-date').value = '';
            document.getElementById('activity-end-date').value = '';
            document.getElementById('activity-color').value = 'red';
        }

        // Vérifier s'il y a un conflit avec une autre activité
        function isConflictingActivity(newActivityDetails) {
            const activities = JSON.parse(localStorage.getItem('activities')) || [];

            for (let activity of activities) {
                for (let detail of activity.activitiesDetails) {
                    const existingDate = new Date(detail.date).toISOString().slice(0, 10);
                    const newActivityDate = new Date(newActivityDetails.date).toISOString().slice(0, 10);

                    if (
                        existingDate === newActivityDate &&
                        ((detail.startTime < newActivityDetails.endTime && detail.endTime > newActivityDetails.startTime) ||
                            (newActivityDetails.startTime < detail.endTime && newActivityDetails.endTime > detail.startTime))
                    ) {
                        return true;
                    }
                }
            }

            return false;
        }

        // Sauvegarder une nouvelle activité après validation
        saveEventButton.addEventListener('click', function () {
            const activityName = document.getElementById('activity-name').value;
            const startTime = document.getElementById('activity-time-start').value;
            const endTime = document.getElementById('activity-time-end').value;
            const startDate = new Date(document.getElementById('activity-start-date').value);
            const endDate = new Date(document.getElementById('activity-end-date').value);
            const color = document.getElementById('activity-color').value;

            const dayDifference = Math.round((endDate - startDate) / (1000 * 3600 * 24));
            const hoursPerDay = (new Date(`1970-01-01T${endTime}`) - new Date(`1970-01-01T${startTime}`)) / (1000 * 3600);
            const totalHours = parseFloat((hoursPerDay * (dayDifference + 1)).toFixed(2));
            let activitiesDetails = [];

            for (let i = 0; i <= dayDifference; i++) {
                let currentDate = new Date(startDate);
                currentDate.setDate(currentDate.getDate() + i);

                if (i === 0 && endTime < startTime) {
                    const firstDayEndTime = '23:59';
                    const secondDayStartTime = '00:00';

                    let firstDayDetail = {
                        color: color,
                        name: activityName,
                        startTime: startTime,
                        endTime: firstDayEndTime,
                        date: currentDate.toISOString().split('T')[0]
                    };
                    if (!isConflictingActivity(firstDayDetail)) {
                        activitiesDetails.push(firstDayDetail);
                    } else {
                        alert('Conflit détecté avec une autre activité sur ce créneau.');
                        return;
                    }

                    let secondDay = new Date(currentDate);
                    secondDay.setDate(secondDay.getDate() + 1);

                    let secondDayDetail = {
                        color: color,
                        name: activityName,
                        startTime: secondDayStartTime,
                        endTime: endTime,
                        date: secondDay.toISOString().split('T')[0]
                    };
                    if (!isConflictingActivity(secondDayDetail)) {
                        activitiesDetails.push(secondDayDetail);
                    } else {
                        alert('Conflit détecté avec une autre activité sur ce créneau.');
                        return;
                    }
                } else {
                    let newActivityDetail = {
                        color: color,
                        name: activityName,
                        startTime: startTime,
                        endTime: endTime,
                        date: currentDate.toISOString().split('T')[0]
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
            loadActivitiesFromStorage(currentViewDate);
            modal.style.display = 'none';
            resetModalFields();
        });

        // Sauvegarder l'activité dans le stockage local
        function saveActivityToStorage(activityName, totalHours, activitiesDetails) {
            const activities = JSON.parse(localStorage.getItem('activities')) || [];
            let activityFound = activities.find(activity => activity.activityName === activityName);

            if (activityFound) {
                activityFound.activitiesDetails = activityFound.activitiesDetails.concat(activitiesDetails);
                activityFound.totalHours = parseFloat((activityFound.totalHours + totalHours).toFixed(2));
            } else {
                const newActivity = {
                    id: generateUniqueId(), // Générer un ID unique pour chaque activité
                    activityName,
                    totalHours,
                    activitiesDetails
                };
                activities.push(newActivity);
            }

            localStorage.setItem('activities', JSON.stringify(activities));
            loadActivitiesFromStorage(currentViewDate);
        }

        // Charger et afficher les activités depuis le stockage local
        function loadActivitiesFromStorage(currentDate = new Date()) {
            const activities = JSON.parse(localStorage.getItem('activities')) || [];
            const dayMapping = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

            dayMapping.forEach(day => {
                const dayContainer = document.getElementById(day);
                dayContainer.innerHTML = ''; // Vider le conteneur avant d'ajouter de nouvelles activités
            });

            activities.forEach(activity => {
                (activity.activitiesDetails || []).forEach(detail => {
                    const activityDate = new Date(detail.date);
                    const dayOfWeek = activityDate.getDay();
                    const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                    const dayContainer = document.getElementById(dayMapping[adjustedDayOfWeek]);

                    if (isDateInCurrentView(activityDate, currentDate)) {
                        const activityElement = document.createElement('div');
                        activityElement.classList.add('activity');
                        activityElement.style.backgroundColor = detail.color;
                        activityElement.setAttribute('data-activity-id', activity.id);

                        // Ajouter une ligne pour les heures réalisées si existantes
                        activityElement.innerHTML = `
                            <span class="activity-name">${detail.name}</span>
                            <span class="activity-time">${detail.startTime} - ${detail.endTime}</span>
                            <span class="activity-dates">${activityDate.toLocaleDateString()}</span>
                            <span class="activity-total-hours">Heures prévues : ${activity.totalHours.toFixed(2)}</span>
                            <span class="activity-hours-realized">Heures réalisées : ${activity.hoursRealized ? activity.hoursRealized.toFixed(2) : '0.00'}</span>
                            <button class="start-timer-btn">Lancer le timer</button>
                            <button class="delete-activity-btn">Supprimer</button>
                        `;
                        dayContainer.appendChild(activityElement);
                    }
                });
            });

            attachDeleteEventListeners();
            attachStartTimerListeners();
        }

        // Ajouter un événement pour chaque bouton de suppression d'activité
        function attachDeleteEventListeners() {
            document.querySelectorAll('.delete-activity-btn').forEach(button => {
                button.addEventListener('click', function (event) {
                    const activityElement = event.target.closest('.activity');
                    const activityId = activityElement.getAttribute('data-activity-id');
                    const activityDate = activityElement.querySelector('.activity-dates').textContent;
                    const activityTime = activityElement.querySelector('.activity-time').textContent.split(' - ');
                    const startTime = activityTime[0];
                    const endTime = activityTime[1];

                    if (activityId) {
                        removeActivityDetailFromStorage(activityId, activityDate, startTime, endTime);
                        activityElement.remove();
                    }
                });
            });
        }

        // Ajouter un événement pour chaque bouton de démarrage de timer
        function attachStartTimerListeners() {
            document.querySelectorAll('.start-timer-btn').forEach(button => {
                button.addEventListener('click', function (event) {
                    const activityElement = event.target.closest('.activity');
                    const activityId = activityElement.getAttribute('data-activity-id');
                    const activityDate = activityElement.querySelector('.activity-dates').textContent;
                    const activityTime = activityElement.querySelector('.activity-time').textContent.split(' - ');
                    const startTime = activityTime[0];
                    const endTime = activityTime[1];

                    const activityDetail = {
                        activityId,
                        date: activityDate,
                        startTime,
                        endTime
                    };

                    // Démarrer le timer pour l'activité spécifique
                    startTimer(activityDetail);
                });
            });
        }

        // Fonction pour lancer le timer pour une activité
        function startTimer(activityDetail) {
            const startTime = Date.now(); // Enregistrer le temps de début en millisecondes
            const totalDuration = calculateRemainingTime(activityDetail.startTime, activityDetail.endTime); // Durée totale en secondes

            // Sauvegarder l'état du timer dans le stockage local
            localStorage.setItem('timerState', JSON.stringify({ activityDetail, startTime, totalDuration }));

            timerInterval = setInterval(() => {
                const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
                const remainingTime = totalDuration - elapsedSeconds;

                // Mettre à jour l'affichage du timer
                document.getElementById('timer-display').textContent = formatTime(remainingTime);

                // Vérifier si le temps est écoulé
                if (remainingTime <= 0) {
                    clearInterval(timerInterval);
                    addHoursToActivityTable(activityDetail, totalDuration); // Ajouter le temps réalisé à l'activité
                    alert("Le temps alloué à l'activité est écoulé !");
                    removeActivityDetailFromStorage(activityDetail.activityId, activityDetail.date, activityDetail.startTime, activityDetail.endTime);

                    // Ajouter le temps réalisé au tableau des activités
                    updateHoursRealized(activityDetail, totalDuration);

                    // Supprimer l'état du timer une fois terminé
                    localStorage.removeItem('timerState');
                }
            }, 1000);
        }

        // Fonction pour restaurer et recalculer dynamiquement le temps restant lors du chargement de la page
        function restoreTimer() {
            const savedTimerState = JSON.parse(localStorage.getItem('timerState'));
            if (savedTimerState) {
                const { activityDetail, startTime, totalDuration } = savedTimerState;
                const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
                const remainingTime = totalDuration - elapsedSeconds;

                // Si le temps restant est encore positif, démarrer le timer
                if (remainingTime > 0) {
                    startRestoredTimer(activityDetail, startTime, totalDuration);
                } else {
                    // Si le temps est déjà écoulé, supprimer l'activité
                    addHoursToActivityTable(activityDetail, totalDuration);
                    localStorage.removeItem('timerState');
                    removeActivityDetailFromStorage(activityDetail.activityId, activityDetail.date, activityDetail.startTime, activityDetail.endTime);
                }
            }
        }

        // Fonction pour démarrer le timer restauré à partir des données sauvegardées
        function startRestoredTimer(activityDetail, startTime, totalDuration) {
            timerInterval = setInterval(() => {
                const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
                const remainingTime = totalDuration - elapsedSeconds;

                // Mettre à jour l'affichage du timer
                document.getElementById('timer-display').textContent = formatTime(remainingTime);

                // Vérifier si le temps est écoulé
                if (remainingTime <= 0) {
                    clearInterval(timerInterval);
                    addHoursToActivityTable(activityDetail, totalDuration); // Ajouter le temps réalisé à l'activité
                    alert("Le temps alloué à l'activité est écoulé !");
                    removeActivityDetailFromStorage(activityDetail.activityId, activityDetail.date, activityDetail.startTime, activityDetail.endTime);

                    // Ajouter le temps réalisé au tableau des activités
                    updateHoursRealized(activityDetail, totalDuration);

                    // Supprimer l'état du timer une fois terminé
                    localStorage.removeItem('timerState');
                }
            }, 1000);
        }

        // Fonction pour mettre à jour les heures réalisées dans le tableau des activités
        function updateHoursRealized(activityDetail, totalDuration) {
            const activities = JSON.parse(localStorage.getItem('activities')) || [];
            const activity = activities.find(act => act.id === activityDetail.activityId);

            if (activity) {
                // Convertir le temps total en heures
                const hoursSpent = Math.abs(totalDuration / 3600); // Convertir les secondes en heures

                // Initialiser ou mettre à jour les heures réalisées
                if (!activity.hoursRealized) {
                    activity.hoursRealized = 0;
                }
                activity.hoursRealized += parseFloat(hoursSpent.toFixed(2));

                // Mettre à jour le stockage local
                localStorage.setItem('activities', JSON.stringify(activities));
                loadActivitiesFromStorage(); // Recharger l'affichage des activités
            }
        }

        // Fonction pour calculer la durée totale en secondes entre une heure de début et une heure de fin
        function calculateRemainingTime(startTime, endTime) {
            const start = new Date(`1970-01-01T${startTime}`).getTime();
            const end = new Date(`1970-01-01T${endTime}`).getTime();
            return Math.floor((end - start) / 1000); // Calcul précis en secondes
        }

        // Fonction pour formater le temps en `HH:MM:SS`
        function formatTime(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = seconds % 60;

            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        }

        // Ajouter le temps réalisé au tableau des activités
        function addHoursToActivityTable(activityDetail, totalDuration) {
            const activities = JSON.parse(localStorage.getItem('activities')) || [];
            const activity = activities.find(act => act.id === activityDetail.activityId);

            if (activity) {
                const hoursSpent = Math.abs(totalDuration / 3600); // Convertir les secondes en heures
                activity.totalHours = parseFloat(activity.totalHours.toFixed(2));

                // Ajouter le temps réalisé à `hoursRealized`
                if (!activity.hoursRealized) {
                    activity.hoursRealized = 0;
                }
                activity.hoursRealized += parseFloat(hoursSpent.toFixed(2));

                // Mettre à jour le stockage local
                localStorage.setItem('activities', JSON.stringify(activities));
                loadActivitiesFromStorage();
            }
        }

        // Supprimer un détail spécifique d'une activité du stockage local
        function removeActivityDetailFromStorage(activityId, activityDate, startTime, endTime) {
            let activities = JSON.parse(localStorage.getItem('activities')) || [];

            activities = activities.map(activity => {
                if (activity.id === activityId) {
                    activity.activitiesDetails = activity.activitiesDetails.filter(detail =>
                        !(new Date(detail.date).toLocaleDateString() === activityDate &&
                            detail.startTime === startTime &&
                            detail.endTime === endTime)
                    );

                    if (activity.activitiesDetails.length > 0) {
                        const totalHours = activity.activitiesDetails.reduce((total, detail) => {
                            const hours = (new Date(`1970-01-01T${detail.endTime}`) - new Date(`1970-01-01T${detail.startTime}`)) / (1000 * 3600);
                            return total + hours;
                        }, 0);
                        activity.totalHours = parseFloat(totalHours.toFixed(2));
                    } else {
                        activity.totalHours = 0;
                    }
                }
                return activity;
            }).filter(activity => activity.activitiesDetails.length > 0);

            localStorage.setItem('activities', JSON.stringify(activities));
            loadActivitiesFromStorage();
        }

        // Restaurer un timer s'il était en cours
        restoreTimer();

        // Déterminer si une date est dans la semaine affichée
        function isDateInCurrentView(activityDate, currentDate) {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            return activityDate >= startOfWeek && activityDate <= endOfWeek;
        }

        // Mettre à jour les dates du calendrier
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

        // Ajuster la semaine affichée (passer à la semaine suivante ou précédente)
        function adjustWeek(days) {
            currentViewDate.setDate(currentViewDate.getDate() + days);
            displayWeekNumber(currentViewDate);
            updateCalendarDates(currentViewDate);
            loadActivitiesFromStorage(currentViewDate);
        }

        // Afficher le numéro de la semaine courante
        function displayWeekNumber(date) {
            const weekNumber = moment(date).isoWeek();
            const weekNumberContainer = document.getElementById('week-number');
            weekNumberContainer.textContent = `Semaine ${weekNumber}`;
        }

        // Événements pour changer de semaine
        const nextWeekButton = document.getElementById('next-week');
        const previousWeekButton = document.getElementById('previous-week');

        nextWeekButton.addEventListener('click', function () {
            adjustWeek(7);
        });

        previousWeekButton.addEventListener('click', function () {
            adjustWeek(-7);
        });

        displayWeekNumber(currentViewDate);
        updateCalendarDates(currentViewDate);
        loadActivitiesFromStorage(currentViewDate);

    } else {
        console.warn('Le bouton pour ouvrir la modale n\'existe pas sur cette page.');
    }
});

let currentViewDate = new Date();

// Générer un identifiant unique pour chaque activité
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
