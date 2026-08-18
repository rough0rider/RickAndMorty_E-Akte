// ========================================
// DOM
// ========================================

const characterList =
    document.getElementById("character-list");

const searchInput =
    document.getElementById("search");

const characterImage =
    document.getElementById("character-image");

const characterName =
    document.getElementById("character-name");

const characterStatus =
    document.getElementById("character-status");

const characterSpecies =
    document.getElementById("character-species");

const characterGender =
    document.getElementById("character-gender");

const characterOrigin =
    document.getElementById("character-origin");

const characterLocation =
    document.getElementById("character-location");

const fileNumber =
    document.getElementById("file-number");


// ========================================
// Daten
// ========================================

let characters = [];

let searchTimeout;


// ========================================
// Anwendung starten
// ========================================

async function init() {

    showLoading();


    try {

        const data =
            await getCharacters(1);


        characters =
            data.results;


        renderCharacterList(
            characters
        );


        if (characters.length > 0) {

            showCharacter(
                characters[0]
            );

        }


    } catch (error) {

        console.error(
            "Fehler beim Laden:",
            error
        );

        showError();

    }

}


// ========================================
// Loading
// ========================================

function showLoading() {

    characterList.innerHTML = `
        <div class="loading">
            Charaktere werden geladen...
        </div>
    `;

}


// ========================================
// Fehler
// ========================================

function showError() {

    characterList.innerHTML = `
        <div class="error">
            Die Charaktere konnten nicht geladen werden.
        </div>
    `;

}


// ========================================
// Charakterliste
// ========================================

function renderCharacterList(list) {

    characterList.innerHTML = "";


    if (list.length === 0) {

        characterList.innerHTML = `
            <div class="no-results">
                Keine Charaktere gefunden.
            </div>
        `;

        return;

    }


    list.forEach(character => {

        const button =
            document.createElement("button");


        button.classList.add(
            "character"
        );


        button.innerHTML = `
            <img
                src="${character.image}"
                alt="${character.name}"
                loading="lazy"
            >

            <div>
                <strong>
                    ${character.name}
                </strong>

                <span>
                    ${character.species}
                </span>
            </div>
        `;


        button.addEventListener(
            "click",
            () => {

                showCharacter(
                    character
                );

            }
        );


        characterList.appendChild(
            button
        );

    });

}


// ========================================
// E-Akte anzeigen
// ========================================

function showCharacter(character) {

    characterImage.src =
        character.image;

    characterImage.alt =
        character.name;


    characterName.textContent =
        character.name;


    characterSpecies.textContent =
        character.species;


    characterGender.textContent =
        character.gender;


    characterOrigin.textContent =
        character.origin.name;


    characterLocation.textContent =
        character.location.name;

    fileNumber.textContent =
        `FILE #${String(character.id).padStart(4, "0")}`;


    updateStatus(
        character.status
    );

}


// ========================================
// Status
// ========================================

function updateStatus(status) {

    characterStatus.classList.remove(
        "alive",
        "dead"
    );


    if (status === "Alive") {

        characterStatus.classList.add(
            "alive"
        );

        characterStatus.textContent =
            "● Alive";

    }

    else if (status === "Dead") {

        characterStatus.classList.add(
            "dead"
        );

        characterStatus.textContent =
            "● Dead";

    }

    else {

        characterStatus.textContent =
            "● Unknown";

    }

}


// ========================================
// SUCHFUNKTION
// ========================================

searchInput.addEventListener(
    "input",
    () => {

        const search =
            searchInput.value.trim();


        // Vorherigen Timer löschen
        clearTimeout(
            searchTimeout
        );


        // Suchfeld leer
        if (search === "") {

            renderCharacterList(
                characters
            );

            return;

        }


        // Kleine Verzögerung,
        // damit nicht bei jedem Tastendruck
        // sofort eine API-Anfrage kommt
        searchTimeout =
            setTimeout(
                () => searchCharactersFromAPI(search),
                300
            );

    }
);


// ========================================
// API-Suche
// ========================================

async function searchCharactersFromAPI(
    search
) {

    try {

        characterList.innerHTML = `
            <div class="loading">
                Suche läuft...
            </div>
        `;


        const results =
            await searchCharacters(
                search
            );


        renderCharacterList(
            results
        );


    } catch (error) {

        console.error(
            "Suchfehler:",
            error
        );


        characterList.innerHTML = `
            <div class="error">
                Suche konnte nicht durchgeführt werden.
            </div>
        `;

    }

}


// ========================================
// START
// ========================================

init();
