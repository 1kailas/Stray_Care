package com.straydogcare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    
    // Main Statistics
    private StatCard totalReports;
    private StatCard underCare;
    private StatCard successfulAdoptions;
    private StatCard activeVolunteers;
    
    // Quick Metrics
    private QuickMetric avgResponseTime;
    private QuickMetric successRate;
    private QuickMetric activeZones;
    
    // Time-based Stats
    private TimeBasedStats thisMonth;
    private TimeBasedStats lastMonth;
    private Double growthPercentage;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatCard {
        private String label;
        private Integer value;
        private String change;
        private String changeType; // increase, decrease, neutral
        private String subtitle;
        private String icon;
        private String color;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuickMetric {
        private String label;
        private String value;
        private String icon;
        private String color;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimeBasedStats {
        private Integer reports;
        private Integer rescued;
        private Integer adopted;
        private Integer volunteers;
    }
}
