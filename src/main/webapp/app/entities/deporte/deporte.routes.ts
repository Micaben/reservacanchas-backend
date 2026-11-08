import { Routes } from '@angular/router';

import { ASC } from 'app/config';
import { userRouteAccessService } from 'app/core/auth';

import DeporteResolve from './route/deporte-routing-resolve.service';

const deporteRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/deporte').then(m => m.Deporte),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/deporte-detail').then(m => m.DeporteDetail),
    resolve: {
      deporte: DeporteResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/deporte-update').then(m => m.DeporteUpdate),
    resolve: {
      deporte: DeporteResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/deporte-update').then(m => m.DeporteUpdate),
    resolve: {
      deporte: DeporteResolve,
    },
    canActivate: [userRouteAccessService],
  },
];

export default deporteRoute;
