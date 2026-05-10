package br.edu.scea.comite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ComiteApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ComiteApiApplication.class, args);
    }
}
