import {  rederizarInitialFilm, SearchFilmes, buscarFilms  } from "./src/rendfilm";
import { loginUser, registerUser } from "./src/script";
import { carrosselImg } from "./carrossel";

if (window.location.href.includes("films.html")) {
  SearchFilmes();
}

if (window.location.href.includes("index.html")) {
  rederizarInitialFilm();
}

if (window.location.href.includes("register.html")) {
  registerUser();
}

if (window.location.href.includes("login.html")) {
  loginUser();
  carrosselImg();
}

buscarFilms()





