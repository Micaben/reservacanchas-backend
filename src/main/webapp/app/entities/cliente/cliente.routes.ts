import { Routes } from '@angular/router';

import { ASC } from 'app/config';
import { userRouteAccessService } from 'app/core/auth';

import ClienteResolve from './route/cliente-routing-resolve.service';

const clienteRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/cliente').then(m => m.Cliente),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/cliente-detail').then(m => m.ClienteDetail),
    resolve: {
      cliente: ClienteResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/cliente-update').then(m => m.ClienteUpdate),
    resolve: {
      cliente: ClienteResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/cliente-update').then(m => m.ClienteUpdate),
    resolve: {
      cliente: ClienteResolve,
    },
    canActivate: [userRouteAccessService],
  },
];

export default clienteRoute;
