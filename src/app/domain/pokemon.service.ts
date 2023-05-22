import { Pokemon } from './pokemon';
import { Observable } from 'rxjs';

export abstract class PokemonService {

  abstract get(page: number): Observable<Array<Pokemon>>;

}
