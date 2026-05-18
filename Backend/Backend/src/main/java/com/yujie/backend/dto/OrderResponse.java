package com.yujie.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {

    private Long id;
    private String customerName;
    private LocalDateTime orderTime;
    private Double totalPrice;
    private String status;
    private List<OrderItemResponse> items;

    public OrderResponse() {
    }

    public OrderResponse(Long id, String customerName, LocalDateTime orderTime,
                         Double totalPrice, String status, List<OrderItemResponse> items) {
        this.id = id;
        this.customerName = customerName;
        this.orderTime = orderTime;
        this.totalPrice = totalPrice;
        this.status = status;
        this.items = items;
    }

    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public LocalDateTime getOrderTime() {
        return orderTime;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setOrderTime(LocalDateTime orderTime) {
        this.orderTime = orderTime;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }
}