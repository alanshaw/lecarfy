import test from 'ava'
import { CarReader } from '@ipld/car'
import fs from 'fs'
import * as uint8arrays from 'uint8arrays'
import { format } from './index.js'

// The DAGs in these fixtures have been created with `ipfs add --cid-version=1`
// which means they have raw leaf nodes.
['small.jpg', 'medium.jpg', 'large.mp4'].forEach(filename => {
  test(`should format ${filename}`, async t => {
    const fileBytes = await fs.promises.readFile(`./fixtures/${filename}`)
    const path = `./fixtures/${filename}.car`
    const car = await CarReader.fromIterable(fs.createReadStream(path))
    const [root] = await car.getRoots()
    const fcar = format(root, car)
    const blockBytes = await readBytes(root, fcar)
    t.true(uint8arrays.equals(blockBytes, fileBytes))
  })
})

/**
 * Read the leaf bytes of a lecarfy formatted CAR file.
 *
 * @param {import('multiformats').CID} root
 * @param {AsyncIterable<Uint8Array>} car
 */
async function readBytes (root, car) {
  const chunks = []
  const reader = await CarReader.fromIterable(car)
  for await (const block of reader.blocks()) {
    if (block.cid.equals(root)) {
      // if no other leaves, then the root is the leaf
      if (!chunks.length) {
        chunks.push(block.bytes)
      }
      break
    }
    chunks.push(block.bytes)
  }
  return uint8arrays.concat(chunks)
}
