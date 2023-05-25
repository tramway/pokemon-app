import { TestBed } from '@angular/core/testing';

import { HttpPokemonService } from './http-pokemon.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { PokemonEvolution } from '../domain/pokemon-evolution';

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
      const expected = [
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
      ];
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
      const expected: PokemonEvolution[] = [
        {
          id: 1,
          name: 'bulbasaur',
          url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur/',
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/bulbasaur.png'
        },
        {
          id: 1,
          name: 'ivysaur',
          url: 'https://pokeapi.co/api/v2/pokemon/ivysaur/',
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/ivysaur.png'
        },
        {
          id: 1,
          name: 'venusaur',
          url: 'https://pokeapi.co/api/v2/pokemon/venusaur/',
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/venusaur.png'
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
    'count': 1281,
    'next': 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=1',
    'previous': null,
    'results': [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }
    ]
  };
}

// TODO cleanup unused props from responses
function pokemonDetailsResponse(name: string) {
  return {
    'abilities': [
      {
        'ability': {
          'name': `${ name }-ability`,
          'url': 'https://pokeapi.co/api/v2/ability/65/'
        },
        'is_hidden': false,
        'slot': 1
      },
    ],
    'base_experience': 64,
    'forms': [
      {
        'name': 'bulbasaur',
        'url': 'https://pokeapi.co/api/v2/pokemon-form/1/'
      }
    ],
    'height': 7,
    'held_items': [],
    'id': 1,
    'is_default': true,
    'location_area_encounters': 'https://pokeapi.co/api/v2/pokemon/1/encounters',
    'name': name,
    'order': 1,
    'past_types': [],
    'species': {
      'name': name,
      'url': `https://pokeapi.co/api/v2/pokemon-species/${name}/`
    },
    'sprites': {
      'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
      'back_female': null,
      'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/1.png',
      'back_shiny_female': null,
      'front_default': `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${ name }.png`,
      'front_female': null,
      'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png',
      'front_shiny_female': null,
      'other': {
        'dream_world': {
          'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg',
          'front_female': null
        },
        'home': {
          'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/1.png',
          'front_female': null,
          'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/1.png',
          'front_shiny_female': null
        },
        'official-artwork': {
          'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
          'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/1.png'
        }
      },
      'versions': {
        'generation-i': {
          'red-blue': {
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/back/1.png',
            'back_gray': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/back/gray/1.png',
            'back_transparent': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/transparent/back/1.png',
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/1.png',
            'front_gray': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/gray/1.png',
            'front_transparent': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/transparent/1.png'
          },
          'yellow': {
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/back/1.png',
            'back_gray': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/back/gray/1.png',
            'back_transparent': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/transparent/back/1.png',
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/1.png',
            'front_gray': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/gray/1.png',
            'front_transparent': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/transparent/1.png'
          }
        },
        'generation-ii': {
          'crystal': {
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/back/1.png',
            'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/back/shiny/1.png',
            'back_shiny_transparent': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/transparent/back/shiny/1.png',
            'back_transparent': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/transparent/back/1.png',
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/1.png',
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/shiny/1.png',
            'front_shiny_transparent': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/transparent/shiny/1.png',
            'front_transparent': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/transparent/1.png'
          },
          'gold': {
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/back/1.png',
            'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/back/shiny/1.png',
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/1.png',
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/shiny/1.png',
            'front_transparent': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/transparent/1.png'
          },
          'silver': {
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/back/1.png',
            'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/back/shiny/1.png',
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/1.png',
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/shiny/1.png',
            'front_transparent': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/transparent/1.png'
          }
        },
        'generation-iii': {
          'emerald': {
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/1.png',
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/shiny/1.png'
          },
          'firered-leafgreen': {
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/back/1.png',
            'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/back/shiny/1.png',
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/1.png',
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/shiny/1.png'
          },
          'ruby-sapphire': {
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/ruby-sapphire/back/1.png',
            'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/ruby-sapphire/back/shiny/1.png',
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/ruby-sapphire/1.png',
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/ruby-sapphire/shiny/1.png'
          }
        },
        'generation-iv': {
          'diamond-pearl': {
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/back/1.png',
            'back_female': null,
            'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/back/shiny/1.png',
            'back_shiny_female': null,
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/1.png',
            'front_female': null,
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/shiny/1.png',
            'front_shiny_female': null
          },
          'heartgold-soulsilver': {
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/back/1.png',
            'back_female': null,
            'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/back/shiny/1.png',
            'back_shiny_female': null,
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/1.png',
            'front_female': null,
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/shiny/1.png',
            'front_shiny_female': null
          },
          'platinum': {
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/back/1.png',
            'back_female': null,
            'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/back/shiny/1.png',
            'back_shiny_female': null,
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/1.png',
            'front_female': null,
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/shiny/1.png',
            'front_shiny_female': null
          }
        },
        'generation-v': {
          'black-white': {
            'animated': {
              'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/1.gif',
              'back_female': null,
              'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/shiny/1.gif',
              'back_shiny_female': null,
              'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif',
              'front_female': null,
              'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/1.gif',
              'front_shiny_female': null
            },
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/back/1.png',
            'back_female': null,
            'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/back/shiny/1.png',
            'back_shiny_female': null,
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/1.png',
            'front_female': null,
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/shiny/1.png',
            'front_shiny_female': null
          }
        },
        'generation-vi': {
          'omegaruby-alphasapphire': {
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/omegaruby-alphasapphire/1.png',
            'front_female': null,
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/omegaruby-alphasapphire/shiny/1.png',
            'front_shiny_female': null
          },
          'x-y': {
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/x-y/1.png',
            'front_female': null,
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/x-y/shiny/1.png',
            'front_shiny_female': null
          }
        },
        'generation-vii': {
          'icons': {
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/1.png',
            'front_female': null
          },
          'ultra-sun-ultra-moon': {
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/ultra-sun-ultra-moon/1.png',
            'front_female': null,
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/ultra-sun-ultra-moon/shiny/1.png',
            'front_shiny_female': null
          }
        },
        'generation-viii': {
          'icons': {
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/1.png',
            'front_female': null
          }
        }
      }
    },
    'stats': [
      {
        'base_stat': 45,
        'effort': 0,
        'stat': {
          'name': 'hp',
          'url': 'https://pokeapi.co/api/v2/stat/1/'
        }
      },
      {
        'base_stat': 49,
        'effort': 0,
        'stat': {
          'name': 'attack',
          'url': 'https://pokeapi.co/api/v2/stat/2/'
        }
      },
      {
        'base_stat': 49,
        'effort': 0,
        'stat': {
          'name': 'defense',
          'url': 'https://pokeapi.co/api/v2/stat/3/'
        }
      },
      {
        'base_stat': 65,
        'effort': 1,
        'stat': {
          'name': 'special-attack',
          'url': 'https://pokeapi.co/api/v2/stat/4/'
        }
      },
      {
        'base_stat': 65,
        'effort': 0,
        'stat': {
          'name': 'special-defense',
          'url': 'https://pokeapi.co/api/v2/stat/5/'
        }
      },
      {
        'base_stat': 45,
        'effort': 0,
        'stat': {
          'name': 'speed',
          'url': 'https://pokeapi.co/api/v2/stat/6/'
        }
      }
    ],
    'types': [
      {
        'slot': 1,
        'type': {
          'name': 'grass',
          'url': 'https://pokeapi.co/api/v2/type/12/'
        }
      },
      {
        'slot': 2,
        'type': {
          'name': 'poison',
          'url': 'https://pokeapi.co/api/v2/type/4/'
        }
      }
    ],
    'weight': 69
  };
}

function pikachuDetailsResponse() {
  return {
    'abilities': [{
      'ability': { 'name': 'static', 'url': 'https://pokeapi.co/api/v2/ability/9/' },
      'is_hidden': false,
      'slot': 1
    },
    ],
    'base_experience': 112,
    'forms': [{ 'name': 'pikachu', 'url': 'https://pokeapi.co/api/v2/pokemon-form/25/' }],
    'game_indices': [{
      'game_index': 84,
      'version': { 'name': 'red', 'url': 'https://pokeapi.co/api/v2/version/1/' }
    }, {
      'game_index': 84,
      'version': { 'name': 'blue', 'url': 'https://pokeapi.co/api/v2/version/2/' }
    }, {
      'game_index': 84,
      'version': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version/3/' }
    }, {
      'game_index': 25,
      'version': { 'name': 'gold', 'url': 'https://pokeapi.co/api/v2/version/4/' }
    }, {
      'game_index': 25,
      'version': { 'name': 'silver', 'url': 'https://pokeapi.co/api/v2/version/5/' }
    }, {
      'game_index': 25,
      'version': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version/6/' }
    }, {
      'game_index': 25,
      'version': { 'name': 'ruby', 'url': 'https://pokeapi.co/api/v2/version/7/' }
    }, {
      'game_index': 25,
      'version': { 'name': 'sapphire', 'url': 'https://pokeapi.co/api/v2/version/8/' }
    }, {
      'game_index': 25,
      'version': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version/9/' }
    }, {
      'game_index': 25,
      'version': { 'name': 'firered', 'url': 'https://pokeapi.co/api/v2/version/10/' }
    }, {
      'game_index': 25,
      'version': { 'name': 'leafgreen', 'url': 'https://pokeapi.co/api/v2/version/11/' }
    }, {
      'game_index': 25,
      'version': { 'name': 'diamond', 'url': 'https://pokeapi.co/api/v2/version/12/' }
    }, {
      'game_index': 25,
      'version': { 'name': 'pearl', 'url': 'https://pokeapi.co/api/v2/version/13/' }
    }, {
      'game_index': 25,
      'version': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version/14/' }
    }, {
      'game_index': 25,
      'version': { 'name': 'heartgold', 'url': 'https://pokeapi.co/api/v2/version/15/' }
    }, {
      'game_index': 25,
      'version': { 'name': 'soulsilver', 'url': 'https://pokeapi.co/api/v2/version/16/' }
    }, {
      'game_index': 25,
      'version': { 'name': 'black', 'url': 'https://pokeapi.co/api/v2/version/17/' }
    }, {
      'game_index': 25,
      'version': { 'name': 'white', 'url': 'https://pokeapi.co/api/v2/version/18/' }
    }, {
      'game_index': 25,
      'version': { 'name': 'black-2', 'url': 'https://pokeapi.co/api/v2/version/21/' }
    }, { 'game_index': 25, 'version': { 'name': 'white-2', 'url': 'https://pokeapi.co/api/v2/version/22/' } }],
    'height': 4,
    'held_items': [{
      'item': { 'name': 'oran-berry', 'url': 'https://pokeapi.co/api/v2/item/132/' },
      'version_details': [{
        'rarity': 50,
        'version': { 'name': 'ruby', 'url': 'https://pokeapi.co/api/v2/version/7/' }
      }, {
        'rarity': 50,
        'version': { 'name': 'sapphire', 'url': 'https://pokeapi.co/api/v2/version/8/' }
      }, {
        'rarity': 50,
        'version': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version/9/' }
      }, {
        'rarity': 50,
        'version': { 'name': 'diamond', 'url': 'https://pokeapi.co/api/v2/version/12/' }
      }, {
        'rarity': 50,
        'version': { 'name': 'pearl', 'url': 'https://pokeapi.co/api/v2/version/13/' }
      }, {
        'rarity': 50,
        'version': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version/14/' }
      }, {
        'rarity': 50,
        'version': { 'name': 'heartgold', 'url': 'https://pokeapi.co/api/v2/version/15/' }
      }, {
        'rarity': 50,
        'version': { 'name': 'soulsilver', 'url': 'https://pokeapi.co/api/v2/version/16/' }
      }, {
        'rarity': 50,
        'version': { 'name': 'black', 'url': 'https://pokeapi.co/api/v2/version/17/' }
      }, { 'rarity': 50, 'version': { 'name': 'white', 'url': 'https://pokeapi.co/api/v2/version/18/' } }]
    }, {
      'item': { 'name': 'light-ball', 'url': 'https://pokeapi.co/api/v2/item/213/' },
      'version_details': [{
        'rarity': 5,
        'version': { 'name': 'ruby', 'url': 'https://pokeapi.co/api/v2/version/7/' }
      }, {
        'rarity': 5,
        'version': { 'name': 'sapphire', 'url': 'https://pokeapi.co/api/v2/version/8/' }
      }, {
        'rarity': 5,
        'version': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version/9/' }
      }, {
        'rarity': 5,
        'version': { 'name': 'diamond', 'url': 'https://pokeapi.co/api/v2/version/12/' }
      }, { 'rarity': 5, 'version': { 'name': 'pearl', 'url': 'https://pokeapi.co/api/v2/version/13/' } }, {
        'rarity': 5,
        'version': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version/14/' }
      }, {
        'rarity': 5,
        'version': { 'name': 'heartgold', 'url': 'https://pokeapi.co/api/v2/version/15/' }
      }, {
        'rarity': 5,
        'version': { 'name': 'soulsilver', 'url': 'https://pokeapi.co/api/v2/version/16/' }
      }, { 'rarity': 1, 'version': { 'name': 'black', 'url': 'https://pokeapi.co/api/v2/version/17/' } }, {
        'rarity': 1,
        'version': { 'name': 'white', 'url': 'https://pokeapi.co/api/v2/version/18/' }
      }, {
        'rarity': 5,
        'version': { 'name': 'black-2', 'url': 'https://pokeapi.co/api/v2/version/21/' }
      }, {
        'rarity': 5,
        'version': { 'name': 'white-2', 'url': 'https://pokeapi.co/api/v2/version/22/' }
      }, { 'rarity': 5, 'version': { 'name': 'x', 'url': 'https://pokeapi.co/api/v2/version/23/' } }, {
        'rarity': 5,
        'version': { 'name': 'y', 'url': 'https://pokeapi.co/api/v2/version/24/' }
      }, {
        'rarity': 5,
        'version': { 'name': 'omega-ruby', 'url': 'https://pokeapi.co/api/v2/version/25/' }
      }, {
        'rarity': 5,
        'version': { 'name': 'alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version/26/' }
      }, { 'rarity': 5, 'version': { 'name': 'sun', 'url': 'https://pokeapi.co/api/v2/version/27/' } }, {
        'rarity': 5,
        'version': { 'name': 'moon', 'url': 'https://pokeapi.co/api/v2/version/28/' }
      }, {
        'rarity': 5,
        'version': { 'name': 'ultra-sun', 'url': 'https://pokeapi.co/api/v2/version/29/' }
      }, { 'rarity': 5, 'version': { 'name': 'ultra-moon', 'url': 'https://pokeapi.co/api/v2/version/30/' } }]
    }],
    'id': 25,
    'is_default': true,
    'location_area_encounters': 'https://pokeapi.co/api/v2/pokemon/25/encounters',
    'moves': [{
      'move': { 'name': 'mega-punch', 'url': 'https://pokeapi.co/api/v2/move/5/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }]
    }, {
      'move': { 'name': 'pay-day', 'url': 'https://pokeapi.co/api/v2/move/6/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }]
    }, {
      'move': { 'name': 'thunder-punch', 'url': 'https://pokeapi.co/api/v2/move/9/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'slam', 'url': 'https://pokeapi.co/api/v2/move/21/' },
      'version_group_details': [{
        'level_learned_at': 20,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 20,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 20,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 20,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 20,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 20,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 21,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 21,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 21,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 26,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 20,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 20,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 26,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 26,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 37,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 37,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 37,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 24,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 28,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }]
    }, {
      'move': { 'name': 'double-kick', 'url': 'https://pokeapi.co/api/v2/move/24/' },
      'version_group_details': [{
        'level_learned_at': 9,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }]
    }, {
      'move': { 'name': 'mega-kick', 'url': 'https://pokeapi.co/api/v2/move/25/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }]
    }, {
      'move': { 'name': 'headbutt', 'url': 'https://pokeapi.co/api/v2/move/29/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }]
    }, {
      'move': { 'name': 'body-slam', 'url': 'https://pokeapi.co/api/v2/move/34/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'take-down', 'url': 'https://pokeapi.co/api/v2/move/36/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'double-edge', 'url': 'https://pokeapi.co/api/v2/move/38/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }]
    }, {
      'move': { 'name': 'tail-whip', 'url': 'https://pokeapi.co/api/v2/move/39/' },
      'version_group_details': [{
        'level_learned_at': 6,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 6,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 6,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 6,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 6,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 6,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 5,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 5,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 5,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 5,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 6,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 6,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 5,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 3,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'growl', 'url': 'https://pokeapi.co/api/v2/move/45/' },
      'version_group_details': [{
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 5,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 5,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 5,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 5,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'surf', 'url': 'https://pokeapi.co/api/v2/move/57/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': {
          'name': 'stadium-surfing-pikachu',
          'url': 'https://pokeapi.co/api/v2/move-learn-method/5/'
        },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': {
          'name': 'stadium-surfing-pikachu',
          'url': 'https://pokeapi.co/api/v2/move-learn-method/5/'
        },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'submission', 'url': 'https://pokeapi.co/api/v2/move/66/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }]
    }, {
      'move': { 'name': 'counter', 'url': 'https://pokeapi.co/api/v2/move/68/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }]
    }, {
      'move': { 'name': 'seismic-toss', 'url': 'https://pokeapi.co/api/v2/move/69/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }]
    }, {
      'move': { 'name': 'strength', 'url': 'https://pokeapi.co/api/v2/move/70/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }]
    }, {
      'move': { 'name': 'thunder-shock', 'url': 'https://pokeapi.co/api/v2/move/84/' },
      'version_group_details': [{
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'thunderbolt', 'url': 'https://pokeapi.co/api/v2/move/85/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 26,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 26,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 26,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 26,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 26,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 26,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 26,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 26,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 26,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 29,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 26,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 26,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 29,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 29,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 42,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 42,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 42,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 21,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 36,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 36,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'thunder-wave', 'url': 'https://pokeapi.co/api/v2/move/86/' },
      'version_group_details': [{
        'level_learned_at': 9,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 8,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 8,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 8,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 8,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 8,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 8,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 10,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 10,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 10,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 10,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 8,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 8,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 10,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 13,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 18,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 18,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 18,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 15,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 4,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 4,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'thunder', 'url': 'https://pokeapi.co/api/v2/move/87/' },
      'version_group_details': [{
        'level_learned_at': 43,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 41,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 41,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 41,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 41,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 41,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 41,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 45,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 45,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 45,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 50,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 41,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 41,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 50,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 50,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 58,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 58,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 58,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 30,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 44,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 44,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'dig', 'url': 'https://pokeapi.co/api/v2/move/91/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'toxic', 'url': 'https://pokeapi.co/api/v2/move/92/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }]
    }, {
      'move': { 'name': 'agility', 'url': 'https://pokeapi.co/api/v2/move/97/' },
      'version_group_details': [{
        'level_learned_at': 33,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 33,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 33,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 33,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 33,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 33,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 33,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 34,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 34,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 34,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 37,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 33,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 33,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 37,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 37,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 45,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 45,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 45,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 27,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 24,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 24,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'quick-attack', 'url': 'https://pokeapi.co/api/v2/move/98/' },
      'version_group_details': [{
        'level_learned_at': 16,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 11,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 11,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 11,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 11,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 11,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 11,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 13,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 13,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 13,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 13,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 11,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 11,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 13,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 10,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 10,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 10,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 10,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 6,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'rage', 'url': 'https://pokeapi.co/api/v2/move/99/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }]
    }, {
      'move': { 'name': 'mimic', 'url': 'https://pokeapi.co/api/v2/move/102/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }]
    }, {
      'move': { 'name': 'double-team', 'url': 'https://pokeapi.co/api/v2/move/104/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 15,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 15,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 15,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 15,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 15,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 15,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 18,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 18,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 18,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 21,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 15,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 15,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 21,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 21,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 23,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 23,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 23,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 12,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 8,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 8,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'defense-curl', 'url': 'https://pokeapi.co/api/v2/move/111/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }]
    }, {
      'move': { 'name': 'light-screen', 'url': 'https://pokeapi.co/api/v2/move/113/' },
      'version_group_details': [{
        'level_learned_at': 50,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 50,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 50,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 50,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 50,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 50,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 42,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 42,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 42,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 45,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 50,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 50,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 45,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 45,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 53,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 53,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 53,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 18,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 40,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 40,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'reflect', 'url': 'https://pokeapi.co/api/v2/move/115/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'bide', 'url': 'https://pokeapi.co/api/v2/move/117/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }]
    }, {
      'move': { 'name': 'swift', 'url': 'https://pokeapi.co/api/v2/move/129/' },
      'version_group_details': [{
        'level_learned_at': 26,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'skull-bash', 'url': 'https://pokeapi.co/api/v2/move/130/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }]
    }, {
      'move': { 'name': 'flash', 'url': 'https://pokeapi.co/api/v2/move/148/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }]
    }, {
      'move': { 'name': 'rest', 'url': 'https://pokeapi.co/api/v2/move/156/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'substitute', 'url': 'https://pokeapi.co/api/v2/move/164/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'red-blue', 'url': 'https://pokeapi.co/api/v2/version-group/1/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'yellow', 'url': 'https://pokeapi.co/api/v2/version-group/2/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'thief', 'url': 'https://pokeapi.co/api/v2/move/168/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'snore', 'url': 'https://pokeapi.co/api/v2/move/173/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }]
    }, {
      'move': { 'name': 'curse', 'url': 'https://pokeapi.co/api/v2/move/174/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }]
    }, {
      'move': { 'name': 'reversal', 'url': 'https://pokeapi.co/api/v2/move/179/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'protect', 'url': 'https://pokeapi.co/api/v2/move/182/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'sweet-kiss', 'url': 'https://pokeapi.co/api/v2/move/186/' },
      'version_group_details': [{
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'mud-slap', 'url': 'https://pokeapi.co/api/v2/move/189/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }]
    }, {
      'move': { 'name': 'zap-cannon', 'url': 'https://pokeapi.co/api/v2/move/192/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }]
    }, {
      'move': { 'name': 'detect', 'url': 'https://pokeapi.co/api/v2/move/197/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }]
    }, {
      'move': { 'name': 'endure', 'url': 'https://pokeapi.co/api/v2/move/203/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'charm', 'url': 'https://pokeapi.co/api/v2/move/204/' },
      'version_group_details': [{
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'rollout', 'url': 'https://pokeapi.co/api/v2/move/205/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }]
    }, {
      'move': { 'name': 'swagger', 'url': 'https://pokeapi.co/api/v2/move/207/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }]
    }, {
      'move': { 'name': 'spark', 'url': 'https://pokeapi.co/api/v2/move/209/' },
      'version_group_details': [{
        'level_learned_at': 26,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 26,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 26,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 20,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 20,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'attract', 'url': 'https://pokeapi.co/api/v2/move/213/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }]
    }, {
      'move': { 'name': 'sleep-talk', 'url': 'https://pokeapi.co/api/v2/move/214/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'return', 'url': 'https://pokeapi.co/api/v2/move/216/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }]
    }, {
      'move': { 'name': 'frustration', 'url': 'https://pokeapi.co/api/v2/move/218/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }]
    }, {
      'move': { 'name': 'dynamic-punch', 'url': 'https://pokeapi.co/api/v2/move/223/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }]
    }, {
      'move': { 'name': 'encore', 'url': 'https://pokeapi.co/api/v2/move/227/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'iron-tail', 'url': 'https://pokeapi.co/api/v2/move/231/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 28,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'hidden-power', 'url': 'https://pokeapi.co/api/v2/move/237/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }]
    }, {
      'move': { 'name': 'rain-dance', 'url': 'https://pokeapi.co/api/v2/move/240/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'gold-silver', 'url': 'https://pokeapi.co/api/v2/version-group/3/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'crystal', 'url': 'https://pokeapi.co/api/v2/version-group/4/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'rock-smash', 'url': 'https://pokeapi.co/api/v2/move/249/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }]
    }, {
      'move': { 'name': 'uproar', 'url': 'https://pokeapi.co/api/v2/move/253/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }]
    }, {
      'move': { 'name': 'facade', 'url': 'https://pokeapi.co/api/v2/move/263/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'focus-punch', 'url': 'https://pokeapi.co/api/v2/move/264/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }]
    }, {
      'move': { 'name': 'helping-hand', 'url': 'https://pokeapi.co/api/v2/move/270/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'brick-break', 'url': 'https://pokeapi.co/api/v2/move/280/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'knock-off', 'url': 'https://pokeapi.co/api/v2/move/282/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }]
    }, {
      'move': { 'name': 'secret-power', 'url': 'https://pokeapi.co/api/v2/move/290/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }]
    }, {
      'move': { 'name': 'fake-tears', 'url': 'https://pokeapi.co/api/v2/move/313/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'signal-beam', 'url': 'https://pokeapi.co/api/v2/move/324/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }]
    }, {
      'move': { 'name': 'covet', 'url': 'https://pokeapi.co/api/v2/move/343/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }]
    }, {
      'move': { 'name': 'volt-tackle', 'url': 'https://pokeapi.co/api/v2/move/344/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }]
    }, {
      'move': { 'name': 'calm-mind', 'url': 'https://pokeapi.co/api/v2/move/347/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': {
          'name': 'lets-go-pikachu-lets-go-eevee',
          'url': 'https://pokeapi.co/api/v2/version-group/19/'
        }
      }]
    }, {
      'move': { 'name': 'shock-wave', 'url': 'https://pokeapi.co/api/v2/move/351/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ruby-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/5/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'emerald', 'url': 'https://pokeapi.co/api/v2/version-group/6/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'firered-leafgreen', 'url': 'https://pokeapi.co/api/v2/version-group/7/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'colosseum', 'url': 'https://pokeapi.co/api/v2/version-group/12/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'xd', 'url': 'https://pokeapi.co/api/v2/version-group/13/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }]
    }, {
      'move': { 'name': 'natural-gift', 'url': 'https://pokeapi.co/api/v2/move/363/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }]
    }, {
      'move': { 'name': 'feint', 'url': 'https://pokeapi.co/api/v2/move/364/' },
      'version_group_details': [{
        'level_learned_at': 29,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 29,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 29,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 34,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 34,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 34,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 21,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 21,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 21,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 16,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 16,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'fling', 'url': 'https://pokeapi.co/api/v2/move/374/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'magnet-rise', 'url': 'https://pokeapi.co/api/v2/move/393/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }]
    }, {
      'move': { 'name': 'nasty-plot', 'url': 'https://pokeapi.co/api/v2/move/417/' },
      'version_group_details': [{
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'discharge', 'url': 'https://pokeapi.co/api/v2/move/435/' },
      'version_group_details': [{
        'level_learned_at': 37,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 37,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 37,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 42,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 42,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 42,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 34,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 34,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 34,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 32,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 32,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'captivate', 'url': 'https://pokeapi.co/api/v2/move/445/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }]
    }, {
      'move': { 'name': 'grass-knot', 'url': 'https://pokeapi.co/api/v2/move/447/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'charge-beam', 'url': 'https://pokeapi.co/api/v2/move/451/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'diamond-pearl', 'url': 'https://pokeapi.co/api/v2/version-group/8/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'platinum', 'url': 'https://pokeapi.co/api/v2/version-group/9/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'heartgold-soulsilver', 'url': 'https://pokeapi.co/api/v2/version-group/10/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'electro-ball', 'url': 'https://pokeapi.co/api/v2/move/486/' },
      'version_group_details': [{
        'level_learned_at': 18,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 18,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 18,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 13,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 13,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 13,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 12,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 12,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'round', 'url': 'https://pokeapi.co/api/v2/move/496/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }]
    }, {
      'move': { 'name': 'echoed-voice', 'url': 'https://pokeapi.co/api/v2/move/497/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }]
    }, {
      'move': { 'name': 'volt-switch', 'url': 'https://pokeapi.co/api/v2/move/521/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'electroweb', 'url': 'https://pokeapi.co/api/v2/move/527/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }]
    }, {
      'move': { 'name': 'wild-charge', 'url': 'https://pokeapi.co/api/v2/move/528/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-white', 'url': 'https://pokeapi.co/api/v2/version-group/11/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'black-2-white-2', 'url': 'https://pokeapi.co/api/v2/version-group/14/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 50,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 50,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 50,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'disarming-voice', 'url': 'https://pokeapi.co/api/v2/move/574/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'draining-kiss', 'url': 'https://pokeapi.co/api/v2/move/577/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'play-rough', 'url': 'https://pokeapi.co/api/v2/move/583/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'play-nice', 'url': 'https://pokeapi.co/api/v2/move/589/' },
      'version_group_details': [{
        'level_learned_at': 7,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 7,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 7,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 7,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'confide', 'url': 'https://pokeapi.co/api/v2/move/590/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }]
    }, {
      'move': { 'name': 'eerie-impulse', 'url': 'https://pokeapi.co/api/v2/move/598/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'electric-terrain', 'url': 'https://pokeapi.co/api/v2/move/604/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'nuzzle', 'url': 'https://pokeapi.co/api/v2/move/609/' },
      'version_group_details': [{
        'level_learned_at': 23,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'x-y', 'url': 'https://pokeapi.co/api/v2/version-group/15/' }
      }, {
        'level_learned_at': 29,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'omega-ruby-alpha-sapphire', 'url': 'https://pokeapi.co/api/v2/version-group/16/' }
      }, {
        'level_learned_at': 29,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sun-moon', 'url': 'https://pokeapi.co/api/v2/version-group/17/' }
      }, {
        'level_learned_at': 29,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }, {
        'level_learned_at': 1,
        'move_learn_method': { 'name': 'level-up', 'url': 'https://pokeapi.co/api/v2/move-learn-method/1/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'laser-focus', 'url': 'https://pokeapi.co/api/v2/move/673/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'ultra-sun-ultra-moon', 'url': 'https://pokeapi.co/api/v2/version-group/18/' }
      }]
    }, {
      'move': { 'name': 'rising-voltage', 'url': 'https://pokeapi.co/api/v2/move/804/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'tutor', 'url': 'https://pokeapi.co/api/v2/move-learn-method/3/' },
        'version_group': { 'name': 'sword-shield', 'url': 'https://pokeapi.co/api/v2/version-group/20/' }
      }]
    }, {
      'move': { 'name': 'tera-blast', 'url': 'https://pokeapi.co/api/v2/move/851/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }, {
      'move': { 'name': 'trailblaze', 'url': 'https://pokeapi.co/api/v2/move/885/' },
      'version_group_details': [{
        'level_learned_at': 0,
        'move_learn_method': { 'name': 'machine', 'url': 'https://pokeapi.co/api/v2/move-learn-method/4/' },
        'version_group': { 'name': 'scarlet-violet', 'url': 'https://pokeapi.co/api/v2/version-group/25/' }
      }]
    }],
    'name': 'pikachu',
    'order': 35,
    'past_types': [],
    'species': { 'name': 'pikachu', 'url': 'https://pokeapi.co/api/v2/pokemon-species/25/' },
    'sprites': {
      'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png',
      'back_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/female/25.png',
      'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/25.png',
      'back_shiny_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/female/25.png',
      'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      'front_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/female/25.png',
      'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png',
      'front_shiny_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/female/25.png',
      'other': {
        'dream_world': {
          'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/25.svg',
          'front_female': null
        },
        'home': {
          'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/25.png',
          'front_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/female/25.png',
          'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/25.png',
          'front_shiny_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/female/25.png'
        },
        'official-artwork': {
          'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
          'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/25.png'
        }
      },
      'versions': {
        'generation-i': {
          'red-blue': {
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/back/25.png',
            'back_gray': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/back/gray/25.png',
            'back_transparent': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/transparent/back/25.png',
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/25.png',
            'front_gray': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/gray/25.png',
            'front_transparent': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/transparent/25.png'
          },
          'yellow': {
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/back/25.png',
            'back_gray': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/back/gray/25.png',
            'back_transparent': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/transparent/back/25.png',
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/25.png',
            'front_gray': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/gray/25.png',
            'front_transparent': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/transparent/25.png'
          }
        },
        'generation-ii': {
          'crystal': {
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/back/25.png',
            'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/back/shiny/25.png',
            'back_shiny_transparent': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/transparent/back/shiny/25.png',
            'back_transparent': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/transparent/back/25.png',
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/25.png',
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/shiny/25.png',
            'front_shiny_transparent': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/transparent/shiny/25.png',
            'front_transparent': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/transparent/25.png'
          },
          'gold': {
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/back/25.png',
            'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/back/shiny/25.png',
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/25.png',
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/shiny/25.png',
            'front_transparent': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/transparent/25.png'
          },
          'silver': {
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/back/25.png',
            'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/back/shiny/25.png',
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/25.png',
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/shiny/25.png',
            'front_transparent': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/transparent/25.png'
          }
        },
        'generation-iii': {
          'emerald': {
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/25.png',
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/shiny/25.png'
          },
          'firered-leafgreen': {
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/back/25.png',
            'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/back/shiny/25.png',
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/25.png',
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/shiny/25.png'
          },
          'ruby-sapphire': {
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/ruby-sapphire/back/25.png',
            'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/ruby-sapphire/back/shiny/25.png',
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/ruby-sapphire/25.png',
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/ruby-sapphire/shiny/25.png'
          }
        },
        'generation-iv': {
          'diamond-pearl': {
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/back/25.png',
            'back_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/back/female/25.png',
            'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/back/shiny/25.png',
            'back_shiny_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/back/shiny/female/25.png',
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/25.png',
            'front_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/female/25.png',
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/shiny/25.png',
            'front_shiny_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/shiny/female/25.png'
          },
          'heartgold-soulsilver': {
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/back/25.png',
            'back_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/back/female/25.png',
            'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/back/shiny/25.png',
            'back_shiny_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/back/shiny/female/25.png',
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/25.png',
            'front_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/female/25.png',
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/shiny/25.png',
            'front_shiny_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/shiny/female/25.png'
          },
          'platinum': {
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/back/25.png',
            'back_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/back/female/25.png',
            'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/back/shiny/25.png',
            'back_shiny_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/back/shiny/female/25.png',
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/25.png',
            'front_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/female/25.png',
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/shiny/25.png',
            'front_shiny_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/shiny/female/25.png'
          }
        },
        'generation-v': {
          'black-white': {
            'animated': {
              'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/25.gif',
              'back_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/female/25.gif',
              'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/shiny/25.gif',
              'back_shiny_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/shiny/female/25.gif',
              'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif',
              'front_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/female/25.gif',
              'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/25.gif',
              'front_shiny_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/female/25.gif'
            },
            'back_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/back/25.png',
            'back_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/back/female/25.png',
            'back_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/back/shiny/25.png',
            'back_shiny_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/back/shiny/female/25.png',
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/25.png',
            'front_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/female/25.png',
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/shiny/25.png',
            'front_shiny_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/shiny/female/25.png'
          }
        },
        'generation-vi': {
          'omegaruby-alphasapphire': {
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/omegaruby-alphasapphire/25.png',
            'front_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/omegaruby-alphasapphire/female/25.png',
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/omegaruby-alphasapphire/shiny/25.png',
            'front_shiny_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/omegaruby-alphasapphire/shiny/female/25.png'
          },
          'x-y': {
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/x-y/25.png',
            'front_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/x-y/female/25.png',
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/x-y/shiny/25.png',
            'front_shiny_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/x-y/shiny/female/25.png'
          }
        },
        'generation-vii': {
          'icons': {
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/25.png',
            'front_female': null
          },
          'ultra-sun-ultra-moon': {
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/ultra-sun-ultra-moon/25.png',
            'front_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/ultra-sun-ultra-moon/female/25.png',
            'front_shiny': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/ultra-sun-ultra-moon/shiny/25.png',
            'front_shiny_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/ultra-sun-ultra-moon/shiny/female/25.png'
          }
        },
        'generation-viii': {
          'icons': {
            'front_default': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/25.png',
            'front_female': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/female/25.png'
          }
        }
      }
    },
    'stats': [{
      'base_stat': 35,
      'effort': 0,
      'stat': { 'name': 'hp', 'url': 'https://pokeapi.co/api/v2/stat/1/' }
    }, {
      'base_stat': 55,
      'effort': 0,
      'stat': { 'name': 'attack', 'url': 'https://pokeapi.co/api/v2/stat/2/' }
    }, {
      'base_stat': 40,
      'effort': 0,
      'stat': { 'name': 'defense', 'url': 'https://pokeapi.co/api/v2/stat/3/' }
    }, {
      'base_stat': 50,
      'effort': 0,
      'stat': { 'name': 'special-attack', 'url': 'https://pokeapi.co/api/v2/stat/4/' }
    }, {
      'base_stat': 50,
      'effort': 0,
      'stat': { 'name': 'special-defense', 'url': 'https://pokeapi.co/api/v2/stat/5/' }
    }, { 'base_stat': 90, 'effort': 2, 'stat': { 'name': 'speed', 'url': 'https://pokeapi.co/api/v2/stat/6/' } }],
    'types': [{ 'slot': 1, 'type': { 'name': 'electric', 'url': 'https://pokeapi.co/api/v2/type/13/' } }],
    'weight': 60
  };
}

function pokemonEvolutions() {
  return {
    'baby_trigger_item': null,
    'chain': {
      'evolution_details': [],
      'evolves_to': [
        {
          'evolution_details': [
            {
              'gender': null,
              'held_item': null,
              'item': null,
              'known_move': null,
              'known_move_type': null,
              'location': null,
              'min_affection': null,
              'min_beauty': null,
              'min_happiness': null,
              'min_level': 16,
              'needs_overworld_rain': false,
              'party_species': null,
              'party_type': null,
              'relative_physical_stats': null,
              'time_of_day': '',
              'trade_species': null,
              'trigger': {
                'name': 'level-up',
                'url': 'https://pokeapi.co/api/v2/evolution-trigger/1/'
              },
              'turn_upside_down': false
            }
          ],
          'evolves_to': [
            {
              'evolution_details': [
                {
                  'gender': null,
                  'held_item': null,
                  'item': null,
                  'known_move': null,
                  'known_move_type': null,
                  'location': null,
                  'min_affection': null,
                  'min_beauty': null,
                  'min_happiness': null,
                  'min_level': 32,
                  'needs_overworld_rain': false,
                  'party_species': null,
                  'party_type': null,
                  'relative_physical_stats': null,
                  'time_of_day': '',
                  'trade_species': null,
                  'trigger': {
                    'name': 'level-up',
                    'url': 'https://pokeapi.co/api/v2/evolution-trigger/1/'
                  },
                  'turn_upside_down': false
                }
              ],
              'evolves_to': [],
              'is_baby': false,
              'species': {
                'name': 'venusaur',
                'url': 'https://pokeapi.co/api/v2/pokemon-species/3/'
              }
            }
          ],
          'is_baby': false,
          'species': {
            'name': 'ivysaur',
            'url': 'https://pokeapi.co/api/v2/pokemon-species/2/'
          }
        }
      ],
      'is_baby': false,
      'species': {
        'name': 'bulbasaur',
        'url': 'https://pokeapi.co/api/v2/pokemon-species/1/'
      }
    },
    'id': 1
  };
}
