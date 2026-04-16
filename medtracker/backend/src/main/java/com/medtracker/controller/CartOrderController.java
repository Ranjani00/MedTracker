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
public class CartOrderController {
    private final CartRepository cartRepo;
    private final OrderRepository orderRepo;
    private final MedicineRepository medicineRepo;
    private final PharmacyRepository pharmacyRepo;

    public CartOrderController(CartRepository cartRepo, OrderRepository orderRepo,
                               MedicineRepository medicineRepo, PharmacyRepository pharmacyRepo) {
        this.cartRepo = cartRepo; this.orderRepo = orderRepo;
        this.medicineRepo = medicineRepo; this.pharmacyRepo = pharmacyRepo;
    }

    @GetMapping("/cart")
    public ResponseEntity<?> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartRepo.findByUserId(user.getId()));
    }

    @PostMapping("/cart")
    public ResponseEntity<?> addToCart(@AuthenticationPrincipal User user, @RequestBody Map<String,Object> body) {
        Long medicineId = Long.valueOf(body.get("medicineId").toString());
        Long pharmacyId = Long.valueOf(body.get("pharmacyId").toString());
        int qty = body.containsKey("quantity") ? Integer.parseInt(body.get("quantity").toString()) : 1;

        CartItem item = cartRepo.findByUserIdAndMedicineIdAndPharmacyId(user.getId(), medicineId, pharmacyId)
            .orElse(new CartItem());
        item.setUser(user);
        item.setMedicine(medicineRepo.findById(medicineId).orElseThrow());
        item.setPharmacy(pharmacyRepo.findById(pharmacyId).orElseThrow());
        item.setQuantity(item.getQuantity() == null ? qty : item.getQuantity() + qty);
        item.setPrice(Double.valueOf(body.get("price").toString()));
        return ResponseEntity.ok(cartRepo.save(item));
    }

    @Transactional
    @DeleteMapping("/cart/{medicineId}/{pharmacyId}")
    public ResponseEntity<?> removeFromCart(@AuthenticationPrincipal User user,
                                            @PathVariable Long medicineId, @PathVariable Long pharmacyId) {
        cartRepo.deleteByUserIdAndMedicineIdAndPharmacyId(user.getId(), medicineId, pharmacyId);
        return ResponseEntity.ok(Map.of("message","Removed"));
    }

    @Transactional
    @PostMapping("/orders")
    public ResponseEntity<?> placeOrder(@AuthenticationPrincipal User user, @RequestBody Map<String,Object> body) {
        List<CartItem> cartItems = cartRepo.findByUserId(user.getId());
        if (cartItems.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error","Cart is empty"));

        List<OrderItem> orderItems = cartItems.stream().map(ci -> {
            OrderItem oi = new OrderItem();
            oi.setMedicine(ci.getMedicine());
            oi.setPharmacy(ci.getPharmacy());
            oi.setQuantity(ci.getQuantity());
            oi.setPrice(ci.getPrice());
            return oi;
        }).toList();

        double total = orderItems.stream().mapToDouble(oi -> oi.getPrice() * oi.getQuantity()).sum();
        Order order = new Order();
        order.setUser(user);
        order.setItems(orderItems);
        order.setTotal(total);
        order.setAddress(body.containsKey("address") ? (String) body.get("address") : "");
        orderRepo.save(order);
        cartRepo.deleteByUserId(user.getId());
        return ResponseEntity.ok(order);
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderRepo.findByUserIdOrderByCreatedAtDesc(user.getId()));
    }
}
