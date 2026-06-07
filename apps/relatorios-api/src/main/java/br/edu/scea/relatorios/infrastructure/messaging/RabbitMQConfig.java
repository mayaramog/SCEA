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
    public static final String QUEUE_SUBMISSAO_NAME = "relatorios.submissao";
    public static final String QUEUE_PARECER_NAME = "relatorios.parecer";
    public static final String QUEUE_REUNIAO_NAME = "relatorios.reunioes";
    
    public static final String ROUTING_KEY_APROVADO = "protocolo.aprovado";
    public static final String ROUTING_KEY_SUBMETIDO = "protocolo.submetido";
    public static final String ROUTING_KEY_PARECER = "protocolo.parecer";
    public static final String ROUTING_KEY_NOTIFICAR = "notificacao.enviar";
    public static final String ROUTING_KEY_REUNIAO_FIM = "protocolo.reuniao_finalizada";

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
    @Qualifier("queueSubmissao")
    public Queue queueSubmissao() {
        return new Queue(QUEUE_SUBMISSAO_NAME, true);
    }

    @Bean
    @Qualifier("queueParecer")
    public Queue queueParecer() {
        return new Queue(QUEUE_PARECER_NAME, true);
    }

    @Bean
    @Qualifier("queueReuniao")
    public Queue queueReuniao() {
        return new Queue(QUEUE_REUNIAO_NAME, true);
    }

    @Bean
    @Qualifier("queueNotificacao")
    public Queue queueNotificacao() {
        return new Queue(QUEUE_NOTIFICACAO_NAME, true);
    }

    @Bean
    public Binding bindingGeracao(@Qualifier("queueGeracao") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY_APROVADO);
    }

    @Bean
    public Binding bindingSubmissao(@Qualifier("queueSubmissao") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY_SUBMETIDO);
    }

    @Bean
    public Binding bindingParecer(@Qualifier("queueParecer") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY_PARECER);
    }

    @Bean
    public Binding bindingReuniao(@Qualifier("queueReuniao") Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY_REUNIAO_FIM);
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
