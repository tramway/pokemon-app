import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonDetailsComponent } from './pokemon-details.component';
import { Pokemon } from '../../../domain/pokemon';
import { By } from '@angular/platform-browser';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { PokemonService } from '../../../domain/pokemon.service';
import { InMemoryPokemonService } from '../../../infrastructure/in-memory-pokemon.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { PokemonEvolution } from '../../../domain/pokemon-evolution';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { of } from 'rxjs';

describe('PokemonDetailsComponent', () => {
  let fixture: ComponentFixture<PokemonDetailsComponent>;
  let pokemonService: PokemonService;
  let pokemon: Pokemon;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserTestingModule, RouterTestingModule, TranslateModule.forRoot(), MatCardModule],
      declarations: [PokemonDetailsComponent, PokemonCardComponent],
      providers: [
        { provide: PokemonService, useFactory: () => new InMemoryPokemonService([]) },
        { provide: ActivatedRoute, useValue: { params: of({ id: '2' }) } }
      ]
    }).compileComponents();

    pokemonService = TestBed.inject(PokemonService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);

    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(PokemonDetailsComponent);
  });

  it('reads pokemon data from url', () => {
    pokemon = {
      id: 2,
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/2/',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
      abilitiesNames: ['pickachusAbility']
    };

    spyOn(pokemonService, 'getPokemon').and.callFake((id: number) => new InMemoryPokemonService([pokemon]).getPokemon(id));

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(PokemonCardComponent)).componentInstance.pokemon).toEqual(pokemon);
  });

  it('navigates to pokemon list after clicking "back" button', () => {
    fixture.detectChanges();

    fixture.debugElement.query(By.css('.pokemon-details__go-back')).nativeElement.click();

    expect(router.navigate).toHaveBeenCalledWith(['/pokemons'], { queryParamsHandling: 'preserve' });
  });

  it('evolutions are fetched for pokemon', () => {
    const evolutions: PokemonEvolution[] = [
      {
        id: 2,
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon-species/1/',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
      },
      {
        id: 3,
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

    fixture.detectChanges();

    evolutions.forEach(evolution => {
      const allCards = fixture.debugElement.queryAll(By.directive(PokemonCardComponent));
      expect(allCards.find(element => element.componentInstance.pokemon === evolution)).toBeTruthy();
    });
  });

  it('clicking on evolution navigates to details', () => {
    const evolutions: PokemonEvolution[] = [
      {
        id: 25,
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon-species/1/',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
      },
    ];
    const inMemoryPokemonService: InMemoryPokemonService = new InMemoryPokemonService([{
        id: 2,
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon/2/',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
        abilitiesNames: ['bulbasaurAbility']
      }],
      evolutions);
    spyOn(pokemonService, 'getPokemon').and.callFake((id: number) => inMemoryPokemonService.getPokemon(id));
    spyOn(pokemonService, 'getEvolutions').and.callFake((id: number) => inMemoryPokemonService.getEvolutions(id));
    fixture.detectChanges();

    fixture.debugElement.query(By.css('.pokemon-details__evolutions-container .pokemon-details__pokemon-main-info-card')).nativeElement.click();

    expect(router.navigate).toHaveBeenCalledWith([`/pokemons/details/${ evolutions[0].id }`], { queryParamsHandling: 'merge' });
  });
});
