import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';  
import { ethers } from 'ethers';
import SmallTile from './SmallTile'  
import Flippando from '../artifacts/contracts/Flippando.sol/Flippando.json'
import FlippandoBundler from '../artifacts/contracts/FlippandoBundler.sol/FlippandoBundler.json'


const NFTListUser = () => {

  const adr = useSelector(state => state.flippando.adr);
  const flippandoAddress = adr.flippandoAddress;
  const flippandoBundlerAddress = adr.flippandoBundlerAddress;

  const [allNfts, setAllNfts] = useState([]);
  const [artworkNFTs, setArtworkNFTs] = useState([]);
  
  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    // Connect to the Ethereum network
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(flippandoAddress, Flippando.abi, signer);
    // Get the user's account address
    const accounts = await provider.listAccounts();

    // Create a contract instance
    const flippandoBundlerContract = new ethers.Contract(flippandoBundlerAddress, FlippandoBundler.abi, provider);

    // Get the current user's address
    const userAddress = await signer.getAddress();

    // Call the getUserNFTs function from the smart contract
    const tokenIds = await contract.getUserNFTs({ from: userAddress });
    const tokensInArtwork = [];
    const nftData = [];
    await Promise.all(
      tokenIds.map(async (tokenId) => {
        const tokenUri = await contract.tokenURI(tokenId);
        const response = await fetch(tokenUri);
        const metadata = await response.text();
        console.log("metadata ", metadata);

        try {
          const isPartOfArtwork = await flippandoBundlerContract.isPartOfArtwork(tokenId);
          console.log("isPartOfArtwork ", isPartOfArtwork);
          if (isPartOfArtwork === false) {
            console.log("inside isPartOfArtwork check");
            if (metadata !== undefined && metadata !== null) {
              nftData.push({
                tokenId: tokenId.toString(),
                metadata: JSON.parse(metadata),
              });
            }
          }
          else {
            if (metadata !== undefined && metadata !== null) {
              tokensInArtwork.push({
                tokenId: tokenId.toString(),
                metadata: JSON.parse(metadata),
              });
            }
          }
        }
        catch {
          console.error('Error while checking if nft is part of artwork:', error);
        }

      })
    );
    setArtworkNFTs(tokensInArtwork);
    setAllNfts(nftData);
  };

  const getArtworkNFTs = async () => {
    try {
      // Connect to the Ethereum network
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Contract address and ABI
      const flippandoBundlerABI = FlippandoBundler.abi;

      // Get the user's account address
      const accounts = await provider.listAccounts();
      const userAddress = accounts[0];

      // Create a contract instance
      const flippandoBundlerContract = new ethers.Contract(flippandoBundlerAddress, flippandoBundlerABI, provider);
      const flippandoContract = new ethers.Contract(flippandoAddress, Flippando.abi, signer);

      
      // Get the balance of NFTs owned by the user
      const balance = await flippandoBundlerContract.balanceOf(userAddress);
      console.log('balance ' + balance)

      // Iterate over the NFTs and retrieve their token IDs
      const tokenIds = [];
      for (let i = 0; i < balance; i++) {
        const tokenId = await flippandoBundlerContract.tokenOfOwnerByIndex(userAddress, i);
        console.log('tokenId ' + tokenId)
        const tokenIdInt = parseInt(tokenId._hex, 16);
        const containedNfts = await flippandoBundlerContract.getArtwork(tokenIdInt);
        for (let m = 0; m < containedNfts.length; m++) {
            const nftId = containedNfts[m];
            const tokenUri = await flippandoContract.tokenURI(tokenId);
            const response = await fetch(tokenUri);
            const metadata = await response.text();
            if(metadata !== undefined && metadata !== null){
              tokenIds.push({tokenId: nftId, metadata: metadata});  
            }
          }
        
      }

      setArtworkNFTs(tokenIds);
      
    } catch (error) {
      console.log('Error:', error);
    }
  };
 


  return (
    <div className="flex justify-center">
  <div className="w-4/5">
    <div className="flex">
      <div className="w-1/2 p-4">
        <h1 className="text-2xl font-bold">Ready to use NFTs</h1>
        <h3 className="text-lg">These are the tiles you discovered so far. They all have 1 FLIP token inside,
        but must be used in an artwork project for the token to be unlocked and sent to you.</h3>
        <div>
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridGap: "20px", paddingTop: "20px" }}>
          {allNfts !== 0 && allNfts.map((nft) => (
            <li key={nft.tokenId}>
              <SmallTile tokenId={nft.tokenId} metadata={JSON.stringify(nft.metadata)} />
            </li>
          ))}
        </ul>
      </div>
      </div>
      <div className="w-1/2 p-4">
        <h1 className="text-2xl font-bold">Artwork NFTs</h1>
        <h3 className="text-lg">These are NFTs already used to create your artwork. They cannot be transfered indivudually
        and their FLIP tokens have been unlocked and tranfered to their initial creators. </h3>
        <div>
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridGap: "20px" }}>
          {artworkNFTs !== 0 && artworkNFTs.map((artworkNft) => (
            <li key={artworkNft.tokenId}>
              <SmallTile tokenId={artworkNft.tokenId} metadata={JSON.stringify(artworkNft.metadata)} />
            </li>
          ))}
        </ul>
        </div>
      </div>
    </div>
  </div>
</div>
  );
  
};

export default NFTListUser;
