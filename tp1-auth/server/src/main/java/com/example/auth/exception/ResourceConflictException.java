package com.example.auth.exception;

/** Email déjà utilisé = erreur 409. */
public class ResourceConflictException extends RuntimeException {
    public ResourceConflictException(String message) {
        super(message);
    }
}