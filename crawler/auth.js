/**

 */

const COOKIES = [
    {
        domain: 'metruyencv.com',
        expirationDate: 1743609143,
        hostOnly: true,
        httpOnly: false,
        name: 'accessToken',
        path: '/',
        sameSite: 'unspecified',
        secure: false,
        session: false,
        storeId: '0',
        value: '3189166|1ZBsF31SiXZOV6w9h6NvJgpYau1SV5yO1ZnVGaQN',
    },
]

let REQUEST_CONFIG = {
    method: 'get',
    headers: {
        cookie: `accessToken=${COOKIES[0].value}`,
    },
}

export { REQUEST_CONFIG, COOKIES }

