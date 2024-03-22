import Datastore from '@seald-io/nedb'
import { CompetencyType, DisciplineType, ExamType, ObservationType, StudentType, TokenType } from './models'

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

const competencies = new Datastore<CompetencyType>({
    filename: 'database/competencies.db',
    autoload: true
})

const disciplines = new Datastore<DisciplineType>({
    filename: 'database/disciplines.db',
    autoload: true
})

const observations = new Datastore<ObservationType>({
    filename: 'database/observations.db',
    autoload: true
})

export const db = {
    students,
    exams,
    competencies,
    disciplines,
    observations
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