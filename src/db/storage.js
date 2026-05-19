const DB_NAME = "jat_store"
const STORE_NAME = "jat_sqlite_session"
const KEY = "database"
const SESSION_KEY = "last_active_at"


function openIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1)
        request.onupgradeneeded = () => {
            const db = request.result
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME)
            }
        }
        request.onsuccess = () => {
            resolve(request.result)
        }
        request.onerror = () => {
            reject(request.error)
        }
    })
}

export async function loadDBAndSession() {
    const db = await openIndexedDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly")
        const store = tx.objectStore(STORE_NAME)
        const request1 = store.get(KEY)
        const request2 = store.get(SESSION_KEY)
        tx.oncomplete = () => {
            const result = [
                request1.result ?? null,
                request2.result ?? null
            ]
            db.close()
            resolve(result)
        }
        tx.onerror = () => {
            db.close()
            reject(tx.error)
        }

        tx.onabort = () => {
            db.close()           
            reject(tx.error)
        }
    })
}

export async function saveDBAndSession(uint8Array) {
    const db = await openIndexedDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite")
        const store = tx.objectStore(STORE_NAME)
        store.put(uint8Array, KEY)
        store.put(Date.now(), SESSION_KEY)
        tx.oncomplete = () => {
            db.close()
            resolve()
        }
        tx.onerror = () => {
            db.close()
            reject(tx.error)
        }
        tx.onabort = () => {
            db.close()           
            reject(tx.error)
        }        
    })
}

export function deleteDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(DB_NAME)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
        request.onblocked = () => {
            reject(
                new Error(
                    "database deletion blocked by open connection"
                )
            )
        }
    })
}




