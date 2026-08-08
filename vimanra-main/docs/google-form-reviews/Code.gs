/**
 * Vimanra — Google Form to website reviews.
 *
 * Runs inside Google Apps Script, bound to the review Google Form. On each
 * submission it posts the answers to the Vimanra API, which stores them hidden
 * until an admin approves them in the dashboard.
 *
 * Setup lives in README.md next to this file.
 */

// The deployed backend, including the /api/reviews path.
const API_URL = 'https://vimanra-8ye6.vercel.app/api/reviews';

// Must match REVIEW_FORM_SECRET in the backend environment exactly.
const FORM_SECRET = '13cb2e4402f346100558e78de61aaf49fc86d3b6b0d4c7ab58f55d42c4870da4';

// Exact question titles as they appear in the form.
const QUESTIONS = {
  name: 'Your name',
  rating: 'How would you rate your stay?',
  review: 'Tell us about your stay',
};

function onFormSubmit(e) {
  const answers = {};
  e.response.getItemResponses().forEach(function (item) {
    answers[item.getItem().getTitle().trim()] = item.getResponse();
  });

  const guestName = answers[QUESTIONS.name];
  const review = answers[QUESTIONS.review];
  const rating = parseRating(answers[QUESTIONS.rating]);

  // The API rejects incomplete submissions anyway; failing here keeps the
  // reason in the Apps Script execution log rather than as a 400 response.
  if (!guestName || !review || !rating) {
    console.error(
      'Skipped submission — check that QUESTIONS matches the form titles. Got: ' +
        JSON.stringify(Object.keys(answers))
    );
    return;
  }

  const res = UrlFetchApp.fetch(API_URL, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-form-secret': FORM_SECRET },
    payload: JSON.stringify({ guest_name: guestName, rating: rating, review: review }),
    muteHttpExceptions: true,
  });

  if (res.getResponseCode() >= 300) {
    console.error('Review submission failed: ' + res.getResponseCode() + ' ' + res.getContentText());
  }
}

// Accepts a Rating question ("5"), a linear scale ("5"), or a labelled choice
// ("5 - Excellent"). Reads the whole number rather than the first digit so a
// 10-point scale is rejected outright instead of being recorded as a 1.
function parseRating(value) {
  const match = String(value == null ? '' : value).match(/\d+/);
  if (!match) return null;
  const rating = Number(match[0]);
  return rating >= 1 && rating <= 5 ? rating : null;
}

/** Run once from the editor to confirm the API accepts a submission. */
function testSubmission() {
  const res = UrlFetchApp.fetch(API_URL, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-form-secret': FORM_SECRET },
    payload: JSON.stringify({
      guest_name: 'Apps Script Test',
      rating: 5,
      review: 'Test submission — delete this from the dashboard.',
    }),
    muteHttpExceptions: true,
  });
  console.log(res.getResponseCode() + ' ' + res.getContentText());
}
