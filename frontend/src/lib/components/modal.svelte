<script lang="ts">
	import { fly } from "svelte/transition";
	import { expoOut } from "svelte/easing";
	import { X } from "lucide-svelte";

	interface Props {
		showModal?: boolean;
		children?: import("svelte").Snippet;
		target?: import("svelte").Snippet;
	}

	let { showModal = $bindable(false), children, target }: Props = $props();
	let dialog: any = $state();

	$effect(() => {
		if (dialog && showModal) dialog.showModal();
	});
</script>

{#key showModal}
	<dialog
		in:fly={{
			duration: 400,
			y: 20,
			easing: expoOut
		}}
		bind:this={dialog}
		onclose={() => (showModal = false)}
	>
		<button class="close" onclick={() => dialog.close()}><X /></button>
		<div id="content">
			{@render children?.()}
		</div>
	</dialog>
{/key}
<button class="cell-button" onclick={() => (showModal = true)}>
	{@render target?.()}
</button>

<style>
	dialog {
		border: none;
		width: 300px;
		position: relative;
		border-radius: 20px;
		border: 4px solid var(--color-gray-border);
		border-bottom: 8px solid var(--color-gray-border);
		background-color: var(--color-gray);
	}

	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.4);
	}

	.close {
		aspect-ratio: 1 / 1;
		cursor: pointer;
		border-radius: 100%;
		position: absolute;
		background-color: unset;
		border: none;
		top: 30px;
		left: 30px;
	}

	.close:hover {
		background-color: var(--color-light-gray);
	}

	.close:focus {
		outline: 0;
	}

	#content {
		height: calc(100% - 87px);
		margin: 30px;
		gap: 50px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
</style>
