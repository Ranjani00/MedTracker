package com.medtracker.controller;

import com.medtracker.model.User;
import com.medtracker.repository.UserRepository;
import com.medtracker.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepo, PasswordEncoder encoder, JwtUtil jwtUtil) {
        this.userRepo = userRepo; this.encoder = encoder; this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String,String> body) {
        if (userRepo.existsByEmail(body.get("email")))
            return ResponseEntity.badRequest().body(Map.of("error","Email already exists"));
        User user = new User();
        user.setName(body.get("name"));
        user.setEmail(body.get("email"));
        user.setPassword(encoder.encode(body.get("password")));
        userRepo.save(user);
        String token = jwtUtil.generate(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(Map.of("token", token, "user", Map.of(
            "id", user.getId(), "name", user.getName(),
            "email", user.getEmail(), "role", user.getRole())));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> body) {
        return userRepo.findByEmail(body.get("email"))
            .filter(u -> encoder.matches(body.get("password"), u.getPassword()))
            .map(u -> {
                String token = jwtUtil.generate(u.getEmail(), u.getRole().name());
                return ResponseEntity.ok(Map.of("token", token, "user", Map.of(
                    "id", u.getId(), "name", u.getName(),
                    "email", u.getEmail(), "role", u.getRole())));
            })
            .orElse(ResponseEntity.status(401).body(Map.of("error","Invalid credentials")));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(Map.of(
            "id", user.getId(), "name", user.getName(),
            "email", user.getEmail(), "role", user.getRole()));
    }
}
