import { Service } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config';
import { IDeporte, NewDeporte } from '../deporte.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDeporte for edit and NewDeporteFormGroupInput for create.
 */
type DeporteFormGroupInput = IDeporte | PartialWithRequiredKeyOf<NewDeporte>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDeporte | NewDeporte> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type DeporteFormRawValue = FormValueOf<IDeporte>;

type NewDeporteFormRawValue = FormValueOf<NewDeporte>;

type DeporteFormDefaults = Pick<NewDeporte, 'id' | 'createdDate' | 'lastModifiedDate' | 'canchas'>;

type DeporteFormGroupContent = {
  id: FormControl<DeporteFormRawValue['id'] | NewDeporte['id']>;
  nombre: FormControl<DeporteFormRawValue['nombre']>;
  descripcion: FormControl<DeporteFormRawValue['descripcion']>;
  estado: FormControl<DeporteFormRawValue['estado']>;
  createdBy: FormControl<DeporteFormRawValue['createdBy']>;
  createdDate: FormControl<DeporteFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<DeporteFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<DeporteFormRawValue['lastModifiedDate']>;
  canchas: FormControl<DeporteFormRawValue['canchas']>;
};

export type DeporteFormGroup = FormGroup<DeporteFormGroupContent>;

@Service()
export class DeporteFormService {
  createDeporteFormGroup(deporte?: DeporteFormGroupInput): DeporteFormGroup {
    const deporteRawValue = this.convertDeporteToDeporteRawValue({
      ...this.getFormDefaults(),
      ...(deporte ?? { id: null }),
    });

    return new FormGroup<DeporteFormGroupContent>({
      id: new FormControl(
        { value: deporteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nombre: new FormControl(deporteRawValue.nombre, {
        validators: [Validators.required],
      }),
      descripcion: new FormControl(deporteRawValue.descripcion),
      estado: new FormControl(deporteRawValue.estado),
      createdBy: new FormControl(deporteRawValue.createdBy),
      createdDate: new FormControl(deporteRawValue.createdDate),
      lastModifiedBy: new FormControl(deporteRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(deporteRawValue.lastModifiedDate),
      canchas: new FormControl(deporteRawValue.canchas ?? []),
    });
  }

  getDeporte(form: DeporteFormGroup): IDeporte | NewDeporte {
    return this.convertDeporteRawValueToDeporte(form.getRawValue());
  }

  resetForm(form: DeporteFormGroup, deporte: DeporteFormGroupInput): void {
    const deporteRawValue = this.convertDeporteToDeporteRawValue({ ...this.getFormDefaults(), ...deporte });
    form.reset({
      ...deporteRawValue,
      id: { value: deporteRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): DeporteFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
      canchas: [],
    };
  }

  private convertDeporteRawValueToDeporte(rawDeporte: DeporteFormRawValue | NewDeporteFormRawValue): IDeporte | NewDeporte {
    return {
      ...rawDeporte,
      createdDate: dayjs(rawDeporte.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawDeporte.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertDeporteToDeporteRawValue(
    deporte: IDeporte | (Partial<NewDeporte> & DeporteFormDefaults),
  ): DeporteFormRawValue | PartialWithRequiredKeyOf<NewDeporteFormRawValue> {
    return {
      ...deporte,
      createdDate: deporte.createdDate ? deporte.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: deporte.lastModifiedDate ? deporte.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
      canchas: deporte.canchas ?? [],
    };
  }
}
