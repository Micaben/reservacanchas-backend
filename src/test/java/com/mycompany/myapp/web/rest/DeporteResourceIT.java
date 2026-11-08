package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.DeporteAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Deporte;
import com.mycompany.myapp.domain.enumeration.EstadoGeneral;
import com.mycompany.myapp.repository.DeporteRepository;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link DeporteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DeporteResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPCION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPCION = "BBBBBBBBBB";

    private static final EstadoGeneral DEFAULT_ESTADO = EstadoGeneral.ACTIVO;
    private static final EstadoGeneral UPDATED_ESTADO = EstadoGeneral.INACTIVO;

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.ofEpochMilli(1792460589761L);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_LAST_MODIFIED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED_DATE = Instant.ofEpochMilli(1792460589761L);

    private static final String ENTITY_API_URL = "/api/deportes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + 2L * Integer.MAX_VALUE);

    @Autowired
    private ObjectMapper om;

    @Autowired
    private DeporteRepository deporteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDeporteMockMvc;

    private Deporte deporte;

    private Deporte insertedDeporte;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Deporte createEntity() {
        return new Deporte()
            .nombre(DEFAULT_NOMBRE)
            .descripcion(DEFAULT_DESCRIPCION)
            .estado(DEFAULT_ESTADO)
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
    public static Deporte createUpdatedEntity() {
        return new Deporte()
            .nombre(UPDATED_NOMBRE)
            .descripcion(UPDATED_DESCRIPCION)
            .estado(UPDATED_ESTADO)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
    }

    @BeforeEach
    void initTest() {
        deporte = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedDeporte != null) {
            deporteRepository.delete(insertedDeporte);
            insertedDeporte = null;
        }
    }

    @Test
    @Transactional
    void createDeporte() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Deporte
        var returnedDeporte = om.readValue(
            restDeporteMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(deporte)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Deporte.class
        );

        // Validate the Deporte in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertDeporteUpdatableFieldsEquals(returnedDeporte, getPersistedDeporte(returnedDeporte));

        insertedDeporte = returnedDeporte;
    }

    @Test
    @Transactional
    void createDeporteWithExistingId() throws Exception {
        // Create the Deporte with an existing ID
        deporte.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDeporteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(deporte)))
            .andExpect(status().isBadRequest());

        // Validate the Deporte in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNombreIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        deporte.setNombre(null);

        // Create the Deporte, which fails.

        restDeporteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(deporte)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDeportes() throws Exception {
        // Initialize the database
        insertedDeporte = deporteRepository.saveAndFlush(deporte);

        // Get all the deporteList
        restDeporteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(deporte.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION)))
            .andExpect(jsonPath("$.[*].estado").value(hasItem(DEFAULT_ESTADO.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @Test
    @Transactional
    void getDeporte() throws Exception {
        // Initialize the database
        insertedDeporte = deporteRepository.saveAndFlush(deporte);

        // Get the deporte
        restDeporteMockMvc
            .perform(get(ENTITY_API_URL_ID, deporte.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(deporte.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.descripcion").value(DEFAULT_DESCRIPCION))
            .andExpect(jsonPath("$.estado").value(DEFAULT_ESTADO.toString()))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingDeporte() throws Exception {
        // Get the deporte
        restDeporteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDeporte() throws Exception {
        // Initialize the database
        insertedDeporte = deporteRepository.saveAndFlush(deporte);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the deporte
        Deporte updatedDeporte = deporteRepository.findById(deporte.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedDeporte are not directly saved in db
        em.detach(updatedDeporte);
        updatedDeporte
            .nombre(UPDATED_NOMBRE)
            .descripcion(UPDATED_DESCRIPCION)
            .estado(UPDATED_ESTADO)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restDeporteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDeporte.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedDeporte))
            )
            .andExpect(status().isOk());

        // Validate the Deporte in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedDeporteToMatchAllProperties(updatedDeporte);
    }

    @Test
    @Transactional
    void putNonExistingDeporte() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        deporte.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDeporteMockMvc
            .perform(put(ENTITY_API_URL_ID, deporte.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(deporte)))
            .andExpect(status().isBadRequest());

        // Validate the Deporte in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDeporte() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        deporte.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeporteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(deporte))
            )
            .andExpect(status().isBadRequest());

        // Validate the Deporte in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDeporte() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        deporte.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeporteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(deporte)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Deporte in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDeporteWithPatch() throws Exception {
        // Initialize the database
        insertedDeporte = deporteRepository.saveAndFlush(deporte);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the deporte using partial update
        Deporte partialUpdatedDeporte = new Deporte();
        partialUpdatedDeporte.setId(deporte.getId());

        partialUpdatedDeporte
            .nombre(UPDATED_NOMBRE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY);

        restDeporteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDeporte.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDeporte))
            )
            .andExpect(status().isOk());

        // Validate the Deporte in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDeporteUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedDeporte, deporte), getPersistedDeporte(deporte));
    }

    @Test
    @Transactional
    void fullUpdateDeporteWithPatch() throws Exception {
        // Initialize the database
        insertedDeporte = deporteRepository.saveAndFlush(deporte);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the deporte using partial update
        Deporte partialUpdatedDeporte = new Deporte();
        partialUpdatedDeporte.setId(deporte.getId());

        partialUpdatedDeporte
            .nombre(UPDATED_NOMBRE)
            .descripcion(UPDATED_DESCRIPCION)
            .estado(UPDATED_ESTADO)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restDeporteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDeporte.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDeporte))
            )
            .andExpect(status().isOk());

        // Validate the Deporte in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDeporteUpdatableFieldsEquals(partialUpdatedDeporte, getPersistedDeporte(partialUpdatedDeporte));
    }

    @Test
    @Transactional
    void patchNonExistingDeporte() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        deporte.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDeporteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, deporte.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(deporte))
            )
            .andExpect(status().isBadRequest());

        // Validate the Deporte in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDeporte() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        deporte.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeporteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(deporte))
            )
            .andExpect(status().isBadRequest());

        // Validate the Deporte in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDeporte() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        deporte.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeporteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(deporte)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Deporte in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDeporte() throws Exception {
        // Initialize the database
        insertedDeporte = deporteRepository.saveAndFlush(deporte);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the deporte
        restDeporteMockMvc
            .perform(delete(ENTITY_API_URL_ID, deporte.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return deporteRepository.count();
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

    protected Deporte getPersistedDeporte(Deporte deporte) {
        return deporteRepository.findById(deporte.getId()).orElseThrow();
    }

    protected void assertPersistedDeporteToMatchAllProperties(Deporte expectedDeporte) {
        assertDeporteAllPropertiesEquals(expectedDeporte, getPersistedDeporte(expectedDeporte));
    }

    protected void assertPersistedDeporteToMatchUpdatableProperties(Deporte expectedDeporte) {
        assertDeporteAllUpdatablePropertiesEquals(expectedDeporte, getPersistedDeporte(expectedDeporte));
    }
}
