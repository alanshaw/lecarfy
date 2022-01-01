import * as raw from 'multiformats/codecs/raw'
import * as cbor from '@ipld/dag-cbor'
import * as pb from '@ipld/dag-pb'
import { Block } from 'multiformats/block'
import { CarWriter } from '@ipld/car'

export const decoders = [raw, pb, cbor]

/** @type {import('./index').format} */
export function format (root, blocks) {
  const { writer, out } = CarWriter.create(root)
  let error

  ;(async function () {
    try {
      const cids = [root]
      const nonLeafBlocks = []
      while (true) {
        const cid = cids.shift()
        if (!cid) break
        const block = await decodeBlock(cid, blocks)
        let hasLinks = false
        for (const [, cid] of block.links()) {
          hasLinks = true
          cids.unshift(cid)
        }
        if (hasLinks) {
          nonLeafBlocks.push(block)
        } else {
          await writer.put(block)
        }
      }
      for (const block of nonLeafBlocks) {
        await writer.put(block)
      }
    } catch (err) {
      error = err
    } finally {
      await writer.close()
    }
  })()

  return (async function * () {
    for await (const chunk of out) {
      if (error) break
      yield chunk
    }
    if (error) {
      throw error
    }
  })()
}

async function decodeBlock (cid, blocks) {
  const rawBlock = await blocks.get(cid)
  if (!rawBlock) throw new Error(`missing block: ${cid}`)
  const { bytes } = rawBlock
  const decoder = decoders.find(d => d.code === cid.code)
  if (!decoder) throw new Error(`missing decoder: ${cid.code}`)
  return new Block({ cid, bytes, value: decoder.decode(bytes) })
}
