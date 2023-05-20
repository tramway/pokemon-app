import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../domain/pokemon.service';
import { Observable, of } from 'rxjs';
import { Pokemon } from '../../domain/pokemon';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {

  public pokemons$: Observable<Pokemon[]> = of([]);

  constructor(
    private pokemonService: PokemonService
  ) {
  }

  public ngOnInit(): void {
    this.pokemons$ = this.pokemonService.get();
  }


}
