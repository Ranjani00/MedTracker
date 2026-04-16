package com.medtracker.repository;
import com.medtracker.model.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PharmacyRepository extends JpaRepository<Pharmacy,Long> {}
