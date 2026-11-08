import { Routes } from '@angular/router';

import { ASC } from 'app/config';
import { userRouteAccessService } from 'app/core/auth';

import CanchaResolve from './route/cancha-routing-resolve.service';

const canchaRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/cancha').then(m => m.Cancha),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/cancha-detail').then(m => m.CanchaDetail),
    resolve: {
      cancha: CanchaResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/cancha-update').then(m => m.CanchaUpdate),
    resolve: {
      cancha: CanchaResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/cancha-update').then(m => m.CanchaUpdate),
    resolve: {
      cancha: CanchaResolve,
    },
    canActivate: [userRouteAccessService],
  },
];

export default canchaRoute;
