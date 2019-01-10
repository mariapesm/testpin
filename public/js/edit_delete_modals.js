var editPin = document.querySelector('#edit-pin-btn');
var deletePin = document.querySelector('#delete-pin-btn');
var editPinModal = document.querySelector('#edit-pin-modal');
var deletePinModal = document.querySelector('#delete-pin-modal');
var closeEditBtn = document.querySelector('#close-edit-pin');
var closeDeleteBtn = document.querySelector('#close-delete-pin');


// open new pin modal
editPin.addEventListener('click', function() {
  editPinModal.style.display = 'none';
  editPinModal.style.display = 'block';
});

// close new pin modal
closeEditBtn.addEventListener('click', function() {
  editPinModal.style.display = 'none';
});

// open delete pin modal
deletePin.addEventListener('click', function() {
  deletePinModal.style.display = 'none';
  deletePinModal.style.display = 'block';
});

// close delete pin modal
closeDeleteBtn.addEventListener('click', function() {
  deletePinModal.style.display = 'none';
});
