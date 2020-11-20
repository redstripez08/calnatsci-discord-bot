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
npm install googleapis@39
```
Then Inside your main file, it should look something like this.
```js
const { Gclass } = require("./path/to/Gclass"); 
```

### Authorization
Before using the Google Classroom API

