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

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule.forChild([
      {
        path: '',
        component: PokemonListComponent
      }
    ]),
    MatToolbarModule,
    MatGridListModule,
    MatCardModule,
    MatRippleModule
  ],
  declarations: [PokemonListComponent],
  providers: [
    { provide: PokemonService, useClass: HttpPokemonService }
  ]
})
export class PokemonListModule {
}
