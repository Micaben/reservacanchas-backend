import dayjs from 'dayjs/esm';

import { IReserva, NewReserva } from './reserva.model';

export const sampleWithRequiredData: IReserva = {
  id: 22571,
  codigoReserva: 'indeed derby',
  fecha: dayjs('2026-11-02'),
  horaInicio: 'starch prestigious meanwhile',
  horaFin: 'following oh continually',
  precioTotal: 29352.44,
};

export const sampleWithPartialData: IReserva = {
  id: 12820,
  codigoReserva: 'misjudge although',
  fecha: dayjs('2026-11-02'),
  horaInicio: 'showboat regarding hurtful',
  horaFin: 'oof',
  precioTotal: 8729.99,
  estadoReserva: 'CONFIRMADA',
  createdBy: 'tackle fund',
  createdDate: dayjs('2026-11-02T01:28'),
  lastModifiedBy: 'excepting',
};

export const sampleWithFullData: IReserva = {
  id: 8504,
  codigoReserva: 'geez steeple willow',
  fecha: dayjs('2026-11-02'),
  horaInicio: 'govern sometimes unwelcome',
  horaFin: 'zesty yowza since',
  precioTotal: 27464.91,
  estadoReserva: 'FINALIZADA',
  fechaCreacion: dayjs('2026-11-02T07:53'),
  createdBy: 'phooey',
  createdDate: dayjs('2026-11-02T17:27'),
  lastModifiedBy: 'despite nauseate',
  lastModifiedDate: dayjs('2026-11-02T19:16'),
};

export const sampleWithNewData: NewReserva = {
  codigoReserva: 'knavishly unusual brr',
  fecha: dayjs('2026-11-02'),
  horaInicio: 'monthly',
  horaFin: 'ectoderm refer',
  precioTotal: 23821.54,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
