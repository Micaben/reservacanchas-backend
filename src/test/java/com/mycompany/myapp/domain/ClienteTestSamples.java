package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ClienteTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + 2L * Integer.MAX_VALUE);
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + 2 * Short.MAX_VALUE);

    public static Cliente getClienteSample1() {
        return new Cliente()
            .id(1L)
            .nombres("nombres1")
            .apellidos("apellidos1")
            .dni("dni1")
            .email("email1")
            .telefono("telefono1")
            .valoracion(1)
            .preferencia("preferencia1")
            .createdBy("createdBy1")
            .lastModifiedBy("lastModifiedBy1");
    }

    public static Cliente getClienteSample2() {
        return new Cliente()
            .id(2L)
            .nombres("nombres2")
            .apellidos("apellidos2")
            .dni("dni2")
            .email("email2")
            .telefono("telefono2")
            .valoracion(2)
            .preferencia("preferencia2")
            .createdBy("createdBy2")
            .lastModifiedBy("lastModifiedBy2");
    }

    public static Cliente getClienteRandomSampleGenerator() {
        return new Cliente()
            .id(longCount.incrementAndGet())
            .nombres(UUID.randomUUID().toString())
            .apellidos(UUID.randomUUID().toString())
            .dni(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .telefono(UUID.randomUUID().toString())
            .valoracion(intCount.incrementAndGet())
            .preferencia(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
