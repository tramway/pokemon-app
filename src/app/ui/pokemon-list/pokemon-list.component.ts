import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../domain/pokemon.service';
import { Observable, of } from 'rxjs';
import { Pokemon } from '../../domain/pokemon';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonListResolvedData } from './pokemon-list-data-resolver';

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
    this.activatedRoute.data.subscribe((data) => {
      const typedData: PokemonListResolvedData = data as PokemonListResolvedData;

      this.pokemons$ = this.pokemonService.get(typedData.pokemonList.page);
    });
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
