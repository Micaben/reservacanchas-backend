package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Cancha;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface CanchaRepositoryWithBagRelationships {
    Optional<Cancha> fetchBagRelationships(Optional<Cancha> cancha);

    List<Cancha> fetchBagRelationships(List<Cancha> canchas);

    Page<Cancha> fetchBagRelationships(Page<Cancha> canchas);
}
