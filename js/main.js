import { escribir } from "./escritura.js";
import { imagenes_staticas, poemas } from "./constantes.js";

export const textoContainer = document.querySelector(".textoContainer");
//export const columnas = document.querySelectorAll(".column");
const row = document.querySelector(".row");
const fondo = document.querySelector("body");
const pantalla1 = document.querySelector(".contenido");
const pantalla2 = document.querySelector(".contenedor-slider");
let contenedorPoema = document.getElementById("contenedorPoema");

contenedorPoema.style.color = "whitesmoke";
const footer = document.querySelector(".footer");

const anchoVentana = window.innerWidth;
const altoVentana = window.innerHeight;

const cerrar = document.querySelector('.btn-cerrar');

cerrar.addEventListener('click', () => {
    cerrarPantalla();
});

function cerrarPantalla() {
    write = false;
    console.log("hola");
    contenedorPoema.innerHTML = "";
    pantalla2.style.display = 'none';
    pantalla1.style.display = 'flex';
    textoContainer.style.display = '';
    footer.style.display = 'flex';
    cerrar.style.display = 'none';
}




let indiceInicial = 0;
let cartas = [];
const columnas = preparar_contenido(anchoVentana);
const numColumnas = columnas.length;

escribir();
mostrar_imagenes(0);


function preparar_contenido(anchoVentana){

    if(anchoVentana <= 780) {
        let index = 1;
        colocar_columnas(index);
        const columns = document.querySelectorAll(".column");

        return columns;
    } else if (anchoVentana > 780 && anchoVentana <= 1200) {
        let index = 2;
        colocar_columnas(index);
        const columns = document.querySelectorAll(".column");

        return columns;
    } else {
        let index = 3;
        colocar_columnas(index);
        const columns = document.querySelectorAll(".column");

        return columns;
    }

}

function colocar_columnas( numColumnas) {
    for(let i = 0; i < numColumnas; i++) {
        row.innerHTML += `<div class="column" data-carta="carta1"></div>`;
    }
}


document.body.addEventListener("wheel", (event) => {
    if (event.deltaY < 0) {
        // La rueda se desplaza hacia arriba
        mostrar_imagenes(-1);
    } else if (event.deltaY > 0) {
        // La rueda se desplaza hacia abajo
        mostrar_imagenes(1);
    }

});

function mostrar_imagenes(desplazamiento) {
    // Actualizar el índiceInicial según el desplazamiento
    indiceInicial += desplazamiento * numColumnas;

    // Asegurarse de que el índice se encuentre en el rango correcto
    if (indiceInicial < 0) {
        indiceInicial = Math.floor(imagenes_staticas.length / numColumnas) * numColumnas;
    } else if (indiceInicial >= imagenes_staticas.length) {
        indiceInicial = 0;
    }

    // Asignar las imágenes correspondientes a las columnas
    for (let i = 0; i < numColumnas; i++) {
        const indiceImagen = (indiceInicial + i) % imagenes_staticas.length;
        columnas[i].innerHTML = `<img src="${imagenes_staticas[indiceImagen]}" class="card" alt="">`;
        cartas.push(columnas[i]);
    }
}


// Selecciona el documento completo para escuchar los eventos táctiles
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

let startY;

function handleTouchStart(event) {
    // Obtiene la posición inicial del toque
    startY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!startY) {
        return;
    }

    let currentY = event.touches[0].clientY;

    // Calcula la distancia recorrida
    let distance = currentY - startY;

    // Puedes ajustar este umbral según tus necesidades
    if (distance > 3) {
        // Aquí puedes ejecutar acciones cuando se desliza hacia abajo
        mostrar_imagenes(1);
    }

    if (distance < 3) {
        // Aquí puedes ejecutar acciones cuando se desliza hacia abajo
        mostrar_imagenes(-1);
    }

    // Reinicia la posición inicial
    startY = null;
}

let write;

cartas.forEach( (item) => {
    item.addEventListener('mouseover', () => {
        const img = item.querySelector("img");
        const imgUrl = img.src;
        // document.body.style.backgroundImage = `url(${imgUrl})`;
        fondo.style.backgroundImage = `url(${imgUrl})`;
            cartas.forEach((otherItem) => {
            if(otherItem !== item) {
                otherItem.classList.add('notSelected');
            }
        });
        // playRandom();
        // reproducirCancion();
    });

    item.addEventListener('mouseout', () => {
        // document.body.style.backgroundImage = '';
        fondo.style.backgroundImage = '';
        cartas.forEach((otherItem) => {
            if(otherItem !== item) {
                otherItem.classList.remove('notSelected');
            }
        });
        // stopSong();
        // detenerCancion();
      });

    item.addEventListener('click', () => {
        fondo.style.background = '';
        pantalla1.style.display = 'none';
        textoContainer.style.display = 'none';
        pantalla2.style.display = 'flex';
        cerrar.style.display = 'block';
        const muestra = pantalla2.querySelector("img");
        const img = item.querySelector("img");

        muestra.src = img.src;
        if(anchoVentana <= 780) {
            contenedorPoema.remove();
            pantalla2.innerHTML += `<div id="contenedorPoema" class="contenedorPoema"></div>`;
            contenedorPoema = document.getElementById("contenedorPoema");
            contenedorPoema.classList.add('contenedorPoema');
            contenedorPoema.style.color = "whitesmoke";
        }

        contenedorPoema.innerHTML = " ";
        const imgSrc = img.getAttribute('src');
        const indice = imagenes_staticas.findIndex(src => src === imgSrc);
        footer.style.display = 'none';
        write = true;
        escribirPoema(poemas[indice], 0, 0);
    });
});

function escribirPoema(poema, indiceOracion, indiceCaracter) {
    const oracion = poema[indiceOracion];

    if (!write) return;
    if (indiceOracion < poema.length) {
        if (indiceCaracter < oracion.length) {
            contenedorPoema.innerHTML += oracion.charAt(indiceCaracter);
            setTimeout(function() {
                escribirPoema(poema, indiceOracion, indiceCaracter + 1);
            }, 5); // Velocidad de escritura ajustable
        } else {
            contenedorPoema.innerHTML += "<br>"; // Agregar salto de línea al final de la oración
            setTimeout(function() {
                escribirPoema(poema, indiceOracion + 1, 0); // Pasar a la siguiente oración
            }, 6); // Retraso antes de pasar a la siguiente oración
        }
    } else {
        write = false;
    }
}



window.addEventListener('popstate', function(event) {
    // Aquí puedes manejar lo que sucede cuando el usuario presiona el botón de "volver atrás"
    console.log('Se ha presionado el botón de volver atrás');
    
    // Por ejemplo, puedes cerrar una pantalla o realizar alguna acción específica
    cerrarPantalla(); // Llama a tu función de cerrar pantalla definida anteriormente
});