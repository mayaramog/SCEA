package br.edu.scea.shared.model.protocolo;

import br.edu.scea.shared.enums.DecisaoParecer;
import br.edu.scea.shared.enums.EstadoProtocolo;
import br.edu.scea.shared.model.ator.Ator;
import br.edu.scea.shared.events.domain.DomainEvent;
import br.edu.scea.shared.enums.PapelAtor;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import br.edu.scea.shared.events.domain.ProtocoloSubmetidoEvent;
import br.edu.scea.shared.events.domain.ProtocoloEnviadoParaParecerEvent;
import br.edu.scea.shared.events.domain.ParecerRegistradoEvent;
import br.edu.scea.shared.events.domain.ProtocoloDeliberadoEvent;

public class Protocolo {
    private final ProtocoloId id;
    private final String justificativa;
    private final String resumoPortugues;
    private final String resumoIngles;
    private final Periodo periodo;
    private final AlocacoesBiologicas alocacoes;
    private final UUID idDocentePesquisador;
    private EstadoProtocolo estado;
    private Parecer parecer;
    private Deliberacao deliberacao;
    private final List<DomainEvent> events = new ArrayList<>();

    private Protocolo(
        ProtocoloId id,
        String justificativa,
        String resumoPortugues,
        String resumoIngles,
        Periodo periodo,
        AlocacoesBiologicas alocacoes,
        UUID idDocentePesquisador,
        EstadoProtocolo estado
    ) {
        this.id = Objects.requireNonNull(id, "ID do protocolo é obrigatório.");
        this.justificativa = validateNotBlank(justificativa, "Justificativa");
        this.resumoPortugues = validateNotBlank(resumoPortugues, "Resumo em Português");
        this.resumoIngles = validateNotBlank(resumoIngles, "Resumo em Inglês");
        this.periodo = Objects.requireNonNull(periodo, "Período é obrigatório.");
        this.alocacoes = Objects.requireNonNull(alocacoes, "Alocações biológicas são obrigatórias.");
        this.idDocentePesquisador = Objects.requireNonNull(idDocentePesquisador, "Docente pesquisador é obrigatório.");
        this.estado = Objects.requireNonNull(estado, "Estado inicial é obrigatório.");
    }

    public static Protocolo submeter(
        String justificativa,
        String resumoPortugues,
        String resumoIngles,
        Periodo periodo,
        AlocacoesBiologicas alocacoes,
        UUID idDocentePesquisador
    ) {
        Protocolo protocolo = new Protocolo(
            ProtocoloId.generate(),
            justificativa,
            resumoPortugues,
            resumoIngles,
            periodo,
            alocacoes,
            idDocentePesquisador,
            EstadoProtocolo.RASCUNHO
        );
        protocolo.events.add(new ProtocoloSubmetidoEvent(protocolo.id.value(), Instant.now()));
        return protocolo;
    }

    public static Protocolo reconstituir(
        ProtocoloId id,
        String justificativa,
        String resumoPortugues,
        String resumoIngles,
        Periodo periodo,
        AlocacoesBiologicas alocacoes,
        UUID idDocentePesquisador,
        EstadoProtocolo estado,
        Parecer parecer,
        Deliberacao deliberacao
    ) {
        Protocolo p = new Protocolo(id, justificativa, resumoPortugues, resumoIngles, periodo, alocacoes, idDocentePesquisador, estado);
        p.parecer = parecer;
        p.deliberacao = deliberacao;
        return p;
    }

    public void enviarParaParecer(Ator autor) {
        validateRole(autor, PapelAtor.SECRETARIA);
        validateState(EstadoProtocolo.RASCUNHO);

        this.estado = EstadoProtocolo.EM_ANALISE_CEUA;
        this.events.add(new ProtocoloEnviadoParaParecerEvent(id.value(), autor.id(), Instant.now()));
    }

    public void registrarParecer(Ator autor, String texto, DecisaoParecer decisao) {
        validateRole(autor, PapelAtor.PARECERISTA);
        validateState(EstadoProtocolo.EM_ANALISE_CEUA);

        this.parecer = new Parecer(UUID.randomUUID(), this.id.value(), autor.id(), texto, decisao);
        this.estado = EstadoProtocolo.EM_ANALISE_CEUA;
        this.events.add(new ParecerRegistradoEvent(id.value(), autor.id(), decisao, Instant.now()));
    }

    public void deliberar(Ator autor, String justificativaPlenario, EstadoProtocolo decisaoFinal) {
        validateRole(autor, PapelAtor.PRESIDENTE);
        validateState(EstadoProtocolo.EM_ANALISE_CEUA);

        this.deliberacao = new Deliberacao(UUID.randomUUID(), this.id.value(), autor.id(), justificativaPlenario, decisaoFinal, Instant.now());
        this.estado = decisaoFinal;
        this.events.add(new ProtocoloDeliberadoEvent(id.value(), autor.id(), decisaoFinal, Instant.now()));
    }

    private void validateRole(Ator autor, PapelAtor papelRequerido) {
        if (autor.papel() != papelRequerido) {
            throw new IllegalStateException("Ação não permitida para o papel: " + autor.papel());
        }
    }

    private void validateState(EstadoProtocolo estadoEsperado) {
        if (this.estado != estadoEsperado) {
            throw new IllegalStateException("Ação não permitida para o estado atual: " + this.estado);
        }
    }

    private String validateNotBlank(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + " é obrigatório(a).");
        }
        return value;
    }

    // Getters
    public ProtocoloId getId() { return id; }
    public String getJustificativa() { return justificativa; }
    public String getResumoPortugues() { return resumoPortugues; }
    public String getResumoIngles() { return resumoIngles; }
    public Periodo getPeriodo() { return periodo; }
    public AlocacoesBiologicas getAlocacoes() { return alocacoes; }
    public UUID getIdDocentePesquisador() { return idDocentePesquisador; }
    public EstadoProtocolo getEstado() { return estado; }
    public Parecer getParecer() { return parecer; }
    public Deliberacao getDeliberacao() { return deliberacao; }
    public List<DomainEvent> getEvents() { return Collections.unmodifiableList(events); }
    public void clearEvents() { this.events.clear(); }
}
