package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Pago;
import com.mycompany.myapp.repository.PagoRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Pago}.
 */
@RestController
@RequestMapping("/api/pagos")
@Transactional(rollbackFor = Exception.class)
public class PagoResource {

    private static final Logger LOG = LoggerFactory.getLogger(PagoResource.class);

    private static final String ENTITY_NAME = "pago";

    @Value("${jhipster.clientApp.name:reservadecanchas}")
    private String applicationName;

    private final PagoRepository pagoRepository;

    public PagoResource(PagoRepository pagoRepository) {
        this.pagoRepository = pagoRepository;
    }

    /**
     * {@code POST  /pagos} : Create a new pago.
     *
     * @param pago the pago to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pago, or with status {@code 400 (Bad Request)} if the pago already has an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Pago> createPago(@Valid @RequestBody Pago pago) throws URISyntaxException {
        LOG.debug("REST request to save Pago : {}", pago);
        if (pago.getId() != null) {
            throw new BadRequestAlertException("A new pago cannot already have an ID", ENTITY_NAME, "idexists");
        }
        pago = pagoRepository.save(pago);
        return ResponseEntity.created(new URI("/api/pagos/" + pago.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, pago.getId().toString()))
            .body(pago);
    }

    /**
     * {@code PUT  /pagos/:id} : Updates an existing pago.
     *
     * @param id the id of the pago to save.
     * @param pago the pago to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pago,
     * or with status {@code 400 (Bad Request)} if the pago is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pago couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Pago> updatePago(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Pago pago)
        throws URISyntaxException {
        LOG.debug("REST request to update Pago : {}, {}", id, pago);
        if (pago.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pago.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pagoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        pago = pagoRepository.save(pago);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pago.getId().toString()))
            .body(pago);
    }

    /**
     * {@code PATCH  /pagos/:id} : Partial updates given fields of an existing pago, field will ignore if it is null
     *
     * @param id the id of the pago to save.
     * @param pago the pago to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pago,
     * or with status {@code 400 (Bad Request)} if the pago is not valid,
     * or with status {@code 404 (Not Found)} if the pago is not found,
     * or with status {@code 500 (Internal Server Error)} if the pago couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Pago> partialUpdatePago(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Pago pago
    ) throws URISyntaxException {
        LOG.debug("REST request to partially update Pago : {}, {}", id, pago);
        if (pago.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pago.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pagoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Pago> result = pagoRepository
            .findById(pago.getId())
            .map(existingPago -> {
                updateIfPresent(existingPago::setMonto, pago.getMonto());
                updateIfPresent(existingPago::setFechaPago, pago.getFechaPago());
                updateIfPresent(existingPago::setMetodoPago, pago.getMetodoPago());
                updateIfPresent(existingPago::setNumOperacion, pago.getNumOperacion());
                updateIfPresent(existingPago::setComprobanteUrl, pago.getComprobanteUrl());
                updateIfPresent(existingPago::setEstadoPago, pago.getEstadoPago());
                updateIfPresent(existingPago::setCreatedBy, pago.getCreatedBy());
                updateIfPresent(existingPago::setCreatedDate, pago.getCreatedDate());
                updateIfPresent(existingPago::setLastModifiedBy, pago.getLastModifiedBy());
                updateIfPresent(existingPago::setLastModifiedDate, pago.getLastModifiedDate());

                return existingPago;
            })
            .map(pagoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pago.getId().toString())
        );
    }

    /**
     * {@code GET  /pagos} : get all the Pagos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Pagos in body.
     */
    @GetMapping("")
    public List<Pago> getAllPagos() {
        LOG.debug("REST request to get all Pagos");
        return pagoRepository.findAll();
    }

    /**
     * {@code GET  /pagos/:id} : get the "id" pago.
     *
     * @param id the id of the pago to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pago, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Pago> getPago(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Pago : {}", id);
        Optional<Pago> pago = pagoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(pago);
    }

    /**
     * {@code DELETE  /pagos/:id} : delete the "id" pago.
     *
     * @param id the id of the pago to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePago(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Pago : {}", id);
        pagoRepository.deleteById(id);
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
