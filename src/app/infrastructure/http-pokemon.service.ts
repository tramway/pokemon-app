import { Injectable } from '@angular/core';
import { PokemonService } from '../domain/pokemon.service';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from './http-response';
import { Pokemon } from '../domain/pokemon';

// I could've use wrapper library like https://github.com/Gabb-c/pokenode-ts but I decided to show my approach to situations
// when there is no such wrapper library
interface PokemonDetailsResponse {
  id: number;
  name: string;
  sprites: { front_default: string };
  abilities: {
    ability: {
      name: string,
    },
  }[],
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
  public getPokemons(page: number): Observable<Pokemon[]> {
    return this.httpClient.get<HttpResponse>(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${ page * 10 }`)
      .pipe(
        switchMap((rawPokemons: HttpResponse) => {
          const pokemonDetailsRequests = rawPokemons.results.map(
            rawPokemon => this.httpClient.get<PokemonDetailsResponse>(rawPokemon.url)
              .pipe(map(rawDetails => ({
                id: rawDetails.id,
                url: rawPokemon.url,
                name: rawPokemon.name,
                image: rawDetails.sprites.front_default,
                abilitiesNames: rawDetails.abilities.map(ability => ability.ability.name)
              } as Pokemon))));
          return forkJoin(pokemonDetailsRequests);
        })
      );
  }

  public getPokemon(id: Pokemon['id']): Observable<Pokemon | undefined> {
    return this.httpClient.get<PokemonDetailsResponse>(`https://pokeapi.co/api/v2/pokemon/${ id }`)
      .pipe(map(rawDetails => ({
        id: rawDetails.id,
        url: `https://pokeapi.co/api/v2/pokemon/${ id }`,
        name: rawDetails.name,
        image: rawDetails.sprites.front_default,
        abilitiesNames: rawDetails.abilities.map(ability => ability.ability.name)
      })));
  }
}
