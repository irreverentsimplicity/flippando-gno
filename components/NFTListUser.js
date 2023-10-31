import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';  
//import { ethers } from 'ethers';
import SmallTile from './SmallTile'  


const NFTListUser = () => {

  const [allNfts, setAllNfts] = useState([]);
  const [artworkNFTs, setArtworkNFTs] = useState([]);
  
  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    console.log("fethcNFTs")
  };

  const getArtworkNFTs = async () => {
    try {
      console.log("getArtworkNFTs")
      
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
