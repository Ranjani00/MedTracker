package com.medtracker.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity @Table(name="orders") @Data
public class Order {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="user_id") private User user;
    @OneToMany(cascade=CascadeType.ALL,fetch=FetchType.EAGER)
    @JoinColumn(name="order_id") private List<OrderItem> items;
    private Double total;
    private String status = "PENDING";
    private String address;
    private LocalDateTime createdAt = LocalDateTime.now();
}
