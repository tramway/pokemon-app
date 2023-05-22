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
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PokemonListResolvedData } from './pokemon-list-data-resolver';

describe('PokemonListComponent', () => {
  let fixture: ComponentFixture<PokemonListComponent>;
  let activatedRoute: ActivatedRoute;
  let mockedPokemons: Pokemon[];

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
      imports: [TranslateModule.forRoot(), PokemonListModule, BrowserTestingModule, RouterTestingModule],
      declarations: [PokemonListComponent],
      providers: [
        { provide: PokemonService, useFactory: () => new InMemoryPokemonService(mockedPokemons) },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonListComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('displays header', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.pokemon-list__header'))).toBeTruthy();
  });

  it('displays paginator', () => {
    fixture.detectChanges();

    const paginator = fixture.debugElement.query(By.directive(MatPaginator)).componentInstance as MatPaginator;
    expect(paginator.pageSize).toBe(10);
  });

  it('displays fetched pokemons names and images', () => {
    const data: PokemonListResolvedData = { pokemonList: { page: 1 } };
    activatedRoute.data = of(data);

    fixture.detectChanges();

    fixture.debugElement.queryAll(By.css('.pokemon-list__pokemon')).forEach((element, index) => {
      expect(element.nativeElement.innerText.toLowerCase()).toEqual(mockedPokemons[index].name);
    });

    fixture.debugElement.queryAll(By.css('.pokemon-list__pokemon-image')).forEach((image, index) => {
      expect(image.nativeElement.src).toEqual(mockedPokemons[index].image);
    });
  });
});
