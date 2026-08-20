// ========================================
// DOM (jQuery-Selektoren)
// ========================================

const $characterList =
    $("#character-list");

const $searchInput =
    $("#search");

const $characterImage =
    $("#character-image");

const $characterName =
    $("#character-name");

const $characterStatus =
    $("#character-status");

const $characterSpecies =
    $("#character-species");

const $characterGender =
    $("#character-gender");

const $characterOrigin =
    $("#character-origin");

const $characterLocation =
    $("#character-location");

const $fileNumber =
    $("#file-number");

const speciesChartCanvas =
    document.getElementById("species-chart");


// ========================================
// Daten
// ========================================

let characters = [];

let currentList = [];

let searchTimeout;

let speciesChart = null;


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

    $characterList.html(`
        <div class="loading">
            Charaktere werden geladen...
        </div>
    `);

}


// ========================================
// Fehler
// ========================================

function showError() {

    $characterList.html(`
        <div class="error">
            Die Charaktere konnten nicht geladen werden.
        </div>
    `);

}


// ========================================
// Charakterliste
// ========================================

function renderCharacterList(list) {

    $characterList.empty();


    currentList = list;


    if (list.length === 0) {

        $characterList.html(`
            <div class="no-results">
                Keine Charaktere gefunden.
            </div>
        `);

        return;

    }


    // $.each() statt forEach() - iteriert
    // genauso über das Array, ist aber die
    // jQuery-eigene Variante davon

    $.each(list, function (index, character) {

        const $button =
            $("<button>")
                .addClass("character")
                .attr("data-id", character.id)
                .html(`
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
                `);


        $characterList.append($button);

    });

}


// ========================================
// Klick auf einen Charakter
//
// Event Delegation: der Handler hängt am
// Container (immer vorhanden), nicht an
// den einzelnen Buttons. Dadurch
// funktioniert der Klick auch für
// Buttons, die erst nach einer Suche neu
// erzeugt wurden.
// ========================================

$characterList.on("click", ".character", function () {

    const id =
        $(this).attr("data-id");

    const character =
        currentList.find(c => c.id == id);


    if (!character) {

        return;

    }


    // Traversierung via siblings(): den
    // geklickten Eintrag markieren und bei
    // allen Geschwistern die Markierung
    // entfernen

    $(this)
        .addClass("active")
        .siblings()
        .removeClass("active");


    showCharacter(character);

});


// ========================================
// E-Akte anzeigen
// ========================================

function showCharacter(character) {

    const $file =
        $(".file");


    // Effekt mit Callback-Methode: erst
    // ausblenden, DANACH (im Callback) die
    // Daten setzen und wieder einblenden -
    // so gibt es keinen kurzen "Flackerer"
    // mit den alten Daten

    $file.stop(true, true).fadeOut(150, function () {

        $characterImage
            .attr("src", character.image)
            .attr("alt", character.name);


        $characterName.text(
            character.name
        );

        $characterSpecies.text(
            character.species
        );

        $characterGender.text(
            character.gender
        );

        $characterOrigin.text(
            character.origin.name
        );

        $characterLocation.text(
            character.location.name
        );

        $fileNumber.text(
            `FILE #${String(character.id).padStart(4, "0")}`
        );


        updateStatus(character.status);


        $file.fadeIn(300);

    });

}


// ========================================
// Status
// ========================================

function updateStatus(status) {

    $characterStatus.removeClass(
        "alive dead"
    );


    if (status === "Alive") {

        $characterStatus
            .addClass("alive")
            .text("● Alive");

    }

    else if (status === "Dead") {

        $characterStatus
            .addClass("dead")
            .text("● Dead");

    }

    else {

        $characterStatus.text(
            "● Unknown"
        );

    }

}


// ========================================
// SUCHFUNKTION
// ========================================

$searchInput.on("input", function () {

    const search =
        $(this).val().trim();


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

});


// ========================================
// jQuery UI Tooltip
// ========================================

$(document).tooltip({
    items: "img[title], [title]"
});


// ========================================
// API-Suche
// ========================================

async function searchCharactersFromAPI(
    search
) {

    try {

        $characterList.html(`
            <div class="loading">
                Suche läuft...
            </div>
        `);


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


        $characterList.html(`
            <div class="error">
                Suche konnte nicht durchgeführt werden.
            </div>
        `);

    }

}


// ========================================
// Alle Charaktere laden
//
// Die API liefert Seiten à 20 Charaktere
// (info.pages). Seite 1 wird geladen, um
// die Gesamtzahl der Seiten zu erfahren,
// danach werden alle übrigen Seiten
// parallel nachgeladen.
// ========================================

async function getAllCharacters() {

    const firstPage =
        await getCharacters(1);

    const totalPages =
        firstPage.info.pages;

    let allResults =
        firstPage.results.slice();


    if (totalPages <= 1) {

        return allResults;

    }


    const pageRequests = [];


    for (let page = 2; page <= totalPages; page++) {

        pageRequests.push(
            getCharacters(page)
        );

    }


    // jQuerys jqXHR-Objekte sind
    // Promise-kompatibel, daher
    // funktioniert Promise.all() hier
    // genauso wie mit fetch()

    const pages =
        await Promise.all(pageRequests);


    pages.forEach(pageData => {

        allResults =
            allResults.concat(pageData.results);

    });


    return allResults;

}


// ========================================
// Spezien-Übersicht laden
//
// Lädt einmalig ALLE Charaktere der API
// und zeichnet danach das Radar-Chart.
// Läuft unabhängig von der Sidebar-Liste
// bzw. der Suche.
// ========================================

async function loadSpeciesOverview() {

    try {

        const allCharacters =
            await getAllCharacters();


        renderSpeciesChart(allCharacters);


        $("#chart-status").text(
            `${allCharacters.length} characters on file`
        );


    } catch (error) {

        console.error(
            "Fehler beim Laden der Spezien-Übersicht:",
            error
        );

        $("#chart-status").text(
            "Census unavailable."
        );

    }

}


// ========================================
// Spinnennetzdiagramm der Spezien
//
// Zählt, wie oft jede Spezies in der
// übergebenen Liste vorkommt, und
// zeichnet ein Radar-Chart via Chart.js.
// ========================================

function getSpeciesDistribution(list) {

    const counts = {};


    list.forEach(character => {

        const species =
            character.species || "Unknown";

        counts[species] =
            (counts[species] || 0) + 1;

    });


    return counts;

}


function renderSpeciesChart(list) {

    const counts =
        getSpeciesDistribution(list);

    const labels =
        Object.keys(counts);

    const data =
        Object.values(counts);


    // Chart nur einmal erzeugen, danach
    // nur noch die Daten aktualisieren

    if (speciesChart) {

        speciesChart.data.labels = labels;

        speciesChart.data.datasets[0].data = data;

        speciesChart.update();

        return;

    }


    speciesChart = new Chart(speciesChartCanvas, {

        type: "radar",

        data: {

            labels: labels,

            datasets: [{

                label: "Anzahl Charaktere",

                data: data,

                backgroundColor: "rgba(66, 184, 131, 0.2)",

                borderColor: "#42b883",

                pointBackgroundColor: "#42b883"

            }]

        },

        options: {

            responsive: true,

            color: "#1f2937",

            scales: {

                r: {

                    beginAtZero: true,

                    ticks: {
                        stepSize: 1,
                        color: "#4b5563",
                        backdropColor: "transparent"
                    },

                    grid: {
                        color: "#d9dee5"
                    },

                    angleLines: {
                        color: "#d9dee5"
                    },

                    pointLabels: {
                        color: "#1f2937",
                        font: {
                            size: 11
                        }
                    }

                }

            },

            plugins: {

                legend: {
                    labels: {
                        color: "#1f2937"
                    }
                }

            }

        }

    });

}


// ========================================
// START
//
// $(function(){...}) ist die
// Kurzschreibweise für
// $(document).ready(function(){...})
// ========================================

$(function () {

    init();

    loadSpeciesOverview();

});