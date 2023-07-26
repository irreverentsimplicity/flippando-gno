package flippando

import (
	"fmt"
	"math/rand"
)

type game struct {
	owner     string
	gameId    string
	board     []int
	tileType  string
	gameTiles []int
	boardSize int
	status    string
}

// owner - 'address', gameId - 'string', board - [int], tileType - 'coloredSquare', 'dice', 'hexagram', gameTiles - [int], boardSize - {4, 8}, status - 'created | ongoing | solved'

type positions struct {
	position1 int
	position2 int
}

// position1 - int, postion2 - int

type inTransit struct {
	tokenId   int
	inTransit bool
}

// tokenId - int, inTransit, bool

// creates game object and initializes board
func startGame(owner string, gameId string, tileType int, boardSize int) string {
}

func flipTiles(gameId string, positions positions) {
	//   - returns the tiles at the positions[] in the board array
	//   - updates the game[gameId].board with the indices at positions
}

func createNFT(gameId string) {
	// - generates a GRC721 token with the solved board SVG as a tokenURI
}

func makeArt(owner string, buildingBlocks []int) {
	// - checks if any of the tokenIds in the buildingBlocks[] are belonging to the user (not allowed)
	// - checks if any of the tokenIds in the buildingBlocks[] are in transit
	// - unlocks and sends the locked Flips in each used NFT
	// - transfers the NFTs to the new owner (the art creator)
	// - calls FlippandoBundler.bundleAssets() to generate a new GRC721 NFT with a standard tokenURI, and the tokenIds of the used NFT primitives
}

func resetGame(gameId string) {
	//- utility function, nullifies the game[gameId]
}

func boardHasZeroValues(gameId string) {
	// - utility function, checks for existing zeros in the board (game is ongoing) // do we still need this?
}

func generateRandomNumbers(num, start, end int) []int {
	if start > end {
		start, end = end, start // Ensure the range is in ascending order
	}

	if num < 0 {
		fmt.Println("The number of random values (num) must be non-negative")
		return nil
	}

	if num > end-start+1 {
		fmt.Println("The number of random values (num) cannot exceed the range size")
		return nil
	}

	// Seed the random number generator with the current time
	rand.Seed(123)

	// Generate num unique random values within the range
	result := make([]int, 0, num)
	for len(result) < num {
		randomValue := rand.Intn(end-start+1) + start

		// Check if the value already exists in the result slice
		// If not, append it to the result slice
		unique := true
		for _, val := range result {
			if val == randomValue {
				unique = false
				break
			}
		}

		if unique {
			result = append(result, randomValue)
		}
	}

	return result
}

func isValidGameLevel(boardSize int) {
	// - utility function, checks valid game levels
}

func isValidGameType(tileType string) {
	//   - utility function, checks valid tile types
}
