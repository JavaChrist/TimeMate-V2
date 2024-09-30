let data = {
    categories: [
        {
            id: "travaux",
            name: "TRAVAUX A REALISER",
            page: "travaux.html",
            logo: "/Pense-bete-TimeMate/images/travaux.png",
            className: "travaux"
        },
        {
            id: "projets",
            name: "FUTUR PROJETS",
            page: "projets.html",
            logo: "/Pense-bete-TimeMate/images/projets.png",
            className: "projets"
        },
        {
            id: "reseaux",
            name: "RESEAUX SOCIAUX",
            page: "reseaux.html",
            logo: "/Pense-bete-TimeMate/images/LinkedIn.png",
            className: "reseaux"
        },
        {
            id: "afaire",
            name: "A FAIRE",
            page: "afaire.html",
            logo: "/Pense-bete-TimeMate/images/afaire.png",
            className: "afaire"
        },
        {
            id: "divers",
            name: "DIVERS",
            page: "divers.html",
            logo: "/Pense-bete-TimeMate/images/divers.png",
            className: "divers"
        },
        {
            id: "codes",
            name: "CODES",
            page: "codes.html",
            logo: "favicon.ico",
            className: "codes"
        }
    ]
};

// Fonction pour gérer l'ajout de contenu à la catégorie et sa sauvegarde dans localStorage
function handleContentFormSubmit() {
    const contentForm = document.getElementById('content-form');
    if (contentForm) {
        contentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const title = document.getElementById('title').value.trim();
            const description = document.getElementById('description').value.trim();
            const code = document.getElementById('code').value.trim();

            const newContent = {
                title: title,
                description: description,
                code: code
            };

            const categoryId = document.body.getAttribute('data-category-id');
            let storedContent = JSON.parse(localStorage.getItem(`${categoryId}Content`)) || [];
            storedContent.push(newContent);

            localStorage.setItem(`${categoryId}Content`, JSON.stringify(storedContent));
            addContentToPage(newContent, storedContent.length - 1);
            contentForm.reset();
            Prism.highlightAll();
        });
    }
}

// Fonction pour ajouter le contenu à la page
function addContentToPage(content, index) {
    const section = document.createElement('section');
    const h2 = document.createElement('h2');
    h2.textContent = content.title;
    const p = document.createElement('p');
    p.textContent = content.description;

    const pre = document.createElement('pre');
    const codeElement = document.createElement('code');

    const categoryId = document.body.getAttribute('data-category-id');
    if (categoryId === "javascript") {
        codeElement.classList.add('language-js');
    } else if (categoryId === "css") {
        codeElement.classList.add('language-css');
    } else {
        codeElement.classList.add('language-html');
    }

    codeElement.textContent = content.code;
    pre.appendChild(codeElement);

    const editButton = document.createElement('button');
    editButton.textContent = "Modifier";
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', () => editContent(index));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Supprimer";
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => deleteContent(index));

    section.appendChild(h2);
    section.appendChild(p);
    if (content.code) section.appendChild(pre);
    section.appendChild(editButton);
    section.appendChild(deleteButton);

    const contentElement = document.getElementById('content');
    if (contentElement) {
        contentElement.appendChild(section);
    }

    Prism.highlightAll();
}

// Fonction pour éditer le contenu
function editContent(index) {
    const categoryId = document.body.getAttribute('data-category-id');
    let storedContent = JSON.parse(localStorage.getItem(`${categoryId}Content`)) || [];

    const contentToEdit = storedContent[index];
    document.getElementById('title').value = contentToEdit.title;
    document.getElementById('description').value = contentToEdit.description;
    document.getElementById('code').value = contentToEdit.code;

    storedContent.splice(index, 1);
    localStorage.setItem(`${categoryId}Content`, JSON.stringify(storedContent));
    refreshContent();
}

// Fonction pour supprimer le contenu
function deleteContent(index) {
    const categoryId = document.body.getAttribute('data-category-id');
    let storedContent = JSON.parse(localStorage.getItem(`${categoryId}Content`)) || [];

    storedContent.splice(index, 1);
    localStorage.setItem(`${categoryId}Content`, JSON.stringify(storedContent));
    refreshContent();
}

// Fonction pour rafraîchir l'affichage des contenus
function refreshContent() {
    const contentElement = document.getElementById('content');
    if (contentElement) {
        contentElement.innerHTML = '';
        loadSavedContent();
    }
}

// Charger les données sauvegardées depuis localStorage au chargement de la page
function loadSavedContent() {
    const categoryId = document.body.getAttribute('data-category-id');
    if (categoryId) {
        const storedContent = JSON.parse(localStorage.getItem(`${categoryId}Content`)) || [];
        storedContent.forEach((content, index) => addContentToPage(content, index));
    }
}

// Fonction pour mettre en évidence les mots pertinents dans les résultats de recherche
function highlightText(text, query) {
    if (!query) return text; // Si la requête est vide, retourne le texte tel quel
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
}

function performSearch(query) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // Vider les résultats précédents
    const searchResultsSection = document.getElementById('search-results');
    searchResultsSection.style.display = 'block'; // Afficher la section des résultats

    let resultsFound = false;

    data.categories.forEach(category => {
        const storedContent = JSON.parse(localStorage.getItem(`${category.id}Content`)) || [];
        storedContent.forEach(content => {
            if (
                content.title.toLowerCase().includes(query.toLowerCase()) ||
                content.description.toLowerCase().includes(query.toLowerCase()) ||
                content.code.toLowerCase().includes(query.toLowerCase())
            ) {
                resultsFound = true;

                const resultItem = document.createElement('div');
                resultItem.classList.add('result-item');

                const categoryTitle = document.createElement('h3');
                categoryTitle.textContent = `Catégorie : ${category.name}`;

                const contentTitle = document.createElement('h4');
                contentTitle.innerHTML = highlightText(content.title, query); // Applique la coloration sur le titre

                const contentDescription = document.createElement('p');
                contentDescription.innerHTML = highlightText(content.description, query); // Applique la coloration sur la description

                const pre = document.createElement('pre');
                const codeElement = document.createElement('code');

                // Applique la coloration sur le code
                codeElement.innerHTML = highlightText(content.code, query);

                if (category.id === "javascript") {
                    codeElement.classList.add('language-js');
                } else if (category.id === "css") {
                    codeElement.classList.add('language-css');
                } else {
                    codeElement.classList.add('language-html');
                }

                pre.appendChild(codeElement);

                resultItem.appendChild(categoryTitle);
                resultItem.appendChild(contentTitle);
                resultItem.appendChild(contentDescription);
                resultItem.appendChild(pre);

                resultsContainer.appendChild(resultItem);
            }
        });
    });

    if (!resultsFound) {
        const noResults = document.createElement('p');
        noResults.textContent = "Aucun résultat trouvé pour votre recherche.";
        resultsContainer.appendChild(noResults);
    }

    Prism.highlightAll(); // Réappliquer Prism.js pour la coloration syntaxique
}

// Initialisation de la recherche
function initializeSearch() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function () {
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        });

        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    performSearch(query);
                }
            }
        });
    }
}

// Initialisation de la page des catégories
function initializePage() {
    loadSavedContent();
    handleContentFormSubmit();
}

// Générer les liens pour chaque catégorie sur la page d'accueil avec logos
function generateCategoryLinks() {
    const categoryMenu = document.getElementById('category-menu');
    if (categoryMenu) {
        categoryMenu.innerHTML = '';

        data.categories.forEach(category => {
            const a = document.createElement('a');
            a.href = category.page;
            a.classList.add('category-card', category.className);

            const img = document.createElement('img');
            img.src = category.logo;
            img.alt = `${category.name} Logo`;

            const h3 = document.createElement('h3');
            h3.textContent = category.name;

            a.appendChild(img);
            a.appendChild(h3);
            categoryMenu.appendChild(a);
        });
    }
}

// Gérer la soumission du formulaire pour ajouter une nouvelle catégorie
function handleCategoryFormSubmit() {
    const categoryForm = document.getElementById('category-form');
    if (categoryForm) {
        categoryForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const newCategoryName = document.getElementById('new-category-name').value.trim();
            if (newCategoryName) {
                const newCategoryId = newCategoryName.toLowerCase().replace(/\s+/g, '-');
                const newCategoryPage = `${newCategoryId}.html`;

                if (!data.categories.find(cat => cat.id === newCategoryId)) {
                    const className = newCategoryId;
                    const logo = prompt("Entrez l'URL du logo pour cette catégorie (par exemple, un lien vers une image SVG) :");

                    data.categories.push({
                        id: newCategoryId,
                        name: newCategoryName,
                        page: newCategoryPage,
                        logo: logo,
                        className: className
                    });

                    generateCategoryLinks();
                    categoryForm.reset();
                } else {
                    alert('Une catégorie avec ce nom existe déjà.');
                }
            }
        });
    }
}

// Fonction pour exporter les données
function exportData() {
    const allData = {};

    // Récupérer les données de chaque catégorie
    data.categories.forEach(category => {
        const storedContent = JSON.parse(localStorage.getItem(`${category.id}Content`)) || [];
        allData[category.id] = storedContent;
    });

    // Convertir les données en JSON et créer un fichier téléchargeable
    const dataStr = JSON.stringify(allData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Créer un lien pour télécharger le fichier
    const a = document.createElement('a');
    a.href = url;
    a.download = "pense-bete-donnees.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Fonction pour importer les données
function importData(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const importedData = JSON.parse(e.target.result);

                if (!importedData || typeof importedData !== 'object') {
                    throw new Error("La structure JSON n'est pas valide.");
                }

                Object.keys(importedData).forEach(categoryId => {
                    localStorage.setItem(`${categoryId}Content`, JSON.stringify(importedData[categoryId]));
                });

                alert("Importation réussie !");
                refreshContent();
            } catch (error) {
                alert(`Erreur lors de l'importation des données : ${error.message}`);
            }
        };
        reader.readAsText(file);
    }
}

// Initialisation globale
function initializeApp() {
    generateCategoryLinks();
    handleCategoryFormSubmit();
    initializeSearch(); // Ajouter la fonction de recherche ici
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', function () {
    initializePage();
    initializeApp();

    // Gérer l'importation et l'exportation
    document.getElementById('import-button').addEventListener('click', () => {
        document.getElementById('import-file-input').click();
    });

    document.getElementById('import-file-input').addEventListener('change', importData);

    document.getElementById('export-button').addEventListener('click', exportData);

    // Ajout de la fonction pour le bouton "Agenda"
    document.getElementById('agenda-button').addEventListener('click', function () {
        window.location.href = '../app.html';
    });
});
