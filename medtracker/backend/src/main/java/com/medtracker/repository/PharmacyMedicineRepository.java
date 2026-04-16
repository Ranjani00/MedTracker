package com.medtracker.repository;
import com.medtracker.model.PharmacyMedicine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface PharmacyMedicineRepository extends JpaRepository<PharmacyMedicine,Long> {
    List<PharmacyMedicine> findByMedicineId(Long medicineId);
    List<PharmacyMedicine> findByPharmacyId(Long pharmacyId);
    Optional<PharmacyMedicine> findByPharmacyIdAndMedicineId(Long pharmacyId, Long medicineId);
}
