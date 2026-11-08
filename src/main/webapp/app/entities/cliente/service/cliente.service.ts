import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';

import dayjs from 'dayjs/esm';
import { Observable, map } from 'rxjs';

import { serverApiUrl } from 'app/config';
import { createRequestOption } from 'app/core/request';
import { ICliente, NewCliente } from '../cliente.model';

export type PartialUpdateCliente = Partial<ICliente> & Pick<ICliente, 'id'>;

type RestOf<T extends ICliente | NewCliente> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestCliente = RestOf<ICliente>;

export type NewRestCliente = RestOf<NewCliente>;

export type PartialUpdateRestCliente = RestOf<PartialUpdateCliente>;

@Service()
export class ClientesService {
  readonly clientesParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(
    undefined,
  );
  readonly clientesResource = httpResource<RestCliente[]>(() => {
    const params = this.clientesParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of cliente that have been fetched. It is updated when the clientesResource emits a new value.
   * In case of error while fetching the clientes, the signal is set to an empty array.
   */
  readonly clientes = computed(() =>
    (this.clientesResource.hasValue() ? this.clientesResource.value() : []).map(item => this.convertValueFromServer(item)),
  );
  protected readonly resourceUrl = `${serverApiUrl}api/clientes`;

  protected convertValueFromServer(restCliente: RestCliente): ICliente {
    return {
      ...restCliente,
      createdDate: restCliente.createdDate ? dayjs(restCliente.createdDate) : undefined,
      lastModifiedDate: restCliente.lastModifiedDate ? dayjs(restCliente.lastModifiedDate) : undefined,
    };
  }
}

@Service()
export class ClienteService extends ClientesService {
  protected readonly http = inject(HttpClient);

  create(cliente: NewCliente): Observable<ICliente> {
    const copy = this.convertValueFromClient(cliente);
    return this.http.post<RestCliente>(this.resourceUrl, copy).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(cliente: ICliente): Observable<ICliente> {
    const copy = this.convertValueFromClient(cliente);
    return this.http
      .put<RestCliente>(`${this.resourceUrl}/${encodeURIComponent(this.getClienteIdentifier(cliente))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(cliente: PartialUpdateCliente): Observable<ICliente> {
    const copy = this.convertValueFromClient(cliente);
    return this.http
      .patch<RestCliente>(`${this.resourceUrl}/${encodeURIComponent(this.getClienteIdentifier(cliente))}`, copy)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<ICliente> {
    return this.http
      .get<RestCliente>(`${this.resourceUrl}/${encodeURIComponent(id)}`)
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<HttpResponse<ICliente[]>> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCliente[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => res.clone({ body: this.convertResponseArrayFromServer(res.body!) })));
  }

  delete(id: number): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getClienteIdentifier(cliente: Pick<ICliente, 'id'>): number {
    return cliente.id;
  }

  compareCliente(o1: Pick<ICliente, 'id'> | null, o2: Pick<ICliente, 'id'> | null): boolean {
    return o1 && o2 ? this.getClienteIdentifier(o1) === this.getClienteIdentifier(o2) : o1 === o2;
  }

  addClienteToCollectionIfMissing<Type extends Pick<ICliente, 'id'>>(
    clienteCollection: Type[],
    ...clientesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const clientes: Type[] = clientesToCheck.filter(clienteItem => clienteItem !== null && clienteItem !== undefined);
    if (clientes.length > 0) {
      const clienteCollectionIdentifiers = clienteCollection.map(clienteItem => this.getClienteIdentifier(clienteItem));
      const clientesToAdd = clientes.filter(clienteItem => {
        const clienteIdentifier = this.getClienteIdentifier(clienteItem);
        if (clienteCollectionIdentifiers.includes(clienteIdentifier)) {
          return false;
        }
        clienteCollectionIdentifiers.push(clienteIdentifier);
        return true;
      });
      return [...clientesToAdd, ...clienteCollection];
    }
    return clienteCollection;
  }

  protected convertValueFromClient<T extends ICliente | NewCliente | PartialUpdateCliente>(cliente: T): RestOf<T> {
    return {
      ...cliente,
      createdDate: cliente.createdDate?.toJSON() ?? null,
      lastModifiedDate: cliente.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertResponseFromServer(res: RestCliente): ICliente {
    return this.convertValueFromServer(res);
  }

  protected convertResponseArrayFromServer(res: RestCliente[]): ICliente[] {
    return res.map(item => this.convertValueFromServer(item));
  }
}
