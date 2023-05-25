import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pokemon } from '../../../domain/pokemon';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent {

  @Input()
  public pokemon: Pokemon | undefined;

  @Output()
  public clicked: EventEmitter<void> = new EventEmitter<void>();

}
