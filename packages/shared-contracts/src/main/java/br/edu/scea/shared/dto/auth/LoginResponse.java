package br.edu.scea.shared.dto.auth;

public record LoginResponse(
    String token,
    String tipo,
    long expiraEm
) {
    public LoginResponse(String token, long expiraEm) {
        this(token, "Bearer", expiraEm);
    }
}
