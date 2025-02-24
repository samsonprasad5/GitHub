document.addEventListener("DOMContentLoaded", function () {
    // Function to Show/Hide Sections based on Sidebar Clicks
    function showSection(section) {
      const sections = document.querySelectorAll('.hidden-content');
      sections.forEach(s => s.style.display = 'none'); // Hide all sections
      document.getElementById(section).style.display = 'block'; // Show the selected section
    }
  
    // Default to Dashboard on Page Load
    showSection('dashboard');
  
    // Add event listeners to sidebar buttons
    document.querySelectorAll('.sidebar-btn').forEach(button => {
      button.addEventListener('click', () => {
        const section = button.getAttribute('onclick').match(/'(.*?)'/)[1]; // Extract section name
        showSection(section);
      });
    });
  
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
      });
    });
  
    // Show popup with employee details
    document.querySelectorAll('.toggle-btn[data-name]').forEach(button => {
      button.addEventListener('mouseover', (e) => {
        const name = e.target.getAttribute('data-name');
        const email = e.target.getAttribute('data-email');
        const phone = e.target.getAttribute('data-phone');
        const popup = document.getElementById('popup');
        popup.querySelector('.details').innerHTML = `
          <strong>Name:</strong> ${name}<br>
         