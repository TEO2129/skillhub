package com.example.auth.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Utilisateur en base de données.
 * TP2 : ajout des champs anti brute-force.
 */
@Entity
@Table(name = "users")
public class User {

    /** Identifiant unique auto-généré. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Email unique de l'utilisateur. */
    @Column(unique = true, nullable = false)
    private String email;

    /** Mot de passe hashé avec BCrypt. */
    @Column(name = "password", nullable = false)
    private String password;

    /** Token de session simple généré à la connexion. */
    @Column(name = "session_token")
    private String sessionToken;

    /** Nombre de tentatives de connexion échouées. */
    @Column(name = "failed_attempts")
    private int failedAttempts = 0;

    /** Date jusqu'à laquelle le compte est bloqué. */
    @Column(name = "lock_until")
    private LocalDateTime lockUntil;

    /** Date de création du compte. */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public User() {}

    public User(String email, String password) {
        this.email = email;
        this.password = password;
        this.createdAt = LocalDateTime.now();
    }

    // Getters & Setters
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getSessionToken() { return sessionToken; }
    public void setSessionToken(String sessionToken) { this.sessionToken = sessionToken; }
    public int getFailedAttempts() { return failedAttempts; }
    public void setFailedAttempts(int failedAttempts) { this.failedAttempts = failedAttempts; }
    public LocalDateTime getLockUntil() { return lockUntil; }
    public void setLockUntil(LocalDateTime lockUntil) { this.lockUntil = lockUntil; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}