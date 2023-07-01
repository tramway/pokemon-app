import { TestBed } from '@angular/core/testing';

import { HttpPokemonService } from './http-pokemon.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Pokemon } from '../domain/pokemon';

describe('HttpPokemonService', () => {
  let service: HttpPokemonService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpPokemonService]
    });
    service = TestBed.inject(HttpPokemonService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should fetch list of pokemons and details', (done) => {
    service.getPokemons(1).subscribe(pokemons => {
      const expected = {
        count: 2,
        pokemons: [
          jasmine.objectContaining({
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur/',
            image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/bulbasaur.png',
            abilitiesNames: ['bulbasaur-ability']
          }),
          jasmine.objectContaining({
            name: 'pikachu',
            url: 'https://pokeapi.co/api/v2/pokemon/pikachu/',
            image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/pikachu.png',
            abilitiesNames: ['pikachu-ability']
          }),
        ]
      };
      expect(pokemons).toEqual(expected);
      done();
    });

    const pokemonsListRequest = httpTestingController.expectOne
    ((req) => req.url.startsWith('https://pokeapi.co/api/v2/pokemon') && req.method === 'GET');
    pokemonsListRequest.flush(pokemonsListResponse());

    const bulbasaurDetailsRequest = httpTestingController.expectOne
    ((req) => req.url.startsWith('https://pokeapi.co/api/v2/pokemon/bulbasaur') && req.method === 'GET');
    bulbasaurDetailsRequest.flush(pokemonDetailsResponse('bulbasaur'));

    const pikachuDetailsRequest = httpTestingController.expectOne
    ((req) => req.url.startsWith('https://pokeapi.co/api/v2/pokemon/pikachu') && req.method === 'GET');
    pikachuDetailsRequest.flush(pokemonDetailsResponse('pikachu'));

    httpTestingController.verify();
  });

  it('should fetch recursive tree of evolutions and flat it', (done) => {
    service.getEvolutions(1).subscribe(pokemons => {
      const expected: Pokemon[] = [
        {
          id: 1,
          name: 'bulbasaur',
          url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur/',
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/bulbasaur.png',
          abilitiesNames: ['bulbasaur-ability']
        },
        {
          id: 1,
          name: 'ivysaur',
          url: 'https://pokeapi.co/api/v2/pokemon/ivysaur/',
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/ivysaur.png',
          abilitiesNames: ['ivysaur-ability']
        },
        {
          id: 1,
          name: 'venusaur',
          url: 'https://pokeapi.co/api/v2/pokemon/venusaur/',
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/venusaur.png',
          abilitiesNames: ['venusaur-ability']
        }
      ];
      expect(pokemons).toEqual(expected);
      done();
    });

    const evolutionsRequest = httpTestingController.expectOne
    ((req) => req.url.startsWith('https://pokeapi.co/api/v2/evolution-chain') && req.method === 'GET');
    evolutionsRequest.flush(pokemonEvolutions());

    const detailsRequest = httpTestingController.match((req) => req.url.startsWith('https://pokeapi.co/api/v2/pokemon/') && req.method === 'GET');
    detailsRequest[0].flush(pokemonDetailsResponse('bulbasaur'));
    detailsRequest[1].flush(pokemonDetailsResponse('ivysaur'));
    detailsRequest[2].flush(pokemonDetailsResponse('venusaur'));

    httpTestingController.verify();
  });

});

function pokemonsListResponse() {
  return {
    count: 2,
    next: 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=1',
    previous: null,
    results: [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }
    ]
  };
}

function pokemonDetailsResponse(name: string) {
  return {
    abilities: [
      {
        ability: {
          name: `${ name }-ability`,
        },
      },
    ],
    id: 1,
    name: name,
    species: {
      name: name,
    },
    sprites: {
      front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${ name }.png`,
    }
  };
}

function pokemonEvolutions() {
  return {
    id: 1,
    chain: {
      evolution_details: [],
      evolves_to: [
        {
          evolves_to: [
            {
              evolves_to: [],
              species: {
                name: 'venusaur',
                url: 'https://pokeapi.co/api/v2/pokemon-species/3/'
              }
            }
          ],
          species: {
            name: 'ivysaur',
            url: 'https://pokeapi.co/api/v2/pokemon-species/2/'
          }
        }
      ],
      species: {
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon-species/1/'
      }
    }
  };
}
