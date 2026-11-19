# Crew website

A static website for Crew. It has a landing page with two sign-up forms and a phone-app demo. It runs from plain HTML, CSS and JavaScript, so there is no build step: open `index.html` in a browser.

| File | What it is |
|---|---|
| `index.html` | Landing page with the family and worker sign-up forms, and the live app demo inside "How it works" |
| `login.html`, `family.html`, `worker.html` | The phone-app demo: fake login, the family app and the worker app |
| `config.js` | **Settings and all site copy**: brand name, contact email, sign-up URL, every word on the site |
| `demo-data.js` | Sample workers, jobs and earnings for the demo |
| `styles.css` | All styling |
| `script.js` | Fills in the copy, runs the forms and the demo |
| `assets/` | Job photos (free Unsplash photos, see "Photo credits" below) |
| `apps-script/Code.gs` | Google Apps Script that writes sign-ups into a Google Sheet |

The live site is at https://coopersweetmore-cyber.github.io/crew/ and its sign-ups go to the "Crew sign-ups" Google Sheet.

## The app demo

- On a laptop or projector, the demo shows inside a phone frame, with a switch between the family app and the worker app. On a phone it fills the screen like a real app.
- The landing page embeds the same demo in "How it works", so visitors can tap through it without leaving the page.
- Family app: post a job, see a shortlist of 3 sample workers, pick one, and see the booking with its price breakdown. Jobs ending after 22:00 hide the under-18 sample worker.
- Worker app: level and progress, earnings this month, upcoming jobs, badges and the skills record.
- Everything in it comes from `demo-data.js` and is labelled as sample data.

## Set up sign-ups

Do these steps in order. They take about 15 minutes.

1. **Create the Sheet.** Go to [sheets.new](https://sheets.new) while signed in to the Google account that should own the sign-ups. Name it something like "Crew sign-ups". You don't need to create the tabs: the script creates "Families" and "Workers", with header rows, when the first sign-up arrives.

2. **Paste the script.** In the Sheet, open **Extensions > Apps Script**. Delete the code that's there, paste in everything from `apps-script/Code.gs`, and click **Save**.

3. **Deploy it as a web app.**
   1. Click **Deploy > New deployment**.
   2. Click the gear icon next to "Select type" and choose **Web app**.
   3. Set **Execute as** to **Me** and **Who has access** to **Anyone**. "Anyone" is needed so the public website can send sign-ups. People can only add rows; they can't read the Sheet.
   4. Click **Deploy**. Google will ask you to authorise the script. Choose your account. If you see "Google hasn't verified this app", click **Advanced > Go to … (unsafe)**: this is your own script.
   5. Copy the **Web app URL**. It ends in `/exec`.

4. **Paste the URL into `config.js`.** Open `config.js` and put the URL between the quotes:

   ```js
   var SIGNUP_ENDPOINT = "https://script.google.com/macros/s/XXXXXXXX/exec";
   ```

   Then test it: open `index.html`, send one family sign-up and one worker sign-up, and check that a row appears in each tab of the Sheet. Until the URL is set, the forms show "Sign-ups aren't connected yet" instead of sending.

   If you change `Code.gs` later, use **Deploy > Manage deployments > Edit (pencil) > Version: New version > Deploy**. That keeps the same URL.

5. **Put the site online for free.** Pick one:
   - **Netlify (easiest):** go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag this whole folder onto the page. You get a link straight away. Create a free account if you want to keep the site and give it a nicer name. Leave out the `design/` folder or reference file if you don't want them online.
   - **GitHub Pages:** create a public repository, upload the site files (the `.html`, `.css` and `.js` files, plus `apps-script/` if you like), then go to **Settings > Pages**, choose **Deploy from a branch**, pick `main` and `/ (root)`, and save. The site appears at `https://<your-username>.github.io/<repo-name>/` after a minute or two.

6. **Change the brand name.** Open `config.js` and edit one line:

   ```js
   var BRAND_NAME = "Crew";
   ```

   Every page, title, button and message updates. The fallback page titles in the `.html` files don't use the brand name on purpose, so there's nothing else to change.

## Other things to edit

- **Contact email:** set `CONTACT_EMAIL` in `config.js`. It's shown in the footer and becomes a mailto link once it contains an `@`.
- **Any wording:** every word on the site is in the `SITE_COPY` block in `config.js`. Change it there, not in the HTML.
- **Portuguese version:** in `config.js`, copy the whole `en: { … }` block, paste it below as `pt: { … }`, translate the text, and set `SITE_LANGUAGE = "pt"`. Also change `locale` in that block to `"pt-PT"` so dates and prices format correctly. Keep every `value` in English so the Sheet columns stay consistent. Only translate the `label`, `name`, `text` and similar fields.
- **Demo content:** edit `demo-data.js`. Job names there must match a `value` in `jobTypes` in `config.js`.

## What the demo does and doesn't do

The login accepts anything and goes straight to the dashboard you chose. Nothing is checked, stored or sent. No payment is taken. All demo content is sample data, and each demo screen shows the banner "Demo with sample data. Crew launches January 2027."

## Photo credits

All photos are from [Unsplash](https://unsplash.com) and used under the Unsplash License (free to use, no permission needed). They show the jobs, not Crew workers or customers.

| File | Source |
|---|---|
| `assets/hero-dog-walk.jpg` | https://unsplash.com/photos/person-walking-beside-golden-retriever-on-the-street-VehdYPKnX8Y |
| `assets/job-pets.jpg` | https://unsplash.com/photos/woman-in-brown-jacket-and-black-pants-walking-with-black-labrador-retriever-on-brown-grass-field-d0oOCKu6n0A |
| `assets/job-car.jpg` | https://unsplash.com/photos/a-person-cleaning-a-car-with-a-green-cloth-tt53GduAKHQ |
| `assets/job-garden.jpg` | https://unsplash.com/photos/person-holding-gardening-tool-near-yellow-plant--rl4m0icZo4 |
| `assets/job-windows.jpg` | https://unsplash.com/photos/woman-in-white-long-sleeve-shirt-and-blue-denim-jeans-standing-beside-white-wooden-framed-glass-VRpjDw3WqqI |
| `assets/job-tech.jpg` | https://unsplash.com/photos/elderly-couple-looking-at-a-smartphone-together-BM3aFI-qv64 |
| `assets/job-events.jpg` | https://unsplash.com/photos/wooden-table-set-for-outdoor-dining-with-floral-centerpieces-YrThd1lBFu4 |

## A note on Google permissions

`Code.gs` starts with `@OnlyCurrentDoc`, so the script can only touch the Sheet it belongs to. If you approved the script before this line was added, Google may still list wider access for it. You can review or remove that at myaccount.google.com, under Security, then "Third-party connections". The script asks again for access to just this Sheet next time it needs it.
