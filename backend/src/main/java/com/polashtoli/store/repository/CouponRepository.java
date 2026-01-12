package com.polashtoli.repository;

import com.polashtoli.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    
    // Find by code
    Optional<Coupon> findByCode(String code);
    
    // Find by status
    List<Coupon> findByStatus(String status);
    
    // Find active coupons
    List<Coupon> findByStatusAndEndDateGreaterThanEqual(String status, LocalDate date);
    
    // Check if code exists
    boolean existsByCode(String code);
}
