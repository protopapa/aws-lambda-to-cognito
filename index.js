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
    userRequest.Username = event.email;

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
                response_error.body.message = JSON.stringify('Operation not Allowed');
                console.log(response_error);
            }
        } else{
          console.log(JSON.stringify(getUserError));
        }
        callback(JSON.stringify(response_error), JSON.stringify(response_success));
    });
};