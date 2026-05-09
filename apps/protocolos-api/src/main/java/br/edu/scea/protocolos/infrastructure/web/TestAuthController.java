package br.edu.scea.protocolos.infrastructure.web;

import br.edu.scea.protocolos.infrastructure.security.JwtService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class TestAuthController {
    private final JwtService jwtService;

    public TestAuthController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @GetMapping("/token")
    public String getToken(@RequestParam String role) {
        return jwtService.generateToken(UUID.randomUUID(), role.toUpperCase());
    }
}
