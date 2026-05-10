package br.edu.scea.relatorios;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class RelatoriosApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(RelatoriosApiApplication.class, args);
    }
}
