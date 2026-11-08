import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'user-management',
    title: 'userManagement.home.title',
    loadChildren: () => import('./admin/user-management/user-management.routes'),
  },
  {
    path: 'authority',
    title: 'reservadecanchasApp.adminAuthority.home.title',
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'cliente',
    title: 'reservadecanchasApp.cliente.home.title',
    loadChildren: () => import('./cliente/cliente.routes'),
  },
  {
    path: 'deporte',
    title: 'reservadecanchasApp.deporte.home.title',
    loadChildren: () => import('./deporte/deporte.routes'),
  },
  {
    path: 'cancha',
    title: 'reservadecanchasApp.cancha.home.title',
    loadChildren: () => import('./cancha/cancha.routes'),
  },
  {
    path: 'reserva',
    title: 'reservadecanchasApp.reserva.home.title',
    loadChildren: () => import('./reserva/reserva.routes'),
  },
  {
    path: 'pago',
    title: 'reservadecanchasApp.pago.home.title',
    loadChildren: () => import('./pago/pago.routes'),
  },
  // jhipster-needle-add-entity-route - JHipster will add entity modules routes here
];

export default routes;
