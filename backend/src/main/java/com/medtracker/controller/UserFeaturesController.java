package com.medtracker.controller;

import com.medtracker.model.*;
import com.medtracker.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class UserFeaturesController {
    private final FavoriteRepository favRepo;
    private final SubscriptionRepository subRepo;
    private final MedicineRepository medicineRepo;

    public UserFeaturesController(FavoriteRepository favRepo, SubscriptionRepository subRepo,
                                  MedicineRepository medicineRepo) {
        this.favRepo = favRepo; this.subRepo = subRepo; this.medicineRepo = medicineRepo;
    }

    // Favorites
    @GetMapping("/favorites")
    public ResponseEntity<?> getFavorites(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(favRepo.findByUserId(user.getId()));
    }

    @PostMapping("/favorites")
    public ResponseEntity<?> addFavorite(@AuthenticationPrincipal User user, @RequestBody Map<String,Object> body) {
        Long medicineId = Long.valueOf(body.get("medicineId").toString());
        if (favRepo.findByUserIdAndMedicineId(user.getId(), medicineId).isPresent())
            return ResponseEntity.ok(Map.of("message","Already in favorites"));
        Favorite f = new Favorite();
        f.setUser(user);
        f.setMedicine(medicineRepo.findById(medicineId).orElseThrow());
        return ResponseEntity.ok(favRepo.save(f));
    }

    @Transactional
    @DeleteMapping("/favorites/{medicineId}")
    public ResponseEntity<?> removeFavorite(@AuthenticationPrincipal User user, @PathVariable Long medicineId) {
        favRepo.deleteByUserIdAndMedicineId(user.getId(), medicineId);
        return ResponseEntity.ok(Map.of("message","Removed"));
    }

    // Subscriptions
    @GetMapping("/subscriptions")
    public ResponseEntity<?> getSubs(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(subRepo.findByUserId(user.getId()));
    }

    @PostMapping("/subscriptions")
    public ResponseEntity<?> createSub(@AuthenticationPrincipal User user, @RequestBody Map<String,Object> body) {
        Subscription s = new Subscription();
        s.setUser(user);
        s.setMedicine(medicineRepo.findById(Long.valueOf(body.get("medicineId").toString())).orElseThrow());
        s.setFrequency((String) body.get("frequency"));
        return ResponseEntity.ok(subRepo.save(s));
    }

    @PutMapping("/subscriptions/{id}")
    public ResponseEntity<?> updateSub(@PathVariable Long id, @RequestBody Map<String,Object> body) {
        return subRepo.findById(id).map(s -> {
            if (body.containsKey("frequency")) s.setFrequency((String) body.get("frequency"));
            if (body.containsKey("status")) s.setStatus((String) body.get("status"));
            return ResponseEntity.ok(subRepo.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/subscriptions/{id}")
    public ResponseEntity<?> cancelSub(@PathVariable Long id) {
        return subRepo.findById(id).map(s -> {
            s.setStatus("CANCELLED");
            return ResponseEntity.ok(subRepo.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Emergency contacts (static for now)
    @GetMapping("/emergency-contacts")
    public ResponseEntity<?> emergencyContacts() {
        return ResponseEntity.ok(List.of(
            Map.of("name","Ambulance","number","108","type","emergency"),
            Map.of("name","Police","number","100","type","emergency"),
            Map.of("name","Fire","number","101","type","emergency")
        ));
    }

    // Reviews & Prescriptions
    @PostMapping("/reviews")
    public ResponseEntity<?> submitReview(@RequestBody Map<String,Object> body) {
        return ResponseEntity.ok(Map.of("message","Review submitted","data",body));
    }

    @PostMapping("/prescriptions")
    public ResponseEntity<?> uploadPrescription(@RequestBody Map<String,Object> body) {
        return ResponseEntity.ok(Map.of("message","Prescription uploaded"));
    }
}
