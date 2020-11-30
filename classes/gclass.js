const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.cryptrKey);

/** Represents Gclass Section i guess */
class Gclass {
    static #classroom;

    /**
     * Creates a Google Classroom Instance.
     * @param   {Object}            subjectParams           Set of Subject Parameters
     * @param   {String|Number}     subjectParams.id        ID of Google Class Course
     * @param   {String}            subjectParams.name      Name of Google Class Course
     * @param   {String}            subjectParams.color     Color of Google Class Course
     */
    constructor(subjectParams) {
        // Checks if Google Classroom has been authorized. Throws error if not.
        if (!Gclass.#classroom) throw new Error("You need to authorize Gclass First!");
        // Checks for Subject ID and Subject Name.
        if (!subjectParams) throw new Error("Subject Parameters required!");
        if (!subjectParams.id) throw new Error("Subject ID required!");
        if (!subjectParams.name) throw new Error("Subject Name required!");
        // Checks if Subject ID is a string or number. Throws error if not.
        if (typeof subjectParams.id !== "string" && typeof subjectParams.id !== "number") 
        throw new Error("Not a valid Subject ID!");

        // Converts Subject ID to a string.
        subjectParams.id = subjectParams.id.toString();
        // Checks if string is composed solely of digits.
        if (!/\d+/.test(subjectParams.id)) throw new Error("Not a valid Subject ID!");
 
        this.subjectId = subjectParams.id;
        this.subjectName = subjectParams.name;
        this.subjectColor = subjectParams.color;
    }
    
    /**
     * Gets aliases of specified course.
     * @param   {Number}                pageSize        Number of Aliases to return. Defaults to 5.
     * @returns {Promise<Object[]>}                     List of Aliases           
     */
    async getAliases(pageSize = 5) {
        try {
            const params = {courseId: this.subjectId, pageSize};
            const { data } = await Gclass.#classroom.courses.aliases.list(params);
            return Promise.resolve(data);
        } catch (error) {
            return Promise.reject(error);
        }
    }
    
    /**
     * Gets announcements of specified course.
     * @param   {Number}                pageSize        Number of Announcements to return. Defaults to 5.
     * @returns {Promise<Object[]>}                     List of Announcements           
     */
    async getAnnouncements(pageSize = 5) {
        try {
            const params = {courseId: this.subjectId, pageSize};
            const { data } = await Gclass.#classroom.courses.announcements.list(params);
            return Promise.resolve(data.announcements);
        } catch (error) {
            return Promise.reject(error);
        }
    }
    
    /**
     * Gets a list of all courses.
     * @param   {Number}                pageSize        Number of returned courses. Defaults to 15.
     * @returns {Promise<Object[]>}                     List of Courses
     */
    async getCourses(pageSize = 15) {
        try {
            const { data } = await Gclass.#classroom.courses.list({pageSize});
            return Promise.resolve(data.courses);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getCourseWork(pageSize = 5) {
        try {
            const { data } = await Gclass.#classroom.courses.courseWork.list({courseId: this.subjectId, pageSize});
            return Promise.resolve(data.courseWork);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Gets a list of Topics. Topics are changes published to the Google Class.
     * @param   {Number}                pageSize        Number of returned topics. Defaults to 5.    
     * @returns {Promise<Object[]>}                     List of topics
     */
    async getTopics(pageSize = 5) {
        try {
            const params = {courseId: this.subjectId, pageSize};
            const { data } = await Gclass.#classroom.courses.topics.list(params);
            return Promise.resolve(data.topic);
        } catch (error) {
            return Promise.reject(error);
        }
    }
    
    

    //===============================================
    //      Static Methods
    //===============================================

    /**
     * Gets a list of all courses.
     * @param       {Number}                pageSize        Number of returned courses.
     * @returns     {Promise<Object[]>}                     List of Courses
     */
    static async getCourses(pageSize = 15) {
        try {
            const { data } = await Gclass.#classroom.courses.list({pageSize: pageSize});
            return Promise.resolve(data.courses);
        } catch (error) {
            return Promise.reject(error);
        }
    }



    //================================================
    //      Initialization Methods
    //================================================
    
    /**
     * Prompts creation of `token.json` file through the terminal.
     * @param   {google.auth.OAuth2}    oAuth2Client    Authorization Client
     * @param   {Array<String>}         scopes          Scope of the API
     */
    static #getNewToken = (oAuth2Client, scopes, tokenPath) => {
        // Generates Authorization URL for OAuth2.
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        });
        
        // Outputs Authorization URL in the terminal. Copy-Paste into browser.
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        
        // Enter code from Auth page to terminal.
        rl.question('\nEnter the code from that page here: ', (code) => {
            rl.close();
            
            // Creates Token from terminal input.
            oAuth2Client.getToken(code, async(err, token) => {
                try {
                    if (err) throw `Error retrieving access token: ${err}`;      
                    oAuth2Client.setCredentials(token);
                    
                    // Writes token into `token.json`.
                    const content = {content: cryptr.encrypt(JSON.stringify(token))};
                    await fs.promises.writeFile(tokenPath, JSON.stringify(content));
                    console.log("Token stored to: " + tokenPath);

                    // Sets Google Classroom.
                    Gclass.#classroom = google.classroom({version: 'v1', auth: oAuth2Client});
                } catch (error) {
                    throw new Error(error);    
                }
            });

        });
    }

    /**
     * Checks authorization of Gclass
     * @param   {Array<String>}     scopes      Array of scopes of the API
     * @param   {String}            credPath    Path of `credentials.json`
     * @param   {String}            tokenPath   Path of `token.json`
     * @returns {Promise<void>}                 Void Promise
     */
    static async authorize(scopes, credPath = "../api/credentials.json", tokenPath = "../api/token.json") {
        try {
            // If modifying scopes, delete `token.json`
            // More Scopes can be found at https://developers.google.com/classroom/guides/auth
            if (!scopes) {
                scopes = [
                    'https://www.googleapis.com/auth/classroom.courses.readonly',
                    'https://www.googleapis.com/auth/classroom.rosters.readonly',
                    'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
                    'https://www.googleapis.com/auth/classroom.announcements.readonly',
                    'https://www.googleapis.com/auth/classroom.guardianlinks.me.readonly',
                    'https://www.googleapis.com/auth/classroom.topics.readonly',
                    'https://www.googleapis.com/auth/classroom.push-notifications'
                ];
            }
            
            // Reads `credentials.json` and parses it.
            //const creds = await fs.promises.readFile(credPath); 
            const creds = require(credPath);
            const credentials = JSON.parse(cryptr.decrypt(creds.content));

            // Destructures required values from `credentials.json` and creates OAuth2 Client.
            const { client_secret, client_id, redirect_uris } = credentials.installed;
            const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

            try {
                // Gets token from `token.json` file for OAuth2. If not exits, it catches.
                const token = require(tokenPath);
                oAuth2Client.setCredentials(JSON.parse(cryptr.decrypt(token.content)));

                // Sets Google Classroom.
                Gclass.#classroom = google.classroom({version: 'v1', auth: oAuth2Client});
            } catch (e) {
                // Executes if `token.json` is not found.
                Gclass.#getNewToken(oAuth2Client, scopes, tokenPath);
            }
        } catch (error) {
            // Throws new Error if there is a problem with `credentials.json` or if it doesn't exist.
            throw new Error(`Error loading client secret file: ${error}`);
        }
    }

}

module.exports = { Gclass };