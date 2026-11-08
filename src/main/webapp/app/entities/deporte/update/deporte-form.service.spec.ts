import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../deporte.test-samples';

import { DeporteFormService } from './deporte-form.service';

describe('Deporte Form Service', () => {
  let service: DeporteFormService;

  beforeEach(() => {
    service = TestBed.inject(DeporteFormService);
  });

  describe('Service methods', () => {
    describe('createDeporteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDeporteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            descripcion: expect.any(Object),
            estado: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            canchas: expect.any(Object),
          }),
        );
      });

      it('passing IDeporte should create a new form with FormGroup', () => {
        const formGroup = service.createDeporteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            descripcion: expect.any(Object),
            estado: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            canchas: expect.any(Object),
          }),
        );
      });
    });

    describe('getDeporte', () => {
      it('should return NewDeporte for default Deporte initial value', () => {
        const formGroup = service.createDeporteFormGroup(sampleWithNewData);

        const deporte = service.getDeporte(formGroup);

        expect(deporte).toMatchObject(sampleWithNewData);
      });

      it('should return NewDeporte for empty Deporte initial value', () => {
        const formGroup = service.createDeporteFormGroup();

        const deporte = service.getDeporte(formGroup);

        expect(deporte).toMatchObject({});
      });

      it('should return IDeporte', () => {
        const formGroup = service.createDeporteFormGroup(sampleWithRequiredData);

        const deporte = service.getDeporte(formGroup);

        expect(deporte).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDeporte should not enable id FormControl', () => {
        const formGroup = service.createDeporteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDeporte should disable id FormControl', () => {
        const formGroup = service.createDeporteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
