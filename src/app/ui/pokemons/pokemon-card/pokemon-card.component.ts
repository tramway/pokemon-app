import { ChangeDetectionStrategy, Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { Pokemon } from '../../../domain/pokemon';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonCardComponent {

  public pokemon: InputSignal<Pokemon> = input.required();
  public clickable: InputSignal<boolean> = input(true);

  public clicked: OutputEmitterRef<void> = output();

  public openDetails(): void {
    if(!this.clickable()) {
      return;
    }

    this.clicked.emit();
  }
}
