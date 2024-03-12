async function pay () {
    try {
        const response = await fetch(`/api/payments/payments-intents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            console.error('Error', response.status, response.statusText);
            return;
        }
        const result = await response.json();
    } catch (error) {
        console.error('Error:', error.message);
    }   
}