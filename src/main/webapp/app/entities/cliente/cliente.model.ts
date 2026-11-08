import dayjs from 'dayjs/esm';

export interface ICliente {
  id: number;
  nombres?: string | null;
  apellidos?: string | null;
  dni?: string | null;
  email?: string | null;
  telefono?: string | null;
  valoracion?: number | null;
  preferencia?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
}

export type NewCliente = Omit<ICliente, 'id'> & { id: null };
