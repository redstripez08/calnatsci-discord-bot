# Gclass 

This is a class I created to simplify communication with the Google Classroom
API. It uses promises instead of callbacks.

## Prerequisites
* NodeJS v12 and above (I think)
* `googleapis@39` npm package
* Google Account
* Download `credentials.json` from Google. (Further instructions below)

## Usage

### Quickstart
In your terminal, npm install `googleapis@39`
```
npm init
npm install googleapis@39
```
Your directory should look something like this:
```
node_modules
gclass.js
index.js
package.json
package-lock.json
```
Then inside your `index.js` file, it should look something like this.
```js
const { Gclass } = require("./gclass");

(async() => {
    await Gclass.authorize();   // Authorizes App for Gclass API
    // If this is your fist time authorizing or you don't have `token.json`,
    // then it will prompt creation of `token.json` through the terminal.
})();
```

### Authorization
Before using the Google Classroom API, you need to authorize Google Classroom
```js
const { Gclass } = require("./gclass");

(async() => {
    await Gclass.authorize();
    
    console.log(await Gclass.getCourses()); // Logs All courses and their ID
    
    const English = new Gclass(subjectId);

    const announcements = await English.getAnnouncements()  // Gets Announcements
    const topics = await English.getTopics()                // Gets Topics

})();
```

