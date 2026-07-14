/* ============================================================
   MUSEO DIGITAL — Capa IndexedDB
   Persistencia de: favoritos, preferencias, colecciones guardadas
   ============================================================ */

const MuseoDB = (() => {
  const DB_NAME = 'museo_digital';
  const DB_VERSION = 1;
  let db = null;

  /* --- Inicializar DB --- */
  async function init() {
    if (db) return db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const database = e.target.result;

        // Store de favoritos
        if (!database.objectStoreNames.contains('favoritos')) {
          const favStore = database.createObjectStore('favoritos', { keyPath: 'id' });
          favStore.createIndex('fecha_idx', 'fecha', { unique: false });
        }

        // Store de preferencias
        if (!database.objectStoreNames.contains('preferencias')) {
          database.createObjectStore('preferencias', { keyPath: 'clave' });
        }

        // Store de obras visitadas
        if (!database.objectStoreNames.contains('historial')) {
          const histStore = database.createObjectStore('historial', { keyPath: 'id' });
          histStore.createIndex('fecha_idx', 'fecha', { unique: false });
        }

        // Store de colecciones personalizadas
        if (!database.objectStoreNames.contains('colecciones')) {
          database.createObjectStore('colecciones', { keyPath: 'id' });
        }

        // Store de notas del visitante
        if (!database.objectStoreNames.contains('notas')) {
          const notasStore = database.createObjectStore('notas', { keyPath: 'id' });
          notasStore.createIndex('obraId_idx', 'obraId', { unique: false });
        }

        // Store de contactos (consultas privadas guardadas)
        if (!database.objectStoreNames.contains('consultas')) {
          const consultasStore = database.createObjectStore('consultas', { keyPath: 'id' });
          consultasStore.createIndex('fecha_idx', 'fecha', { unique: false });
        }
      };

      request.onsuccess = (e) => {
        db = e.target.result;
        console.log('🗄️ IndexedDB inicializada — Museo Digital');
        resolve(db);
      };

      request.onerror = (e) => {
        console.error('Error al abrir IndexedDB:', e.target.error);
        reject(e.target.error);
      };
    });
  }

  /* --- Helper: transacción genérica --- */
  function tx(storeName, mode = 'readonly') {
    if (!db) throw new Error('DB no inicializada. Llama a init() primero.');
    const transaction = db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  /* ============================================================
     FAVORITOS
     ============================================================ */

  async function addFavorito(obra) {
    await init();
    return new Promise((resolve, reject) => {
      const store = tx('favoritos', 'readwrite');
      const data = {
        id: obra.id || obra.slug || crypto.randomUUID(),
        obraId: obra.obraId || obra.id,
        titulo: obra.titulo || '',
        artista: obra.artista || '',
        imagen: obra.imagen || '',
        coleccion: obra.coleccion || '',
        fecha: new Date().toISOString(),
        metadata: obra.metadata || {}
      };
      const request = store.put(data);
      request.onsuccess = () => resolve(data);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function removeFavorito(id) {
    await init();
    return new Promise((resolve, reject) => {
      const store = tx('favoritos', 'readwrite');
      const request = store.delete(id);
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function getFavoritos() {
    await init();
    return new Promise((resolve, reject) => {
      const store = tx('favoritos');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function isFavorito(id) {
    await init();
    return new Promise((resolve, reject) => {
      const store = tx('favoritos');
      const request = store.get(id);
      request.onsuccess = () => resolve(!!request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function toggleFavorito(obra) {
    const id = obra.id || obra.slug;
    const esFav = await isFavorito(id);
    if (esFav) {
      await removeFavorito(id);
      return { action: 'removed', id };
    } else {
      await addFavorito(obra);
      return { action: 'added', id };
    }
  }

  /* ============================================================
     PREFERENCIAS (modo museo, tema, etc.)
     ============================================================ */

  async function setPreferencia(clave, valor) {
    await init();
    return new Promise((resolve, reject) => {
      const store = tx('preferencias', 'readwrite');
      const request = store.put({ clave, valor, actualizado: new Date().toISOString() });
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function getPreferencia(clave) {
    await init();
    return new Promise((resolve, reject) => {
      const store = tx('preferencias');
      const request = store.get(clave);
      request.onsuccess = () => resolve(request.result ? request.result.valor : null);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function getAllPreferencias() {
    await init();
    return new Promise((resolve, reject) => {
      const store = tx('preferencias');
      const request = store.getAll();
      request.onsuccess = () => {
        const prefs = {};
        (request.result || []).forEach(p => { prefs[p.clave] = p.valor; });
        resolve(prefs);
      };
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /* ============================================================
     HISTORIAL DE OBRAS VISITADAS
     ============================================================ */

  async function addVisita(obra) {
    await init();
    const store = tx('historial', 'readwrite');
    const data = {
      id: obra.id || crypto.randomUUID(),
      obraId: obra.obraId || obra.id,
      titulo: obra.titulo || '',
      fecha: new Date().toISOString()
    };
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve(data);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function getHistorial(limit = 20) {
    await init();
    return new Promise((resolve, reject) => {
      const store = tx('historial');
      const index = store.index('fecha_idx');
      const request = index.openCursor(null, 'prev');
      const results = [];
      request.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor && results.length < limit) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /* ============================================================
     COLECCIONES PERSONALIZADAS
     ============================================================ */

  async function saveColeccion(coleccion) {
    await init();
    return new Promise((resolve, reject) => {
      const store = tx('colecciones', 'readwrite');
      const data = {
        id: coleccion.id || crypto.randomUUID(),
        nombre: coleccion.nombre || 'Sin nombre',
        obras: coleccion.obras || [],
        fecha: new Date().toISOString(),
        descripcion: coleccion.descripcion || ''
      };
      const request = store.put(data);
      request.onsuccess = () => resolve(data);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function getColecciones() {
    await init();
    return new Promise((resolve, reject) => {
      const store = tx('colecciones');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function deleteColeccion(id) {
    await init();
    return new Promise((resolve, reject) => {
      const store = tx('colecciones', 'readwrite');
      const request = store.delete(id);
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /* ============================================================
     NOTAS DEL VISITANTE
     ============================================================ */

  async function saveNota(nota) {
    await init();
    return new Promise((resolve, reject) => {
      const store = tx('notas', 'readwrite');
      const data = {
        id: nota.id || crypto.randomUUID(),
        obraId: nota.obraId || '',
        texto: nota.texto || '',
        fecha: new Date().toISOString()
      };
      const request = store.put(data);
      request.onsuccess = () => resolve(data);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function getNotas(obraId = null) {
    await init();
    return new Promise((resolve, reject) => {
      const store = tx('notas');
      if (obraId) {
        const index = store.index('obraId_idx');
        const request = index.getAll(obraId);
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = (e) => reject(e.target.error);
      } else {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = (e) => reject(e.target.error);
      }
    });
  }

  /* ============================================================
     CONSULTAS PRIVADAS GUARDADAS
     ============================================================ */

  async function saveConsulta(consulta) {
    await init();
    return new Promise((resolve, reject) => {
      const store = tx('consultas', 'readwrite');
      const data = {
        id: consulta.id || crypto.randomUUID(),
        nombre: consulta.nombre || '',
        email: consulta.email || '',
        mensaje: consulta.mensaje || '',
        obraInteres: consulta.obraInteres || '',
        fecha: new Date().toISOString(),
        estado: 'pendiente'
      };
      const request = store.put(data);
      request.onsuccess = () => resolve(data);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async function getConsultas() {
    await init();
    return new Promise((resolve, reject) => {
      const store = tx('consultas');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /* ============================================================
     EXPORT / IMPORT (backup del usuario)
     ============================================================ */

  async function exportAll() {
    const [favoritos, preferencias, historial, colecciones, notas, consultas] = await Promise.all([
      getFavoritos(), getAllPreferencias(), getHistorial(1000),
      getColecciones(), getNotas(), getConsultas()
    ]);
    return { favoritos, preferencias, historial, colecciones, notas, consultas, exportDate: new Date().toISOString() };
  }

  async function importAll(data) {
    await init();
    // Limpiar
    const stores = ['favoritos', 'preferencias', 'historial', 'colecciones', 'notas', 'consultas'];
    await Promise.all(stores.map(s => clearStore(s)));

    if (data.favoritos) {
      for (const f of data.favoritos) await addFavorito(f);
    }
    if (data.preferencias) {
      for (const [clave, valor] of Object.entries(data.preferencias)) await setPreferencia(clave, valor);
    }
    if (data.colecciones) {
      for (const c of data.colecciones) await saveColeccion(c);
    }
    if (data.notas) {
      for (const n of data.notas) await saveNota(n);
    }
    return true;
  }

  async function clearStore(storeName) {
    await init();
    return new Promise((resolve, reject) => {
      const store = tx(storeName, 'readwrite');
      const request = store.clear();
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /* --- API pública --- */
  return {
    init,
    // Favoritos
    addFavorito, removeFavorito, getFavoritos, isFavorito, toggleFavorito,
    // Preferencias
    setPreferencia, getPreferencia, getAllPreferencias,
    // Historial
    addVisita, getHistorial,
    // Colecciones
    saveColeccion, getColecciones, deleteColeccion,
    // Notas
    saveNota, getNotas,
    // Consultas
    saveConsulta, getConsultas,
    // Backup
    exportAll, importAll, clearStore
  };
})();

// Exponer globalmente
if (typeof window !== 'undefined') {
  window.MuseoDB = MuseoDB;
}