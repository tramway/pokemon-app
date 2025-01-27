import { AppComponent } from './app.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { routes } from '../app-routing.module';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PokemonsModule } from './pokemons/pokemons.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PokemonListComponent } from './pokemons/pokemon-list/pokemon-list.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [TranslateModule.forRoot(), PokemonsModule, RouterModule.forRoot(routes)],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);

    await TestBed.inject(Router).navigate(['/']);
    fixture.detectChanges();
  });

  it('displays pokemon list component', () => {
    expect(fixture.debugElement.query(By.directive(PokemonListComponent))).toBeTruthy();
  });
});
