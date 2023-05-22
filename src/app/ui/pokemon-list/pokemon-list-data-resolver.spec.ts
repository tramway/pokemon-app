import { pokemonListDataResolverKey, pokemonListQueryParamsResolver } from './pokemon-list-data-resolver';
import { ActivatedRoute, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

@Component({
  selector: 'test-component',
  template: `
    <div>test-component</div>`
})
class TestComponent {
}

describe('pokemonListDataResolver', () => {
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        {
          path: '',
          resolve: {
            [pokemonListDataResolverKey]: pokemonListQueryParamsResolver
          },
          component: TestComponent
        }
      ])]
    });

    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('sets initial parameters to default if not presented in queryParams', async () => {
    expect(activatedRoute.snapshot.queryParams).toEqual({});
    await router.navigate(['/']);

    expect(activatedRoute.snapshot.queryParams).toEqual({ page: '1' });
  });
});
