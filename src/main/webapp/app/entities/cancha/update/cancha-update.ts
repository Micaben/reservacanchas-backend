import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, finalize, map } from 'rxjs';

import { IDeporte } from 'app/entities/deporte/deporte.model';
import { DeporteService } from 'app/entities/deporte/service/deporte.service';
import { EstadoCancha } from 'app/entities/enumerations/estado-cancha.model';
import { AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { ICancha } from '../cancha.model';
import { CanchaService } from '../service/cancha.service';

import { CanchaFormGroup, CanchaFormService } from './cancha-form.service';

@Component({
  selector: 'jhi-cancha-update',
  templateUrl: './cancha-update.html',
  imports: [TranslateDirective, TranslatePipe, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class CanchaUpdate implements OnInit {
  readonly isSaving = signal(false);
  cancha: ICancha | null = null;
  estadoCanchaValues = Object.keys(EstadoCancha);

  deportesSharedCollection = signal<IDeporte[]>([]);

  protected canchaService = inject(CanchaService);
  protected canchaFormService = inject(CanchaFormService);
  protected deporteService = inject(DeporteService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CanchaFormGroup = this.canchaFormService.createCanchaFormGroup();

  compareDeporte = (o1: IDeporte | null, o2: IDeporte | null): boolean => this.deporteService.compareDeporte(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cancha }) => {
      this.cancha = cancha;
      if (cancha) {
        this.updateForm(cancha);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const cancha = this.canchaFormService.getCancha(this.editForm);
    if (cancha.id === null) {
      this.subscribeToSaveResponse(this.canchaService.create(cancha));
    } else {
      this.subscribeToSaveResponse(this.canchaService.update(cancha));
    }
  }

  protected subscribeToSaveResponse(result: Observable<ICancha | null>): void {
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

  protected updateForm(cancha: ICancha): void {
    this.cancha = cancha;
    this.canchaFormService.resetForm(this.editForm, cancha);

    this.deportesSharedCollection.update(deportes =>
      this.deporteService.addDeporteToCollectionIfMissing<IDeporte>(deportes, ...(cancha.deportes ?? [])),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.deporteService
      .query()
      .pipe(map((res: HttpResponse<IDeporte[]>) => res.body ?? []))
      .pipe(
        map((deportes: IDeporte[]) =>
          this.deporteService.addDeporteToCollectionIfMissing<IDeporte>(deportes, ...(this.cancha?.deportes ?? [])),
        ),
      )
      .subscribe((deportes: IDeporte[]) => this.deportesSharedCollection.set(deportes));
  }
}
