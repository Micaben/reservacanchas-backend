import dayjs from 'dayjs/esm';

import { ICancha } from 'app/entities/cancha/cancha.model';
import { EstadoGeneral } from 'app/entities/enumerations/estado-general.model';

export interface IDeporte {
  id: number;
  nombre?: string | null;
  descripcion?: string | null;
  estado?: keyof typeof EstadoGeneral | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  canchas?: ICancha[] | null;
}

export type NewDeporte = Omit<IDeporte, 'id'> & { id: null };
