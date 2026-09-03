const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

function jsonResponse(statusCode, body) {
    return {
        statusCode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
}

function readField(payload, key) {
    return String(payload && payload[key] ? payload[key] : '').trim();
}

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return jsonResponse(405, { success: false, message: 'Method not allowed.' });
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
        return jsonResponse(500, { success: false, message: 'Form is not configured.' });
    }

    let payload = {};
    try {
        payload = JSON.parse(event.body || '{}');
    } catch (error) {
        return jsonResponse(400, { success: false, message: 'Invalid form data.' });
    }

    if (readField(payload, '_honey')) {
        return jsonResponse(200, { success: true });
    }

    const visitorName = readField(payload, 'name');
    const visitorEmail = readField(payload, 'email');
    const subject = readField(payload, 'subject');
    const message = readField(payload, 'message');

    if (!visitorName || !visitorEmail || !subject || !message) {
        return jsonResponse(400, { success: false, message: 'Please complete every field before sending.' });
    }

    try {
        const response = await fetch(WEB3FORMS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                access_key: accessKey,
                name: visitorName,
                email: visitorEmail,
                message,
                from_name: visitorName,
                subject: `Lithicon website inquiry: ${subject}`
            })
        });

        const result = await response.json();
        if (!result.success) {
            return jsonResponse(502, {
                success: false,
                message: result.message || 'Your message could not be sent. Please email info@lithiconrdlabs.com directly.'
            });
        }

        return jsonResponse(200, { success: true });
    } catch (error) {
        return jsonResponse(502, {
            success: false,
            message: 'Your message could not be sent. Please email info@lithiconrdlabs.com directly.'
        });
    }
};
