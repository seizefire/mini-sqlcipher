const fs = require("fs");
const crypto = require("crypto");

const reserveSizes = {
	sha1: 36,
	sha256: 48,
	sha512: 80
};

function encrypt(raw, key, iv){
	var c = crypto.createCipheriv("aes-256-cbc", key, iv)
	c.setAutoPadding(false);
	return Buffer.concat([c.update(raw), c.final()]);
}
function decrypt(enc, key, iv){
	var dc = crypto.createDecipheriv("aes-256-cbc", key, iv);
	dc.setAutoPadding(false);
	return Buffer.concat([dc.update(enc), dc.final()]);
}
function generateHMAC(content, key, i, algorithm){
	var h = crypto.createHmac(algorithm, key);
	h.update(content);
	h.update(Buffer.from([i%256,Math.floor(i/256)%256,Math.floor(i/65536)%256,Math.floor(i/16777216)%256]));
	return h.digest();
}
function checkDatabaseHeader(buffer, minimum_reserve_size){
	if(buffer.slice(0,16).toString() != "SQLite format 3\0"){
		throw new Error("Corrupted header");
	}
	var page_size = (buffer[16] == 0 && buffer[17] == 1) ? 65536 : (buffer[16] * 256 + buffer[17]);
	var reserve_size = buffer[20];
	if(page_size < 512 || page_size > 65536 || Math.log2(page_size) % 1 != 0){
		throw new Error("Invalid database page size");
	}
	if(reserve_size % 16 != 0){
		throw new Error("Invalid database reserve size");
	}
	if(reserve_size < minimum_reserve_size){
		throw new Error("Not enough reserve space");
	}
	return page_size;
}
function decryptFirstPage(raw, key, reserve_size){
	var max_page_size = 512;
	while((raw.length / 2) % max_page_size == 0 && max_page_size < 65536){
		max_page_size *= 2;
	}
	for(let temp_page_size = 512; temp_page_size <= max_page_size; temp_page_size *= 2){
		let data = decrypt(raw.slice(16, 32), key, raw.slice(temp_page_size - reserve_size, temp_page_size - reserve_size + 16))
		if(temp_page_size === (data[0] == 0 && data[1] == 1 ? 65536 : (data[0] * 256 + data[1])) && data[5] === 64 && data[6] === 32 && data[7] === 32){
			return temp_page_size;
		}
	}
	throw new Error("Failed to decide page size and reserve size");
}

module.exports = {
	decrypt(buffer, password, configuration){
		var salt = buffer.slice(0, 16);
		var key = password;
		if(typeof key == "string"){
			key = crypto.pbkdf2Sync(password, salt, configuration.kdf_iterations, 32, configuration.kdf_algorithm);
		}
		var hmacKey = crypto.pbkdf2Sync(key, salt.map(v=>v^58), 2, 32, configuration.kdf_algorithm);
		var minimumReserveSize = reserveSizes[configuration.hmac_algorithm];
		var reserve_size = Math.ceil(minimumReserveSize / 16) * 16;
		var page_size = decryptFirstPage(buffer, key, reserve_size);
		var newBuffer = Buffer.alloc(buffer.length);
		newBuffer.write("SQLite format 3\0");
		for(let i = 0; i < buffer.length / page_size; ++i){
			let index = (page_size * i) || 16;
			let page = buffer.slice(index, page_size * (i + 1));
			let content = page.slice(0, -reserve_size);
			let iv = page.slice(-reserve_size, 16 - reserve_size);
			let oldHmac = page.slice(16 - reserve_size, page.length + minimumReserveSize - reserve_size);
			let newHmac = generateHMAC(page.slice(0, 16 - reserve_size), hmacKey, i + 1, configuration.hmac_algorithm);
			if(oldHmac.compare(newHmac) != 0){
				throw new Error("HMAC check failed at page "+(i+1));
			}
			newBuffer.set(decrypt(content, key, iv), index);
			newBuffer.set(crypto.randomBytes(reserve_size), index + content.length);
		}
		return newBuffer;
	},
	decryptFile(){
		if(arguments.length === 3){
			fs.writeFileSync(arguments[0], this.decrypt(fs.readFileSync(arguments[0]), arguments[1], arguments[2]));
		}else{
			fs.writeFileSync(arguments[1], this.decrypt(fs.readFileSync(arguments[0]), arguments[2], arguments[3]));
		}
	},
	encrypt(buffer, password, configuration){
		var salt = crypto.randomBytes(16);
		var minimumReserveSize = reserveSizes[configuration.hmac_algorithm];
		var reserve_size = Math.ceil(minimumReserveSize / 16) * 16;
		var page_size = checkDatabaseHeader(buffer, reserve_size);
		var key = password;
		if(typeof key == "string"){
			key = crypto.pbkdf2Sync(password, salt, configuration.kdf_iterations, 32, configuration.kdf_algorithm);
		}
		var hmacKey = crypto.pbkdf2Sync(key, salt.map(v=>v^58), 2, 32, configuration.kdf_algorithm);
		var newBuffer = Buffer.alloc(buffer.length);
		newBuffer.set(salt, 0);
		for(var i = 0; i < buffer.length / page_size; ++i){
			let index = (page_size * i) || 16;
			let page = buffer.slice(index, page_size * (i + 1));
			let content = page.slice(0, -reserve_size);
			let iv = crypto.randomBytes(16);
			let enc = Buffer.concat([encrypt(content, key, iv), iv]);
			let hmac = generateHMAC(enc, hmacKey, i + 1, configuration.hmac_algorithm);
			newBuffer.set(enc, index);
			newBuffer.set(hmac, index + enc.length);
			if(reserve_size !== minimumReserveSize){
				newBuffer.set(crypto.randomBytes(reserve_size - hmac.length - 16), index + enc.length + hmac.length);
			}
		}
		return newBuffer;
	},
	encryptFile(){
		if(arguments.length === 3){
			fs.writeFileSync(arguments[0], this.encrypt(fs.readFileSync(arguments[0]), arguments[1], arguments[2]));
		}else{
			fs.writeFileSync(arguments[1], this.encrypt(fs.readFileSync(arguments[0]), arguments[2], arguments[3]));
		}
	},
	SQLCIPHER3: {kdf_iterations: 64000, kdf_algorithm: "sha1", hmac_algorithm: "sha1"},
	SQLCIPHER4: {kdf_iterations: 256000, kdf_algorithm: "sha512", hmac_algorithm: "sha512"}
};