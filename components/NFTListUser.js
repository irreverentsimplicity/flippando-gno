import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';  
import SmallTile from './SmallTile'  



const NFTListUser = ({userNFTs, userArtworkNFTs}) => {

  /*
  useEffect( () =>{
    console.log("userNfts", userNFTs);
  })
  };*/
 
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


  const renderUsedNFTs = () => {
    if (userArtworkNFTs !== undefined && userArtworkNFTs.length !== 0) {
      return (
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridGap: "20px", paddingTop: "20px" }}>
          {userArtworkNFTs.map((nft, index) => (
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
        <h3 className="text-lg">These are NFTs already used to create your artwork. They cannot be transfered individually
        and their FLIP tokens have been unlocked and transferred to their initial creators. </h3>
        <div>
          {renderUsedNFTs()}
        </div>
      </div>
    </div>
  
</div>
  );
  
};

export default NFTListUser;
