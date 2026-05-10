package br.edu.scea.protocolos.application.service;

import br.edu.scea.protocolos.infrastructure.persistence.*;
import br.edu.scea.shared.dto.protocolo.DesignarPareceristaRequest;
import br.edu.scea.shared.dto.protocolo.RegistrarParecerRequest;
import br.edu.scea.shared.dto.protocolo.SubmissaoProtocoloRequest;
import br.edu.scea.shared.enums.EstadoProtocolo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProtocoloService {

    private final ProtocoloRepository protocoloRepository;
    private final ProtocoloDesignacaoParecerRepository designacaoRepository;
    private final ProtocoloParecerRepository parecerRepository;

    public ProtocoloService(ProtocoloRepository protocoloRepository,
                            ProtocoloDesignacaoParecerRepository designacaoRepository,
                            ProtocoloParecerRepository parecerRepository) {
        this.protocoloRepository = protocoloRepository;
        this.designacaoRepository = designacaoRepository;
        this.parecerRepository = parecerRepository;
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
        UUID usuarioId = getUsuarioLogadoId();
        String nomeCompleto = SecurityContextHolder.getContext().getAuthentication().getName();
        
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
        entity.setCriadoEm(OffsetDateTime.now());
        entity.setAtualizadoEm(OffsetDateTime.now());
        entity.setIdUsuarioSubmetedor(usuarioId);
        entity.setNomePesquisadorResponsavel(nomeCompleto);

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
            aloc.setCriadoEm(OffsetDateTime.now());
            return aloc;
        }).collect(Collectors.toList()));

        return protocoloRepository.save(entity).getId();
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
        designacao.setAtribuidoEm(OffsetDateTime.now());
        designacao.setPrazoEm(request.prazoEm());
        designacao.setEstadoDesignacao("pendente");

        protocolo.setEstado(EstadoProtocolo.EM_ANALISE_CEUA);
        protocolo.getDesignacoesParecer().add(designacao);
        
        protocoloRepository.save(protocolo);
    }

    @Transactional
    public void registrarParecer(UUID protocoloId, RegistrarParecerRequest request) {
        UUID usuarioLogadoId = getUsuarioLogadoId();
        
        ProtocoloEntity protocolo = protocoloRepository.findById(protocoloId)
                .orElseThrow(() -> new RuntimeException("Protocolo não encontrado"));

        ProtocoloDesignacaoParecerEntity designacao = protocolo.getDesignacoesParecer().stream()
                .filter(d -> d.getUsuarioPareceristaId().equals(usuarioLogadoId) && "pendente".equals(d.getEstadoDesignacao()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Nenhuma designação pendente encontrada para este usuário"));

        ProtocoloParecerEntity parecer = new ProtocoloParecerEntity();
        parecer.setId(UUID.randomUUID());
        parecer.setDesignacao(designacao);
        parecer.setRecomendacao(request.recomendacao().getCodigo());
        parecer.setResumoTecnico(request.resumoTecnico());
        parecer.setConsideracoesEticas(request.consideracoesEticas());
        parecer.setSubmetidoEm(OffsetDateTime.now());

        designacao.setEstadoDesignacao("concluido");
        protocolo.setEstado(EstadoProtocolo.PENDENCIA_SOLICITADA); // Exemplo de transição, ideal seria para Aguardando Deliberação
        
        parecerRepository.save(parecer);
        protocoloRepository.save(protocolo);
    }
}
