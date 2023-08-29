import { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';  
//import { ethers } from 'ethers';
import Flippando from '../artifacts/contracts/Flippando.sol/Flippando.json'
import FlippandoGameMaster from '../artifacts/contracts/FlippandoGameMaster.sol/FlippandoGameMaster.json'


const MyGames = () => {

  const adr = useSelector(state => state.flippando.adr);
  const flippandoAddress = adr.flippandoAddress;
  const flippandoGameMasterAddress = adr.flippandoGameMasterAddress;

  const [allGames, setAllGames] = useState([]);
  
  useEffect(() => {
    fetchGames();
  }, []);

  
  const fetchGames = async () => {
    // Connect to the Ethereum network
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(flippandoGameMasterAddress, FlippandoGameMaster.abi, signer);

    // Get the current user's address
    const userAddress = await signer.getAddress();

    // Call the getUserNFTs function from the smart contract
    const normalGames = await contract.getNormalGames(userAddress);
    await Promise.all(
        normalGames.map(async (game) => {
        console.log("game ", JSON.stringify(game));
      })
    );
    setAllGames(normalGames);
  };


  return (
    <div>
      <h3>User normal games</h3>
      <div>
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridGap: "20px" }}>
          {allGames !== 0 && allGames.map((game, index) => (
            <li key={index}>
                <div> game {index}</div>
              <div>creator: {game[0]}</div><hr/>
              <div>player: {game[1]}</div>
              <div>status: {game[5]}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>

  );
  
};

export default MyGames;
