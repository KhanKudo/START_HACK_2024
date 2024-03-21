import Datastore from '@seald-io/nedb'

export type Student = {
    firstName: string
    lastName: string
}

const students = new Datastore<Student>({
    filename: 'database/students.db',
    autoload: true
})

export type Token = {
    token: string
    accessLevel: number
}

const tokens = new Datastore<Token>({
    filename: 'database/tokens.db',
    autoload: true
})

export const db = {
    students
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