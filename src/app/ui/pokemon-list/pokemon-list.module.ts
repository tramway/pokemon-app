import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../domain/pokemon.service';
import { HttpPokemonService } from '../../infrastructure/http-pokemon.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { PokemonListComponent } from './pokemon-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PokemonDetailsComponent } from './pokemon-details/pokemon-details.component';
import { SelectedPokemonService } from './selected-pokemon.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { PokemonCardComponent } from './pokemon-card/pokemon-card.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule.forChild([
      {
        path: '',
        component: PokemonListComponent,
      },
      {
        path: 'details/:id',
        component: PokemonDetailsComponent
      }
    ]),
    MatToolbarModule,
    MatGridListModule,
    MatCardModule,
    MatRippleModule,
    MatPaginatorModule,
    MatButtonModule,
    MatInputModule
  ],
  declarations: [PokemonListComponent, PokemonDetailsComponent, PokemonCardComponent],
  providers: [
    SelectedPokemonService,
    { provide: PokemonService, useClass: HttpPokemonService }
  ]
})
export class PokemonListModule {
}
