package com.straydogcare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityFeedResponse {
    
    private List<ActivityItem> activities;
    private Integer total;
    private Integer unreadCount;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActivityItem {
        private String id;
        private String type; // rescue, adoption, volunteer, event, vaccination
        private String title;
        private String description;
        private String location;
        private String timeAgo;
        private LocalDateTime timestamp;
        private String icon;
        private String color;
        private Boolean urgent;
        private String relatedId; // ID of the related report/adoption/volunteer
    }
}
