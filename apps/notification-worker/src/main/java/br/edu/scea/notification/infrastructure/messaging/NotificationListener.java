package br.edu.scea.notification.infrastructure.messaging;

import br.edu.scea.shared.events.integration.NotificationEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationListener {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(NotificationListener.class);

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void onNotificationRequest(NotificationEvent event) {
        log.info("=====================================================");
        log.info("SIMULAÇÃO DE ENVIO DE E-MAIL");
        log.info("Para: " + event.recipient());
        log.info("Assunto: " + event.subject());
        log.info("Mensagem: " + event.message());
        if (event.attachmentPath() != null) {
            log.info("Anexo Detectado: " + event.attachmentPath());
        }
        log.info("E-mail enviado com sucesso via RabbitMQ!");
        log.info("=====================================================");
    }
}
