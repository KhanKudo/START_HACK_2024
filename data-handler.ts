import Datastore from '@seald-io/nedb'
import { ExamType, NoteType, StudentType, TokenType } from './models'

const tokens = new Datastore<TokenType>({
    filename: 'database/tokens.db',
    autoload: true
})

const students = new Datastore<StudentType>({
    filename: 'database/students.db',
    autoload: true
})

const exams = new Datastore<ExamType>({
    filename: 'database/exams.db',
    autoload: true
})

const notes = new Datastore<NoteType>({
    filename: 'database/notes.db',
    autoload: true
})

export const db = {
    students,
    exams,
    notes
}

export async function checkToken(token: string, accessLevel: number): Promise<boolean> {
    const found = await tokens.findOneAsync({ token })

    if (!found)
        return false

    return found.accessLevel >= accessLevel
}

export async function getTokenAccess(token: string): Promise<number> {
    const found = await tokens.findOneAsync({ token })

    if (!found)
        return 0

    return found.accessLevel
}