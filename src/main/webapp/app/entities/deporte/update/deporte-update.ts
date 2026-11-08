import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, finalize, map } from 'rxjs';

import { ICancha } from 'app/entities/cancha/cancha.model';
import { CanchaService } from 'app/entities/cancha/service/cancha.service';
import { EstadoGeneral } from 'app/entities/enumerations/estado-general.model';
import { AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { IDeporte } from '../deporte.model';
import { DeporteService } from '../service/deporte.service';

import { DeporteFormGroup, DeporteFormService } from './deporte-form.service';

@Component({
  selector: 'jhi-deporte-update',
  templateUrl: './deporte-update.html',
  imports: [TranslateDirective, TranslatePipe, FontAwesomeModule, AlertError, ReactiveFormsModule],
})
export class DeporteUpdate implements OnInit {
  readonly isSaving = signal(false);
  deporte: IDeporte | null = null;
  estadoGeneralValues = Object.keys(EstadoGeneral);

  canchasSharedCollection = signal<ICancha[]>([]);

  protected deporteService = inject(DeporteService);
  protected deporteFormService = inject(DeporteFormService);
  protected canchaService = inject(CanchaService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: DeporteFormGroup = this.deporteFormService.createDeporteFormGroup();

  compareCancha = (o1: ICancha | null, o2: ICancha | null): boolean => this.canchaService.compareCancha(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ deporte }) => {
      this.deporte = deporte;
      if (deporte) {
        this.updateForm(deporte);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    globalThis.history.back();
  }

  save(): void {
    this.isSaving.set(true);
    const deporte = this.deporteFormService.getDeporte(this.editForm);
    if (deporte.id === null) {
      this.subscribeToSaveResponse(this.deporteService.create(deporte));
    } else {
      this.subscribeToSaveResponse(this.deporteService.update(deporte));
    }
  }

  protected subscribeToSaveResponse(result: Observable<IDeporte | null>): void {
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

  protected updateForm(deporte: IDeporte): void {
    this.deporte = deporte;
    this.deporteFormService.resetForm(this.editForm, deporte);

    this.canchasSharedCollection.update(canchas =>
      this.canchaService.addCanchaToCollectionIfMissing<ICancha>(canchas, ...(deporte.canchas ?? [])),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.canchaService
      .query()
      .pipe(map((res: HttpResponse<ICancha[]>) => res.body ?? []))
      .pipe(
        map((canchas: ICancha[]) => this.canchaService.addCanchaToCollectionIfMissing<ICancha>(canchas, ...(this.deporte?.canchas ?? []))),
      )
      .subscribe((canchas: ICancha[]) => this.canchasSharedCollection.set(canchas));
  }
}
