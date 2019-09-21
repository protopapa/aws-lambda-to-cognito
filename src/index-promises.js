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

exports.handler = async function (event, context) {
    const user = await cognito.adminGetUser(userRequest).promise()
        .then(user => isUserConfirmed(user))
        .then(cognito.adminDeleteUser(userRequest))
        .catch(err => console.log("Error on: " + JSON.stringify(err)));
};

function isUserConfirmed(user) {
    return user['UserStatus'] === 'UNCONFIRMED';
}


// exports.handler = function (event, context, callback) {
//     let body = JSON.parse(event.body);
//     if (body.userPoolId) userRequest.UserPoolId = body.userPoolId;
//     if (body.email) userRequest.Username = body.email;
//
//     cognito.adminGetUser(userRequest, function (getUserError, getUserData) {
//         if (!getUserError) {
//             if () {
//                 cognitoIdentityService.adminDeleteUser(userRequest, function (deleteError, deleteData) {
//                     if (!deleteError) {
//                         console.log('Deleted user with username: ' + userRequest.Username);
//                     } else {
//                         console.log('deleteError: ' + JSON.stringify(deleteError));
//                     }
//                 });
//             } else {
//                 console.log('User is already confirmed. Skipping');
//             }
//         } else {
//             console.log('getUserError: ' + JSON.stringify(getUserError));
//         }
//
//         callback(null, response);
//     });
//};