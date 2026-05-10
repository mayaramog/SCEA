package br.edu.scea.shared.model.protocolo;

import br.edu.scea.shared.enums.DecisaoParecer;
import br.edu.scea.shared.enums.EstadoProtocolo;
import br.edu.scea.shared.events.domain.*;
import java.time.Instant;
import java.util.*;

public class Protocolo {
    private final UUID id;
    private final String titulo;
    private final String resumoPortugues;
    private final String resumoIngles;
    private final Periodo periodo;
    private final AlocacoesBiologicas alocacoes;
    private final UUID docenteId;
    private EstadoProtocolo estado;
    private Parecer parecer;
    private Deliberacao deliberacao;
    private final List<DomainEvent> events = new ArrayList<>();

    public Protocolo(UUID id, String titulo, String resumoPortugues, String resumoIngles, 
                     Periodo periodo, AlocacoesBiologicas alocacoes, UUID docenteId) {
        this.id = id;
        this.titulo = titulo;
        this.resumoPortugues = resumoPortugues;
        this.resumoIngles = resumoIngles;
        this.periodo = periodo;
        this.alocacoes = alocacoes;
        this.docenteId = docenteId;
        this.estado = EstadoProtocolo.RASCUNHO;
    }

    public static Protocolo submeter(String titulo, String resumoPt, String resumoEn, 
                                   Periodo periodo, AlocacoesBiologicas alocacoes, UUID docenteId) {
        if (titulo == null || titulo.isBlank()) throw new IllegalArgumentException("Título é obrigatório.");
        if (periodo == null) throw new IllegalArgumentException("Período é obrigatório.");
        if (alocacoes == null) throw new IllegalArgumentException("Alocações são obrigatórias.");
        
        Protocolo p = new Protocolo(UUID.randomUUID(), titulo, resumoPt, resumoEn, periodo, alocacoes, docenteId);
        p.events.add(new ProtocoloSubmetidoEvent(p.id, Instant.now()));
        return p;
    }

    public void enviarParaParecer(UUID usuarioId, Set<String> papeis) {
        validateRole(papeis, "secretaria");
        if (this.estado != EstadoProtocolo.RASCUNHO) {
            throw new IllegalStateException("Apenas protocolos em rascunho podem ser enviados para parecer.");
        }
        this.estado = EstadoProtocolo.EM_ANALISE_CEUA;
        this.events.add(new ProtocoloEnviadoParaParecerEvent(this.id, usuarioId, Instant.now()));
    }

    public void registrarParecer(UUID usuarioId, Set<String> papeis, String conteudo, DecisaoParecer decisao) {
        validateRole(papeis, "parecerista");
        this.parecer = new Parecer(usuarioId, conteudo, decisao, Instant.now());
        this.events.add(new ParecerRegistradoEvent(this.id, usuarioId, decisao, Instant.now()));
    }

    public void deliberar(UUID usuarioId, Set<String> papeis, String justificativa, EstadoProtocolo novoEstado) {
        validateRole(papeis, "presidente");
        this.deliberacao = new Deliberacao(usuarioId, justificativa, novoEstado, Instant.now());
        this.estado = novoEstado;
        this.events.add(new ProtocoloDeliberadoEvent(this.id, usuarioId, novoEstado, Instant.now()));
    }

    private void validateRole(Set<String> papeis, String papelRequerido) {
        if (papeis == null || !papeis.contains(papelRequerido.toLowerCase())) {
            throw new IllegalStateException("Ação não permitida para o usuário. Papel requerido: " + papelRequerido);
        }
    }

    // Getters
    public UUID getId() { return id; }
    public String getTitulo() { return titulo; }
    public EstadoProtocolo getEstado() { return estado; }
    public Parecer getParecer() { return parecer; }
    public Deliberacao getDeliberacao() { return deliberacao; }
    public List<DomainEvent> getEvents() { return Collections.unmodifiableList(events); }
    public void clearEvents() { this.events.clear(); }
}
