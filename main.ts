import { Server } from 'http'
import path from 'path'
import * as fs from 'fs'
import * as mime from 'mime-types'
import { askChatGPT } from './chatgpt'
import { Student, db, getTokenAccess } from './data-handler'
import { handler } from './SDKs/server-sdk'

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
                students: async (data, { code200 }) => {
                    return code200(await db.students.findAsync({}).sort({
                        lastName: 1,
                        firstName: 1,
                    }))
                },
                tokenAccess: async ({ token }, { code200 }) => {
                    return code200({
                        accessLevel: await getTokenAccess(token)
                    })
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