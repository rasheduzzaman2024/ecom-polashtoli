package com.polashtoli.repository;

import com.polashtoli.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    
    // Find by category
    List<Product> findByCategory(String category);
    
    // Find by SKU
    Optional<Product> findBySku(String sku);
    
    // Find by status
    List<Product> findByStatus(String status);
    
    // Find featured products
    List<Product> findByFeaturedTrue();
    
    // Find by stock status
    List<Product> findByStockGreaterThan(Integer minStock);
    List<Product> findByStockBetween(Integer min, Integer max);
    List<Product> findByStockEquals(Integer stock);
    
    // Find by date
    List<Product> findByCreatedAt(LocalDate date);
    List<Product> findByCreatedAtBetween(LocalDate startDate, LocalDate endDate);
    
    // Search by name
    List<Product> findByNameContainingIgnoreCase(String name);
    
    // Search by name or SKU or category
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.sku) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> search(@Param("query") String query);
    
    // Count by date
    Long countByCreatedAt(LocalDate date);
    
    // Count by category
    Long countByCategory(String category);
    
    // Count by status
    Long countByStatus(String status);
}
