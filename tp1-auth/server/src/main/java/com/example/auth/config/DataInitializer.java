package com.example.auth.config;

import com.example.auth.entity.User;
import com.example.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/** Initialise les données de test au démarrage de l'application.*/

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        // Créer le compte de test
        if (userRepository.findByEmail("toto@example.com").isEmpty()) {
            User testUser = new User("toto@example.com", "pwd1234");
            userRepository.save(testUser);
            System.out.println(" Compte créé : toto@example.com / pwd1234");
        }
    }
}