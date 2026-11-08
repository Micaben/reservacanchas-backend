import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, finalize, map } from 'rxjs';

import { EstadoPago } from 'app/entities/enumerations/estado-pago.model';
import { MetodoPago } from 'app/entities/enumerations/metodo-pago.model';
import { IReserva } from 'app/entities/reserva/reserva.model';
import { ReservaService } from 'app/entities/reserva/service/reserva.service';
import { AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { IPago } from '../pago.model';
import { PagoService } from '../service/pago.service';

import { PagoFormGroup, PagoFormService } from './pago-form.service';

@Component({
  selector: 'jhi-pago-update',
  templateUrl: './pago-update.html',
  imports: [TranslateDirective, TranslatePipe, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class PagoUpdate implements OnInit {
  readonly isSaving = signal(false);
  pago: IPago | null = null;
  metodoPagoValues = Object.keys(MetodoPago);
  estadoPagoValues = Object.keys(EstadoPago);

  reservasCollection = signal<IReserva[]>([]);

  protected pagoService = inject(PagoService);
  protected pagoFormService = inject(PagoFormService);
  protected reservaService = inject(ReservaService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PagoFormGroup = this.pagoFormService.createPagoFormGroup();

  compareReserva = (o1: IReserva | null, o2: IReserva | null): boolean => this.reservaService.compareReserva(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pago }) => {
      this.pago = pago;
      if (pago) {
        this.updateForm(pago);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const pago = this.pagoFormService.getPago(this.editForm);
    if (pago.id === null) {
      this.subscribeToSaveResponse(this.pagoService.create(pago));
    } else {
      this.subscribeToSaveResponse(this.pagoService.update(pago));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IPago | null>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving.set(false);
  }

  protected updateForm(pago: IPago): void {
    this.pago = pago;
    this.pagoFormService.resetForm(this.editForm, pago);

    this.reservasCollection.set(this.reservaService.addReservaToCollectionIfMissing<IReserva>(this.reservasCollection(), pago.reserva));
  }

  protected loadRelationshipsOptions(): void {
    this.reservaService
      .query({ filter: 'pago-is-null' })
      .pipe(map((res: HttpResponse<IReserva[]>) => res.body ?? []))
      .pipe(map((reservas: IReserva[]) => this.reservaService.addReservaToCollectionIfMissing<IReserva>(reservas, this.pago?.reserva)))
      .subscribe((reservas: IReserva[]) => this.reservasCollection.set(reservas));
  }
}
