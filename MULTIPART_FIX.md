# 🛠️ Test Fix Multipart - NovaRE

## ❌ Problema Risolto

**Errore**: Backend restituiva 500 con "Content-Type 'application/json' is not supported"
**Causa**: axios configurato con Content-Type globale che sovrascriveva multipart/form-data
**Soluzione**: Rimosso Content-Type globale e aggiunto logic per gestirlo automaticamente

## ✅ Correzioni Applicate

### 1. **axios.js**: Rimosso Content-Type globale
```javascript
// PRIMA (❌ causava problemi)
const apiClient = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',  // ❌ Questo forzava JSON sempre
  }
});

// DOPO (✅ corretto)
const apiClient = axios.create({
  baseURL: 'http://localhost:8081',
  // Content-Type impostato dinamicamente nell'interceptor
});
```

### 2. **Interceptor Intelligente**: Gestisce automaticamente Content-Type
```javascript
apiClient.interceptors.request.use((config) => {
  // Imposta Content-Type solo se non è FormData
  if (!(config.data instanceof FormData) && !config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  // Per FormData, axios gestisce automaticamente multipart/form-data
});
```

### 3. **listingService.js**: Header puliti per multipart
```javascript
// Upload foto (POST /api/admin/listings/{id}/photos)
headers: {
  'Authorization': `Basic ${btoa('username:password')}`
  // NON Content-Type - axios gestisce multipart automaticamente
}

// Update con multipart (PUT /api/admin/listings/{id})
headers: {
  'Authorization': `Basic ${btoa('username:password')}`
  // NON Content-Type - axios gestisce multipart automaticamente
}
```

## 🧪 Test di Verifica

### Test 1: Upload Foto (Metodo Separato)
```javascript
// Nel browser console o component
import { listingService } from './src/services/listingService.js';

// Simula file upload
const testFiles = [/* File objects */];
const result = await listingService.uploadPhotos(1, testFiles);
console.log('Upload result:', result);
```

### Test 2: Curl Command (Windows CMD)
```cmd
# Test upload foto separato
curl -v -u admin:ddd -F "photos=@C:\path\to\photo1.jpg" -F "photos=@C:\path\to\photo2.jpg" http://localhost:8081/api/admin/listings/1/photos

# Test PUT multipart completo
curl -v -u admin:ddd -X PUT -F "listing={\"title\":\"Test\",\"address\":\"Via Test\",\"price\":100000};type=application/json" -F "photos=@C:\path\to\photo.jpg" http://localhost:8081/api/admin/listings/1
```

### Test 3: Browser Network Tab
1. Apri Developer Tools → Network
2. Prova upload foto dall'interfaccia admin
3. Verifica che la richiesta abbia:
   - **Content-Type**: `multipart/form-data; boundary=----...`
   - **Authorization**: `Basic YWRtaW46ZGRk`
   - **Body**: FormData con campo `photos`

## 📋 Checklist Verifiche

- ✅ **axios.js**: Rimosso Content-Type globale
- ✅ **Interceptor**: Gestisce dinamicamente Content-Type
- ✅ **uploadPhotos()**: Header puliti per multipart
- ✅ **updateListingWithMultipart()**: Header puliti per multipart
- ⏳ **Test upload**: Da testare con backend attivo
- ⏳ **Test PUT multipart**: Da testare con backend attivo

## 🔍 Come Debuggare

### Console Browser (aspettati questi log):
```
🚀 API Request: POST /api/admin/listings/1/photos
📦 Data Type: FormData
📋 Headers: {
  "Authorization": "Basic YWRtaW46ZGRk"
  // NON Content-Type - sarà aggiunto automaticamente dal browser
}
```

### Network Request Headers (aspettati):
```
Authorization: Basic YWRtaW46ZGRk
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
```

### Se ancora errore 500:
1. **Controlla console backend** per stack trace completo
2. **Verifica permessi filesystem** su cartella uploads
3. **Copia error.response.data** completo qui per debug avanzato

## 🚀 Prossimi Passi

1. **Avvia backend**: `mvn spring-boot:run`
2. **Avvia frontend**: `npm run dev`
3. **Testa upload foto** tramite interfaccia admin
4. **Verifica logs** in console browser e backend
5. **Se funziona**: ✅ Problema risolto!
6. **Se ancora errore**: Copia qui `error.response.data` per debug

## 💡 Note Tecniche

- **FormData**: Axios rileva automaticamente e imposta multipart/form-data
- **JSON**: Interceptor imposta application/json quando necessario
- **Boundary**: Browser genera automaticamente il boundary per multipart
- **Basic Auth**: Funziona identicamente per JSON e multipart

La correzione dovrebbe risolvere completamente l'errore 500 con "Content-Type not supported".