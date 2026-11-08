import { Service } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config';
import { IPago, NewPago } from '../pago.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPago for edit and NewPagoFormGroupInput for create.
 */
type PagoFormGroupInput = IPago | PartialWithRequiredKeyOf<NewPago>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPago | NewPago> = Omit<T, 'fechaPago' | 'createdDate' | 'lastModifiedDate'> & {
  fechaPago?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type PagoFormRawValue = FormValueOf<IPago>;

type NewPagoFormRawValue = FormValueOf<NewPago>;

type PagoFormDefaults = Pick<NewPago, 'id' | 'fechaPago' | 'createdDate' | 'lastModifiedDate'>;

type PagoFormGroupContent = {
  id: FormControl<PagoFormRawValue['id'] | NewPago['id']>;
  monto: FormControl<PagoFormRawValue['monto']>;
  fechaPago: FormControl<PagoFormRawValue['fechaPago']>;
  metodoPago: FormControl<PagoFormRawValue['metodoPago']>;
  numOperacion: FormControl<PagoFormRawValue['numOperacion']>;
  comprobanteUrl: FormControl<PagoFormRawValue['comprobanteUrl']>;
  estadoPago: FormControl<PagoFormRawValue['estadoPago']>;
  createdBy: FormControl<PagoFormRawValue['createdBy']>;
  createdDate: FormControl<PagoFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<PagoFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<PagoFormRawValue['lastModifiedDate']>;
  reserva: FormControl<PagoFormRawValue['reserva']>;
};

export type PagoFormGroup = FormGroup<PagoFormGroupContent>;

@Service()
export class PagoFormService {
  createPagoFormGroup(pago?: PagoFormGroupInput): PagoFormGroup {
    const pagoRawValue = this.convertPagoToPagoRawValue({
      ...this.getFormDefaults(),
      ...(pago ?? { id: null }),
    });

    return new FormGroup<PagoFormGroupContent>({
      id: new FormControl(
        { value: pagoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      monto: new FormControl(pagoRawValue.monto, {
        validators: [Validators.required],
      }),
      fechaPago: new FormControl(pagoRawValue.fechaPago),
      metodoPago: new FormControl(pagoRawValue.metodoPago, {
        validators: [Validators.required],
      }),
      numOperacion: new FormControl(pagoRawValue.numOperacion),
      comprobanteUrl: new FormControl(pagoRawValue.comprobanteUrl),
      estadoPago: new FormControl(pagoRawValue.estadoPago),
      createdBy: new FormControl(pagoRawValue.createdBy),
      createdDate: new FormControl(pagoRawValue.createdDate),
      lastModifiedBy: new FormControl(pagoRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(pagoRawValue.lastModifiedDate),
      reserva: new FormControl(pagoRawValue.reserva),
    });
  }

  getPago(form: PagoFormGroup): IPago | NewPago {
    return this.convertPagoRawValueToPago(form.getRawValue());
  }

  resetForm(form: PagoFormGroup, pago: PagoFormGroupInput): void {
    const pagoRawValue = this.convertPagoToPagoRawValue({ ...this.getFormDefaults(), ...pago });
    form.reset({
      ...pagoRawValue,
      id: { value: pagoRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): PagoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      fechaPago: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertPagoRawValueToPago(rawPago: PagoFormRawValue | NewPagoFormRawValue): IPago | NewPago {
    return {
      ...rawPago,
      fechaPago: dayjs(rawPago.fechaPago, DATE_TIME_FORMAT),
      createdDate: dayjs(rawPago.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawPago.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertPagoToPagoRawValue(
    pago: IPago | (Partial<NewPago> & PagoFormDefaults),
  ): PagoFormRawValue | PartialWithRequiredKeyOf<NewPagoFormRawValue> {
    return {
      ...pago,
      fechaPago: pago.fechaPago ? pago.fechaPago.format(DATE_TIME_FORMAT) : undefined,
      createdDate: pago.createdDate ? pago.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: pago.lastModifiedDate ? pago.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
