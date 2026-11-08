import dayjs from 'dayjs/esm';

import { IPago, NewPago } from './pago.model';

export const sampleWithRequiredData: IPago = {
  id: 23658,
  monto: 13092.15,
  metodoPago: 'TARJETA_CREDITO_VISA',
};

export const sampleWithPartialData: IPago = {
  id: 28028,
  monto: 15355.04,
  fechaPago: dayjs('2026-11-02T10:01'),
  metodoPago: 'BILLETERA_DIGITAL',
  estadoPago: 'PAGADO',
  createdBy: 'or',
  lastModifiedBy: 'up total',
};

export const sampleWithFullData: IPago = {
  id: 9975,
  monto: 19892,
  fechaPago: dayjs('2026-11-02T08:30'),
  metodoPago: 'EFECTIVO',
  numOperacion: 'easily',
  comprobanteUrl: 'warmly',
  estadoPago: 'REEMBOLSADO',
  createdBy: 'necessary inside',
  createdDate: dayjs('2026-11-02T09:53'),
  lastModifiedBy: 'ha meander',
  lastModifiedDate: dayjs('2026-11-02T11:09'),
};

export const sampleWithNewData: NewPago = {
  monto: 1927.72,
  metodoPago: 'BILLETERA_DIGITAL',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
