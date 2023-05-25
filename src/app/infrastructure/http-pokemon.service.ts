import { Injectable } from '@angular/core';
import { PokemonService } from '../domain/pokemon.service';
import { catchError, forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Pokemon } from '../domain/pokemon';
import { PokemonEvolution } from '../domain/pokemon-evolution';

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

interface EvolutionResponseChain {
  evolves_to: EvolutionResponseChain[],
  species: {
    name: 'bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon-species/1/'
  }
}

interface PokemonEvolutionResponse {
  chain: EvolutionResponseChain,
}

@Injectable()
export class HttpPokemonService extends PokemonService {
  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  // TODO make it cleaner
  public getPokemons(page: number): Observable<Pokemon[]> {
    return this.httpClient.get<{
      results: { name: string, url: string }[]
    }>(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${ page * 10 }`)
      .pipe(
        switchMap((rawPokemons: { results: { name: string, url: string }[] }) => {
          const pokemonDetailsRequests = rawPokemons.results.map(
            rawPokemon => this.getPokemonDetails(rawPokemon.name));
          return forkJoin(pokemonDetailsRequests);
        })
      );
  }

  public getPokemon(id: Pokemon['id']): Observable<Pokemon | undefined> {
    return this.httpClient.get<PokemonDetailsResponse>(`https://pokeapi.co/api/v2/pokemon/${ id }`)
      .pipe(
        map(rawDetails => ({
          id: rawDetails.id,
          url: `https://pokeapi.co/api/v2/pokemon/${ id }`,
          name: rawDetails.name,
          image: rawDetails.sprites.front_default,
          abilitiesNames: rawDetails.abilities.map(ability => ability.ability.name)
        }))
      );
  }

  public getEvolutions(id: Pokemon['id']): Observable<PokemonEvolution[] | undefined> {
    return this.httpClient.get<PokemonEvolutionResponse>(`https://pokeapi.co/api/v2/evolution-chain/${ id }`)
      .pipe(
        map(rawEvolutions => this.traverseEvolutions(rawEvolutions.chain)),
        switchMap(evolutionNames =>
          forkJoin(evolutionNames.map(name =>
            this.getPokemonDetails(name).pipe(map(details => ({
              name: details.name,
              image: details.image,
              url: details.url,
              id: details.id
            })))
          ))),
        catchError((err: any) => {
          if (err instanceof HttpErrorResponse && err.status == 404) {
            return of([]);
          }

          return throwError(err);
        })
      );
  }

  private getPokemonDetails(name: string): Observable<Pokemon> {
    return this.httpClient.get<PokemonDetailsResponse>(`https://pokeapi.co/api/v2/pokemon/${ name }`)
      .pipe(map(rawDetails => ({
        id: rawDetails.id,
        url: `https://pokeapi.co/api/v2/pokemon/${ name }/`,
        name: rawDetails.name,
        image: rawDetails.sprites.front_default,
        abilitiesNames: rawDetails.abilities.map(ability => ability.ability.name)
      } as Pokemon)));
  }

  private traverseEvolutions(evolutionChain: EvolutionResponseChain, evolutionNames: string[] = []): string[] {
    evolutionNames.push(evolutionChain.species.name);

    if (evolutionChain.evolves_to.length) {
      evolutionChain.evolves_to.forEach(evolves => this.traverseEvolutions(evolves, evolutionNames));
    }

    return evolutionNames;
  }
}
