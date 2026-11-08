import { Routes } from '@angular/router';

import { ASC } from 'app/config';
import { userRouteAccessService } from 'app/core/auth';

import ReservaResolve from './route/reserva-routing-resolve.service';

const reservaRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/reserva').then(m => m.Reserva),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/reserva-detail').then(m => m.ReservaDetail),
    resolve: {
      reserva: ReservaResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/reserva-update').then(m => m.ReservaUpdate),
    resolve: {
      reserva: ReservaResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/reserva-update').then(m => m.ReservaUpdate),
    resolve: {
      reserva: ReservaResolve,
    },
    canActivate: [userRouteAccessService],
  },
];

export default reservaRoute;
