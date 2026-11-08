import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, finalize, map } from 'rxjs';

import { ICancha } from 'app/entities/cancha/cancha.model';
import { CanchaService } from 'app/entities/cancha/service/cancha.service';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';
import { EstadoReserva } from 'app/entities/enumerations/estado-reserva.model';
import { AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';

import { IReserva } from '../reserva.model';
import { ReservaService } from '../service/reserva.service';

import { ReservaFormGroup, ReservaFormService } from './reserva-form.service';

@Component({
  selector: 'jhi-reserva-update',
  templateUrl: './reserva-update.html',
  imports: [TranslateDirective, TranslatePipe, FontAwesomeModule, AlertError, ReactiveFormsModule, NgbInputDatepicker],
})
export class ReservaUpdate implements OnInit {
  readonly isSaving = signal(false);
  reserva: IReserva | null = null;
  estadoReservaValues = Object.keys(EstadoReserva);

  clientesSharedCollection = signal<ICliente[]>([]);
  canchasSharedCollection = signal<ICancha[]>([]);

  protected reservaService = inject(ReservaService);
  protected reservaFormService = inject(ReservaFormService);
  protected clienteService = inject(ClienteService);
  protected canchaService = inject(CanchaService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ReservaFormGroup = this.reservaFormService.createReservaFormGroup();

  compareCliente = (o1: ICliente | null, o2: ICliente | null): boolean => this.clienteService.compareCliente(o1, o2);

  compareCancha = (o1: ICancha | null, o2: ICancha | null): boolean => this.canchaService.compareCancha(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reserva }) => {
      this.reserva = reserva;
      if (reserva) {
        this.updateForm(reserva);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const reserva = this.reservaFormService.getReserva(this.editForm);
    if (reserva.id === null) {
      this.subscribeToSaveResponse(this.reservaService.create(reserva));
    } else {
      this.subscribeToSaveResponse(this.reservaService.update(reserva));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IReserva | null>): void {
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

  protected updateForm(reserva: IReserva): void {
    this.reserva = reserva;
    this.reservaFormService.resetForm(this.editForm, reserva);

    this.clientesSharedCollection.update(clientes =>
      this.clienteService.addClienteToCollectionIfMissing<ICliente>(clientes, reserva.cliente),
    );
    this.canchasSharedCollection.update(canchas => this.canchaService.addCanchaToCollectionIfMissing<ICancha>(canchas, reserva.cancha));
  }

  protected loadRelationshipsOptions(): void {
    this.clienteService
      .query()
      .pipe(map((res: HttpResponse<ICliente[]>) => res.body ?? []))
      .pipe(map((clientes: ICliente[]) => this.clienteService.addClienteToCollectionIfMissing<ICliente>(clientes, this.reserva?.cliente)))
      .subscribe((clientes: ICliente[]) => this.clientesSharedCollection.set(clientes));

    this.canchaService
      .query()
      .pipe(map((res: HttpResponse<ICancha[]>) => res.body ?? []))
      .pipe(map((canchas: ICancha[]) => this.canchaService.addCanchaToCollectionIfMissing<ICancha>(canchas, this.reserva?.cancha)))
      .subscribe((canchas: ICancha[]) => this.canchasSharedCollection.set(canchas));
  }
}
