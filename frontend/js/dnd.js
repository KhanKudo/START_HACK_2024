const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('pdfFile');

// Prevent default behavior (opening file in browser)
dropArea.addEventListener('dragover', (event) => {
  event.preventDefault();
});

dropArea.addEventListener('drop', (event) => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  handleFiles(files);
});

dropArea.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  const files = fileInput.files;
  handleFiles(files);
});

function handleFiles(files) {
  // Handle uploaded files
  if (files.length > 0) {
    const file = files[0];
    console.log('Uploaded file:', file);
    // You can perform further actions with the uploaded file here
  }
}
