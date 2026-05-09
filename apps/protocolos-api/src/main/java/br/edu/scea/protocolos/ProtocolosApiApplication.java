package br.edu.scea.protocolos;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableCaching
public class ProtocolosApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProtocolosApiApplication.class, args);
    }
}
