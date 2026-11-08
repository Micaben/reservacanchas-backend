package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.CanchaTestSamples.*;
import static com.mycompany.myapp.domain.DeporteTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class CanchaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Cancha.class);
        Cancha cancha1 = getCanchaSample1();
        Cancha cancha2 = new Cancha();
        assertThat(cancha1).isNotEqualTo(cancha2);

        cancha2.setId(cancha1.getId());
        assertThat(cancha1).isEqualTo(cancha2);

        cancha2 = getCanchaSample2();
        assertThat(cancha1).isNotEqualTo(cancha2);
    }

    @Test
    void deporteTest() {
        Cancha cancha = getCanchaRandomSampleGenerator();
        Deporte deporteBack = getDeporteRandomSampleGenerator();

        cancha.addDeporte(deporteBack);
        assertThat(cancha.getDeportes()).containsOnly(deporteBack);

        cancha.removeDeporte(deporteBack);
        assertThat(cancha.getDeportes()).doesNotContain(deporteBack);

        cancha.deportes(new HashSet<>(Set.of(deporteBack)));
        assertThat(cancha.getDeportes()).containsOnly(deporteBack);

        cancha.setDeportes(new HashSet<>());
        assertThat(cancha.getDeportes()).doesNotContain(deporteBack);
    }
}
