import { poema } from "./constantes.js";
import { textoContainer } from "./main.js";

let index = 0
export function escribir() {
    escribirIntroduccion(poema[index], 0)
}

export function escribirIntroduccion(oracion, indiceCaracter) {
    if (indiceCaracter < oracion.length) {
        textoContainer.textContent += oracion.charAt(indiceCaracter);
        setTimeout(function() {
            escribirIntroduccion(oracion, indiceCaracter + 1);
        }, 100);
    } else {
        setTimeout(function() {
        borrarPoema(oracion);
        }, 2000);
    }
}

function borrarPoema(oracion) {
    if (textoContainer.textContent === oracion) {
        setTimeout(function() {
        textoContainer.textContent = "";
        index = (index + 1) % poema.length;
        escribirIntroduccion(poema[index], 0);
        }, 2000);
    } else if (textoContainer.textContent.length > 0) {
        setTimeout(function() {
        textoContainer.textContent = textoContainer.textContent.slice(0, -1);
        borrarPoema(oracion);
        }, 100);
    } else {
        setTimeout(function() {
        borrarPoema(oracion);
        }, 100);
    }
}

