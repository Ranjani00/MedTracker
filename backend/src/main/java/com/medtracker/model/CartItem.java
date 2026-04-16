package com.medtracker.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name="cart_items") @Data
public class CartItem {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="user_id") private User user;
    @ManyToOne @JoinColumn(name="medicine_id") private Medicine medicine;
    @ManyToOne @JoinColumn(name="pharmacy_id") private Pharmacy pharmacy;
    private Integer quantity = 1;
    private Double price;
}
