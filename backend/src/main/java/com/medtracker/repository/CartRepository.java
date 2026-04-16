package com.medtracker.repository;
import com.medtracker.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface CartRepository extends JpaRepository<CartItem,Long> {
    List<CartItem> findByUserId(Long userId);
    Optional<CartItem> findByUserIdAndMedicineIdAndPharmacyId(Long userId, Long medicineId, Long pharmacyId);
    void deleteByUserIdAndMedicineIdAndPharmacyId(Long userId, Long medicineId, Long pharmacyId);
    void deleteByUserId(Long userId);
}
