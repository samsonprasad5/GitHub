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
  
    // Open Organization Tree Modal
    function openOrganizationTree() {
      const modal = document.getElementById('organizationTreeModal');
      modal.style.display = 'flex';
    }
  
    // Close Organization Tree Modal
    function closeOrganizationTree() {
      const modal = document.getElementById('organizationTreeModal');
      modal.style.display = 'none';
    }
  
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
          <strong>Email:</strong> <a href="mailto:${email}">${email}</a><br>
          <strong>Phone:</strong> ${phone}
        `;
        popup.style.display = 'block';
  
        // Adjust popup position
        const popupWidth = popup.offsetWidth;
        const popupHeight = popup.offsetHeight;
        const offsetX = 10;
        const offsetY = 10;
        
        let top = e.pageY + offsetY;
        let left = e.pageX + offsetX;
  
        if (top + popupHeight > window.innerHeight) {
          top = window.innerHeight - popupHeight - offsetY;
        }
        if (left + popupWidth > window.innerWidth) {
          left = window.innerWidth - popupWidth - offsetX;
        }
  
        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;
      });
  
      button.addEventListener('mouseout', () => {
        document.getElementById('popup').style.display = 'none';
      });
    });
  
    // Dummy Bar Chart Data
    const ctx = document.getElementById('waterUsageChart').getContext('2d');
    const waterUsageChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['CCO', 'CSIO', 'CLPO', 'CIDO', 'BS&HG', 'COO', 'CAMO', 'CFO'],
        datasets: [{
          label: 'Number of Departments',
          data: [5, 3, 7, 4, 6, 2, 8, 5],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          barThickness: 60
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Departments'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Chiefs'
            }
          }
        }
      }
    });
  
    // Function to handle user logout
    document.getElementById('logout').addEventListener('click', () => {
      alert('Logged out!');
    });
  });