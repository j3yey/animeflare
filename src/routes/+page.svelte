<script>
    import { goto } from '$app/navigation'; // Import goto function

    let username = '';
    let password = '';
    let message = '';

    async function login() {
        if (!username || !password) {
            message = 'Please fill in all fields.';
            return;
        }

        try {
            const response = await fetch('/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                message = 'Login successful! Redirecting to /home...';
                setTimeout(() => {
                    goto('/home'); // Redirect to /home
                }, 2000); // Delay to allow user to see the success message
            } else {
                message = data.message || 'Failed to login.';
            }
        } catch (error) {
            message = 'An error occurred. Please try again.';
        }
    }
</script>

<main>
    <h1>Login</h1>
    <div>
        <label>Username</label>
        <input type="text" bind:value={username} placeholder="Enter username" />
    </div>
    <div>
        <label>Password</label>
        <input type="password" bind:value={password} placeholder="Enter password" />
    </div>
    <button on:click={login}>Login</button>
    <p>{message}</p>
</main>

<style>
    /* Add your styles here */
</style>
