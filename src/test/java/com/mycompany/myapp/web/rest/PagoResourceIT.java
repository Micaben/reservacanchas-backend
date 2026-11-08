package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.PagoAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Pago;
import com.mycompany.myapp.domain.enumeration.EstadoPago;
import com.mycompany.myapp.domain.enumeration.MetodoPago;
import com.mycompany.myapp.repository.PagoRepository;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

/**
 * Integration tests for the {@link PagoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PagoResourceIT {

    private static final BigDecimal DEFAULT_MONTO = new BigDecimal(1);
    private static final BigDecimal UPDATED_MONTO = new BigDecimal(2);

    private static final Instant DEFAULT_FECHA_PAGO = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_FECHA_PAGO = Instant.ofEpochMilli(1792460589761L);

    private static final MetodoPago DEFAULT_METODO_PAGO = MetodoPago.EFECTIVO;
    private static final MetodoPago UPDATED_METODO_PAGO = MetodoPago.TRANSFERENCIA;

    private static final String DEFAULT_NUM_OPERACION = "AAAAAAAAAA";
    private static final String UPDATED_NUM_OPERACION = "BBBBBBBBBB";

    private static final String DEFAULT_COMPROBANTE_URL = "AAAAAAAAAA";
    private static final String UPDATED_COMPROBANTE_URL = "BBBBBBBBBB";

    private static final EstadoPago DEFAULT_ESTADO_PAGO = EstadoPago.PENDIENTE;
    private static final EstadoPago UPDATED_ESTADO_PAGO = EstadoPago.PAGADO;

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.ofEpochMilli(1792460589761L);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_LAST_MODIFIED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED_DATE = Instant.ofEpochMilli(1792460589761L);

    private static final String ENTITY_API_URL = "/api/pagos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + 2L * Integer.MAX_VALUE);

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPagoMockMvc;

    private Pago pago;

    private Pago insertedPago;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pago createEntity() {
        return new Pago()
            .monto(DEFAULT_MONTO)
            .fechaPago(DEFAULT_FECHA_PAGO)
            .metodoPago(DEFAULT_METODO_PAGO)
            .numOperacion(DEFAULT_NUM_OPERACION)
            .comprobanteUrl(DEFAULT_COMPROBANTE_URL)
            .estadoPago(DEFAULT_ESTADO_PAGO)
            .createdBy(DEFAULT_CREATED_BY)
            .createdDate(DEFAULT_CREATED_DATE)
            .lastModifiedBy(DEFAULT_LAST_MODIFIED_BY)
            .lastModifiedDate(DEFAULT_LAST_MODIFIED_DATE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pago createUpdatedEntity() {
        return new Pago()
            .monto(UPDATED_MONTO)
            .fechaPago(UPDATED_FECHA_PAGO)
            .metodoPago(UPDATED_METODO_PAGO)
            .numOperacion(UPDATED_NUM_OPERACION)
            .comprobanteUrl(UPDATED_COMPROBANTE_URL)
            .estadoPago(UPDATED_ESTADO_PAGO)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
    }

    @BeforeEach
    void initTest() {
        pago = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedPago != null) {
            pagoRepository.delete(insertedPago);
            insertedPago = null;
        }
    }

    @Test
    @Transactional
    void createPago() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Pago
        var returnedPago = om.readValue(
            restPagoMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(pago)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Pago.class
        );

        // Validate the Pago in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertPagoUpdatableFieldsEquals(returnedPago, getPersistedPago(returnedPago));

        insertedPago = returnedPago;
    }

    @Test
    @Transactional
    void createPagoWithExistingId() throws Exception {
        // Create the Pago with an existing ID
        pago.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPagoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(pago)))
            .andExpect(status().isBadRequest());

        // Validate the Pago in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkMontoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        pago.setMonto(null);

        // Create the Pago, which fails.

        restPagoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(pago)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMetodoPagoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        pago.setMetodoPago(null);

        // Create the Pago, which fails.

        restPagoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(pago)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPagos() throws Exception {
        // Initialize the database
        insertedPago = pagoRepository.saveAndFlush(pago);

        // Get all the pagoList
        restPagoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pago.getId().intValue())))
            .andExpect(jsonPath("$.[*].monto").value(hasItem(sameNumber(DEFAULT_MONTO))))
            .andExpect(jsonPath("$.[*].fechaPago").value(hasItem(DEFAULT_FECHA_PAGO.toString())))
            .andExpect(jsonPath("$.[*].metodoPago").value(hasItem(DEFAULT_METODO_PAGO.toString())))
            .andExpect(jsonPath("$.[*].numOperacion").value(hasItem(DEFAULT_NUM_OPERACION)))
            .andExpect(jsonPath("$.[*].comprobanteUrl").value(hasItem(DEFAULT_COMPROBANTE_URL)))
            .andExpect(jsonPath("$.[*].estadoPago").value(hasItem(DEFAULT_ESTADO_PAGO.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @Test
    @Transactional
    void getPago() throws Exception {
        // Initialize the database
        insertedPago = pagoRepository.saveAndFlush(pago);

        // Get the pago
        restPagoMockMvc
            .perform(get(ENTITY_API_URL_ID, pago.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pago.getId().intValue()))
            .andExpect(jsonPath("$.monto").value(sameNumber(DEFAULT_MONTO)))
            .andExpect(jsonPath("$.fechaPago").value(DEFAULT_FECHA_PAGO.toString()))
            .andExpect(jsonPath("$.metodoPago").value(DEFAULT_METODO_PAGO.toString()))
            .andExpect(jsonPath("$.numOperacion").value(DEFAULT_NUM_OPERACION))
            .andExpect(jsonPath("$.comprobanteUrl").value(DEFAULT_COMPROBANTE_URL))
            .andExpect(jsonPath("$.estadoPago").value(DEFAULT_ESTADO_PAGO.toString()))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPago() throws Exception {
        // Get the pago
        restPagoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPago() throws Exception {
        // Initialize the database
        insertedPago = pagoRepository.saveAndFlush(pago);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the pago
        Pago updatedPago = pagoRepository.findById(pago.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPago are not directly saved in db
        em.detach(updatedPago);
        updatedPago
            .monto(UPDATED_MONTO)
            .fechaPago(UPDATED_FECHA_PAGO)
            .metodoPago(UPDATED_METODO_PAGO)
            .numOperacion(UPDATED_NUM_OPERACION)
            .comprobanteUrl(UPDATED_COMPROBANTE_URL)
            .estadoPago(UPDATED_ESTADO_PAGO)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restPagoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPago.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedPago))
            )
            .andExpect(status().isOk());

        // Validate the Pago in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPagoToMatchAllProperties(updatedPago);
    }

    @Test
    @Transactional
    void putNonExistingPago() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pago.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPagoMockMvc
            .perform(put(ENTITY_API_URL_ID, pago.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(pago)))
            .andExpect(status().isBadRequest());

        // Validate the Pago in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPago() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pago.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPagoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(pago))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pago in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPago() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pago.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPagoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(pago)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pago in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePagoWithPatch() throws Exception {
        // Initialize the database
        insertedPago = pagoRepository.saveAndFlush(pago);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the pago using partial update
        Pago partialUpdatedPago = new Pago();
        partialUpdatedPago.setId(pago.getId());

        partialUpdatedPago
            .numOperacion(UPDATED_NUM_OPERACION)
            .comprobanteUrl(UPDATED_COMPROBANTE_URL)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restPagoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPago.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPago))
            )
            .andExpect(status().isOk());

        // Validate the Pago in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPagoUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedPago, pago), getPersistedPago(pago));
    }

    @Test
    @Transactional
    void fullUpdatePagoWithPatch() throws Exception {
        // Initialize the database
        insertedPago = pagoRepository.saveAndFlush(pago);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the pago using partial update
        Pago partialUpdatedPago = new Pago();
        partialUpdatedPago.setId(pago.getId());

        partialUpdatedPago
            .monto(UPDATED_MONTO)
            .fechaPago(UPDATED_FECHA_PAGO)
            .metodoPago(UPDATED_METODO_PAGO)
            .numOperacion(UPDATED_NUM_OPERACION)
            .comprobanteUrl(UPDATED_COMPROBANTE_URL)
            .estadoPago(UPDATED_ESTADO_PAGO)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restPagoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPago.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPago))
            )
            .andExpect(status().isOk());

        // Validate the Pago in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPagoUpdatableFieldsEquals(partialUpdatedPago, getPersistedPago(partialUpdatedPago));
    }

    @Test
    @Transactional
    void patchNonExistingPago() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pago.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPagoMockMvc
            .perform(patch(ENTITY_API_URL_ID, pago.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(pago)))
            .andExpect(status().isBadRequest());

        // Validate the Pago in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPago() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pago.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPagoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(pago))
            )
            .andExpect(status().isBadRequest());

        // Validate the Pago in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPago() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        pago.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPagoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(pago)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Pago in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePago() throws Exception {
        // Initialize the database
        insertedPago = pagoRepository.saveAndFlush(pago);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the pago
        restPagoMockMvc
            .perform(delete(ENTITY_API_URL_ID, pago.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return pagoRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Pago getPersistedPago(Pago pago) {
        return pagoRepository.findById(pago.getId()).orElseThrow();
    }

    protected void assertPersistedPagoToMatchAllProperties(Pago expectedPago) {
        assertPagoAllPropertiesEquals(expectedPago, getPersistedPago(expectedPago));
    }

    protected void assertPersistedPagoToMatchUpdatableProperties(Pago expectedPago) {
        assertPagoAllUpdatablePropertiesEquals(expectedPago, getPersistedPago(expectedPago));
    }
}
