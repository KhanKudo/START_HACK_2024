import * as fs from 'fs'

type Student = {
    id: number
    firstName: string
    lastName: string
}

type DatabaseType = {
    students: Student[]
}

export const database: DatabaseType = JSON.parse(fs.readFileSync('./database.json', 'utf-8'))

export function saveDatabase() {
    fs.copyFileSync('./database.json', `./history/database${new Date().getMilliseconds()}.json`)
    fs.writeFileSync('./database.json', JSON.stringify(database))
}