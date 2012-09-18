/*
 *   Load required libraries
 */
var util = require('util')
    , http = require('http')
    , jsdom = require('jsdom')
    , httpAgent = require('http-agent')
    , querystring = require('querystring');

var jqueryPath = 'jquery.min.js';

var systemHost = 'devbo';
var systemPort = '8080';

var cmcUser = 'Administrator';
var cmcPass = '';
var cmcPort = '6400';

var parentGroupId = 86130; // demo

var allCookies = [];

var getSessionId = function(callback){
    
    var __COOKIES;
    
    var agent = httpAgent.create(systemHost + ':' + systemPort, ['CmcApp/']);
    
    agent.addListener('next', function (err, agent) {
        
        allCookies = allCookies.concat(agent.response.headers['set-cookie']);
        callback();  
    
    });

    agent.start();
}

var setAuth = function(callback){
    
      
      var __PARAMS = {};

        __PARAMS['qryStr'] = 'service=/CmcApp/App/appService.jsp&cms=' + systemHost + ':' + cmcPort + '&cmsVisible=true&authType=secEnterprise&authenticationVisible=true&sm=false&smAuth=secLDAP&sapSSOPrimary=false&sso=false&useLogonToken=false&sessionCookie=true&persistCookies=true&appName=BusinessObjects+Central+Management+Console&prodName=Business+Objects&appKind=CMC&backUrl=/App/home.faces&backContext=/CmcApp&backUrlParents=1';
        __PARAMS['cmcVisible'] = 'true';
        __PARAMS['authenticationVisible'] = 'true';
        __PARAMS['isFromLogonPage'] = 'true';
        __PARAMS['appName'] = 'BusinessObjects+Central+Management+Console';
        __PARAMS['prodName'] = 'Business+Objects';
        __PARAMS['sessionCookie'] = 'true';
        __PARAMS['backUrl'] = '/App/home.faces';
        __PARAMS['backUrlParents'] = '1';
        __PARAMS['backContext'] = '/CmcApp';
        __PARAMS['persistCookies'] = 'true';
        __PARAMS['useLogonToken'] = 'false';
        __PARAMS['service'] = '/CmcApp/App/appService.jsp';
        __PARAMS['appKind'] = 'CMC';
        __PARAMS['loc'] = 'ru';
        __PARAMS['reportedIP'] = '';
        __PARAMS['reportedHostName'] = systemHost + ':' + systemPort;
        __PARAMS['cms'] = systemHost +':' + cmcPort;
        __PARAMS['SAPSystem'] = '';
        __PARAMS['SAPClient'] = '';
        __PARAMS['username'] = cmcUser;
        __PARAMS['password'] = cmcPass;
        __PARAMS['authType'] = 'secEnterprise';
      
      var post_data = querystring.stringify(__PARAMS);
    
      var post_options = {
          host: systemHost,
          port: systemPort,
          path: '/PartnerPlatformService/service/app/logon.object',
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': post_data.length,
              'Cookie': allCookies
          }
        };

        var req = http.request(post_options, function(res) {

            res.on('end', function() {
                allCookies = allCookies.concat(res.headers['set-cookie']);
                console.log('Login to CMC [' + systemHost + ', ' + cmcUser + ']');
                callback();
            });
    
        });
   
        req.on('error', function(e) {
            console.error(e.message);
        });
  
        req.write(post_data);
        req.end();
}

var getTokens = function(callback){

    var __PARAMS = {};

    var agent = httpAgent.create(
            systemHost + ':' + systemPort, 
            ['PlatformServices/jsp/User_Properties/properties.faces?cafWebSesInit=true&parentGroupId=' + parentGroupId + '&objIds=&actId=178&appKind=CMC&service=%2FCmcApp%2FApp%2FappService.jsp&containerId=19&showApply=true&showSingleChildAction=true&pvl=ru_RU&loc=ru&pref=maxOpageU%3D50%3BmaxOpageUt%3D200%3BmaxOpageC%3D50%3Btz%3DAsia%2FDacca%3BmUnit%3D%3BshowFilters%3Dtrue%3BsmtpFrom%3Dtrue%3BpromptForUnsavedData%3Dfalse%3B'],
            {headers:{'Cookie':allCookies}}
        );

    agent.addListener('next', function (err, agent) {

        allCookies = allCookies.concat(agent.response.headers['set-cookie']);

        jsdom.env({
            html: agent.body,
            scripts: [jqueryPath]
          }, 
        function (err, window) {
    
            var $ = window.jQuery;
            
            __PARAMS['bttokents'] = $('input[name=bttokents]').val();
            __PARAMS['bttoken'] = $('input[name=bttoken]').val();
            __PARAMS['faces'] = $('input[name=com.sun.faces.VIEW]').val();
            __PARAMS['referer'] = agent.current.uri;

            callback(__PARAMS);
            
        });
        
        agent.next();
        
    });

    agent.start();
};

var createUser = function(authCookies, formTokens, user, callback){

    var __PARAMS = {};

    __PARAMS['service'] = '/CmcApp/App/appService.jsp';
    __PARAMS['deltaId'] = '';
    __PARAMS['containerId'] = '19';
    __PARAMS['loc'] = 'ru';
    __PARAMS['actId'] = '178';
    __PARAMS['appKind'] = 'CMC';
    __PARAMS['pref'] = 'maxOpageU=50;maxOpageUt=200;maxOpageC=50;tz=Asia/Dacca;mUnit=;showFilters=true;smtpFrom=true;promptForUnsavedData=false;';
    __PARAMS['pvl'] = 'ru_RU';
    __PARAMS['isFormSubmit'] = 'true';
    __PARAMS['parentGroupId'] = parentGroupId.toString();
    __PARAMS['userPropForm:authType'] = 'secEnterprise';
    __PARAMS['userPropForm:userName'] = user.userName;
    __PARAMS['userPropForm:userFullName'] = user.userFullName;
    __PARAMS['userPropForm:userEmail'] = user.userEmail;
    __PARAMS['userPropForm:userDescription'] = user.userDescription;
    __PARAMS['userPropForm:userPassword'] = user.userPassword;
    __PARAMS['userPropForm:userConfirmPassword'] = user.userPassword;
    __PARAMS['userPropForm:nc02'] = 'named';
    __PARAMS['userPropForm:_id22'] = 'Создать';
    __PARAMS['com.sun.faces.VIEW'] = formTokens.faces;
    __PARAMS['userPropForm'] = 'userPropForm';
    __PARAMS['bttokents'] = formTokens.bttokents;
    __PARAMS['bttoken'] = formTokens.bttoken;
      
    var post_data = querystring.stringify(__PARAMS);

    var sessionId = authCookies[0].split(';')[0];

    var post_options = {
          host: systemHost,
          port: systemPort,
          path: '/PlatformServices/jsp/User_Properties/properties.faces;' + sessionId,
          method: 'POST',
          headers: {
              'Referer': formTokens.referer,
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': post_data.length,
              'Cookie': authCookies
          }
        };

        var req = http.request(post_options, function(res) {

            var body = '';
            
            res.on('data', function(chunk) {
                body += chunk;
            });

            res.on('end', function() {
                callback(body);
            });
    
        });
   
        req.on('error', function(e) {
            console.error(e.message);
        });
  
        req.write(post_data);
        req.end();
};


var logOut = function(){
    
    var __PARAMS = {};

    __PARAMS['cleanedUp'] = 'true';
    __PARAMS['appKind'] = 'CMC';
    __PARAMS['backContext'] = '/CmcApp';
    __PARAMS['backUrl'] = '/logon.faces';

      
    var post_data = querystring.stringify(__PARAMS);
    
    var post_options = {
        host: systemHost,
        port: systemPort,
        path: '/PlatformServices/service/app/logoff.do',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length,
            'Cookie': allCookies
        }
    };

    var req = http.request(post_options, function(res) {

        res.on('end', function() {
            console.log('Logout from CMC [' + systemHost + ', ' + cmcUser + ']');
        });

    });

    req.on('error', function(e) {
        console.error(e.message);
    });

    req.write(post_data);
    req.end();
};

getSessionId(function(){
    setAuth(function(){
        getTokens(function(formTokens){
            
            var user = {};

            user.userName = process.argv[2] || 'demoUser67';
            user.userFullName = process.argv[3] || 'demoUser67';
            user.userEmail = process.argv[4] || '';
            user.userDescription = '';
            user.userPassword = process.argv[5] || 'initnode';

            
            
            createUser(allCookies, formTokens, user, function(data){

                jsdom.env({
                    html: data,
                    scripts: [jqueryPath]
                }, 
                function (err, window) {
            
                    var $ = window.jQuery;
                    var errorText = trim($('tr.error td').text());

                    if(errorText.length > 10){
                        console.error(errorText);
                    }else{
                        console.log('Объект \'' + user.userName + '\' типа \'User\' успешно создан');
                    }
                    
                });

                logOut();

            });
        });
    });
});


function trim (str, charlist) {
    // Strips whitespace from the beginning and end of a string  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/trim
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: mdsjack (http://www.mdsjack.bo.it)
    // +   improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
    // +      input by: Erkekjetter
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: DxGx
    // +   improved by: Steven Levithan (http://blog.stevenlevithan.com)
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // *     example 1: trim('    Kevin van Zonneveld    ');
    // *     returns 1: 'Kevin van Zonneveld'
    // *     example 2: trim('Hello World', 'Hdle');
    // *     returns 2: 'o Wor'
    // *     example 3: trim(16, 1);
    // *     returns 3: 6
    var whitespace, l = 0,
        i = 0;
    str += '';

    if (!charlist) {
        // default list
        whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    } else {
        // preg_quote custom list
        charlist += '';
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    }

    l = str.length;
    for (i = 0; i < l; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }

    l = str.length;
    for (i = l - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }

    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}