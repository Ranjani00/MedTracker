package com.medtracker.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity @Table(name="subscriptions") @Data
public class Subscription {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="user_id") private User user;
    @ManyToOne @JoinColumn(name="medicine_id") private Medicine medicine;
    private String frequency;
    private String status = "ACTIVE";
    private LocalDateTime createdAt = LocalDateTime.now();
}
