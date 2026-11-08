package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.CanchaTestSamples.*;
import static com.mycompany.myapp.domain.DeporteTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class DeporteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Deporte.class);
        Deporte deporte1 = getDeporteSample1();
        Deporte deporte2 = new Deporte();
        assertThat(deporte1).isNotEqualTo(deporte2);

        deporte2.setId(deporte1.getId());
        assertThat(deporte1).isEqualTo(deporte2);

        deporte2 = getDeporteSample2();
        assertThat(deporte1).isNotEqualTo(deporte2);
    }

    @Test
    void canchaTest() {
        Deporte deporte = getDeporteRandomSampleGenerator();
        Cancha canchaBack = getCanchaRandomSampleGenerator();

        deporte.addCancha(canchaBack);
        assertThat(deporte.getCanchas()).containsOnly(canchaBack);
        assertThat(canchaBack.getDeportes()).containsOnly(deporte);

        deporte.removeCancha(canchaBack);
        assertThat(deporte.getCanchas()).doesNotContain(canchaBack);
        assertThat(canchaBack.getDeportes()).doesNotContain(deporte);

        deporte.canchas(new HashSet<>(Set.of(canchaBack)));
        assertThat(deporte.getCanchas()).containsOnly(canchaBack);
        assertThat(canchaBack.getDeportes()).containsOnly(deporte);

        deporte.setCanchas(new HashSet<>());
        assertThat(deporte.getCanchas()).doesNotContain(canchaBack);
        assertThat(canchaBack.getDeportes()).doesNotContain(deporte);
    }
}
