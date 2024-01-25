const email = document.getElementById("email")
const uid = document.getElementById("_id")
const selectedRole = document.getElementById("role")

async function changeUserRole() {
    try {
        const response = await fetch(`/api/users/premium/${uid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role: selectedRole }),
        });

        if (!response.ok) {
            console.error('Error changing role:', response.status, response.statusText);
            return;
        }

        const result = await response.json();
        console.log('Role changed successfully:', result);
    } catch (error) {
        console.error('Request error:', error.message);
    }
}