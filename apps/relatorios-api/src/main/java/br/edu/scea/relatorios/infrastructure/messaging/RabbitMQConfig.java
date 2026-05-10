package br.edu.scea.relatorios.infrastructure.messaging;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "protocolos.v1";
    public static final String QUEUE_GERACAO_NAME = "relatorios.geracao";
    public static final String QUEUE_NOTIFICACAO_NAME = "notificacoes.emails";
    
    public static final String ROUTING_KEY_APROVADO = "protocolo.aprovado";
    public static final String ROUTING_KEY_NOTIFICAR = "notificacao.enviar";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    @Qualifier("queueGeracao")
    public Queue queueGeracao() {
        return new Queue(QUEUE_GERACAO_NAME, true);
    }

    @Bean
    @Qualifier("queueNotificacao")
    public Queue queueNotificacao() {
        return new Queue(QUEUE_NOTIFICACAO_NAME, true);
    }

    @Bean
    public Binding bindingGeracao(@Qualifier("queueGeracao") Queue queueGeracao, TopicExchange exchange) {
        return BindingBuilder.bind(queueGeracao).to(exchange).with(ROUTING_KEY_APROVADO);
    }

    @Bean
    public Binding bindingNotificacao(@Qualifier("queueNotificacao") Queue queueNotificacao, TopicExchange exchange) {
        return BindingBuilder.bind(queueNotificacao).to(exchange).with(ROUTING_KEY_NOTIFICAR);
    }

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
