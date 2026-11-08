import dayjs from 'dayjs/esm';

import { ICancha, NewCancha } from './cancha.model';

export const sampleWithRequiredData: ICancha = {
  id: 10630,
  codigo: 'dapper advertisement',
  nombre: 'after tragic',
  precioHora: 9354.79,
  capacidad: 5488,
};

export const sampleWithPartialData: ICancha = {
  id: 13356,
  codigo: 'fen',
  nombre: 'since provided seldom',
  precioHora: 4797.31,
  capacidad: 3446,
  estado: 'DISPONIBLE',
  createdDate: dayjs('2026-11-03T00:48'),
  lastModifiedBy: 'absent',
  lastModifiedDate: dayjs('2026-11-02T21:40'),
};

export const sampleWithFullData: ICancha = {
  id: 27337,
  codigo: 'calmly till',
  nombre: 'suddenly well',
  descripcion: 'covenant international',
  precioHora: 28026.48,
  capacidad: 10798,
  imagenUrl: 'circumnavigate superficial pause',
  estado: 'DISPONIBLE',
  createdBy: 'deeply scuttle rotating',
  createdDate: dayjs('2026-11-02T14:49'),
  lastModifiedBy: 'folklore which',
  lastModifiedDate: dayjs('2026-11-02T17:37'),
};

export const sampleWithNewData: NewCancha = {
  codigo: 'lest below',
  nombre: 'portray iridescence geez',
  precioHora: 13377.68,
  capacidad: 12698,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
