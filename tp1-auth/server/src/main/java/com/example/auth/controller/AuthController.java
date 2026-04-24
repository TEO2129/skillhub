package com.example.auth.controller;

import com.example.auth.entity.User;
import com.example.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    /** Constructeur avec injection de dépendance.*/
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /** Inscrit un nouvel utilisateur. */
    @PostMapping("/api/auth/register")
    public ResponseEntity<Map<String, String>> register(
            @RequestParam String email,
            @RequestParam String password) {
        authService.register(email, password);
        return ResponseEntity.ok(Map.of("message", "Inscription réussie."));
    }

    /** Connecte un utilisateur */
    @PostMapping("/api/auth/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestParam String email,
            @RequestParam String password) {
        String token = authService.login(email, password);
        return ResponseEntity.ok(Map.of(
                "message", "Connexion réussie.",
                "token", token
        ));
    }

    /** Retourne les informations de l'utilisateur authentifié.
     */
    @GetMapping("/api/me")
    public ResponseEntity<Map<String, Object>> getMe(
            @RequestHeader("X-Session-Token") String token) {
        User user = authService.getMe(token);
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "createdAt", user.getCreatedAt().toString()
        ));
    }
}