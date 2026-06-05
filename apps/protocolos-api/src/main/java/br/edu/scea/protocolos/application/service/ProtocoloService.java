package br.edu.scea.protocolos.application.service;

import br.edu.scea.protocolos.infrastructure.persistence.*;
import br.edu.scea.protocolos.infrastructure.messaging.RabbitMQConfig;
import br.edu.scea.shared.dto.protocolo.DeliberacaoRequest;
import br.edu.scea.shared.dto.protocolo.DesignarPareceristaRequest;
import br.edu.scea.shared.dto.protocolo.RegistrarParecerRequest;
import br.edu.scea.shared.dto.protocolo.SubmissaoProtocoloRequest;
import br.edu.scea.shared.enums.EstadoProtocolo;
import br.edu.scea.shared.events.integration.*;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProtocoloService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ProtocoloService.class);

    private final ProtocoloRepository protocoloRepository;
    private final ProtocoloDesignacaoParecerRepository designacaoRepository;
    private final ProtocoloParecerRepository parecerRepository;
    private final ProtocoloDecisaoRepository decisaoRepository;
    private final CalendarioService calendarioService;
    private final RabbitTemplate rabbitTemplate;

    public ProtocoloService(ProtocoloRepository protocoloRepository,
                            ProtocoloDesignacaoParecerRepository designacaoRepository,
                            ProtocoloParecerRepository parecerRepository,
                            ProtocoloDecisaoRepository decisaoRepository,
                            CalendarioService calendarioService,
                            RabbitTemplate rabbitTemplate) {
        this.protocoloRepository = protocoloRepository;
        this.designacaoRepository = designacaoRepository;
        this.parecerRepository = parecerRepository;
        this.decisaoRepository = decisaoRepository;
        this.calendarioService = calendarioService;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Transactional
    public UUID criarEmenda(UUID protocoloId) {
        ProtocoloEntity original = protocoloRepository.findById(protocoloId)
                .orElseThrow(() -> new RuntimeException("Protocolo original não encontrado"));

        // "Se NÃO (for Aprovado OU for Reprovado), então lança o erro"
        if (!(original.getEstado() == EstadoProtocolo.APROVADO || original.getEstado() == EstadoProtocolo.REPROVADO)) {
            throw new IllegalStateException("Apenas protocolos que passaram por deliberação da presidência podem sofrer emendas.");
        }
        UUID usuarioId = getUsuarioLogadoId();
        String codigoEmenda = original.getCodigoProtocolo() + "-EM" + (original.getEmendas().size() + 1);

        ProtocoloEntity emenda = new ProtocoloEntity();
        emenda.setId(UUID.randomUUID());
        emenda.setProtocoloPai(original);
        emenda.setCodigoProtocolo(codigoEmenda);
        emenda.setTitulo(original.getTitulo() + " (Emenda)");
        emenda.setObjetivo(original.getObjetivo());
        emenda.setResumo(original.getResumo());
        emenda.setJustificativa("Emenda ao protocolo original " + original.getCodigoProtocolo());
        emenda.setVersaoAtual(original.getVersaoAtual() + 1);
        emenda.setEstado(EstadoProtocolo.SUBMETIDO);
        emenda.setDataSubmissao(LocalDate.now());
        emenda.setDataInicioPlanejada(original.getDataInicioPlanejada());
        emenda.setDataTerminoPlanejada(original.getDataTerminoPlanejada());
        emenda.setQuantidadeAnimaisAprovada(0);
        emenda.setCriadoEm(LocalDateTime.now());
        emenda.setAtualizadoEm(LocalDateTime.now());
        emenda.setIdUsuarioSubmetedor(usuarioId);
        emenda.setNomePesquisadorResponsavel(original.getNomePesquisadorResponsavel());

        // Clonar alocações
        emenda.setAlocacoes(original.getAlocacoes().stream().map(a -> {
            AlocacaoBiologicaEntity nova = new AlocacaoBiologicaEntity();
            nova.setId(UUID.randomUUID());
            nova.setProtocolo(emenda);
            nova.setEspecieId(a.getEspecieId());
            nova.setBioterioId(a.getBioterioId());
            nova.setNomeLinhagem(a.getNomeLinhagem());
            nova.setQuantidadePlanejada(a.getQuantidadePlanejada());
            nova.setJustificativa(a.getJustificativa());
            nova.setSexo(a.getSexo());
            nova.setCriadoEm(LocalDateTime.now());
            return nova;
        }).collect(Collectors.toList()));

        ProtocoloEntity salvo = protocoloRepository.save(emenda);

        // Disparar evento de submissão para emendas também
        publicarEventoSubmissao(salvo, salvo.getNomePesquisadorResponsavel());

        return salvo.getId();
    }

    @Transactional
    public void arquivar(UUID id) {
        ProtocoloEntity p = protocoloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Protocolo não encontrado"));
        
        if (p.getEstado() == EstadoProtocolo.APROVADO || p.getEstado() == EstadoProtocolo.REPROVADO) {
            throw new IllegalStateException("Protocolos já deliberados não podem ser arquivados.");
        }

        p.setAtivo(false);
        p.setEstado(EstadoProtocolo.ARQUIVADO);
        p.setAtualizadoEm(LocalDateTime.now());
        protocoloRepository.save(p);
    }

    @Transactional
    public void desarquivar(UUID id) {
        ProtocoloEntity p = protocoloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Protocolo não encontrado"));
        
        p.setAtivo(true);
        p.setEstado(EstadoProtocolo.SUBMETIDO);
        p.setAtualizadoEm(LocalDateTime.now());
        protocoloRepository.save(p);
    }

    public List<ProtocoloEntity> listar() {
        return protocoloRepository.findAll();
    }

    public java.util.Optional<ProtocoloEntity> buscarPorId(UUID id) {
        return protocoloRepository.findById(id);
    }

    private UUID getUsuarioLogadoId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getDetails() instanceof Map<?, ?> details) {
            String idStr = (String) details.get("userId");
            if (idStr != null && !idStr.isBlank()) {
                return UUID.fromString(idStr);
            }
        }
        throw new IllegalStateException("ID do usuário não encontrado no token.");
    }

    @Transactional
    public UUID submeter(SubmissaoProtocoloRequest request) {
        if (request.dataInicioPlanejada().isAfter(request.dataTerminoPlanejada())) {
            throw new IllegalArgumentException("A data de início não pode ser após a data de término.");
        }
        if (request.dataInicioPlanejada().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("A data de início não pode ser no passado.");
        }

        calendarioService.validarDiaUtil(request.dataInicioPlanejada(), "Início do experimento");
        calendarioService.validarDiaUtil(request.dataTerminoPlanejada(), "Término do experimento");

        UUID usuarioId = getUsuarioLogadoId();
        String emailUsuario = SecurityContextHolder.getContext().getAuthentication().getName();
        
        String codigo = "P-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        ProtocoloEntity entity = new ProtocoloEntity();
        entity.setId(UUID.randomUUID());
        entity.setCodigoProtocolo(codigo);
        entity.setTitulo(request.titulo());
        entity.setObjetivo(request.objetivo());
        entity.setResumo(request.resumoPortugues());
        entity.setJustificativa(request.justificativa() != null ? request.justificativa() : "Submissão inicial");
        entity.setVersaoAtual(1);
        entity.setEstado(EstadoProtocolo.SUBMETIDO);
        entity.setDataSubmissao(LocalDate.now());
        entity.setDataInicioPlanejada(request.dataInicioPlanejada());
        entity.setDataTerminoPlanejada(request.dataTerminoPlanejada());
        entity.setQuantidadeAnimaisAprovada(0);
        entity.setCriadoEm(LocalDateTime.now());
        entity.setAtualizadoEm(LocalDateTime.now());
        entity.setIdUsuarioSubmetedor(usuarioId);
        entity.setNomePesquisadorResponsavel(emailUsuario);

        entity.setAlocacoes(request.alocacoes().stream().map(dto -> {
            AlocacaoBiologicaEntity aloc = new AlocacaoBiologicaEntity();
            aloc.setId(UUID.randomUUID());
            aloc.setProtocolo(entity);
            aloc.setEspecieId(dto.especieId());
            aloc.setBioterioId(dto.bioterioId());
            aloc.setNomeLinhagem(dto.nomeLinhagem());
            aloc.setQuantidadePlanejada(dto.quantidadePlanejada());
            aloc.setJustificativa(dto.justificativa());
            aloc.setSexo(dto.sexo());
            aloc.setCriadoEm(LocalDateTime.now());
            return aloc;
        }).collect(Collectors.toList()));

        ProtocoloEntity salvo = protocoloRepository.save(entity);
        publicarEventoSubmissao(salvo, emailUsuario);
        return salvo.getId();
    }

    private void publicarEventoSubmissao(ProtocoloEntity salvo, String email) {
        try {
            ProtocolSubmittedV1 event = new ProtocolSubmittedV1(
                UUID.randomUUID(), Instant.now(), salvo.getId(),
                salvo.getCodigoProtocolo(), salvo.getTitulo(), email,
                salvo.getObjetivo(), salvo.getResumo(),
                salvo.getDataInicioPlanejada(), salvo.getDataTerminoPlanejada(),
                salvo.getJustificativa()
            );
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY_SUBMETIDO, event);
        } catch (Exception e) {
            log.error("Erro submissão: {}", e.getMessage());
        }
    }

    @Transactional
    public void designarParecerista(UUID protocoloId, DesignarPareceristaRequest request) {
        ProtocoloEntity protocolo = protocoloRepository.findById(protocoloId)
                .orElseThrow(() -> new RuntimeException("Protocolo não encontrado"));

        UUID usuarioLogadoId = getUsuarioLogadoId();

        ProtocoloDesignacaoParecerEntity designacao = new ProtocoloDesignacaoParecerEntity();
        designacao.setId(UUID.randomUUID());
        designacao.setProtocolo(protocolo);
        designacao.setUsuarioPareceristaId(request.usuarioPareceristaId());
        designacao.setAtribuidoPorUsuarioId(usuarioLogadoId);
        designacao.setAtribuidoEm(LocalDateTime.now());
        designacao.setPrazoEm(request.prazoEm());
        designacao.setEstadoDesignacao("pendente");

        protocolo.setEstado(EstadoProtocolo.EM_ANALISE_CEUA);
        protocolo.getDesignacoesParecer().add(designacao);
        protocoloRepository.save(protocolo);

        try {
            ReviewerAssignedV1 event = new ReviewerAssignedV1(
                UUID.randomUUID(), Instant.now(), protocolo.getId(),
                protocolo.getCodigoProtocolo(), protocolo.getTitulo(),
                "parecerista@scea.edu.br", request.prazoEm()
            );
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY_DESIGNADO, event);
        } catch (Exception e) {
            log.error("Erro designação: {}", e.getMessage());
        }
    }

    @Transactional
    public void registrarParecer(UUID protocoloId, RegistrarParecerRequest request) {
        UUID usuarioLogadoId = getUsuarioLogadoId();
        String emailParecerista = SecurityContextHolder.getContext().getAuthentication().getName();
        ProtocoloEntity protocolo = protocoloRepository.findById(protocoloId)
                .orElseThrow(() -> new RuntimeException("Protocolo não encontrado"));

        ProtocoloDesignacaoParecerEntity designacao = protocolo.getDesignacoesParecer().stream()
                .filter(d -> d.getUsuarioPareceristaId().equals(usuarioLogadoId) && "pendente".equals(d.getEstadoDesignacao()))
                .findFirst().orElseThrow(() -> new RuntimeException("Designação pendente não encontrada"));

        ProtocoloParecerEntity parecer = new ProtocoloParecerEntity();
        parecer.setId(UUID.randomUUID());
        parecer.setDesignacao(designacao);
        parecer.setRecomendacao(request.recomendacao().getCodigo());
        parecer.setResumoTecnico(request.resumoTecnico());
        parecer.setConsideracoesEticas(request.consideracoesEticas());
        parecer.setSubmetidoEm(LocalDateTime.now());

        designacao.setEstadoDesignacao("concluido");
        protocolo.setEstado(EstadoProtocolo.PENDENCIA_SOLICITADA); 
        
        parecerRepository.save(parecer);
        protocoloRepository.save(protocolo);

        try {
            ReviewSubmittedV1 event = new ReviewSubmittedV1(
                UUID.randomUUID(), Instant.now(), protocolo.getId(),
                protocolo.getCodigoProtocolo(), protocolo.getTitulo(),
                emailParecerista, request.recomendacao().getCodigo(),
                request.resumoTecnico(), request.consideracoesEticas()
            );
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY_PARECER, event);
        } catch (Exception e) {
            log.error("Erro parecer: {}", e.getMessage());
        }
    }

    @Transactional
    public void deliberar(UUID protocoloId, DeliberacaoRequest request) {
        ProtocoloEntity protocolo = protocoloRepository.findById(protocoloId)
                .orElseThrow(() -> new RuntimeException("Protocolo não encontrado"));

        UUID usuarioLogadoId = getUsuarioLogadoId();
        ProtocoloDecisaoEntity decisao = new ProtocoloDecisaoEntity();
        decisao.setId(UUID.randomUUID());
        decisao.setProtocolo(protocolo);
        decisao.setReuniaoId(request.reuniaoId());
        decisao.setTipoDecisao(request.novoEstado().getCodigo());
        decisao.setFundamentacao(request.fundamentacao());
        decisao.setDecididoPorUsuarioId(usuarioLogadoId);
        decisao.setDecididoEm(LocalDateTime.now());
        decisao.setValidoAte(request.validoAte());
        decisao.setCriadoEm(LocalDateTime.now());

        protocolo.setEstado(request.novoEstado());
        if (request.novoEstado() == EstadoProtocolo.APROVADO && request.quantidadeAnimaisAprovada() != null) {
            protocolo.setQuantidadeAnimaisAprovada(request.quantidadeAnimaisAprovada());
        }

        publicarEventoConclusao(protocolo, request.fundamentacao(), request.novoEstado() == EstadoProtocolo.APROVADO);
        decisaoRepository.save(decisao);
        protocoloRepository.save(protocolo);
    }

    private void publicarEventoConclusao(ProtocoloEntity p, String fundamentacao, boolean aprovado) {
        try {
            String emailDestino = p.getNomePesquisadorResponsavel();
            if (emailDestino == null || !emailDestino.contains("@")) emailDestino = "secretariascea@gmail.com";

            String analiseParecerista = p.getDesignacoesParecer().stream()
                    .filter(d -> "concluido".equals(d.getEstadoDesignacao()) && d.getParecer() != null)
                    .map(d -> d.getParecer().getResumoTecnico() + " | Ética: " + d.getParecer().getConsideracoesEticas())
                    .findFirst().orElse("Análise técnica realizada.");

            ProtocolApprovedV1 event = new ProtocolApprovedV1(
                UUID.randomUUID(), Instant.now(), aprovado ? "1.0" : "1.0-REPROVADO",
                UUID.randomUUID().toString(), "protocolos-api", p.getId(),
                p.getTitulo(), p.getObjetivo(), p.getResumo(), emailDestino,
                p.getNomePesquisadorResponsavel(), fundamentacao,
                p.getDataInicioPlanejada(), p.getDataTerminoPlanejada(),
                analiseParecerista, fundamentacao
            );
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY_APROVADO, event);
        } catch (Exception e) {
            log.error("Erro conclusão: {}", e.getMessage());
        }
    }
}
