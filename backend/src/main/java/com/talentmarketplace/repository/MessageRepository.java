package com.talentmarketplace.repository;

import com.talentmarketplace.model.Message;
import com.talentmarketplace.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m WHERE " +
           "(m.sender = :user1 AND m.receiver = :user2) OR " +
           "(m.sender = :user2 AND m.receiver = :user1) " +
           "ORDER BY m.sentAt ASC")
    List<Message> findConversation(User user1, User user2);
    
    List<Message> findByReceiverAndIsReadFalse(User receiver);
    
    @Query("SELECT DISTINCT m.sender FROM Message m WHERE m.receiver = :user " +
           "UNION SELECT DISTINCT m.receiver FROM Message m WHERE m.sender = :user")
    List<User> findConversationPartners(User user);
} 