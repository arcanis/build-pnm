# build-pnm

> Experimental [package-name-maps](https://github.com/domenic/package-name-maps) generator

[![npm version](https://img.shields.io/npm/v/build-pnm.svg)](https://www.npmjs.com/package/build-pnm)
[![node version](https://img.shields.io/node/v/build-pnm.svg)](https://www.npmjs.com/package/build-pnm)

## Installation

```
yarn add -D build-pnm
```

## Usage

Simply add a postinstall script that runs the `build-pnm` binary, then run `yarn` again (note that you need to have Plug'n'Play enabled - in case you haven't enabled it already, just use `--pnp` the next time you run Yarn; you won't have to do it again afterwards):

```
{
  "devDependencies": {
    "build-pnm": "*",
  },
  "scripts": {
    "postinstall": "build-pnm"
  }
}
```

It will automatically generate a suitable `package-name-maps.json` file in the local directory.

## License (MIT)

> **Copyright © 2016 Maël Nison**
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
