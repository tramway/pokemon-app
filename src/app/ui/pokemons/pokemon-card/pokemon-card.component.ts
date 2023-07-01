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

  @Input()
  public clickable: boolean = true;

  @Output()
  public clicked: EventEmitter<void> = new EventEmitter<void>();

  public openDetails(): void {
    if (!this.clickable) {
      return;
    }

    this.clicked.emit();
  }
}
