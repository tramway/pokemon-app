import { Injectable } from '@angular/core';
import { PokemonService } from '../domain/pokemon.service';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from './http-response';
import { Pokemon } from '../domain/pokemon';

interface PokemonDetailsResponse {
  sprites: { front_default: string };
}

@Injectable({
  providedIn: 'root'
})
export class HttpPokemonService extends PokemonService {
  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  // TODO make it cleaner
  public get(page: number): Observable<Pokemon[]> {
    return this.httpClient.get<HttpResponse>(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${ page * 10 }`)
      .pipe(
        switchMap((rawPokemons: HttpResponse) => {
          const pokemonDetailsRequests = rawPokemons.results.map(
            rawPokemon => this.httpClient.get<PokemonDetailsResponse>(rawPokemon.url)
              .pipe(map(rawDetails => ({
                url: rawPokemon.url,
                name: rawPokemon.name,
                image: rawDetails.sprites.front_default
              }))));
          return forkJoin(pokemonDetailsRequests);
        })
      );
  }
}
