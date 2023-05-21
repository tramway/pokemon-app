import { AppComponent } from './app.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../app-routing.module';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PokemonListModule } from './pokemon-list/pokemon-list.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), TranslateModule.forRoot(), HttpClientTestingModule, PokemonListModule],
      declarations: [AppComponent],
    }).compileComponents();

    const router = TestBed.inject(Router);
    fixture = TestBed.createComponent(AppComponent);

    await router.navigate(['/']);
    fixture.detectChanges();
  });

  it('displays pokemon list component', () => {
    expect(fixture.debugElement.query(By.directive(PokemonListComponent))).toBeTruthy();
  });
});
