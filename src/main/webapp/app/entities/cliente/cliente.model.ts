import dayjs from 'dayjs/esm';

import { IUser } from 'app/entities/user/user.model';

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
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewCliente = Omit<ICliente, 'id'> & { id: null };
