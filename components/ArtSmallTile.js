import React from "react";
import styles from '../styles/Home.module.css';
import Spinner from "./Spinner";


const ArtSmallTile = ({ tokenId, metadata }) => {
  //console.log('metadata ' + metadata);
  const { svgData, tokenID } = JSON.parse(metadata);

  console.log("svgData ArtSmallTile ", JSON.stringify(svgData))
  return (
    <div className={styles.art_small_tile}>
      <div className={styles.art_small_tile_image}
      style={{
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
        }} >
          {svgData === undefined &&
            <Spinner loadingText={'loading...'} />
          }
        {svgData !== undefined &&
          <img src={"data:image/svg+xml;base64," + svgData} alt={tokenID}/>
        }
        
      </div>
    </div>
  );
};

export default ArtSmallTile;
