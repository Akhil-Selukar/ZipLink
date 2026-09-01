package com.ziplink.auth_service.controller;

import com.ziplink.auth_service.dto.AuthRequestDTO;
import com.ziplink.auth_service.dto.JwksResponse;
import com.ziplink.auth_service.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthenticationManager authenticationManager;
    private final AuthService authService;

    public AuthController(AuthenticationManager authenticationManager, AuthService authService) {
        this.authenticationManager = authenticationManager;
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> authenticateAndGetToken(@RequestBody AuthRequestDTO authRequestDTO){
        logger.debug("login request received for {}", authRequestDTO.getUserName());
        try{
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequestDTO.getUserName(), authRequestDTO.getPassword()));

            if(authentication.isAuthenticated()){
                String token = authService.generateToken(authRequestDTO.getUserName());

                Map<String, String> response = new HashMap<>();
                response.put("token", token);
                return ResponseEntity.ok(response);
            } else {
                logger.warn("Invalid username or password");
                throw new BadCredentialsException("Invalid username or password.");
            }
        } catch (Exception e){
            logger.warn("Invalid username or password");
            Map<String, String> response = new HashMap<>();
            response.put("error", "Invalid username or password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request) {

        authService.logoutUser(request);

        return ResponseEntity.noContent().build();
    }

    // endpoint for API gateway to fetch public key on startup
    @GetMapping("/.well-known/jwks.json")
    public JwksResponse getJwks() {
        return authService.getJwksJson();
    }
}
