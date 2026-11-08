package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class DeporteTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + 2L * Integer.MAX_VALUE);

    public static Deporte getDeporteSample1() {
        return new Deporte().id(1L).nombre("nombre1").descripcion("descripcion1").createdBy("createdBy1").lastModifiedBy("lastModifiedBy1");
    }

    public static Deporte getDeporteSample2() {
        return new Deporte().id(2L).nombre("nombre2").descripcion("descripcion2").createdBy("createdBy2").lastModifiedBy("lastModifiedBy2");
    }

    public static Deporte getDeporteRandomSampleGenerator() {
        return new Deporte()
            .id(longCount.incrementAndGet())
            .nombre(UUID.randomUUID().toString())
            .descripcion(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
