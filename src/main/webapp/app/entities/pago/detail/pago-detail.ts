import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Alert, AlertError } from 'app/shared/alert';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { TranslateDirective } from 'app/shared/language';
import { IPago } from '../pago.model';

@Component({
  selector: 'jhi-pago-detail',
  templateUrl: './pago-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, RouterLink, FormatMediumDatetimePipe],
})
export class PagoDetail {
  readonly pago = input<IPago | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
