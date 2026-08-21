const API_URL = "https://rickandmortyapi.com/api";


// ========================================
// Charaktere laden
// ========================================

// Holt eine Seite Charaktere von der API (20 pro Seite). page = 1, falls kein
// Wert übergeben wird
function getCharacters(page = 1) {

    //$.ajax() schickt die Anfrage im Hintergrund (kein Neuladen der Seite)
    return $.ajax({
        url: `${API_URL}/character`,
        // "GET" = nur Daten abholen
        method: "GET",
        // {page} wird automatisch zu "?page=2" in der URL
        data: {
            page: page
        },
        // "json" wandelt die Antwort automatisch in ein JS-Objekt um
        dataType: "json"
    });
}


// ========================================
// Charakter suchen
// ========================================

function searchCharacters(name) {

    const deferred = $.Deferred();

    // Kurzform von $.ajax() für GET-Anfragen mit JSON-Antwort
    $.getJSON(
        `${API_URL}/character/`,
        {
            // {name: name} wird automatisch zu "?name=..." in der URL
            name: name
        }
    )
    // "done" und "fail" sind die beiden möglichen Ergebnisse der Anfrage
    // und abhängig vom Ergebnis wird entweder die "resolve"- oder 
    // "reject"-Funktion (404) des Deferred-Objekts aufgerufen
        .done(data => {
            deferred.resolve(data.results);
        })
        .fail(jqXHR => {
            // Bei keiner Übereinstimmung liefert die API Error 404
            if (jqXHR.status === 404) {
                deferred.resolve([]);
            } else {
                deferred.reject(jqXHR);
            }
        });

    return deferred.promise();
}


// ========================================
// Einzelnen Charakter laden
// ========================================

function getCharacter(id) {

    //$.ajax() schickt die Anfrage im Hintergrund (kein Neuladen der Seite)
    return $.ajax({
        url: `${API_URL}/character/${id}`,
        // "GET" = nur Daten abholen
        method: "GET",
        // "json" wandelt die Antwort automatisch in ein JS-Objekt um
        dataType: "json"
    });
}