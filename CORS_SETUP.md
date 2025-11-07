# Configurazione CORS per Nova RE Backend

## Istruzioni per abilitare CORS nel backend Spring Boot

Per permettere al frontend React (http://localhost:5174) di comunicare con il backend Spring Boot (http://localhost:8080), è necessario configurare CORS.

### 1. Modifica SecurityConfig.java

Aggiungi questa configurazione alla classe `SecurityConfig.java`:

```java
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Origini permesse (frontend React)
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:5173",  // Vite default port
            "http://localhost:5174",  // Vite alternate port
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174"
        ));
        
        // Metodi HTTP permessi
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"
        ));
        
        // Headers permessi
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Permetti credenziali (per Basic Auth)
        configuration.setAllowCredentials(true);
        
        // Configura per tutti i path
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Abilita CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Disabilita CSRF per API REST
            .csrf(csrf -> csrf.disable())
            
            // Configurazione autorizzazioni
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").authenticated()
                .anyRequest().authenticated()
            )
            
            // Configurazione Basic Auth
            .httpBasic(Customizer.withDefaults());
            
        return http.build();
    }
}
```

### 2. Alternative più Semplici

#### Opzione A: Annotazione @CrossOrigin sui Controller

```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, 
             allowCredentials = "true")
public class ListingController {
    // ... metodi del controller
}
```

#### Opzione B: Configurazione Globale con WebMvcConfigurer

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("http://localhost:5173", "http://localhost:5174")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 3. Endpoint API Richiesti

Il frontend si aspetta questi endpoint:

#### API Pubbliche (senza autenticazione)
- `GET /api/public/listings` - Lista immobili pubblici
- `GET /api/public/listings/{id}` - Dettaglio immobile pubblico

#### API Admin (con Basic Auth)
- `GET /api/admin/listings` - Lista completa immobili (admin)
- `POST /api/admin/listings` - Crea nuovo immobile
- `PUT /api/admin/listings/{id}` - Aggiorna immobile
- `DELETE /api/admin/listings/{id}` - Elimina immobile

### 4. Struttura JSON Listing

```json
{
  "id": 1,
  "title": "Appartamento in centro",
  "description": "Bellissimo appartamento...",
  "address": "Via Roma 123, Roma",
  "bedrooms": 3,
  "bathrooms": 2,
  "price": 250000.00,
  "size": 85.5,
  "type": "VENDITA",
  "imageUrl": "https://esempio.com/image.jpg",
  "createdAt": "2025-01-07T10:00:00Z",
  "updatedAt": "2025-01-07T10:00:00Z"
}
```

### 5. Test della Configurazione

Dopo aver applicato la configurazione CORS:

1. Avvia il backend Spring Boot: `./mvnw spring-boot:run`
2. Avvia il frontend React: `npm run dev`
3. Visita `http://localhost:5174?demo=true` per testare l'integrazione
4. Controlla la console del browser per eventuali errori CORS

### 6. Troubleshooting CORS

Se riscontri ancora errori CORS:

1. Verifica che il backend sia in esecuzione su `http://localhost:8080`
2. Controlla che la configurazione CORS includa la porta corretta del frontend
3. Assicurati che `allowCredentials = true` sia impostato se usi Basic Auth
4. Controlla i log del backend per errori di configurazione

### 7. Produzione

Per la produzione, sostituisci le origini localhost con i domini effettivi:

```java
configuration.setAllowedOriginPatterns(Arrays.asList(
    "https://novareimmobiliare.it",
    "https://www.novareimmobiliare.it"
));
```