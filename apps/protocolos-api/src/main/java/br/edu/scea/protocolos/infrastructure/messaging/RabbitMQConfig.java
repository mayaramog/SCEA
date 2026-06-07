package br.edu.scea.protocolos.infrastructure.messaging;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "protocolos.v1";
    public static final String ROUTING_KEY_APROVADO = "protocolo.aprovado";
    public static final String ROUTING_KEY_SUBMETIDO = "protocolo.submetido";
    public static final String ROUTING_KEY_PARECER = "protocolo.parecer";
    public static final String ROUTING_KEY_DESIGNADO = "protocolo.designado";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
