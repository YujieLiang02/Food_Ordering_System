package com.yujie.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class AdminEntryRequest {

    @NotBlank(message = "Entry code is required")
    private String entryCode;

    public AdminEntryRequest() {
    }

    public AdminEntryRequest(String entryCode) {
        this.entryCode = entryCode;
    }

    public String getEntryCode() {
        return entryCode;
    }

    public void setEntryCode(String entryCode) {
        this.entryCode = entryCode;
    }
}