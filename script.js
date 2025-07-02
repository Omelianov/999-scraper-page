fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const tbody = document.querySelector('#offersTable tbody');

    data.forEach(item => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${item.title}</td>
        <td>${item.price}</td>
        <td>${item.location}</td>
        <td><a href="${item.link}" target="_blank">Перейти</a></td>
      `;

      tbody.appendChild(row);
    });
  })
  .catch(error => console.error('Ошибка загрузки:', error));

function sortTable(n) {
  const table = document.getElementById("offersTable");
  let switching = true;
  let dir = "asc";
  let switchcount = 0;

  while (switching) {
    switching = false;
    const rows = table.rows;

    for (let i = 1; i < (rows.length - 1); i++) {
      let shouldSwitch = false;
      const x = rows[i].getElementsByTagName("TD")[n];
      const y = rows[i + 1].getElementsByTagName("TD")[n];

      if (dir === "asc") {
        if (x.innerText.toLowerCase() > y.innerText.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir === "desc") {
        if (x.innerText.toLowerCase() < y.innerText.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount++;
      } else {
        if (switchcount === 0 && dir === "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }
}
