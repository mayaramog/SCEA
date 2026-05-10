package br.edu.scea.shared.dto.util;

import java.time.LocalDate;

public record FeriadoDTO(
    LocalDate date,
    String name,
    String type
) {}
