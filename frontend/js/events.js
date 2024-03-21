document.addEventListener("DOMContentLoaded", function() {
    const personRows = document.querySelectorAll('.person');
    const personDetails = document.querySelectorAll('.person-details');

    personRows.forEach(row => {
        row.addEventListener('click', function() {
            const personName = this.dataset.person;
            personDetails.forEach(detail => {
                if (detail.id === `${personName}`) {
                    detail.classList.add('active');
                } else {
                    detail.classList.remove('active');
                }
            });
            document.getElementById('studentTable').style.display = 'none';
        });
    });
});