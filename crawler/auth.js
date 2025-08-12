/**

 */

const COOKIES = [
    {
        domain: 'metruyencv.com',
        expirationDate: 1757564394,
        hostOnly: true,
        httpOnly: false,
        name: 'accessToken',
        path: '/',
        sameSite: 'unspecified',
        secure: false,
        session: false,
        storeId: '0',
        value: '5275159|0tWE8PzreI9GmIhCpnELdUzIOsLKgZwkYQlApKod',
    },
]

let REQUEST_CONFIG = {
    method: 'get',
    headers: {
        cookie: `accessToken=${COOKIES[0].value}`,
    },
}

export { REQUEST_CONFIG, COOKIES }

