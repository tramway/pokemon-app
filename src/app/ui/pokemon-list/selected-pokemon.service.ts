import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Pokemon } from '../../domain/pokemon';

@Injectable()
export class SelectedPokemonService {

  private selectedPokemon$: ReplaySubject<Pokemon> = new ReplaySubject<Pokemon>(1);

  public getPokemon(): Observable<Pokemon> {
    return this.selectedPokemon$.asObservable();
  }

  public selectPokemon(pokemon: Pokemon): void {
    this.selectedPokemon$.next(pokemon);
  }
}
