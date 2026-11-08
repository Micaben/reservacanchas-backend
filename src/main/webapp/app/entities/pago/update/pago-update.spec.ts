import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IReserva } from 'app/entities/reserva/reserva.model';
import { ReservaService } from 'app/entities/reserva/service/reserva.service';
import { IPago } from '../pago.model';
import { PagoService } from '../service/pago.service';

import { PagoFormService } from './pago-form.service';
import { PagoUpdate } from './pago-update';

describe('Pago Management Update Component', () => {
  let comp: PagoUpdate;
  let fixture: ComponentFixture<PagoUpdate>;
  let activatedRoute: ActivatedRoute;
  let pagoFormService: PagoFormService;
  let pagoService: PagoService;
  let reservaService: ReservaService;

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

    fixture = TestBed.createComponent(PagoUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pagoFormService = TestBed.inject(PagoFormService);
    pagoService = TestBed.inject(PagoService);
    reservaService = TestBed.inject(ReservaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call reserva query and add missing value', () => {
      const pago: IPago = { id: 25202 };
      const reserva: IReserva = { id: 15097 };
      pago.reserva = reserva;

      const reservaCollection: IReserva[] = [{ id: 15097 }];
      vi.spyOn(reservaService, 'query').mockReturnValue(of(new HttpResponse({ body: reservaCollection })));
      const expectedCollection: IReserva[] = [reserva, ...reservaCollection];
      vi.spyOn(reservaService, 'addReservaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pago });
      comp.ngOnInit();

      expect(reservaService.query).toHaveBeenCalled();
      expect(reservaService.addReservaToCollectionIfMissing).toHaveBeenCalledWith(reservaCollection, reserva);
      expect(comp.reservasCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const pago: IPago = { id: 25202 };
      const reserva: IReserva = { id: 15097 };
      pago.reserva = reserva;

      activatedRoute.data = of({ pago });
      comp.ngOnInit();

      expect(comp.reservasCollection()).toContainEqual(reserva);
      expect(comp.pago).toEqual(pago);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IPago>();
      const pago = { id: 1660 };
      vi.spyOn(pagoFormService, 'getPago').mockReturnValue(pago);
      vi.spyOn(pagoService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pago });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(pago);
      saveSubject.complete();

      // THEN
      expect(pagoFormService.getPago).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pagoService.update).toHaveBeenCalledWith(expect.objectContaining(pago));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IPago>();
      const pago = { id: 1660 };
      vi.spyOn(pagoFormService, 'getPago').mockReturnValue({ id: null });
      vi.spyOn(pagoService, 'create').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pago: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(pago);
      saveSubject.complete();

      // THEN
      expect(pagoFormService.getPago).toHaveBeenCalled();
      expect(pagoService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IPago>();
      const pago = { id: 1660 };
      vi.spyOn(pagoService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pago });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pagoService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareReserva', () => {
      it('should forward to reservaService', () => {
        const entity = { id: 15097 };
        const entity2 = { id: 8835 };
        vi.spyOn(reservaService, 'compareReserva');
        comp.compareReserva(entity, entity2);
        expect(reservaService.compareReserva).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
