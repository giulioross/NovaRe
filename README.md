# Nova RE - Sito Web Agenzia Immobiliare

Nova RE è il sito web moderno per l'agenzia immobiliare Nova RE, specializzata nella vendita e affitto di immobili a Roma. Il sito è sviluppato con React + Vite per garantire performance ottimali e un'esperienza utente eccellente.

## ✨ Caratteristiche

- **Design Moderno**: Interfaccia pulita e professionale con design responsive
- **Performance Ottimizzate**: Costruito con Vite per tempi di caricamento velocissimi
- **Componenti Riutilizzabili**: Architettura modulare con componenti React
- **Integrazione Backend**: Pronto per connettersi con API backend per gestione immobili
- **SEO Friendly**: Meta tag ottimizzati per i motori di ricerca
- **Accessibilità**: Sviluppato seguendo le best practice di accessibilità web

## 🚀 Tecnologie Utilizzate

- **React 19.1.1** - Framework JavaScript per l'interfaccia utente
- **Vite** - Build tool moderno e veloce
- **CSS3** - Styling avanzato con CSS Grid e Flexbox
- **JavaScript ES6+** - Codice moderno e ottimizzato
- **Google Fonts** - Typography con font Poppins

## 📁 Struttura del Progetto

```
src/
├── components/          # Componenti React riutilizzabili
│   ├── Navbar.jsx      # Barra di navigazione
│   ├── Hero.jsx        # Sezione hero principale
│   ├── About.jsx       # Sezione "Chi siamo"
│   ├── Services.jsx    # Sezione servizi
│   ├── Properties.jsx  # Gestione immobili
│   ├── Partners.jsx    # Sezione partner
│   ├── Contact.jsx     # Form di contatto
│   └── Footer.jsx      # Footer del sito
├── services/           # Servizi per API e utility
│   └── api.js         # Configurazione API e utilities
├── hooks/              # Hook personalizzati React
│   └── useProperties.js # Hook per gestione immobili
├── App.jsx            # Componente principale
├── App.css            # Stili principali
├── index.css          # Stili globali
└── main.jsx           # Entry point dell'applicazione
```

## 🛠️ Installazione e Sviluppo

### Prerequisiti
- Node.js (versione 16 o superiore)
- npm o yarn

### Installazione
```bash
# Clona il repository
git clone [repository-url]

# Naviga nella cartella del progetto
cd NovaRe

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

Il sito sarà disponibile su `http://localhost:5173` (o sulla porta successiva disponibile).

### Altri Comandi Disponibili
```bash
# Build per produzione
npm run build

# Preview del build di produzione
npm run preview

# Linting del codice
npm run lint
```

## 🔌 Integrazione Backend

Il sito è completamente integrato con un backend Spring Boot tramite API REST. Le configurazioni si trovano in:

- `src/api/axios.js` - Client axios configurato
- `src/services/listingService.js` - Servizi API per immobili
- `src/hooks/useListings.js` - Hook personalizzati per caricamento dati
- `src/components/Properties.jsx` - Componente visualizzazione immobili pubblici
- `src/components/AdminPanel.jsx` - Pannello amministrazione completo

### API Pubbliche (senza autenticazione)
- `GET /api/public/listings` - Lista immobili pubblici
- `GET /api/public/listings/{id}` - Dettaglio immobile pubblico

### API Admin (con Basic Auth)
- `GET /api/admin/listings` - Lista completa immobili
- `POST /api/admin/listings` - Crea nuovo immobile
- `PUT /api/admin/listings/{id}` - Aggiorna immobile
- `DELETE /api/admin/listings/{id}` - Elimina immobile

### 🧪 Modalità Demo
Accedi alla modalità demo per testare l'integrazione API:
```bash
# Visita l'URL con parametro demo
http://localhost:5174?demo=true

# Oppure clicca il bottone "Demo API" in alto a destra (solo in sviluppo)
```

### 🔧 Configurazione CORS Backend
Consulta il file `CORS_SETUP.md` per le istruzioni complete su come configurare CORS nel backend Spring Boot.

## 🎨 Personalizzazione

### Colori
I colori principali sono definiti come variabili CSS in `src/index.css`:
- `--primary-color: #007bff` - Blu primario
- `--primary-dark: #0056b3` - Blu scuro
- `--secondary-color: #f8f9fa` - Grigio chiaro

### Font
Il sito utilizza Google Fonts con il font **Poppins** in diverse varianti di peso.

### Immagini
Le immagini sono caricate da URL esterni. Per utilizzare immagini locali, posizionarle in `public/` e aggiornarle nei componenti.

## 📱 Responsive Design

Il sito è completamente responsive e ottimizzato per:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1200px+)

## 🌐 SEO e Performance

- Meta tag ottimizzati per SEO
- Open Graph per condivisioni social
- Lazy loading delle immagini
- Code splitting automatico con Vite
- CSS ottimizzato e minificato

## 📞 Sezioni del Sito

1. **Home/Hero** - Presentazione principale con CTA
2. **Chi Siamo** - Storia, missione, team e statistiche
3. **Servizi** - Servizi offerti dall'agenzia
4. **Immobili** - Vetrina immobili con filtri
5. **Partner** - Collaborazioni e partnership
6. **Contatti** - Sedi, informazioni e form di contatto

## 🤝 Supporto

Per supporto tecnico o domande:
- 📧 Email: info@novareimmobiliare.it
- 📞 Telefono: +39 345 345 4186
- 🌐 Sito: www.novareimmobiliare.it

## 📄 Licenza

© 2025 Nova RE. Tutti i diritti riservati. | P.IVA: 17332741002

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
