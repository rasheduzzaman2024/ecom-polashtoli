package com.polashtoli.repository;

import com.polashtoli.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    // Find by order ID
    List<OrderItem> findByOrderId(String orderId);
    
    // Find by product ID
    List<OrderItem> findByProductId(String productId);
}
