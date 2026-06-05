package br.edu.scea.notification.infrastructure.messaging;

import br.edu.scea.notification.application.service.EmailService;
import br.edu.scea.shared.events.integration.NotificationEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationListener {

    private final EmailService emailService;

    public NotificationListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void onNotificationRequest(NotificationEvent event) {
        System.out.println("DEBUG: Processando pedido de notificação para: " + event.recipient());
        
        emailService.sendEmail(
            event.recipient(),
            event.subject(),
            event.message(),
            event.attachmentPath()
        );
    }
}
