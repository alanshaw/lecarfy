# lecarfy

A CAR file creator/formatter that creates CAR files with leaf blocks appearing first, in depth first traversal order.

Given the following DAG:

```
              r
              |
      +-------1-------+
      |               |
  +---2---+       +---9---+
  |       |       |       |
+-3-+   +-6-+   +-a-+   +-d-+
|   |   |   |   |   |   |   |
4   5   7   8   b   c   e   f
```

This library will create a CAR with blocks arranged in the following order:

4,5,7,8,b,c,e,f,r,1,2,9

When the root block (r) is encountered there are no more leaves in the DAG.

## Install

```sh
npm install lecarfy
```

## Usage

```js
import { format } from 'lecarfy'
import { CarReader } from '@ipld/car'

const car = await CarReader.fromBytes(/* ...CAR file bytes... */)
const [rootCid] = await car.getRoots()

const formattedCar = format(rootCid, car)

for await (const bytes of formattedCar) {
  // bytes is a Uint8Array
}
```

## API

### `format (root: CID, blocks: BlockGetter): AsyncIterable<Uint8Array>`

Format the passed DAG rooted by the passed CID in the lecarfy style. The `blocks` parameter is an object that implements a method `get (key: CID): Promise<Block | undefined>` so does not _have_ to be a `CarReader`.

### `decoders: BlockDecoder<any, any>[]`

The included IPLD decoders are `dag-pb`, `dag-json` and `raw`. Push onto this array to add decoders.

## Contribute

Feel free to dive in! [Open an issue](https://github.com/alanshaw/lecarfy/issues/new) or submit PRs.

## License

Dual-licensed under [MIT + Apache 2.0](https://github.com/alanshaw/lecarfy/blob/main/LICENSE.md)
