package com.example.auth.service;

import com.example.auth.entity.User;
import com.example.auth.exception.AuthenticationFailedException;
import com.example.auth.exception.InvalidInputException;
import com.example.auth.exception.ResourceConflictException;
import com.example.auth.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

/**
 * Service principal d'authentification SSO.
 * Genere de vrais tokens JWT signes avec la Master Key.
 */
@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private static final int MAX_ATTEMPTS = 5;
    private static final int LOCK_MINUTES = 2;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /** Inscrit un nouvel utilisateur avec politique de mot de passe stricte. */
    public User register(String email, String password) {
        if (email == null || email.isBlank()) {
            throw new InvalidInputException("L'email ne peut pas etre vide.");
        }
        if (!email.contains("@") || !email.contains(".")) {
            throw new InvalidInputException("Format d'email invalide.");
        }
        validatePassword(password);

        if (userRepository.findByEmail(email).isPresent()) {
            logger.warn("Inscription echouee - email deja existant : {}", email);
            throw new ResourceConflictException("Cet email est deja utilise.");
        }

        String hashedPassword = passwordEncoder.encode(password);
        User user = new User(email, hashedPassword);
        userRepository.save(user);
        logger.info("Inscription reussie pour : {}", email);
        return user;
    }

    /** Authentifie un utilisateur et retourne un vrai JWT signe avec la Master Key. */
    public String login(String email, String password) {
        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            throw new InvalidInputException("Email et mot de passe sont obligatoires.");
        }

        Optional<User> optUser = userRepository.findByEmail(email);
        if (optUser.isEmpty()) {
            logger.warn("Connexion echouee - email inconnu : {}", email);
            throw new AuthenticationFailedException("Email ou mot de passe incorrect.");
        }

        User user = optUser.get();

        // Verification du verrou anti brute-force
        if (user.getLockUntil() != null && user.getLockUntil().isAfter(LocalDateTime.now())) {
            throw new AuthenticationFailedException("Compte temporairement bloque. Reessayez dans 2 minutes.");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            user.setFailedAttempts(user.getFailedAttempts() + 1);
            if (user.getFailedAttempts() >= MAX_ATTEMPTS) {
                user.setLockUntil(LocalDateTime.now().plusMinutes(LOCK_MINUTES));
                logger.warn("Compte bloque pour : {}", email);
            }
            userRepository.save(user);
            logger.warn("Connexion echouee - mot de passe incorrect pour : {}", email);
            throw new AuthenticationFailedException("Email ou mot de passe incorrect.");
        }

        // Reinitialisation apres succes
        user.setFailedAttempts(0);
        user.setLockUntil(null);

        // Generation du vrai JWT signe avec la Master Key
        String token = generateJwtToken(user);
        user.setSessionToken(token);
        userRepository.save(user);
        logger.info("Connexion reussie pour : {}", email);
        return token;
    }

    /** Recupere les informations d'un utilisateur via son token JWT. */
    public User getMe(String token) {
        if (token == null || token.isBlank()) {
            throw new AuthenticationFailedException("Token de session manquant.");
        }
        return userRepository.findBySessionToken(token)
                .orElseThrow(() -> new AuthenticationFailedException("Token invalide ou expire."));
    }

    /** Genere un JWT signe avec la Master Key configuree dans application.properties. */
    private String generateJwtToken(User user) {
        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userId", user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /** Valide la politique de mot de passe. */
    private void validatePassword(String password) {
        if (password == null || password.length() < 8) {
            throw new InvalidInputException("Le mot de passe doit contenir au moins 8 caracteres.");
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
        if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};'\"\\\\|,.<>/?].*")) {
            throw new InvalidInputException("Le mot de passe doit contenir au moins un caractere special.");
        }
    }
}