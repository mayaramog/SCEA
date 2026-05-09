package br.edu.scea.protocolos.infrastructure.persistence;

import br.edu.scea.shared.enums.*;
import br.edu.scea.shared.model.protocolo.*;
import br.edu.scea.shared.events.domain.*;
import br.edu.scea.shared.events.integration.*;
import br.edu.scea.shared.ports.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Repository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
public class ProtocoloJpaAdapter implements ProtocoloRepository {
    private final ProtocoloSpringDataRepository repository;
    private final OutboxSpringDataRepository outboxRepository;
    private final ObjectMapper objectMapper;

    public ProtocoloJpaAdapter(
        ProtocoloSpringDataRepository repository,
        OutboxSpringDataRepository outboxRepository,
        ObjectMapper objectMapper
    ) {
        this.repository = repository;
        this.outboxRepository = outboxRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void salvar(Protocolo protocolo) {
        ProtocoloJpaEntity entity = toEntity(protocolo);
        repository.save(entity);
        
        persistirEventos(protocolo);
    }

    private void persistirEventos(Protocolo p) {
        p.getEvents().forEach(event -> {
            try {
                Object eventToPublish = event;
                
                if (event instanceof ProtocoloSubmetidoEvent e) {
                    eventToPublish = new ProtocolSubmittedV1(
                        UUID.randomUUID(),
                        e.protocolId(),
                        "Pesquisador Desconhecido", // TODO: context
                        Instant.now(),
                        "1.0",
                        UUID.randomUUID().toString()
                    );
                } else if (event instanceof ProtocoloDeliberadoEvent e && e.decisaoFinal() == EstadoProtocolo.USO_APROVADO) {
                    eventToPublish = new ProtocolApprovedV1(
                        UUID.randomUUID(),
                        p.getId().value(),
                        p.getJustificativa(),
                        p.getPeriodo().inicio(),
                        p.getPeriodo().termino(),
                        Instant.now()
                    );
                }

                OutboxMessageJpaEntity outbox = new OutboxMessageJpaEntity();
                outbox.setId(UUID.randomUUID());
                outbox.setAggregateType("Protocolo");
                outbox.setAggregateId(p.getId().value());
                outbox.setEventType(event.getClass().getSimpleName());
                outbox.setPayload(objectMapper.writeValueAsString(eventToPublish));
                outbox.setStatus("PENDING");
                
                outboxRepository.save(outbox);
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Erro ao serializar evento para outbox", e);
            }
        });
        p.clearEvents();
    }

    @Override
    public Optional<Protocolo> buscarPorId(ProtocoloId id) {
        return repository.findById(id.value()).map(this::toDomain);
    }

    private ProtocoloJpaEntity toEntity(Protocolo p) {
        ProtocoloJpaEntity entity = new ProtocoloJpaEntity();
        entity.setId(p.getId().value());
        entity.setJustificativa(p.getJustificativa());
        entity.setResumoPt(p.getResumoPortugues());
        entity.setResumoEn(p.getResumoIngles());
        entity.setDataInicio(p.getPeriodo().inicio());
        entity.setDataTermino(p.getPeriodo().termino());
        entity.setEstado(p.getEstado());
        entity.setIdDocentePesquisador(p.getIdDocentePesquisador());
        
        List<AlocacaoBiologicaJpaEntity> alocacoes = p.getAlocacoes().itens().stream().map(a -> {
            AlocacaoBiologicaJpaEntity ae = new AlocacaoBiologicaJpaEntity();
            ae.setId(a.id());
            ae.setProtocolo(entity);
            
            EspecieJpaEntity ee = new EspecieJpaEntity();
            ee.setId(a.especie().id());
            ee.setNomenclatura(a.especie().nomenclatura());
            ae.setEspecie(ee);
            
            BioterioJpaEntity be = new BioterioJpaEntity();
            be.setId(a.bioterio().id());
            be.setNome(a.bioterio().nome());
            ae.setBioterio(be);
            
            ae.setQuantidade(a.quantidade().valor());
            return ae;
        }).collect(Collectors.toList());
        
        entity.setAlocacoes(alocacoes);

        if (p.getParecer() != null) {
            ParecerJpaEntity pe = new ParecerJpaEntity();
            pe.setId(p.getParecer().id());
            pe.setProtocolo(entity);
            pe.setIdDocenteParecerista(p.getParecer().pareceristaId());
            pe.setTexto(p.getParecer().texto());
            pe.setDecisao(p.getParecer().decisao());
            entity.setParecer(pe);
        }

        if (p.getDeliberacao() != null) {
            DeliberacaoJpaEntity de = new DeliberacaoJpaEntity();
            de.setId(p.getDeliberacao().id());
            de.setProtocolo(entity);
            de.setIdDocentePresidente(p.getDeliberacao().presidenteId());
            de.setJustificativa(p.getDeliberacao().justificativa());
            de.setDecisaoFinal(p.getDeliberacao().decisaoFinal());
            entity.setDeliberacao(de);
        }

        return entity;
    }

    private Protocolo toDomain(ProtocoloJpaEntity e) {
        Periodo periodo = new Periodo(e.getDataInicio(), e.getDataTermino());
        AlocacoesBiologicas alocacoes = new AlocacoesBiologicas(
            e.getAlocacoes().stream().map(ae -> new AlocacaoBiologica(
                ae.getId(),
                new Especie(ae.getEspecie().getId(), ae.getEspecie().getNomenclatura()),
                new Bioterio(ae.getBioterio().getId(), ae.getBioterio().getNome()),
                new QuantidadeAnimais(ae.getQuantidade())
            )).collect(Collectors.toList())
        );

        Parecer parecer = null;
        if (e.getParecer() != null) {
            parecer = new Parecer(
                e.getParecer().getId(),
                e.getId(),
                e.getParecer().getIdDocenteParecerista(),
                e.getParecer().getTexto(),
                e.getParecer().getDecisao()
            );
        }

        Deliberacao deliberacao = null;
        if (e.getDeliberacao() != null) {
            deliberacao = new Deliberacao(
                e.getDeliberacao().getId(),
                e.getId(),
                e.getDeliberacao().getIdDocentePresidente(),
                e.getDeliberacao().getJustificativa(),
                e.getDeliberacao().getDecisaoFinal(),
                e.getDeliberacao().getDataAuditoria()
            );
        }

        return Protocolo.reconstituir(
            new ProtocoloId(e.getId()),
            e.getJustificativa(),
            e.getResumoPt(),
            e.getResumoEn(),
            periodo,
            alocacoes,
            e.getIdDocentePesquisador(),
            e.getEstado(),
            parecer,
            deliberacao
        );
    }
}
