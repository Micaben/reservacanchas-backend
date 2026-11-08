import { Service } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config';
import { ICliente, NewCliente } from '../cliente.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICliente for edit and NewClienteFormGroupInput for create.
 */
type ClienteFormGroupInput = ICliente | PartialWithRequiredKeyOf<NewCliente>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICliente | NewCliente> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type ClienteFormRawValue = FormValueOf<ICliente>;

type NewClienteFormRawValue = FormValueOf<NewCliente>;

type ClienteFormDefaults = Pick<NewCliente, 'id' | 'createdDate' | 'lastModifiedDate'>;

type ClienteFormGroupContent = {
  id: FormControl<ClienteFormRawValue['id'] | NewCliente['id']>;
  nombres: FormControl<ClienteFormRawValue['nombres']>;
  apellidos: FormControl<ClienteFormRawValue['apellidos']>;
  dni: FormControl<ClienteFormRawValue['dni']>;
  email: FormControl<ClienteFormRawValue['email']>;
  telefono: FormControl<ClienteFormRawValue['telefono']>;
  valoracion: FormControl<ClienteFormRawValue['valoracion']>;
  preferencia: FormControl<ClienteFormRawValue['preferencia']>;
  createdBy: FormControl<ClienteFormRawValue['createdBy']>;
  createdDate: FormControl<ClienteFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<ClienteFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<ClienteFormRawValue['lastModifiedDate']>;
};

export type ClienteFormGroup = FormGroup<ClienteFormGroupContent>;

@Service()
export class ClienteFormService {
  createClienteFormGroup(cliente?: ClienteFormGroupInput): ClienteFormGroup {
    const clienteRawValue = this.convertClienteToClienteRawValue({
      ...this.getFormDefaults(),
      ...(cliente ?? { id: null }),
    });

    return new FormGroup<ClienteFormGroupContent>({
      id: new FormControl(
        { value: clienteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nombres: new FormControl(clienteRawValue.nombres, {
        validators: [Validators.required],
      }),
      apellidos: new FormControl(clienteRawValue.apellidos, {
        validators: [Validators.required],
      }),
      dni: new FormControl(clienteRawValue.dni, {
        validators: [Validators.required],
      }),
      email: new FormControl(clienteRawValue.email, {
        validators: [Validators.required],
      }),
      telefono: new FormControl(clienteRawValue.telefono),
      valoracion: new FormControl(clienteRawValue.valoracion),
      preferencia: new FormControl(clienteRawValue.preferencia),
      createdBy: new FormControl(clienteRawValue.createdBy),
      createdDate: new FormControl(clienteRawValue.createdDate),
      lastModifiedBy: new FormControl(clienteRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(clienteRawValue.lastModifiedDate),
    });
  }

  getCliente(form: ClienteFormGroup): ICliente | NewCliente {
    return this.convertClienteRawValueToCliente(form.getRawValue());
  }

  resetForm(form: ClienteFormGroup, cliente: ClienteFormGroupInput): void {
    const clienteRawValue = this.convertClienteToClienteRawValue({ ...this.getFormDefaults(), ...cliente });
    form.reset({
      ...clienteRawValue,
      id: { value: clienteRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): ClienteFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertClienteRawValueToCliente(rawCliente: ClienteFormRawValue | NewClienteFormRawValue): ICliente | NewCliente {
    return {
      ...rawCliente,
      createdDate: dayjs(rawCliente.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawCliente.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertClienteToClienteRawValue(
    cliente: ICliente | (Partial<NewCliente> & ClienteFormDefaults),
  ): ClienteFormRawValue | PartialWithRequiredKeyOf<NewClienteFormRawValue> {
    return {
      ...cliente,
      createdDate: cliente.createdDate ? cliente.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: cliente.lastModifiedDate ? cliente.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
