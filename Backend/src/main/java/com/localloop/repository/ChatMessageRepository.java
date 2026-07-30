package com.localloop.repository;

import com.localloop.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    @Query("SELECT m FROM ChatMessage m WHERE (m.senderEmail = :user1 AND m.recipientEmail = :user2) OR (m.senderEmail = :user2 AND m.recipientEmail = :user1) ORDER BY m.timestamp ASC")
    List<ChatMessage> findConversation(@Param("user1") String user1, @Param("user2") String user2);

    @Query("SELECT DISTINCT m.recipientEmail FROM ChatMessage m WHERE m.senderEmail = :email UNION SELECT DISTINCT m.senderEmail FROM ChatMessage m WHERE m.recipientEmail = :email")
    List<String> findDistinctPartners(@Param("email") String email);
}