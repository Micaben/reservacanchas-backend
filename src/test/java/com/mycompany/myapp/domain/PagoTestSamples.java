package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class PagoTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + 2L * Integer.MAX_VALUE);

    public static Pago getPagoSample1() {
        return new Pago()
            .id(1L)
            .numOperacion("numOperacion1")
            .comprobanteUrl("comprobanteUrl1")
            .createdBy("createdBy1")
            .lastModifiedBy("lastModifiedBy1");
    }

    public static Pago getPagoSample2() {
        return new Pago()
            .id(2L)
            .numOperacion("numOperacion2")
            .comprobanteUrl("comprobanteUrl2")
            .createdBy("createdBy2")
            .lastModifiedBy("lastModifiedBy2");
    }

    public static Pago getPagoRandomSampleGenerator() {
        return new Pago()
            .id(longCount.incrementAndGet())
            .numOperacion(UUID.randomUUID().toString())
            .comprobanteUrl(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
