<script lang="ts">
	import { fly } from "svelte/transition";
	import { login } from "$lib";
	let password: string = $state("");
	let username: string = $state("");
</script>

<div id="additionals" in:fly={{ y: 10, duration: 200, delay: 100 }}>
	<input placeholder="שם משתמש" bind:value={username} />
	<input type="password" placeholder="סיסמה" bind:value={password} />
	<button
		class="button {password?.length > 0 ? '' : 'disabled'}"
		onclick={() => login(username, password)}>כניסה</button
	>
</div>

<style>
	input {
		direction: rtl;
		font-family: "Heebo", sans-serif;
		outline: none;
		border-radius: 25px;
		padding: 10px;
		border: 2px solid var(--color-gray-button-border);
		font-size: 1rem;
		text-decoration: none;
		color: black;
	}

	input:focus {
		border: 2px solid rgb(121, 121, 121);
	}

	#additionals {
		justify-content: center;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	@media (max-width: 370px) {
		#additionals {
			flex-wrap: wrap;
		}
	}
</style>
