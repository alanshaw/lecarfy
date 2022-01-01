import type { CID } from 'multiformats'
import type { BlockDecoder } from 'multiformats/codecs/interface'

interface Block {
  cid: CID
  bytes: Uint8Array
}

interface BlockGetter {
  get (key: CID): Promise<Block | undefined>
}

declare function format (root: CID, blocks: BlockGetter): AsyncIterable<Uint8Array>

type decoders = BlockDecoder<any, any>[]

export { format, decoders, CID, Block, BlockGetter }
