package br.edu.scea.worker.application;

import br.edu.scea.shared.events.integration.ProtocolApprovedV1;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;

@Service
public class PdfCertificateGenerator {
    private static final Logger log = LoggerFactory.getLogger(PdfCertificateGenerator.class);
    private static final String OUTPUT_DIR = "certificates";

    public void generate(ProtocolApprovedV1 event) {
        try {
            Path dirPath = Paths.get(OUTPUT_DIR);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            String filename = "Certificado_Protocolo_" + event.protocolId() + ".pdf";
            Path filePath = dirPath.resolve(filename);

            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, new FileOutputStream(filePath.toFile()));

            document.open();
            
            // Header
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("SCEA - Sistema de Controle de Experimentação Animal", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(30);
            document.add(title);

            // Subtitle
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            Paragraph subTitle = new Paragraph("CERTIFICADO DE APROVAÇÃO DE PROTOCOLO", subTitleFont);
            subTitle.setAlignment(Element.ALIGN_CENTER);
            subTitle.setSpacingAfter(40);
            document.add(subTitle);

            // Body
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            String text = String.format(
                "Certificamos que o protocolo de pesquisa intitulado \"%s\", identificado pelo ID %s, " +
                "foi devidamente revisado e APROVADO pela Comissão de Ética no Uso de Animais (CEUA).\n\n" +
                "Período de vigência autorizado: %s a %s.",
                event.justificativa(),
                event.protocolId(),
                event.dataInicio().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                event.dataTermino().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
            );
            Paragraph body = new Paragraph(text, bodyFont);
            body.setLeading(20);
            document.add(body);

            // Date
            Paragraph date = new Paragraph("\n\nEmitido em: " + event.occurredAt().toString(), bodyFont);
            date.setAlignment(Element.ALIGN_RIGHT);
            document.add(date);

            document.close();
            log.info("Certificado gerado com sucesso: {}", filePath.toAbsolutePath());

        } catch (Exception e) {
            log.error("Erro ao gerar PDF para o protocolo {}", event.protocolId(), e);
            throw new RuntimeException("Falha na geração do certificado", e);
        }
    }
}
