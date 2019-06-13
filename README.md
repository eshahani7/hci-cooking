### To run
Run using lite-server for proper display of navbar and images.

### Nav Instructions
1. Include stylesheet under css/nav-styles.css.
2. Include script under js/nav.js AND jquery minified CDN (see home.html)
3. Place content under <!-- NAV AND HEADER --> at top of page body. Replace title with your own.
4. IMPORTANT: wrap your content in a div with id="main" for js to work (slides content to the right when nav is expanded)

Note: not functional or complete yet... can someone make the profile look the way it looks on the designs?

### Firebase Instructions
Place the following BEFORE all other script tags in page
~~~~
<script src="https://www.gstatic.com/firebasejs/6.1.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/6.1.0/firebase-firestore.js"></script>
<script src="./js/db.js"></script>
~~~~
