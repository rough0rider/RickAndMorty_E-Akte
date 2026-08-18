const API_URL = "https://rickandmortyapi.com/api";


// ========================================
// Charaktere laden
// ========================================

async function getCharacters(page = 1) {

    const response = await fetch(
        `${API_URL}/character?page=${page}`
    );

    if (!response.ok) {

        throw new Error(
            `API Fehler: ${response.status}`
        );

    }

    return await response.json();
}


// ========================================
// Charakter suchen
// ========================================

async function searchCharacters(name) {

    const url =
        `${API_URL}/character/?name=${encodeURIComponent(name)}`;

    const response = await fetch(url);


    // Bei keiner Übereinstimmung
    // liefert die API 404
    if (response.status === 404) {

        return [];

    }


    if (!response.ok) {

        throw new Error(
            `API Fehler: ${response.status}`
        );

    }


    const data = await response.json();

    return data.results;
}


// ========================================
// Einzelnen Charakter laden
// ========================================

async function getCharacter(id) {

    const response = await fetch(
        `${API_URL}/character/${id}`
    );


    if (!response.ok) {

        throw new Error(
            `API Fehler: ${response.status}`
        );

    }


    return await response.json();
}
