type SQLCipherHashAlgorithm = "sha1" | "sha256" | "sha512";
type SQLCipherConfiguration = {
	kdf_iterations: number,
	kdf_algorithm: SQLCipherHashAlgorithm,
	hmac_algorithm: SQLCipherHashAlgorithm
}

/** The default configuration for SQLCipher 3 */
export const SQLCIPHER3 : SQLCipherConfiguration;
/** The default configuration for SQLCipher 4 */
export const SQLCIPHER4 : SQLCipherConfiguration;

/**
 * Decrypts a database
 * @param buffer The database's contents
 * @param password The password
 * @param configuration The configuration
 * @returns The decrypted database's contents
 */
export function decrypt(buffer: Buffer, password: string, configuration: SQLCipherConfiguration): Buffer;
/**
 * Decrypts a database
 * @param buffer The database's contents
 * @param key The raw key
 * @param configuration The configuration
 * @returns The decrypted database's contents
 */
export function decrypt(buffer: Buffer, key: Buffer, configuration: SQLCipherConfiguration): Buffer;
/**
 * Decrypts a database file
 * @param path The database's path
 * @param password The password
 * @param configuration The configuration
 */
export function decryptFile(path: string, password: string, configuration: SQLCipherConfiguration): void;
/**
 * Decrypts a database file
 * @param path The database's path
 * @param key The raw key
 * @param configuration The configuration
 */
export function decryptFile(path: string, key: Buffer, configuration: SQLCipherConfiguration): void;
/**
 * Decrypts a database file
 * @param inputPath The encrypted database's path
 * @param outputPath The path to store the decrypted database
 * @param password The password
 * @param configuration The configuration
 */
export function decryptFile(inputPath: string, outputPath: string, password: string, configuration: SQLCipherConfiguration): void;
/**
 * Decrypts a database file
 * @param inputPath The encrypted database's path
 * @param outputPath The path to store the decrypted database
 * @param key The raw key
 * @param configuration The configuration
 */
export function decryptFile(inputPath: string, outputPath: string, key: Buffer, configuration: SQLCipherConfiguration): void;

/**
 * Encrypts a database
 * @param buffer The database's contents
 * @param password The password
 * @param configuration The configuration
 * @returns The encrypted database's contents
 */
export function encrypt(buffer: Buffer, password: string, configuration: SQLCipherConfiguration): Buffer;
/**
 * Encrypts a database
 * @param buffer The database's contents
 * @param key The raw key
 * @param configuration The configuration
 * @returns The encrypted database's contents
 */
export function encrypt(buffer: Buffer, key: Buffer, configuration: SQLCipherConfiguration): Buffer;
/**
 * Encrypts a database file
 * @param path The database's path
 * @param password The password
 * @param configuration The configuration
 */
export function encryptFile(path: string, password: string, configuration: SQLCipherConfiguration): void;
/**
 * Encrypts a database file
 * @param path The database's path
 * @param key The raw key
 * @param configuration The configuration
 */
export function encryptFile(path: string, key: Buffer, configuration: SQLCipherConfiguration): void;
/**
 * Encrypts a database file
 * @param inputPath The database's path
 * @param outputPath The path to store the encrypted database
 * @param password The password
 * @param configuration The configuration
 */
export function encryptFile(inputPath: string, outputPath: string, password: string, configuration: SQLCipherConfiguration): void;
/**
 * Encrypts a database file
 * @param inputPath The database's path
 * @param outputPath The path to store the encrypted database
 * @param key The raw key
 * @param configuration The configuration
 */
export function encryptFile(inputPath: string, outputPath: string, key: Buffer, configuration: SQLCipherConfiguration): void;