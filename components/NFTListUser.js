import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';  
import SmallTile from './SmallTile'  



const NFTListUser = ({userNFTs, userArtworkNFTs}) => {

  useEffect( () =>{
    console.log("userNfts", userNFTs);
  })
  const getArtworkNFTs = async () => {
    try {
      console.log("getArtworkNFTs")
      
    } catch (error) {
      console.log('Error:', error);
    }
  };
 
  const renderNFTs = () => {
    if (userNFTs !== undefined && userNFTs.length !== 0) {
      return (
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridGap: "20px", paddingTop: "20px" }}>
          {userNFTs.map((nft, index) => (
            <li key={nft.tokenId}>
              <SmallTile tokenId={nft.tokenId} metadata={JSON.stringify(nft)} />
            </li>
          ))}
        </ul>
      );
    }
  };
  

  return (
    <div className="flex justify-center">
  
    <div className="flex">
      <div className="w-1/2 p-4">
        <h1 className="text-2xl font-bold">Ready to use NFTs</h1>
        <h3 className="text-lg">These are the tiles you discovered so far. They all have 1 FLIP token inside,
        but must be used in an artwork project for the token to be unlocked and sent to you.</h3>
        <div>
        {renderNFTs()}
      </div>
      </div>
      <div className="w-1/2 p-4">
        <h1 className="text-2xl font-bold">Artwork NFTs</h1>
        <h3 className="text-lg">These are NFTs already used to create your artwork. They cannot be transfered indivudually
        and their FLIP tokens have been unlocked and tranfered to their initial creators. </h3>
        <div>
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridGap: "20px" }}>
          {userArtworkNFTs !== null && userArtworkNFTs.length !== 0 && artworkNFTs.map((artworkNft) => (
            <li key={artworkNft.tokenId}>
              <SmallTile tokenId={artworkNft.tokenId} metadata={JSON.stringify(artworkNft.metadata)} />
            </li>
          ))}
        </ul>
        </div>
      </div>
    </div>
  
</div>
  );
  
};

export default NFTListUser;
