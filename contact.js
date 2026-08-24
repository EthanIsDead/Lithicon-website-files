// Route contact form messages to the website owner's inbox.
// Replace this with the owner's Gmail address if a different mailbox should receive inquiries.
const CONTACT_INBOX = 'anubhavforswe@gmail.com';

const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
const contactSubmit = document.getElementById('contact-submit');

if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(contactForm);

        if (formData.get('_honey')) {
            return;
        }

        const visitorEmail = String(formData.get('email') || '').trim();
        const visitorName = String(formData.get('name') || '').trim();
        const subject = String(formData.get('subject') || '').trim();
        const message = String(formData.get('message') || '').trim();

        contactSubmit.disabled = true;
        contactSubmit.textContent = 'Sending...';
        contactStatus.textContent = '';
        contactStatus.className = 'inquiry-status';

        try {
            const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_INBOX}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: visitorName,
                    email: visitorEmail,
                    subject,
                    message,
                    _replyto: visitorEmail,
                    _subject: `Lithicon website inquiry: ${subject}`,
                    _template: 'table',
                    _captcha: 'false'
                })
            });

            const result = await response.json();
            const succeeded = response.ok && (result.success === true || result.success === 'true');

            if (!succeeded) {
                throw new Error(result.message || 'Unable to send message.');
            }

            contactStatus.textContent = 'Thank you. Your message has been sent.';
            contactStatus.classList.add('success');
            contactForm.reset();
        } catch (error) {
            const detail = String(error && error.message ? error.message : '');
            contactStatus.textContent = /activat|confirm/i.test(detail)
                ? 'Please check the inbox and confirm this contact form the first time it is used.'
                : 'Your message could not be sent. Please email info@lithiconrdlabs.com directly.';
            contactStatus.classList.add('error');
        } finally {
            contactSubmit.disabled = false;
            contactSubmit.textContent = 'Send Message';
        }
    });
}
