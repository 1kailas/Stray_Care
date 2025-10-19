# Multi-stage build for Spring Boot application
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy Maven wrapper files first (from backend directory)
COPY backend/.mvn .mvn
COPY backend/mvnw .
COPY backend/mvnw.cmd .

# Make mvnw executable
RUN chmod +x mvnw

# Copy pom.xml and download dependencies
COPY backend/pom.xml .
RUN ./mvnw dependency:go-offline

# Copy source code and build
COPY backend/src ./src
RUN ./mvnw clean package -DskipTests

# Production stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/target/stray-dogcare-backend-1.0.0.jar app.jar

# Create uploads directory
RUN mkdir -p /app/uploads

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/actuator/health || exit 1

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
