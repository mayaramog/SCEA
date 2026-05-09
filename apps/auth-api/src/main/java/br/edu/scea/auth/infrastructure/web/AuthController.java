package br.edu.scea.auth.infrastructure.web;

import br.edu.scea.auth.domain.model.Usuario;
import br.edu.scea.auth.domain.model.Papel;
import br.edu.scea.shared.dto.auth.LoginRequest;
import br.edu.scea.shared.dto.auth.LoginResponse;
import br.edu.scea.shared.dto.auth.UsuarioResponse;
import br.edu.scea.shared.dto.auth.CadastroUsuarioRequest;
import br.edu.scea.auth.infrastructure.security.JwtService;
import br.edu.scea.auth.infrastructure.persistence.UsuarioRepository;
import br.edu.scea.auth.infrastructure.persistence.PapelRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final PapelRepository papelRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${auth.jwt.expiration}")
    private long expiration;

    public AuthController(AuthenticationManager authenticationManager, 
                          JwtService jwtService, 
                          UsuarioRepository usuarioRepository,
                          PapelRepository papelRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
        this.papelRepository = papelRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        String email = request.email().replaceAll("\\s", "");
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.senha())
        );

        String token = jwtService.generateToken(auth);
        return ResponseEntity.ok(new LoginResponse(token, expiration));
    }

    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioResponse> cadastrar(@RequestBody @Valid CadastroUsuarioRequest request) {
        if (usuarioRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("E-mail já cadastrado");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setId(UUID.randomUUID());
        novoUsuario.setEmail(request.email().trim().toLowerCase());
        novoUsuario.setNomeCompleto(request.nomeCompleto());
        novoUsuario.setPasswordHash(passwordEncoder.encode(request.senha()));
        novoUsuario.setEstaAtivo(true);
        novoUsuario.setCriadoEm(OffsetDateTime.now());
        novoUsuario.setAtualizadoEm(OffsetDateTime.now());

        Set<Papel> papeis = new HashSet<>();
        if (request.codigosPapeis() != null) {
            for (String codigo : request.codigosPapeis()) {
                papelRepository.findByCodigo(codigo.toLowerCase()).ifPresent(papeis::add);
            }
        }
        novoUsuario.setPapeis(papeis);

        Usuario salvo = usuarioRepository.save(novoUsuario);
        
        return ResponseEntity.ok(new UsuarioResponse(
                salvo.getId(),
                salvo.getEmail(),
                salvo.getNomeCompleto(),
                salvo.getPapeis().stream().map(Papel::getCodigo).collect(Collectors.toSet())
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> me(Authentication authentication) {
        return usuarioRepository.findByEmail(authentication.getName())
                .map(usuario -> ResponseEntity.ok(new UsuarioResponse(
                        usuario.getId(),
                        usuario.getEmail(),
                        usuario.getNomeCompleto(),
                        usuario.getPapeis().stream()
                                .map(Papel::getCodigo)
                                .collect(Collectors.toSet())
                )))
                .orElse(ResponseEntity.notFound().build());
    }
}
