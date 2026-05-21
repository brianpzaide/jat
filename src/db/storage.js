const DB_NAME = "jat_store"
const STORE_NAME = "jat_sqlite_session"
const KEY = "database"


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

export async function loadDBFromStorage() {
    const db = await openIndexedDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly")
        const store = tx.objectStore(STORE_NAME)
        const request = store.get(KEY)
        tx.oncomplete = () => {
            const result = [
                request.result ?? null
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

export async function saveDBIntoStorage(uint8Array) {
    const db = await openIndexedDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite")
        const store = tx.objectStore(STORE_NAME)
        store.put(uint8Array, KEY)
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

export function deleteDatabaseFromStorage() {
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




