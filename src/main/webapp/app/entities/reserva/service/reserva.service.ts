import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { DATE_FORMAT, serverApiUrl } from 'app/config';
import { createRequestOption } from 'app/core/request';
import { IReserva, NewReserva } from '../reserva.model';

export type PartialUpdateReserva = Partial<IReserva> & Pick<IReserva, 'id'>;

type RestOf<T extends IReserva | NewReserva> = Omit<T, 'fecha' | 'fechaCreacion' | 'createdDate' | 'lastModifiedDate'> & {
  fecha?: string | null;
  fechaCreacion?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestReserva = RestOf<IReserva>;

export type NewRestReserva = RestOf<NewReserva>;

export type PartialUpdateRestReserva = RestOf<PartialUpdateReserva>;

@Service()
export class ReservasService {
  readonly reservasParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly reservasResource = httpResource<RestReserva[]>(() => {
    const params = this.reservasParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of reserva that have been fetched. It is updated when the reservasResource emits a new value.
   * In case of error while fetching the reservas, the signal is set to an empty array.
   */
  readonly reservas = computed(() =>
    (this.reservasResource.hasValue() ? this.reservasResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly resourceUrl = `${serverApiUrl}api/reservas`;

  protected convertValueFromServer(restReserva: RestReserva): IReserva {
    return {
      ...restReserva,
      fecha: restReserva.fecha ? dayjs(restReserva.fecha) : undefined,
      fechaCreacion: restReserva.fechaCreacion ? dayjs(restReserva.fechaCreacion) : undefined,
      createdDate: restReserva.createdDate ? dayjs(restReserva.createdDate) : undefined,
      lastModifiedDate: restReserva.lastModifiedDate ? dayjs(restReserva.lastModifiedDate) : undefined,
    };
  }
}

@Service()
export class ReservaService extends ReservasService {
  protected readonly http = inject(HttpClient);

  create(reserva: NewReserva): Observable<IReserva> {
    const copy = this.convertValueFromClient(reserva);
    return this.http.post<RestReserva>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(reserva: IReserva): Observable<IReserva> {
    const copy = this.convertValueFromClient(reserva);
    return this.http
      .put<RestReserva>(`${this.resourceUrl}/${encodeURIComponent(this.getReservaIdentifier(reserva))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(reserva: PartialUpdateReserva): Observable<IReserva> {
    const copy = this.convertValueFromClient(reserva);
    return this.http
      .patch<RestReserva>(`${this.resourceUrl}/${encodeURIComponent(this.getReservaIdentifier(reserva))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IReserva> {
    return this.http
      .get<RestReserva>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IReserva[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestReserva[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getReservaIdentifier(reserva: Pick<IReserva, 'id'>): number {
    return reserva.id;
  }

  compareReserva(o1: Pick<IReserva, 'id'> | null, o2: Pick<IReserva, 'id'> | null): boolean {
    return o1 && o2 ? this.getReservaIdentifier(o1) === this.getReservaIdentifier(o2) : o1 === o2;
  }

  addReservaToCollectionIfMissing<Type extends Pick<IReserva, 'id'>>(
    reservaCollection: Type[],
    ...reservasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const reservas: Type[] = reservasToCheck.filter(reservaItem => reservaItem !== null && reservaItem !== undefined);
    if (reservas.length > 0) {
      const reservaCollectionIdentifiers = reservaCollection.map(reservaItem => this.getReservaIdentifier(reservaItem));
      const reservasToAdd = reservas.filter(reservaItem => {
        const reservaIdentifier = this.getReservaIdentifier(reservaItem);
        if (reservaCollectionIdentifiers.includes(reservaIdentifier)) {
          return false;
        }
        reservaCollectionIdentifiers.push(reservaIdentifier);
        return true;
      });
      return [...reservasToAdd, ...reservaCollection];
    }
    return reservaCollection;
  }

  protected convertValueFromClient<T extends IReserva | NewReserva | PartialUpdateReserva>(reserva: T): RestOf<T> {
    return {
      ...reserva,
      fecha: reserva.fecha?.format(DATE_FORMAT) ?? null,
      fechaCreacion: reserva.fechaCreacion?.toJSON() ?? null,
      createdDate: reserva.createdDate?.toJSON() ?? null,
      lastModifiedDate: reserva.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestReserva): IReserva {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestReserva[]): IReserva[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
