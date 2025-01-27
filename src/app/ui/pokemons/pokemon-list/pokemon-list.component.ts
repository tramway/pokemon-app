import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { filter, Observable, switchMap, tap } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Pokemon, Pokemons } from '../../../domain/pokemon';
import { PokemonService } from '../../../domain/pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonListComponent implements OnInit {

  public pokemons$: Observable<Pokemons>|undefined;
  public pageIndex: number = 0;

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  public ngOnInit(): void {
    this.pokemons$ = this.activatedRoute.queryParams
      .pipe(
        tap(queryParams => {
          if(queryParams['page']) {
            return;
          }
          this.router.navigate(
            [],
            {
              relativeTo: this.activatedRoute,
              queryParams: { page: 0 },
              queryParamsHandling: 'merge',
            }
          );
        }),
        filter(queryParams => queryParams['page']),
        switchMap(queryParams => {
          this.pageIndex = Number(queryParams['page']);
          return this.pokemonService.getPokemons(queryParams['page']);
        })
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
