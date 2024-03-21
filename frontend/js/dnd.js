const examIdInput = document.getElementById('examId')
const dropArea = document.getElementById('dropArea')
const fileInput = document.getElementById('pdfFile')
const submit = document.querySelector('#uploadForm button[type="submit"]')

/**
 * @type {string | null}
 */
let currentFile = null
/**
 * @type {string | null}
 */
let currentStudentId = null
/**
 * @type {string | null}
 */
let examId = null

onNavTo(/\/upload-overlay\/([^\/]+)\//, match => {
  currentFile = null
  currentStudentId = match[1]
  examId = null
  examIdInput.value = ''
})

examIdInput.addEventListener('input', () => {
  examId = examIdInput.value
})

// Prevent default behavior (opening file in browser)
dropArea.addEventListener('dragover', (event) => {
  event.preventDefault()
})

dropArea.addEventListener('drop', (event) => {
  event.preventDefault()
  const files = event.dataTransfer.files
  handleFiles(files)
})

dropArea.addEventListener('click', () => {
  fileInput.click()
})

fileInput.addEventListener('change', () => {
  const files = fileInput.files
  handleFiles(files)
})

function handleFiles(files) {
  if (files.length > 0) {
    const file = files[0]
    const reader = new FileReader()

    reader.addEventListener('load', () => {
      currentFile = reader.result

      console.log(currentFile)
    })

    if (file) {
      reader.readAsBinaryString(file)
    }
  }
}

submit.addEventListener('click', async () => {
  if (currentStudentId === null) {
    alert('No student selected')
    return
  }

  if (examId === null) {
    alert('No exam ID provided')
    return
  }

  if (currentFile === null) {
    alert('No file selected')
    return
  }

  const res = await api.createExam({
    studentId: currentStudentId,
    examId: examId,
    dataURI: currentFile
  })

  if (!res.ok) {
    alert('Error uploading exam')
    return
  }

  console.log('successfully uploaded exam')

  subNavigate(2)
})