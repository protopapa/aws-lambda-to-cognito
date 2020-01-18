const aws = require('aws-sdk');
const cognito = new aws.CognitoIdentityServiceProvider({apiVersion: 'latest', region: 'us-east-2'});

const userRequest = {
    UserPoolId: 'STRING-POOL-ID',
    Username: '',
};

const response = {
    statusCode: 200,
    body: JSON.stringify({
        message: 'OK',
    }),
};

exports.handler = function (event, context, callbak) {
    if (event.email) userRequest.Username = event.email;

    cognito.adminGetUser(userRequest).promise()
        .then(function (adminGetUserResponse) {
            if (adminGetUserResponse && adminGetUserResponse['UserStatus'] === 'FORCE_CHANGE_PASSWORD') {
                return cognito.adminDeleteUser(userRequest).promise();
            } else {
                return new Promise(function (resolve, reject) {
                    reject("User does not fulfill requirements for deletion ");
                })
            }
        })
        .then(function (response) {
            console.log("User deleted: ", JSON.stringify(response));
        })
        .catch(function (errorValue) {
            console.log("Error :", JSON.stringify(errorValue))
        });

    return callbak(null, response);
};



