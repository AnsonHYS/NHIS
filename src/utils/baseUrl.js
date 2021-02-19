console.log('环境变量：', process.env.ENV_CONFIG)


// （生产）
export const baseUrl = process.env.BASE_URL + '/nhissystem/' // nginx会转发接口到/
//export const test = process.env.TEST_URL

// （本地临时）
//export const baseUrl = process.env.BASE_URL
//export const test = process.env.TEST_URL


console.log('基本路径baseUrl：', baseUrl)
