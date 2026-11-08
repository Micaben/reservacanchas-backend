package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Deporte;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Deporte entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DeporteRepository extends JpaRepository<Deporte, Long> {}
