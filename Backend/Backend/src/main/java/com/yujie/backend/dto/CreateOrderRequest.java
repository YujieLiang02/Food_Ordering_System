package com.yujie.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public class CreateOrderRequest {

    @NotBlank(message = "Customer name cannot be blank")
    @Size(max = 100, message = "Customer name cannot be longer than 100 characters")
    private String customerName;

    @NotEmpty(message = "Order items cannot be empty")
    @Valid
    private List<CreateOrderItemRequest> items;

    public CreateOrderRequest() {
    }

    public CreateOrderRequest(String customerName, List<CreateOrderItemRequest> items) {
        this.customerName = customerName;
        this.items = items;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public List<CreateOrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<CreateOrderItemRequest> items) {
        this.items = items;
    }
}