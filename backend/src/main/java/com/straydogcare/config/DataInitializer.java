package com.straydogcare.config;

import com.straydogcare.model.User;
import com.straydogcare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            // Create admin user if not exists
            if (!userRepository.existsByEmail("admin@straydogcare.com")) {
                User admin = new User();
                admin.setName("Admin User");
                admin.setEmail("admin@straydogcare.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setContact("+1-555-0001");
                admin.setRole(User.Role.ADMIN);
                admin.setActive(true);
                
                userRepository.save(admin);
                log.info("Created admin user: admin@straydogcare.com / admin123");
            }
            
            // Create demo volunteer user if not exists
            if (!userRepository.existsByEmail("volunteer@straydogcare.com")) {
                User volunteer = new User();
                volunteer.setName("Demo Volunteer");
                volunteer.setEmail("volunteer@straydogcare.com");
                volunteer.setPassword(passwordEncoder.encode("volunteer123"));
                volunteer.setContact("+1-555-0002");
                volunteer.setRole(User.Role.VOLUNTEER);
                volunteer.setActive(true);
                
                userRepository.save(volunteer);
                log.info("Created volunteer user: volunteer@straydogcare.com / volunteer123");
            }
            
            // Create demo regular user if not exists
            if (!userRepository.existsByEmail("user@straydogcare.com")) {
                User user = new User();
                user.setName("Demo User");
                user.setEmail("user@straydogcare.com");
                user.setPassword(passwordEncoder.encode("user123"));
                user.setContact("+1-555-0003");
                user.setRole(User.Role.USER);
                user.setActive(true);
                
                userRepository.save(user);
                log.info("Created regular user: user@straydogcare.com / user123");
            }
            
            log.info("Database initialization completed!");
        };
    }
}
