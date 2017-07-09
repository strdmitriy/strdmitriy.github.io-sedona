'use strict';

var feedbackForm = document.querySelector('.feedback-form');
var firstName = feedbackForm.querySelector('#first-name');
var lastName = feedbackForm.querySelector('#last-name');
var patronymic = feedbackForm.querySelector('#patronymic');
var textarea = feedbackForm.querySelector('.feedback-form__textarea');
var tel = feedbackForm.querySelector('#tel');
var feedbackFormMail = feedbackForm.querySelector('#email');
var telErrorMsg = feedbackForm.querySelector('.feedback-form__error-msg');

var popupFailure = document.querySelector('.popup-failure');
var popupSuccess = document.querySelector('.popup-success');

var btnFailure = popupFailure.querySelector('.popup-failure__btn');
var btnSuccess = popupSuccess.querySelector('.popup-success__btn');

var storageName = localStorage.getItem('firstName');
var storagelastName = localStorage.getItem('lastName');
var storagePatronymic = localStorage.getItem('patronymic');
var storageTel = localStorage.getItem('tel');
var storagefeedbackFormMail = localStorage.getItem('feedbackFormMail');

if (storageName || storagelastName
   || storagePatronymic || storageTel
   || storagefeedbackFormMail) {
  firstName.value = storageName;
  lastName.value = storagelastName;
  patronymic.value = storagePatronymic;
  tel.value = storageTel;
  feedbackFormMail.value = storagefeedbackFormMail;
}

var popupFailureCloseHandler = function() {
  if (popupFailure.classList.contains('popup-failure--show')) {
    popupFailure.classList.remove('popup-failure--show');
  }
};
var popupSuccessCloseHandler = function() {
  if (popupSuccess.classList.contains('popup-success--show')) {
    popupSuccess.classList.remove('popup-success--show');
  }
};
var isKeyboardEvent = function(evt) {
  return typeof evt.keyCode !== 'undefined';
};

var isDeactivationEvent = function(evt) {
  var ESCAPE_KEY_CODE = 27;
  return isKeyboardEvent(evt) && evt.keyCode === ESCAPE_KEY_CODE;
};

var popupShow = function(evt) {
  evt.preventDefault();
  var validValue =
    !firstName.value || !lastName.value ||
    !patronymic.value || !tel.value || !feedbackFormMail.value;

  if (validValue) {
    popupFailure.classList.add('popup-failure--show');

    localStorage.setItem('firstName', firstName.value);
    localStorage.setItem('lastName', lastName.value);
    localStorage.setItem('patronymic', patronymic.value);
    localStorage.setItem('tel', tel.value);
    localStorage.setItem('feedbackFormMail', feedbackFormMail.value);
  } else {
    popupSuccess.classList.add('popup-success--show');
  }
}

feedbackForm.addEventListener('submit', popupShow);
btnFailure.addEventListener('click', popupFailureCloseHandler);
btnSuccess.addEventListener('click', popupSuccessCloseHandler);
window.addEventListener('keydown', function(evt) {
  if (isDeactivationEvent(evt)) {
    popupSuccessCloseHandler();
    popupFailureCloseHandler();
  }
});
firstName.required = true;
firstName.minLength = 3;
firstName.maxLength = 15;



lastName.required = true;
lastName.minLength = 3;
lastName.maxLength = 15;

patronymic.required = true;
patronymic.minLength = 5;
patronymic.maxLength = 15;


tel.required = true;
feedbackFormMail.required = true;
