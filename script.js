const d = document,
        $cardsContainer = d.querySelector(".grid-card-container"),
        $nav = d.querySelector("nav-container"),
        $loader = d.querySelector(".loader-container"),
        $fragment= d.createDocumentFragment();
const  $template = d.getElementById("template").content,
     card = $template.querySelector(".card"),
     cardImg = $template.querySelector(".card-img"),
     cardTitle = $template.querySelector(".card-title"),
     cardText = $template.querySelector(".card-text"),
     cardPrice = $template.querySelector(".card-price");

let pokeAPI = "https://pokeapi.co/api/v2/pokemon/";

async function loadPokemon(url) {
    $cardsContainer.innerHTML = "";
    try {
        $loader.style.display = "flex";
        let res = await fetch(url);
        let json = await res.json(),
            $prevLink = d.getElementById("prev-btn"),
            $nextLink = d.getElementById("next-btn");
        console.log(json)
        if (json.previous) {
            $prevLink.style.display = "inline-block";
            $prevLink.setAttribute("href", json.previous)
        } else {
            $prevLink.style.display = "none";
        }
        if (json.next) {
            $nextLink.style.display = "inline-block";
            $nextLink.setAttribute("href", json.next)
        } else {
            $nextLink.style.display = "none";
        }
        if (!res.ok) throw{status: res.status, statusText: res.statusText}
        for (let i = 0; i < json.results.length; i++) {
            try {
                let res = await fetch(json.results[i].url),
                    pokemon = await res.json();
                if (!res.ok) throw{status: res.status, statusText: res.statusText}
                cardImg.setAttribute("src", pokemon.sprites.front_default);
                cardImg.setAttribute("alt", pokemon.name);
                cardTitle.textContent = pokemon.name.toUpperCase();
                $fragment.appendChild($template.cloneNode(true));
            } catch (err) {
                console.log(err);
                cardTitle.textContent = "Pokemon no encontrado";
                $fragment.appendChild($template.cloneNode(true));
            }
            $cardsContainer.appendChild($fragment)
        }
    } catch (err) {
        console.log(err)
        let message = err.statusText || "Ocurrió un error";
        $main.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
    } finally {
        $loader.style.display = "none";
    }
}

d.addEventListener("DOMContentLoaded", e => loadPokemon(pokeAPI));

d.addEventListener("click", e => {
    if (e.target.matches(".nav-btn")) {
        e.preventDefault()
        loadPokemon(e.target.href)
    }
})

