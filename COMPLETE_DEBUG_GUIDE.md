# 🔧 DEBUG COMPLETO - Connettività Frontend-Backend

## 📊 Configurazioni Attuali

### Frontend (React + Vite)
- **Porta**: http://localhost:5173
- **Base URL API**: http://localhost:8081 (da .env.local)
- **Debug Mode**: Attivo

### Backend (Spring Boot)
- **Porta**: http://localhost:8081
- **Credenziali**: employee:password
- **Status**: ✅ ATTIVO

## 🔍 Test di Connettività

### ✅ Test Completati con Successo:
1. **Endpoint pubblico**: `GET /api/public/listings` → Status 200
2. **Endpoint admin**: `POST /api/admin/listings` → Status 200 (con Basic Auth)
3. **CORS preflight**: OPTIONS request → Status 200
4. **Headers CORS**: Access-Control-Allow-Origin configurato per porta 5173

## 🚨 Problemi da Verificare

### 1. Cache del Browser
Il browser potrebbe avere **cache delle configurazioni precedenti**:

**Soluzione**:
- Apri DevTools (F12)
- Vai su Network tab
- Spunta "Disable cache"
- Ricarica con Ctrl+F5

### 2. Vite Non Ha Ricaricato le Variabili d'Ambiente
Le variabili d'ambiente potrebbero non essere state ricaricate:

**Soluzione**:
- Ferma il server Vite (Ctrl+C)
- Riavvia: `npm run dev`

### 3. Immagini e Risorse Statiche
Le immagini potrebbero provenire da domini esterni:

**Controllo**:
- Apri DevTools → Network tab
- Filtra per "Images"
- Controlla se le immagini falliscono

### 4. Mixed Content (HTTP/HTTPS)
Possibili problemi di protocollo:

**Controllo**:
- Tutte le URL devono essere HTTP (non HTTPS) in sviluppo
- Controlla console per errori "Mixed Content"

## 🎯 Debug Steps da Seguire

### Step 1: Riavvia Tutto
```bash
# Terminal 1 - Frontend
Ctrl+C  # Ferma Vite se attivo
npm run dev

# Terminal 2 - Backend  
# Assicurati che Spring Boot sia attivo su porta 8081
```

### Step 2: Test nel Browser
1. Vai su: `http://localhost:5173?demo=true`
2. Apri DevTools (F12) → Console tab
3. Apri anche Network tab
4. Prova il login admin: `employee` / `password`
5. Controlla tutti i log e richieste

### Step 3: Controlla Errori Specifici
**Console Logs Attesi**:
```
✅ Backend connesso correttamente!
🚀 API Request: GET /api/public/listings
✅ API Response: 200 /api/public/listings
```

**Network Tab - Richieste Attese**:
```
✅ GET http://localhost:8081/api/public/listings → 200
✅ OPTIONS http://localhost:8081/api/admin/listings → 200  
✅ POST http://localhost:8081/api/admin/listings → 200
```

### Step 4: Se Problemi Persistono
**Verifica CORS nel Backend**:
Il backend deve permettere Origin: `http://localhost:5173`

**Verifica in Spring Boot application.yml/properties**:
```yaml
server:
  port: 8081

# Assicurati che CORS includa:
# - http://localhost:5173 (frontend)
# - Headers: authorization, content-type
# - Methods: GET, POST, PUT, DELETE, OPTIONS
```

## 🚀 Quick Test Command

Testa manualmente dal terminale:
```powershell
# Test API pubblica
Invoke-WebRequest -Uri "http://localhost:8081/api/public/listings" -UseBasicParsing

# Test API admin
$headers = @{"Authorization" = "Basic ZW1wbG95ZWU6cGFzc3dvcmQ="; "Content-Type" = "application/json"}
$body = '{"title":"Test","address":"Via Test","price":100000,"bedrooms":1,"bathrooms":1,"published":true}'
Invoke-WebRequest -Uri "http://localhost:8081/api/admin/listings" -Method POST -Headers $headers -Body $body -UseBasicParsing
```

Entrambi dovrebbero restituire Status 200.

## 📋 Checklist Finale

- [ ] Vite riavviato con nuove variabili d'ambiente
- [ ] Cache browser disabilitata
- [ ] Backend attivo su porta 8081
- [ ] Frontend su porta 5173
- [ ] CORS configurato per porta 5173
- [ ] Credenziali `employee:password` utilizzate
- [ ] Network tab mostra richieste a localhost:8081
- [ ] Console senza errori CORS o 404/401

**Se tutti i punti sono ✅, l'applicazione dovrebbe funzionare perfettamente!**