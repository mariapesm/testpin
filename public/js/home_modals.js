var newPin = document.querySelector('.new-pin');
var newPinModal = document.querySelector('#new-pin-modal');
var closeModalBtn = document.querySelector('#close-new-pin');

// open new pin modal
newPin.addEventListener('click', function() {
  newPinModal.style.display = 'none';
  newPinModal.style.display = 'block';
});

// close new pin modal
closeModalBtn.addEventListener('click', function() {
  newPinModal.style.display = 'none';
});
