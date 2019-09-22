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

function adminDeleteUser(user) {
    if (user && user['UserStatus'] === 'UNCONFIRMED') {
        userRequest.Username = user.email;
        return cognito.adminDeleteUser(userRequest)
            .promise().catch(err => "Error on delete: " + JSON.stringify(err));
    }
}

exports.handler = async function (event, context) {
    let body = JSON.parse(event.body);
    if (body.userPoolId) userRequest.UserPoolId = body.userPoolId;
    if (body.email) userRequest.Username = body.email;

    const user = await cognito.adminGetUser(userRequest).promise()
        .catch(err => console.log("Error on: " + JSON.stringify(err)));
    await adminDeleteUser(user);

    return response;
};