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


function adminDeleteUser(user) {
    if (user && user['UserStatus'] === 'FORCE_CHANGE_PASSWORD') {
        userRequest.Username = user.Username;
        return cognito.adminDeleteUser(userRequest)
            .promise();
    }
}

exports.handler = async function (event, context) {
    if (event.email) userRequest.Username = event.email;

    try {
        const user = await cognito.adminGetUser(userRequest).promise();
        await adminDeleteUser(user);
    } catch (err) {
        console.log('Error: ' + JSON.stringify(err));
    }
    return response;
};