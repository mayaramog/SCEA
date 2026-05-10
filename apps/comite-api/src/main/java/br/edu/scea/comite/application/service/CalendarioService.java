package br.edu.scea.comite.application.service;

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
import java.time.OffsetDateTime;
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

    public void validarDiaUtil(OffsetDateTime dataHora, String label) {
        LocalDate data = dataHora.toLocalDate();
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

        return (m == 1 && d == 1)
            || (m == 4 && d == 21)
            || (m == 5 && d == 1)
            || (m == 9 && d == 7)
            || (m == 10 && d == 12)
            || (m == 11 && d == 2)
            || (m == 11 && d == 15)
            || (m == 11 && d == 20)
            || (m == 12 && d == 25);
    }

    private Set<LocalDate> buscarFeriadosNaApi(int ano) {
        try {
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
                return datas;
            }
        } catch (Exception e) {
            System.err.println("ERRO ao buscar feriados no Comitê: " + e.getMessage());
        }
        return Collections.emptySet();
    }
}
