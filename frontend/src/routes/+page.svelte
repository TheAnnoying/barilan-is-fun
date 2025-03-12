<script lang="ts">
	import "../app.css";
	import { questionList, localStorage, print, logout } from "$lib/index";
	import { Printer, LogOut } from "lucide-svelte";
	import { fly } from "svelte/transition";
	import { expoOut } from "svelte/easing";
	import { tooltip } from "@svelte-plugins/tooltips";

	import HomeworkTable from "$lib/components/homework-table.svelte";
	import Login from "$lib/components/login.svelte";

	let hide: boolean = $state(false);
</script>

<svelte:head>
	<title>התקדמות בר-אילן</title>
</svelte:head>

{#if localStorage.get("password") && localStorage.get("username")}
	<HomeworkTable />
	{#if $questionList.length > 0}
		<div
			class="actions right {hide ? 'hide-vertical' : ''}"
			in:fly={{
				duration: 400,
				y: -10,
				easing: expoOut
			}}
		>
			<button onclick={logout} class="logo link">
				<LogOut />
			</button>
			<button
				use:tooltip={{ content: "hello", position: "bottom", delay: 0 }}
				onclick={() => {
					hide = true;
					setTimeout(() => {
						print();
						hide = false;
					}, 300);
				}}
				class="logo link"><Printer /></button
			>
		</div>
	{/if}
{:else}
	<Login />
{/if}

<style>
	.actions {
		opacity: 1;
		translate: 0;
		position: absolute;
		top: 0px;
		gap: 10px;
		display: flex;
		margin: 10px;
		flex-direction: row;
		justify-content: center;
	}

	.right {
		right: 0;
	}

	.logo {
		height: 48px;
		width: 48px;
	}
</style>
