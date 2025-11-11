# NOTA IMPORTANTE - IMMAGINE DI SFONDO HERO

## 📸 Immagine Richiesta

L'immagine di sfondo per la sezione hero è stata configurata ma deve essere aggiunta manualmente:

**File richiesto**: `basilica-di-san-pietro-alla-luce-del-giorno.jpg`
**Posizione**: `public/basilica-di-san-pietro-alla-luce-del-giorno.jpg`

## ✅ Modifiche Applicate

### 1. Componente Hero.jsx
- Aggiunto `style={{backgroundImage: 'url("/basilica-di-san-pietro-alla-luce-del-giorno.jpg")'}}` alla sezione

### 2. Stili CSS (App.css)
- Modificato `.hero` per supportare background-image
- Aggiunto overlay semitrasparente per leggibilità testo
- Mantenuto gradiente come overlay sui colori aziendali
- Configurate proprietà: `background-size: cover`, `background-position: center`

## 🎨 Risultato Visivo

La sezione hero ora avrà:
- **Sfondo**: Immagine della Basilica di San Pietro
- **Overlay**: Gradiente blu aziendale semitrasparente  
- **Testo**: Rimane leggibile con text-shadow
- **Responsive**: Immagine si adatta a tutti i device

## 🚀 Per Attivare

1. Scaricare l'immagine `basilica-di-san-pietro-alla-luce-del-giorno.jpg`
2. Copiarla nella cartella `public/`
3. Riavviare l'applicazione (se necessario)

L'immagine sarà automaticamente caricata come sfondo della hero section mantenendo tutti gli stili e la funzionalità esistenti.