# babel-plugin-secure-number-coparison

## Usage

```json
{
  "plugins": [
    "secure-number-comparison"
  ]
}
```

## Example

```js
if (foo == 123) {/* ... */}
// to
if (Number(foo) === 123) {/* ... */}

if (123 != bar) {/* ... */}
// to
if (123 !== Number(bar)) {/* ... */}
```
