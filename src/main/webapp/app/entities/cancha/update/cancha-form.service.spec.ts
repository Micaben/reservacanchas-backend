import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../cancha.test-samples';

import { CanchaFormService } from './cancha-form.service';

describe('Cancha Form Service', () => {
  let service: CanchaFormService;

  beforeEach(() => {
    service = TestBed.inject(CanchaFormService);
  });

  describe('Service methods', () => {
    describe('createCanchaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCanchaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            codigo: expect.any(Object),
            nombre: expect.any(Object),
            descripcion: expect.any(Object),
            precioHora: expect.any(Object),
            capacidad: expect.any(Object),
            imagenUrl: expect.any(Object),
            estado: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            deportes: expect.any(Object),
          }),
        );
      });

      it('passing ICancha should create a new form with FormGroup', () => {
        const formGroup = service.createCanchaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            codigo: expect.any(Object),
            nombre: expect.any(Object),
            descripcion: expect.any(Object),
            precioHora: expect.any(Object),
            capacidad: expect.any(Object),
            imagenUrl: expect.any(Object),
            estado: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            deportes: expect.any(Object),
          }),
        );
      });
    });

    describe('getCancha', () => {
      it('should return NewCancha for default Cancha initial value', () => {
        const formGroup = service.createCanchaFormGroup(sampleWithNewData);

        const cancha = service.getCancha(formGroup);

        expect(cancha).toMatchObject(sampleWithNewData);
      });

      it('should return NewCancha for empty Cancha initial value', () => {
        const formGroup = service.createCanchaFormGroup();

        const cancha = service.getCancha(formGroup);

        expect(cancha).toMatchObject({});
      });

      it('should return ICancha', () => {
        const formGroup = service.createCanchaFormGroup(sampleWithRequiredData);

        const cancha = service.getCancha(formGroup);

        expect(cancha).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICancha should not enable id FormControl', () => {
        const formGroup = service.createCanchaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCancha should disable id FormControl', () => {
        const formGroup = service.createCanchaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
