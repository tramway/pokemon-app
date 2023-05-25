import { Pokemon } from './pokemon';
import { Observable } from 'rxjs';

export abstract class PokemonService {

  abstract getPokemons(page: number): Observable<Array<Pokemon>>;

  abstract getPokemon(id: Pokemon['id']): Observable<Pokemon | undefined>;

  abstract getEvolutions(id: Pokemon['id']): Observable<Pokemon[] | undefined>;
}
