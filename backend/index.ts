import type { Server } from "bun";
import { Database } from "bun:sqlite";

const db = new Database("db.sqlite", { create: true });
db.exec("PRAGMA journal_mode = WAL;");

db.exec(`
	CREATE TABLE IF NOT EXISTS users (
		username TEXT NOT NULL PRIMARY KEY,
		displayname TEXT NOT NULL,
		hedisplayname TEXT,
		password TEXT NOT NULL
	);
    CREATE TABLE IF NOT EXISTS completions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
		pages TEXT NOT NULL,
		question INTEGER NOT NULL,
		user TEXT NOT NULL,
		UNIQUE(user, question, pages),
		FOREIGN KEY (user) REFERENCES users(username)
    );
`);

// db.query(
// 	`INSERT INTO users (username, displayname, hedisplayname, password) VALUES (?, ?, ?, ?)`
// ).run("dror.keren7", "Dror Keren", "דרור קרן", await Bun.password.hash("re9yuy"));
// db.query(
// 	`INSERT INTO users (username, displayname, hedisplayname, password) VALUES (?, ?, ?, ?)`
// ).run("yaardreamer", "Yaar Dreamer", "יער דרימר", await Bun.password.hash("NightmareHelpy234"));

type User = {
	username: string;
	displayname: string;
	hedisplayname: string;
	password: string;
};

type Question = {
	question: number;
	pages: string;
	completed_users: string;
};

const CORS_HEADERS = {
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "OPTIONS, POST",
		"Access-Control-Allow-Headers": "Content-Type, Authorization"
	}
};

function sendQuestionCompleters(server: Server) {
	let question_completers: Question[] = db
		.query(
			"SELECT c.question, c.pages, GROUP_CONCAT(u.displayname) AS completed_users FROM completions c JOIN users u ON c.user = u.username GROUP BY c.question, c.pages;"
		)
		.all();
	server.publish("question_completers", JSON.stringify(question_completers));
}

const server = Bun.serve({
	port: 3000,
	static: {
		"/question_list": Response.json(await Bun.file("question_list.json").json(), CORS_HEADERS)
	},
	async fetch(req, server) {
		const success = server.upgrade(req);
		if (success) return undefined;

		const url = new URL(req.url);
		const getParam = (key: string) => url.searchParams.get(key) ?? "";

		const user: User = db
			.query("SELECT * FROM users WHERE username = $username")
			.get({ $username: getParam("username") });
		const authenticated = await Bun.password.verify(getParam("password"), user.password);

		if (authenticated) {
			if (url.pathname === "/login") {
				return Response.json(
					{
						okay: true,
						username: user.username,
						displayname: user.displayname,
						hedisplayname: user.hedisplayname
					},
					CORS_HEADERS
				);
			} else if (url.pathname === "/mark") {
				db.query("INSERT INTO completions (pages, question, user) VALUES (?, ?, ?)").run(
					getParam("pages"),
					getParam("question"),
					user.username
				);

				sendQuestionCompleters(server);
				return Response.json({ okay: true }, CORS_HEADERS);
			}
		} else return Response.json({ okay: false }, CORS_HEADERS);
	},
	websocket: {
		async open(ws) {
			ws.subscribe("question_completers");
			sendQuestionCompleters(server);
		},
		async message() {},
		async close(ws) {
			ws.unsubscribe("question_completers");
		}
	}
});

console.log(`Listening on ${server.hostname}:${server.port}`);
