import dayjs from 'dayjs/esm';

import { IDeporte } from 'app/entities/deporte/deporte.model';
import { EstadoCancha } from 'app/entities/enumerations/estado-cancha.model';

export interface ICancha {
  id: number;
  codigo?: string | null;
  nombre?: string | null;
  descripcion?: string | null;
  precioHora?: number | null;
  capacidad?: number | null;
  imagenUrl?: string | null;
  estado?: keyof typeof EstadoCancha | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  deportes?: IDeporte[] | null;
}

export type NewCancha = Omit<ICancha, 'id'> & { id: null };
