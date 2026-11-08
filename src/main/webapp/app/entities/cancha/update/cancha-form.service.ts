import { Service } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config';
import { ICancha, NewCancha } from '../cancha.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICancha for edit and NewCanchaFormGroupInput for create.
 */
type CanchaFormGroupInput = ICancha | PartialWithRequiredKeyOf<NewCancha>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICancha | NewCancha> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type CanchaFormRawValue = FormValueOf<ICancha>;

type NewCanchaFormRawValue = FormValueOf<NewCancha>;

type CanchaFormDefaults = Pick<NewCancha, 'id' | 'createdDate' | 'lastModifiedDate' | 'deportes'>;

type CanchaFormGroupContent = {
  id: FormControl<CanchaFormRawValue['id'] | NewCancha['id']>;
  codigo: FormControl<CanchaFormRawValue['codigo']>;
  nombre: FormControl<CanchaFormRawValue['nombre']>;
  descripcion: FormControl<CanchaFormRawValue['descripcion']>;
  precioHora: FormControl<CanchaFormRawValue['precioHora']>;
  capacidad: FormControl<CanchaFormRawValue['capacidad']>;
  imagenUrl: FormControl<CanchaFormRawValue['imagenUrl']>;
  estado: FormControl<CanchaFormRawValue['estado']>;
  createdBy: FormControl<CanchaFormRawValue['createdBy']>;
  createdDate: FormControl<CanchaFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<CanchaFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<CanchaFormRawValue['lastModifiedDate']>;
  deportes: FormControl<CanchaFormRawValue['deportes']>;
};

export type CanchaFormGroup = FormGroup<CanchaFormGroupContent>;

@Service()
export class CanchaFormService {
  createCanchaFormGroup(cancha?: CanchaFormGroupInput): CanchaFormGroup {
    const canchaRawValue = this.convertCanchaToCanchaRawValue({
      ...this.getFormDefaults(),
      ...(cancha ?? { id: null }),
    });

    return new FormGroup<CanchaFormGroupContent>({
      id: new FormControl(
        { value: canchaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      codigo: new FormControl(canchaRawValue.codigo, {
        validators: [Validators.required],
      }),
      nombre: new FormControl(canchaRawValue.nombre, {
        validators: [Validators.required],
      }),
      descripcion: new FormControl(canchaRawValue.descripcion),
      precioHora: new FormControl(canchaRawValue.precioHora, {
        validators: [Validators.required],
      }),
      capacidad: new FormControl(canchaRawValue.capacidad, {
        validators: [Validators.required],
      }),
      imagenUrl: new FormControl(canchaRawValue.imagenUrl),
      estado: new FormControl(canchaRawValue.estado),
      createdBy: new FormControl(canchaRawValue.createdBy),
      createdDate: new FormControl(canchaRawValue.createdDate),
      lastModifiedBy: new FormControl(canchaRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(canchaRawValue.lastModifiedDate),
      deportes: new FormControl(canchaRawValue.deportes ?? []),
    });
  }

  getCancha(form: CanchaFormGroup): ICancha | NewCancha {
    return this.convertCanchaRawValueToCancha(form.getRawValue());
  }

  resetForm(form: CanchaFormGroup, cancha: CanchaFormGroupInput): void {
    const canchaRawValue = this.convertCanchaToCanchaRawValue({ ...this.getFormDefaults(), ...cancha });
    form.reset({
      ...canchaRawValue,
      id: { value: canchaRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): CanchaFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
      deportes: [],
    };
  }

  private convertCanchaRawValueToCancha(rawCancha: CanchaFormRawValue | NewCanchaFormRawValue): ICancha | NewCancha {
    return {
      ...rawCancha,
      createdDate: dayjs(rawCancha.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawCancha.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertCanchaToCanchaRawValue(
    cancha: ICancha | (Partial<NewCancha> & CanchaFormDefaults),
  ): CanchaFormRawValue | PartialWithRequiredKeyOf<NewCanchaFormRawValue> {
    return {
      ...cancha,
      createdDate: cancha.createdDate ? cancha.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: cancha.lastModifiedDate ? cancha.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
      deportes: cancha.deportes ?? [],
    };
  }
}
