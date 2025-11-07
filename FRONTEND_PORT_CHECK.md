# Configurazione Porta Frontend

Il backend è configurato per accettare richieste da:
- http://localhost:5173 (porta default Vite)

## Verifica Porta Corrente

Controlla su quale porta sta girando il frontend:
```bash
npm run dev
```

Output atteso:
```
➜  Local:   http://localhost:5173/
```

## Se Gira su Porta Diversa

### Opzione 1: Forza Vite su porta 5173
```bash
# Modifica package.json
"scripts": {
  "dev": "vite --port 5173"
}
```

### Opzione 2: Aggiorna CORS nel Backend
Se il frontend gira su 5174, aggiungi nel backend (CorsConfigurationSource):
```java
configuration.setAllowedOriginPatterns(Arrays.asList(
    "http://localhost:5173",
    "http://localhost:5174"  // <- Aggiungi questa riga
));
```

## Verifica CORS

Apri la console del browser (F12) e controlla:
- ✅ Nessun errore CORS = tutto ok
- ❌ "blocked by CORS policy" = aggiornare backend