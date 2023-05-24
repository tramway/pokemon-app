import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonListComponent } from './pokemon-list.component';
import { By } from '@angular/platform-browser';
import { PokemonService } from '../../domain/pokemon.service';
import { InMemoryPokemonService } from '../../infrastructure/in-memory-pokemon.service';
import { MatPaginator } from '@angular/material/paginator';
import { PokemonListModule } from './pokemon-list.module';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Pokemon } from '../../domain/pokemon';
import { ActivatedRoute, Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { SelectedPokemonService } from './selected-pokemon.service';
import Spy = jasmine.Spy;

describe('PokemonListComponent', () => {
  let fixture: ComponentFixture<PokemonListComponent>;
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let mockedPokemons: Pokemon[];
  let ngZone: NgZone;
  let routerNavigateSpy: Spy<Router['navigate']>;
  let selectedPokemonService: SelectedPokemonService;

  beforeEach(async () => {
    mockedPokemons = [
      {
        id: 1,
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        abilitiesNames: ['bulbasaursAbility']
      },
      {
        id: 25,
        name: 'pikachu',
        url: 'https://pokeapi.co/api/v2/pokemon/25/',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        abilitiesNames: ['pickachusAbility']
      },
    ];

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), PokemonListModule, BrowserTestingModule, RouterTestingModule.withRoutes([
        {
          path: '',
          component: PokemonListComponent
        }
      ])],
      declarations: [PokemonListComponent],
      providers: [
        { provide: PokemonService, useFactory: () => new InMemoryPokemonService(mockedPokemons) },
        SelectedPokemonService,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonListComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    ngZone = TestBed.inject(NgZone);
    selectedPokemonService = TestBed.inject(SelectedPokemonService);
    const pokemonService = TestBed.inject(PokemonService);

    spyOn(selectedPokemonService, 'selectPokemon').and.callThrough();
    spyOn(pokemonService, 'getPokemons').and.callThrough();

    routerNavigateSpy = spyOn(router, 'navigate').and.callThrough();
  });

  it('sets initial queryParams to default ones if not presented', async () => {
    await ngZone.run(async () => await router.navigate(['/']));

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([], jasmine.objectContaining({ queryParams: { page: 1 } }));
  });

  it('displays header', async () => {
    await ngZone.run(async () => await router.navigate(['/'], { queryParams: { page: '1' } }));

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.pokemon-list__header'))).toBeTruthy();
  });

  it('displays paginator', () => {
    fixture.detectChanges();

    const paginator = fixture.debugElement.query(By.directive(MatPaginator)).componentInstance as MatPaginator;
    expect(paginator.pageSize).toBe(10);
  });

  it('displays fetched pokemons names and images', async () => {
    await ngZone.run(async () => await router.navigate(['/'], { queryParams: { page: '1' } }));

    fixture.detectChanges();

    fixture.debugElement.queryAll(By.css('.pokemon-list__pokemon')).forEach((element, index) => {
      expect(element.nativeElement.innerText.toLowerCase()).toEqual(mockedPokemons[index].name);
    });

    fixture.debugElement.queryAll(By.css('.pokemon-list__pokemon-image')).forEach((image, index) => {
      expect(image.nativeElement.src).toEqual(mockedPokemons[index].image);
    });
  });

  it('clicking pokemon opens pokemon details', async () => {
    await ngZone.run(async () => await router.navigate(['/'], { queryParams: { page: '1' } }));

    fixture.detectChanges();

    routerNavigateSpy.calls.reset();
    fixture.debugElement.queryAll(By.css('.pokemon-list__pokemon-card-content')).at(0)?.nativeElement.click();

    expect(router.navigate).toHaveBeenCalledWith(['details', 1], jasmine.anything());
    expect(selectedPokemonService.selectPokemon).toHaveBeenCalledWith(mockedPokemons[0]);
  });
});
