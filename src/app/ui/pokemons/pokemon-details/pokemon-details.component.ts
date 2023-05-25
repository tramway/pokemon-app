import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../../../domain/pokemon';
import { Observable, switchMap } from 'rxjs';
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
    private pokemonService: PokemonService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  public ngOnInit(): void {
    this.pokemon$ = this.activatedRoute.params.pipe(switchMap((params) => this.pokemonService.getPokemon(Number(params['id']))));

    this.pokemonEvolutions$ = this.activatedRoute.params.pipe(
      switchMap((params) => this.pokemonService.getEvolutions(Number(params['id']))),
    );
  }

  public goBack(): void {
    this.router.navigate(['/pokemons'], { queryParamsHandling: 'preserve' });
  }

  public openDetails(evolution: PokemonEvolution): void {
    this.router.navigate([`/pokemons/details/${ evolution.id }`], {
      queryParamsHandling: 'merge'
    });
  }
}
