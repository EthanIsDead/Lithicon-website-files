const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
const contactSubmit = document.getElementById('contact-submit');

function setStatus(message, type) {
    contactStatus.textContent = message;
    contactStatus.className = type ? `inquiry-status ${type}` : 'inquiry-status';
}

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

        if (!visitorName || !visitorEmail || !subject || !message) {
            setStatus('Please complete every field before sending.', 'error');
            return;
        }

        contactSubmit.disabled = true;
        setStatus('');

        try {
            const response = await fetch('/.netlify/functions/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: visitorName,
                    email: visitorEmail,
                    subject,
                    message
                })
            });
            const result = await response.json();

            if (result.success) {
                setStatus('Thank you. Your message has been sent.', 'success');
                contactForm.reset();
            } else {
                setStatus(
                    result.message || 'Your message could not be sent. Please email info@lithiconrdlabs.com directly.',
                    'error'
                );
            }
        } catch (error) {
            setStatus('Your message could not be sent. Please email info@lithiconrdlabs.com directly.', 'error');
        } finally {
            contactSubmit.disabled = false;
        }
    });
}
