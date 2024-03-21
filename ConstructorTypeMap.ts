type RuntimeType<T> = T extends string ? StringConstructor :
    T extends number ? NumberConstructor :
    T extends boolean ? BooleanConstructor :
    // T extends Date ? StringConstructor :
    T extends object ? ConvertToRuntimeType<T> :
    T extends Array<infer U> ? Array<RuntimeType<U>> :
    T

export type ConvertToRuntimeType<T> = {
    [K in keyof T]: RuntimeType<T[K]>
}

type NestedObjectType<T> = {
    [key: string | number]: NestedObjectType<T> | T
}

type IncludeFromObject<T extends NestedObjectType<boolean>, U extends Record<any, any>> = {
    [K in keyof T]: K extends keyof U ? T[K] extends object ? IncludeFromObject<T[K], U[K]> : T[K] extends true ? U[K] : never : never
}

type ExcludeFromObject<T extends NestedObjectType<boolean>, U extends Record<any, any>> = {
    [K in keyof U]: K extends keyof T ? T[K] extends object ? ExcludeFromObject<T[K], U[K]> : T[K] extends false ? never : U[K] : U[K]
}

export function IncludeFromObject<T extends NestedObjectType<any>, U extends Record<keyof T, boolean> = Record<keyof T, boolean>, V extends T = T>(properties: Partial<U>, object: V): IncludeFromObject<U, V> {
    return <IncludeFromObject<U, V>>Object.fromEntries(<[any, any]>Object.entries(object).map(([key, prop]) => {
        if (properties[key]) {
            if (prop === null)
                return [key, prop]
            else if (Array.isArray(prop))
                throw new Error('Arrays are not yet supported!')
            else if (typeof prop === 'object' && typeof properties[key] === 'object')
                return [key, IncludeFromObject(<any>properties[key], prop)]
            else
                return [key, prop]
        }
        else
            return null
    }).filter(x => x !== null))
}

export function ExcludeFromObject<T extends NestedObjectType<any>, U extends Record<keyof T, boolean> = Record<keyof T, boolean>, V extends T = T>(properties: Partial<U>, object: V): ExcludeFromObject<U, V> {
    return <ExcludeFromObject<U, V>>Object.fromEntries(<[any, any]>Object.entries(object).map(([key, prop]) => {
        if (properties[key] === false || typeof properties[key] === 'object') {
            if (prop ?? true)
                return null
            else if (Array.isArray(prop))
                throw new Error('Arrays are not yet supported!')
            else if (typeof prop === 'object' && typeof properties[key] === 'object')
                return [key, ExcludeFromObject(<any>properties[key], prop)]
            else
                return null
        }
        else
            return [key, prop]
    }).filter(x => x !== null))
}

type JSDocType<T> = T extends StringConstructor ? string /* | Date*/ :
    T extends NumberConstructor ? number :
    T extends BooleanConstructor ? boolean :
    T extends object ? ConvertToJSDocType<T> :
    T extends Array<infer U> ? Array<JSDocType<U>> :
    T

export type ConvertToJSDocType<T> = {
    [K in keyof T]: JSDocType<T[K]>
}