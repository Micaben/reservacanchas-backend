package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Cancha;
import com.mycompany.myapp.repository.CanchaRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Cancha}.
 */
@RestController
@RequestMapping("/api/canchas")
@Transactional(rollbackFor = Exception.class)
public class CanchaResource {

    private static final Logger LOG = LoggerFactory.getLogger(CanchaResource.class);

    private static final String ENTITY_NAME = "cancha";

    @Value("${jhipster.clientApp.name:reservadecanchas}")
    private String applicationName;

    private final CanchaRepository canchaRepository;

    public CanchaResource(CanchaRepository canchaRepository) {
        this.canchaRepository = canchaRepository;
    }

    /**
     * {@code POST  /canchas} : Create a new cancha.
     *
     * @param cancha the cancha to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new cancha, or with status {@code 400 (Bad Request)} if the cancha already has an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Cancha> createCancha(@Valid @RequestBody Cancha cancha) throws URISyntaxException {
        LOG.debug("REST request to save Cancha : {}", cancha);
        if (cancha.getId() != null) {
            throw new BadRequestAlertException("A new cancha cannot already have an ID", ENTITY_NAME, "idexists");
        }
        cancha = canchaRepository.save(cancha);
        return ResponseEntity.created(new URI("/api/canchas/" + cancha.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, cancha.getId().toString()))
            .body(cancha);
    }

    /**
     * {@code PUT  /canchas/:id} : Updates an existing cancha.
     *
     * @param id the id of the cancha to save.
     * @param cancha the cancha to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cancha,
     * or with status {@code 400 (Bad Request)} if the cancha is not valid,
     * or with status {@code 500 (Internal Server Error)} if the cancha couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Cancha> updateCancha(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Cancha cancha
    ) throws URISyntaxException {
        LOG.debug("REST request to update Cancha : {}, {}", id, cancha);
        if (cancha.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cancha.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!canchaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        cancha = canchaRepository.save(cancha);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cancha.getId().toString()))
            .body(cancha);
    }

    /**
     * {@code PATCH  /canchas/:id} : Partial updates given fields of an existing cancha, field will ignore if it is null
     *
     * @param id the id of the cancha to save.
     * @param cancha the cancha to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cancha,
     * or with status {@code 400 (Bad Request)} if the cancha is not valid,
     * or with status {@code 404 (Not Found)} if the cancha is not found,
     * or with status {@code 500 (Internal Server Error)} if the cancha couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Cancha> partialUpdateCancha(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Cancha cancha
    ) throws URISyntaxException {
        LOG.debug("REST request to partially update Cancha : {}, {}", id, cancha);
        if (cancha.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cancha.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!canchaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Cancha> result = canchaRepository
            .findById(cancha.getId())
            .map(existingCancha -> {
                updateIfPresent(existingCancha::setCodigo, cancha.getCodigo());
                updateIfPresent(existingCancha::setNombre, cancha.getNombre());
                updateIfPresent(existingCancha::setDescripcion, cancha.getDescripcion());
                updateIfPresent(existingCancha::setPrecioHora, cancha.getPrecioHora());
                updateIfPresent(existingCancha::setCapacidad, cancha.getCapacidad());
                updateIfPresent(existingCancha::setImagenUrl, cancha.getImagenUrl());
                updateIfPresent(existingCancha::setEstado, cancha.getEstado());
                updateIfPresent(existingCancha::setCreatedBy, cancha.getCreatedBy());
                updateIfPresent(existingCancha::setCreatedDate, cancha.getCreatedDate());
                updateIfPresent(existingCancha::setLastModifiedBy, cancha.getLastModifiedBy());
                updateIfPresent(existingCancha::setLastModifiedDate, cancha.getLastModifiedDate());

                return existingCancha;
            })
            .map(canchaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cancha.getId().toString())
        );
    }

    /**
     * {@code GET  /canchas} : get all the Canchas.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Canchas in body.
     */
    @GetMapping("")
    public List<Cancha> getAllCanchas(@RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload) {
        LOG.debug("REST request to get all Canchas");
        if (eagerload) {
            return canchaRepository.findAllWithEagerRelationships();
        } else {
            return canchaRepository.findAll();
        }
    }

    /**
     * {@code GET  /canchas/:id} : get the "id" cancha.
     *
     * @param id the id of the cancha to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cancha, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Cancha> getCancha(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Cancha : {}", id);
        Optional<Cancha> cancha = canchaRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(cancha);
    }

    /**
     * {@code DELETE  /canchas/:id} : delete the "id" cancha.
     *
     * @param id the id of the cancha to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCancha(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Cancha : {}", id);
        canchaRepository.deleteById(id);
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
