package com.straydogcare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChartDataResponse {
    
    // Monthly rescue progress
    private List<MonthlyData> monthlyProgress;
    
    // Weekly activity pattern
    private List<WeeklyData> weeklyActivity;
    
    // Zone-wise distribution
    private Map<String, Integer> zoneDistribution;
    
    // Status breakdown
    private Map<String, Integer> statusBreakdown;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyData {
        private String month;
        private Integer rescued;
        private Integer adopted;
        private Integer reports;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeeklyData {
        private String day;
        private Integer value;
    }
}
