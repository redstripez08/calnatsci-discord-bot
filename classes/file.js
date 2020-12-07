const fs = require("fs");

/** Represents a file instance, but promisified. */
class File {
    /**
     * Creates a file instance, using promises instead of callbacks.
     * @param   {String}        path        Directory of file.
     */
    constructor(path) {
        this.path = path;
    }

    /**
     * Writes into file.
     * @param   {String}        content     Content to write into file
     * @returns {Promise<void>}             Void Promise
     */
    async write(content) {
        try {
            const lol = await fs.promises.writeFile(this.path, content);
            return Promise.resolve(lol);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Reads the file and returns its content.
     * @param   {Boolean}                           json        True by Default. If true, returns Object. Otherwise it returns String.
     * @param   {String}                            encoding    Returned encoding of File. `UTF-8` by default.
     * @returns {Promise<String>|Promise<Object>}               Promise of a String or Object
     */
    async read(json = true, encoding = "utf-8") {
        try {
            const data = await fs.promises.readFile(this.path, encoding);
            if (json) return Promise.resolve(JSON.parse(data));
            else return Promise.resolve(data);
        } catch (error) {
            return Promise.reject(error);
        }
    }

}

module.exports = File;
