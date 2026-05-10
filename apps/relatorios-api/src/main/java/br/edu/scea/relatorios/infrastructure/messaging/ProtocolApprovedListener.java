package br.edu.scea.relatorios.infrastructure.messaging;

import br.edu.scea.relatorios.infrastructure.persistence.RelatorioEntity;
import br.edu.scea.relatorios.infrastructure.persistence.RelatorioRepository;
import br.edu.scea.shared.events.integration.NotificationEvent;
import br.edu.scea.shared.events.integration.ProtocolApprovedV1;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.io.FileOutputStream;
import java.time.OffsetDateTime;
import java.util.UUID;

@Component
public class ProtocolApprovedListener {

    private final RelatorioRepository relatorioRepository;
    private final RabbitTemplate rabbitTemplate;
    private final String STORAGE_PATH = "C:/Users/Gustavo Cortez/Documents/Faculdade/QS/SCEA/storage/certificados/";

    public ProtocolApprovedListener(RelatorioRepository relatorioRepository, RabbitTemplate rabbitTemplate) {
        this.relatorioRepository = relatorioRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_GERACAO_NAME)
    public void onProtocolApproved(ProtocolApprovedV1 event) {
        System.out.println("DEBUG: Iniciando geração de PDF para protocolo: " + event.protocolId());

        String fileName = "certificado_" + event.protocolId() + ".pdf";
        String fullPath = STORAGE_PATH + fileName;

        try {
            // 1. Gerar o PDF Real
            Document document = new Document();
            PdfWriter.getInstance(document, new FileOutputStream(fullPath));
            document.open();
            document.add(new Paragraph("SCEA - SISTEMA DE CONTROLE DE EXPERIMENTAÇÃO ANIMAL"));
            document.add(new Paragraph("CERTIFICADO DE APROVAÇÃO DE PROTOCOLO"));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("ID do Protocolo: " + event.protocolId()));
            document.add(new Paragraph("Justificativa: " + event.justificativa()));
            document.add(new Paragraph("Data de Início: " + event.dataInicio()));
            document.add(new Paragraph("Data de Término: " + event.dataTermino()));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Este protocolo foi revisado e aprovado pelo CEUA em: " + event.occurredAt()));
            document.close();

            // 2. Salvar no Banco
            RelatorioEntity relatorio = new RelatorioEntity();
            relatorio.setId(UUID.randomUUID());
            relatorio.setProtocoloId(event.protocolId());
            relatorio.setTipoDocumento("certificado_aprovacao");
            relatorio.setNomeArquivoOriginal(fileName);
            relatorio.setMimeType("application/pdf");
            relatorio.setCaminhoArmazenamento(fullPath);
            relatorio.setEnviadoPorUsuarioId(UUID.fromString("550e8400-e29b-41d4-a716-446655440000"));
            relatorio.setEnviadoEm(OffsetDateTime.now());
            relatorioRepository.save(relatorio);

            System.out.println("DEBUG: PDF gerado e salvo em: " + fullPath);

            // 3. Notificar o Worker
            NotificationEvent notification = new NotificationEvent(
                UUID.randomUUID(),
                "pesquisador@scea.edu.br", // Mock, deveria vir do evento
                "Certificado de Aprovação Disponível",
                "Olá! Seu protocolo " + event.protocolId() + " foi aprovado e o certificado já está disponível.",
                fullPath
            );

            rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE_NAME, 
                RabbitMQConfig.ROUTING_KEY_NOTIFICAR, 
                notification
            );
            System.out.println("DEBUG: Evento de notificação enviado para o Worker.");

        } catch (Exception e) {
            System.err.println("ERRO na geração do relatório: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
