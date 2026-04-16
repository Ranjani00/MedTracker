package com.medtracker.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity @Table(name="medications") @Data
public class Medication {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="user_id") private User user;
    private String name;
    private String dosage;
    private String frequency;
    private String time;
    private Boolean taken = false;
    private LocalDateTime createdAt = LocalDateTime.now();
}
