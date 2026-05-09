package br.edu.scea.atores.contracts;

import br.edu.scea.shared.enums.Titulacao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

public record CadastrarDocenteRequest(
    @NotBlank 
    @Pattern(regexp = "\\d{8}", message = "A matrícula deve conter exatamente 8 dígitos.")
    String matricula,
    
    @NotBlank 
    String nome,

    @NotNull
    LocalDate nascimento,

    @NotNull
    Character sexo,
    
    @NotNull 
    Titulacao titulacao
) {}
