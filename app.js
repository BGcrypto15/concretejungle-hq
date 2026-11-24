// ===== Brand settings (edit here) =====
var B = {
  name: 'Concrete Jungle',
  legal: 'Concrete Jungle Holdings LLC',
  owner: 'Zed',
  phone: '267-357-8234',
  phoneTel: '+12673578234',
  // Paste the Formspree endpoint here when ready, e.g. 'https://formspree.io/f/abcd1234'.
  // Leave empty to keep the form in demo mode.
  formEndpoint: ''
};

var SERVICES = [
  { t: 'Junk Hauling', d: 'Old furniture, trash, debris and anything else that needs to go. We load it and haul it.' },
  { t: 'Cleanouts', d: 'Houses, apartments, basements, garages, attics, sheds and estates.' },
  { t: 'Scrap Metal Removal', d: 'Appliances, metal, pipes and other scrap picked up and hauled away.' },
  { t: 'Appliance & Furniture Removal', d: 'Fridges, washers, dryers, couches, tables and more.' },
  { t: 'Bike Removal', d: 'Old, broken or abandoned bikes cleared out.' },
  { t: 'Demolition', d: 'Tear-outs and demo work. Tell us about the job and we will give you a straight answer.' },
  { t: 'Moving Help', d: 'Strong hands for loading, unloading and moving heavy items.' },
  { t: 'Cleaning', d: 'Cleanup after a cleanout, a move-out or a job.' },
  { t: 'General Labor', d: 'Extra hands for heavy, dirty or one-off jobs.' }
];

(function () {
  // Service cards
  var wrap = document.getElementById('serviceCards');
  var sel = document.getElementById('serviceSelect');
  SERVICES.forEach(function (s, i) {
    var c = document.createElement('article');
    c.className = 'card';
    c.innerHTML = '<span class="tag">' + String(i + 1).padStart(2, '0') + '</span><h3></h3><p></p>';
    c.querySelector('h3').textContent = s.t;
    c.querySelector('p').textContent = s.d;
    wrap.appendChild(c);
    var o = document.createElement('option');
    o.value = o.textContent = s.t;
    sel.appendChild(o);
  });
  var other = document.createElement('option');
  other.value = other.textContent = 'Something else';
  sel.appendChild(other);

  document.getElementById('yr').textContent = new Date().getFullYear();

  // Quote form
  var form = document.getElementById('quoteForm');
  var err = document.getElementById('formError');
  var done = document.getElementById('formDone');
  var endpoint = form.getAttribute('data-endpoint') || B.formEndpoint;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    err.textContent = '';
    var bad = [];
    form.querySelectorAll('[required]').forEach(function (f) {
      var ok = f.value.trim() !== '';
      if (f.name === 'phone') ok = f.value.replace(/\D/g, '').length >= 10;
      f.classList.toggle('bad', !ok);
      if (!ok) bad.push(f);
    });
    var email = form.elements.email;
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { email.classList.add('bad'); bad.push(email); }
    else email.classList.remove('bad');
    if (form.elements.contact_pref.value === 'Email' && !email.value) { email.classList.add('bad'); bad.push(email); }
    if (bad.length) {
      err.textContent = 'Please fill in the highlighted fields.';
      bad[0].focus();
      return;
    }
    if (form.elements._gotcha.value) return; // bot

    var first = form.elements.name.value.trim().split(' ')[0];
    var btn = form.querySelector('button[type=submit]');

    function finish(isDemo) {
      document.getElementById('doneName').textContent = first;
      document.getElementById('demoNote').hidden = !isDemo;
      form.hidden = true;
      done.hidden = false;
      done.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (!endpoint) { finish(true); return; }

    btn.disabled = true; btn.textContent = 'Sending...';
    fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error(); finish(false); })
      .catch(function () {
        err.textContent = 'That did not go through. Please call or text ' + B.phone + '.';
        btn.disabled = false; btn.textContent = 'Get My Free Quote';
      });
  });
})();
