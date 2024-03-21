import { Student, Token } from './models'

export declare type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE'

export declare type ValidType = null | undefined | string | number | boolean |
    StringConstructor | NumberConstructor | BooleanConstructor |
[ValidType] | ValidType[] | { [key: string | number]: ValidType }

export declare type AccessLevelType = number
//* public access, no token required
const PublicAccess = 0
//* any defined token, token simply must be matched in the database, accessLevel doesn't matter
const AnyTokenAccess = 1
//* 2-999 undefined
//* read access
const ReadAccess = 1000
//* Tag/Locator access
const TagLocatorAccess = 4000
//* write access
const WriteAccess = 5000
//* admin access
const AdminAccess = 9990
//* god access (highest possible, above will result in error)
const GodAccess = 9999

export declare type DefaultType = {
    accessLevel?: AccessLevelType,
    keepAliveSSE?: boolean,
}

export declare type EndpointType = {
    req?: ValidType,
    res: { [key: number]: ValidType },
} & Partial<DefaultType>

export declare type ApiType = {
    prefix: string,
    AccessControlAllowOrigin: string,
    globalResCodes: EndpointType['res'],
    globalDefaults: Partial<Record<MethodType, DefaultType>>
} & Partial<Record<MethodType, Record<string, EndpointType>>>

export const REST_API: ApiType = {
    prefix: 'api',
    AccessControlAllowOrigin: '*',
    globalResCodes: {
        400: 'Provided request data does not match expected request data type.',
        401: 'No Token Provided.',
        403: 'Provided Token does not have sufficient access rights.',
        404: String,
        500: 'An unexpected error has occurred while processing the request.',
    },
    globalDefaults: {
        GET: {
            accessLevel: ReadAccess,
            // keepAliveSSE: false
        },
        POST: {
            accessLevel: WriteAccess
        },
        PUT: {
            accessLevel: WriteAccess
        },
        DELETE: {
            accessLevel: WriteAccess
        },
    },
    GET: {
        students: {
            res: {
                200: [Student],
            },
        },
        tokenAccess: {
            accessLevel: PublicAccess,
            req: {
                token: String
            },
            res: {
                200: {
                    accessLevel: Number
                }
            }
        }
    }
}