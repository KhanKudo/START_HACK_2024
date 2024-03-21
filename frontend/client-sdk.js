/// <reference lib="DOM" />

class API {
    /** @type {string | null} */
    _token = null

    /** @type {string} */
    _hostname = ''

    constructor() {
        // throw new Error('This class is only intended to be used as a namespace. No instances should be created, static members only.')
        this._token = localStorage.getItem('token') || null
    }

    /**
     * loads the token and saves it to localStorage. It will be automatically loaded again after a refresh
     * @param {string} token
     */
    setToken(token) {
        this._token = token
        localStorage.setItem('token', token)
    }

    /**
     * check whether or not a token exists
     * @returns {boolean}
     */
    hasToken() {
        return this._token !== null
    }

    /**
     * unloads the token and deletes it from localStorage.
     */
    forgetToken() {
        this._token = null
        localStorage.removeItem('token')
    }

    /**
     * by default, the current url is assumed as target host.
     * this can be used to set a specific host. Useful for local development without local server.
     * Note, format https://{hostname}{prefix}{endpoint} is forced, http is not allowed. Do not append '/'.
     * @param {string} hostname
     */
    setHostname(hostname = '') {
        this._hostname = (hostname === '') ? '' : 'https://' + hostname
    }

    /**
                     * @param {{"token":string}} data
                     * @returns {Promise<{status:200,ok:true,data:{"accessLevel":number}}|{status:400,ok:false,data:"Provided request data does not match expected request data type."}|{status:401,ok:false,data:"No Token Provided."}|{status:403,ok:false,data:"Provided Token does not have sufficient access rights."}|{status:404,ok:false,data:string}|{status:500,ok:false,data:"An unexpected error has occurred while processing the request."}>}
                     */
                    async getTokenAccess(data) {
            const res = await fetch(`${this._hostname}/api/tokenAccess?json=${JSON.stringify(data)}`, {
                method: "GET",

                headers: {

                    "Content-Type": "application/x-www-form-urlencoded",
                }
            })

            return {
                status: res.status,
                ok: res.status >= 200 && res.status < 300,
                data: (res.status === 200)?await res.json():(res.status === 400)?await res.text():(res.status === 401)?await res.text():(res.status === 403)?await res.text():(res.status === 404)?await res.text():(res.status === 500)?await res.text():null
            }
        }

/**
                     * @param {undefined=} data
                     * @returns {Promise<{status:200,ok:true,data:({"firstName":string,"lastName":string})[]}|{status:400,ok:false,data:"Provided request data does not match expected request data type."}|{status:401,ok:false,data:"No Token Provided."}|{status:403,ok:false,data:"Provided Token does not have sufficient access rights."}|{status:404,ok:false,data:string}|{status:500,ok:false,data:"An unexpected error has occurred while processing the request."}>}
                     */
                    async getStudents(data = undefined) {
            const res = await fetch(`${this._hostname}/api/students?json=${JSON.stringify(data)}`, {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${this._token}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            })

            return {
                status: res.status,
                ok: res.status >= 200 && res.status < 300,
                data: (res.status === 200)?await res.json():(res.status === 400)?await res.text():(res.status === 401)?await res.text():(res.status === 403)?await res.text():(res.status === 404)?await res.text():(res.status === 500)?await res.text():null
            }
        }

/**
                     * @param {{"examId":string,"studentId":string}} data
                     * @returns {Promise<{status:200,ok:true,data:{"studentId":string,"examId":string}}|{status:400,ok:false,data:"Provided request data does not match expected request data type."}|{status:401,ok:false,data:"No Token Provided."}|{status:403,ok:false,data:"Provided Token does not have sufficient access rights."}|{status:404,ok:false,data:"Exam not found!"}|{status:500,ok:false,data:"An unexpected error has occurred while processing the request."}>}
                     */
                    async getExam(data) {
            const res = await fetch(`${this._hostname}/api/exam?json=${JSON.stringify(data)}`, {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${this._token}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            })

            return {
                status: res.status,
                ok: res.status >= 200 && res.status < 300,
                data: (res.status === 200)?await res.json():(res.status === 400)?await res.text():(res.status === 401)?await res.text():(res.status === 403)?await res.text():(res.status === 404)?await res.text():(res.status === 500)?await res.text():null
            }
        }

/**
                     * @param {({"examId":string,"studentId":undefined}|{"examId":undefined,"studentId":string})} data
                     * @returns {Promise<{status:200,ok:true,data:({"studentId":string,"examId":string})[]}|{status:400,ok:false,data:"Provided request data does not match expected request data type."}|{status:401,ok:false,data:"No Token Provided."}|{status:403,ok:false,data:"Provided Token does not have sufficient access rights."}|{status:404,ok:false,data:string}|{status:500,ok:false,data:"An unexpected error has occurred while processing the request."}>}
                     */
                    async getExams(data) {
            const res = await fetch(`${this._hostname}/api/exams?json=${JSON.stringify(data)}`, {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${this._token}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            })

            return {
                status: res.status,
                ok: res.status >= 200 && res.status < 300,
                data: (res.status === 200)?await res.json():(res.status === 400)?await res.text():(res.status === 401)?await res.text():(res.status === 403)?await res.text():(res.status === 404)?await res.text():(res.status === 500)?await res.text():null
            }
        }

/**
                     * @param {{"examId":string,"studentId":string}} data
                     * @returns {Promise<{status:200,ok:true,data:string}|{status:400,ok:false,data:"Provided request data does not match expected request data type."}|{status:401,ok:false,data:"No Token Provided."}|{status:403,ok:false,data:"Provided Token does not have sufficient access rights."}|{status:404,ok:false,data:("Exam Entry not found!"|"Exam PDF File not found!")}|{status:500,ok:false,data:"An unexpected error has occurred while processing the request."}>}
                     */
                    async getExamPDF(data) {
            const res = await fetch(`${this._hostname}/api/examPDF?json=${JSON.stringify(data)}`, {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${this._token}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            })

            return {
                status: res.status,
                ok: res.status >= 200 && res.status < 300,
                data: (res.status === 200)?await res.text():(res.status === 400)?await res.text():(res.status === 401)?await res.text():(res.status === 403)?await res.text():(res.status === 404)?await res.json():(res.status === 500)?await res.text():null
            }
        }

/**
                     * @param {{"studentId":string}} data
                     * @returns {Promise<{status:200,ok:true,data:({"studentId":string,"observation":string,"date":string})[]}|{status:400,ok:false,data:"Provided request data does not match expected request data type."}|{status:401,ok:false,data:"No Token Provided."}|{status:403,ok:false,data:"Provided Token does not have sufficient access rights."}|{status:404,ok:false,data:"Student not found!"}|{status:500,ok:false,data:"An unexpected error has occurred while processing the request."}>}
                     */
                    async getObservations(data) {
            const res = await fetch(`${this._hostname}/api/observations?json=${JSON.stringify(data)}`, {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${this._token}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            })

            return {
                status: res.status,
                ok: res.status >= 200 && res.status < 300,
                data: (res.status === 200)?await res.json():(res.status === 400)?await res.text():(res.status === 401)?await res.text():(res.status === 403)?await res.text():(res.status === 404)?await res.text():(res.status === 500)?await res.text():null
            }
        }

/**
                     * @param {{"studentId":string,"examId":string,"dataURI":(undefined|string)}} data
                     * @returns {Promise<{status:200,ok:true,data:"Exam successfully added!"}|{status:400,ok:false,data:"Provided request data does not match expected request data type."}|{status:401,ok:false,data:"No Token Provided."}|{status:403,ok:false,data:"Provided Token does not have sufficient access rights."}|{status:404,ok:false,data:string}|{status:409,ok:false,data:"Exam already exists!"}|{status:500,ok:false,data:"An unexpected error has occurred while processing the request."}>}
                     */
                    async createExam(data) {
            const res = await fetch(`${this._hostname}/api/exam`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Authorization": `Bearer ${this._token}`,
                    "Content-Type": "application/json",
                }
            })

            return {
                status: res.status,
                ok: res.status >= 200 && res.status < 300,
                data: (res.status === 200)?await res.text():(res.status === 400)?await res.text():(res.status === 401)?await res.text():(res.status === 403)?await res.text():(res.status === 404)?await res.text():(res.status === 409)?await res.text():(res.status === 500)?await res.text():null
            }
        }

/**
                     * @param {{"studentId":string,"observation":string}} data
                     * @returns {Promise<{status:200,ok:true,data:"Observation successfully added!"}|{status:400,ok:false,data:"Provided request data does not match expected request data type."}|{status:401,ok:false,data:"No Token Provided."}|{status:403,ok:false,data:"Provided Token does not have sufficient access rights."}|{status:404,ok:false,data:string}|{status:500,ok:false,data:"An unexpected error has occurred while processing the request."}>}
                     */
                    async createObservation(data) {
            const res = await fetch(`${this._hostname}/api/observation`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Authorization": `Bearer ${this._token}`,
                    "Content-Type": "application/json",
                }
            })

            return {
                status: res.status,
                ok: res.status >= 200 && res.status < 300,
                data: (res.status === 200)?await res.text():(res.status === 400)?await res.text():(res.status === 401)?await res.text():(res.status === 403)?await res.text():(res.status === 404)?await res.text():(res.status === 500)?await res.text():null
            }
        }
}

const api = new API()