FROM eclipse-temurin:25-jdk AS base
WORKDIR /app
# copy only necessary files to build the api-gateway module
# copy wrapper and project files
COPY mvnw mvnw.cmd /app/
COPY .mvn /app/.mvn
COPY pom.xml /app/pom.xml
COPY apps/api-gateway/pom.xml /app/apps/api-gateway/pom.xml
COPY apps/api-gateway /app/apps/api-gateway
# build only the api-gateway module to speed up and avoid resolving all modules
RUN ./mvnw -f apps/api-gateway/pom.xml clean package -DskipTests

FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=base /app/apps/api-gateway/target/api-gateway-1.0.0-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
