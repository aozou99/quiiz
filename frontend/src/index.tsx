import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import { Helmet } from "react-helmet";

fetch("/__/firebase/init.json").then(async (response) => {
  const json = await response.json();
  firebase.initializeApp({ ...json, authDomain: "quiiz.space" });
  // Initialize other services on firebase instance
  const db = firebase.firestore(); // <- needed if using firestore
  firebase.functions(); // <- needed if using httpsCallable
  // ローカル開発環境のときはエミュレーターに向ける
  if (window.location.hostname === "localhost") {
    firebase.functions().useFunctionsEmulator("http://localhost:5001");
    db.settings({
      host: "localhost:8080",
      ssl: false,
    });
  }

  ReactDOM.render(
    <BrowserRouter>
      <Helmet>
        <meta
          name="description"
          content="Quiizでは興味があるクイズを楽しんだり、オリジナルクイズを投稿して多くの人に新たな知識を共有できます"
        />
        <title>Quiiz</title>
      </Helmet>
      <App />
    </BrowserRouter>,
    document.getElementById("root")
  );
  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
});
