package br.edu.scea.auth.infrastructure.security;

import br.edu.scea.auth.infrastructure.persistence.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return usuarioRepository.findByEmail(email)
                .map(usuario -> new SceaUser(
                        usuario.getId(),
                        usuario.getEmail(),
                        usuario.getPasswordHash(),
                        usuario.isEstaAtivo(),
                        true, true, true,
                        usuario.getPapeis().stream()
                                .map(papel -> new SimpleGrantedAuthority("ROLE_" + papel.getCodigo().toUpperCase()))
                                .collect(Collectors.toSet()),
                        usuario.getNomeCompleto()
                ))
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));        
    }
}
