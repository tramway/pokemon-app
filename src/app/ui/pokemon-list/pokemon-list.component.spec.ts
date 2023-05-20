import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonListComponent } from './pokemon-list.component';
import { By } from '@angular/platform-browser';
import { MatGridListModule } from '@angular/material/grid-list';

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatGridListModule],
      declarations: [PokemonListComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display pokemon', () => {
    expect(fixture.debugElement.queryAll(By.css('.pokemon-list__pokemon')).length).toBe(1);
  });
});
