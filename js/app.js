// ========================================
// DOM (jQuery-Selektoren)
// ========================================

const $characterList =
    $("#character-list");

const $searchInput =
    $("#search");

const $searchField =
    $("#search-field");

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

const genderChartCanvas =
    document.getElementById("gender-chart");

const originChartCanvas =
    document.getElementById("origin-chart");

const locationChartCanvas =
    document.getElementById("location-chart");


// ========================================
// Daten
// ========================================

let characters = [];

let currentList = [];

let searchTimeout;

let fullCharacterIndex = [];


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
//
// "Name" läuft wie bisher über die API.
// Alle anderen Felder filtern lokal gegen
// den Gesamtbestand (fullCharacterIndex),
// da die API Origin/Last Seen ohnehin
// nicht als Suchparameter unterstützt.
// ========================================

$searchInput.on("input", performSearch);

$searchField.on("change", performSearch);


function performSearch() {

    const term =
        $searchInput.val().trim();

    const field =
        $searchField.val();


    // Vorherigen Timer löschen
    clearTimeout(
        searchTimeout
    );


    // Suchfeld leer
    if (term === "") {

        renderCharacterList(
            characters
        );

        return;

    }


    if (field === "name") {

        // Kleine Verzögerung,
        // damit nicht bei jedem Tastendruck
        // sofort eine API-Anfrage kommt
        searchTimeout =
            setTimeout(
                () => searchCharactersFromAPI(term),
                300
            );

        return;

    }


    searchTimeout =
        setTimeout(
            () => filterByField(field, term),
            150
        );

}


// ========================================
// Lokale Filterung
//
// Durchsucht den bereits geladenen
// Gesamtbestand nach File-Nr., Species,
// Sex, Origin oder Last Seen.
// ========================================

function filterByField(field, term) {

    if (fullCharacterIndex.length === 0) {

        $characterList.html(`
            <div class="loading">
                Gesamtbestand wird noch geladen...
            </div>
        `);

        return;

    }


    const lowerTerm =
        term.toLowerCase();


    const results =
        fullCharacterIndex.filter(character => {

            switch (field) {

                case "id":
                    return String(character.id).includes(lowerTerm);

                case "species":
                    return character.species.toLowerCase().includes(lowerTerm);

                case "gender":
                    return character.gender.toLowerCase().includes(lowerTerm);

                case "origin":
                    return character.origin.name.toLowerCase().includes(lowerTerm);

                case "location":
                    return character.location.name.toLowerCase().includes(lowerTerm);

                default:
                    return false;

            }

        });


    renderCharacterList(results);

}


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
// Übersichts-Diagramme laden
//
// Lädt einmalig ALLE Charaktere der API,
// speichert sie für die lokale Suche
// (fullCharacterIndex) und zeichnet
// danach vier Radar-Charts (Species, Sex,
// Origin, Last Seen). Läuft unabhängig
// von der Sidebar-Liste bzw. der Suche.
// ========================================

async function loadOverviewCharts() {

    try {

        const allCharacters =
            await getAllCharacters();

        fullCharacterIndex =
            allCharacters;


        const speciesDist =
            getDistribution(allCharacters, c => c.species);

        renderSpeciesChart(
            speciesDist.labels,
            speciesDist.data
        );


        const genderDist =
            getDistribution(allCharacters, c => c.gender);

        renderGenderChart(
            genderDist.labels,
            genderDist.data
        );


        const originDist =
            getDistribution(allCharacters, c => c.origin.name);

        renderOriginChart(
            originDist.labels,
            originDist.data
        );


        const locationDist =
            getDistribution(allCharacters, c => c.location.name);

        renderLocationChart(
            locationDist.labels,
            locationDist.data
        );


        $("#chart-status").text(
            `${allCharacters.length} characters on file`
        );


    } catch (error) {

        console.error(
            "Fehler beim Laden der Übersichts-Diagramme:",
            error
        );

        $("#chart-status").text(
            "Census unavailable."
        );

    }

}


// ========================================
// Verteilung berechnen
//
// Zählt, wie oft jeder Wert (via keyFn)
// in der Liste vorkommt, sortiert absteigend
// nach Häufigkeit und begrenzt auf die
// Top-Einträge - sonst wird das Diagramm
// bei Feldern mit vielen unterschiedlichen
// Werten (z. B. Origin) unleserlich.
// ========================================

function getDistribution(list, keyFn, limit = 10) {

    const counts = {};


    list.forEach(character => {

        const key =
            keyFn(character) || "Unknown";

        counts[key] =
            (counts[key] || 0) + 1;

    });


    const sorted =
        Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit);


    return {

        labels: sorted.map(entry => entry[0]),

        data: sorted.map(entry => entry[1])

    };

}


// ========================================
// Radar-Chart-Fabrik
//
// Erzeugt für ein Canvas-Element eine
// Render-Funktion, die das Chart beim
// ersten Aufruf erstellt und danach nur
// noch die Daten aktualisiert. So teilen
// sich alle vier Diagramme dieselbe
// Chart.js-Konfiguration.
// ========================================

function createRadarRenderer(canvasElement, datasetLabel) {

    let chartInstance = null;


    return function (labels, data) {

        if (chartInstance) {

            chartInstance.data.labels = labels;

            chartInstance.data.datasets[0].data = data;

            chartInstance.update();

            return;

        }


        chartInstance = new Chart(canvasElement, {

            type: "radar",

            data: {

                labels: labels,

                datasets: [{

                    label: datasetLabel,

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

    };

}


const renderSpeciesChart =
    createRadarRenderer(speciesChartCanvas, "Anzahl Charaktere");

const renderGenderChart =
    createRadarRenderer(genderChartCanvas, "Anzahl Charaktere");

const renderOriginChart =
    createRadarRenderer(originChartCanvas, "Anzahl Charaktere");

const renderLocationChart =
    createRadarRenderer(locationChartCanvas, "Anzahl Charaktere");


// ========================================
// START
//
// $(function(){...}) ist die
// Kurzschreibweise für
// $(document).ready(function(){...})
// ========================================

$(function () {

    init();

    loadOverviewCharts();

});