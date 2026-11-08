import dayjs from 'dayjs/esm';

import { EstadoPago } from 'app/entities/enumerations/estado-pago.model';
import { MetodoPago } from 'app/entities/enumerations/metodo-pago.model';
import { IReserva } from 'app/entities/reserva/reserva.model';

export interface IPago {
  id: number;
  monto?: number | null;
  fechaPago?: dayjs.Dayjs | null;
  metodoPago?: keyof typeof MetodoPago | null;
  numOperacion?: string | null;
  comprobanteUrl?: string | null;
  estadoPago?: keyof typeof EstadoPago | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  reserva?: IReserva | null;
}

export type NewPago = Omit<IPago, 'id'> & { id: null };
