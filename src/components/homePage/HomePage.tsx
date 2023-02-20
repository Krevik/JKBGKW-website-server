import "./HomePage.css";
import backgroundImage from "../../resources/backgrounds/background_1.jpg";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import commandsFileLoc from "../../resources/commands/commands.json";
import React from "react";

type Command = {
	command: string;
	description: string;
};

type ServerInfo = {
	name: string;
	players: number;
	status: number;
	map: string;
	maxplayers: number;
	password: number;
};

export default function HomePage() {
	const [commands, setCommands] = useState<Command[]>([]);
	const [serverInfo, setServerInfo] = useState<ServerInfo>();

	//load commands from file
	useEffect(() => {
		const localCommands: Command[] = [];
		commandsFileLoc.forEach((readCommand: Command) => {
			localCommands.push(readCommand);
		});
		setCommands(localCommands);
	}, []);

	//load server info
	useEffect(() => {
		fetch("api/serverInfo").then((res) => {
			console.log(res);
		});
	}, []);

	return (
		<div
			className="home-page"
			style={{
				backgroundImage: `url(${backgroundImage})`,
			}}
		>
			<div className="card">
				<div
					className="section"
					style={{ paddingLeft: "var(--standardPadding)" }}
				>
					<div className="centered-text">Kether.pl Competitive 108T</div>
					<div className="centered-text">IP: 51.83.217.86:29800</div>
				</div>

				<div className="section">
					<div
						className="centered-text"
						style={{ transform: "translate(0%, 250%)" }}
					>
						You can download all the custom maps installed on the server
						<a
							style={{
								display: "inline-block",
								marginLeft: "10px",
								textDecoration: "none",
								color: "white",
								WebkitTextStroke: " 3px red",
							}}
							href="https://steamcommunity.com/sharedfiles/filedetails/?id=2542824628"
						>
							HERE
						</a>
					</div>
				</div>

				<div
					className="section"
					style={{ paddingRight: "var(--standardPadding)" }}
				>
					<DataTable
						value={commands}
						responsiveLayout="scroll"
						style={{
							backgroundColor: "transparent",
							background: "transparent",
						}}
					>
						<Column field="command" header="Command"></Column>
						<Column field="description" header="Description"></Column>
					</DataTable>
				</div>
			</div>
		</div>
	);
}
