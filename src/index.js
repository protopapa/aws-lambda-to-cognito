const aws = require('aws-sdk');

const cognitoIdentityService = new aws.CognitoIdentityServiceProvider({ apiVersion: 'latest', region: 'eu-west-1' });
const isDebug = Boolean(process.env.IS_DEBUG); // AWS Lambda environmental variable.

const userRequest = {
    UserPoolId: '',
    Username: '',
};

const response = {
    statusCode: 200,
    body: JSON.stringify({
        message: 'OK',
    }),
};

exports.handler = function(event, context, callback) {

    if (event.body !== null && event.body !== undefined) {
        let body = JSON.parse(event.body);
        if (body.userPoolId) userRequest.UserPoolId = body.userPoolId;
        if (body.email) userRequest.Username = body.email;
    }

    console.log("userRequest: " + JSON.stringify(userRequest));

    cognitoIdentityService.adminGetUser(userRequest, function(getUserError, getUserData) {

        if (!getUserError) {
            if (isDebug) {
                console.log('getUserData: ' + JSON.stringify(getUserData));
            }

            if (getUserData['UserStatus'] === 'UNCONFIRMED') {
                cognitoIdentityService.adminDeleteUser(userRequest, function(deleteError, deleteData) {
                    if (!deleteError) {
                        if (isDebug) {
                            console.log('Deleted user with username: ' + userRequest.Username);
                        }
                    } else {
                        if (isDebug) {
                            console.log('deleteError: ' + JSON.stringify(deleteError));
                        }
                    }
                });
            } else {
                if (isDebug) {
                    console.log('User is already confirmed. Skipping');
                }
            }
        } else {
            if (isDebug) {
                console.log('getUserError: ' + JSON.stringify(getUserError));
            }
        }

        callback(null, response);
    });
};