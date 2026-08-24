// Open the visitor's own email app so inquiry data never passes through a third-party form processor.
const CONTACT_INBOX = 'info@lithiconrdlabs.com';

const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
const contactSubmit = document.getElementById('contact-submit');

function setStatus(message, type) {
    contactStatus.textContent = message;
    contactStatus.className = type ? `inquiry-status ${type}` : 'inquiry-status';
}

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(contactForm);

        if (formData.get('_honey')) {
            return;
        }

        const visitorEmail = String(formData.get('email') || '').trim();
        const visitorName = String(formData.get('name') || '').trim();
        const subject = String(formData.get('subject') || '').trim();
        const message = String(formData.get('message') || '').trim();

        if (!visitorName || !visitorEmail || !subject || !message) {
            setStatus('Please complete every field before sending.', 'error');
            return;
        }

        const mailSubject = `Lithicon website inquiry: ${subject}`;
        const mailBody = `Name: ${visitorName}\nEmail: ${visitorEmail}\n\n${message}`;
        const mailtoUrl = `mailto:${CONTACT_INBOX}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

        setStatus('');
        contactSubmit.disabled = true;

        window.location.href = mailtoUrl;

        setStatus(
            `Your email app should open a draft to ${CONTACT_INBOX}. If it does not, send your message to that address directly.`,
            'success'
        );
        contactSubmit.disabled = false;
    });
}
