import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Alert, AlertError } from 'app/shared/alert';
import { FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { TranslateDirective } from 'app/shared/language';
import { IReserva } from '../reserva.model';

@Component({
  selector: 'jhi-reserva-detail',
  templateUrl: './reserva-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, RouterLink, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ReservaDetail {
  readonly reserva = input<IReserva | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
