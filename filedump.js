#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
var stream = require("stream");

module.exports = function(pth, len) {
	
	var t = this;	
		
	t.save = function(data, ext, callback) {
		
		if (typeof ext === "function") {
			var callback = ext;
			var ext = null;
		}

		/* try to determine file extension by file name */
		if (typeof data === "string" && typeof ext !== "string" && ext !== false) {
			var ext = path.extname(data);
			if (ext.length === 0 || ext.length > 16) ext = null;
		}
		
		/* replace leading dot in extension */
		if (typeof ext === "string") ext = ext.replace(/^\./,'');
		
		var filename = t.filename(ext);
				
		t.mkdir(path.resolve(t.path, path.dirname(filename)), function(err){
			
			if (err) return callback(err);
			
			if (typeof data === "string") {

				fs.exists(path.resolve(data), function(ex){
					
					if (!ex) return callback(new Error("`data` strings must be an existing file path"));
					
					fs.createReadStream(path.resolve(data)).pipe(fs.createWriteStream(path.resolve(t.path, filename)));
					
					callback(null, filename);
					
				});
				
				
			} else if (data instanceof Buffer) {
				
				fs.writeFile(path.resolve(t.path, filename), data, function(err){
					
					if (!err) return callback(err);
					
					callback(null, filename);
					
				});
				
			} else if (data instanceof stream.Readable) {
				
				data.pipe(fs.createWriteStream(path.resolve(t.path, filename)));
				
				callback(null, filename);
				
			} else {
				
				callback(new Error("`data` must be a filename, Buffer or readable stream"));

			}
			
		});
		
	}
	
	/* create directories recursively */
	t.mkdir = function(dir, callback) {
		if (typeof callback !== "function") var callback = function(){};
		var _dir = path.resolve(dir);
		fs.exists(_dir, function(exists){
			if (exists) {
				callback(null);
			} else {
				t.mkdir(path.dirname(_dir), function(err){
					if (err) {
						callback(err);
					} else {
						fs.mkdir(_dir, function(err){
							callback(err);
						});
					}
				});
			}
		});
	};
	
	/* generate a random filename */
	t.filename = function(ext) {
		var f = [];
		crypto.randomBytes(t.len).toString('hex').split('').forEach(function(c,i){
			f.push(c);
			if (i < 6 && i%3 === 2) f.push('/');
		});
		if (typeof ext === "string") f.push("."+(ext.toLowerCase()));
		f = f.join('');
		if (fs.existsSync(path.resolve(t.path, f))) {
			return t.filename(ext);
		}
		return f;
	}
	
	/* just create a filename */
	t.prepare = function(ext, callback){
		
		if (typeof ext === "function") {
			var callback = ext;
			var ext = null;
		}
		
		/* replace leading dot in extension */
		if (typeof ext === "string") ext = ext.replace(/^\./,'');
		
		var filename = t.filename(ext);
				
		t.mkdir(path.resolve(t.path, path.dirname(filename)), function(err){
			
			if (err) return callback(err);
			
			callback(null, filename);
			
		}
		
	};
	
	t.path = path.resolve(pth);
	t.len = (typeof len !== "number" || len < 8) ? 8 : len;
	
	t.mkdir(t.path);
	
	return t;
	
}