package com.medtracker.controller;

import com.medtracker.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {
    private final MedicineRepository medicineRepo;
    private final PharmacyMedicineRepository pmRepo;

    public MedicineController(MedicineRepository medicineRepo, PharmacyMedicineRepository pmRepo) {
        this.medicineRepo = medicineRepo; this.pmRepo = pmRepo;
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String q) {
        return ResponseEntity.ok(medicineRepo.findByNameContainingIgnoreCaseOrGenericNameContainingIgnoreCase(q, q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return medicineRepo.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/pharmacies")
    public ResponseEntity<?> getPharmacies(@PathVariable Long id) {
        return ResponseEntity.ok(pmRepo.findByMedicineId(id));
    }

    @GetMapping("/{id}/alternatives")
    public ResponseEntity<?> getAlternatives(@PathVariable Long id) {
        return medicineRepo.findById(id).map(m ->
            ResponseEntity.ok(medicineRepo.findByNameContainingIgnoreCaseOrGenericNameContainingIgnoreCase(
                m.getGenericName() != null ? m.getGenericName() : "", m.getGenericName() != null ? m.getGenericName() : ""))
        ).orElse(ResponseEntity.notFound().build());
    }
}
