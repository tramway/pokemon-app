import { Pokemon } from './pokemon';
import { Observable } from 'rxjs';

export abstract class PokemonService {

  abstract get(): Observable<Array<Pokemon>>;

}
