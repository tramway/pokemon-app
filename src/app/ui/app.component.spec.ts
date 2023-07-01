import { AppComponent } from './app.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../app-routing.module';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PokemonsModule } from './pokemons/pokemons.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PokemonListComponent } from './pokemons/pokemon-list/pokemon-list.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), TranslateModule.forRoot(), HttpClientTestingModule, PokemonsModule],
      declarations: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);

    await TestBed.inject(Router).navigate(['/']);
    fixture.detectChanges();
  });

  it('displays pokemon list component', () => {
    expect(fixture.debugElement.query(By.directive(PokemonListComponent))).toBeTruthy();
  });
});
