# streamlineify

[![Version npm](http://img.shields.io/npm/v/streamlineify.svg?style=flat-square)](http://browsenpm.org/package/streamlineify)
[![Dependencies](https://img.shields.io/david/tellnes/streamlineify.svg?style=flat-square)](https://david-dm.org/tellnes/streamlineify)

Streamline transform for browserify.

## Installation

```bash
npm install streamlineify
```

## Usage

```bash
browserify -t streamlineify src/main.js
```

or

```js
var b = browserify()
b.transform(require('streamlineify'), { promise: true })

```

#### Options

Valid streamline options are:

- `cb`
- `promise`
- `old-style-futures`

## [MIT Licensed](LICENSE)
