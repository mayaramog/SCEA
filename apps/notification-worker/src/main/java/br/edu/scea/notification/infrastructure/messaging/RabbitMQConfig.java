package br.edu.scea.notification.infrastructure.messaging;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    
    public static final String QUEUE_NAME = "notificacoes.emails";

    @Bean
    public Queue queue() {
        // MUITO IMPORTANTE: O segundo parâmetro 'true' define a fila como DURÁVEL.
        // Deve bater exatamente com a declaração feita no produtor (relatorios-api).
        return new Queue(QUEUE_NAME, true);
    }

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
