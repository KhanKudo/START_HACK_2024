import { REST_API, ValidType } from '../api-definition'
import { checkToken } from '../data-handler'
import { IncomingMessage, ServerResponse } from 'http'

type ResponseType = ServerResponse<IncomingMessage> & { req: IncomingMessage }

type UnboundHandlerType = ((res: ResponseType, data?: any) => void | Promise<void>)
type HandlerType = ((data?: any) => void | Promise<void>)
type UnboundSseHandlerType = (res: ResponseType, handler: ({ send, close }: { send: (data?: any) => void, close: () => void }) => void, onclose: () => void) => void
type SseHandlerType = (handler: ({ send, close }: { send: (data?: any) => void, close: () => void }) => void, onclose: () => void) => void

const config: {
    [key: string]: { //* method
        [key: string]: { //* endpoint path
            req: ValidType //* will automatically handle access rights, if property "token" is present
            res: { [key: number]: ValidType }
            handlers: Record<string, UnboundHandlerType | ((...args: any[]) => void | Promise<void> | UnboundSseHandlerType)> & Partial<Record<'openStream', UnboundSseHandlerType>>
            accessLevel: number
            keepAliveSSE: boolean
        }
    }
} = {"GET":{"students":{
req:undefined,
res:{"200":[{"firstName":String,"lastName":String}]},
accessLevel:1000,
keepAliveSSE:false,
handlers:{code200:function (res:ResponseType, data:({"firstName":string,"lastName":string})[]) {
                res
                    .writeHead(200, {
                    'Content-Type': 'text/plain',
                    "Access-Control-Allow-Origin": "*"
                })
                    .end(typeof data === "object" ? JSON.stringify(data) : data);
            }}},
"tokenAccess":{
req:{"token":String},
res:{"200":{"accessLevel":Number}},
accessLevel:0,
keepAliveSSE:false,
handlers:{code200:function (res:ResponseType, data:{"accessLevel":number}) {
                res
                    .writeHead(200, {
                    'Content-Type': 'text/plain',
                    "Access-Control-Allow-Origin": "*"
                })
                    .end(typeof data === "object" ? JSON.stringify(data) : data);
            }}}} }

//! api-generator assures that a global code 404 response is defined
const globalResHandlers: Record<string & 'code404', UnboundHandlerType> = <any>{code400:function (res:ResponseType, data:"Provided request data does not match expected request data type."="Provided request data does not match expected request data type.") {
                res
                    .writeHead(400, {
                    'Content-Type': 'text/plain',
                    "Access-Control-Allow-Origin": "*"
                })
                    .end(typeof data === "object" ? JSON.stringify(data) : data);
            },
code401:function (res:ResponseType, data:"No Token Provided."="No Token Provided.") {
                res
                    .writeHead(401, {
                    'Content-Type': 'text/plain',
                    "Access-Control-Allow-Origin": "*"
                })
                    .end(typeof data === "object" ? JSON.stringify(data) : data);
            },
code403:function (res:ResponseType, data:"Provided Token does not have sufficient access rights."="Provided Token does not have sufficient access rights.") {
                res
                    .writeHead(403, {
                    'Content-Type': 'text/plain',
                    "Access-Control-Allow-Origin": "*"
                })
                    .end(typeof data === "object" ? JSON.stringify(data) : data);
            },
code404:function (res:ResponseType, data:string) {
                res
                    .writeHead(404, {
                    'Content-Type': 'text/plain',
                    "Access-Control-Allow-Origin": "*"
                })
                    .end(typeof data === "object" ? JSON.stringify(data) : data);
            },
code500:function (res:ResponseType, data:"An unexpected error has occurred while processing the request."="An unexpected error has occurred while processing the request.") {
                res
                    .writeHead(500, {
                    'Content-Type': 'text/plain',
                    "Access-Control-Allow-Origin": "*"
                })
                    .end(typeof data === "object" ? JSON.stringify(data) : data);
            } }

function checkType(data: any, type: ValidType): boolean {
    if (type === String ||
        type === Number ||
        type === Boolean ||
        type === undefined ||
        type === null
    ) {
        return type === String && typeof data === 'string' ||
            type === Number && typeof data === 'number' ||
            type === Boolean && typeof data === 'boolean' ||
            (type === undefined || type === null) && (data === undefined || data === null)
    }
    else if (Array.isArray(type)) {
        if (type.length === 1) {
            if (!Array.isArray(data))
                return false

            return data.every(item => checkType(item, type[0]))
        }
        else {
            return type.some(t => checkType(data, t))
        }
    }
    else if (typeof type === 'object') {
        if (typeof data !== 'object' || data === null)
            return false

        return Object.entries(data).every(([key, item]) => checkType(item, type[key]))
    }
    else {
        return false
    }
}

function readRequestBody(req: ResponseType['req']): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            let body = ''

            req.on('data', (chunk) => {
                body += chunk
            })
            req.on('end', () => {
                resolve(body)
            })
            req.on('error', err => {
                reject(err)
            })
        } catch (error) {
            reject(error)
        }
    })
}

export async function handler(response: ResponseType, handlers: {"GET":{"students":(data:undefined,res:{
code200:(data:({"firstName":string,"lastName":string})[])=>void})=>void|Promise<void>,
"tokenAccess":(data:{"token":string},res:{
code200:(data:{"accessLevel":number})=>void})=>void|Promise<void>} }): Promise<void> {
    const request = response.req
    if (!request.url || !request.method || !request.headers) {
        response
            .writeHead(400, 'No request.url or request.method or request.headers available but required!')
            .end()
        return
    }

    const url = new URL(request.url, 'https://rtls.milenkovic.cloud')
    const prefix = '/api'
    if (!url.pathname.startsWith(prefix)) {
        return globalResHandlers.code404(response, `Invalid API prefix, does not exist`)
    }

    if (request.method === 'OPTIONS') {
        response
            .writeHead(200, 'CORS Options', {
                'Access-Control-Allow-Origin': REST_API.AccessControlAllowOrigin,
                'Access-Control-Allow-Methods': Object.keys(handlers).join(', '),
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '3600'
            })
            .end()
        return
    }

    if (!(request.method in handlers)) {
        return globalResHandlers.code404(response, `No endpoints available for provided method: "${request.method}"`)
    }

    const handler: (data: any, resHandlers: Record<string, HandlerType>) => void | Promise<void> = (handlers as any)[request.method][url.pathname.slice(prefix.length + 1)]

    if (!handler) {
        return globalResHandlers.code404(response, `No endpoints available for provided method at provided path: "${request.method}": "${url.pathname}"`)
    }

    const configType = config[request.method][url.pathname.slice(prefix.length + 1)]

    const resHandlers: Record<string, HandlerType> & Record<'openStream', SseHandlerType> = <any>Object.assign({}, globalResHandlers, configType.handlers)

    for (const [code, handler] of Object.entries(resHandlers)) {
        resHandlers[code] = (<any>handler).bind({}, response)
    }

    let data: any

    try {
        if (request.method === 'GET' || request.method === 'DELETE') {
            if (url.searchParams.has('json')) {
                const json = url.searchParams.get('json')
                if (configType.req === undefined || configType.req === null || json === 'undefined')
                    data = undefined
                else
                    data = JSON.parse(json ?? 'null')
            }
            else {
                data = {}
                // Note that this part is not used for validation,
                // but merely uses expected type to properly convert the string value
                // This is required because all searchParameters are always strings
                for (const [key, value] of url.searchParams.entries()) {
                    const type = (configType as any).req[key]

                    if (type === String)
                        data[key] = value
                    else if (type === Number)
                        data[key] = parseFloat(value)
                    else if (type === Boolean)
                        data[key] = new Boolean(value)
                    else if ((typeof type === 'object' && type !== null) || (Array.isArray(type) && type.length === 1)) {
                        data[key] = JSON.parse(value)
                        // if (!data[key])
                        //     return resHandlers.code400()
                    }
                    else if (Array.isArray(type) && type.length > 1) {
                        try {
                            data[key] = JSON.parse(value) // handles number, boolean, object and array
                        } catch (error) {
                            data[key] = value // handles string
                            // it's okay even it's not allowed to be a string, because type-checks are run later anyway
                        }
                    }
                    // else
                    //     return resHandlers.code400()
                }

                if (url.searchParams.size === 0)
                    data = undefined
            }
        }
        else if (request.method === 'POST' || request.method === 'PUT') {
            data = JSON.parse(await readRequestBody(request))
        }
    } catch (error) {
        console.error('Encountered an error during request data conversion:', error)
        return resHandlers.code500()
    }

    const token = request.headers['authorization'] ?
        request.headers['authorization'].slice('Bearer '.length) :
        configType.keepAliveSSE ?
            new URL(request.url, 'https://localhost:3000').searchParams.get('token') :
            null

    if (configType.accessLevel && token === null)
        return resHandlers.code401()

    if (configType.accessLevel && typeof token === 'string') {
        if (!(await checkToken(token, configType.accessLevel))) {
            return resHandlers.code403()
        }
    }

    if (!checkType(data, configType.req))
        return resHandlers.code400()

    try {
        return handler(data, resHandlers)
    } catch (error) {
        console.error(error)
        return resHandlers.code500()
    }
}