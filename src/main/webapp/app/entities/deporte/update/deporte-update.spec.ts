import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { ICancha } from 'app/entities/cancha/cancha.model';
import { CanchaService } from 'app/entities/cancha/service/cancha.service';
import { IDeporte } from '../deporte.model';
import { DeporteService } from '../service/deporte.service';

import { DeporteFormService } from './deporte-form.service';
import { DeporteUpdate } from './deporte-update';

describe('Deporte Management Update Component', () => {
  let comp: DeporteUpdate;
  let fixture: ComponentFixture<DeporteUpdate>;
  let activatedRoute: ActivatedRoute;
  let deporteFormService: DeporteFormService;
  let deporteService: DeporteService;
  let canchaService: CanchaService;

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

    fixture = TestBed.createComponent(DeporteUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    deporteFormService = TestBed.inject(DeporteFormService);
    deporteService = TestBed.inject(DeporteService);
    canchaService = TestBed.inject(CanchaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Cancha query and add missing value', () => {
      const deporte: IDeporte = { id: 25881 };
      const canchas: ICancha[] = [{ id: 16283 }];
      deporte.canchas = canchas;

      const canchaCollection: ICancha[] = [{ id: 16283 }];
      vi.spyOn(canchaService, 'query').mockReturnValue(of(new HttpResponse({ body: canchaCollection })));
      const additionalCanchas = [...canchas];
      const expectedCollection: ICancha[] = [...additionalCanchas, ...canchaCollection];
      vi.spyOn(canchaService, 'addCanchaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ deporte });
      comp.ngOnInit();

      expect(canchaService.query).toHaveBeenCalled();
      expect(canchaService.addCanchaToCollectionIfMissing).toHaveBeenCalledWith(
        canchaCollection,
        ...additionalCanchas.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.canchasSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const deporte: IDeporte = { id: 25881 };
      const cancha: ICancha = { id: 16283 };
      deporte.canchas = [cancha];

      activatedRoute.data = of({ deporte });
      comp.ngOnInit();

      expect(comp.canchasSharedCollection()).toContainEqual(cancha);
      expect(comp.deporte).toEqual(deporte);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IDeporte>();
      const deporte = { id: 28849 };
      vi.spyOn(deporteFormService, 'getDeporte').mockReturnValue(deporte);
      vi.spyOn(deporteService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ deporte });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(deporte);
      saveSubject.complete();

      // THEN
      expect(deporteFormService.getDeporte).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(deporteService.update).toHaveBeenCalledWith(expect.objectContaining(deporte));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IDeporte>();
      const deporte = { id: 28849 };
      vi.spyOn(deporteFormService, 'getDeporte').mockReturnValue({ id: null });
      vi.spyOn(deporteService, 'create').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ deporte: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(deporte);
      saveSubject.complete();

      // THEN
      expect(deporteFormService.getDeporte).toHaveBeenCalled();
      expect(deporteService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IDeporte>();
      const deporte = { id: 28849 };
      vi.spyOn(deporteService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ deporte });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(deporteService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCancha', () => {
      it('should forward to canchaService', () => {
        const entity = { id: 16283 };
        const entity2 = { id: 15070 };
        vi.spyOn(canchaService, 'compareCancha');
        comp.compareCancha(entity, entity2);
        expect(canchaService.compareCancha).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
