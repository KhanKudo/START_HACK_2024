import { ConvertToJSDocType } from './ConstructorTypeMap'

export const Student = {
    firstName: String,
    lastName: String,
}

export type StudentType = ConvertToJSDocType<typeof Student>

export const Token = {
    token: String,
    accessLevel: Number,
}

export type TokenType = ConvertToJSDocType<typeof Token>

export const Exam = {
    studentId: String,
    examId: String,
}

export type ExamType = ConvertToJSDocType<typeof Exam>

export const Observation = {
    studentId: String,
    observation: String,
    date: String,
}

export type ObservationType = ConvertToJSDocType<typeof Observation>