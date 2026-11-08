import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Alert, AlertError } from 'app/shared/alert';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { TranslateDirective } from 'app/shared/language';
import { ICancha } from '../cancha.model';

@Component({
  selector: 'jhi-cancha-detail',
  templateUrl: './cancha-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, RouterLink, FormatMediumDatetimePipe],
})
export class CanchaDetail {
  readonly cancha = input<ICancha | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
