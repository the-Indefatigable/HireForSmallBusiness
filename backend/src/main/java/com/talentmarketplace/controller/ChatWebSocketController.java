package com.talentmarketplace.controller;

import com.talentmarketplace.model.Message;
import com.talentmarketplace.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageService messageService;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        // Save the message to database
        Message savedMessage = messageService.sendMessage(
            chatMessage.getSenderId(),
            chatMessage.getReceiverId(),
            chatMessage.getContent()
        );

        // Send the message to the specific user
        messagingTemplate.convertAndSendToUser(
            chatMessage.getReceiverId().toString(),
            "/queue/messages",
            savedMessage
        );
    }
}

class ChatMessage {
    private Long senderId;
    private Long receiverId;
    private String content;

    // Getters and setters
    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
} 