# 🔧 SOLUZIONE RAPIDA - Problema Credenziali 401

## 🎯 Problema Identificato

Il frontend invia correttamente l'header `Authorization: Basic YWRtaW46aGNqaH...` ma riceve **401 Unauthorized**.

**Il problema è nelle credenziali utilizzate!**

## ⚡ Soluzione Immediata

### 1. Controlla le Credenziali nel Login

Quando fai login nell'Admin Panel, assicurati di utilizzare:

```
Username: employee
Password: password
```

**NON:**
- ❌ `admin` / qualche altra password
- ❌ `user` / `password`
- ❌ Altri valori

### 2. Test nel Browser

1. Vai su `http://localhost:5174?demo=true`
2. Clicca su "Admin Panel"
3. **Nel form di login inserisci esattamente:**
   - Username: `employee`
   - Password: `password`
4. Clicca "Login"
5. Vai su "Crea Immobile" 
6. **Apri Console (F12)** e controlla il log:
   ```
   🔐 DEBUG - Credenziali ricevute: {username: "employee", password: "password"}
   ```

### 3. Se le Credenziali sono Corrette

Se vedi nel log che le credenziali sono `employee` / `password` ma continua a dare 401, allora il problema è nel backend.

**Verifica nel backend Spring Boot:**
1. Che l'utente `employee` esista con password `password`
2. Che sia abilitato per l'endpoint `/api/admin/listings`
3. Che la configurazione Basic Auth sia corretta

### 4. Test con PowerShell (per conferma)

```powershell
# Test le stesse credenziali che usa il frontend
$headers = @{"Authorization" = "Basic ZW1wbG95ZWU6cGFzc3dvcmQ="; "Content-Type" = "application/json"}
$body = '{"title":"Test","address":"Via Test","price":100000,"bedrooms":1,"bathrooms":1,"published":true}'
Invoke-WebRequest -Uri "http://localhost:8080/api/admin/listings" -Method POST -Headers $headers -Body $body -UseBasicParsing
```

Se questo restituisce 200, il problema è nel frontend.
Se restituisce 401, il problema è nel backend.

## 🎯 Prossimi Passi

1. **Verifica credenziali login** (molto probabile causa)
2. Controlla log console dopo aver fatto login con `employee`/`password`
3. Se credenziali corrette ma ancora 401 → problema backend
4. Se credenziali sbagliate → correggi il login

## 🚀 Quick Fix

Il più probabile è che stai usando credenziali diverse da `employee`/`password` nel login form dell'Admin Panel.

**Prova subito con le credenziali corrette!**