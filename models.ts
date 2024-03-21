import { ConvertToRuntimeType } from './ConstructorTypeMap'

export const Student = {
    firstName: String,
    lastName: String,
}

export type StudentType = ConvertToRuntimeType<typeof Student>

export const Token = {
    token: String,
    accessLevel: Number,
}

export type TokenType = ConvertToRuntimeType<typeof Token>