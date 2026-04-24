package com.example.auth.exception;

/** email inconnu ou mot de passe incorrect = erreur 401. */
public class AuthenticationFailedException extends RuntimeException {
    public AuthenticationFailedException(String message) {
        super(message);
    }
}