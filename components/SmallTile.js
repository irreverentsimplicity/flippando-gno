import React from "react";
import styles from '../styles/Home.module.css';


const SmallTile = ({ tokenId, metadata }) => {
  //console.log('metadata ' + metadata);
  const { svgData, tokenID } = JSON.parse(metadata);
  //console.log("svgData", JSON.stringify(svgData))
  return (
    <div className={styles.small_tile}>
      <div className={styles.small_tile_image}
      style={{
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
        }} >
        <img src={"data:image/svg+xml;base64," + svgData} alt={tokenID}/>
      </div>
    </div>
  );
};

export default SmallTile;
