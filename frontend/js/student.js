api.setToken("admin")

if (window.location.search === '')
	navigateTo('students')

let students = []

function getStudent(studentId) {
	return students.find(student => student._id === studentId)
}

api.getStudents().then(({ data, ok }) => {
	if (!ok)
		return console.error(data)

	students = data

	data.forEach(student => {
		document.querySelector('#studentTable tbody').append(createStudentRow(
			{
				_id: student._id,
				name: `${student.lastName} ${student.firstName}`,
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
	showWhile(/\/student\/[^\/]+\/$/, document.querySelector('.person-details .chart-container').parentElement)
	showWhile(/\/student\/[^\/]+\/personal-exams\//, document.getElementById('personal-exams'))
	showWhile(/\/student\/[^\/]+\/personal-observations\//, document.getElementById('personal-observations'))
	showWhile(/\/student\/[^\/]+\/personal-objectives\//, document.getElementById('personal-objectives'))

	document.getElementById('personal-student-button').addEventListener('click', () => {
		if (/\/student\/[^\/]+\/personal-/.test(window.location.search))
			subNavigate(1)
	})

	document.getElementById('observationsInput').addEventListener('change', (e) => {
		const text = e.target.value

		if (text.trim() === '')
			return

		e.target.value = ''

		api.createObservation({
			studentId: window.location.search.match(/\/student\/([^\/]+)\//)[1],
			observation: text.trim()
		})

		if (/\/student\/[^\/]+\/personal-observations\//.test(window.location.search)) {
			addNavigate() // if empty, simply triggers re-render of current page
		}
	})

	document.getElementById('closeOverlay').addEventListener('click', () => {
		subNavigate(2)
	})

	onNavTo(/\/student\/([^\/]+)\//, match => {
		const studentId = match[1]
		loadDataForStudent(studentId)

		if (/\/student\/[^\/]+\/personal-/.test(window.location.search))
			return

		document.querySelectorAll('.side-bar>div').forEach(div => div.classList.remove('active'))
		document.getElementById('personal-student-button').classList.add('active')
	})

	document.getElementById('personal-exams-button').addEventListener('click', () => {
		if (/\/student\/[^\/]+\/personal-/.test(window.location.search))
			setNav('personal-exams')
		else
			addNavigate('personal-exams')
	})

	onNavTo(/\/student\/([^\/]+)\/personal-exams\//, match => {
		document.querySelectorAll('.side-bar>div').forEach(div => div.classList.remove('active'))
		document.getElementById('personal-exams-button').classList.add('active')

		api.getExams({ studentId: match[1] }).then(({ data, ok, status }) => {
			if (!ok)
				return console.error(status, data)

			document.getElementById('personal-exams').replaceChildren(...data.map(exam => {
				const div = document.createElement('div')
				div.innerText = exam.examId

				div.addEventListener('click', () => {
					window.open('/exams/' + exam.examId + '/' + exam.studentId + '.pdf', '_blank')
				})

				return div
			}))
		})
	})

	document.getElementById('personal-observations-button').addEventListener('click', () => {
		if (/\/student\/[^\/]+\/personal-/.test(window.location.search))
			setNav('personal-observations')
		else
			addNavigate('personal-observations')
	})

	onNavTo(/\/student\/([^\/]+)\/personal-observations\//, match => {
		document.querySelectorAll('.side-bar>div').forEach(div => div.classList.remove('active'))
		document.getElementById('personal-observations-button').classList.add('active')

		api.getObservations({ studentId: match[1] }).then(({ data, ok, status }) => {
			if (!ok)
				return console.error(status, data)

			document.getElementById('personal-observations').replaceChildren(...data.map(data => {
				const div = document.createElement('div')
				div.innerText = data.observation + ' - ' + new Date(data.date).toLocaleString()
				return div
			}))
		})
	})

	document.getElementById('personal-objectives-button').addEventListener('click', () => {
		if (/\/student\/[^\/]+\/personal-/.test(window.location.search))
			setNav('personal-objectives')
		else
			addNavigate('personal-objectives')
	})

	onNavTo(/\/student\/([^\/]+)\/personal-objectives\//, match => {
		document.querySelectorAll('.side-bar>div').forEach(div => div.classList.remove('active'))
		document.getElementById('personal-objectives-button').classList.add('active')
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

	const canvas = tr.querySelector('.trend-chart')
	drawMiniChart(canvas, student.trendData) // Pass student's trend data to draw the mini chart

	return tr
}

function drawMiniChart(canvas, data) {
	const ctx = canvas.getContext('2d')
	const maxValue = 100
	// Clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	// Draw chart based on data
	// Example: draw a simple line
	ctx.beginPath()
	ctx.moveTo(0, 0)
	for (let i = 0; i < data.length; i++) {
		const value = data[i] // Assuming data is an array of values
		const x = (i / (data.length - 1)) * canvas.width
		const y = canvas.height - (value / maxValue) * canvas.height // Scale value to fit canvas height
		//console.log(x, y)
		ctx.lineTo(x, y)
	}
	ctx.strokeStyle = 'green'
	ctx.lineWidth = 1
	ctx.stroke()
}

async function loadDataForStudent(studentId) {
	const student = getStudent(studentId)
	class Avg {
		count = 0
		sum = 0
		add(val) {
			this.count++
			this.sum += val
		}

		avg() {
			return this.sum / this.count
		}
	}

	const comps = {}

	await api.getCompetencies({ studentId }).then(({ data, ok, status }) => {
		if (!ok)
			return console.error(status, data)

		data.forEach(comp => {
			comps[comp.sub] ??= new Avg()
			comps[comp.sub].add(comp.grade)
		})
	})

	const discs = {}

	await api.getDisciplines({ studentId }).then(({ data, ok, status }) => {
		if (!ok)
			return console.error(status, data)

		data.forEach(disc => {
			discs[disc.discipline] ??= new Avg()
			discs[disc.discipline].add(disc.grade)
		})
	})

	// api.getExams({ studentId }).then(({ data, ok, status }) => {
	// 	if (!ok)
	// 		return console.error(status, data)

	// 	data.forEach(exam => {
	// 		// document.querySelector('#examTable tbody').append(createExamRow(exam))
	// 	})
	// })

	document.querySelector('#personal-student-button>span').innerText = `${student.lastName} ${student.firstName}`

	// const resComps = Object.entries(comps).map(([comp, avg]) => {
	// 	return { comp, grade: avg.avg() }
	// })

	// Here you can fetch data for the selected student and update the radar chart and line chart accordingly
	// Radar Chart Data
	const radarDataMath = {
		labels: Object.keys(comps),
		datasets: [{
			label: `${student.lastName} ${student.firstName}`,
			data: Object.values(comps).map(x => Math.round(x.avg())),
			backgroundColor: 'rgba(54, 162, 235, 0.2)',
			borderColor: 'rgba(54, 162, 235, 1)',
			borderWidth: 1
		}]
	}
	const radarDataGer = {
		labels: ['1 | Operieren und Benennen', '1 | Erforschen und Argumentieren', '1 | Mathematisieren und Darstellen',
			'2 | Operieren und Benennen', '2 | Erforschen und Argumentieren', '2 | Mathematisieren und Darstellen',
			'3 | Operieren und Benennen', '3 | Erforschen und Argumentieren', '3 | Mathematisieren und Darstellen'],
		datasets: [{
			label: `${student.lastName} ${student.firstName}`,
			data: [10,20,30,40,50,60,70,80,90],
			backgroundColor: 'rgba(106, 90, 205, 0.2)',
			borderColor: 'rgba(106, 90, 205, 1)',
			borderWidth: 1
		}]
	}
	const polarDataInt = {
		labels: Object.keys(discs),
		datasets: [{
			label: `${student.lastName} ${student.firstName}`,
			data: Object.values(discs).map(x => Math.round(x.avg())),
			backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)',
				'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
			borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)',
				'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
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

	const radarConfigGer = {
		type: 'radar',
		data: radarDataGer,
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

	const polarConfigInt = {
		type: 'polarArea',
		data: polarDataInt,
		options: {
			scales: {
				r: {
					suggestedMin: 0,
					suggestedMax: 100,
					grid: {
						display: false
					}
				}
			},
			elements: {
				line: {
					borderWidth: 0
				}
			},
			plugins: {
				legend: {
					position: 'right'
				}
			},
			pointLabels: {
				display: true,
				fontSize: 14
			}
		}
	}


	// Line Chart Configuration
	const lineConfig = {
    type: 'line',
    data: lineData,
    options: {
      scales: {
        yAxes: [{
          ticks: {
              display: false
          }
      }]
      }
    }
  };
  

	// Create Radar Chart
	const radarChartCtx = document.getElementById('radarChartMath').getContext('2d')
	const radarChart = new Chart(radarChartCtx, radarConfigMath)

	const radarChartCtx2 = document.getElementById('radarChartGer').getContext('2d')
	const radarChart2 = new Chart(radarChartCtx2, radarConfigGer)

	const polarChartCtx2 = document.getElementById('radarChartInt').getContext('2d')
	const polarChart2 = new Chart(polarChartCtx2, polarConfigInt)

	// Create Line Chart
	const lineChartCtx = document.getElementById('lineChart').getContext('2d')
	const lineChart = new Chart(lineChartCtx, lineConfig)
}
