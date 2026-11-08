import dayjs from 'dayjs/esm';

import { ICliente, NewCliente } from './cliente.model';

export const sampleWithRequiredData: ICliente = {
  id: 2897,
  nombres: 'wherever alongside per',
  apellidos: 'for blank above',
  dni: 'in',
  email: 'Ines_PradoRodarte63@gmail.com',
};

export const sampleWithPartialData: ICliente = {
  id: 2849,
  nombres: 'huzzah',
  apellidos: 'characterization frightfully',
  dni: 'down',
  email: 'Lucia_TejedaAlmanza@yahoo.com',
  valoracion: 30206,
  preferencia: 'cool yuck',
  lastModifiedBy: 'times',
  lastModifiedDate: dayjs('2026-11-02T03:26'),
};

export const sampleWithFullData: ICliente = {
  id: 17129,
  nombres: 'circumference',
  apellidos: 'categorise council',
  dni: 'blah reluctantly than',
  email: 'Manuela.HaroValenzuela4@hotmail.com',
  telefono: 'disposer',
  valoracion: 1802,
  preferencia: 'inspection',
  createdBy: 'wee why',
  createdDate: dayjs('2026-11-02T08:47'),
  lastModifiedBy: 'assail since',
  lastModifiedDate: dayjs('2026-11-02T21:54'),
};

export const sampleWithNewData: NewCliente = {
  nombres: 'under',
  apellidos: 'gratefully',
  dni: 'amid',
  email: 'Daniela50@hotmail.com',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
