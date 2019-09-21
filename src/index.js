const aws = require('aws-sdk');

const cognito = new aws.CognitoIdentityServiceProvider({apiVersion: 'latest', region: 'eu-west-1'});

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

exports.handler = function (event, context, callback) {
    let body = JSON.parse(event.body);
    if (body.userPoolId) userRequest.UserPoolId = body.userPoolId;
    if (body.email) userRequest.Username = body.email;

    cognito.adminGetUser(userRequest, function (getUserError, getUserData) {
        if (!getUserError) {
            if (getUserData['UserStatus'] === 'UNCONFIRMED') {
                cognito.adminDeleteUser(userRequest, function (deleteError, deleteData) {
                    if (!deleteError) {
                    } else {
                        console.log('deleteError: ' + JSON.stringify(deleteError));
                    }
                });
            } else {
                console.log('User is already confirmed. Skipping');
            }
        } else {
            console.log('getUserError: ' + JSON.stringify(getUserError));
        }

        callback(null, response);
    });





};