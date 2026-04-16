package com.medtracker.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name="pharmacy_medicines") @Data
public class PharmacyMedicine {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="pharmacy_id") private Pharmacy pharmacy;
    @ManyToOne @JoinColumn(name="medicine_id") private Medicine medicine;
    private Integer stock = 0;
    private Double price;
}
