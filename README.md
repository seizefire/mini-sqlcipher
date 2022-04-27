# mini-sqlcipher
<img alt="npm" src="https://img.shields.io/npm/v/mini-sqlcipher?color=%23ff5555&label=NPM%20package&logo=npm"> <img alt="NPM" src="https://img.shields.io/npm/l/mini-sqlcipher?label=license">

Encrypt and decrypt SQLite databases without SQLCipher installed

Based on [bssthu/pysqlsimplecipher](https://github.com/bssthu/pysqlsimplecipher)

## Installation
`npm install mini-sqlcipher`

## Usage
### Encryption
There are three methods available for encrypting a database.
- `encrypt(buffer, password/key, configuration)`: Encrypts a raw Buffer
- `encryptFile(path, password/key, configuration)`: Encrypts a database file, then overwrites it
- `encryptFile(inputPath, outputPath, password/key, configuration)`: Encrypts a database file, and stores it in a separate file

Passwords should be passed as strings, while raw keys should be passed as strictly `Buffer`s. Additionally, the database must already have adequate reserve space in order to encrypt.

#### Examples
```js
var enc = MSC.encrypt(raw, "password", MSC.SQLCIPHER3);
MSC.encryptFile("database.db", "123456", MSC.SQLCIPHER4);
MSC.encryptFile("input.db", "output.db", "qwerty", MSC.SQLCIPHER3);
```


### Decryption
There are also three methods available for decrypting an encrypted database.
- `decrypt(buffer, password/key, configuration)`: Decrypts a raw Buffer
- `decryptFile(path, password/key, configuration)`: Decrypts a database file, then overwrites it
- `decryptFile(inputPath, outputPath, password/key, configuration)`: Decrypts a database file, and stores it in a separate file

Passwords should also be passed as strings, while raw keys should be passed as strictly `Buffer`s.

#### Examples
```js
var raw = MSC.decrypt(enc, "default", MSC.SQLCIPHER4);
MSC.decryptFile("database.db", "111111", MSC.SQLCIPHER3);
MSC.decryptFile("enc.db", "dec.db", "iloveyou", MSC.SQLCIPHER4);
```


### SQLCipher configurations
Configurations are required to have three specific values
- `kdf_iterations`: the number of iterations for deriving keys. Only useful when a password is given instead of a raw key.
- `kdf_algorithm`: the algorithm used for deriving keys. Also only useful when a password is given instead of a raw key.
- `hmac_algorithm`: the algorithm used for generating checksums of the database.

Supported algorithms are `sha1`, `sha256`, and `sha512`

**Example:** `{kdf_iterations: 20000, kdf_algorithm: "sha256", hmac_algorithm: "sha256"}`

There are pre-defined configurations available for use. `SQLCIPHER3` represents the default configuration for SQLCipher 3.x, and `SQLCIPHER4` represents the default configuration for SQLCipher 4.x.

**Example:** `MSC.SQLCIPHER4`
