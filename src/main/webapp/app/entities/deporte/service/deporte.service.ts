import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { serverApiUrl } from 'app/config';
import { createRequestOption } from 'app/core/request';
import { IDeporte, NewDeporte } from '../deporte.model';

export type PartialUpdateDeporte = Partial<IDeporte> & Pick<IDeporte, 'id'>;

type RestOf<T extends IDeporte | NewDeporte> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestDeporte = RestOf<IDeporte>;

export type NewRestDeporte = RestOf<NewDeporte>;

export type PartialUpdateRestDeporte = RestOf<PartialUpdateDeporte>;

@Service()
export class DeportesService {
  readonly deportesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly deportesResource = httpResource<RestDeporte[]>(() => {
    const params = this.deportesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of deporte that have been fetched. It is updated when the deportesResource emits a new value.
   * In case of error while fetching the deportes, the signal is set to an empty array.
   */
  readonly deportes = computed(() =>
    (this.deportesResource.hasValue() ? this.deportesResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly resourceUrl = `${serverApiUrl}api/deportes`;

  protected convertValueFromServer(restDeporte: RestDeporte): IDeporte {
    return {
      ...restDeporte,
      createdDate: restDeporte.createdDate ? dayjs(restDeporte.createdDate) : undefined,
      lastModifiedDate: restDeporte.lastModifiedDate ? dayjs(restDeporte.lastModifiedDate) : undefined,
    };
  }
}

@Service()
export class DeporteService extends DeportesService {
  protected readonly http = inject(HttpClient);

  create(deporte: NewDeporte): Observable<IDeporte> {
    const copy = this.convertValueFromClient(deporte);
    return this.http.post<RestDeporte>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(deporte: IDeporte): Observable<IDeporte> {
    const copy = this.convertValueFromClient(deporte);
    return this.http
      .put<RestDeporte>(`${this.resourceUrl}/${encodeURIComponent(this.getDeporteIdentifier(deporte))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(deporte: PartialUpdateDeporte): Observable<IDeporte> {
    const copy = this.convertValueFromClient(deporte);
    return this.http
      .patch<RestDeporte>(`${this.resourceUrl}/${encodeURIComponent(this.getDeporteIdentifier(deporte))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<IDeporte> {
    return this.http
      .get<RestDeporte>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<IDeporte[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDeporte[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getDeporteIdentifier(deporte: Pick<IDeporte, 'id'>): number {
    return deporte.id;
  }

  compareDeporte(o1: Pick<IDeporte, 'id'> | null, o2: Pick<IDeporte, 'id'> | null): boolean {
    return o1 && o2 ? this.getDeporteIdentifier(o1) === this.getDeporteIdentifier(o2) : o1 === o2;
  }

  addDeporteToCollectionIfMissing<Type extends Pick<IDeporte, 'id'>>(
    deporteCollection: Type[],
    ...deportesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const deportes: Type[] = deportesToCheck.filter(deporteItem => deporteItem !== null && deporteItem !== undefined);
    if (deportes.length > 0) {
      const deporteCollectionIdentifiers = deporteCollection.map(deporteItem => this.getDeporteIdentifier(deporteItem));
      const deportesToAdd = deportes.filter(deporteItem => {
        const deporteIdentifier = this.getDeporteIdentifier(deporteItem);
        if (deporteCollectionIdentifiers.includes(deporteIdentifier)) {
          return false;
        }
        deporteCollectionIdentifiers.push(deporteIdentifier);
        return true;
      });
      return [...deportesToAdd, ...deporteCollection];
    }
    return deporteCollection;
  }

  protected convertValueFromClient<T extends IDeporte | NewDeporte | PartialUpdateDeporte>(deporte: T): RestOf<T> {
    return {
      ...deporte,
      createdDate: deporte.createdDate?.toJSON() ?? null,
      lastModifiedDate: deporte.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestDeporte): IDeporte {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestDeporte[]): IDeporte[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
