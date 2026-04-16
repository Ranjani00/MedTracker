package com.medtracker.controller;

import com.medtracker.model.*;
import com.medtracker.repository.MedicationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/medications")
public class MedicationController {
    private final MedicationRepository repo;
    public MedicationController(MedicationRepository repo) { this.repo = repo; }

    @GetMapping
    public ResponseEntity<?> list(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(repo.findByUserId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<?> add(@AuthenticationPrincipal User user, @RequestBody Map<String,Object> body) {
        Medication m = new Medication();
        m.setUser(user);
        m.setName((String) body.get("name"));
        m.setDosage((String) body.get("dosage"));
        m.setFrequency((String) body.get("frequency"));
        m.setTime((String) body.get("time"));
        return ResponseEntity.ok(repo.save(m));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@AuthenticationPrincipal User user, @PathVariable Long id,
                                    @RequestBody Map<String,Object> body) {
        return repo.findById(id).filter(m -> m.getUser().getId().equals(user.getId())).map(m -> {
            if (body.containsKey("name")) m.setName((String) body.get("name"));
            if (body.containsKey("dosage")) m.setDosage((String) body.get("dosage"));
            if (body.containsKey("frequency")) m.setFrequency((String) body.get("frequency"));
            if (body.containsKey("time")) m.setTime((String) body.get("time"));
            return ResponseEntity.ok(repo.save(m));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return repo.findById(id).filter(m -> m.getUser().getId().equals(user.getId())).map(m -> {
            repo.delete(m);
            return ResponseEntity.ok(Map.of("message","Deleted"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/taken")
    public ResponseEntity<?> markTaken(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return repo.findById(id).filter(m -> m.getUser().getId().equals(user.getId())).map(m -> {
            m.setTaken(true);
            return ResponseEntity.ok(repo.save(m));
        }).orElse(ResponseEntity.notFound().build());
    }
}
