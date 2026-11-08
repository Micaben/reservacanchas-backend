import { Routes } from '@angular/router';

import { ASC } from 'app/config';
import { userRouteAccessService } from 'app/core/auth';

import PagoResolve from './route/pago-routing-resolve.service';

const pagoRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/pago').then(m => m.Pago),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/pago-detail').then(m => m.PagoDetail),
    resolve: {
      pago: PagoResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/pago-update').then(m => m.PagoUpdate),
    resolve: {
      pago: PagoResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/pago-update').then(m => m.PagoUpdate),
    resolve: {
      pago: PagoResolve,
    },
    canActivate: [userRouteAccessService],
  },
];

export default pagoRoute;
