import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonListComponent } from './pokemon-list.component';
import { By } from '@angular/platform-browser';
import { MatGridListModule } from '@angular/material/grid-list';
import { PokemonService } from '../../domain/pokemon.service';
import { InMemoryPokemonService } from '../../infrastructure/in-memory-pokemon.service';
import { MatCardModule } from '@angular/material/card';

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;
  let pokemonsService: PokemonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatGridListModule, MatCardModule],
      declarations: [PokemonListComponent],
      providers: [{
        provide: PokemonService, useFactory: () => new InMemoryPokemonService([
          {
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon/1/',
            image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
          },
          {
            name: 'pikachu',
            url: 'https://pokeapi.co/api/v2/pokemon/25/',
            image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
          },
        ])
      }]
    }).compileComponents();
    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    pokemonsService = TestBed.inject(PokemonService);
    fixture.detectChanges();
  });

  it('displays fetched pokemon', (done) => {
    pokemonsService.get().subscribe((pokemons) => {
      const pokemonsNames = fixture.debugElement.queryAll(By.css('.pokemon-list__pokemon')).map(element => element.nativeElement.innerText.toLowerCase());
      expect(pokemonsNames).toEqual(pokemons.map(pokemon => pokemon.name));
      const pokemonImages = fixture.debugElement.queryAll(By.css('.pokemon-list__pokemon-image')).map(image => image.nativeElement.src);
      expect(pokemonImages).toEqual(pokemons.map(pokemon => pokemon.image));
      done();
    });
  });
});
