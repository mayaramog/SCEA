FROM eclipse-temurin:25-jdk AS base
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:25-jre
WORKDIR /app
# Explicitly pick the fat jar and avoid any .original or thin jars
COPY --from=base /app/apps/protocolos-api/target/protocolos-api-1.0.0-SNAPSHOT.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
