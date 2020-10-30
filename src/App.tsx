import React, { useState } from "react";
import firebase from "./config/firebaseConfig";

import "./App.css";

function App() {
  const [loading, setloading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [captchaSolved, setCaptchaSolved] = useState(false);
  const [codeConfirmation, setCodeConfirmation] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<
    firebase.auth.ConfirmationResult
  >();

  const setupRecaptcha = () => {
    try {
      console.log("[CREATING CAPTCHA VERIFIER]");
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: function (response: any) {
            console.log("[CAPTCHA RESOLVED]", response);
            setCaptchaSolved(true);
          },
        }
      );
    } catch (error) {
      console.log("error..:", error);
      setCaptchaSolved(false);
    }
  };

  const onSubmit = async () => {
    console.log("[SENDING PHONE NUMBER]");
    setupRecaptcha();

    console.log("window.recaptchaVerifier", window.recaptchaVerifier);

    const phoneNumber = "+5517988138299";
    const appVerifier = window.recaptchaVerifier;

    if (appVerifier) {
      try {
        setloading(true);
        const confirmationResultResponse = await firebase
          .auth()
          .signInWithPhoneNumber(phoneNumber, appVerifier);
        setConfirmationResult(confirmationResultResponse);
        setloading(false);
      } catch (error) {
        console.log("Error(SMS not sent)..:", error);
        setloading(false);
      }
    }
  };

  const confirmCode = async () => {
    console.log("[CONFIRM CODE]");

    if (confirmationResult && codeConfirmation) {
      console.log("confirmationResult..:", confirmationResult);
      console.log("codeConfirmation..:", codeConfirmation);

      try {
        setloading(true);
        const result = await confirmationResult.confirm(codeConfirmation);
        console.log("[REGISTRATION SUCCESS]");
        console.log("result", result.user?.uid);
        setComplete(true);
        setloading(false);
      } catch (error) {
        console.log("error..:", error);
        setloading(false);
      }
    }
  };

  const changeCodeConfirmation = (event: any) => {
    const code = event.target.value;
    setCodeConfirmation(code);
  };

  return (
    <div className="App">
      <h1>POC - Firebase Phone Auth</h1>
      <div className="instructions">
        <h2>Instruções</h2>
        <p>
          <span>Clique em enviar</span> (já está com um número de testes que foi
          configurado no Firebase)
        </p>
        <p>
          Utilize o código de confirmação <span>"123456"</span>
        </p>
      </div>

      {!captchaSolved && (
        <form>
          <div id="recaptcha-container"></div>
          {/* <input type="text" name="phoneNumber" /> */}
          <input type="button" value="Cadastrar celular" onClick={onSubmit} />
        </form>
      )}
      {captchaSolved && !complete && (
        <form>
          <input
            type="text"
            name="codeConfirmation"
            onChange={changeCodeConfirmation}
          />
          <input type="button" value="Confirm code" onClick={confirmCode} />
        </form>
      )}
      {complete && <h3>Cadastro realizado com sucesso!</h3>}

      {loading && <div>Loading...</div>}
    </div>
  );
}

export default App;
