# iniparser-js

An iniparser.

## Examples

an example of a valid `.ini` file
```ini
# an example of valid .ini file, and this is a valid comment
; this is also a valid comment

; no section options must be exists before any sections defined
config = default ; this is a valid option
no_value ; "no_value" value is null

[main] ; this is a valid section
; options inside "main" section
name = amogus
age = 42069

```

read `.ini` file
```js
var fs = require("fs");
var iniparser = require("@hugebrain16/iniparser");

var content = fs.readFileSync("example.ini", "utf8");
const result = iniparser.parse(content);

console.log(result);
```
