package com.example.auth.repository;

import com.example.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    /** Recherche un utilisateur par son email.*/
    Optional<User> findByEmail(String email);

    /** Recherche un utilisateur par son token de session. */
    Optional<User> findBySessionToken(String sessionToken);
}