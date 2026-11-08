import dayjs from 'dayjs/esm';

import { IDeporte, NewDeporte } from './deporte.model';

export const sampleWithRequiredData: IDeporte = {
  id: 29723,
  nombre: 'across',
};

export const sampleWithPartialData: IDeporte = {
  id: 26708,
  nombre: 'youthfully metabolite our',
  descripcion: 'qua accurate moral',
  createdBy: 'shady gladly',
};

export const sampleWithFullData: IDeporte = {
  id: 6489,
  nombre: 'under brr',
  descripcion: 'jaunty anaesthetise feline',
  estado: 'INACTIVO',
  createdBy: 'redound',
  createdDate: dayjs('2026-11-02T05:32'),
  lastModifiedBy: 'arrange',
  lastModifiedDate: dayjs('2026-11-02T17:39'),
};

export const sampleWithNewData: NewDeporte = {
  nombre: 'convoke solution',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
