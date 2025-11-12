# Configurazione EmailJS per Nova RE

## Setup EmailJS

1. **Registrati su EmailJS**: Vai su https://www.emailjs.com/ e crea un account

2. **Crea un servizio Email**:
   - Vai su "Email Services" 
   - Clicca "Add New Service"
   - Scegli il provider email (Gmail, Outlook, etc.)
   - Configura con le credenziali email di Nova RE
   - Annota il **Service ID**

3. **Crea un template email**:
   - Vai su "Email Templates"
   - Clicca "Create New Template"
   - Configura il template con questi parametri:
     ```
     Subject: Nuova richiesta di contatto da {{from_name}}
     
     Body:
     Hai ricevuto una nuova richiesta di contatto dal sito Nova RE.
     
     Nome: {{from_name}}
     Email: {{from_email}} 
     Telefono: {{phone}}
     
     Messaggio:
     {{message}}
     
     ---
     Questa email è stata inviata automaticamente dal form di contatto del sito Nova RE.
     ```
   - Annota il **Template ID**

4. **Ottieni la chiave pubblica**:
   - Vai su "Account" > "General"
   - Copia la **Public Key**

5. **Aggiorna il file .env**:
   ```env
   VITE_EMAILJS_SERVICE_ID=il_tuo_service_id
   VITE_EMAILJS_TEMPLATE_ID=il_tuo_template_id  
   VITE_EMAILJS_PUBLIC_KEY=la_tua_public_key
   VITE_CONTACT_EMAIL=info@novareimmobiliare.it
   ```

6. **Riavvia il server di sviluppo** dopo aver modificato il .env

## Test

Dopo la configurazione, testa il form di contatto. Le email arriveranno all'indirizzo configurato nel servizio EmailJS.

## Fallback

Se EmailJS non è configurato, il sistema mostrerà un messaggio che invita a contattare direttamente Nova RE al numero di telefono.