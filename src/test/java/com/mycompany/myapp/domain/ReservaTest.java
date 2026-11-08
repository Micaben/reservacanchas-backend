package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.CanchaTestSamples.*;
import static com.mycompany.myapp.domain.ClienteTestSamples.*;
import static com.mycompany.myapp.domain.PagoTestSamples.*;
import static com.mycompany.myapp.domain.ReservaTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReservaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Reserva.class);
        Reserva reserva1 = getReservaSample1();
        Reserva reserva2 = new Reserva();
        assertThat(reserva1).isNotEqualTo(reserva2);

        reserva2.setId(reserva1.getId());
        assertThat(reserva1).isEqualTo(reserva2);

        reserva2 = getReservaSample2();
        assertThat(reserva1).isNotEqualTo(reserva2);
    }

    @Test
    void clienteTest() {
        Reserva reserva = getReservaRandomSampleGenerator();
        Cliente clienteBack = getClienteRandomSampleGenerator();

        reserva.setCliente(clienteBack);
        assertThat(reserva.getCliente()).isEqualTo(clienteBack);

        reserva.cliente(null);
        assertThat(reserva.getCliente()).isNull();
    }

    @Test
    void canchaTest() {
        Reserva reserva = getReservaRandomSampleGenerator();
        Cancha canchaBack = getCanchaRandomSampleGenerator();

        reserva.setCancha(canchaBack);
        assertThat(reserva.getCancha()).isEqualTo(canchaBack);

        reserva.cancha(null);
        assertThat(reserva.getCancha()).isNull();
    }

    @Test
    void pagoTest() {
        Reserva reserva = getReservaRandomSampleGenerator();
        Pago pagoBack = getPagoRandomSampleGenerator();

        reserva.setPago(pagoBack);
        assertThat(reserva.getPago()).isEqualTo(pagoBack);
        assertThat(pagoBack.getReserva()).isEqualTo(reserva);

        reserva.pago(null);
        assertThat(reserva.getPago()).isNull();
        assertThat(pagoBack.getReserva()).isNull();
    }
}
