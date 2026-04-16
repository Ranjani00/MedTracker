package com.medtracker.controller;

import com.medtracker.model.*;
import com.medtracker.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/prebooks")
public class PrebookController {
    private final PrebookRepository repo;
    private final MedicineRepository medicineRepo;
    private final PharmacyRepository pharmacyRepo;

    public PrebookController(PrebookRepository repo, MedicineRepository medicineRepo, PharmacyRepository pharmacyRepo) {
        this.repo = repo; this.medicineRepo = medicineRepo; this.pharmacyRepo = pharmacyRepo;
    }

    @GetMapping
    public ResponseEntity<?> list(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(repo.findByUserId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<?> create(@AuthenticationPrincipal User user, @RequestBody Map<String,Object> body) {
        Prebook p = new Prebook();
        p.setUser(user);
        p.setMedicine(medicineRepo.findById(Long.valueOf(body.get("medicineId").toString())).orElseThrow());
        p.setPharmacy(pharmacyRepo.findById(Long.valueOf(body.get("pharmacyId").toString())).orElseThrow());
        if (body.containsKey("quantity")) p.setQuantity(Integer.valueOf(body.get("quantity").toString()));
        return ResponseEntity.ok(repo.save(p));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancel(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return repo.findById(id).filter(p -> p.getUser().getId().equals(user.getId())).map(p -> {
            p.setStatus("CANCELLED");
            return ResponseEntity.ok(repo.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }
}
