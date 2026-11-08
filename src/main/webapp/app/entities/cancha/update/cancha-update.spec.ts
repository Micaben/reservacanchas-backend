import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IDeporte } from 'app/entities/deporte/deporte.model';
import { DeporteService } from 'app/entities/deporte/service/deporte.service';
import { ICancha } from '../cancha.model';
import { CanchaService } from '../service/cancha.service';

import { CanchaFormService } from './cancha-form.service';
import { CanchaUpdate } from './cancha-update';

describe('Cancha Management Update Component', () => {
  let comp: CanchaUpdate;
  let fixture: ComponentFixture<CanchaUpdate>;
  let activatedRoute: ActivatedRoute;
  let canchaFormService: CanchaFormService;
  let canchaService: CanchaService;
  let deporteService: DeporteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(CanchaUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    canchaFormService = TestBed.inject(CanchaFormService);
    canchaService = TestBed.inject(CanchaService);
    deporteService = TestBed.inject(DeporteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Deporte query and add missing value', () => {
      const cancha: ICancha = { id: 15070 };
      const deportes: IDeporte[] = [{ id: 28849 }];
      cancha.deportes = deportes;

      const deporteCollection: IDeporte[] = [{ id: 28849 }];
      vi.spyOn(deporteService, 'query').mockReturnValue(of(new HttpResponse({ body: deporteCollection })));
      const additionalDeportes = [...deportes];
      const expectedCollection: IDeporte[] = [...additionalDeportes, ...deporteCollection];
      vi.spyOn(deporteService, 'addDeporteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ cancha });
      comp.ngOnInit();

      expect(deporteService.query).toHaveBeenCalled();
      expect(deporteService.addDeporteToCollectionIfMissing).toHaveBeenCalledWith(
        deporteCollection,
        ...additionalDeportes.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.deportesSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const cancha: ICancha = { id: 15070 };
      const deporte: IDeporte = { id: 28849 };
      cancha.deportes = [deporte];

      activatedRoute.data = of({ cancha });
      comp.ngOnInit();

      expect(comp.deportesSharedCollection()).toContainEqual(deporte);
      expect(comp.cancha).toEqual(cancha);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<ICancha>();
      const cancha = { id: 16283 };
      vi.spyOn(canchaFormService, 'getCancha').mockReturnValue(cancha);
      vi.spyOn(canchaService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cancha });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(cancha);
      saveSubject.complete();

      // THEN
      expect(canchaFormService.getCancha).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(canchaService.update).toHaveBeenCalledWith(expect.objectContaining(cancha));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<ICancha>();
      const cancha = { id: 16283 };
      vi.spyOn(canchaFormService, 'getCancha').mockReturnValue({ id: null });
      vi.spyOn(canchaService, 'create').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cancha: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(cancha);
      saveSubject.complete();

      // THEN
      expect(canchaFormService.getCancha).toHaveBeenCalled();
      expect(canchaService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<ICancha>();
      const cancha = { id: 16283 };
      vi.spyOn(canchaService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cancha });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(canchaService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDeporte', () => {
      it('should forward to deporteService', () => {
        const entity = { id: 28849 };
        const entity2 = { id: 25881 };
        vi.spyOn(deporteService, 'compareDeporte');
        comp.compareDeporte(entity, entity2);
        expect(deporteService.compareDeporte).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
