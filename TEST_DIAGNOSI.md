# Test Backend NovaRE

## Test Rapido Upload

### 1. Controlla se il backend è attivo:
```
curl http://localhost:8081/api/health
```

### 2. Lista immobili pubblici:
```
curl http://localhost:8081/api/public/listings
```

### 3. Dopo upload foto, controlla response:
- Dovrebbe contenere: `photoUrls: ["/uploads/xxxxx.jpg"]`
- Poi testa: `curl -I http://localhost:8081/uploads/xxxxx.jpg`

### 4. Controlla cartella uploads:
```
dir uploads
```

## Problema Identificato: ❌ CARTELLA UPLOADS NON ESISTE

**Causa:** Il backend non sta creando/scrivendo i file nella cartella uploads.

**Soluzioni possibili:**
1. Problema di permessi scrittura
2. Path configurato male nel backend  
3. Controller upload non funziona
4. Cartella base del progetto backend diversa

## Next Steps:
1. Controlla log del backend durante upload
2. Verifica configurazione path uploads nel backend
3. Crea manualmente cartella uploads se necessario