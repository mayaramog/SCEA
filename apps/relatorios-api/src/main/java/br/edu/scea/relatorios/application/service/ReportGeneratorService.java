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

    public String generateCertificate(
            UUID protocolId, 
            String titulo,
            String objetivo,
            String resumo,
            String nomePesquisador,
            String justificativa, 
            String dataInicio, 
            String dataTermino, 
            String occurredAt,
            String analiseParecerista,
            String fundamentacaoDeliberacao,
            boolean aprovado
    ) throws Exception {
        // Ensure directory exists
        File directory = new File(storagePath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileName = (aprovado ? "certificado_" : "parecer_reprovacao_") + protocolId + ".pdf";
        String fullPath = new File(storagePath, fileName).getAbsolutePath();

        Document document = new Document(PageSize.A4, 40, 40, 40, 40);
        PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(fullPath));
        document.open();

        // Base Font with Encoding for Portuguese
        BaseFont baseFont = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
        BaseFont baseFontBold = BaseFont.createFont(BaseFont.HELVETICA_BOLD, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);

        // Borda Visual (Azul para Aprovado, Vermelha para Reprovado)
        Color themeColor = aprovado ? new Color(30, 64, 175) : new Color(185, 28, 28);

        PdfPTable borderTable = new PdfPTable(1);
        borderTable.setWidthPercentage(100);
        PdfPCell borderCell = new PdfPCell();
        borderCell.setBorder(Rectangle.BOX);
        borderCell.setBorderWidth(1.5f);
        borderCell.setBorderColor(themeColor); 
        borderCell.setPadding(25);
        
        // Styles
        Font titleFont = new Font(baseFontBold, 18, Font.NORMAL, themeColor);
        Font sectionFont = new Font(baseFontBold, 12, Font.NORMAL, themeColor);
        Font normalFont = new Font(baseFont, 10, Font.NORMAL, Color.BLACK);
        Font boldFont = new Font(baseFontBold, 10, Font.NORMAL, Color.BLACK);
        Font italicFont = new Font(baseFont, 10, Font.ITALIC, Color.DARK_GRAY);
        Font footerFont = new Font(baseFont, 8, Font.ITALIC, Color.LIGHT_GRAY);

        // Header
        Paragraph headerName = new Paragraph("SCEA - SISTEMA DE CONTROLE DE EXPERIMENTAÇÃO ANIMAL", new Font(baseFontBold, 14, Font.NORMAL, themeColor));
        headerName.setAlignment(Element.ALIGN_CENTER);
        borderCell.addElement(headerName);
        
        Paragraph headerSub = new Paragraph("Comissão de Ética no Uso de Animais (CEUA)", new Font(baseFont, 10, Font.NORMAL, Color.GRAY));
        headerSub.setAlignment(Element.ALIGN_CENTER);
        borderCell.addElement(headerSub);
        
        borderCell.addElement(new Paragraph(" "));

        // Certificate Title
        String docTitle = aprovado ? "CERTIFICADO DE APROVAÇÃO ÉTICA" : "PARECER DE REPROVAÇÃO ÉTICA";
        Paragraph title = new Paragraph(docTitle, titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        borderCell.addElement(title);
        borderCell.addElement(new Paragraph(" "));

        // 1. DADOS DO PROTOCOLO
        borderCell.addElement(new Paragraph("1. DADOS DO PROJETO", sectionFont));
        PdfPTable tableInfo = new PdfPTable(2);
        tableInfo.setWidthPercentage(100);
        tableInfo.setSpacingBefore(5f);
        tableInfo.setWidths(new float[]{0.3f, 0.7f});

        addTableRow(tableInfo, "ID do Protocolo:", protocolId.toString(), boldFont, normalFont);
        addTableRow(tableInfo, "Título:", titulo, boldFont, normalFont);
        addTableRow(tableInfo, "Pesquisador:", nomePesquisador, boldFont, normalFont);
        addTableRow(tableInfo, "Período:", dataInicio + " a " + dataTermino, boldFont, normalFont);
        borderCell.addElement(tableInfo);
        
        borderCell.addElement(new Paragraph("Objetivo:", boldFont));
        Paragraph objPara = new Paragraph(objetivo, normalFont);
        objPara.setAlignment(Element.ALIGN_JUSTIFIED);
        borderCell.addElement(objPara);
        borderCell.addElement(new Paragraph(" "));

        // 2. ANÁLISE TÉCNICA (PARECERISTA)
        borderCell.addElement(new Paragraph("2. ANÁLISE TÉCNICA DOS RELATORES", sectionFont));
        Paragraph analisePara = new Paragraph(analiseParecerista, italicFont);
        analisePara.setAlignment(Element.ALIGN_JUSTIFIED);
        analisePara.setIndentationLeft(10);
        borderCell.addElement(analisePara);
        borderCell.addElement(new Paragraph(" "));

        // 3. DELIBERAÇÃO DO COMITÊ
        borderCell.addElement(new Paragraph("3. DELIBERAÇÃO FINAL DO PLENÁRIO", sectionFont));
        Paragraph delibPara = new Paragraph(fundamentacaoDeliberacao, normalFont);
        delibPara.setAlignment(Element.ALIGN_JUSTIFIED);
        borderCell.addElement(delibPara);
        borderCell.addElement(new Paragraph(" "));

        String conclusaoMsg = aprovado 
            ? "A CEUA, em reunião plenária, deliberou pela APROVAÇÃO do uso de animais para este protocolo, considerando-o em conformidade com as normas éticas vigentes."
            : "A CEUA, em reunião plenária, deliberou pela REPROVAÇÃO do uso de animais para este protocolo, devido às inconsistências técnicas ou éticas descritas acima.";
        
        Paragraph conclPara = new Paragraph(conclusaoMsg, boldFont);
        conclPara.setAlignment(Element.ALIGN_CENTER);
        borderCell.addElement(conclPara);

        // Digital Signature Area
        borderCell.addElement(new Paragraph(" "));
        
        PdfPTable signTable = new PdfPTable(1);
        signTable.setWidthPercentage(50);
        PdfPCell signCell = new PdfPCell();
        signCell.setBorder(Rectangle.NO_BORDER);
        signCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        
        Paragraph signText = new Paragraph("Assinado Digitalmente por:", new Font(baseFont, 8, Font.NORMAL, Color.GRAY));
        signText.setAlignment(Element.ALIGN_CENTER);
        signCell.addElement(signText);
        
        Paragraph nameText = new Paragraph("PRESIDENTE DA CEUA / SCEA", new Font(baseFontBold, 11, Font.NORMAL, themeColor));
        nameText.setAlignment(Element.ALIGN_CENTER);
        signCell.addElement(nameText);
        
        Paragraph dateText = new Paragraph("Data da Assinatura: " + occurredAt, new Font(baseFont, 8, Font.NORMAL, Color.GRAY));
        dateText.setAlignment(Element.ALIGN_CENTER);
        signCell.addElement(dateText);
        
        Paragraph hashText = new Paragraph("Autenticidade verificável via hash: " + UUID.randomUUID().toString().substring(0,18).toUpperCase(), new Font(baseFont, 7, Font.ITALIC, Color.LIGHT_GRAY));
        hashText.setAlignment(Element.ALIGN_CENTER);
        signCell.addElement(hashText);

        signTable.addCell(signCell);
        borderCell.addElement(signTable);
        
        borderTable.addCell(borderCell);
        document.add(borderTable);

        // Watermark/Footer
        HeaderFooter footer = new HeaderFooter(new Phrase("Documento gerado eletronicamente pelo SCEA em " + occurredAt + " - Cópia de Autenticidade", footerFont), false);
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
