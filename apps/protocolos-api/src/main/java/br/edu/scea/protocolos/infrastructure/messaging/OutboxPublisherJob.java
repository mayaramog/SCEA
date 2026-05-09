package br.edu.scea.protocolos.infrastructure.messaging;

import br.edu.scea.protocolos.infrastructure.persistence.OutboxMessageJpaEntity;
import br.edu.scea.protocolos.infrastructure.persistence.OutboxSpringDataRepository;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Component
public class OutboxPublisherJob {
    private final OutboxSpringDataRepository repository;
    private final StreamBridge streamBridge;

    public OutboxPublisherJob(OutboxSpringDataRepository repository, StreamBridge streamBridge) {
        this.repository = repository;
        this.streamBridge = streamBridge;
    }

    @Scheduled(fixedDelay = 5000)
    @Transactional
    public void publish() {
        List<OutboxMessageJpaEntity> messages = repository.findByStatus("PENDING");
        for (OutboxMessageJpaEntity message : messages) {
            boolean sent = streamBridge.send("protocolos-out-0", message.getPayload());
            if (sent) {
                message.setStatus("PROCESSED");
                repository.save(message);
            }
        }
    }
}
