require('./styles/myfriend.css');


function login() {
    return new Promise((resolve, reject) => {
        VK.init({
            apiId: 5918600
        });
        VK.Auth.login(function(result) {
            if (result.status == 'connected') {
                resolve();
            } else {
                reject();
            }
        });
    });
}

function callAPI(method, params) {
    return new Promise(function(resolve) {
        VK.api(method, params, function() {
            resolve(arguments[0].response);
        });
    });
}

