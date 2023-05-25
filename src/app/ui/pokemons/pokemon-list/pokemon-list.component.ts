import { Component, OnInit } from '@angular/core';
import { filter, Observable, of, switchMap, tap } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Pokemon } from '../../../domain/pokemon';
import { PokemonService } from '../../../domain/pokemon.service';

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
    this.router.navigate(['details', pokemon.id], {
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'preserve',
    });
  }
}
