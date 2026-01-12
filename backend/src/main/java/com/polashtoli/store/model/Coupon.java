package com.polashtoli.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 50)
    private String code;
    
    @Column(name = "discount_type", nullable = false, length = 20)
    private String discountType;  // percentage, fixed
    
    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;
    
    @Column(name = "min_purchase", precision = 10, scale = 2)
    private BigDecimal minPurchase = BigDecimal.ZERO;
    
    @Column(name = "max_discount", precision = 10, scale = 2)
    private BigDecimal maxDiscount;
    
    @Column(name = "usage_limit")
    private Integer usageLimit;
    
    @Column(name = "used_count")
    private Integer usedCount = 0;
    
    @Column(name = "start_date")
    private LocalDate startDate;
    
    @Column(name = "end_date")
    private LocalDate endDate;
    
    @Column(length = 20)
    private String status = "active";  // active, inactive, expired
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (usedCount == null) {
            usedCount = 0;
        }
    }
    
    // Validation methods
    public boolean isValid() {
        if (!"active".equals(status)) {
            return false;
        }
        
        LocalDate today = LocalDate.now();
        
        if (startDate != null && today.isBefore(startDate)) {
            return false;
        }
        
        if (endDate != null && today.isAfter(endDate)) {
            return false;
        }
        
        if (usageLimit != null && usedCount >= usageLimit) {
            return false;
        }
        
        return true;
    }
    
    public BigDecimal calculateDiscount(BigDecimal orderAmount) {
        if (!isValid() || orderAmount.compareTo(minPurchase) < 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal discount;
        
        if ("percentage".equals(discountType)) {
            discount = orderAmount.multiply(discountValue).divide(new BigDecimal(100));
            if (maxDiscount != null && discount.compareTo(maxDiscount) > 0) {
                discount = maxDiscount;
            }
        } else {
            discount = discountValue;
        }
        
        return discount;
    }
}
