package br.edu.scea.notification.infrastructure.messaging;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    
    public static final String EXCHANGE_NAME = "protocolos.v1";
    public static final String QUEUE_NAME = "notificacoes.emails";
    public static final String QUEUE_SUBMISSAO_NAME = "notificacoes.submissao";
    public static final String QUEUE_DESIGNACAO_NAME = "notificacoes.designacoes";
    public static final String QUEUE_PARECER_NAME = "notificacoes.pareceres";
    
    public static final String ROUTING_KEY_NOTIFICAR = "notificacao.enviar";
    public static final String ROUTING_KEY_SUBMETIDO = "protocolo.submetido";
    public static final String ROUTING_KEY_DESIGNADO = "protocolo.designado";
    public static final String ROUTING_KEY_PARECER = "protocolo.parecer";

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    @Qualifier("mainQueue")
    public Queue queue() {
        return new Queue(QUEUE_NAME, true);
    }

    @Bean
    @Qualifier("submissionQueue")
    public Queue submissionQueue() {
        return new Queue(QUEUE_SUBMISSAO_NAME, true);
    }

    @Bean
    @Qualifier("designationQueue")
    public Queue designacaoQueue() {
        return new Queue(QUEUE_DESIGNACAO_NAME, true);
    }

    @Bean
    @Qualifier("reviewQueue")
    public Queue parecerQueue() {
        return new Queue(QUEUE_PARECER_NAME, true);
    }

    @Bean
    public Binding binding(@Qualifier("mainQueue") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY_NOTIFICAR);
    }

    @Bean
    public Binding bindingSubmission(@Qualifier("submissionQueue") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY_SUBMETIDO);
    }

    @Bean
    public Binding bindingDesignation(@Qualifier("designationQueue") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY_DESIGNADO);
    }

    @Bean
    public Binding bindingReview(@Qualifier("reviewQueue") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY_PARECER);
    }

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
