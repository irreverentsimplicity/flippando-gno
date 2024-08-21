export const saveEncryptedMnemonicToIndexedDB = async (encryptedMnemonic) => {
    return new Promise((resolve, reject) => {
      console.log('Opening IndexedDB...');
      const request = indexedDB.open('walletDB', 1);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        console.log('Upgrading IndexedDB and creating object store if not exists.');
        if (!db.objectStoreNames.contains('mnemonics')) {
          db.createObjectStore('mnemonics', { keyPath: 'id' });
          console.log('Object store "mnemonics" created.');
        }
      };
  
      request.onsuccess = (event) => {
        console.log('IndexedDB opened successfully.');
        const db = event.target.result;
  
        if (!db.objectStoreNames.contains('mnemonics')) {
          console.error('Object store "mnemonics" not found.');
          return reject(new Error('Object store "mnemonics" not found.'));
        }
  
        const transaction = db.transaction(['mnemonics'], 'readwrite');
        const store = transaction.objectStore('mnemonics');
        store.put({ id: 1, mnemonic: encryptedMnemonic });
  
        transaction.oncomplete = () => {
          console.log('Mnemonic saved successfully.');
          resolve();
        };
        transaction.onerror = (err) => {
          console.error('Transaction error:', err);
          reject(err);
        };
      };
  
      request.onerror = (err) => {
        console.error('Error opening IndexedDB:', err);
        reject(err);
      };
    });
  };
  
  export const getEncryptedMnemonicFromIndexedDB = async () => {
    return new Promise((resolve, reject) => {
      console.log('Opening IndexedDB to retrieve mnemonic...');
      const request = indexedDB.open('walletDB', 1);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        console.log('Upgrading IndexedDB and creating object store if not exists.');
        if (!db.objectStoreNames.contains('mnemonics')) {
          db.createObjectStore('mnemonics', { keyPath: 'id' });
          console.log('Object store "mnemonics" created.');
        }
      };
  
      request.onsuccess = (event) => {
        console.log('IndexedDB opened successfully.');
        const db = event.target.result;
  
        if (!db.objectStoreNames.contains('mnemonics')) {
          console.error('Object store "mnemonics" not found.');
          return reject(new Error('Object store "mnemonics" not found.'));
        }
  
        const transaction = db.transaction(['mnemonics'], 'readonly');
        const store = transaction.objectStore('mnemonics');
        const getRequest = store.get(1);
  
        getRequest.onsuccess = (event) => {
          const result = event.target.result?.mnemonic || null;
          if (result) {
            console.log('Mnemonic retrieved successfully.');
            resolve(result);
          } else {
            console.log('No mnemonic found.');
            resolve(null);
          }
        };
  
        getRequest.onerror = (err) => {
          console.error('Error retrieving mnemonic:', err);
          reject(err);
        };
      };
  
      request.onerror = (err) => {
        console.error('Error opening IndexedDB:', err);
        reject(err);
      };
    });
  };
  