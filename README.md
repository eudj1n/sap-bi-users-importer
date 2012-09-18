# SAP BI Users Importer #

This script allows to bulk import users into SAP BI from CSV file.<br />
Written in JavaScript.

## Requirements ##
* SAP BO/BI 3.2
* JQuery
* Node.JS >= v0.8.0
* Node.JS external modules: jsdom, http-agent (can be installed via npm)


## Preparation ##

* Create group for imported users in CMC (i.e demo)
* Get groupId (i.e. by Firebug in Firefox or by Developer console in Google Chrome)
* Prepare CSV-file, contains these fields: username, description, email and password (plain-text)
* Set params in script header:

```javascript
var jqueryPath = 'jquery.min.js'; // Path to Jquery
var systemHost = 'devbo'; // CMC Host or IP address
var systemPort = '8080'; // CMC HTTP Port
var cmcUser = 'Administrator'; // CMC Username allowed to create users
var cmcPass = ''; // CMC Password
var cmcPort = '6400'; // CMC Internal port
var parentGroupId = 86130; // Created group ID
```  

## Usage ##

`$ node sap-bi-users-importer.js users.csv`