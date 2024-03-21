/**
 * @type {[RegExp, HTMLElement[]]}
 */
const showRules = []

/**
 *
 * @param {RegExp} condition
 * @param  {...HTMLElement} elements
 */
function showWhile(condition, ...elements) {
    showRules.push([condition, elements])
    validateShowRules(true)
}

/**
 *
 * @param  {...string} path path, can be separated by '/' or by multiple arguments, in which case auto-joined with '/'
 */
function navigateTo(...path) {
    window.history.replaceState({}, '', window.location.pathname + ('?/' + path.join('/') + '/').replace(/\/+/g, '/'))
    validateShowRules()
}

/**
 *
 * @param  {string} path sets latest path to given value, same as sub -1 then add
 */
function setNav(path) {
    navigateTo(getSplitPath().slice(0, -1), path)
}

/**
 *
 * @param  {...string} path adds onto current path
 */
function addNavigate(...path) {
    navigateTo(window.location.search.slice(1), ...path)
}

/**
 *
 * @returns {string[]}
 */
function getSplitPath() {
    return window.location.search.slice(2, -1).split('/')
}

/**
 *
 * @param  {number} levels how many levels to drop
 */
function subNavigate(levels = 1) {
    if (levels <= 0)
        return

    navigateTo(...getSplitPath().slice(0, -levels))
}

function validateShowRules(onlyLatest = false) {
    const rules = (onlyLatest) ? showRules.slice(-1) : showRules

    const location = window.location.search.slice(1).replace(/\/+/g, '/')

    for (const [condition, elements] of rules) {
        if (condition.test(location)) {
            for (const element of elements) {
                element.style.display = 'block'
            }
        } else {
            for (const element of elements) {
                element.style.display = 'none'
            }
        }
    }
}

window.addEventListener('load', e => {
    validateShowRules()
})