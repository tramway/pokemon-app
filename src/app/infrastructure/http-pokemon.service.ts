import { Injectable } from '@angular/core';
import { PokemonService } from '../domain/pokemon.service';
import { Pokemon } from '../domain/pokemon';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from './http-response';

@Injectable({
  providedIn: 'root'
})
export class HttpPokemonService extends PokemonService {
  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  public get(): Observable<Pokemon[]> {
    return this.httpClient.get<HttpResponse>('https://pokeapi.co/api/v2/pokemon?limit=20&offset=20').pipe(
      map((rawPokemons: HttpResponse) => rawPokemons.results.map(rawPokemon => ({
        id: rawPokemon.id,
        name: rawPokemon.name
      })))
    );
  }
}
