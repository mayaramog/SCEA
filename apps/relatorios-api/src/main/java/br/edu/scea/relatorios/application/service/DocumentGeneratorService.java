package br.edu.scea.relatorios.application.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.File;
import java.io.FileOutputStream;
import java.util.UUID;

@Service
public class DocumentGeneratorService {

    @Value("${scea.storage.path}")
    private String storagePath;

    private BaseFont baseFont;
    private BaseFont baseFontBold;

    public DocumentGeneratorService() throws Exception {
        this.baseFont = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
        this.baseFontBold = BaseFont.createFont(BaseFont.HELVETICA_BOLD, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
    }

    public String generateSubmissionForm(UUID protocolId, String codigo, String titulo, String pesquisador, String objetivo, String resumo, String justificativa, String data) throws Exception {
        String fileName = "submissao_" + protocolId + ".pdf";
        String fullPath = new File(storagePath, fileName).getAbsolutePath();
        
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, new FileOutputStream(fullPath));
        document.open();

        addHeader(document, "FORMULÁRIO DE SUBMISSÃO DE PROTOCOLO");

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{0.3f, 0.7f});

        addTableRow(table, "Código:", codigo);
        addTableRow(table, "Título:", titulo);
        addTableRow(table, "Pesquisador:", pesquisador);
        addTableRow(table, "Data Submissão:", data);
        document.add(table);

        document.add(new Paragraph("\nObjetivo:", getBoldFont()));
        document.add(new Paragraph(objetivo, getNormalFont()));

        document.add(new Paragraph("\nResumo:", getBoldFont()));
        document.add(new Paragraph(resumo, getNormalFont()));

        document.add(new Paragraph("\nJustificativa do Uso de Animais:", getBoldFont()));
        document.add(new Paragraph(justificativa, getNormalFont()));

        addFooter(document, data);
        document.close();
        return fullPath;
    }

    public String generateTechnicalReview(UUID protocolId, String codigo, String titulo, String parecerista, String recomendacao, String resumo, String etica, String data) throws Exception {
        String fileName = "parecer_tecnico_" + protocolId + ".pdf";
        String fullPath = new File(storagePath, fileName).getAbsolutePath();
        
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, new FileOutputStream(fullPath));
        document.open();

        addHeader(document, "PARECER TÉCNICO E ÉTICO");

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        addTableRow(table, "Protocolo:", codigo + " - " + titulo);
        addTableRow(table, "Parecerista:", parecerista);
        addTableRow(table, "Data Parecer:", data);
        
        String recText = recomendacao.equalsIgnoreCase("uso_recomendado") ? "RECOMENDADO" : "NÃO RECOMENDADO";
        addTableRow(table, "RECOMENDAÇÃO:", recText);
        document.add(table);

        document.add(new Paragraph("\nResumo Crítico da Metodologia:", getBoldFont()));
        document.add(new Paragraph(resumo, getNormalFont()));

        document.add(new Paragraph("\nConsiderações sobre o Bem-estar Animal:", getBoldFont()));
        document.add(new Paragraph(etica, getNormalFont()));

        document.add(new Paragraph("\nConclusão do Relator:", getBoldFont()));
        document.add(new Paragraph("O projeto atende aos princípios éticos de substituição, redução e refinamento (3Rs)? Sim.", getNormalFont()));

        addFooter(document, data);
        document.close();
        return fullPath;
    }

    public String generateMeetingMinutes(UUID reuniaoId, String codigo, String data, String local, java.util.List<br.edu.scea.shared.events.integration.MeetingFinishedV1.MeetingDecisionDTO> decisoes) throws Exception {
        String fileName = "ata_reuniao_" + reuniaoId + ".pdf";
        String fullPath = new File(storagePath, fileName).getAbsolutePath();
        
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, new FileOutputStream(fullPath));
        document.open();

        addHeader(document, "ATA DE REUNIÃO ORDINÁRIA - CEUA");

        Paragraph info = new Paragraph("Aos " + data + ", reuniu-se a Comissão de Ética no Uso de Animais no local " + local + " para deliberação dos seguintes protocolos:", getNormalFont());
        info.setSpacingAfter(15f);
        document.add(info);

        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{0.2f, 0.5f, 0.3f});
        
        addTableRow(table, "Protocolo", "Título do Projeto", "Decisão");
        for (var d : decisoes) {
            table.addCell(new Phrase(d.protocoloId().toString().substring(0,8), getNormalFont()));
            table.addCell(new Phrase(d.titulo(), getNormalFont()));
            table.addCell(new Phrase(d.decisao(), getBoldFont()));
        }
        document.add(table);

        document.add(new Paragraph("\nNada mais havendo a tratar, a reunião foi encerrada.", getNormalFont()));

        addFooter(document, data);
        document.close();
        return fullPath;
    }

    private void addHeader(Document doc, String title) throws DocumentException {
        Paragraph p = new Paragraph("SCEA - SISTEMA DE CONTROLE DE EXPERIMENTAÇÃO ANIMAL", new Font(baseFontBold, 12, Font.NORMAL, new Color(30, 64, 175)));
        p.setAlignment(Element.ALIGN_CENTER);
        doc.add(p);
        
        p = new Paragraph(title, new Font(baseFontBold, 16, Font.NORMAL, Color.DARK_GRAY));
        p.setAlignment(Element.ALIGN_CENTER);
        p.setSpacingAfter(20f);
        doc.add(p);
    }

    private void addFooter(Document doc, String date) throws DocumentException {
        Paragraph p = new Paragraph("\n\nDocumento gerado eletronicamente em " + date, new Font(baseFont, 8, Font.ITALIC, Color.LIGHT_GRAY));
        p.setAlignment(Element.ALIGN_CENTER);
        doc.add(p);
    }

    private void addTableRow(PdfPTable table, String label, String value) {
        PdfPCell c1 = new PdfPCell(new Phrase(label, getBoldFont()));
        c1.setBackgroundColor(new Color(245, 245, 245));
        c1.setPadding(5);
        table.addCell(c1);

        PdfPCell c2 = new PdfPCell(new Phrase(value, getNormalFont()));
        c2.setPadding(5);
        table.addCell(c2);
    }

    private void addTableRow(PdfPTable table, String label, String value, String value2 ) throws DocumentException {
        PdfPCell c1 = new PdfPCell(new Phrase(label, getBoldFont()));
        c1.setBackgroundColor(new Color(245, 245, 245));
        c1.setPadding(5);
        table.addCell(c1);

        PdfPCell c2 = new PdfPCell(new Phrase(value, getNormalFont()));
        c2.setPadding(5);
        table.addCell(c2);

        PdfPCell c3 = new PdfPCell(new Phrase(value2, getNormalFont()));
        c3.setPadding(5);
        table.addCell(c3);
    }

    private Font getNormalFont() { return new Font(baseFont, 10); }
    private Font getBoldFont() { return new Font(baseFontBold, 10); }
}
