api.setToken("admin")

if (window.location.search === '')
  navigateTo('students')

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
        ],
        trendData: [100, 50, 70, 40, 70, 90],
      }
    ))
  })
})

window.addEventListener('load', e => {
  showWhile(/\/students\//, document.getElementById('studentTable').parentElement)
  showWhile(/\/upload-overlay\//, document.getElementById('overlay'))
  showWhile(/\/student\//, document.querySelector('.person-details'))
  showWhile(/\/student\/[^\/]+\/$/, document.querySelector('.person-details>.chart-container'))
  showWhile(/\/student\/[^\/]+\/personal-exams\//, document.getElementById('personal-exams'))
  showWhile(/\/student\/[^\/]+\/personal-observations\//, document.getElementById('personal-observations'))

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

  document.getElementById('personal-exams-button').addEventListener('click', () => {
    if (/\/student\/[^\/]+\/personal-/.test(window.location.search))
      setNav('personal-exams')
    else
      addNavigate('personal-exams')
  })

  onNavTo(/\/student\/([^\/]+)\/personal-exams\//, match => {
    api.getExams({ studentId: match[1] }).then(({ data, ok, status }) => {
      if (!ok)
        return console.error(status, data)

      data.forEach(exam => {
        const div = document.createElement('div')
        div.innerText = exam.examId

        div.addEventListener('click', () => {
          window.open('/exams/' + exam.examId + '/' + exam.studentId + '.pdf', '_blank')
        })

        document.getElementById('personal-exams').append(div)
      })
    })
  })

  document.getElementById('personal-observations-button').addEventListener('click', () => {
    if (/\/student\/[^\/]+\/personal-/.test(window.location.search))
      setNav('personal-observations')
    else
      addNavigate('personal-observations')
  })
})

function createStudentRow(student) {
  const tr = document.createElement('tr')
  tr.innerHTML = `
  <td>${student.name}</td>
  <td>${student.lastUpdate}</td>
  <td><canvas class="trend-chart" width="100px" height="40px"></canvas></td>
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

  const canvas = tr.querySelector('.trend-chart');
  drawMiniChart(canvas, student.trendData); // Pass student's trend data to draw the mini chart


  return tr
}

function drawMiniChart(canvas, data) {
  const ctx = canvas.getContext('2d');
  const maxValue = 100;
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw chart based on data
  // Example: draw a simple line
  ctx.beginPath();
  ctx.moveTo(0, 0);
  for (let i = 0; i < data.length; i++) {
    const value = data[i]; // Assuming data is an array of values
    const x = (i / (data.length - 1)) * canvas.width;
    const y = canvas.height - (value / maxValue) * canvas.height; // Scale value to fit canvas height
    //console.log(x, y)
    ctx.lineTo(x, y);
  }
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 1;
  ctx.stroke();
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

  api.getExams({ studentId }).then(({ data, ok, status }) => {
    if (!ok)
      return console.error(status, data)

    data.forEach(exam => {
      document.querySelector('#examTable tbody').append(createExamRow(exam))
    })
  })
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
    labels: ['Selbstreflexion', 'Dialog- und Kooperationsf\u00e4higkeit', 'Sprachf\u00e4higkeit',
  'Aufgaben/Probleme l\u00f6sen', 'Selbstst\u00e4ndigkeit', 'Eigenst\u00e4ndigkeit',
'Konfliktf\u00e4higkeit', 'Informationen nutzen', 'Umgang mit Vielfalt'],
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
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [{
      label: 'Performance',
      data: [200, 150, 200, 250, 300, 350, 200, 250, 300, 350, 200, 150],
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
          beginAtZero: false,
          maintainAspectRatio: false
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