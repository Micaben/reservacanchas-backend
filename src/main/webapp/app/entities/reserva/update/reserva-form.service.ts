import { Service } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config';
import { IReserva, NewReserva } from '../reserva.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReserva for edit and NewReservaFormGroupInput for create.
 */
type ReservaFormGroupInput = IReserva | PartialWithRequiredKeyOf<NewReserva>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IReserva | NewReserva> = Omit<T, 'fechaCreacion' | 'createdDate' | 'lastModifiedDate'> & {
  fechaCreacion?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type ReservaFormRawValue = FormValueOf<IReserva>;

type NewReservaFormRawValue = FormValueOf<NewReserva>;

type ReservaFormDefaults = Pick<NewReserva, 'id' | 'fechaCreacion' | 'createdDate' | 'lastModifiedDate'>;

type ReservaFormGroupContent = {
  id: FormControl<ReservaFormRawValue['id'] | NewReserva['id']>;
  codigoReserva: FormControl<ReservaFormRawValue['codigoReserva']>;
  fecha: FormControl<ReservaFormRawValue['fecha']>;
  horaInicio: FormControl<ReservaFormRawValue['horaInicio']>;
  horaFin: FormControl<ReservaFormRawValue['horaFin']>;
  precioTotal: FormControl<ReservaFormRawValue['precioTotal']>;
  estadoReserva: FormControl<ReservaFormRawValue['estadoReserva']>;
  fechaCreacion: FormControl<ReservaFormRawValue['fechaCreacion']>;
  createdBy: FormControl<ReservaFormRawValue['createdBy']>;
  createdDate: FormControl<ReservaFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<ReservaFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ReservaFormRawValue['lastModifiedDate']>;
  cliente: FormControl<ReservaFormRawValue['cliente']>;
  cancha: FormControl<ReservaFormRawValue['cancha']>;
};

export type ReservaFormGroup = FormGroup<ReservaFormGroupContent>;

@Service()
export class ReservaFormService {
  createReservaFormGroup(reserva?: ReservaFormGroupInput): ReservaFormGroup {
    const reservaRawValue = this.convertReservaToReservaRawValue({
      ...this.getFormDefaults(),
      ...(reserva ?? { id: null }),
    });

    return new FormGroup<ReservaFormGroupContent>({
      id: new FormControl(
        { value: reservaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      codigoReserva: new FormControl(reservaRawValue.codigoReserva, {
        validators: [Validators.required],
      }),
      fecha: new FormControl(reservaRawValue.fecha, {
        validators: [Validators.required],
      }),
      horaInicio: new FormControl(reservaRawValue.horaInicio, {
        validators: [Validators.required],
      }),
      horaFin: new FormControl(reservaRawValue.horaFin, {
        validators: [Validators.required],
      }),
      precioTotal: new FormControl(reservaRawValue.precioTotal, {
        validators: [Validators.required],
      }),
      estadoReserva: new FormControl(reservaRawValue.estadoReserva),
      fechaCreacion: new FormControl(reservaRawValue.fechaCreacion),
      createdBy: new FormControl(reservaRawValue.createdBy),
      createdDate: new FormControl(reservaRawValue.createdDate),
      lastModifiedBy: new FormControl(reservaRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(reservaRawValue.lastModifiedDate),
      cliente: new FormControl(reservaRawValue.cliente),
      cancha: new FormControl(reservaRawValue.cancha),
    });
  }

  getReserva(form: ReservaFormGroup): IReserva | NewReserva {
    return this.convertReservaRawValueToReserva(form.getRawValue());
  }

  resetForm(form: ReservaFormGroup, reserva: ReservaFormGroupInput): void {
    const reservaRawValue = this.convertReservaToReservaRawValue({ ...this.getFormDefaults(), ...reserva });
    form.reset({
      ...reservaRawValue,
      id: { value: reservaRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): ReservaFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      fechaCreacion: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertReservaRawValueToReserva(rawReserva: ReservaFormRawValue | NewReservaFormRawValue): IReserva | NewReserva {
    return {
      ...rawReserva,
      fechaCreacion: dayjs(rawReserva.fechaCreacion, DATE_TIME_FORMAT),
      createdDate: dayjs(rawReserva.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawReserva.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertReservaToReservaRawValue(
    reserva: IReserva | (Partial<NewReserva> & ReservaFormDefaults),
  ): ReservaFormRawValue | PartialWithRequiredKeyOf<NewReservaFormRawValue> {
    return {
      ...reserva,
      fechaCreacion: reserva.fechaCreacion ? reserva.fechaCreacion.format(DATE_TIME_FORMAT) : undefined,
      createdDate: reserva.createdDate ? reserva.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: reserva.lastModifiedDate ? reserva.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
