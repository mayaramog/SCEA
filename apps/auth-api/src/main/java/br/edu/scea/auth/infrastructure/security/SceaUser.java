package br.edu.scea.auth.infrastructure.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import java.util.Collection;
import java.util.UUID;

public class SceaUser extends User {
    private final UUID id;
    private final String nomeCompleto;

    public SceaUser(UUID id, String username, String password, boolean enabled, 
                    boolean accountNonExpired, boolean credentialsNonExpired, 
                    boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities,
                    String nomeCompleto) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
        this.id = id;
        this.nomeCompleto = nomeCompleto;
    }

    public UUID getId() { return id; }
    public String getNomeCompleto() { return nomeCompleto; }
}
