# sqlsimplecipher
Encrypt and decrypt SQLite databases without SQLCipher installed

Based on [bssthu/pysqlsimplecipher](https://github.com/bssthu/pysqlsimplecipher)

## Installation
`npm install sqlsimplecipher`

## API
### .decrypt
Decrypts an encrypted database contained inside a Buffer
```js
sqlsimplecipher.decrypt(buffer: Buffer, password: string, configuration: SQLCipherConfiguration): Buffer;
sqlsimplecipher.decrypt(buffer: Buffer, key: Buffer, configuration: SQLCipherConfiguration): Buffer;
```

### .decryptFile
Decrypts an encrypted database file and stores it in the file system
```js
sqlsimplecipher.decryptFile(path: string, password: string, configuration: SQLCipherConfiguration): void;
sqlsimplecipher.decryptFile(path: string, key: Buffer, configuration: SQLCipherConfiguration): void;
sqlsimplecipher.decryptFile(inputPath: string, outputPath: string, password: string, configuration: SQLCipherConfiguration): void;
sqlsimplecipher.decryptFile(inputPath: string, outputPath: string, key: Buffer, configuration: SQLCipherConfiguration): void;
```

### .encrypt
Encrypts a database contained inside a Buffer
```js
sqlsimplecipher.encrypt(buffer: Buffer, password: string, configuration: SQLCipherConfiguration): Buffer;
sqlsimplecipher.encrypt(buffer: Buffer, key: Buffer, configuration: SQLCipherConfiguration): Buffer;
```

### .encryptFile
Encrypts a database file and stores it in the file system
```js
sqlsimplecipher.encryptFile(path: string, password: string, configuration: SQLCipherConfiguration): void;
sqlsimplecipher.encryptFile(path: string, key: Buffer, configuration: SQLCipherConfiguration): void;
sqlsimplecipher.encryptFile(inputPath: string, outputPath: string, password: string, configuration: SQLCipherConfiguration): void;
sqlsimplecipher.encryptFile(inputPath: string, outputPath: string, key: Buffer, configuration: SQLCipherConfiguration): void;
```

### SQLCipherConfiguration
```js
{
	kdf_iterations: number,
	kdf_algorithm: "sha1" | "sha256" | "sha512",
	hmac_algorithm: "sha1" | "sha256" | "sha512"
}
```