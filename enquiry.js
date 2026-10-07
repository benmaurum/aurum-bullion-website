/* Enquiries stay on Aurum's IONOS hosting and are sent to the Aurum team. */
(function () {
  'use strict';
  document.querySelectorAll('form[data-aurum-enquiry]').forEach(function (form) {
    var submit = form.querySelector('[type="submit"]');
    var originalLabel = submit.textContent;
    var status = document.createElement('p');
    status.setAttribute('role', 'status');
    status.className = 'full';
    form.appendChild(status);
    var trap = document.createElement('input');
    trap.name = 'website'; trap.type = 'text'; trap.tabIndex = -1;
    trap.autocomplete = 'off'; trap.setAttribute('aria-hidden', 'true');
    trap.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px';
    form.appendChild(trap);
    var note = document.createElement('p');
    note.className = 'full';
    note.innerHTML = 'We use your details to respond to this enquiry. <a href="privacy.html">Privacy policy</a>.';
    form.insertBefore(note, submit);
    var token = null;
    function getToken() {
      return fetch('enquiry.php', { credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'application/json' } })
        .then(function (response) { if (!response.ok) throw new Error('The enquiry service is temporarily unavailable.'); return response.json(); })
        .then(function (data) { if (!data.token) throw new Error('The enquiry service is temporarily unavailable.'); token = data.token; });
    }
    getToken().catch(function () { status.textContent = 'If the form is unavailable, please email info@aurumbullion.co.uk or call +44 20 8064 0766.'; });
    var selection = new URLSearchParams(location.search).get('selection');
    if (selection && form.elements.kind.value === 'contact') {
      var selected = document.createElement('textarea');
      selected.name = 'selection'; selected.readOnly = true; selected.rows = 4;
      selected.value = selection.slice(0, 12000);
      var label = document.createElement('label'); label.className = 'full';
      label.appendChild(document.createTextNode('Selected coins')); label.appendChild(selected);
      form.insertBefore(label, form.querySelector('label'));
    }
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      submit.disabled = true; submit.textContent = 'Sending…'; status.textContent = '';
      try {
        if (!token) await getToken();
        var body = new FormData(form); body.set('token', token);
        var response = await fetch('enquiry.php', { method: 'POST', body: body, credentials: 'same-origin', headers: { Accept: 'application/json' } });
        var result = await response.json();
        if (!response.ok || !result.ok) {
          if (response.status === 403) token = null;
          throw new Error(result.message || 'Your enquiry could not be sent. Please try again or email info@aurumbullion.co.uk.');
        }
        form.reset();
        status.textContent = 'Thank you. Your enquiry has been sent to our mail service. Reference: ' + result.reference + '. An Aurum specialist will contact you.';
        status.focus();
      } catch (error) {
        status.textContent = error.message || 'Your enquiry could not be sent. Please email info@aurumbullion.co.uk or call +44 20 8064 0766.';
      } finally {
        submit.disabled = false; submit.textContent = originalLabel;
      }
    });
  });
})();
