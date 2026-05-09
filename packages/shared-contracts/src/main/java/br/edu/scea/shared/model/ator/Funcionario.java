package br.edu.scea.shared.model.ator;

import java.time.LocalDate;
import java.util.Objects;

public class Funcionario {
    private final Matricula matricula;
    private final String nome;
    private final LocalDate nascimento;
    private final char sexo; // 'M', 'F', 'O'

    public Funcionario(Matricula matricula, String nome, LocalDate nascimento, char sexo) {
        this.matricula = Objects.requireNonNull(matricula, "Matrícula é obrigatória.");
        this.nome = Objects.requireNonNull(nome, "Nome é obrigatório.");
        this.nascimento = Objects.requireNonNull(nascimento, "Nascimento é obrigatório.");
        
        String sexoStr = String.valueOf(sexo).toUpperCase();
        if (!"MFO".contains(sexoStr)) {
            throw new IllegalArgumentException("Sexo deve ser M, F ou O.");
        }
        this.sexo = sexoStr.charAt(0);
    }

    public Matricula getMatricula() { return matricula; }
    public String getNome() { return nome; }
    public LocalDate getNascimento() { return nascimento; }
    public char getSexo() { return sexo; }
}
