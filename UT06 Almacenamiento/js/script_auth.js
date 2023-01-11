"use strict";
import * as plantillas from "./plantillasFirebase.js";
import { app, autentificacion } from "./conexionFirebase.js";
import {
  getFirestore,
  collection,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

/** Importación de la biblioteca del servicio auth */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

window.onload = () => {
  let datos = document.getElementById("datos"); // Contenedor de datos.
  let informacion = document.getElementById("informacion"); // Contenedor de información.
  const db = getFirestore(app); // Enlace a la base de datos comppleta.
  const discentesColeccion = collection(db, "discentes"); // Enlace a la colección discentes.

  /**
   *  ************ Autentificación de usuarios **************
   *
   *   createUserWithEmailAndPassword  ->   Crea una cuenta de usuario nueva.
   *                                        Parámetros -> auth, usuario y contraseña.
   *   signInWithEmailAndPassword      ->   Inicia sesión.
   *                                        Parámetros -> auth, usuario y contraseña (existentes).
   *   signOut                         ->   Cierra sesión.
   *                                        Parámetros -> auth.
   *   onAuthStateChanged              ->   Crea un monitor (vigilante) sobre la sesión.
   *                                        Parámetros -> auth y manejador.
   **/

  // Función para crear nuevos usuarios.

  const crearUsuario = async (usuario, contra) => {
    try {
      const credenciales = await createUserWithEmailAndPassword(
        autentificacion,
        usuario,
        contra
      );
      // Se comprueba la estructura del nuevo objeto.
      console.log(credenciales);
    } catch (error) {
      informacion.innerHTML = `Ha habido un error: ${error.message}`;
    }
  };

  // Se añade crearUsuario al evento de un botón.

  document.getElementById("crear").addEventListener(
    "click",
    () => {
      crearUsuario(
        document.getElementById("usuario").value,
        document.getElementById("consigna").value
      );
    },
    false
  );

  // Función para iniciar sesión con un usuario existente (ejemplo con sintaxis then).

  const iniciarSesion = (usuario, contra) => {
    signInWithEmailAndPassword(autentificacion, usuario, contra)
      .then((credenciales) => {
        console.log("Sesión Iniciada");
        console.log(credenciales.user);
        informe.innerHTML = `Ficha del usuario:<br>
                            Correo: ${credenciales.user.email}<br>
                            Nombre: ${credenciales.user.displayName}<br>
                            Correo verificado: ${credenciales.user.emailVerified}`;
        obtenerDiscentesSnap();
      })
      .catch((error) => {
        informacion.innerHTML = `Ha habido un error: ${error.message}`;
      });
  };

  // Se añade iniciarSesion al evento clic del botón iniciar.

  document.getElementById("iniciar").addEventListener(
    "click",
    () => {
      iniciarSesion(
        document.getElementById("usuario").value,
        document.getElementById("consigna").value
      );
    },
    false
  );

  // Función para cerrar la sesión del usuario.

  const cerrarSesion = () => {
    try {
      autentificacion.signOut();
      datos.innerHTML = "<h3>No se ha iniciado sesión</h3>";
      informe.innerHTML = `Sesión cerrada.`;
    } catch (error) {
      informacion.innerHTML = `Ha habido un error: ${error.message}`;
    }
  };

  // Se añade iniciarSesion al evento clic del botón iniciar.

  document.getElementById("cerrar").addEventListener(
    "click",
    () => {
      cerrarSesion();
    },
    false
  );

  // Se crea un monitor sobre la sesión del usuario y se le vincula una función.

  /*  onAuthStateChanged(autentificacion, (usuario) => {
    if (usuario) {
      console.log(`Se ha iniciado sesión con el id: ${usuario.uid}`);
      informe.innerHTML = `Ficha del usuario:<br>
                            Correo: ${usuario.email}<br>
                            Nombre: ${usuario.displayName}<br>
                            Correo verificado: ${usuario.emailVerified}`;
      obtenerDiscentesSnap();
    } else {
      datos.innerHTML = "<h3>No se ha iniciado sesión</h3>";
      informe.innerHTML = `Sesión cerrada.`;
    }
  }); */

  // Función que crea un monitor sobre la colección de datos Discentes.

  const obtenerDiscentesSnap = async () => {
    // Se obtienen todos los documentos de la colección y se añade una función de callback.
    const discentesDocumentos = await onSnapshot(
      discentesColeccion,
      (coleccion) => {
        datos.innerHTML = "";
        coleccion.docs.map((documento) => {
          datos.innerHTML += plantillas.pintarDiscente(documento);
        });
      }
    );
  };
}; // Fin del window.onload.