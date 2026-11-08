package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Deporte;
import com.mycompany.myapp.repository.DeporteRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Consumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Deporte}.
 */
@RestController
@RequestMapping("/api/deportes")
@Transactional(rollbackFor = Exception.class)
public class DeporteResource {

    private static final Logger LOG = LoggerFactory.getLogger(DeporteResource.class);

    private static final String ENTITY_NAME = "deporte";

    @Value("${jhipster.clientApp.name:reservadecanchas}")
    private String applicationName;

    private final DeporteRepository deporteRepository;

    public DeporteResource(DeporteRepository deporteRepository) {
        this.deporteRepository = deporteRepository;
    }

    /**
     * {@code POST  /deportes} : Create a new deporte.
     *
     * @param deporte the deporte to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new deporte, or with status {@code 400 (Bad Request)} if the deporte already has an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Deporte> createDeporte(@Valid @RequestBody Deporte deporte) throws URISyntaxException {
        LOG.debug("REST request to save Deporte : {}", deporte);
        if (deporte.getId() != null) {
            throw new BadRequestAlertException("A new deporte cannot already have an ID", ENTITY_NAME, "idexists");
        }
        deporte = deporteRepository.save(deporte);
        return ResponseEntity.created(new URI("/api/deportes/" + deporte.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, deporte.getId().toString()))
            .body(deporte);
    }

    /**
     * {@code PUT  /deportes/:id} : Updates an existing deporte.
     *
     * @param id the id of the deporte to save.
     * @param deporte the deporte to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated deporte,
     * or with status {@code 400 (Bad Request)} if the deporte is not valid,
     * or with status {@code 500 (Internal Server Error)} if the deporte couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Deporte> updateDeporte(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Deporte deporte
    ) throws URISyntaxException {
        LOG.debug("REST request to update Deporte : {}, {}", id, deporte);
        if (deporte.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, deporte.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!deporteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        deporte = deporteRepository.save(deporte);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, deporte.getId().toString()))
            .body(deporte);
    }

    /**
     * {@code PATCH  /deportes/:id} : Partial updates given fields of an existing deporte, field will ignore if it is null
     *
     * @param id the id of the deporte to save.
     * @param deporte the deporte to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated deporte,
     * or with status {@code 400 (Bad Request)} if the deporte is not valid,
     * or with status {@code 404 (Not Found)} if the deporte is not found,
     * or with status {@code 500 (Internal Server Error)} if the deporte couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Deporte> partialUpdateDeporte(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Deporte deporte
    ) throws URISyntaxException {
        LOG.debug("REST request to partially update Deporte : {}, {}", id, deporte);
        if (deporte.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, deporte.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!deporteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Deporte> result = deporteRepository
            .findById(deporte.getId())
            .map(existingDeporte -> {
                updateIfPresent(existingDeporte::setNombre, deporte.getNombre());
                updateIfPresent(existingDeporte::setDescripcion, deporte.getDescripcion());
                updateIfPresent(existingDeporte::setEstado, deporte.getEstado());
                updateIfPresent(existingDeporte::setCreatedBy, deporte.getCreatedBy());
                updateIfPresent(existingDeporte::setCreatedDate, deporte.getCreatedDate());
                updateIfPresent(existingDeporte::setLastModifiedBy, deporte.getLastModifiedBy());
                updateIfPresent(existingDeporte::setLastModifiedDate, deporte.getLastModifiedDate());

                return existingDeporte;
            })
            .map(deporteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, deporte.getId().toString())
        );
    }

    /**
     * {@code GET  /deportes} : get all the Deportes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Deportes in body.
     */
    @GetMapping("")
    public List<Deporte> getAllDeportes() {
        LOG.debug("REST request to get all Deportes");
        return deporteRepository.findAll();
    }

    /**
     * {@code GET  /deportes/:id} : get the "id" deporte.
     *
     * @param id the id of the deporte to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the deporte, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Deporte> getDeporte(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Deporte : {}", id);
        Optional<Deporte> deporte = deporteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(deporte);
    }

    /**
     * {@code DELETE  /deportes/:id} : delete the "id" deporte.
     *
     * @param id the id of the deporte to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeporte(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Deporte : {}", id);
        deporteRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    private <T> void updateIfPresent(Consumer<T> setter, T value) {
        if (value != null) {
            setter.accept(value);
        }
    }
}
