# ==================================
# Compile and Build all modules
# ==================================
FROM maven:3.9.16-eclipse-temurin-17 AS builder
WORKDIR /build

# Copy the parent POM and all child module POMs first to cache dependencies
COPY pom.xml .
COPY common-libs/pom.xml common-libs/
COPY user-service/pom.xml user-service/
COPY auth-service/pom.xml auth-service/
COPY url-service/pom.xml url-service/
COPY redirect-service/pom.xml redirect-service/
COPY analytics-service/pom.xml analytics-service/
COPY local-api-gateway/pom.xml local-api-gateway/

# Download dependencies and cache them
RUN mvn dependency:go-offline -B

# Copy the source code of all modules
COPY common-libs/ common-libs/
COPY user-service/ user-service/
COPY auth-service/ auth-service/
COPY url-service/ url-service/
COPY redirect-service/ redirect-service/
COPY analytics-service/ analytics-service/
COPY local-api-gateway/ local-api-gateway/

ARG MODULE_NAME

RUN echo "Building module: $MODULE_NAME"
# Build common-libs first and then the target module
RUN mvn clean package -pl common-libs,${MODULE_NAME} -am -DskipTests

# Run layertools extract inside the builder stage where MODULE_NAME is valid
RUN java -Djarmode=layertools -jar ${MODULE_NAME}/target/${MODULE_NAME}-*.jar extract --destination /extracted

# ==================================
# Final runtime image
# ==================================
FROM eclipse-temurin:17-jre
WORKDIR /app

RUN groupadd --system spring && useradd --system --gid spring spring
USER spring:spring

# Copy the extracted layers from the builder stage
COPY --from=builder /extracted/dependencies/ ./
COPY --from=builder /extracted/spring-boot-loader/ ./
COPY --from=builder /extracted/snapshot-dependencies/ ./
COPY --from=builder /extracted/application/ ./

EXPOSE 8080

ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
