import dayjs from 'dayjs/esm';

import { ICancha } from 'app/entities/cancha/cancha.model';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { EstadoReserva } from 'app/entities/enumerations/estado-reserva.model';

export interface IReserva {
  id: number;
  codigoReserva?: string | null;
  fecha?: dayjs.Dayjs | null;
  horaInicio?: string | null;
  horaFin?: string | null;
  precioTotal?: number | null;
  estadoReserva?: keyof typeof EstadoReserva | null;
  fechaCreacion?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  cliente?: ICliente | null;
  cancha?: ICancha | null;
}

export type NewReserva = Omit<IReserva, 'id'> & { id: null };
