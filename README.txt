ProfKons website — static files
================================

What's here
-----------
index.html      Home
about.html      About ProfKons
services.html   Services offered
partners.html   Who we partner
gallery.html    Gallery & insights (posters, post topics)
contact.html    Contact / Start a conversation (form with business-challenge checklist)
privacy.html    Privacy Policy
terms.html      Terms & Conditions
assets/         css, js, fonts (self-hosted, no external requests) and images

Preview
-------
Unzip and double-click index.html. Everything works offline.

Publish
-------
Upload the whole folder (keep the structure) to any static host:
- Netlify: drag the folder onto app.netlify.com/drop
- GitHub Pages, Cloudflare Pages, Vercel, or your existing cPanel / hosting "public_html"
Then point profkons.com at it.

Contact form
------------
The form opens the visitor's email app with a pre-filled message to
inquiry@profkons.com (works on any host, nothing stored on the site).
To receive submissions directly instead, connect a form service such as
Formspree or Netlify Forms: set the <form> "action" in contact.html to the
service URL and remove the mailto handler in assets/js/main.js.

Editing
-------
All pages are plain HTML. Text can be edited directly in each .html file.
Colours and fonts live at the top of assets/css/style.css (:root variables).
Gallery posters are in assets/img (full size + "-thumb" versions).

Fonts: Poppins and Lora, both SIL Open Font License.
