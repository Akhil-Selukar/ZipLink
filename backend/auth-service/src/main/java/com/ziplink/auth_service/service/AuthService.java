package com.ziplink.auth_service.service;

import com.ziplink.auth_service.dto.JwkKey;
import com.ziplink.auth_service.dto.JwksResponse;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.Encoders;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.time.Duration;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
public class AuthService {
    @Value("${auth.token.validity}")
    private Integer tokenValiditySec;

    @Value("${auth.secret.privateKey}")
    private String privateKeyStr;

    @Value("${auth.secret.publicKey}")
    private String publicKeyStr;

    @Value("${auth.unique.key.id}")
    private String keyId;

    private final RedisTemplate redisTemplate;

    private JwksResponse jwksResponse;

    public AuthService(RedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @PostConstruct
    public void initJwksCache() {
        try {
            // Calculate once at application startup
            byte[] keyBytes = Decoders.BASE64.decode(cleanKey(this.publicKeyStr));
            X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            RSAPublicKey rsaPublicKey = (RSAPublicKey) kf.generatePublic(spec);

            String modulus = Encoders.BASE64URL.encode(rsaPublicKey.getModulus().toByteArray());
            String exponent = Encoders.BASE64URL.encode(rsaPublicKey.getPublicExponent().toByteArray());

            JwkKey jwk = new JwkKey("RSA", "sig", "RS256", this.keyId, modulus, exponent);
            this.jwksResponse = new JwksResponse(List.of(jwk));

        } catch (Exception e) {
            throw new RuntimeException("Critical failure: Could not initialize JWKS cache", e);
        }
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getPublicSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        String loggedOutTokenKey = "invalidToken:" + token;
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token) && !redisTemplate.hasKey(loggedOutTokenKey));
    }


    public String generateToken(String userName) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userName);
    }

    private String createToken(Map<String, Object> claims, String userName) {
        return Jwts.builder()
                .header().keyId(keyId).and()
                .claims(claims)
                .subject(userName)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + (1000L * tokenValiditySec)))
                .signWith(getPrivateSignKey())
                .compact();
    }

    private PublicKey getPublicSignKey() {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(cleanKey(this.publicKeyStr));
            X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            return kf.generatePublic(spec);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse RSA Public Key", e);
        }
    }

    private PrivateKey getPrivateSignKey() {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(cleanKey(this.privateKeyStr));
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            return kf.generatePrivate(spec);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to parse RSA Private Key", e);
        }
    }

    public JwksResponse getJwksJson() {
        return this.jwksResponse;
    }

    public void logoutUser(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        token = token.substring(7);
        String redisKey = "invalidToken:" + token;
        redisTemplate.opsForValue().set(redisKey, token, Duration.ofMillis((1000L * tokenValiditySec)));
    }

    private String cleanKey(String key) {
        return key.replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s+", "");
    }
}
