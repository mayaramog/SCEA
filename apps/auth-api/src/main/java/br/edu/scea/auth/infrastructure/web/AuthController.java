package br.edu.scea.auth.infrastructure.web;

import br.edu.scea.auth.domain.model.Usuario;
import br.edu.scea.auth.domain.model.Papel;
import br.edu.scea.shared.dto.auth.*;
import br.edu.scea.auth.infrastructure.security.JwtService;
import br.edu.scea.auth.infrastructure.persistence.UsuarioRepository;
import br.edu.scea.auth.infrastructure.persistence.PapelRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.List;
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
    @Transactional
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
                String cleanCode = codigo.replace("ROLE_", "").toLowerCase();
                papelRepository.findByCodigo(cleanCode).ifPresent(papeis::add);
            }
        }
        novoUsuario.setPapeis(papeis);

        Usuario salvo = usuarioRepository.save(novoUsuario);
        
        return ResponseEntity.ok(mapToResponse(salvo));
    }

    @GetMapping("/usuarios")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'SECRETARIA')")
    public ResponseEntity<List<UsuarioResponse>> listarTodos() {
        return ResponseEntity.ok(usuarioRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList()));
    }

    @PutMapping("/usuarios/{id}/papeis")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @Transactional
    public ResponseEntity<UsuarioResponse> atualizarPapeis(@PathVariable("id") UUID id, @RequestBody @Valid AtualizarPapeisRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Set<Papel> novosPapeis = new HashSet<>();
        for (String codigo : request.codigosPapeis()) {
            // Limpa o prefixo ROLE_ vindo do frontend antes de buscar no banco
            String cleanCode = codigo.replace("ROLE_", "").toLowerCase();
            papelRepository.findByCodigo(cleanCode).ifPresent(novosPapeis::add);
        }
        
        usuario.setPapeis(novosPapeis);
        usuario.setAtualizadoEm(OffsetDateTime.now());

        Usuario salvo = usuarioRepository.save(usuario);

        return ResponseEntity.ok(mapToResponse(salvo));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> me(Authentication authentication) {
        return usuarioRepository.findByEmail(authentication.getName())
                .map(usuario -> ResponseEntity.ok(mapToResponse(usuario)))
                .orElse(ResponseEntity.notFound().build());
    }

    private UsuarioResponse mapToResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getNomeCompleto(),
                usuario.getPapeis().stream()
                        .map(Papel::getCodigo)
                        .collect(Collectors.toSet()),
                usuario.isEstaAtivo()
        );
    }
}
