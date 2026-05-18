package com.yujie.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UpdateOrderStatusRequest {

    @NotBlank(message = "Order status cannot be blank")
    @Pattern(
            regexp = "(?i)^(PENDING|PREPARING|COMPLETED|CANCELLED)$",
            message = "Order status must be one of: PENDING, PREPARING, COMPLETED, CANCELLED"
    )
    private String status;

    public UpdateOrderStatusRequest() {
    }

    public UpdateOrderStatusRequest(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}