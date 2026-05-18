package com.yujie.backend.service;

import com.yujie.backend.dto.CreateOrderItemRequest;
import com.yujie.backend.dto.CreateOrderRequest;
import com.yujie.backend.dto.OrderItemResponse;
import com.yujie.backend.dto.OrderResponse;
import com.yujie.backend.entity.Meal;
import com.yujie.backend.entity.Order;
import com.yujie.backend.entity.OrderItem;
import com.yujie.backend.exception.ResourceNotFoundException;
import com.yujie.backend.repository.MealRepository;
import com.yujie.backend.repository.OrderRepository;
import org.springframework.stereotype.Service;
import com.yujie.backend.dto.UpdateOrderStatusRequest;
import com.yujie.backend.entity.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final MealRepository mealRepository;

    public OrderService(OrderRepository orderRepository, MealRepository mealRepository) {
        this.orderRepository = orderRepository;
        this.mealRepository = mealRepository;
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        return mapToOrderResponse(order);
    }

    public OrderResponse createOrder(CreateOrderRequest request) {
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setOrderTime(LocalDateTime.now());

        double totalPrice = 0.0;

        for (CreateOrderItemRequest itemRequest : request.getItems()) {
            Meal meal = mealRepository.findById(itemRequest.getMealId())
                    .orElseThrow(() -> new ResourceNotFoundException("Meal not found with id: " + itemRequest.getMealId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setMeal(meal);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setItemPrice(meal.getPrice());

            totalPrice += orderItem.getSubtotal();

            order.addItem(orderItem);
        }

        order.setTotalPrice(totalPrice);

        Order savedOrder = orderRepository.save(order);

        return mapToOrderResponse(savedOrder);
    }

    public OrderResponse updateOrderStatus(Long id, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        OrderStatus newStatus = parseOrderStatus(request.getStatus());
        OrderStatus currentStatus = order.getStatus();

        validateStatusTransition(currentStatus, newStatus);

        order.setStatus(newStatus);

        Order updatedOrder = orderRepository.save(order);

        return mapToOrderResponse(updatedOrder);
    }

    public List<OrderResponse> getOrdersByStatus(String status) {
        OrderStatus orderStatus = parseOrderStatus(status);

        return orderRepository.findByStatus(orderStatus)
                .stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    private OrderStatus parseOrderStatus(String status) {
        try {
            return OrderStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException ex) {
            throw new IllegalArgumentException(
                    "Invalid order status. Status must be one of: PENDING, PREPARING, COMPLETED, CANCELLED"
            );
        }
    }

    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        orderRepository.delete(order);
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems()
                .stream()
                .map(this::mapToOrderItemResponse)
                .toList();

        String status = null;

        if (order.getStatus() != null) {
            status = order.getStatus().name();
        }

        return new OrderResponse(
                order.getId(),
                order.getCustomerName(),
                order.getOrderTime(),
                order.getTotalPrice(),
                status,
                itemResponses
        );
    }

    private OrderItemResponse mapToOrderItemResponse(OrderItem orderItem) {
        Long mealId = null;
        String mealName = null;

        if (orderItem.getMeal() != null) {
            mealId = orderItem.getMeal().getId();
            mealName = orderItem.getMeal().getName();
        }

        return new OrderItemResponse(
                orderItem.getId(),
                mealId,
                mealName,
                orderItem.getQuantity(),
                orderItem.getItemPrice(),
                orderItem.getSubtotal()
        );
    }
    private void validateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        if (currentStatus == null) {
            throw new IllegalArgumentException("Current order status cannot be null");
        }

        if (currentStatus == newStatus) {
            return;
        }

        if (currentStatus == OrderStatus.PENDING) {
            if (newStatus == OrderStatus.PREPARING || newStatus == OrderStatus.CANCELLED) {
                return;
            }
        }

        if (currentStatus == OrderStatus.PREPARING) {
            if (newStatus == OrderStatus.COMPLETED || newStatus == OrderStatus.CANCELLED) {
                return;
            }
        }

        if (currentStatus == OrderStatus.COMPLETED) {
            throw new IllegalArgumentException("Completed orders cannot be updated");
        }

        if (currentStatus == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Cancelled orders cannot be updated");
        }

        throw new IllegalArgumentException(
                "Invalid status transition: " + currentStatus + " cannot be changed to " + newStatus
        );
    }
}