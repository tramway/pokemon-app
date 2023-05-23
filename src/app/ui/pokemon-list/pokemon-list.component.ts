import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../domain/pokemon.service';
import { filter, Observable, of, switchMap, tap } from 'rxjs';
import { Pokemon } from '../../domain/pokemon';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {

  public pokemons$: Observable<Pokemon[]> = of([]);

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  public ngOnInit(): void {
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
        switchMap(queryParams => this.pokemonService.get(queryParams['page']))
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
}
