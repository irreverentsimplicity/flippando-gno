
struct game: {
    owner, 
    gameId, 
    board,
    tileType, 
    gameTiles, 
    boardSize, 
    status
}  
// owner - 'address', gameId - 'string', board - [int], tileType - 'coloredSquare', 'dice', 'hexagram', gameTiles - [int], boardSize - {4, 8}, status - 'created | ongoing | solved'

struct positions : {
    position1, 
    position2
}
// position1 - int, postion2 - int

struct inTransit : {
    tokenId,
    inTransit
}
// tokenId - int, inTransit, bool


// creates game object and initializes board
funct startGame(ownwer string, gameId string, tileType int, boardSize int) string {

}

flipTiles(gameId, positions) 
    - returns the tiles at the positions[] in the board array
    - updates the game[gameId].board with the indices at positions

createNFT(gameId) - generates a GRC721 token with the solved board SVG as a tokenURI

makeArt(owner, buildingBlocks[]) 
    - checks if any of the tokenIds in the buildingBlocks[] are belonging to the user (not allowed)
    - checks if any of the tokenIds in the buildingBlocks[] are in transit
    - unlocks and sends the locked Flips in each used NFT
    - transfers the NFTs to the new owner (the art creator)
    - calls FlippandoBundler.bundleAssets() to generate a new GRC721 NFT with a standard tokenURI, and the tokenIds of the used NFT primitives
    

resetGame(gameId) - utility function, nullifies the game[gameId]

boardHasZeroValues(gameId) - utility function, checks for existing zeros in the board (game is ongoing) // do we still need this?

generateRandomNumbers(range, count) - generates count random numbers inside the range interval

isValidGameLevel(boardSize) - utility function, checks valid game levels

isValidGameType(tileType) - utility function, checks valid tile types