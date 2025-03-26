# Use OpenJDK as a base image for the build
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /workspace/app

# Copy the Maven files (pom.xml and other necessary files)
COPY pom.xml .
COPY src src

# Run Maven to build the project and install dependencies
RUN ./mvnw clean install -DskipTests  # or RUN mvn clean install if not using the wrapper

# Prepare the final image using a JRE image (for running the app)
FROM eclipse-temurin:17-jre-alpine

# Define volume for temporary files
VOLUME /tmp

# Set the working directory
WORKDIR /app

# Copy the compiled JAR file from the build stage
COPY --from=build /workspace/app/target/your-app.jar /app/your-app.jar

# Expose port 8080 for the backend service
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "/app/your-app.jar"]