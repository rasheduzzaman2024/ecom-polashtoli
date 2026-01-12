package com.polashtoli.repository;

import com.polashtoli.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    
    // Find by customer
    List<Order> findByCustomerId(Long customerId);
    
    // Find by status
    List<Order> findByStatus(String status);
    
    // Find by payment status
    List<Order> findByPaymentStatus(String paymentStatus);
    
    // Find by date range
    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    // Find recent orders
    List<Order> findTop10ByOrderByCreatedAtDesc();
    
    // Count by status
    Long countByStatus(String status);
    
    // Count by date
    @Query("SELECT COUNT(o) FROM Order o WHERE DATE(o.createdAt) = CURRENT_DATE")
    Long countTodayOrders();
}
