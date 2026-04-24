package com.example.auth.exception;

/** Données invalides = erreur 400.*/
public class InvalidInputException extends RuntimeException {
    public InvalidInputException(String message) {
        super(message);
    }
}