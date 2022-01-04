# lecarfy

[![Build](https://github.com/alanshaw/lecarfy/actions/workflows/main.yml/badge.svg)](https://github.com/alanshaw/lecarfy/actions/workflows/main.yml)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/lecarfy)](https://bundlephobia.com/package/lecarfy)

A CAR file creator/formatter that creates CAR files with leaf blocks appearing first, in depth first traversal order.

Given the following DAG:

```
      +-------R-------+
      |               |
  +---1---+       +---8---+
  |       |       |       |
+-2-+   +-5-+   +-9-+   +-c-+
|   |   |   |   |   |   |   |
3   4   6   7   a   b   d   e
```

This library will create a CAR with blocks arranged in the following order:

3,4,6,7,a,b,d,e,R,1,2,5,8,9,c

When the root block (R) is encountered there are no more leaves in the DAG.

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
