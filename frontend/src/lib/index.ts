import { browser } from "$app/environment";
import { writable } from "svelte/store";
const serverURL = "localhost:3000";

const socket = new WebSocket(`ws://${serverURL}`);
export let online = writable(false),
	questionList = writable([]),
	questionCompleters = writable([]);

socket.addEventListener("open", () => online.set(true));
socket.addEventListener("close", () => online.set(false));
socket.addEventListener("message", event => questionCompleters.set(JSON.parse(event.data)));

export const localStorage = {
	get: (name: string) => {
		if (browser) return window.localStorage.getItem(name);
	},
	set: (name: string, value: string): string => {
		if (browser) window.localStorage.setItem(name, value);
		return value;
	},
	remove: (name: string): void => {
		if (browser) window.localStorage.removeItem(name);
	}
};

const updateWhenFail = setInterval(async () => {
	await fetch(`http://${serverURL}/question_list`)
		.then(async e => {
			questionList.set(await e.json());
		})
		.catch(() => {});
}, 2000);

questionList.subscribe(value => {
	if (value && value.length > 0) clearInterval(updateWhenFail);
});

export function print() {
	if (browser) window.print();
}

export async function login(username: string, password: string) {
	const response =
		(await fetch(
			`http://${serverURL}/login?password=${encodeURIComponent(password)}&username=${encodeURIComponent(username)}`
		)
			.then(e => e.json())
			.catch(() => {})) ?? {};
	if (response.okay) {
		localStorage.set("password", password);
		localStorage.set("username", username);
		localStorage.set("displayname", response.displayname);
		localStorage.set("hedisplayname", response.hedisplayname);

		if (browser) window.location.reload();
		return true;
	} else {
		localStorage.remove("password");
		localStorage.remove("username");
		localStorage.remove("displayname");
		localStorage.remove("hedisplayname");

		if (browser) window.location.reload();
		return false;
	}
}

export function logout() {
	localStorage.remove("password");
	localStorage.remove("username");
	localStorage.remove("displayname");
	localStorage.remove("hedisplayname");

	if (browser) window.location.replace("/");
}

export async function markAnswered(pages: string, question: number) {
	return await fetch(
		`http://${serverURL}/mark?pages=${encodeURIComponent(pages)}&question=${encodeURIComponent(question)}&username=${encodeURIComponent(localStorage.get("username") ?? "")}&password=${encodeURIComponent(localStorage.get("password") ?? "")}`
	)
		.then(e => e.json())
		.catch(() => {});
}

export function textToColor(text: string): string {
	function hashCode(str: string): number {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
		return hash;
	}

	function intToBrightRGB(hash: number): string {
		let r = (hash >> 16) & 0xff;
		let g = (hash >> 8) & 0xff;
		let b = hash & 0xff;

		const minBrightness = 180;
		const maxBrightness = 230;

		const scale = (maxBrightness - minBrightness) / 255;

		r = Math.floor(minBrightness + r * scale);
		g = Math.floor(minBrightness + g * scale);
		b = Math.floor(minBrightness + b * scale);

		return `rgb(${r}, ${g}, ${b})`;
	}

	const hash: number = hashCode(text);
	return intToBrightRGB(hash);
}

export function getNextMonday(): string {
	const date = new Date();
	const day = date.getDay();

	// Calculate the difference in days to next Monday
	const daysUntilMonday = (8 - day) % 7 || 7;
	date.setDate(date.getDate() + daysUntilMonday);

	// Format the date as DD.MM.YYYY
	const dayOfMonth = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
	const year = date.getFullYear();

	return `${dayOfMonth}.${month}.${year}`;
}
