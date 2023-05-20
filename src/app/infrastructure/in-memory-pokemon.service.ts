import { Injectable } from '@angular/core';
import { PokemonService } from '../domain/pokemon.service';
import { Observable, of } from 'rxjs';
import { Pokemon } from '../domain/pokemon';

@Injectable({
  providedIn: 'root'
})
export class InMemoryPokemonService extends PokemonService {
  private pokemons: Pokemon[];

  constructor(pokemons: Pokemon[]) {
    super();
    this.pokemons = pokemons;
  }

  public get(): Observable<Pokemon[]> {
    return of(this.pokemons);
  }
}
