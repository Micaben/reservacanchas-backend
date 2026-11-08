import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { IDeporte } from '../deporte.model';
import { DeporteService } from '../service/deporte.service';

const deporteResolve = (route: ActivatedRouteSnapshot): Observable<null | IDeporte> => {
  const { id } = route.params;
  if (id) {
    const router = inject(Router);
    const service = inject(DeporteService);
    return service.find(id).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          router.navigate(['404']);
        } else {
          router.navigate(['error']);
        }
        return EMPTY;
      }),
    );
  }

  return of(null);
};

export default deporteResolve;
