const aws = require('aws-sdk');

const cognitoIdentityService = new aws.CognitoIdentityServiceProvider({apiVersion: 'latest', region: 'eu-west-1'});
const userPoolId = process.env.userPoolId;

const userRequest = {
    UserPoolId: userPoolId,
    Username: ''
};

const response_success = {
    statusCode: 200,
    body: JSON.stringify({
        message: 'ok'
    })
};

let response_error = {
    statusCode: 400,
    body: {
        message: 'error'
    }
};

exports.handler = function(event, context, callback){

    let responseCode = 200;
    console.log(event);
    if (event.body !== null && event.body !== undefined) {
        let body = JSON.parse(event.body);
        if (body.email)
            userRequest.Username = body.email;
    }

    console.log('userRequest variable after set username');
    console.log(userRequest);

    cognitoIdentityService.adminGetUser(userRequest, function(getUserError, getUserData){
        if(!getUserError){
            console.log(getUserData);
            if (getUserData['UserStatus'] === 'UNCONFIRMED') {
                cognitoIdentityService.adminDeleteUser(userRequest, function (deleteError, deleteData) {
                    if (!deleteError) {
                        console.log("Deleted user with username: ");
                        console.log(userRequest.Username);
                        response_error = null;
                    } else {
                        console.log(JSON.stringify(deleteError));
                        response_error.body.message = JSON.stringify(deleteError);
                    }
                });
            } else {
                console.log('User is already confirmed');
                console.log(response_error);
            }
        } else{
          console.log(JSON.stringify(getUserError));
        }


        var responseBody = {
            message: 'Hello from response',
            input: event
        };
        var response = {
            statusCode: responseCode,
            headers: {
                "x-custom-header" : "my custom header value"
            },
            body: JSON.stringify(responseBody)
        };
        console.log("response: " + JSON.stringify(response));
        callback(null, response);
    });
};