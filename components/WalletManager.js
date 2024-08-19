import React, { useState } from 'react';
import { generateMnemonic, encryptMnemonic, decryptMnemonic } from '../util/crypto';
import { saveEncryptedMnemonicToIndexedDB, getEncryptedMnemonicFromIndexedDB } from '../util/dblayer';

const WalletManager = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const [decryptedMnemonic, setDecryptedMnemonic] = useState('');

  const handleEncryptAndStore = async () => {
    const encryptedMnemonic = encryptMnemonic(mnemonic, password);
    await saveEncryptedMnemonicToIndexedDB(encryptedMnemonic);
    alert('Mnemonic encrypted and saved securely.');
  };

  const handleRetrieveAndDecrypt = async () => {
    const encryptedMnemonic = await getEncryptedMnemonicFromIndexedDB();
    if (!encryptedMnemonic) {
      alert('No encrypted mnemonic found.');
      return;
    }
    
    const decrypted = decryptMnemonic(encryptedMnemonic, password);
    if (decrypted) {
      setDecryptedMnemonic(decrypted);
      alert('Mnemonic decrypted successfully.');
    } else {
      alert('Failed to decrypt mnemonic. Check your password.');
    }
  };

  return (
    <div>
      <h1>Mnemonic Manager</h1>

      <div>
        <h2>Store Mnemonic</h2>
        <input
          type="text"
          placeholder="Enter mnemonic"
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleEncryptAndStore}>Encrypt and Store</button>
      </div>

      <div>
        <h2>Retrieve Mnemonic</h2>
        <input
          type="password"
          placeholder="Enter password to decrypt"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleRetrieveAndDecrypt}>Retrieve and Decrypt</button>
      </div>

      {decryptedMnemonic && (
        <div>
          <h3>Decrypted Mnemonic</h3>
          <p>{decryptedMnemonic}</p>
        </div>
      )}
    </div>
  );
}

export default WalletManager;
