package br.edu.scea.worker.infrastructure.messaging;

import br.edu.scea.shared.events.integration.ProtocolApprovedV1;
import br.edu.scea.shared.events.integration.ProtocolSubmittedV1;
import br.edu.scea.worker.application.PdfCertificateGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.function.Consumer;

@Configuration
public class NotificationConsumer {
    private static final Logger log = LoggerFactory.getLogger(NotificationConsumer.class);
    private final PdfCertificateGenerator pdfGenerator;

    public NotificationConsumer(PdfCertificateGenerator pdfGenerator) {
        this.pdfGenerator = pdfGenerator;
    }

    @Bean
    public Consumer<ProtocolSubmittedV1> consumeProtocolSubmitted() {
        return event -> {
            log.info("Evento recebido no Worker: Protocolo {} submetido por {}", 
                event.protocolId(), event.researcherName());
        };
    }

    @Bean
    public Consumer<ProtocolApprovedV1> consumeProtocolApproved() {
        return event -> {
            log.info("Evento recebido no Worker: Protocolo {} APROVADO. Iniciando geração de certificado...", 
                event.protocolId());
            pdfGenerator.generate(event);
        };
    }
}
