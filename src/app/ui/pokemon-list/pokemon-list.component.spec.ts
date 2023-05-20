import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonListComponent } from './pokemon-list.component';
import { By } from '@angular/platform-browser';
import { MatGridListModule } from '@angular/material/grid-list';
import { PokemonService } from '../../domain/pokemon.service';
import { InMemoryPokemonService } from '../../infrastructure/in-memory-pokemon.service';

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;
  let pokemonsService: PokemonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatGridListModule],
      declarations: [PokemonListComponent],
      providers: [{
        provide: PokemonService, useFactory: () => new InMemoryPokemonService([
          { id: 'pikachu', name: 'Pikachu' },
          { id: 'bulbasaur', name: 'Bulbasaur' }])
      }]
    }).compileComponents();
    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    pokemonsService = TestBed.inject(PokemonService);
    fixture.detectChanges();
  });

  it('displays fetched pokemon', (done) => {
    pokemonsService.get().subscribe((pokemons) => {
      const pokemonsNames = fixture.debugElement.queryAll(By.css('.pokemon-list__pokemon')).map(element => element.nativeElement.innerText);
      expect(pokemonsNames).toEqual(pokemons.map(pokemon => pokemon.name));
      done();
    });
  });
});
