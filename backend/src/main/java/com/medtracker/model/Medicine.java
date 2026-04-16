package com.medtracker.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name="medicines") @Data
public class Medicine {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String name;
    private String genericName;
    private String category;
    private Double price;
    private String manufacturer;
    private String description;
    private Boolean requiresPrescription = false;
}
