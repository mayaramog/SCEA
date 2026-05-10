package br.edu.scea.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-api", r -> r.path("/auth/**").uri("lb://AUTH-API"))
                .route("protocolos-api", r -> r.path("/protocolos/**").uri("lb://PROTOCOLOS-API"))
                .route("recursos-api", r -> r.path("/recursos/**").uri("lb://RECURSOS-API"))
                .route("comite-api", r -> r.path("/comite/**").uri("lb://COMITE-API"))
                .route("relatorios-api", r -> r.path("/relatorios/**").uri("lb://RELATORIOS-API"))
                .build();
    }
}
