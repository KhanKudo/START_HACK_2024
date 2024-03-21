import { Server } from 'http'
import path from 'path'
import * as fs from 'fs'
import * as mime from 'mime-types'
import { askChatGPT } from './chatgpt'
import { db, getTokenAccess } from './data-handler'
import { handler } from './server-sdk'

// db.students.insertAsync({ firstName: 'Jane', lastName: 'Smith' }).then(console.log)
db.students.findAsync({}).sort({
    lastName: 1,
    firstName: 1,
}).then(console.log)

const server = new Server(async (req, res) => {
    const url = new URL(req.url ?? '', 'http://localhost:3000')

    if (url.pathname.startsWith('/api')) {
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
                    return code200(await db.exams.findAsync({ examId, studentId }))
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

                    const data = fs.readFileSync(filePath).toString(encoding)
                    const uri = 'data:' + mime + ';' + encoding + ',' + data

                    return code200(uri)
                }
            },
            POST: {
                exam: async ({ examId, studentId, dataURI }, { code200, code409 }) => {
                    const exam = await db.exams.findOneAsync({ examId, studentId })
                    if (!exam)
                        return code409()

                    const filePath = path.join(__dirname, 'database', 'exams', examId, studentId + '.pdf')

                    if (fs.existsSync(filePath))
                        return code409()

                    await db.exams.insertAsync({ examId, studentId, dataURI })

                    if (dataURI) {
                        const fs = require('fs')
                        const uri = dataURI
                        const data = uri.split(',')[1]
                        const buf = Buffer.from(data).toString('base64')
                        fs.writeFileSync(filePath, buf)
                    }

                    return code200()
                }
            }
        })
    }

    if (!url.pathname.includes('..') && !url.pathname.includes('@')) {
        const filePath = path.join(__dirname, 'frontend', decodeURIComponent(url.pathname))

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
    console.log('Server is running')
})