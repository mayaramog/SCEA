package br.edu.scea.protocolos.application.service;

import br.edu.scea.shared.dto.util.FeriadoDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CalendarioService {

    private final Map<Integer, Set<LocalDate>> cacheFeriados = new ConcurrentHashMap<>();
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public CalendarioService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public void validarDiaUtil(LocalDate data, String label) {
        if (isFinalDeSemana(data)) {
            throw new IllegalArgumentException(label + " não pode ser em um final de semana: " + data);
        }
        if (isFeriado(data)) {
            throw new IllegalArgumentException(label + " não pode ser em um feriado nacional: " + data);
        }
    }

    private boolean isFinalDeSemana(LocalDate data) {
        DayOfWeek dia = data.getDayOfWeek();
        return dia == DayOfWeek.SATURDAY || dia == DayOfWeek.SUNDAY;
    }

    private boolean isFeriado(LocalDate data) {
        // Fallback para feriados fixos nacionais
        if (isFeriadoFixo(data)) {
            return true;
        }

        int ano = data.getYear();
        Set<LocalDate> feriados = cacheFeriados.computeIfAbsent(ano, this::buscarFeriadosNaApi);
        return feriados.contains(data);
    }

    private boolean isFeriadoFixo(LocalDate data) {
        int m = data.getMonthValue();
        int d = data.getDayOfMonth();

        return (m == 1 && d == 1)   // Ano Novo
            || (m == 4 && d == 21)  // Tiradentes
            || (m == 5 && d == 1)   // Trabalho
            || (m == 9 && d == 7)   // Independência
            || (m == 10 && d == 12) // Aparecida
            || (m == 11 && d == 2)  // Finados
            || (m == 11 && d == 15) // República
            || (m == 11 && d == 20) // Consciência Negra
            || (m == 12 && d == 25);// Natal
    }

    private Set<LocalDate> buscarFeriadosNaApi(int ano) {
        try {
            System.out.println("DEBUG: Chamando Brasil API para feriados de " + ano);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://brasilapi.com.br/api/feriados/v1/" + ano))
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                List<FeriadoDTO> lista = objectMapper.readValue(response.body(), new TypeReference<>() {});
                Set<LocalDate> datas = new HashSet<>();
                for (FeriadoDTO f : lista) {
                    datas.add(f.date());
                }
                System.out.println("DEBUG: Sucesso! " + datas.size() + " feriados carregados para " + ano);
                return datas;
            } else {
                System.err.println("AVISO: Brasil API retornou status " + response.statusCode());
            }
        } catch (Exception e) {
            System.err.println("ERRO ao buscar feriados na API: " + e.getMessage());
        }
        return Collections.emptySet();
    }
}
