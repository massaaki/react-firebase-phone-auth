import type firebase from "./config/firebaseConfig";

declare global {
    interface Window {
        recaptchaVerifier: firebase.auth.RecaptchaVerifier;
    }
}