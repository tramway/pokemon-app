import { Injectable } from '@angular/core';
import { PokemonService } from '../domain/pokemon.service';
import { Observable, of } from 'rxjs';
import { Pokemon, Pokemons } from '../domain/pokemon';

@Injectable({
  providedIn: 'root'
})
export class InMemoryPokemonService extends PokemonService {
  constructor(private pokemons: Pokemon[], private evolutions?: Pokemon[]) {
    super();
  }

  public getPokemons(): Observable<Pokemons> {
    return of({ count: this.pokemons.length, pokemons: this.pokemons });
  }

  public getPokemon(id: Pokemon['id']): Observable<Pokemon | undefined> {
    return of(this.pokemons.find(pokemon => pokemon.id === id));
  }

  public getEvolutions(id: Pokemon['id']): Observable<Pokemon[] | undefined> {
    return of(this.evolutions || []);
  }
}
