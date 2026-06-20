# Interface: File

Defined in: node\_modules/zod/v4/core/schemas.d.cts:828

Do not reference this directly.

## Extends

- `_File`

## Properties

### lastModified

> `readonly` **lastModified**: `number`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:14425

The **`lastModified`** read-only property of the File interface provides the last modified date of the file as the number of milliseconds since the Unix epoch (January 1, 1970 at midnight). Files without a known last modified date return the current date.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/File/lastModified)

#### Inherited from

`_File.lastModified`

***

### name

> `readonly` **name**: `string`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:14431

The **`name`** read-only property of the File interface returns the name of the file represented by a File object. For security reasons, the path is excluded from this property.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/File/name)

#### Inherited from

`_File.name`

***

### size

> `readonly` **size**: `number`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:830

The **`size`** read-only property of the Blob interface returns the size of the Blob or File in bytes.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/size)

#### Overrides

`_File.size`

***

### type

> `readonly` **type**: `string`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:829

The **`type`** read-only property of the Blob interface returns the MIME type of the file.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/type)

#### Overrides

`_File.type`

***

### webkitRelativePath

> `readonly` **webkitRelativePath**: `string`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:14437

The **`webkitRelativePath`** read-only property of the File interface contains a string which specifies the file's path relative to the directory selected by the user in an <input> element with its webkitdirectory attribute set.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/File/webkitRelativePath)

#### Inherited from

`_File.webkitRelativePath`

## Methods

### arrayBuffer()

> **arrayBuffer**(): `Promise`\<`ArrayBuffer`\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5056

The **`arrayBuffer()`** method of the Blob interface returns a Promise that resolves with the contents of the blob as binary data contained in an ArrayBuffer.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/arrayBuffer)

#### Returns

`Promise`\<`ArrayBuffer`\>

#### Inherited from

`_File.arrayBuffer`

***

### bytes()

> **bytes**(): `Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5062

The **`bytes()`** method of the Blob interface returns a Promise that resolves with a Uint8Array containing the contents of the blob as an array of bytes.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/bytes)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

#### Inherited from

`_File.bytes`

***

### slice()

> **slice**(`start?`, `end?`, `contentType?`): `Blob`

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5068

The **`slice()`** method of the Blob interface creates and returns a new Blob object which contains data from a subset of the blob on which it's called.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/slice)

#### Parameters

##### start?

`number`

##### end?

`number`

##### contentType?

`string`

#### Returns

`Blob`

#### Inherited from

`_File.slice`

***

### stream()

> **stream**(): `ReadableStream`\<`Uint8Array`\<`ArrayBuffer`\>\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5074

The **`stream()`** method of the Blob interface returns a ReadableStream which upon reading returns the data contained within the Blob.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/stream)

#### Returns

`ReadableStream`\<`Uint8Array`\<`ArrayBuffer`\>\>

#### Inherited from

`_File.stream`

***

### text()

> **text**(): `Promise`\<`string`\>

Defined in: node\_modules/typescript/lib/lib.dom.d.ts:5080

The **`text()`** method of the Blob interface returns a Promise that resolves with a string containing the contents of the blob, interpreted as UTF-8.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/text)

#### Returns

`Promise`\<`string`\>

#### Inherited from

`_File.text`
