import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonDetailsComponent } from './pokemon-details.component';
import { Pokemon } from '../../../domain/pokemon';
import { By } from '@angular/platform-browser';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { SelectedPokemonService } from '../selected-pokemon.service';
import { PokemonService } from '../../../domain/pokemon.service';
import { InMemoryPokemonService } from '../../../infrastructure/in-memory-pokemon.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

describe('PokemonDetailsComponent', () => {
  let fixture: ComponentFixture<PokemonDetailsComponent>;
  let selectedPokemonService: SelectedPokemonService;
  let pokemonService: PokemonService;
  let pokemon: Pokemon;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserTestingModule, RouterTestingModule],
      declarations: [PokemonDetailsComponent],
      providers: [
        SelectedPokemonService,
        { provide: PokemonService, useFactory: () => new InMemoryPokemonService([]) },
      ]
    }).compileComponents();

    selectedPokemonService = TestBed.inject(SelectedPokemonService);
    pokemonService = TestBed.inject(PokemonService);
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(PokemonDetailsComponent);

  });

  it('reads pokemon data SelectedPokemonService', () => {
    pokemon = {
      id: 1,
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
    };
    selectedPokemonService.selectPokemon(pokemon);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.pokemon-details__name')).nativeElement.innerText.toLowerCase()).toBe(pokemon.name.toLowerCase());
    expect(fixture.debugElement.query(By.css('.pokemon-details__image')).nativeElement.src).toEqual(pokemon.image);
  });

  it('reads pokemon data from PokemonService if not available from SelectedPokemonService', () => {
    pokemon = {
      id: 2,
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/2/',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png'
    };

    spyOn(pokemonService, 'getPokemon').and.callFake((id: number) => new InMemoryPokemonService([pokemon]).getPokemon(id));
    activatedRoute.snapshot.params = { id: '2' };

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.pokemon-details__name')).nativeElement.innerText.toLowerCase()).toBe(pokemon.name.toLowerCase());
    expect(fixture.debugElement.query(By.css('.pokemon-details__image')).nativeElement.src).toEqual(pokemon.image);
  });
});
