package br.edu.scea.shared.events.integration;

import java.util.UUID;

public record NotificationEvent(
    UUID id,
    String recipient,
    String subject,
    String message,
    String attachmentPath
) {}
