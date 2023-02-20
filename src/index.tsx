import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Home from "./components/landingPage/Home";
import { Provider } from "react-redux";
import { appStore, persistedAppStore } from "./redux/store";
import "./global.css";
import { PersistGate } from "redux-persist/integration/react";
import { unregister } from "./serviceWorker";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<Provider store={appStore}>
			<PersistGate loading={null} persistor={persistedAppStore}>
				<Home />
			</PersistGate>
		</Provider>
	</React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
unregister();
