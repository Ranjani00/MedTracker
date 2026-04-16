package com.medtracker.controller;

import com.medtracker.repository.PharmacyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pharmacies")
public class PharmacyController {
    private final PharmacyRepository repo;
    public PharmacyController(PharmacyRepository repo) { this.repo = repo; }

    @GetMapping
    public ResponseEntity<?> list() { return ResponseEntity.ok(repo.findAll()); }
}
