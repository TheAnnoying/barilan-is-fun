<script lang="ts">
	import "../app.css";
	import { questionList, localStorage, print, logout } from "$lib/index";
	import { Printer, LogOut } from "lucide-svelte";
	import { fly } from "svelte/transition";
	import { expoOut } from "svelte/easing";

	import HomeworkTable from "$lib/components/homework-table.svelte";
	import Login from "$lib/components/login.svelte";

	let hide: boolean = $state(false);
	let week: number = $state(0);
</script>

<svelte:head>
	<title>התקדמות בר-אילן</title>
</svelte:head>

{#if localStorage.get("password") && localStorage.get("username")}
	<HomeworkTable index={week} />
	<div class="bottom {hide ? 'hide-vertical' : ''}">
		<button class="button-as-text" onclick={() => week < $questionList.length ? week += 1 : week}>&lt;</button>
		{$questionList.length-week}
		<button class="button-as-text" onclick={() => week > 0 ? week -= 1 : week}>&gt;</button>
	</div>
	{#if $questionList.length > 0}
		<div
			class="actions {hide ? 'hide-vertical' : ''}"
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
		top: 0;
		right: 0;
		gap: 10px;
		display: flex;
		margin: 10px;
		flex-direction: row;
		justify-content: center;
	}

	.bottom {
		position:  absolute;
		bottom: 5px;
	}

	.logo {
		height: 48px;
		width: 48px;
	}

	.hide-vertical {
		opacity: 0 !important;
		translate: 0 -10px !important;
	}
</style>
