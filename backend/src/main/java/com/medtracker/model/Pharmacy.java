package com.medtracker.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name="pharmacies") @Data
public class Pharmacy {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    private String name;
    private String branch;
    private String address;
    private String phone;
    private Double rating = 4.0;
}
