const form = document.querySelector('#github-form');
const searchInput = document.querySelector('#search');
const userList = document.querySelector('#user-list');
const reposList = document.querySelector('#repos-list');
const API_URL = 'https://api.github.com';

// Add an event listener for the form submit event
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent the form from submitting normally

  const searchTerm = searchInput.value.trim(); // Get the search term and remove whitespace
  if (!searchTerm) return; // If the search term is empty, don't do anything

  // Make a request to the GitHub API search endpoint
  fetch(`${API_URL}/search/users?q=${searchTerm}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json', // Include the custom header
    },
  })
    .then((response) => response.json()) // Convert the response to JSON
    .then((data) => {
      userList.innerHTML = ''; // Clear the previous search results

      // Loop through the search results and create a list item for each user
      data.items.forEach((user) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <img src='${user.avatar_url}' alt='${user.login}'>
          <a href='${user.html_url}' target='_blank'>${user.login}</a>
        `;
        userList.appendChild(li);

        // Add an event listener for each user list item click event
        li.addEventListener('click', () => {
          // Make a request to the GitHub API user repos endpoint
          fetch(`${API_URL}/users/${user.login}/repos`, {
            headers: {
              Accept: 'application/vnd.github.v3+json', // Include the custom header
            },
          })
            .then((response) => response.json()) // Convert the response to JSON
            .then((data) => {
              reposList.innerHTML = ''; // Clear the previous search results

              // Loop through the user's repos and create a list item for each one
              data.forEach((repo) => {
                const li = document.createElement('li');
                li.innerHTML = `
                  <a href='${repo.html_url}' target='_blank'>${repo.name}</a>
                `;
                reposList.appendChild(li);
              });
            })
            .catch((error) => console.error(error));
        });
      });
    })
    .catch((error) => console.error(error));
});
