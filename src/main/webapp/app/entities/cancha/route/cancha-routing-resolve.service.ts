import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { ICancha } from '../cancha.model';
import { CanchaService } from '../service/cancha.service';

const canchaResolve = (route: ActivatedRouteSnapshot): Observable<null | ICancha> => {
  const { id } = route.params;
  if (id) {
    const router = inject(Router);
    const service = inject(CanchaService);
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

export default canchaResolve;
