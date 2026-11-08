import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { serverApiUrl } from 'app/config';
import { createRequestOption } from 'app/core/request';
import { ICancha, NewCancha } from '../cancha.model';

export type PartialUpdateCancha = Partial<ICancha> & Pick<ICancha, 'id'>;

type RestOf<T extends ICancha | NewCancha> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestCancha = RestOf<ICancha>;

export type NewRestCancha = RestOf<NewCancha>;

export type PartialUpdateRestCancha = RestOf<PartialUpdateCancha>;

@Service()
export class CanchasService {
  readonly canchasParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly canchasResource = httpResource<RestCancha[]>(() => {
    const params = this.canchasParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of cancha that have been fetched. It is updated when the canchasResource emits a new value.
   * In case of error while fetching the canchas, the signal is set to an empty array.
   */
  readonly canchas = computed(() =>
    (this.canchasResource.hasValue() ? this.canchasResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly resourceUrl = `${serverApiUrl}api/canchas`;

  protected convertValueFromServer(restCancha: RestCancha): ICancha {
    return {
      ...restCancha,
      createdDate: restCancha.createdDate ? dayjs(restCancha.createdDate) : undefined,
      lastModifiedDate: restCancha.lastModifiedDate ? dayjs(restCancha.lastModifiedDate) : undefined,
    };
  }
}

@Service()
export class CanchaService extends CanchasService {
  protected readonly http = inject(HttpClient);

  create(cancha: NewCancha): Observable<ICancha> {
    const copy = this.convertValueFromClient(cancha);
    return this.http.post<RestCancha>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(cancha: ICancha): Observable<ICancha> {
    const copy = this.convertValueFromClient(cancha);
    return this.http
      .put<RestCancha>(`${this.resourceUrl}/${encodeURIComponent(this.getCanchaIdentifier(cancha))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(cancha: PartialUpdateCancha): Observable<ICancha> {
    const copy = this.convertValueFromClient(cancha);
    return this.http
      .patch<RestCancha>(`${this.resourceUrl}/${encodeURIComponent(this.getCanchaIdentifier(cancha))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<ICancha> {
    return this.http.get<RestCancha>(`${this.resourceUrl}/${encodeURIComponent(id)}`).pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<ICancha[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCancha[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getCanchaIdentifier(cancha: Pick<ICancha, 'id'>): number {
    return cancha.id;
  }

  compareCancha(o1: Pick<ICancha, 'id'> | null, o2: Pick<ICancha, 'id'> | null): boolean {
    return o1 && o2 ? this.getCanchaIdentifier(o1) === this.getCanchaIdentifier(o2) : o1 === o2;
  }

  addCanchaToCollectionIfMissing<Type extends Pick<ICancha, 'id'>>(
    canchaCollection: Type[],
    ...canchasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const canchas: Type[] = canchasToCheck.filter(canchaItem => canchaItem !== null && canchaItem !== undefined);
    if (canchas.length > 0) {
      const canchaCollectionIdentifiers = canchaCollection.map(canchaItem => this.getCanchaIdentifier(canchaItem));
      const canchasToAdd = canchas.filter(canchaItem => {
        const canchaIdentifier = this.getCanchaIdentifier(canchaItem);
        if (canchaCollectionIdentifiers.includes(canchaIdentifier)) {
          return false;
        }
        canchaCollectionIdentifiers.push(canchaIdentifier);
        return true;
      });
      return [...canchasToAdd, ...canchaCollection];
    }
    return canchaCollection;
  }

  protected convertValueFromClient<T extends ICancha | NewCancha | PartialUpdateCancha>(cancha: T): RestOf<T> {
    return {
      ...cancha,
      createdDate: cancha.createdDate?.toJSON() ?? null,
      lastModifiedDate: cancha.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestCancha): ICancha {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestCancha[]): ICancha[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
