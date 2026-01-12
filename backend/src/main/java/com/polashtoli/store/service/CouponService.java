package com.polashtoli.service;

import com.polashtoli.model.Coupon;
import com.polashtoli.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CouponService {
    
    private final CouponRepository couponRepository;
    
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }
    
    public Coupon getCouponById(Long id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found with ID: " + id));
    }
    
    public Coupon getCouponByCode(String code) {
        return couponRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Coupon not found with code: " + code));
    }
    
    public Coupon createCoupon(Coupon coupon) {
        if (couponRepository.existsByCode(coupon.getCode())) {
            throw new RuntimeException("Coupon with code " + coupon.getCode() + " already exists");
        }
        return couponRepository.save(coupon);
    }
    
    public Coupon updateCoupon(Long id, Coupon couponDetails) {
        Coupon existingCoupon = getCouponById(id);
        
        existingCoupon.setDiscountType(couponDetails.getDiscountType());
        existingCoupon.setDiscountValue(couponDetails.getDiscountValue());
        existingCoupon.setMinPurchase(couponDetails.getMinPurchase());
        existingCoupon.setMaxDiscount(couponDetails.getMaxDiscount());
        existingCoupon.setUsageLimit(couponDetails.getUsageLimit());
        existingCoupon.setStartDate(couponDetails.getStartDate());
        existingCoupon.setEndDate(couponDetails.getEndDate());
        existingCoupon.setStatus(couponDetails.getStatus());
        
        return couponRepository.save(existingCoupon);
    }
    
    public void deleteCoupon(Long id) {
        if (!couponRepository.existsById(id)) {
            throw new RuntimeException("Coupon not found with ID: " + id);
        }
        couponRepository.deleteById(id);
    }
    
    public List<Coupon> getActiveCoupons() {
        return couponRepository.findByStatusAndEndDateGreaterThanEqual("active", LocalDate.now());
    }
    
    public BigDecimal validateAndApplyCoupon(String code, BigDecimal orderAmount) {
        Coupon coupon = getCouponByCode(code);
        
        if (!coupon.isValid()) {
            throw new RuntimeException("Coupon is not valid");
        }
        
        BigDecimal discount = coupon.calculateDiscount(orderAmount);
        
        // Increment usage count
        coupon.setUsedCount(coupon.getUsedCount() + 1);
        couponRepository.save(coupon);
        
        return discount;
    }
    
    public Long getTotalCount() {
        return couponRepository.count();
    }
}
