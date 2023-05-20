import { AppComponent } from './app.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { By } from '@angular/platform-browser';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';

describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('displays header', () => {
    expect(fixture.debugElement.query(By.css('.app-component__header'))).toBeTruthy();
  });

  it('displays pokemon list component', () => {
    expect(fixture.debugElement.query(By.directive(PokemonListComponent))).toBeTruthy();
  });
});
