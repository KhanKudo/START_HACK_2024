import Datastore from '@seald-io/nedb'

type Student = {
    firstName: string
    lastName: string
}

const students = new Datastore<Student>({
    filename: 'database/students.db',
    autoload: true
})

export const db = {
    students
}