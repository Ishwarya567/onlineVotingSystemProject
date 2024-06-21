
document.addEventListener('DOMContentLoaded', () => {
    const electionOptions = document.querySelectorAll('.options');
    const voteCounts = document.querySelectorAll('.voteCounts');
    const ctx = document.getElementById('resultChart').getContext('2d');
    const resultChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels:electionOptions,
            datasets:[
                {
                label: 'No of Votes',
                data:voteCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    document.addEventListener('DOMContentLoaded', () => {
        resultChart();
});
});