package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ReservaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + 2L * Integer.MAX_VALUE);

    public static Reserva getReservaSample1() {
        return new Reserva()
            .id(1L)
            .codigoReserva("codigoReserva1")
            .horaInicio("horaInicio1")
            .horaFin("horaFin1")
            .createdBy("createdBy1")
            .lastModifiedBy("lastModifiedBy1");
    }

    public static Reserva getReservaSample2() {
        return new Reserva()
            .id(2L)
            .codigoReserva("codigoReserva2")
            .horaInicio("horaInicio2")
            .horaFin("horaFin2")
            .createdBy("createdBy2")
            .lastModifiedBy("lastModifiedBy2");
    }

    public static Reserva getReservaRandomSampleGenerator() {
        return new Reserva()
            .id(longCount.incrementAndGet())
            .codigoReserva(UUID.randomUUID().toString())
            .horaInicio(UUID.randomUUID().toString())
            .horaFin(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
