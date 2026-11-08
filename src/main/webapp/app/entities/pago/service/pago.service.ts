import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { serverApiUrl } from 'app/config';
import { createRequestOption } from 'app/core/request';
import { IPago, NewPago } from '../pago.model';

export type PartialUpdatePago = Partial<IPago> & Pick<IPago, 'id'>;

type RestOf<T extends IPago | NewPago> = Omit<T, 'fechaPago' | 'createdDate' | 'lastModifiedDate'> & {
  fechaPago?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestPago = RestOf<IPago>;

export type NewRestPago = RestOf<NewPago>;

export type PartialUpdateRestPago = RestOf<PartialUpdatePago>;

@Service()
export class PagosService {
  readonly pagosParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(undefined);
  readonly pagosResource = httpResource<RestPago[]>(() => {
    const params = this.pagosParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of pago that have been fetched. It is updated when the pagosResource emits a new value.
   * In case of error while fetching the pagos, the signal is set to an empty array.
   */
  readonly pagos = computed(() =>
    (this.pagosResource.hasValue() ? this.pagosResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly resourceUrl = `${serverApiUrl}api/pagos`;

  protected convertValueFromServer(restPago: RestPago): IPago {
    return {
      ...restPago,
      fechaPago: restPago.fechaPago ? dayjs(restPago.fechaPago) : undefined,
      createdDate: restPago.createdDate ? dayjs(restPago.createdDate) : undefined,
      lastModifiedDate: restPago.lastModifiedDate ? dayjs(restPago.lastModifiedDate) : undefined,
    };
  }
}

@Service()
export class PagoService extends PagosService {
  protected readonly http = inject(HttpClient);

  create(pago: NewPago): Observable<IPago> {
    const copy = this.convertValueFromClient(pago);
    return this.http.post<RestPago>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(pago: IPago): Observable<IPago> {
    const copy = this.convertValueFromClient(pago);
    return this.http
      .put<RestPago>(`${this.resourceUrl}/${encodeURIComponent(this.getPagoIdentifier(pago))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(pago: PartialUpdatePago): Observable<IPago> {
    const copy = this.convertValueFromClient(pago);
    return this.http
      .patch<RestPago>(`${this.resourceUrl}/${encodeURIComponent(this.getPagoIdentifier(pago))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IPago> {
    return this.http.get<RestPago>(`${this.resourceUrl}/${encodeURIComponent(id)}`).pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IPago[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPago[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getPagoIdentifier(pago: Pick<IPago, 'id'>): number {
    return pago.id;
  }

  comparePago(o1: Pick<IPago, 'id'> | null, o2: Pick<IPago, 'id'> | null): boolean {
    return o1 && o2 ? this.getPagoIdentifier(o1) === this.getPagoIdentifier(o2) : o1 === o2;
  }

  addPagoToCollectionIfMissing<Type extends Pick<IPago, 'id'>>(
    pagoCollection: Type[],
    ...pagosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pagos: Type[] = pagosToCheck.filter(pagoItem => pagoItem !== null && pagoItem !== undefined);
    if (pagos.length > 0) {
      const pagoCollectionIdentifiers = pagoCollection.map(pagoItem => this.getPagoIdentifier(pagoItem));
      const pagosToAdd = pagos.filter(pagoItem => {
        const pagoIdentifier = this.getPagoIdentifier(pagoItem);
        if (pagoCollectionIdentifiers.includes(pagoIdentifier)) {
          return false;
        }
        pagoCollectionIdentifiers.push(pagoIdentifier);
        return true;
      });
      return [...pagosToAdd, ...pagoCollection];
    }
    return pagoCollection;
  }

  protected convertValueFromClient<T extends IPago | NewPago | PartialUpdatePago>(pago: T): RestOf<T> {
    return {
      ...pago,
      fechaPago: pago.fechaPago?.toJSON() ?? null,
      createdDate: pago.createdDate?.toJSON() ?? null,
      lastModifiedDate: pago.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestPago): IPago {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestPago[]): IPago[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
