package com.straydogcare.controller;

import com.straydogcare.dto.DashboardStatsResponse;
import com.straydogcare.dto.ActivityFeedResponse;
import com.straydogcare.dto.ChartDataResponse;
import com.straydogcare.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * Get comprehensive dashboard statistics
     * Includes: total reports, active volunteers, adoptions, response times
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats(
            @RequestParam(required = false) String zone,
            @RequestParam(required = false) String timeRange) {
        DashboardStatsResponse stats = dashboardService.getDashboardStats(zone, timeRange);
        return ResponseEntity.ok(stats);
    }

    /**
     * Get recent activity feed
     * Returns latest rescues, adoptions, volunteer activities
     */
    @GetMapping("/activity")
    public ResponseEntity<ActivityFeedResponse> getActivityFeed(
            @RequestParam(defaultValue = "20") int limit) {
        ActivityFeedResponse activity = dashboardService.getActivityFeed(limit);
        return ResponseEntity.ok(activity);
    }

    /**
     * Get chart data for visualizations
     * Includes: monthly trends, weekly patterns, zone distribution
     */
    @GetMapping("/charts")
    public ResponseEntity<ChartDataResponse> getChartData(
            @RequestParam(defaultValue = "6") int months) {
        ChartDataResponse chartData = dashboardService.getChartData(months);
        return ResponseEntity.ok(chartData);
    }

    /**
     * Get zone-wise statistics breakdown
     */
    @GetMapping("/zones")
    public ResponseEntity<Map<String, Object>> getZoneStatistics() {
        Map<String, Object> zoneStats = dashboardService.getZoneStatistics();
        return ResponseEntity.ok(zoneStats);
    }

    /**
     * Get quick stats for hero section
     */
    @GetMapping("/quick-stats")
    public ResponseEntity<Map<String, Object>> getQuickStats() {
        Map<String, Object> quickStats = dashboardService.getQuickStats();
        return ResponseEntity.ok(quickStats);
    }
}
