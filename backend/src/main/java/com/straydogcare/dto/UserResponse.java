package com.straydogcare.dto;

import com.straydogcare.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String contact;
    private User.Role role;
    private boolean active;
    private String profileImage;
    private LocalDateTime createdAt;
}
