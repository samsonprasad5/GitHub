document.addEventListener("DOMContentLoaded", function () {
  // Function to Show/Hide Sections based on Sidebar Clicks
  function showSection(section) {
    const sections = document.querySelectorAll('.hidden-content');
    sections.forEach(s => s.style.display = 'none');
    document.getElementById(section).style.display = 'block';
  }

  // Default to Dashboard on Page Load
  showSection('dashboard');

  // Toggle departments in the organization tree
  const toggleButtons = document.querySelectorAll('.toggle-btn');
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const parentLi = button.parentElement;
      const subList = parentLi.querySelector('ul');
      if (subList) {
        subList.style.display = (subList.style.display === 'none' || subList.style.display === '') ? 'block' : 'none';
        button.classList.toggle('open');
      }
      
      // If it's an employee name, show the details
      if (button.dataset.name) {
        showEmployeeDetails(button);
      }
    });
  });

  // Function to Show Employee Details in a Popup
  function showEmployeeDetails(button) {
    const employeeName = button.dataset.name;
    const employeeEmail = button.dataset.email;
    const employeePhone = button.dataset.phone;

    const popup = document.getElementById('popup');
    const detailsDiv = popup.querySelector('.details');

    detailsDiv.innerHTML = `
      <h3>Employee Details</h3>
      <p><strong>Name:</strong> ${employeeName}</p>
      <p><strong>Email:</strong> ${employeeEmail}</p>
      <p><strong>Phone:</strong> ${employeePhone}</p>
    `;

    popup.style.display = 'block'; // Show the popup
  }

  // Close Popup when clicked outside
  const popup = document.getElementById('popup');
  popup.addEventListener('click', function (e) {
    if (e.target === popup) {
      popup.style.display = 'none'; // Close the popup
    }
  });

  // Employee Management form functionality
  const employeeForm = document.getElementById('employeeForm');
  const addEmployeeButton = document.getElementById('addEmployeeButton');
  const updateEmployeeButton = document.getElementById('updateEmployeeButton');
  const cancelUpdateButton = document.getElementById('cancelUpdateButton');
  const employeeDataList = document.getElementById('employeeDataList');

  let currentEmployeeId = null; // to track the employee being updated

  // Handle Add Employee
  addEmployeeButton.addEventListener('click', function () {
    const name = document.getElementById('employeeName').value;
    const position = document.getElementById('employeePosition').value;
    const department = document.getElementById('employeeDepartment').value;

    if (name && position && department) {
      const li = document.createElement('li');
      li.innerHTML = `${name} - ${position} - ${department} 
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>`;

      const editButton = li.querySelector('.edit-btn');
      const deleteButton = li.querySelector('.delete-btn');

      editButton.addEventListener('click', () => editEmployee(li, name, position, department));
      deleteButton.addEventListener('click', () => deleteEmployee(li));

      employeeDataList.appendChild(li);
      
      // Clear the form
      employeeForm.reset();
    }
  });

  // Handle Edit Employee
  function editEmployee(li, name, position, department) {
    currentEmployeeId = li; // Track employee being edited

    document.getElementById('employeeName').value = name;
    document.getElementById('employeePosition').value = position;
    document.getElementById('employeeDepartment').value = department;

    addEmployeeButton.style.display = 'none';
    updateEmployeeButton.style.display = 'inline-block';
    cancelUpdateButton.style.display = 'inline-block';
  }

  // Handle Update Employee
  updateEmployeeButton.addEventListener('click', function () {
    const name = document.getElementById('employeeName').value;
    const position = document.getElementById('employeePosition').value;
    const department = document.getElementById('employeeDepartment').value;

    if (name && position && department && currentEmployeeId) {
      currentEmployeeId.innerHTML = `${name} - ${position} - ${department} 
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>`;

      const editButton = currentEmployeeId.querySelector('.edit-btn');
      const deleteButton = currentEmployeeId.querySelector('.delete-btn');

      editButton.addEventListener('click', () => editEmployee(currentEmployeeId, name, position, department));
      deleteButton.addEventListener('click', () => deleteEmployee(currentEmployeeId));

      // Reset the form
      employeeForm.reset();

      addEmployeeButton.style.display = 'inline-block';
      updateEmployeeButton.style.display = 'none';
      cancelUpdateButton.style.display = 'none';
    }
  });

  // Handle Cancel Update
  cancelUpdateButton.addEventListener('click', function () {
    employeeForm.reset();
    addEmployeeButton.style.display = 'inline-block';
    updateEmployeeButton.style.display = 'none';
    cancelUpdateButton.style.display = 'none';
  });

  // Handle Delete Employee
  function deleteEmployee(li) {
    employeeDataList.removeChild(li);
  }
});
