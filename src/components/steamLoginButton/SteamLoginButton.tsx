import { useSelector } from "react-redux";
import "./SteamLoginButton.css";
import { Button } from "primereact/button";
import { AppState, appStore } from "../../redux/store";
import { authenticationActions } from "../../redux/slices/authenticationSlice";
import React from "react";

const HOST_URL = "http://kether.pl";

export default function SteamLoginButton() {
	const userID = useSelector(
		(state: AppState) => state.authenticationReducer.userID
	);

	return !userID ? (
		<div className="steam-login-button">
			<form action="https://steamcommunity.com/openid/login" method="post">
				<input
					type="hidden"
					name="openid.identity"
					value="http://specs.openid.net/auth/2.0/identifier_select"
				/>
				<input
					type="hidden"
					name="openid.claimed_id"
					value="http://specs.openid.net/auth/2.0/identifier_select"
				/>
				<input
					type="hidden"
					name="openid.ns"
					value="http://specs.openid.net/auth/2.0"
				/>
				<input type="hidden" name="openid.mode" value="checkid_setup" />
				<input type="hidden" name="openid.realm" value={HOST_URL} />
				<input type="hidden" name="openid.return_to" value={HOST_URL} />
				<Button type="submit">
					<img
						alt="Steam login button img"
						src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/steamworks_docs/polish/sits_small.png"
					/>
				</Button>
			</form>
		</div>
	) : (
		<Button
			onClick={() => {
				appStore.dispatch(authenticationActions.setUserID(undefined));
			}}
			type="submit"
		>
			Log me out
		</Button>
	);
}
