import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonsComponent } from './pokemons.component';
import { By } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

describe('PokemonsComponent', () => {
  let fixture: ComponentFixture<PokemonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), MatToolbarModule, RouterModule.forRoot([])],
      declarations: [PokemonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonsComponent);
  });

  it('displays header', async () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.pokemons__header'))).toBeTruthy();
  });
});
