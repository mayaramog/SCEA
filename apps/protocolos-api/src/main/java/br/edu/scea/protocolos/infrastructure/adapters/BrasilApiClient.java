package br.edu.scea.protocolos.infrastructure.adapters;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class BrasilApiClient {
    private final RestClient restClient;

    public BrasilApiClient() {
        this.restClient = RestClient.create("https://brasilapi.com.br/api/feriados/v1/");
    }

    @Cacheable("feriados")
    public Set<LocalDate> buscarFeriadosPorAno(int ano) {
        try {
            FeriadoResponse[] response = restClient.get()
                .uri(String.valueOf(ano))
                .retrieve()
                .body(FeriadoResponse[].class);

            if (response == null) {
                return Collections.emptySet();
            }

            return Arrays.stream(response)
                .map(FeriadoResponse::toLocalDate)
                .collect(Collectors.toSet());
        } catch (Exception e) {
            // Em caso de erro na API externa, logamos e retornamos set vazio para não travar o sistema, 
            // ou poderíamos lançar uma exception dependendo da criticidade.
            return Collections.emptySet();
        }
    }
}
