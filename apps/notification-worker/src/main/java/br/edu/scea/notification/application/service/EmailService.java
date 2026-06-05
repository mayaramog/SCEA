package br.edu.scea.notification.application.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String body, String attachmentPath) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("[SCEA] " + subject);

            // Estilização HTML para o e-mail
            StringBuilder sb = new StringBuilder();
            sb.append("<html><body style='font-family: Arial, sans-serif; color: #333;'>");
            sb.append("<div style='max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;'>");
            sb.append("<div style='background-color: #1e40af; color: white; padding: 20px; text-align: center;'>");
            sb.append("<h1 style='margin: 0;'>SCEA</h1>");
            sb.append("<p style='margin: 5px 0 0;'>Sistema de Controle de Experimentação Animal</p>");
            sb.append("</div>");
            sb.append("<div style='padding: 30px; line-height: 1.6;'>");
            sb.append("<h2 style='color: #1e40af; margin-top: 0;'>").append(subject).append("</h2>");
            sb.append("<p>").append(body.replace("\n", "<br>")).append("</p>");
            sb.append("<div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777;'>");
            sb.append("Este é um e-mail automático enviado pelo SCEA. Por favor, não responda a este e-mail.");
            sb.append("</div>");
            sb.append("</div>");
            sb.append("</div>");
            sb.append("</body></html>");

            helper.setText(sb.toString(), true);

            if (attachmentPath != null && !attachmentPath.isEmpty()) {
                File file = new File(attachmentPath);
                if (file.exists()) {
                    FileSystemResource resource = new FileSystemResource(file);
                    helper.addAttachment(file.getName(), resource);
                    System.out.println("DEBUG: Anexo adicionado: " + attachmentPath);
                } else {
                    System.err.println("WARN: Arquivo de anexo não encontrado: " + attachmentPath);
                }
            }

            mailSender.send(message);
            System.out.println("E-mail enviado com sucesso para: " + to);
        } catch (Exception e) {
            System.err.println("Falha ao enviar e-mail para " + to + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
}
