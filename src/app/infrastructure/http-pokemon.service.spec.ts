import { TestBed } from '@angular/core/testing';

import { HttpPokemonService } from './http-pokemon.service';

describe('HttpPokemonService', () => {
  let service: HttpPokemonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpPokemonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
