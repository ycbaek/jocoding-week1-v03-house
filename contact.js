document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const subject = urlParams.get('subject');
  const listingId = urlParams.get('id');

  if (subject) {
    const subjectSelect = document.querySelector('select[name="subject"]');
    if (subjectSelect) {
      subjectSelect.value = subject;
    }
  }

  if (listingId) {
    const messageTextarea = document.querySelector('textarea[name="message"]');
    if (messageTextarea) {
      messageTextarea.value = `I'm interested in the property with listing ID: ${listingId}.

`;
    }
  }
});
