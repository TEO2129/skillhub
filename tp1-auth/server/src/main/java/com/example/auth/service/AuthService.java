package com.example.auth.service;

import com.example.auth.entity.User;
import com.example.auth.exception.AuthenticationFailedException;
import com.example.auth.exception.InvalidInputException;
import com.example.auth.exception.ResourceConflictException;
import com.example.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Service principal d'authentification.
 * TP2 améliore le stockage avec BCrypt mais ne protège pas encore contre le rejeu.
 */
@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private static final int MAX_ATTEMPTS = 5;
    private static final int LOCK_MINUTES = 2;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /** Inscrit un nouvel utilisateur avec politique de mot de passe stricte. */
    public User register(String email, String password) {
        if (email == null || email.isBlank()) {
            throw new InvalidInputException("L'email ne peut pas être vide.");
        }
        if (!email.contains("@") || !email.contains(".")) {
            throw new InvalidInputException("Format d'email invalide.");
        }
        validatePassword(password);

        if (userRepository.findByEmail(email).isPresent()) {
            logger.warn("Inscription échouée - email déjà existant : {}", email);
            throw new ResourceConflictException("Cet email est déjà utilisé.");
        }

        String hashedPassword = passwordEncoder.encode(password);
        User user = new User(email, hashedPassword);
        userRepository.save(user);
        logger.info("Inscription réussie pour : {}", email);
        return user;
    }

    /** Authentifie un utilisateur avec protection anti brute-force. */
    public String login(String email, String password) {
        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            throw new InvalidInputException("Email et mot de passe sont obligatoires.");
        }

        Optional<User> optUser = userRepository.findByEmail(email);
        if (optUser.isEmpty()) {
            logger.warn("Connexion échouée - email inconnu : {}", email);
            throw new AuthenticationFailedException("Email ou mot de passe incorrect.");
        }

        User user = optUser.get();

        // Vérification du verrou
        if (user.getLockUntil() != null && user.getLockUntil().isAfter(LocalDateTime.now())) {
            throw new AuthenticationFailedException("Compte temporairement bloqué. Réessayez dans 2 minutes.");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            user.setFailedAttempts(user.getFailedAttempts() + 1);
            if (user.getFailedAttempts() >= MAX_ATTEMPTS) {
                user.setLockUntil(LocalDateTime.now().plusMinutes(LOCK_MINUTES));
                logger.warn("Compte bloqué pour : {}", email);
            }
            userRepository.save(user);
            logger.warn("Connexion échouée - mot de passe incorrect pour : {}", email);
            throw new AuthenticationFailedException("Email ou mot de passe incorrect.");
        }

        // Réinitialisation après succès
        user.setFailedAttempts(0);
        user.setLockUntil(null);
        String token = UUID.randomUUID().toString();
        user.setSessionToken(token);
        userRepository.save(user);
        logger.info("Connexion réussie pour : {}", email);
        return token;
    }

    /** Récupère les informations d'un utilisateur via son token de session. */
    public User getMe(String token) {
        if (token == null || token.isBlank()) {
            throw new AuthenticationFailedException("Token de session manquant.");
        }
        return userRepository.findBySessionToken(token)
                .orElseThrow(() -> new AuthenticationFailedException("Token invalide ou expiré."));
    }

    /** Valide la politique de mot de passe TP2. */
    private void validatePassword(String password) {
        if (password == null || password.length() < 12) {
            throw new InvalidInputException("Le mot de passe doit contenir au moins 12 caractères.");
        }
        if (!password.matches(".*[A-Z].*")) {
            throw new InvalidInputException("Le mot de passe doit contenir au moins une majuscule.");
        }
        if (!password.matches(".*[a-z].*")) {
            throw new InvalidInputException("Le mot de passe doit contenir au moins une minuscule.");
        }
        if (!password.matches(".*[0-9].*")) {
            throw new InvalidInputException("Le mot de passe doit contenir au moins un chiffre.");
        }
        if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*")) {
            throw new InvalidInputException("Le mot de passe doit contenir au moins un caractère spécial.");
        }
    }
}