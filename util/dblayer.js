// import / export to indexedbd

export const saveEncryptedMnemonicToIndexedDB = async (encryptedMnemonic) =>{
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('walletDB', 1);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore('mnemonics', { keyPath: 'id' });
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['mnemonics'], 'readwrite');
        const store = transaction.objectStore('mnemonics');
        store.put({ id: 1, mnemonic: encryptedMnemonic });
        transaction.oncomplete = () => resolve();
        transaction.onerror = (err) => reject(err);
      };
  
      request.onerror = (err) => reject(err);
    });
  }
  
  export const getEncryptedMnemonicFromIndexedDB = async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('walletDB', 1);
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['mnemonics'], 'readonly');
        const store = transaction.objectStore('mnemonics');
        const getRequest = store.get(1);
  
        getRequest.onsuccess = (event) => resolve(event.target.result?.mnemonic || null);
        getRequest.onerror = (err) => reject(err);
      };
  
      request.onerror = (err) => reject(err);
    });
  }
  