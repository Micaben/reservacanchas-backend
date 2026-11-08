import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Alert, AlertError } from 'app/shared/alert';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { TranslateDirective } from 'app/shared/language';
import { IDeporte } from '../deporte.model';

@Component({
  selector: 'jhi-deporte-detail',
  templateUrl: './deporte-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, RouterLink, FormatMediumDatetimePipe],
})
export class DeporteDetail {
  readonly deporte = input<IDeporte | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
