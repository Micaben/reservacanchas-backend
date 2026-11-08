package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class CanchaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + 2L * Integer.MAX_VALUE);
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + 2 * Short.MAX_VALUE);

    public static Cancha getCanchaSample1() {
        return new Cancha()
            .id(1L)
            .codigo("codigo1")
            .nombre("nombre1")
            .descripcion("descripcion1")
            .capacidad(1)
            .imagenUrl("imagenUrl1")
            .createdBy("createdBy1")
            .lastModifiedBy("lastModifiedBy1");
    }

    public static Cancha getCanchaSample2() {
        return new Cancha()
            .id(2L)
            .codigo("codigo2")
            .nombre("nombre2")
            .descripcion("descripcion2")
            .capacidad(2)
            .imagenUrl("imagenUrl2")
            .createdBy("createdBy2")
            .lastModifiedBy("lastModifiedBy2");
    }

    public static Cancha getCanchaRandomSampleGenerator() {
        return new Cancha()
            .id(longCount.incrementAndGet())
            .codigo(UUID.randomUUID().toString())
            .nombre(UUID.randomUUID().toString())
            .descripcion(UUID.randomUUID().toString())
            .capacidad(intCount.incrementAndGet())
            .imagenUrl(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
