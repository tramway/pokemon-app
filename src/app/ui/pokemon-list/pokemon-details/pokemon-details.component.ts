import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../../../domain/pokemon';
import { Observable, race } from 'rxjs';
import { SelectedPokemonService } from '../selected-pokemon.service';
import { PokemonService } from '../../../domain/pokemon.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss']
})
export class PokemonDetailsComponent implements OnInit {

  public pokemon$: Observable<Pokemon | undefined> | undefined;

  constructor(
    private selectedPokemonService: SelectedPokemonService,
    private pokemonService: PokemonService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  public ngOnInit(): void {
    this.pokemon$ = race([
      this.selectedPokemonService.getPokemon(),
      this.pokemonService.getPokemon(Number(this.activatedRoute.snapshot.params['id']))
    ]);
  }
}
