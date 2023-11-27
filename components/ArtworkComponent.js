import React, { useEffect, useState } from 'react';
import RenderCompositeNFT from './RenderCompositeNFT';

function ArtworkComponent({ artwork }) {
  
  // Render the artwork component
  return (
    <div>
      {<RenderCompositeNFT artwork={artwork} tokenId={tokenId} />}
    </div>
  );
}

export default ArtworkComponent;
