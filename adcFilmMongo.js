import film from './src/film.js';
import { filme } from './src/listaFilms.js';
import './src/db.js';


async function AdcFilm() {
    for (const filmes of filme) {
        const filmName = filmes.name;
        const filmImage = filmes.img;
        await film.create({
            name: filmName,
            image: filmImage
        })
        console.log('Filme adicionado:', filmName);
    }
}

AdcFilm();