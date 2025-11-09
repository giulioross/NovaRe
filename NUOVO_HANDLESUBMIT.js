// NUOVO handleSubmit per AdminEditListing.jsx
// Sostituire la funzione esistente con questa versione

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Reset errori precedenti
  setValidationErrors({});
  
  // Validazione base
  if (!formData.title || !formData.address || !formData.price) {
    setMessage({
      type: 'error',
      text: 'Per favore compila almeno titolo, indirizzo e prezzo'
    });
    return;
  }

  // prendi credenziali admin
  const authHeader = makeAuthHeader(username, password);
  if (!authHeader) {
    // mostra UI per login o messaggio
    setMessage({
      type: 'error',
      text: '❌ Devi essere autenticato come admin per modificare gli annunci'
    });
    return;
  }

  setIsSubmitting(true);
  setMessage({ type: '', text: '' });

  // costruisci DTO dai campi del form
  const dto = {
    id: listing.id,
    title: formData.title,
    address: formData.address,
    price: Number(formData.price),
    description: formData.description,
    bedrooms: Number(formData.bedrooms || 0),
    bathrooms: Number(formData.bathrooms || 0),
    size: Number(formData.size || 0),
    contractType: formData.contractType || 'VENDITA',
    published: formData.published !== false,
    // non includere photoUrls qui, backend le aggiorna
  };

  try {
    console.log('🔄 SAFE FLOW - Aggiornamento immobile:', { id: listing.id, dto });
    
    // chiamata combinata: update JSON -> upload photos (se presenti)
    const files = convertImagesToFiles(formData.images); // FileList -> Array
    console.log('📸 SAFE FLOW - File da caricare:', files?.length || 0);
    
    const result = await listingService.updateListingWithPhotos(listing.id, dto, files, authHeader);
    console.log('✅ SAFE FLOW - Aggiornamento completato:', result);

    // success: aggiorna UI con result (listing aggiornato)
    setMessage({
      type: 'success',
      text: `✅ Immobile modificato con successo! ${files?.length > 0 ? `(${files.length} foto caricate)` : ''}`
    });

    // Chiama il callback di successo se fornito
    if (onSuccess) {
      console.log('🔄 SAFE FLOW - Chiamando onSuccess con result:', result);
      onSuccess(result);
    }

    // Dopo 2 secondi, chiudi il form
    setTimeout(() => {
      onCancel();
    }, 2000);

  } catch (err) {
    // gestione errori
    console.error('❌ SAFE FLOW - Errore nell\'aggiornamento:', err);
    
    if (err.status === 401) {
      setMessage({
        type: 'error',
        text: '❌ Credenziali non autorizzate. Effettua il login con un account admin valido.'
      });
      // opzionale: apri modal login
    } else if (err.status === 403) {
      setMessage({
        type: 'error',
        text: '❌ Accesso negato.'
      });
    } else if (err.status === 400 && err.data) {
      // Gestione errori di validazione
      if (typeof err.data === 'object' && !Array.isArray(err.data)) {
        setValidationErrors(err.data);
        setMessage({
          type: 'error',
          text: '❌ Errori di validazione. Controlla i campi evidenziati.'
        });
      } else {
        setMessage({
          type: 'error',
          text: `❌ Errore di validazione: ${err.data?.message || err.data}`
        });
      }
    } else {
      // mostra dettagli se presenti
      setMessage({
        type: 'error',
        text: err.data?.error || err.message || 'Errore sconosciuto'
      });
    }
  } finally {
    setIsSubmitting(false);
  }
};