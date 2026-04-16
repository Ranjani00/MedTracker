package com.medtracker.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity @Table(name="voice_commands") @Data
public class VoiceCommand {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    private String phrase;
    private String action;
    private String description;
    private String language = "ta-IN";
}
