<script lang="ts">
	import Modal from "./modal.svelte";
	import confetti from "canvas-confetti";
	import { fly } from "svelte/transition";
	import {
		questionList,
		markAnswered,
		questionCompleters,
		localStorage,
		textToColor,
		getNextMonday
	} from "$lib";
	import { expoOut } from "svelte/easing";
	import { CheckCheck } from "lucide-svelte";

	let { index = 0 } = $props();
</script>

{#if $questionList.length > 0}
	{@const maxQuestions = Math.max(4, $questionList[index]
		.flatMap(e => e[1])
		.reduce((a, e) => Math.max(a, e.questions.length), 0))}
	<table cellspacing="0" cellpadding="5" in:fly={{ duration: 500, y: 10, easing: expoOut }}>
		<tbody>
			<tr style="background-color: var(--color-light-gray);">
				<td style="text-align: center;" colspan={maxQuestions + 2}>שיעורי בית</td>
			</tr>
			<tr>
				<td colspan={(maxQuestions + 2) / 4}>שם משפחה</td>
				<td colspan={(maxQuestions + 2) / 4}>{localStorage.get("hedisplayname")?.split(" ")[1]}</td>
				<td colspan={(maxQuestions + 2) / 2}>שם פרטי</td>
				<td colspan={(maxQuestions + 2) / 2}>{localStorage.get("hedisplayname").split(" ")[0]}</td>
			</tr>
			<tr>
				<td colspan={(maxQuestions + 2) / 4}>תאריך הגשה</td>
				<td colspan={(maxQuestions + 2) / 4} contenteditable="true">{getNextMonday()}</td>
				<td colspan={(maxQuestions + 2) / 2}>כמה זמן לקח לי</td>
				<td colspan={(maxQuestions + 2) / 2} contenteditable="true"></td>
			</tr>
			{#each $questionList[index] as table}
				<tr style="background-color: var(--color-light-gray);">
					<td style="text-align: center;" colspan={maxQuestions + 2}>{table[0]}</td>
				</tr>
				<tr style="background-color: var(--color-light-gray);">
					<td>מתי?</td>
					<td>עמודים</td>
					<td colspan={maxQuestions}>תרגילים</td>
				</tr>
				{#each table[1] as section}
					<tr>
						<td contenteditable="true"></td>
						<td id="pages">{section.pages}</td>
						{#each { length: maxQuestions } as _, i}
							{@const question = section.questions[i]}
							{#if question}
								{@const solverList =
									$questionCompleters
										.find(
											e =>
												e.pages === section.pages &&
												e.question === parseInt(question)
										)
										?.completed_users.split(",") ?? []}
								<td>
									<Modal>
										{#snippet target()}
											<span class={solverList.includes(localStorage.get('displayname')) ? "solved" : ""}>{question}</span>
										{/snippet}
										<div id="info">
											<span id="subtext"
												>{section.pages.split("-").length > 1 ? "עמודים" : "עמוד"}
												{section.pages}</span
											>
											<h1 id="title">
												שאלה {question}
											</h1>
										</div>
										<div id="actions" in:fly={{ y: 10, duration: 200, delay: 100 }}>
											{#if $questionCompleters}
												{#if solverList.length > 0}
													<div
														id="avatars"
														in:fly={{ y: 20, duration: 400, delay: 100, easing: expoOut }}
													>
														{#each solverList as name}
															<div
																class="avatar"
																style="background-color: {textToColor(name)};"
															>
																{name
																	.split(" ")
																	.map(e => e[0])
																	.join("")}
															</div>
														{/each}
													</div>
												{/if}
												<button
													class="action button {solverList.includes(localStorage.get('displayname'))
														? 'disabled'
														: ''}"
													onclick={() => {
														setTimeout(() => {
															markAnswered(section.pages, question);
															confetti({
																particleCount: 50,
																angle: 60,
																spread: 75,
																origin: {
																	x: 0
																}
															});
															confetti({
																particleCount: 50,
																angle: 120,
																spread: 75,
																origin: {
																	x: 1
																}
															});
														}, 250);
													}}> <CheckCheck />
													סיימתי</button
												>
											{/if}
										</div>
									</Modal>
								</td>
							{:else}
								<td></td>
							{/if}
						{/each}
					</tr>
				{/each}
			{/each}
		</tbody>
	</table>
{:else}
	<table cellspacing="0" cellpadding="5">
		<tbody>
			<tr style="background-color: var(--color-light-gray);">
				<td style="text-align: center;" colspan="14"><div class="skeleton"></div></td>
			</tr>
			<tr>
				<td colspan="3"><div class="skeleton"></div></td>
				<td colspan="4"><div class="skeleton"></div></td>
				<td colspan="3"><div class="skeleton"></div></td>
				<td colspan="4"><div class="skeleton"></div></td>
			</tr>
			<tr>
				<td colspan="3"><div class="skeleton"></div></td>
				<td colspan="4"><div class="skeleton"></div></td>
				<td colspan="3"><div class="skeleton"></div></td>
				<td colspan="4"><div class="skeleton"></div></td>
			</tr>
			{#each { length: 2 } as _, j}
				<tr style="background-color: var(--color-light-gray);">
					<td style="text-align: center;" colspan="14">
						<div class="skeleton"></div>
					</td>
				</tr>
				<tr style="background-color: var(--color-light-gray);">
					<td><div class="skeleton"></div></td>
					<td colspan="14">
						<div class="skeleton"></div>
					</td>
				</tr>
				{#each { length: 3 } as _, i}
					<tr>
						<td><div class="skeleton" style="width: 40px;"></div></td>
						<td><div class="skeleton" style="width: 40px;"></div></td>
						<td><div class="skeleton" style="width: 40px;"></div></td>
						<td><div class="skeleton" style="width: 40px;"></div></td>
						<td><div class="skeleton" style="width: 40px;"></div></td>
						<td><div class="skeleton" style="width: 40px;"></div></td>
						<td><div class="skeleton" style="width: 40px;"></div></td>
						<td><div class="skeleton" style="width: 40px;"></div></td>
						<td><div class="skeleton" style="width: 40px;"></div></td>
						<td><div class="skeleton" style="width: 40px;"></div></td>
						<td><div class="skeleton" style="width: 40px;"></div></td>
					</tr>
				{/each}
			{/each}
		</tbody>
	</table>
{/if}

<style>
	table,
	td {
		border: 1px solid #bababa;
	}

	#info {
		display: flex;
		flex-direction: column;
	}

	#subtext {
		margin: 0;
		font-size: 1rem;
	}

	#title {
		margin: 0;
	}

	#avatars {
		justify-content: center;
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
	}

	#pages {
		padding: 8px;
		font-size: 1.3rem;
	}

	#actions {
		border: 4px dashed #c9c9c9;
		background-color: var(--color-dark-gray);
		padding: 20px;
		gap: 10px;
		border-radius: 25px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.avatar {
		width: 35px;
		height: 35px;
		user-select: none;
		font-size: 1.3rem;
		padding: 5px;
		display: flex;
		border: 2px solid var(--color-dark-gray);
		margin-left: -10px;
		justify-content: center;
		align-items: center;
		border-radius: 100%;
		text-align: center;
	}

	.action {
		width: 100%;
	}
</style>
