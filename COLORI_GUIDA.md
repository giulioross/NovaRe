# GUIDA AI COLORI - NOVA RE

## Nuova Palette Colori Implementata

### Colori Principali
- `--color-primary: #002F5F` - Blu scuro dominante
- `--color-secondary: #0078D4` - Blu brillante accento  
- `--color-background: #F5F7FA` - Grigio chiaro background
- `--color-text: #333333` - Grigio scuro testo
- `--color-accent: #FF6B00` - Arancio call-to-action

### Colori di Stato
- `--color-success: #28a745` - Verde per successo
- `--color-warning: #ffc107` - Giallo per avvisi
- `--color-error: #dc3545` - Rosso per errori

## Sostituzioni da Effettuare nei Componenti JSX

### Colori Blu (Primary/Secondary)
- `#007bff` → `var(--color-secondary)`
- `#0056b3` → `var(--color-primary)`

### Colori di Stato
- `#28a745` → `var(--color-success)`
- `#dc3545` → `var(--color-error)`
- `#ffc107` → `var(--color-warning)`

### Esempi di Uso nei Componenti JSX
```jsx
// Prima
background: '#007bff'

// Dopo  
background: 'var(--color-secondary)'

// Prima
color: '#dc3545'

// Dopo
color: 'var(--color-error)'
```

## File Completati ✅
- ✅ `src/colors.css` - Variabili CSS create
- ✅ `src/App.css` - Tutti i colori aggiornati
- ✅ `src/components/Properties.jsx` - Parzialmente aggiornato

## File da Aggiornare 🔄
- 🔄 `src/components/LoadingSpinner.jsx`
- 🔄 `src/components/Listings.jsx`
- 🔄 `src/components/AdminLogin.jsx`
- 🔄 `src/components/AdminPanel.jsx`
- 🔄 `src/components/AdminCreateListing.jsx`
- 🔄 `src/components/AdminEditListing.jsx`
- 🔄 `src/components/Contact.jsx`
- 🔄 Altri componenti con colori hardcoded

## Note Implementazione
- I componenti JSX devono usare `style={{background: 'var(--color-primary)'}}` 
- Le variabili CSS sono già importate tramite `App.css`
- Mantenere compatibilità con rgba per trasparenze: `rgba(var(--color-primary-rgb), 0.5)`