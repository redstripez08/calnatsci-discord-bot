const fs = require("fs");
const path = require("path");

/**
 * @typedef EncodingOptions
 * @type {"ascii"|"base64"|"binary"|"hex"|"latin1"|"ucs-2"|"ucs2"|"utf-8"|"utf16le"|"utf8"}
 */

 /**
  * @callback FileCallback
  * @param  {Error}             err     Error
  * @param  {String|Buffer}     data    Data
  */

/**
 * @typedef FileOptions    Options for the File class
 * @type {Object}
 * 
 * @property    {EncodingOptions}   [encoding="utf-8"]      Encoding of the file. Defaults to UTF8
 * @property    {String}            [flags]                 Accepted flags        
 */

/** Represents a file instance. Supports promises and callbacks */
class File {
    /**
     * Creates a file instance, using promises instead of callbacks.
     * @param   {!String}       path              Directory of the file.
     * @param   {FileOptions}   [fileOptions]     Options for the file.
     */
    constructor(path, fileOptions) {
        if (!path || typeof path !== "string") return console.error(new Error("Path Required!"));
        if (!fileOptions || !fileOptions.encoding) fileOptions.encoding = "utf-8";

        this.path = path;
        this.fileOptions = fileOptions;
    }

    /**
     * Writes into file.
     * @param   {String|Buffer}     content                                 Content to write into file
     * @param   {String}            [encoding=this.fileOptions.encoding]    Encoding of the content
     * @param   {FileCallback}      callback                                Callback
     * @returns {Promise<void>}             Void Promise
     */
    async writeFile(content, encoding = this.fileOptions.encoding, callback) {
        try {
            const data = await fs.promises.writeFile(this.path, content, {encoding});
            if (callback && typeof callback === "function") return callback(null, data);
            return Promise.resolve(data);
        } catch (error) {
            if (callback && typeof callback === "function") return callback(error);
            return Promise.reject(error);
        }
    }

    /**
     * Writes into file synchronously.
     * @param   {String|Buffer} content     Content to write into file
     * @param   {String}        encoding    Encoding of the content
     * @returns {Void}
     */
    writeFileSync(content, encoding) {
        fs.writeFileSync(this.path, content, {encoding});
    }

    /**
     * Asynchronously reads the entire contents of a file.
     * @param   {EncodingOptions}                   [encoding=this.fileOptions.encoding]    Returned encoding of File. `UTF-8` by default.
     * @returns {Promise<String>|Promise<Object>}                                           Promise of a String or Object
     */
    async readFile(encoding = this.fileOptions.encoding) {
        try {
            const data = await fs.promises.readFile(this.path, {encoding});
            return Promise.resolve(data);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Reads the file and returns its content synchronously
     * @param {EncodingOptions}                     encoding 
     */
    readFileSync(encoding = this.fileOptions.encoding) {
        try {
            return fs.readFileSync(this.path, {encoding});
        } catch (error) {
            return new Error(error);
        }
    }

    /**
     * Returns a new `ReadStream` object.
     * @returns {fs.ReadStream}
     */
    createReadStream() {
        return new fs.ReadStream(this.path, {encoding});
    }

}

module.exports = File;