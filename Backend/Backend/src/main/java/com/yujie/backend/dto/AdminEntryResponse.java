package com.yujie.backend.dto;

public class AdminEntryResponse {

    private boolean allowed;
    private String message;

    public AdminEntryResponse() {
    }

    public AdminEntryResponse(boolean allowed, String message) {
        this.allowed = allowed;
        this.message = message;
    }

    public boolean isAllowed() {
        return allowed;
    }

    public void setAllowed(boolean allowed) {
        this.allowed = allowed;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}