import { useEffect } from 'react';

const AdenaWallet = () => {

  useEffect(() => {
    const integrateWallet = async () => {
      // Look for the adena object
      if (!window.adena) {
        // Open adena.app in a new tab if the adena object is not found
        window.open("https://adena.app/", "_blank");
      } else {
        // Add connection
        const connection = await adena.AddEstablish("Flippando");
        console.log("connection, ", JSON.stringify(connection))
        
      }
    };
    const account = window.adena.GetAccount()
    console.log("adena account ", JSON.stringify(account))

    integrateWallet();
  }, []);

  return (
    <div>
      {/* UI here */}
    </div>
  );
};

export default AdenaWallet;