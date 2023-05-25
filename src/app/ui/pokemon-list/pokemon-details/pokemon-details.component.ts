import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../../../domain/pokemon';
import { Observable, of, race, shareReplay, switchMap } from 'rxjs';
import { SelectedPokemonService } from '../selected-pokemon.service';
import { PokemonService } from '../../../domain/pokemon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonEvolution } from '../../../domain/pokemon-evolution';

@Component({
  selector: 'app-pokemon-details',
  templateUrl: './pokemon-details.component.html',
  styleUrls: ['./pokemon-details.component.scss']
})
export class PokemonDetailsComponent implements OnInit {

  public pokemon$: Observable<Pokemon | undefined> | undefined;
  public pokemonEvolutions$: Observable<PokemonEvolution[] | undefined> | undefined;

  constructor(
    private selectedPokemonService: SelectedPokemonService,
    private pokemonService: PokemonService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  public ngOnInit(): void {
    this.pokemon$ = race([
      this.selectedPokemonService.getPokemon(),
      this.pokemonService.getPokemon(Number(this.activatedRoute.snapshot.params['id']))
    ]).pipe(shareReplay(1));

    this.pokemonEvolutions$ = this.pokemon$.pipe(
      switchMap((pokemon) => pokemon ? this.pokemonService.getEvolutions(pokemon.id) : of([])),
    );
  }

  // todo go back should be absolute
  public goBack(): void {
    this.router.navigate(['../'], { queryParamsHandling: 'preserve' });
  }
}
