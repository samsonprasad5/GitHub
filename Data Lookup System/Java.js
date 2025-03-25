<<<<<<< HEAD
// ========== Live Search and Highlighting ==========
document.querySelector('input[name="search"]').addEventListener('input', function () {
    let searchTerm = this.value.toLowerCase();
    let rows = document.querySelectorAll('table tbody tr');

    rows.forEach(row => {
        let cells = row.getElementsByTagName('td');
        let matchFound = false;

        cells.forEach(cell => {
            cell.innerHTML = cell.textContent;  // Reset any previous highlights

            if (cell.textContent.toLowerCase().includes(searchTerm)) {
                matchFound = true;
                let highlightedText = cell.textContent.replace(
                    new RegExp(searchTerm, 'gi'),
                    match => `<mark>${match}</mark>`
                );
                cell.innerHTML = highlightedText;
            }
        });

        row.style.display = matchFound ? '' : 'none';
    });
});

// ========== Form Validation ==========
document.querySelector('form').addEventListener('submit', function (event) {
    let searchTerm = document.querySelector('input[name="search"]').value.trim();
    if (!searchTerm) {
        event.preventDefault();  // Prevent form submission if search is empty
        alert("Please enter a valid search term.");
        document.querySelector('input[name="search"]').focus();
    }
});

// ========== Table Sorting ==========
document.querySelectorAll('th').forEach((header, index) => {
    header.addEventListener('click', function () {
        let rows = Array.from(document.querySelectorAll('table tbody tr'));
        let isAscending = header.classList.contains('asc');

        rows.sort((rowA, rowB) => {
            let cellA = rowA.cells[index].textContent.trim();
            let cellB = rowB.cells[index].textContent.trim();
            return isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
        });

        header.classList.toggle('asc', !isAscending);
        header.classList.toggle('desc', isAscending);

        let tbody = document.querySelector('table tbody');
        tbody.innerHTML = '';
        rows.forEach(row => tbody.appendChild(row));
    });
});

// ========== Pagination ==========
const rowsPerPage = 5;
let currentPage = 1;

function displayPage(page) {
    const rows = document.querySelectorAll('table tbody tr');
    const totalPages = Math.ceil(rows.length / rowsPerPage);

    rows.forEach(row => row.style.display = 'none');
    const start = (page - 1) * rowsPerPage;
    const end = page * rowsPerPage;

    for (let i = start; i < end && i < rows.length; i++) {
        rows[i].style.display = '';
    }

    updatePaginationControls(totalPages);
}

function updatePaginationControls(totalPages) {
    let pagination = document.querySelector('#pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        let pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === currentPage) pageButton.classList.add('active');

        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayPage(currentPage);
        });

        pagination.appendChild(pageButton);
    }
}

document.querySelector('#prev').addEventListener('click', () => {
    if (currentPage > 1) currentPage--;
    displayPage(currentPage);
});

document.querySelector('#next').addEventListener('click', () => {
    if (currentPage < Math.ceil(document.querySelectorAll('table tbody tr').length / rowsPerPage)) {
        currentPage++;
        displayPage(currentPage);
    }
});

displayPage(currentPage);

// ========== Toggle Column Visibility ==========
document.querySelectorAll('.toggle-column').forEach((checkbox, index) => {
    checkbox.addEventListener('change', function () {
        let column = document.querySelectorAll(`table td:nth-child(${index + 1}), table th:nth-child(${index + 1})`);
        column.forEach(cell => cell.style.display = this.checked ? '' : 'none');
    });
});
=======
// ========== Live Search and Highlighting ==========
document.querySelector('input[name="search"]').addEventListener('input', function () {
    let searchTerm = this.value.toLowerCase();
    let rows = document.querySelectorAll('table tbody tr');

    rows.forEach(row => {
        let cells = row.getElementsByTagName('td');
        let matchFound = false;

        cells.forEach(cell => {
            cell.innerHTML = cell.textContent;  // Reset any previous highlights

            if (cell.textContent.toLowerCase().includes(searchTerm)) {
                matchFound = true;
                let highlightedText = cell.textContent.replace(
                    new RegExp(searchTerm, 'gi'),
                    match => `<mark>${match}</mark>`
                );
                cell.innerHTML = highlightedText;
            }
        });

        row.style.display = matchFound ? '' : 'none';
    });
});

// ========== Form Validation ==========
document.querySelector('form').addEventListener('submit', function (event) {
    let searchTerm = document.querySelector('input[name="search"]').value.trim();
    if (!searchTerm) {
        event.preventDefault();  // Prevent form submission if search is empty
        alert("Please enter a valid search term.");
        document.querySelector('input[name="search"]').focus();
    }
});

// ========== Table Sorting ==========
document.querySelectorAll('th').forEach((header, index) => {
    header.addEventListener('click', function () {
        let rows = Array.from(document.querySelectorAll('table tbody tr'));
        let isAscending = header.classList.contains('asc');

        rows.sort((rowA, rowB) => {
            let cellA = rowA.cells[index].textContent.trim();
            let cellB = rowB.cells[index].textContent.trim();
            return isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
        });

        header.classList.toggle('asc', !isAscending);
        header.classList.toggle('desc', isAscending);

        let tbody = document.querySelector('table tbody');
        tbody.innerHTML = '';
        rows.forEach(row => tbody.appendChild(row));
    });
});

// ========== Pagination ==========
const rowsPerPage = 5;
let currentPage = 1;

function displayPage(page) {
    const rows = document.querySelectorAll('table tbody tr');
    const totalPages = Math.ceil(rows.length / rowsPerPage);

    rows.forEach(row => row.style.display = 'none');
    const start = (page - 1) * rowsPerPage;
    const end = page * rowsPerPage;

    for (let i = start; i < end && i < rows.length; i++) {
        rows[i].style.display = '';
    }

    updatePaginationControls(totalPages);
}

function updatePaginationControls(totalPages) {
    let pagination = document.querySelector('#pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        let pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === currentPage) pageButton.classList.add('active');

        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayPage(currentPage);
        });

        pagination.appendChild(pageButton);
    }
}

document.querySelector('#prev').addEventListener('click', () => {
    if (currentPage > 1) currentPage--;
    displayPage(currentPage);
});

document.querySelector('#next').addEventListener('click', () => {
    if (currentPage < Math.ceil(document.querySelectorAll('table tbody tr').length / rowsPerPage)) {
        currentPage++;
        displayPage(currentPage);
    }
});

displayPage(currentPage);

// ========== Toggle Column Visibility ==========
document.querySelectorAll('.toggle-column').forEach((checkbox, index) => {
    checkbox.addEventListener('change', function () {
        let column = document.querySelectorAll(`table td:nth-child(${index + 1}), table th:nth-child(${index + 1})`);
        column.forEach(cell => cell.style.display = this.checked ? '' : 'none');
    });
});
>>>>>>> 163f2cb8f9ede66347787ae1801c663328d43c02
