import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './ui/app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        redirectTo: 'pokemons',
        pathMatch: 'full'
      },
      {
        path: 'pokemons',
        loadChildren: () => import('./ui/pokemon-list/pokemon-list.module').then(m => m.PokemonListModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
