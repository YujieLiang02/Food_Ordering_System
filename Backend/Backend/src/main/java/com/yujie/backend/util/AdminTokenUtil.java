package com.yujie.backend.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class AdminTokenUtil {

    @Value("${admin.token.expire-minutes:120}")
    private long expireMinutes;

    private final Map<String, TokenInfo> tokenStore = new ConcurrentHashMap<>();

    public String generateToken(String username) {
        String token = UUID.randomUUID().toString();

        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(expireMinutes);

        TokenInfo tokenInfo = new TokenInfo(username, expiresAt);

        tokenStore.put(token, tokenInfo);

        return token;
    }

    public boolean isValidToken(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }

        TokenInfo tokenInfo = tokenStore.get(token);

        if (tokenInfo == null) {
            return false;
        }

        if (LocalDateTime.now().isAfter(tokenInfo.getExpiresAt())) {
            tokenStore.remove(token);
            return false;
        }

        return true;
    }

    public String getUsernameByToken(String token) {
        if (!isValidToken(token)) {
            return null;
        }

        return tokenStore.get(token).getUsername();
    }

    public LocalDateTime getExpiresAt(String token) {
        TokenInfo tokenInfo = tokenStore.get(token);

        if (tokenInfo == null) {
            return null;
        }

        return tokenInfo.getExpiresAt();
    }

    public void removeToken(String token) {
        if (token != null) {
            tokenStore.remove(token);
        }
    }

    private static class TokenInfo {

        private String username;
        private LocalDateTime expiresAt;

        public TokenInfo(String username, LocalDateTime expiresAt) {
            this.username = username;
            this.expiresAt = expiresAt;
        }

        public String getUsername() {
            return username;
        }

        public LocalDateTime getExpiresAt() {
            return expiresAt;
        }
    }
}