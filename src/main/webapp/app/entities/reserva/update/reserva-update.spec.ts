import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { ICancha } from 'app/entities/cancha/cancha.model';
import { CanchaService } from 'app/entities/cancha/service/cancha.service';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';
import { IReserva } from '../reserva.model';
import { ReservaService } from '../service/reserva.service';

import { ReservaFormService } from './reserva-form.service';
import { ReservaUpdate } from './reserva-update';

describe('Reserva Management Update Component', () => {
  let comp: ReservaUpdate;
  let fixture: ComponentFixture<ReservaUpdate>;
  let activatedRoute: ActivatedRoute;
  let reservaFormService: ReservaFormService;
  let reservaService: ReservaService;
  let clienteService: ClienteService;
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

    fixture = TestBed.createComponent(ReservaUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    reservaFormService = TestBed.inject(ReservaFormService);
    reservaService = TestBed.inject(ReservaService);
    clienteService = TestBed.inject(ClienteService);
    canchaService = TestBed.inject(CanchaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Cliente query and add missing value', () => {
      const reserva: IReserva = { id: 8835 };
      const cliente: ICliente = { id: 13484 };
      reserva.cliente = cliente;

      const clienteCollection: ICliente[] = [{ id: 13484 }];
      vi.spyOn(clienteService, 'query').mockReturnValue(of(new HttpResponse({ body: clienteCollection })));
      const additionalClientes = [cliente];
      const expectedCollection: ICliente[] = [...additionalClientes, ...clienteCollection];
      vi.spyOn(clienteService, 'addClienteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      expect(clienteService.query).toHaveBeenCalled();
      expect(clienteService.addClienteToCollectionIfMissing).toHaveBeenCalledWith(
        clienteCollection,
        ...additionalClientes.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.clientesSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Cancha query and add missing value', () => {
      const reserva: IReserva = { id: 8835 };
      const cancha: ICancha = { id: 16283 };
      reserva.cancha = cancha;

      const canchaCollection: ICancha[] = [{ id: 16283 }];
      vi.spyOn(canchaService, 'query').mockReturnValue(of(new HttpResponse({ body: canchaCollection })));
      const additionalCanchas = [cancha];
      const expectedCollection: ICancha[] = [...additionalCanchas, ...canchaCollection];
      vi.spyOn(canchaService, 'addCanchaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      expect(canchaService.query).toHaveBeenCalled();
      expect(canchaService.addCanchaToCollectionIfMissing).toHaveBeenCalledWith(
        canchaCollection,
        ...additionalCanchas.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.canchasSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const reserva: IReserva = { id: 8835 };
      const cliente: ICliente = { id: 13484 };
      reserva.cliente = cliente;
      const cancha: ICancha = { id: 16283 };
      reserva.cancha = cancha;

      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      expect(comp.clientesSharedCollection()).toContainEqual(cliente);
      expect(comp.canchasSharedCollection()).toContainEqual(cancha);
      expect(comp.reserva).toEqual(reserva);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IReserva>();
      const reserva = { id: 15097 };
      vi.spyOn(reservaFormService, 'getReserva').mockReturnValue(reserva);
      vi.spyOn(reservaService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(reserva);
      saveSubject.complete();

      // THEN
      expect(reservaFormService.getReserva).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(reservaService.update).toHaveBeenCalledWith(expect.objectContaining(reserva));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IReserva>();
      const reserva = { id: 15097 };
      vi.spyOn(reservaFormService, 'getReserva').mockReturnValue({ id: null });
      vi.spyOn(reservaService, 'create').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reserva: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(reserva);
      saveSubject.complete();

      // THEN
      expect(reservaFormService.getReserva).toHaveBeenCalled();
      expect(reservaService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<IReserva>();
      const reserva = { id: 15097 };
      vi.spyOn(reservaService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(reservaService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCliente', () => {
      it('should forward to clienteService', () => {
        const entity = { id: 13484 };
        const entity2 = { id: 20795 };
        vi.spyOn(clienteService, 'compareCliente');
        comp.compareCliente(entity, entity2);
        expect(clienteService.compareCliente).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
