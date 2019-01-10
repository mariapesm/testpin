var loginBtn = document.querySelector('#login-btn');
var signupBtn = document.querySelector('#signup-btn');
var loginModal = document.querySelector('#login-modal');
var signupModal = document.querySelector('#signup-modal');
var closeLoginBtn = document.querySelector('#close-login');
var closeSignupBtn = document.querySelector('#close-signup');

// open login modal
loginBtn.addEventListener('click', function() {
  signupModal.style.display = 'none';
  loginModal.style.display = 'block';
});

// open signup modal
signupBtn.addEventListener('click', function() {
  loginModal.style.display = 'none';
  signupModal.style.display = 'block';
});

// close login modal
closeLoginBtn.addEventListener('click', function() {
  loginModal.style.display = 'none';
});

// close signup modal
closeSignupBtn.addEventListener('click', function() {
  signupModal.style.display = 'none';
});

// if user tries to log in from single pin page
var pinLoginBtn = document.querySelector('#open-login');

// open login modal
if(pinLoginBtn) {
  pinLoginBtn.addEventListener('click', function() {
    signupModal.style.display = 'none';
    loginModal.style.display = 'block';
  });
}
