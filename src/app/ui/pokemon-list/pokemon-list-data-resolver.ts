import { ActivatedRoute, ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export interface PokemonsListData {
  page: number;
}

export const pokemonListDataResolverKey = 'pokemonList';

export type PokemonListResolvedData = Record<typeof pokemonListDataResolverKey, PokemonsListData>

export const pokemonListQueryParamsResolver: ResolveFn<PokemonsListData> = async (route) => {
  const router = inject(Router);
  const activatedRoute = inject(ActivatedRoute);

  if (!route.queryParams['page']) {
    await router.navigate(
      [],
      {
        relativeTo: activatedRoute,
        queryParams: { page: 1 },
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
  }

  return {
    page: route.queryParams['page'],
  };
};
