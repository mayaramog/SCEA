package br.edu.scea.notification.infrastructure.messaging;

import br.edu.scea.shared.events.integration.NotificationEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationListener {

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void onNotificationRequest(NotificationEvent event) {
        System.out.println("=====================================================");
        System.out.println("SIMULAÇÃO DE ENVIO DE E-MAIL");
        System.out.println("Para: " + event.recipient());
        System.out.println("Assunto: " + event.subject());
        System.out.println("Mensagem: " + event.message());
        if (event.attachmentPath() != null) {
            System.out.println("Anexo Detectado: " + event.attachmentPath());
        }
        System.out.println("E-mail enviado com sucesso via RabbitMQ!");
        System.out.println("=====================================================");
    }
}
