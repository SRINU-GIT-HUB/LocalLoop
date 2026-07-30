package com.localloop.controller;

import com.localloop.entity.ChatMessage;
import com.localloop.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository messageRepository;

    @MessageMapping("/chat.send")
    public void sendMessageWebSocket(@Payload ChatMessage chatMessage, Principal principal) {
        saveAndBroadcast(chatMessage, principal.getName());
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessageRest(@RequestBody ChatMessage chatMessage, Principal principal) {
        ChatMessage saved = saveAndBroadcast(chatMessage, principal.getName());
        return ResponseEntity.ok(saved);
    }

    private ChatMessage saveAndBroadcast(ChatMessage chatMessage, String senderEmail) {
        chatMessage.setSenderEmail(senderEmail);
        ChatMessage saved = messageRepository.save(chatMessage);
        
        // Broadcast to recipient
        messagingTemplate.convertAndSendToUser(
            chatMessage.getRecipientEmail(), 
            "/queue/messages", 
            saved
        );
        return saved;
    }

    @GetMapping("/history/{recipientEmail}")
    public ResponseEntity<List<ChatMessage>> getHistory(@PathVariable String recipientEmail, Principal principal) {
        return ResponseEntity.ok(messageRepository.findConversation(principal.getName(), recipientEmail));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<String>> getConversations(Principal principal) {
        return ResponseEntity.ok(messageRepository.findDistinctPartners(principal.getName()));
    }

    @Autowired
    private com.localloop.repository.UserRepository userRepository;

    @GetMapping("/user-email/{id}")
    public ResponseEntity<String> getUserEmailById(@PathVariable Long id) {
        com.localloop.entity.User targetUser = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(targetUser.getEmail());
    }
}