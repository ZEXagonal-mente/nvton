# NVTON - Novout Object Notation

<h3 align="center">
<b>A key-value management focused in compatible with other format data files and a minimal reabiliable components.</b>
<h3>

<p align="center">
  <a href="https://github.com/Novout/nvton"><img src="https://img.shields.io/github/license/Novout/nvton?style=for-the-badge&color=DAE8F3&label="></a>
  <a href="https://github.com/Novout/nvton"><img src="https://img.shields.io/github/package-json/v/Novout/nvton?style=for-the-badge&color=DAE8F3&label="></a>
<p>

## Features

- ✅ Vue and Nuxt Plugin
- ✅ Local or File Object
- ✅ Support JSON
- ✅ Exclude Wrong Data
- ✅ Supports Node v20+

## Syntax

```ts
[
  'foo',
  true,
  undefined,
  0,
  nan,
  infinity,
  -infinity,
  { foo: 0 },
  [
    ['key1' | 'value'],
    ['key2' | 0],
    ['key3' | false], 
    [4 | null],
    ['key5' | { bar: 0 }]
  ]
]
```

## Install

`npm install -D nvton`
`yarn add nvton`
`pnpm add nvton`
`bun add nvton`

## Config

#### Use local config (nvton.config.ts)

```ts
export default {
  // config here
}
```

#### Use specific config in code

```ts
//...
const nvt = nvton('[0]', { 'config': 'here' })
//...
```


#### Default Config

```ts
{
  merge: {
    number: false
    object: false,
  },
  warnings: {
    wrongKey: false,
  }
}
```
## Use

### get

```ts
const nvt = nvton('[0, 1, [["key" | "value"], ["test" | "test"]], 2]')

// 0
console.log(nvt.get(0))

// "value"
console.log(nvt.get('key'))
```

### format

```ts
//...
const nvt = nvton('[0, 1, [["key" | "value"], ["test" | "test"]], 2]')

// "[0, 1, [["key" | "value"], ["test" | "test"]], 2]"
console.log(nvt.format())
```