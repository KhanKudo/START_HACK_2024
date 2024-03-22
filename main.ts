import { Server } from 'http'
import path from 'path'
import * as fs from 'fs'
import * as mime from 'mime-types'
import { chatGPTGradeObservation } from './chatgpt'
import { db, getTokenAccess } from './data-handler'
import { handler } from './server-sdk'
import { spawnSync } from 'child_process'

// db.exams.removeAsync({}, { multi: true }).then(console.log)

// db.students.insertAsync({ firstName: 'Jane', lastName: 'Smith' }).then(console.log)
db.students.findAsync({}).sort({
    lastName: 1,
    firstName: 1,
}).then(console.log)

db.exams.findAsync({}).then(console.log)

const server = new Server(async (req, res) => {
    const url = new URL(req.url ?? '', 'http://localhost:3000')

    if (url.pathname.startsWith('/exams/')) {
        const filePath = path.join(__dirname, 'database', decodeURIComponent(url.pathname))

        if (!fs.existsSync(filePath)) {
            res
                .writeHead(404, {
                    'Content-Type': 'text/plain'
                })
                .end('Requested file was not found!')
        }
        else {
            fs.readFile(filePath, (err, data) => {
                if (!err) {
                    res
                        .writeHead(200, {
                            'Content-Type': mime.lookup(filePath) || 'text/plain'
                        })
                        .end(data)
                }
                else {
                    res
                        .writeHead(500, {
                            'Content-Type': 'text/plain'
                        })
                        .end('Failed to read requested file')
                }
            })
        }
        return
    }

    if (url.pathname.startsWith('/api/')) {
        res.req ??= req

        return await handler(res, {
            GET: {
                tokenAccess: async ({ token }, { code200 }) => {
                    return code200({
                        accessLevel: await getTokenAccess(token)
                    })
                },
                students: async (data, { code200 }) => {
                    return code200(await db.students.findAsync({}).sort({
                        lastName: 1,
                        firstName: 1,
                    }))
                },
                exam: async ({ examId, studentId }, { code200, code404 }) => {
                    const exam = await db.exams.findOneAsync({ examId, studentId })
                    if (!exam)
                        return code404()

                    return code200(exam)
                },
                exams: async ({ examId, studentId }, { code200 }) => {
                    if (examId)
                        return code200(await db.exams.findAsync({ examId }))
                    if (studentId)
                        return code200(await db.exams.findAsync({ studentId }))
                },
                examPDF: async ({ examId, studentId }, { code200, code404 }) => {
                    const exam = await db.exams.findOneAsync({ examId, studentId })
                    if (!exam)
                        return code404('Exam Entry not found!')

                    const mime = 'application/pdf'
                    const encoding = 'base64'
                    const filePath = path.join(__dirname, 'database', 'exams', examId, studentId + '.pdf')

                    if (!fs.existsSync(filePath))
                        return code404('Exam PDF File not found!')

                    const data = fs.readFileSync(filePath, {
                        encoding: 'base64'
                    })
                    const uri = 'data:' + mime + ';' + encoding + ',' + data

                    return code200(uri)
                },
                observations: async ({ studentId }, { code200, code404 }) => {
                    if (!db.students.findOneAsync({ studentId }))
                        return code404()

                    return code200(await db.observations.findAsync({ studentId }).sort({
                        date: -1
                    }))
                },
                competencies: async ({ examId, studentId }, { code200 }) => {
                    if (examId)
                        return code200(await db.competencies.findAsync({ examId, studentId }))
                    else
                        return code200(await db.competencies.findAsync({ studentId }))
                },
                disciplines: async ({ studentId }, { code200 }) => {
                    return code200(await db.disciplines.findAsync({ studentId }))
                }
            },
            POST: {
                exam: async ({ examId, studentId, dataURI }, { code200, code409 }) => {
                    const exam = await db.exams.findOneAsync({ examId, studentId })
                    if (exam)
                        return code409()

                    const filePath = path.join(__dirname, 'database', 'exams', examId, studentId + '.pdf')

                    if (fs.existsSync(filePath))
                        return code409()

                    const buf = Buffer.from(dataURI, 'binary')
                    fs.mkdirSync(path.join(filePath, '../'), {
                        recursive: true
                    })
                    fs.writeFileSync(filePath, buf)

                    let pythonProcess
                    try {
                        pythonProcess = spawnSync('C:\\Python312\\python.exe', [path.join(__dirname, 'LLM', 'LLMVerarbeitungMultiTest.py')], {
                            cwd: path.join(__dirname, 'LLM'),
                        })
                    } catch (error) {
                        return console.log('Python process failed')
                    }

                    const parsed: { "main-competency": string; "sub-competency": string; "grade": string }[] = JSON.parse('[' + pythonProcess.stdout.toString().replace(/\}\r?\n\{/g, '},\n{').replace(/\r?\n/g, '') + ']')

                    const date = new Date().toISOString()

                    await db.exams.insertAsync({ examId, studentId, date })

                    for (const obj of parsed) {
                        await db.competencies.insertAsync({
                            examId,
                            studentId,
                            main: obj["main-competency"],
                            sub: obj["sub-competency"],
                            grade: parseInt(obj["grade"]),
                        })
                    }

                    return code200()
                },
                observation: async ({ studentId, observation }, { code200 }) => {
                    const date = new Date().toISOString()
                    await db.observations.insertAsync({ studentId, observation, date })

                    await db.disciplines.insertAsync({
                        date,
                        studentId,
                        discipline: 'Aufpassen',
                        grade: Math.round(Math.random() * 100),
                    })

                    // chatGPTGradeObservation()

                    // for (const obj of parsed) {
                    //     await db.disciplines.insertAsync({
                    //         date,
                    //         studentId,
                    //         discipline: obj["discipline"],
                    //         grade: parseInt(obj["grade"]),
                    //     })
                    // }

                    return code200()
                }
            }
        })
    }

    if (!url.pathname.includes('..') && !url.pathname.includes('@')) {
        const filePath = path.join(__dirname, 'frontend', /\/[^\/]+\.[^\/]+$/.test(url.pathname) ? decodeURIComponent(url.pathname) : 'index.html')

        if (!fs.existsSync(filePath)) {
            res
                .writeHead(404, {
                    'Content-Type': 'text/plain'
                })
                .end('Requested file was not found!')
        }
        else {
            fs.readFile(filePath, (err, data) => {
                if (!err) {
                    res
                        .writeHead(200, {
                            'Content-Type': mime.lookup(filePath) || 'text/plain'
                        })
                        .end(data)
                }
                else {
                    res
                        .writeHead(500, {
                            'Content-Type': 'text/plain'
                        })
                        .end('Failed to read requested file')
                }
            })
        }
    }
    else {
        res
            .writeHead(403, `403\nPath Not Allowed (${url.pathname})`, {
                'Content-Type': 'text/plain'
            })
            .end()
    }
})

server.listen(3000, () => {
    test()
    console.log('Server is running')
})

async function test(examId = '1', studentId = 'XIaZK6S7XRab6Kfw') {
    console.log('test function')
    let pythonProcess
    try {
        pythonProcess = spawnSync('C:\\Python312\\python.exe', [path.join(__dirname, 'LLM', 'LLMVerarbeitungMultiTest.py')], {
            cwd: path.join(__dirname, 'LLM'),
        })
    } catch (error) {
        return console.log('Python process failed')
    }

    // console.log('[' + pythonProcess.stdout.toString().replace(/\}\r?\n\{/g, '},\n{').replace(/\r?\n/g, '') + ']')
    const parsed: { "main-competency": string; "sub-competency": string; "grade": string }[] = JSON.parse('[' + pythonProcess.stdout.toString().replace(/\}\r?\n\{/g, '},\n{').replace(/\r?\n/g, '') + ']')
    console.log(parsed)
    // console.log('ERR:')
    // console.log(pythonProcess.stderr.toString())

    if (pythonProcess.signal) {
        throw new Error(`Python process was killed by signal: ${pythonProcess.signal}`)
    }

    const date = new Date().toISOString()

    await db.exams.insertAsync({ examId, studentId, date })

    for (const obj of parsed) {
        await db.competencies.insertAsync({
            examId,
            studentId,
            main: obj["main-competency"],
            sub: obj["sub-competency"],
            grade: parseInt(obj["grade"]),
        })
    }
}