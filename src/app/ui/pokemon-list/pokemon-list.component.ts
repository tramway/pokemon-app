import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../domain/pokemon.service';
import { filter, Observable, of, switchMap, tap } from 'rxjs';
import { Pokemon } from '../../domain/pokemon';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectedPokemonService } from './selected-pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {

  public pokemons$: Observable<Pokemon[]> = of([]);

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private selectedPokemonService: SelectedPokemonService
  ) {
  }

  public ngOnInit(): void {
    // todo if page is refreshed on not first page - paginator is showing "1-10"
    this.pokemons$ = this.activatedRoute.queryParams
      .pipe(
        tap(queryParams => {
          if (queryParams['page']) {
            return;
          }
          this.router.navigate(
            [],
            {
              relativeTo: this.activatedRoute,
              queryParams: { page: 1 },
              queryParamsHandling: 'merge',
            }
          );
        }),
        filter(queryParams => queryParams['page']),
        // Here should go some validation of queryParam.page to be Number
        switchMap(queryParams => this.pokemonService.getPokemons(queryParams['page']))
      );
  }

  public changePage($event: PageEvent): void {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { page: $event.pageIndex },
        queryParamsHandling: 'merge',
      });
  }

  public openDetails(pokemon: Pokemon): void {
    this.selectedPokemonService.selectPokemon(pokemon);
    this.router.navigate(['details', pokemon.id], {
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'preserve',
    });
  }
}
