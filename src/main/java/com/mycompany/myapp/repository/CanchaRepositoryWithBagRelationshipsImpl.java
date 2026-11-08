package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Cancha;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class CanchaRepositoryWithBagRelationshipsImpl implements CanchaRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String CANCHAS_PARAMETER = "canchas";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Cancha> fetchBagRelationships(Optional<Cancha> cancha) {
        return cancha.map(this::fetchDeportes);
    }

    @Override
    public Page<Cancha> fetchBagRelationships(Page<Cancha> canchas) {
        return new PageImpl<>(fetchBagRelationships(canchas.getContent()), canchas.getPageable(), canchas.getTotalElements());
    }

    @Override
    public List<Cancha> fetchBagRelationships(List<Cancha> canchas) {
        return Optional.of(canchas).map(this::fetchDeportes).orElse(List.of());
    }

    Cancha fetchDeportes(Cancha result) {
        return entityManager
            .createQuery("select cancha from Cancha cancha left join fetch cancha.deportes where cancha.id = :id", Cancha.class)
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Cancha> fetchDeportes(List<Cancha> canchas) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, canchas.size()).forEach(index -> order.put(canchas.get(index).getId(), index));
        List<Cancha> result = entityManager
            .createQuery("select cancha from Cancha cancha left join fetch cancha.deportes where cancha in :canchas", Cancha.class)
            .setParameter(CANCHAS_PARAMETER, canchas)
            .getResultList();
        result.sort((o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
