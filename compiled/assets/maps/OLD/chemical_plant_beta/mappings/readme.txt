This is the mapping in a .KOS file, it can be opened with a hex editor but maybe u can make a converter.

The CPZ_DEZ.kos file is essentially a mapping of chunks to blocks for Chemical Plant Zone Act 1. Each entry in the file represents a single 128×128 chunk, which itself is made up of a grid of 16×16 blocks (usually 8×8 blocks per chunk if each block is 16 pixels). The file is stored in row-major order, meaning the first series of bytes corresponds to the top row of blocks in the first chunk, then the second row, and so on, repeating for each chunk in sequence. Each byte (or value) is a block ID that references your 16×16 block data, which in turn contains the 8×8 tile graphics and collision mapping. To make this usable for another AI or engine, you would read the file as binary, parse it into a three-dimensional array like [chunkIndex][row][column] = blockID, and then combine it with the level layout file (which tells you which chunk goes where) and the block collision/angle data. This way, your AI can reconstruct the full level, knowing which block graphics to draw and how to apply slopes and physics for each block. The .kos file itself is just the hierarchy of block IDs per chunk, so once parsed, it’s straightforward to merge with the other extracted assets, like the blocks in the block file.

1. Read 128x128 chunk .kos
   → create array of chunks
   → each chunk = 8x8 blocks

2. Read 16x16 block .kos
   → assign pixel graphics per block

3. Read collision index .kos
   → map each blockID to a collision index

4. Read angle array + vertical/horizontal collision arrays
   → map each collision index to numeric angles and pixel-level solidity

5. Read level layout .kos
   → map chunks into the full level

6. Combine all
   → final data structure:
       level[y][x] → chunk → block → pixels + collision + angle
* tiles are very irrelevant, by the way.
