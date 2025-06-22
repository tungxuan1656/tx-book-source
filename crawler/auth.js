/**

 */

const COOKIES = [
    {
        domain: 'metruyencv.com',
        expirationDate: 1753116159,
        hostOnly: true,
        httpOnly: false,
        name: 'accessToken',
        path: '/',
        sameSite: 'unspecified',
        secure: false,
        session: false,
        storeId: '0',
        value: '4719889|OmTHvrRVGfoOsMyfSp9P3PjoVRThROxiklPxp5eC',
    },
]

let REQUEST_CONFIG = {
    method: 'get',
    headers: {
        cookie: `accessToken=${COOKIES[0].value}`,
    },
}

export { REQUEST_CONFIG, COOKIES }

