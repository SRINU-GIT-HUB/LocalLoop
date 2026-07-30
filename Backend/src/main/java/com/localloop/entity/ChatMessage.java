package com.localloop.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String senderEmail;
    private String recipientEmail;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    private LocalDateTime timestamp = LocalDateTime.now();
}