package com.medtracker.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name="order_items") @Data
public class OrderItem {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="medicine_id") private Medicine medicine;
    @ManyToOne @JoinColumn(name="pharmacy_id") private Pharmacy pharmacy;
    private Integer quantity;
    private Double price;
}
