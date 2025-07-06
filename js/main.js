"use strict";

const BASE_URL = 'https://tarmeezacademy.com/api/v1';
const postsWrapper = document.querySelector('.posts-wrapper');
const alertsWrapper = document.querySelector('.alerts-wrapper');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');

setupUI();

function setupUI() {
  const loginBtn = document.getElementById('navbar-login-btn');
  const registerBtn = document.getElementById('navbar-register-btn');
  const logoutBtn = document.getElementById('navbar-logout-btn');

  const token = localStorage.getItem('token');

  if (token) {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
  } else {
    loginBtn.style.display = 'inline-block';
    registerBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
  }
}

function showAlert(message = 'No message set.', type = 'secondary') {
  const alertPlaceholder = document.createElement('div');
  alertPlaceholder.id = `${type}-alert`;
  alertsWrapper.prepend(alertPlaceholder);

  const appendAlert = (message, type) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('');

    alertPlaceholder.appendChild(wrapper);
  }

  appendAlert(message, type);
}

function loginRequest() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  
  const params = {
    'username': username,
    'password': password,
  };

  axios.post(`${BASE_URL}/login`, params)
    .then(response => {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      const loginModalInstance = bootstrap.Modal.getInstance(loginModal);

      loginModalInstance.hide();
      showAlert('Successfully logged in.', 'success');

      setupUI();
    })
    .catch(error => {
      const loginModalInstance = bootstrap.Modal.getInstance(loginModal);

      loginModalInstance.hide();
      showAlert(error.response.data.message, 'danger');
    });
}

function registerRequest() {
  const name = document.getElementById('register-name').value;
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  
  const params = {
    'name': name,
    'username': username,
    'email': email,
    'password': password,
  };

  axios.post(`${BASE_URL}/register`, params)
    .then(response => {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      const registerModalInstance = bootstrap.Modal.getInstance(registerModal);

      registerModalInstance.hide();
      showAlert('Successfully registered.', 'success');

      setupUI();
    })
    .catch(error => {
      const registerModalInstance = bootstrap.Modal.getInstance(registerModal);

      registerModalInstance.hide();
      showAlert(error.response.data.message, 'danger');
    });
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  showAlert('Logged out.', 'primary');

  setupUI();
}


axios.get(`${BASE_URL}/posts`)
  .then(response => {
    const posts = response.data.data;

    posts.forEach(post => {
      const author = post.author;
      const authorProfileImage = 
        typeof author.profile_image === 'string'
        ? author.profile_image
        : 'svg/guest-profile-icon.svg';
      const postImage = 
        typeof post.image === 'string'
        ? post.image
        : 'images/no-image-found.png';
      const postTitle = 
        typeof post.title === 'string'
        ? post.title
        : 'Untitled';
      const postDescription = 
        typeof post.body === 'string'
        ? post.body
        : 'No description found.';

      const newPost = `
        <div class="card my-5 shadow">
          <header class="card-header">
            <img
              src="${authorProfileImage}"
              width="50"
              height="50"
              class="rounded-circle"
            />
            <p class="d-inline-block fw-medium fs-5">@${author.username}</p>
            <h6 class="d-inline-block fw-light ms-2">${post.created_at}</h6>
          </header>
          <div class="card-body">
            <img
              src="${postImage}"
              alt="failed to load image"
              class="w-100"
            />
            <h4 class="card-title mt-3">${postTitle}</h4>
            <p class="card-text">${postDescription}</p>
          </div>
          <footer class="card-footer d-flex align-items-center">
            <span class="fs-5">
              <i class="bi bi-chat-dots"></i>
              (${post.comments_count}) Comments
            </span>
            <span class="tags-wrapper">
              <!-- will be populated with js -->
            </span>
          </footer>
        </div>
      `;

      postsWrapper.innerHTML += newPost;
      
      const tagsWrapper = document.querySelectorAll('.tags-wrapper');
      const lastTagWrapper = tagsWrapper[tagsWrapper.length - 1];

      post.tags.forEach(tag => {
        lastTagWrapper.innerHTML += `<button class="btn btn-sm rounded-5 bg-info-subtle ms-2">${tag.name}</button>`;
      });
    });
  });