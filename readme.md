# filedump

Store files, buffers or readble streams in the filesystem with an automatically generated random filename and divided in folders to circument file system limitations. 

## Install

````
npm install filedump
````

## Usage

```` javascript
var filedump = require("filedump")("/path/to/storage", 20);

/* file in the filesystem */
filedump.save("/some/file.ext", function(err, filename){
	if (err) return console.error(err);
	console.log(filename);
});

/* buffer */
filedump.save(new Buffer("data"), "txt", function(err, filename){
	if (err) return console.error(err);
	console.log(filename);
});

/* readble stream */
var rs = require("fs").createReadStream("/some/file.ext");
filedump.save(ts, "txt", function(err, filename){
	if (err) return console.error(err);
	console.log(filename);
});
````

## API

### filedump(path, len)

* `path` points to the folder where the files are stored
* `len` is the length of the random generated string the directories and file name is derived from

### filedump.save(data, [ext], callback)

Save data and call back with filename when file is written

* `data` can be a file path, buffer or readble stream
* `ext` is the file extention for the generated file. this is automatically determined when the first argument is a file path
* `callback` has `err` and `filename` as arguments

### filedump.dump(data, [ext], callback)

Save data and call back with filename _before_ file is written and _without error reporting_

* `data` can be a file path, buffer or readble stream
* `ext` is the file extention for the generated file. this is automatically determined when the first argument is a file path
* `callback` has `err` and `filename` as arguments

### filedump.prepare([ext], callback)

Generate random file name, create directories and call back with file name

* `ext` is the file extention for the generated file. this is automatically determined when the first argument is a file path
* `callback` has `err` and `filename` as arguments

## License

[Public Domain](http://unlicense.org/UNLICENSE)
