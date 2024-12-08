<script>
    import CryptoJS from 'crypto-js';
    import { goto } from '$app/navigation'; // Correct import for goto

    let username = '';
    let password = '';
    let key = 'JohnAdrian'; // Replace with a secure key
    let message = '';

    async function register() {
        if (!username || !password) {
            message = 'Please fill in all fields.';
            return;
        }

        const body = CryptoJS.AES.encrypt(
            JSON.stringify({ username, password }),
            key
        ).toString();

        try {
            const response = await fetch('/api', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ body, key }),
            });

            const data = await response.json();

            if (data.success) {
                message = 'Registration successful! Redirecting to login...';
                setTimeout(() => {
                    goto('/'); // Redirect to the login page
                }, 2000); // Delay to allow the user to see the success message
            } else {
                message = data.message || 'Failed to register.';
            }
        } catch (error) {
            message = 'An error occurred. Please try again.';
        }
    }
</script>

<main>
    <h1>Register</h1>
    <div>
        <label>Username</label>
        <input type="text" bind:value={username} placeholder="Enter username" />
    </div>
    <div>
        <label>Password</label>
        <input type="password" bind:value={password} placeholder="Enter password" />
    </div>
    <button on:click={register}>Register</button>
    <p>{message}</p>
</main>

<style>
    /* Add your styles here */
</style>
