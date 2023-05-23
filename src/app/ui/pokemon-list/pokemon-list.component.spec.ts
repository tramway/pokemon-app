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
import { of } from 'rxjs';
import { PokemonListResolvedData } from './pokemon-list-data-resolver';
import { NgZone } from '@angular/core';

describe('PokemonListComponent', () => {
  let fixture: ComponentFixture<PokemonListComponent>;
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let mockedPokemons: Pokemon[];
  let ngZone: NgZone;
  let pokemonService: PokemonService;

  beforeEach(async () => {
    mockedPokemons = [
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
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonListComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    ngZone = TestBed.inject(NgZone);
    pokemonService = TestBed.inject(PokemonService);

    spyOn(pokemonService, 'get').and.callThrough();
    spyOn(router, 'navigate').and.callThrough();
  });

  it('sets initial queryParams to default ones if not presented', async () => {
    await ngZone.run(async () => await router.navigate(['/']));

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([], jasmine.objectContaining({ queryParams: { page: 1 } }));
  });

  it('displays header', () => {
    const data: PokemonListResolvedData = { pokemonList: { page: 1 } };
    activatedRoute.data = of(data);

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
});
