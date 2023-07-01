import { Pokemon, Pokemons } from './pokemon';
import { Observable } from 'rxjs';

export abstract class PokemonService {

  abstract getPokemons(page: number): Observable<Pokemons>;

  abstract getPokemon(id: Pokemon['id']): Observable<Pokemon | undefined>;

  abstract getEvolutions(id: Pokemon['id']): Observable<Pokemon[] | undefined>;
}
