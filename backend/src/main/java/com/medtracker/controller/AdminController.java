package com.medtracker.controller;

import com.medtracker.model.*;
import com.medtracker.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserRepository userRepo;
    private final MedicineRepository medicineRepo;
    private final OrderRepository orderRepo;
    private final PharmacyMedicineRepository pmRepo;
    private final VoiceCommandRepository vcRepo;

    public AdminController(UserRepository userRepo, MedicineRepository medicineRepo,
                           OrderRepository orderRepo, PharmacyMedicineRepository pmRepo,
                           VoiceCommandRepository vcRepo) {
        this.userRepo = userRepo; this.medicineRepo = medicineRepo;
        this.orderRepo = orderRepo; this.pmRepo = pmRepo;
        this.vcRepo = vcRepo;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> stats() {
        long users = userRepo.count();
        long medicines = medicineRepo.count();
        long orders = orderRepo.count();
        double revenue = orderRepo.findAll().stream().mapToDouble(o -> o.getTotal() != null ? o.getTotal() : 0).sum();
        return ResponseEntity.ok(Map.of(
            "totalUsers", users, "totalMedicines", medicines,
            "totalOrders", orders, "totalRevenue", revenue));
    }

    // Users
    @GetMapping("/users")
    public ResponseEntity<?> listUsers() { return ResponseEntity.ok(userRepo.findAll()); }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody Map<String,String> body) {
        return userRepo.findById(id).map(u -> {
            u.setRole(User.Role.valueOf(body.get("role")));
            return ResponseEntity.ok(userRepo.save(u));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Medicines
    @GetMapping("/medicines")
    public ResponseEntity<?> listMedicines() { return ResponseEntity.ok(medicineRepo.findAll()); }

    @PostMapping("/medicines")
    public ResponseEntity<?> createMedicine(@RequestBody Map<String,Object> body) {
        Medicine m = new Medicine();
        m.setName((String) body.get("name"));
        m.setGenericName((String) body.get("genericName"));
        m.setCategory((String) body.get("category"));
        m.setPrice(body.containsKey("price") ? Double.valueOf(body.get("price").toString()) : 0.0);
        m.setManufacturer((String) body.get("manufacturer"));
        m.setDescription((String) body.get("description"));
        m.setRequiresPrescription(body.containsKey("requiresPrescription") &&
            Boolean.parseBoolean(body.get("requiresPrescription").toString()));
        return ResponseEntity.ok(medicineRepo.save(m));
    }

    @PutMapping("/medicines/{id}")
    public ResponseEntity<?> updateMedicine(@PathVariable Long id, @RequestBody Map<String,Object> body) {
        return medicineRepo.findById(id).map(m -> {
            if (body.containsKey("name")) m.setName((String) body.get("name"));
            if (body.containsKey("price")) m.setPrice(Double.valueOf(body.get("price").toString()));
            if (body.containsKey("category")) m.setCategory((String) body.get("category"));
            if (body.containsKey("manufacturer")) m.setManufacturer((String) body.get("manufacturer"));
            if (body.containsKey("description")) m.setDescription((String) body.get("description"));
            return ResponseEntity.ok(medicineRepo.save(m));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/medicines/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id) {
        medicineRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("message","Deleted"));
    }

    // Orders
    @GetMapping("/orders")
    public ResponseEntity<?> listOrders() { return ResponseEntity.ok(orderRepo.findAll()); }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String,String> body) {
        return orderRepo.findById(id).map(o -> {
            o.setStatus(body.get("status"));
            return ResponseEntity.ok(orderRepo.save(o));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Inventory
    @GetMapping("/inventory")
    public ResponseEntity<?> getInventory() { return ResponseEntity.ok(pmRepo.findAll()); }

    @PutMapping("/inventory/{id}")
    public ResponseEntity<?> updateInventory(@PathVariable Long id, @RequestBody Map<String,Object> body) {
        return pmRepo.findById(id).map(pm -> {
            if (body.containsKey("stock")) pm.setStock(Integer.valueOf(body.get("stock").toString()));
            if (body.containsKey("price")) pm.setPrice(Double.valueOf(body.get("price").toString()));
            return ResponseEntity.ok(pmRepo.save(pm));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Voice Commands
    @GetMapping("/voice-commands")
    public ResponseEntity<?> listVoiceCommands() { return ResponseEntity.ok(vcRepo.findAll()); }

    @PostMapping("/voice-commands")
    public ResponseEntity<?> createVoiceCommand(@RequestBody Map<String,String> body) {
        VoiceCommand vc = new VoiceCommand();
        vc.setPhrase(body.get("phrase"));
        vc.setAction(body.get("action"));
        vc.setDescription(body.get("description"));
        vc.setLanguage(body.getOrDefault("language","ta-IN"));
        return ResponseEntity.ok(vcRepo.save(vc));
    }

    @PutMapping("/voice-commands/{id}")
    public ResponseEntity<?> updateVoiceCommand(@PathVariable Long id, @RequestBody Map<String,String> body) {
        return vcRepo.findById(id).map(vc -> {
            if (body.containsKey("phrase")) vc.setPhrase(body.get("phrase"));
            if (body.containsKey("action")) vc.setAction(body.get("action"));
            if (body.containsKey("description")) vc.setDescription(body.get("description"));
            return ResponseEntity.ok(vcRepo.save(vc));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/voice-commands/{id}")
    public ResponseEntity<?> deleteVoiceCommand(@PathVariable Long id) {
        vcRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("message","Deleted"));
    }

    // Notifications
    @GetMapping("/notifications")
    public ResponseEntity<?> listNotifications() {
        return ResponseEntity.ok(Map.of("notifications", java.util.List.of()));
    }

    @PostMapping("/notifications")
    public ResponseEntity<?> sendNotification(@RequestBody Map<String,Object> body) {
        return ResponseEntity.ok(Map.of("message","Notification sent","data",body));
    }

    // Reports
    @GetMapping("/reports")
    public ResponseEntity<?> getReports() {
        long users = userRepo.count();
        long orders = orderRepo.count();
        double revenue = orderRepo.findAll().stream().mapToDouble(o -> o.getTotal() != null ? o.getTotal() : 0).sum();
        return ResponseEntity.ok(Map.of(
            "totalUsers", users, "totalOrders", orders,
            "totalRevenue", revenue, "totalMedicines", medicineRepo.count()));
    }
}
