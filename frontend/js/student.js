api.setToken("admin")

api.getStudents().then(({ data, ok }) => {
  if (!ok)
    return console.error(data)

  data.forEach(student => {
    document.querySelector('#studentTable tbody').append(createStudentRow(
      {
        _id: student._id,
        name: student.lastName + ' ' + student.firstName,
        lastUpdate: new Date().toLocaleDateString(),
        trend: 'Up',
        data: [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
        ]
      }
    ))
  })
})

window.addEventListener('load', e => {
  showWhile(/\/students\//, document.getElementById('studentTable').parentElement)
  showWhile(/\/upload-overlay\//, document.getElementById('overlay'))
  showWhile(/\/student\//, document.querySelector('.person-details'))

  document.getElementById('closeOverlay').addEventListener('click', () => {
    subNavigate(2)
  })

  document.getElementById('uploadForm').addEventListener('submit', (event) => {
    event.preventDefault()
    // Perform upload action here
    console.log('Exam ID:', document.getElementById('examId').value)
    console.log('PDF File:', document.getElementById('pdfFile').files[0])
  })

  onNavTo(/\/student\/([^\/]+)\//, match => {
    const studentId = match[1]
    loadDataForStudent(studentId)
  })
})

function createStudentRow(student) {
  const tr = document.createElement('tr')
  tr.innerHTML = `
  <td>${student.name}</td>
  <td>${student.lastUpdate}</td>
  <td>${student.trend}</td>
  <td><button class="upload-btn">Upload</button></td>
  `

  tr.querySelector('.upload-btn').addEventListener('click', (event) => {
    event.stopPropagation()
    console.log('Upload button clicked for student:', student)
    addNavigate('upload-overlay', student._id)
  })

  tr.addEventListener('click', (event) => {
    if (getSplitPath().includes(student._id)) {
      navigateTo('students')
      return
    }

    navigateTo('student', student._id)
  })

  return tr
}

const studentData = {
  name: 'John Doe',
  lastUpdate: new Date().toLocaleDateString(),
  trend: 'Up',
  data: [
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
  ]
}

async function loadDataForStudent(studentId) {
  const student = studentData
  // Here you can fetch data for the selected student and update the radar chart and line chart accordingly
  // Radar Chart Data
  const radarDataMath = {
    labels: ['1 | Operieren und Benennen', '1 | Erforschen und Argumentieren', '1 | Mathematisieren und Darstellen',
      '2 | Operieren und Benennen', '2 | Erforschen und Argumentieren', '2 | Mathematisieren und Darstellen',
      '3 | Operieren und Benennen', '3 | Erforschen und Argumentieren', '3 | Mathematisieren und Darstellen'],
    datasets: [{
      label: student.name,
      data: student.data,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  }
  const radarDataInt = {
    labels: ['Selbstreflexion', 'Selbstständigkeit', 'Dialog & Kooperationsfähigkeit'],
    datasets: [{
      label: student.name,
      data: student.data,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  }

  // Line Chart Data
  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [{
      label: 'Performance',
      data: [200, 150, 200, 250, 300, 350],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  }

  // Radar Chart Configuration
  const radarConfigMath = {
    type: 'radar',
    data: radarDataMath,
    options: {
      scales: {
        r: {
          angleLines: {
            display: false
          },
          suggestedMin: 0,
          suggestedMax: 100
        }
      }
    }
  }

  const radarConfigInt = {
    type: 'radar',
    data: radarDataInt,
    options: {
      scales: {
        r: {
          angleLines: {
            display: false
          },
          suggestedMin: 0,
          suggestedMax: 100
        }
      }
    }
  }

  // Line Chart Configuration
  const lineConfig = {
    type: 'line',
    data: lineData,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  }

  // Create Radar Chart
  const radarChartCtx = document.getElementById('radarChartMath').getContext('2d')
  const radarChart = new Chart(radarChartCtx, radarConfigMath)

  const radarChartCtx2 = document.getElementById('radarChartInt').getContext('2d')
  const radarChart2 = new Chart(radarChartCtx2, radarConfigInt)

  // Create Line Chart
  const lineChartCtx = document.getElementById('lineChart').getContext('2d')
  const lineChart = new Chart(lineChartCtx, lineConfig)
}
