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
}

const api = new API()