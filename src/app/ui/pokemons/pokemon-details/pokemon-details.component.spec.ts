import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonDetailsComponent } from './pokemon-details.component';
import { Pokemon } from '../../../domain/pokemon';
import { By } from '@angular/platform-browser';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { SelectedPokemonService } from '../selected-pokemon.service';
import { PokemonService } from '../../../domain/pokemon.service';
import { InMemoryPokemonService } from '../../../infrastructure/in-memory-pokemon.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { PokemonEvolution } from '../../../domain/pokemon-evolution';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';

describe('PokemonDetailsComponent', () => {
  let fixture: ComponentFixture<PokemonDetailsComponent>;
  let selectedPokemonService: SelectedPokemonService;
  let pokemonService: PokemonService;
  let pokemon: Pokemon;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserTestingModule, RouterTestingModule, TranslateModule.forRoot(), MatCardModule],
      declarations: [PokemonDetailsComponent, PokemonCardComponent],
      providers: [
        SelectedPokemonService,
        { provide: PokemonService, useFactory: () => new InMemoryPokemonService([]) },
      ]
    }).compileComponents();

    selectedPokemonService = TestBed.inject(SelectedPokemonService);
    pokemonService = TestBed.inject(PokemonService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);

    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(PokemonDetailsComponent);
  });

  it('reads pokemon data SelectedPokemonService', () => {
    pokemon = {
      id: 1,
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      abilitiesNames: ['bulbasaursAbility']
    };
    selectedPokemonService.selectPokemon(pokemon);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(PokemonCardComponent)).componentInstance.pokemon).toEqual(pokemon);
  });

  it('reads pokemon data from PokemonService if not available from SelectedPokemonService', () => {
    pokemon = {
      id: 2,
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/2/',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
      abilitiesNames: ['pickachusAbility']
    };

    spyOn(pokemonService, 'getPokemon').and.callFake((id: number) => new InMemoryPokemonService([pokemon]).getPokemon(id));
    activatedRoute.snapshot.params = { id: '2' };

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(PokemonCardComponent)).componentInstance.pokemon).toEqual(pokemon);
  });

  it('navigates to pokemon list after clicking "back" button', () => {
    fixture.detectChanges();

    fixture.debugElement.query(By.css('.pokemon-details__go-back')).nativeElement.click();

    expect(router.navigate).toHaveBeenCalledWith(['../'], { queryParamsHandling: 'preserve' });
  });

  it('evolutions are fetched for pokemon', () => {
    const evolutions: PokemonEvolution[] = [
      {
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon-species/1/',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
      },
      {
        name: 'ivysaur',
        url: 'https://pokeapi.co/api/v2/pokemon-species/2/',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png'
      }
    ];
    const inMemoryPokemonService: InMemoryPokemonService = new InMemoryPokemonService([{
        id: 2,
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon/2/',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
        abilitiesNames: ['pickachusAbility']
      }],
      evolutions);
    spyOn(pokemonService, 'getPokemon').and.callFake((id: number) => inMemoryPokemonService.getPokemon(id));
    spyOn(pokemonService, 'getEvolutions').and.callFake((id: number) => inMemoryPokemonService.getEvolutions(id));
    activatedRoute.snapshot.params = { id: '2' };

    fixture.detectChanges();

    evolutions.forEach(evolution => {
      const allCards = fixture.debugElement.queryAll(By.directive(PokemonCardComponent));
      expect(allCards.find(element => element.componentInstance.pokemon === evolution)).toBeTruthy();
    });
  });
});
