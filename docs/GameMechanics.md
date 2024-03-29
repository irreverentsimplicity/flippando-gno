### Game Mechanics

The user is presented with a square matrix, which must be "uncovered". Each matrix is made of pairs of different visual shapes and colors. In this demo, we have 3 different tile types: colors, dice and hexagrams. In future versions we will use more basic geometric shapes (circle, square, triangle, hexagon), letters, logos (in sponsored games), etc. 

User taps two distinct, uncovered yet squares. A request is sent to the blockchain, which alters the state of the smart contract. The app has set up a listener for this specific state change (name of event: `GameState`); When the app received the emitted event, two things can happen:

- if the squares are identical (same shape and color), they remain uncovered
- if the squares are different (different shape and color), they are briefly presented to the user, then they are flipped back to "uncovered" state. 

In both cases, the state is persisted on chain.

As the game advances, when there are only `sqrt(boardSize)` tiles uncovered (e.g.: boardSize is 16, so we have a 4x4 matrix, when we have only 4 tiles uncovered) the logic changes. This can be seen in the UI by displaying a string like: "Flippando is heating, entering unstable quantum state". From now on, each request will return a matching pair of tiles, so the last two requests are always solving the game. The caveat here is that, if any of these squares has been uncovered before, its color might change when the tile is "solved".

After the entire matrix is solved, it is turned into an on-chain NFT (Base64 encoding it into the abi, using SVG). Along with the NFT minting, an ERC 20 token, called "Flip", is also minted, and it's associated with the NFT, by being "locked" into it. The ERC20 token cannot be spent unless it's unlockecd. We will see later on how it can be unlocked. This NFT/ERC20 token pair is what we call a "primitive" for the rest of the game functionality.

## Levels

The game starts with a 4x4 matrix. After uncovering 8 such matrixes, the game advances to the next level, which uses 8x8 matrixes (64 tiles). 

## Goal

The goal of the game is to generate NFT primitives, or basic shapes that can be then assembled in on-chain art. Each NFT can be sold in a marketplace, so people looking for a specific combination needed for their digital painting can buy it, if it was already generated by someone else. Or they can choose to play the game again and again, until randomness will generate their specific tile.

A buying event will break the level logic. For instance, if someone buys one of your 8 level 1 matrixes, you will be left with only 7, so yo need to generate a new one before being able to play at level 2 or 3.

Assembling NFT primitives in larger, more complex creations, unlocks the ERC20 token. In other words, every time one of the basic NFTs, created by solving a matrix, is solved, its "locked" ERC20 token is unlocked and sent to the creator of the basic NFT. There's a caveat: you cannot use your own basic NFTs to create art, you must use other people assets, unlocking the tokens for them.

The resulting, "art" NFT, can be solved in a normal NFT marketplace. At the moment of the writing of this document, the actual NFT display is using a proprietary approach. A normal marketplace will not see the combined NFTs, but a placeholder. This is by design. As we stabilize our composite NFT structure, we may use other ways.

## Randomness

Although the game proposition is that we have to uncover a matrix, the matrix starts empty. There is no pre-generated matrix that the user can inspect by looking up the smart contract variables. Instead, we generate random numbers on each request (in the matrix interval: so, if we have a 4x4 matrix, we only use 4 shapes, so we generate random numbers in the 1 - 4 interval). 

This approach reduces the possibility of cheating and validates each generated NFT as PoA (Proof of Attention).