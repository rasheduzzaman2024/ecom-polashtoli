package com.polashtoli.service;

import com.polashtoli.model.Order;
import com.polashtoli.model.OrderItem;
import com.polashtoli.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {
    
    private final OrderRepository orderRepository;
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
    }
    
    public Order createOrder(Order order) {
        // Calculate totals
        BigDecimal total = BigDecimal.ZERO;
        for (OrderItem item : order.getItems()) {
            item.setOrder(order);
            total = total.add(item.getSubtotal());
        }
        
        order.setTotalAmount(total);
        
        // Apply discount if present
        BigDecimal finalAmount = total.subtract(order.getDiscountAmount() != null ? 
                order.getDiscountAmount() : BigDecimal.ZERO);
        order.setFinalAmount(finalAmount);
        
        return orderRepository.save(order);
    }
    
    public Order updateOrder(String id, Order orderDetails) {
        Order existingOrder = getOrderById(id);
        
        existingOrder.setStatus(orderDetails.getStatus());
        existingOrder.setPaymentStatus(orderDetails.getPaymentStatus());
        existingOrder.setPaymentMethod(orderDetails.getPaymentMethod());
        existingOrder.setShippingAddress(orderDetails.getShippingAddress());
        
        return orderRepository.save(existingOrder);
    }
    
    public Order updateOrderStatus(String id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }
    
    public void deleteOrder(String id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found with ID: " + id);
        }
        orderRepository.deleteById(id);
    }
    
    public List<Order> getOrdersByCustomerId(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }
    
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }
    
    public List<Order> getRecentOrders() {
        return orderRepository.findTop10ByOrderByCreatedAtDesc();
    }
    
    public Long getTotalCount() {
        return orderRepository.count();
    }
    
    public Long getCountByStatus(String status) {
        return orderRepository.countByStatus(status);
    }
    
    public Long getTodayCount() {
        return orderRepository.countTodayOrders();
    }
}
