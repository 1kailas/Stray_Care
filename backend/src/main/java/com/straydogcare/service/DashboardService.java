package com.straydogcare.service;

import com.straydogcare.dto.ActivityFeedResponse;
import com.straydogcare.dto.ChartDataResponse;
import com.straydogcare.dto.DashboardStatsResponse;
import com.straydogcare.model.*;
import com.straydogcare.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DogReportRepository dogReportRepository;
    private final VolunteerRepository volunteerRepository;
    private final AdoptionRepository adoptionRepository;

    /**
     * Get comprehensive dashboard statistics
     */
    public DashboardStatsResponse getDashboardStats(String zone, String timeRange) {
        LocalDateTime startDate = calculateStartDate(timeRange);
        
        // Get all reports
        List<DogReport> allReports = dogReportRepository.findAll();
        List<DogReport> filteredReports = filterByZoneAndDate(allReports, zone, startDate);
        
        // Calculate statistics
        long totalReports = filteredReports.size();
        long underCare = filteredReports.stream()
                .filter(r -> DogReport.Status.IN_PROGRESS.equals(r.getStatus()) || 
                            DogReport.Status.RESCUED.equals(r.getStatus()))
                .count();
        long adopted = adoptionRepository.count();
        long activeVolunteers = volunteerRepository.findByStatus(Volunteer.Status.ACTIVE).size();
        
        // Calculate previous period for comparison
        LocalDateTime previousStart = startDate.minusDays(getDaysDifference(timeRange));
        List<DogReport> previousReports = filterByZoneAndDate(allReports, zone, previousStart, startDate);
        
        // Calculate growth
        double reportsGrowth = calculateGrowth(filteredReports.size(), previousReports.size());
        
        // Build response
        return DashboardStatsResponse.builder()
                .totalReports(DashboardStatsResponse.StatCard.builder()
                        .label("Dogs Reported")
                        .value((int) totalReports)
                        .change(formatPercentage(reportsGrowth))
                        .changeType(reportsGrowth >= 0 ? "increase" : "decrease")
                        .subtitle("This month")
                        .icon("Dog")
                        .color("#FFA69E")
                        .build())
                .underCare(DashboardStatsResponse.StatCard.builder()
                        .label("Under Care")
                        .value((int) underCare)
                        .change("+8%")
                        .changeType("increase")
                        .subtitle("Active cases")
                        .icon("Heart")
                        .color("#9FD8CB")
                        .build())
                .successfulAdoptions(DashboardStatsResponse.StatCard.builder()
                        .label("Successfully Adopted")
                        .value((int) adopted)
                        .change("+15%")
                        .changeType("increase")
                        .subtitle("Total adoptions")
                        .icon("Home")
                        .color("#B4A7D6")
                        .build())
                .activeVolunteers(DashboardStatsResponse.StatCard.builder()
                        .label("Active Volunteers")
                        .value((int) activeVolunteers)
                        .change("+5%")
                        .changeType("increase")
                        .subtitle("Community members")
                        .icon("Users")
                        .color("#FFDAC1")
                        .build())
                .avgResponseTime(DashboardStatsResponse.QuickMetric.builder()
                        .label("Avg Response Time")
                        .value(calculateAvgResponseTime(filteredReports))
                        .icon("Activity")
                        .color("#FFA69E")
                        .build())
                .successRate(DashboardStatsResponse.QuickMetric.builder()
                        .label("Success Rate")
                        .value(calculateSuccessRate(filteredReports) + "%")
                        .icon("Award")
                        .color("#B4A7D6")
                        .build())
                .activeZones(DashboardStatsResponse.QuickMetric.builder()
                        .label("Active Zones")
                        .value(String.valueOf(getActiveZonesCount(filteredReports)))
                        .icon("MapPin")
                        .color("#9FD8CB")
                        .build())
                .growthPercentage(reportsGrowth)
                .build();
    }

    /**
     * Get recent activity feed
     */
    public ActivityFeedResponse getActivityFeed(int limit) {
        List<ActivityFeedResponse.ActivityItem> activities = new ArrayList<>();
        
        // Get recent reports (rescues)
        List<DogReport> recentReports = dogReportRepository.findAll(
                PageRequest.of(0, limit/4, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();
        
        for (DogReport report : recentReports) {
            boolean isUrgent = DogReport.Condition.CRITICAL.equals(report.getCondition()) || 
                             DogReport.Condition.INJURED.equals(report.getCondition());
            
            activities.add(ActivityFeedResponse.ActivityItem.builder()
                    .id(UUID.randomUUID().toString())
                    .type("rescue")
                    .title("New rescue report in " + report.getLocation())
                    .description(report.getDescription())
                    .location(report.getLocation())
                    .timeAgo(getTimeAgo(report.getCreatedAt()))
                    .timestamp(report.getCreatedAt())
                    .icon("MapPin")
                    .color("#FFA69E")
                    .urgent(isUrgent)
                    .relatedId(report.getId())
                    .build());
        }
        
        // Get recent adoptions
        List<Adoption> recentAdoptions = adoptionRepository.findAll(
                PageRequest.of(0, limit/4, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();
        
        for (Adoption adoption : recentAdoptions) {
            activities.add(ActivityFeedResponse.ActivityItem.builder()
                    .id(UUID.randomUUID().toString())
                    .type("adoption")
                    .title(adoption.getDogName() + " found a forever home!")
                    .description("Adoption application approved")
                    .location("Adoption Center")
                    .timeAgo(getTimeAgo(adoption.getCreatedAt()))
                    .timestamp(adoption.getCreatedAt())
                    .icon("Heart")
                    .color("#B4A7D6")
                    .urgent(false)
                    .relatedId(adoption.getId())
                    .build());
        }
        
        // Get recent volunteer registrations
        List<Volunteer> recentVolunteers = volunteerRepository.findAll(
                PageRequest.of(0, limit/4, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent();
        
        for (Volunteer volunteer : recentVolunteers) {
            activities.add(ActivityFeedResponse.ActivityItem.builder()
                    .id(UUID.randomUUID().toString())
                    .type("volunteer")
                    .title(volunteer.getName() + " joined as volunteer")
                    .description("New volunteer in " + volunteer.getArea())
                    .location(volunteer.getArea())
                    .timeAgo(getTimeAgo(volunteer.getCreatedAt()))
                    .timestamp(volunteer.getCreatedAt())
                    .icon("Users")
                    .color("#9FD8CB")
                    .urgent(false)
                    .relatedId(volunteer.getId())
                    .build());
        }
        
        // Sort all activities by timestamp
        activities.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));
        
        // Limit to requested size
        if (activities.size() > limit) {
            activities = activities.subList(0, limit);
        }
        
        return ActivityFeedResponse.builder()
                .activities(activities)
                .total(activities.size())
                .unreadCount((int) activities.stream().filter(ActivityFeedResponse.ActivityItem::getUrgent).count())
                .build();
    }

    /**
     * Get chart data for visualizations
     */
    public ChartDataResponse getChartData(int months) {
        List<DogReport> reports = dogReportRepository.findAll();
        
        // Monthly progress
        List<ChartDataResponse.MonthlyData> monthlyData = new ArrayList<>();
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM");
        
        for (int i = months - 1; i >= 0; i--) {
            LocalDateTime monthStart = LocalDateTime.now().minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0);
            LocalDateTime monthEnd = monthStart.plusMonths(1);
            
            int monthReports = (int) reports.stream()
                    .filter(r -> r.getCreatedAt().isAfter(monthStart) && r.getCreatedAt().isBefore(monthEnd))
                    .count();
            
            int monthRescued = (int) reports.stream()
                    .filter(r -> r.getCreatedAt().isAfter(monthStart) && r.getCreatedAt().isBefore(monthEnd))
                    .filter(r -> DogReport.Status.RESCUED.equals(r.getStatus()) || 
                                DogReport.Status.IN_PROGRESS.equals(r.getStatus()))
                    .count();
            
            List<Adoption> monthAdoptions = adoptionRepository.findAll().stream()
                    .filter(a -> a.getCreatedAt().isAfter(monthStart) && a.getCreatedAt().isBefore(monthEnd))
                    .collect(Collectors.toList());
            
            monthlyData.add(ChartDataResponse.MonthlyData.builder()
                    .month(monthStart.format(monthFormatter))
                    .reports(monthReports)
                    .rescued(monthRescued)
                    .adopted(monthAdoptions.size())
                    .build());
        }
        
        // Weekly activity
        List<ChartDataResponse.WeeklyData> weeklyData = Arrays.asList(
                new ChartDataResponse.WeeklyData("Mon", getReportsForDay(reports, 1)),
                new ChartDataResponse.WeeklyData("Tue", getReportsForDay(reports, 2)),
                new ChartDataResponse.WeeklyData("Wed", getReportsForDay(reports, 3)),
                new ChartDataResponse.WeeklyData("Thu", getReportsForDay(reports, 4)),
                new ChartDataResponse.WeeklyData("Fri", getReportsForDay(reports, 5)),
                new ChartDataResponse.WeeklyData("Sat", getReportsForDay(reports, 6)),
                new ChartDataResponse.WeeklyData("Sun", getReportsForDay(reports, 7))
        );
        
        // Zone distribution
        Map<String, Integer> zoneDistribution = reports.stream()
                .collect(Collectors.groupingBy(
                        DogReport::getLocation,
                        Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
                ));
        
        // Status breakdown
        Map<String, Integer> statusBreakdown = reports.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getStatus() != null ? r.getStatus().toString() : "PENDING",
                        Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
                ));
        
        return ChartDataResponse.builder()
                .monthlyProgress(monthlyData)
                .weeklyActivity(weeklyData)
                .zoneDistribution(zoneDistribution)
                .statusBreakdown(statusBreakdown)
                .build();
    }

    /**
     * Get zone-wise statistics
     */
    public Map<String, Object> getZoneStatistics() {
        List<DogReport> reports = dogReportRepository.findAll();
        
        Map<String, Map<String, Integer>> zoneStats = new HashMap<>();
        
        for (DogReport report : reports) {
            String zone = report.getLocation();
            zoneStats.putIfAbsent(zone, new HashMap<>());
            
            Map<String, Integer> stats = zoneStats.get(zone);
            stats.put("total", stats.getOrDefault("total", 0) + 1);
            
            if (DogReport.Status.RESCUED.equals(report.getStatus()) || 
                DogReport.Status.IN_PROGRESS.equals(report.getStatus())) {
                stats.put("rescued", stats.getOrDefault("rescued", 0) + 1);
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("zones", zoneStats);
        result.put("totalZones", zoneStats.size());
        
        return result;
    }

    /**
     * Get quick stats for hero section
     */
    public Map<String, Object> getQuickStats() {
        List<DogReport> reports = dogReportRepository.findAll();
        
        Map<String, Object> quickStats = new HashMap<>();
        quickStats.put("avgResponseTime", calculateAvgResponseTime(reports));
        quickStats.put("successRate", calculateSuccessRate(reports) + "%");
        quickStats.put("activeZones", getActiveZonesCount(reports));
        quickStats.put("todayReports", getTodayReportsCount());
        
        return quickStats;
    }

    // Helper methods
    
    private LocalDateTime calculateStartDate(String timeRange) {
        if (timeRange == null || timeRange.equals("month")) {
            return LocalDateTime.now().minusMonths(1);
        }
        switch (timeRange) {
            case "week":
                return LocalDateTime.now().minusWeeks(1);
            case "year":
                return LocalDateTime.now().minusYears(1);
            default:
                return LocalDateTime.now().minusMonths(1);
        }
    }
    
    private int getDaysDifference(String timeRange) {
        if (timeRange == null || timeRange.equals("month")) {
            return 30;
        }
        switch (timeRange) {
            case "week":
                return 7;
            case "year":
                return 365;
            default:
                return 30;
        }
    }
    
    private List<DogReport> filterByZoneAndDate(List<DogReport> reports, String zone, LocalDateTime startDate) {
        return reports.stream()
                .filter(r -> zone == null || zone.equals("all") || zone.equalsIgnoreCase(r.getLocation()))
                .filter(r -> r.getCreatedAt().isAfter(startDate))
                .collect(Collectors.toList());
    }
    
    private List<DogReport> filterByZoneAndDate(List<DogReport> reports, String zone, 
                                                  LocalDateTime startDate, LocalDateTime endDate) {
        return reports.stream()
                .filter(r -> zone == null || zone.equals("all") || zone.equalsIgnoreCase(r.getLocation()))
                .filter(r -> r.getCreatedAt().isAfter(startDate) && r.getCreatedAt().isBefore(endDate))
                .collect(Collectors.toList());
    }
    
    private double calculateGrowth(int current, int previous) {
        if (previous == 0) return current > 0 ? 100.0 : 0.0;
        return ((double) (current - previous) / previous) * 100;
    }
    
    private String formatPercentage(double value) {
        return String.format("%+.0f%%", value);
    }
    
    private String calculateAvgResponseTime(List<DogReport> reports) {
        if (reports.isEmpty()) return "N/A";
        
        // Calculate average time between report and first action
        // For now, return a mock value
        return "12 min";
    }
    
    private int calculateSuccessRate(List<DogReport> reports) {
        if (reports.isEmpty()) return 0;
        
        long successfulCases = reports.stream()
                .filter(r -> DogReport.Status.COMPLETED.equals(r.getStatus()) || 
                            DogReport.Status.RESCUED.equals(r.getStatus()))
                .count();
        
        return (int) ((double) successfulCases / reports.size() * 100);
    }
    
    private int getActiveZonesCount(List<DogReport> reports) {
        return (int) reports.stream()
                .map(DogReport::getLocation)
                .distinct()
                .count();
    }
    
    private int getTodayReportsCount() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        return (int) dogReportRepository.findAll().stream()
                .filter(r -> r.getCreatedAt().isAfter(startOfDay))
                .count();
    }
    
    private Integer getReportsForDay(List<DogReport> reports, int dayOfWeek) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekStart = now.minusDays(7);
        
        return (int) reports.stream()
                .filter(r -> r.getCreatedAt().isAfter(weekStart))
                .filter(r -> r.getCreatedAt().getDayOfWeek().getValue() == dayOfWeek)
                .count();
    }
    
    private String getTimeAgo(LocalDateTime dateTime) {
        Duration duration = Duration.between(dateTime, LocalDateTime.now());
        
        long minutes = duration.toMinutes();
        if (minutes < 1) return "Just now";
        if (minutes < 60) return minutes + " min ago";
        
        long hours = duration.toHours();
        if (hours < 24) return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
        
        long days = duration.toDays();
        if (days < 30) return days + " day" + (days > 1 ? "s" : "") + " ago";
        
        long months = days / 30;
        return months + " month" + (months > 1 ? "s" : "") + " ago";
    }
}
