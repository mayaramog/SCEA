package br.edu.scea.relatorios.application.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Rectangle;
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
public class ReportGeneratorService {

    @Value("${scea.storage.path}")
    private String storagePath;

    public String generateCertificate(UUID protocolId, String justificativa, String dataInicio, String dataTermino, String occurredAt) throws Exception {
        // Ensure directory exists
        File directory = new File(storagePath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileName = "certificado_" + protocolId + ".pdf";
        String fullPath = new File(storagePath, fileName).getAbsolutePath();

        Document document = new Document(PageSize.A4, 50, 50, 50, 50);
        PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(fullPath));
        document.open();

        // Base Font with Encoding for Portuguese
        BaseFont baseFont = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
        BaseFont baseFontBold = BaseFont.createFont(BaseFont.HELVETICA_BOLD, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);

        // Borda Azul no Certificado
        PdfPTable borderTable = new PdfPTable(1);
        borderTable.setWidthPercentage(100);
        PdfPCell borderCell = new PdfPCell();
        borderCell.setBorder(Rectangle.BOX);
        borderCell.setBorderWidth(2f);
        borderCell.setBorderColor(new Color(30, 64, 175)); // Azul escuro
        borderCell.setPadding(20);
        
        // Styles
        Font titleFont = new Font(baseFontBold, 20, Font.NORMAL, new Color(30, 64, 175));
        Font subTitleFont = new Font(baseFont, 14, Font.NORMAL, Color.GRAY);
        Font normalFont = new Font(baseFont, 12, Font.NORMAL, Color.BLACK);
        Font boldFont = new Font(baseFontBold, 12, Font.NORMAL, Color.BLACK);
        Font footerFont = new Font(baseFont, 10, Font.ITALIC, Color.LIGHT_GRAY);

        // Header
        Paragraph headerName = new Paragraph("SCEA", new Font(baseFontBold, 28, Font.NORMAL, new Color(30, 64, 175)));
        headerName.setAlignment(Element.ALIGN_CENTER);
        borderCell.addElement(headerName);
        
        Paragraph headerSub = new Paragraph("Sistema de Controle de Experimentação Animal", subTitleFont);
        headerSub.setAlignment(Element.ALIGN_CENTER);
        borderCell.addElement(headerSub);
        
        borderCell.addElement(new Paragraph(" "));
        borderCell.addElement(new Paragraph(" "));

        // Content
        Paragraph title = new Paragraph("CERTIFICADO DE APROVAÇÃO", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        borderCell.addElement(title);
        borderCell.addElement(new Paragraph(" "));

        Paragraph intro = new Paragraph("Certificamos que o protocolo de pesquisa abaixo descrito foi analisado e aprovado pela Comissão de Ética no Uso de Animais (CEUA), atendendo aos requisitos éticos e legais vigentes.", normalFont);
        intro.setAlignment(Element.ALIGN_JUSTIFIED);
        borderCell.addElement(intro);
        borderCell.addElement(new Paragraph(" "));

        // Protocol Info Table
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);
        table.setSpacingAfter(10f);

        addTableRow(table, "ID do Protocolo:", protocolId.toString(), boldFont, normalFont);
        addTableRow(table, "Justificativa:", justificativa, boldFont, normalFont);
        addTableRow(table, "Data de Início:", dataInicio, boldFont, normalFont);
        addTableRow(table, "Data de Término:", dataTermino, boldFont, normalFont);
        addTableRow(table, "Data de Aprovação:", occurredAt, boldFont, normalFont);

        borderCell.addElement(table);
        borderCell.addElement(new Paragraph(" "));
        
        Paragraph closure = new Paragraph("Este documento é válido como comprovação oficial de aprovação do projeto para fins de execução e publicação.", normalFont);
        borderCell.addElement(closure);

        // Footer / Signature
        borderCell.addElement(new Paragraph(" "));
        borderCell.addElement(new Paragraph(" "));
        
        Paragraph signatureLine = new Paragraph("___________________________________________", normalFont);
        signatureLine.setAlignment(Element.ALIGN_CENTER);
        borderCell.addElement(signatureLine);
        
        Paragraph signatureLabel = new Paragraph("Presidente da CEUA / SCEA", boldFont);
        signatureLabel.setAlignment(Element.ALIGN_CENTER);
        borderCell.addElement(signatureLabel);
        
        borderTable.addCell(borderCell);
        document.add(borderTable);

        // Watermark/Footer
        HeaderFooter footer = new HeaderFooter(new Phrase("Documento gerado eletronicamente pelo SCEA em " + occurredAt, footerFont), false);
        footer.setBorder(Rectangle.TOP);
        footer.setAlignment(Element.ALIGN_CENTER);
        document.setFooter(footer);

        document.close();
        return fullPath;
    }

    private void addTableRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell cellLabel = new PdfPCell(new Phrase(label, labelFont));
        cellLabel.setBackgroundColor(new Color(240, 240, 240));
        cellLabel.setPadding(8);
        table.addCell(cellLabel);

        PdfPCell cellValue = new PdfPCell(new Phrase(value, valueFont));
        cellValue.setPadding(8);
        table.addCell(cellValue);
    }
}
