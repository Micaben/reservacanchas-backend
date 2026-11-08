package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.CanchaAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Cancha;
import com.mycompany.myapp.domain.enumeration.EstadoCancha;
import com.mycompany.myapp.repository.CanchaRepository;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

/**
 * Integration tests for the {@link CanchaResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class CanchaResourceIT {

    private static final String DEFAULT_CODIGO = "AAAAAAAAAA";
    private static final String UPDATED_CODIGO = "BBBBBBBBBB";

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPCION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPCION = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_PRECIO_HORA = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRECIO_HORA = new BigDecimal(2);

    private static final Integer DEFAULT_CAPACIDAD = 1;
    private static final Integer UPDATED_CAPACIDAD = 2;

    private static final String DEFAULT_IMAGEN_URL = "AAAAAAAAAA";
    private static final String UPDATED_IMAGEN_URL = "BBBBBBBBBB";

    private static final EstadoCancha DEFAULT_ESTADO = EstadoCancha.DISPONIBLE;
    private static final EstadoCancha UPDATED_ESTADO = EstadoCancha.MANTENIMIENTO;

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.ofEpochMilli(1792460589761L);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_LAST_MODIFIED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED_DATE = Instant.ofEpochMilli(1792460589761L);

    private static final String ENTITY_API_URL = "/api/canchas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + 2L * Integer.MAX_VALUE);

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CanchaRepository canchaRepository;

    @Mock
    private CanchaRepository canchaRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCanchaMockMvc;

    private Cancha cancha;

    private Cancha insertedCancha;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cancha createEntity() {
        return new Cancha()
            .codigo(DEFAULT_CODIGO)
            .nombre(DEFAULT_NOMBRE)
            .descripcion(DEFAULT_DESCRIPCION)
            .precioHora(DEFAULT_PRECIO_HORA)
            .capacidad(DEFAULT_CAPACIDAD)
            .imagenUrl(DEFAULT_IMAGEN_URL)
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
    public static Cancha createUpdatedEntity() {
        return new Cancha()
            .codigo(UPDATED_CODIGO)
            .nombre(UPDATED_NOMBRE)
            .descripcion(UPDATED_DESCRIPCION)
            .precioHora(UPDATED_PRECIO_HORA)
            .capacidad(UPDATED_CAPACIDAD)
            .imagenUrl(UPDATED_IMAGEN_URL)
            .estado(UPDATED_ESTADO)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
    }

    @BeforeEach
    void initTest() {
        cancha = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedCancha != null) {
            canchaRepository.delete(insertedCancha);
            insertedCancha = null;
        }
    }

    @Test
    @Transactional
    void createCancha() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Cancha
        var returnedCancha = om.readValue(
            restCanchaMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cancha)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Cancha.class
        );

        // Validate the Cancha in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertCanchaUpdatableFieldsEquals(returnedCancha, getPersistedCancha(returnedCancha));

        insertedCancha = returnedCancha;
    }

    @Test
    @Transactional
    void createCanchaWithExistingId() throws Exception {
        // Create the Cancha with an existing ID
        cancha.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCanchaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cancha)))
            .andExpect(status().isBadRequest());

        // Validate the Cancha in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCodigoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        cancha.setCodigo(null);

        // Create the Cancha, which fails.

        restCanchaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cancha)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNombreIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        cancha.setNombre(null);

        // Create the Cancha, which fails.

        restCanchaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cancha)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPrecioHoraIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        cancha.setPrecioHora(null);

        // Create the Cancha, which fails.

        restCanchaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cancha)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCapacidadIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        cancha.setCapacidad(null);

        // Create the Cancha, which fails.

        restCanchaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cancha)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCanchas() throws Exception {
        // Initialize the database
        insertedCancha = canchaRepository.saveAndFlush(cancha);

        // Get all the canchaList
        restCanchaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cancha.getId().intValue())))
            .andExpect(jsonPath("$.[*].codigo").value(hasItem(DEFAULT_CODIGO)))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION)))
            .andExpect(jsonPath("$.[*].precioHora").value(hasItem(sameNumber(DEFAULT_PRECIO_HORA))))
            .andExpect(jsonPath("$.[*].capacidad").value(hasItem(DEFAULT_CAPACIDAD)))
            .andExpect(jsonPath("$.[*].imagenUrl").value(hasItem(DEFAULT_IMAGEN_URL)))
            .andExpect(jsonPath("$.[*].estado").value(hasItem(DEFAULT_ESTADO.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCanchasWithEagerRelationshipsIsEnabled() throws Exception {
        when(canchaRepositoryMock.findAllWithEagerRelationships()).thenReturn(new ArrayList<>());

        restCanchaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(canchaRepositoryMock, times(1)).findAllWithEagerRelationships();
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCanchasWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(canchaRepositoryMock.findAllWithEagerRelationships()).thenReturn(new ArrayList<>());

        restCanchaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(canchaRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getCancha() throws Exception {
        // Initialize the database
        insertedCancha = canchaRepository.saveAndFlush(cancha);

        // Get the cancha
        restCanchaMockMvc
            .perform(get(ENTITY_API_URL_ID, cancha.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(cancha.getId().intValue()))
            .andExpect(jsonPath("$.codigo").value(DEFAULT_CODIGO))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.descripcion").value(DEFAULT_DESCRIPCION))
            .andExpect(jsonPath("$.precioHora").value(sameNumber(DEFAULT_PRECIO_HORA)))
            .andExpect(jsonPath("$.capacidad").value(DEFAULT_CAPACIDAD))
            .andExpect(jsonPath("$.imagenUrl").value(DEFAULT_IMAGEN_URL))
            .andExpect(jsonPath("$.estado").value(DEFAULT_ESTADO.toString()))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCancha() throws Exception {
        // Get the cancha
        restCanchaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCancha() throws Exception {
        // Initialize the database
        insertedCancha = canchaRepository.saveAndFlush(cancha);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the cancha
        Cancha updatedCancha = canchaRepository.findById(cancha.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCancha are not directly saved in db
        em.detach(updatedCancha);
        updatedCancha
            .codigo(UPDATED_CODIGO)
            .nombre(UPDATED_NOMBRE)
            .descripcion(UPDATED_DESCRIPCION)
            .precioHora(UPDATED_PRECIO_HORA)
            .capacidad(UPDATED_CAPACIDAD)
            .imagenUrl(UPDATED_IMAGEN_URL)
            .estado(UPDATED_ESTADO)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restCanchaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCancha.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedCancha))
            )
            .andExpect(status().isOk());

        // Validate the Cancha in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCanchaToMatchAllProperties(updatedCancha);
    }

    @Test
    @Transactional
    void putNonExistingCancha() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cancha.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCanchaMockMvc
            .perform(put(ENTITY_API_URL_ID, cancha.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cancha)))
            .andExpect(status().isBadRequest());

        // Validate the Cancha in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCancha() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cancha.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCanchaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(cancha))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cancha in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCancha() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cancha.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCanchaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cancha)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cancha in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCanchaWithPatch() throws Exception {
        // Initialize the database
        insertedCancha = canchaRepository.saveAndFlush(cancha);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the cancha using partial update
        Cancha partialUpdatedCancha = new Cancha();
        partialUpdatedCancha.setId(cancha.getId());

        partialUpdatedCancha
            .codigo(UPDATED_CODIGO)
            .nombre(UPDATED_NOMBRE)
            .capacidad(UPDATED_CAPACIDAD)
            .estado(UPDATED_ESTADO)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY);

        restCanchaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCancha.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCancha))
            )
            .andExpect(status().isOk());

        // Validate the Cancha in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCanchaUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedCancha, cancha), getPersistedCancha(cancha));
    }

    @Test
    @Transactional
    void fullUpdateCanchaWithPatch() throws Exception {
        // Initialize the database
        insertedCancha = canchaRepository.saveAndFlush(cancha);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the cancha using partial update
        Cancha partialUpdatedCancha = new Cancha();
        partialUpdatedCancha.setId(cancha.getId());

        partialUpdatedCancha
            .codigo(UPDATED_CODIGO)
            .nombre(UPDATED_NOMBRE)
            .descripcion(UPDATED_DESCRIPCION)
            .precioHora(UPDATED_PRECIO_HORA)
            .capacidad(UPDATED_CAPACIDAD)
            .imagenUrl(UPDATED_IMAGEN_URL)
            .estado(UPDATED_ESTADO)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restCanchaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCancha.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCancha))
            )
            .andExpect(status().isOk());

        // Validate the Cancha in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCanchaUpdatableFieldsEquals(partialUpdatedCancha, getPersistedCancha(partialUpdatedCancha));
    }

    @Test
    @Transactional
    void patchNonExistingCancha() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cancha.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCanchaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, cancha.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(cancha))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cancha in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCancha() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cancha.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCanchaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(cancha))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cancha in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCancha() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cancha.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCanchaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(cancha)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cancha in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCancha() throws Exception {
        // Initialize the database
        insertedCancha = canchaRepository.saveAndFlush(cancha);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the cancha
        restCanchaMockMvc
            .perform(delete(ENTITY_API_URL_ID, cancha.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return canchaRepository.count();
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

    protected Cancha getPersistedCancha(Cancha cancha) {
        return canchaRepository.findById(cancha.getId()).orElseThrow();
    }

    protected void assertPersistedCanchaToMatchAllProperties(Cancha expectedCancha) {
        assertCanchaAllPropertiesEquals(expectedCancha, getPersistedCancha(expectedCancha));
    }

    protected void assertPersistedCanchaToMatchUpdatableProperties(Cancha expectedCancha) {
        assertCanchaAllUpdatablePropertiesEquals(expectedCancha, getPersistedCancha(expectedCancha));
    }
}
