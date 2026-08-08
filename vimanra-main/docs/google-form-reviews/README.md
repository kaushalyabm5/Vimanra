# Guest reviews via Google Form

Guests receive a Google Form link over WhatsApp or email. When they submit it,
Apps Script posts the answers to the Vimanra API, which stores the review
**hidden**. It only appears on the website once an admin approves it in the
dashboard.

```
Google Form  ->  Apps Script  ->  POST /api/reviews  ->  Supabase
                                  (visible: false)
                                        |
                            Admin dashboard -> "Visible on site"
                                        |
                              Testimonials on the public site
```

Nothing a guest submits can reach the website without approval. The endpoint
rejects anyone who has neither an admin token nor the shared form secret.

---

## 1. Set the shared secret

Generate one:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add it as `REVIEW_FORM_SECRET` in two places:

- `backend/.env` for local development
- Your Vercel backend project, under Settings → Environment Variables

Redeploy the backend after adding it. Without this variable set, form
submissions are rejected — the admin dashboard keeps working either way.

## 2. Create the form

At [forms.new](https://forms.new), create a form with these three questions.
The titles must match **exactly**, or the script cannot find the answers:

| Question title | Type | Required |
|---|---|---|
| `Your name` | Short answer | Yes |
| `How would you rate your stay?` | **Rating (5 stars)** or Linear scale 1–5 | Yes |
| `Tell us about your stay` | Paragraph | Yes |

For the rating, **Rating** shows guests actual stars and reads better than a row
of radio buttons. Linear scale works identically as far as the script is
concerned — pick whichever you prefer.

> **Set the rating to 5 stars, not 10.** Anything above 5 is rejected by the
> API, so a 10-star scale would drop every submission scoring 6 or higher. The
> skipped submissions appear in the Apps Script execution log.

To word the questions differently, edit the `QUESTIONS` object in `Code.gs` to
match.

## 3. Add the script

In the form: **⋮ (top right) → Apps Script**. Delete the placeholder code,
paste the contents of [`Code.gs`](./Code.gs), then set the two constants at the
top:

```javascript
const API_URL = 'https://your-backend.vercel.app/api/reviews';
const FORM_SECRET = 'the value from step 1';
```

Save.

## 4. Add the trigger

In the Apps Script editor, open **Triggers** (clock icon) → **Add Trigger**:

- Function: `onFormSubmit`
- Event source: **From form**
- Event type: **On form submit**

Google will ask you to authorise the script — that is expected, since it makes
an outbound network request.

## 5. Test it

Run `testSubmission` from the Apps Script editor. A `201` in the log means it
worked, and "Apps Script Test" appears in the dashboard awaiting approval.
Delete it once you have seen it.

Then submit the real form once and confirm it also arrives.

## 6. Share the link

**Send → link icon → Copy.** Paste into WhatsApp or email. Ticking *Shorten
URL* gives a tidier link for messaging.

## 7. Approve reviews

New submissions show in the dashboard under **Reviews** with an *N awaiting
approval* button, tagged `Google Form`. Click **Hidden** on a card to flip it to
**Visible on site**, and it appears in the website's Testimonials section.

---

## Troubleshooting

| Symptom | Cause |
|---|---|
| `401 Not authorized to submit a review` | `FORM_SECRET` does not match `REVIEW_FORM_SECRET`, or the backend was not redeployed after adding it |
| `400 guest_name, rating … required` | Question titles do not match `QUESTIONS` — the log lists the titles it actually received |
| Nothing arrives, no errors | Trigger missing or added to the wrong function; check **Executions** in Apps Script |
| Review arrives but is not on the site | Working as intended — approve it in the dashboard |

Failed submissions are logged in Apps Script under **Executions**. Because the
script does not retry, a guest whose submission fails would need to resubmit —
worth checking Executions occasionally at first.
