package com.example.auth;

import com.example.auth.exception.AuthenticationFailedException;
import com.example.auth.exception.InvalidInputException;
import com.example.auth.exception.ResourceConflictException;
import com.example.auth.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

/** Tests unitaires du service d'authentification */
@SpringBootTest
@Transactional
class AuthServiceTest {

    @Autowired
    private AuthService authService;
    /** Test 1 : email vide → InvalidInputException */
    @Test
    void testRegister_EmailVide_ShouldThrow() {
        assertThrows(InvalidInputException.class,
                () -> authService.register("", "abcd"));
    }

    /** Test 2 : email format incorrect → InvalidInputException */
    @Test
    void testRegister_EmailFormatIncorrect_ShouldThrow() {
        assertThrows(InvalidInputException.class,
                () -> authService.register("pasunemail", "abcd"));
    }

    // =========================================================
    // Tests de validation du mot de passe
    // =========================================================

    /** Test 3 : mot de passe trop court (< 4 caractères) → InvalidInputException */
    @Test
    void testRegister_PasswordTropCourt_ShouldThrow() {
        assertThrows(InvalidInputException.class,
                () -> authService.register("user@test.com", "abc"));
    }

    // =========================================================
    // Tests d'inscription
    // =========================================================

    /** Test 4 : inscription OK */
    @Test
    void testRegister_OK() {
        assertDoesNotThrow(() -> authService.register("newuser@test.com", "abcd"));
    }

    /** Test 5 : inscription refusée si email déjà existant → ResourceConflictException */
    @Test
    void testRegister_EmailDejaExistant_ShouldThrow() {
        authService.register("duplicate@test.com", "abcd");
        assertThrows(ResourceConflictException.class,
                () -> authService.register("duplicate@test.com", "abcd"));
    }

    // =========================================================
    // Tests de connexion
    // =========================================================

    /** Test 6 : login OK */
    @Test
    void testLogin_OK() {
        authService.register("login@test.com", "abcd");
        String token = authService.login("login@test.com", "abcd");
        assertNotNull(token);
        assertFalse(token.isBlank());
    }

    /** Test 7 : login KO si mot de passe incorrect → AuthenticationFailedException */
    @Test
    void testLogin_MauvaisMotDePasse_ShouldThrow() {
        authService.register("wrongpwd@test.com", "abcd");
        assertThrows(AuthenticationFailedException.class,
                () -> authService.login("wrongpwd@test.com", "mauvais"));
    }

    /** Test 8 : login KO si email inconnu → AuthenticationFailedException */
    @Test
    void testLogin_EmailInconnu_ShouldThrow() {
        assertThrows(AuthenticationFailedException.class,
                () -> authService.login("inconnu@test.com", "abcd"));
    }

    // =========================================================
    // Tests de la route protégée /api/me
    // =========================================================

    /** Test 9 : accès /api/me refusé sans token */
    @Test
    void testGetMe_SansToken_ShouldThrow() {
        assertThrows(AuthenticationFailedException.class,
                () -> authService.getMe(null));
    }

    /** Test 10 : accès /api/me OK après login */
    @Test
    void testGetMe_OK_ApresLogin() {
        authService.register("me@test.com", "abcd");
        String token = authService.login("me@test.com", "abcd");
        var user = authService.getMe(token);
        assertEquals("me@test.com", user.getEmail());
    }
}