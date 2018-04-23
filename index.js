const aws = require('aws-sdk');

const cognitoIdentityService = new aws.CognitoIdentityServiceProvider({apiVersion: 'latest', region: 'eu-west-1'});
const userPoolId = process.env.userPoolId;

const userRequest = {
    UserPoolId: userPoolId,
    Username: '',
};

exports.handler = function(event, context, callback){
    userRequest.Username = event.email;

    cognitoIdentityService.adminGetUser(userRequest, function(getUserError, getUserData){
        if(!getUserError){
            if(getUserData['UserStatus'] === 'UNCONFIRMED'){
                cognitoIdentityService.adminDeleteUser(userRequest, function (deleteError, deleteData) {
                    if(!deleteError){
                        console.log("Deleted user with username: ");
                        console.log(userRequest.Username)
                    }else {
                        console.log(JSON.stringify(getUserError));
                    }
                });
            }
        } else{
          console.log(JSON.stringify(getUserError));
        }
        callback(null, 'Done'); // TODO define this part.
    });
};