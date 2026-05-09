package br.edu.scea.protocolos.infrastructure.adapters;

import java.time.LocalDate;

public record FeriadoResponse(String date, String name) {
    public LocalDate toLocalDate() {
        return LocalDate.parse(date);
    }
}
