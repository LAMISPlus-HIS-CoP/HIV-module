package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.entity.HIVEac;
import org.lamisplus.modules.hiv.domain.entity.HIVEacSession;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HIVEacSessionRepository extends JpaRepository<HIVEacSession, Long> {
	
	List<HIVEacSession> getHIVEacSesByEac(HIVEac hivEac);
	List<HIVEacSession> getHIVEacSessionByPersonAndArchived(Person person,Integer archived);
}