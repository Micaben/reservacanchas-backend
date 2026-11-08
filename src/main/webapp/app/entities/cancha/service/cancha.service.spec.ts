import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ICancha } from '../cancha.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../cancha.test-samples';

import { CanchaService, RestCancha } from './cancha.service';

const requireRestSample: RestCancha = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Cancha Service', () => {
  let service: CanchaService;
  let httpMock: HttpTestingController;
  let expectedResult: ICancha | ICancha[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(CanchaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Cancha', () => {
      const cancha = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(cancha).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Cancha', () => {
      const cancha = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(cancha).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Cancha', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Cancha', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Cancha', () => {
      service.delete(123).subscribe();

      const requests = httpMock.match({ method: 'DELETE' });
      expect(requests).toHaveLength(1);
    });

    describe('addCanchaToCollectionIfMissing', () => {
      it('should add a Cancha to an empty array', () => {
        const cancha: ICancha = sampleWithRequiredData;
        expectedResult = service.addCanchaToCollectionIfMissing([], cancha);
        expect(expectedResult).toEqual([cancha]);
      });

      it('should not add a Cancha to an array that contains it', () => {
        const cancha: ICancha = sampleWithRequiredData;
        const canchaCollection: ICancha[] = [
          {
            ...cancha,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCanchaToCollectionIfMissing(canchaCollection, cancha);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Cancha to an array that doesn't contain it", () => {
        const cancha: ICancha = sampleWithRequiredData;
        const canchaCollection: ICancha[] = [sampleWithPartialData];
        expectedResult = service.addCanchaToCollectionIfMissing(canchaCollection, cancha);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cancha);
      });

      it('should add only unique Cancha to an array', () => {
        const canchaArray: ICancha[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const canchaCollection: ICancha[] = [sampleWithRequiredData];
        expectedResult = service.addCanchaToCollectionIfMissing(canchaCollection, ...canchaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const cancha: ICancha = sampleWithRequiredData;
        const cancha2: ICancha = sampleWithPartialData;
        expectedResult = service.addCanchaToCollectionIfMissing([], cancha, cancha2);
        expect(expectedResult).toEqual([cancha, cancha2]);
      });

      it('should accept null and undefined values', () => {
        const cancha: ICancha = sampleWithRequiredData;
        expectedResult = service.addCanchaToCollectionIfMissing([], null, cancha, undefined);
        expect(expectedResult).toEqual([cancha]);
      });

      it('should return initial array if no Cancha is added', () => {
        const canchaCollection: ICancha[] = [sampleWithRequiredData];
        expectedResult = service.addCanchaToCollectionIfMissing(canchaCollection, undefined, null);
        expect(expectedResult).toEqual(canchaCollection);
      });
    });

    describe('compareCancha', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCancha(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 16283 };
        const entity2 = null;

        const compareResult1 = service.compareCancha(entity1, entity2);
        const compareResult2 = service.compareCancha(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 16283 };
        const entity2 = { id: 15070 };

        const compareResult1 = service.compareCancha(entity1, entity2);
        const compareResult2 = service.compareCancha(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return true if primaryKey matches', () => {
        const entity1 = { id: 16283 };
        const entity2 = { id: 16283 };

        const compareResult1 = service.compareCancha(entity1, entity2);
        const compareResult2 = service.compareCancha(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
