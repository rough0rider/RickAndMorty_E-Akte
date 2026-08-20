const API_URL = "https://rickandmortyapi.com/api";


// ========================================
// Charaktere laden
// ========================================

function getCharacters(page = 1) {

    // $.ajax() liefert ein jqXHR-Objekt zurück,
    // das sich wie ein Promise verhält und
    // daher ganz normal mit await abgewartet
    // werden kann.

    return $.ajax({

        url: `${API_URL}/character`,

        method: "GET",

        data: {
            page: page
        },

        dataType: "json"

    });

}


// ========================================
// Charakter suchen
// ========================================

function searchCharacters(name) {

    // $.getJSON() ist die Kurzschreibweise für
    // $.ajax mit method: "GET" und
    // dataType: "json"

    const deferred = $.Deferred();


    $.getJSON(

        `${API_URL}/character/`,

        {
            name: name
        }

    )

        .done(data => {

            deferred.resolve(data.results);

        })

        .fail(jqXHR => {

            // Bei keiner Übereinstimmung
            // liefert die API 404

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

    return $.ajax({

        url: `${API_URL}/character/${id}`,

        method: "GET",

        dataType: "json"

    });

}