document.addEventListener('DOMContentLoaded', function () {
    let currentViewDate = new Date();
    const openModalButton = document.getElementById('openModal');

    if (openModalButton) {
        const modal = document.getElementById('modal');
        const closeModalSpan = document.querySelector('.close');
        const saveEventButton = document.getElementById('save-event');

        // Ouvrir la modale pour créer ou modifier une activité
        openModalButton.addEventListener('click', function () {
            modal.style.display = 'block';
            resetModalFields(); // Réinitialise les champs pour éviter les conflits
        });

        // Fermer la modale de création/modification d'activité
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
            document.getElementById('activity-realized-time').value = '';
            document.getElementById('save-event').removeAttribute('data-activity-id');
        }

        // Ouvrir une activité existante pour modification
        function openActivityForEdit(activityId) {
            const activities = JSON.parse(localStorage.getItem('activities')) || [];
            const activity = activities.find(a => a.id === activityId);

            if (activity) {
                document.getElementById('activity-name').value = activity.activityName;
                document.getElementById('activity-color').value = activity.activitiesDetails[0]?.color || 'red';

                // Utiliser les détails du premier élément pour préremplir les dates et heures
                const firstDetail = activity.activitiesDetails[0];
                if (firstDetail) {
                    document.getElementById('activity-time-start').value = firstDetail.startTime;
                    document.getElementById('activity-time-end').value = firstDetail.endTime;
                    document.getElementById('activity-start-date').value = firstDetail.date;
                }

                const lastDetail = activity.activitiesDetails[activity.activitiesDetails.length - 1];
                if (lastDetail) {
                    document.getElementById('activity-end-date').value = lastDetail.date;
                }

                document.getElementById('save-event').setAttribute('data-activity-id', activityId);
                modal.style.display = 'block';
            }
        }

        // Ajouter un bouton de suppression pour les activités dans le calendrier
        function addDeleteButton(activityElement, activityId, activityDate) {
            const deleteButton = document.createElement('span');
            deleteButton.textContent = '✖';
            deleteButton.classList.add('delete-activity-btn');
            deleteButton.style.color = activityElement.style.backgroundColor;
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.marginLeft = '10px';

            deleteButton.addEventListener('click', function (event) {
                event.stopPropagation(); // Empêche d'ouvrir la modale lors du clic sur supprimer
                removeActivityFromDay(activityId, activityDate);
                loadActivitiesFromStorage(currentViewDate);
            });

            activityElement.appendChild(deleteButton);
        }

        // Supprimer une activité d'une journée spécifique
        function removeActivityFromDay(activityId, activityDate) {
            const activities = JSON.parse(localStorage.getItem('activities')) || [];
            const updatedActivities = activities.map(activity => {
                if (activity.id === activityId) {
                    activity.activitiesDetails = activity.activitiesDetails.filter(detail => detail.date !== activityDate);
                }
                return activity;
            });

            localStorage.setItem('activities', JSON.stringify(updatedActivities));
        }

        // Sauvegarder une nouvelle activité ou une modification
        saveEventButton.addEventListener('click', function () {
            const activityId = saveEventButton.getAttribute('data-activity-id');
            const activityName = document.getElementById('activity-name').value;
            const startTime = document.getElementById('activity-time-start').value;
            const endTime = document.getElementById('activity-time-end').value;
            const startDateValue = document.getElementById('activity-start-date').value;
            const endDateValue = document.getElementById('activity-end-date').value;
            const color = document.getElementById('activity-color').value;
            const realizedTime = parseFloat(document.getElementById('activity-realized-time').value) || 0;

            // Vérification des champs requis
            if (!activityName || !startTime || !endTime || !startDateValue) {
                alert('Veuillez remplir tous les champs requis.');
                return;
            }

            const startDate = new Date(startDateValue);

            if (activityId) {
                updateActivityDetail(activityId, startDateValue, startTime, endTime, realizedTime, color);
            } else {
                saveNewActivity(activityName, startDate, endDateValue, startTime, endTime, color, realizedTime);
            }

            loadActivitiesFromStorage(currentViewDate);
            updateActivitiesTable(); // Mettre à jour le tableau des activités
            modal.style.display = 'none';
            resetModalFields();
        });

        // Mettre à jour les détails d'une activité existante
        function updateActivityDetail(activityId, targetDate, startTime, endTime, realizedTime, color) {
            const activities = JSON.parse(localStorage.getItem('activities')) || [];
            const activity = activities.find(a => a.id === activityId);

            if (activity) {
                const existingDetailIndex = activity.activitiesDetails.findIndex(detail => detail.date === targetDate);
                if (existingDetailIndex > -1) {
                    activity.activitiesDetails[existingDetailIndex] = {
                        ...activity.activitiesDetails[existingDetailIndex],
                        startTime,
                        endTime,
                        color,
                        realizedTime: (activity.activitiesDetails[existingDetailIndex].realizedTime || 0) + realizedTime
                    };
                } else {
                    activity.activitiesDetails.push({
                        date: targetDate,
                        startTime,
                        endTime,
                        color,
                        realizedTime
                    });
                }

                activity.realizedHours = activity.activitiesDetails.reduce((total, detail) => total + (detail.realizedTime || 0), 0);
                localStorage.setItem('activities', JSON.stringify(activities));
            }
        }

        // Sauvegarder une nouvelle activité
        function saveNewActivity(activityName, startDate, endDateValue, startTime, endTime, color, realizedTime) {
            const activities = JSON.parse(localStorage.getItem('activities')) || [];
            const endDate = new Date(endDateValue);

            const dayDifference = Math.round((endDate - startDate) / (1000 * 3600 * 24));
            let activitiesDetails = [];

            for (let i = 0; i <= dayDifference; i++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(currentDate.getDate() + i);

                activitiesDetails.push({
                    date: currentDate.toISOString().split('T')[0],
                    startTime,
                    endTime,
                    color,
                    realizedTime: 0
                });
            }

            const newActivity = {
                id: generateUniqueId(),
                activityName,
                totalHours: parseFloat(((dayDifference + 1) * ((new Date(`1970-01-01T${endTime}`) - new Date(`1970-01-01T${startTime}`)) / (1000 * 3600))).toFixed(2)),
                realizedHours: realizedTime,
                activitiesDetails
            };

            activities.push(newActivity);
            localStorage.setItem('activities', JSON.stringify(activities));
        }

        // Charger et afficher les activités depuis le stockage local
        function loadActivitiesFromStorage(currentDate = new Date()) {
            const activities = JSON.parse(localStorage.getItem('activities')) || [];
            const dayMapping = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

            // Met à jour uniquement calendar-header
            const calendarHeader = document.querySelector('.calendar-header');
            calendarHeader.innerHTML = '';

            dayMapping.forEach((day, index) => {
                const dayDate = new Date(startOfWeek);
                dayDate.setDate(startOfWeek.getDate() + index);
                const formattedDate = dayDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

                const dayElement = document.createElement('div');
                dayElement.classList.add('calendar-day', day);
                dayElement.innerHTML = `<span class="day-title">${dayNames[index]}</span> - <span class="date-display">${formattedDate}</span>`;

                calendarHeader.appendChild(dayElement);
            });

            // Efface les doublons dans calendar-body
            dayMapping.forEach(day => {
                const dayContainer = document.getElementById(day);
                if (dayContainer) {
                    dayContainer.innerHTML = ''; // Nettoie les activités uniquement
                }
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

                        activityElement.innerHTML = `
                            <span class="activity-name">${activity.activityName}</span>
                            <span class="activity-time">${detail.startTime} - ${detail.endTime}</span>
                        `;

                        activityElement.addEventListener('click', function () {
                            openActivityForEdit(activity.id);
                        });

                        addDeleteButton(activityElement, activity.id, detail.date);
                        dayContainer.appendChild(activityElement);
                    }
                });
            });
        }

        // Mettre à jour le tableau des activités
        function updateActivitiesTable() {
            const activitiesLog = document.getElementById('activities-log');
            if (!activitiesLog) return;

            const tableBody = activitiesLog.querySelector('tbody');
            if (!tableBody) return;

            const activities = JSON.parse(localStorage.getItem('activities')) || [];
            tableBody.innerHTML = '';

            activities.forEach(activity => {
                const row = tableBody.insertRow();
                const checkboxCell = row.insertCell(0);
                const nameCell = row.insertCell(1);
                const plannedHoursCell = row.insertCell(2);
                const realizedHoursCell = row.insertCell(3);
                const remainingHoursCell = row.insertCell(4);

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('select-activity');
                checkbox.setAttribute('data-activity-id', activity.id);

                checkboxCell.appendChild(checkbox);
                nameCell.textContent = activity.activityName;
                plannedHoursCell.textContent = activity.totalHours.toFixed(2);
                realizedHoursCell.textContent = activity.realizedHours?.toFixed(2) || '0.00';
                remainingHoursCell.textContent = (activity.totalHours - (activity.realizedHours || 0)).toFixed(2);
            });
        }

        // Générer un identifiant unique pour chaque activité
        function generateUniqueId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

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

        const nextWeekButton = document.getElementById('next-week');
        const previousWeekButton = document.getElementById('previous-week');

        nextWeekButton.addEventListener('click', function () {
            adjustWeek(7);
        });

        previousWeekButton.addEventListener('click', function () {
            adjustWeek(-7);
        });

        function adjustWeek(days) {
            currentViewDate.setDate(currentViewDate.getDate() + days);
            displayWeekNumber(currentViewDate);
            loadActivitiesFromStorage(currentViewDate);
        }

        function displayWeekNumber(date) {
            const weekNumber = moment(date).isoWeek();
            const weekNumberContainer = document.getElementById('week-number');
            weekNumberContainer.textContent = `Semaine ${weekNumber}`;
        }

        displayWeekNumber(currentViewDate);
        loadActivitiesFromStorage(currentViewDate);
        updateActivitiesTable();
    }
});
