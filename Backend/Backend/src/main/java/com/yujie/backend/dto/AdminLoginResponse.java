package com.yujie.backend.dto;

import java.time.LocalDateTime;

public class AdminLoginResponse {

    private String token;
    private String tokenType;
    private String username;
    private LocalDateTime expiresAt;

    public AdminLoginResponse() {
    }

    public AdminLoginResponse(String token, String tokenType, String username, LocalDateTime expiresAt) {
        this.token = token;
        this.tokenType = tokenType;
        this.username = username;
        this.expiresAt = expiresAt;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
}