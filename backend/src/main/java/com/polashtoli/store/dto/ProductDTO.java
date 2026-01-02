package com.polashtoli.store.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer stockQuantity;
    private String sku;
    private Set<String> images;
    private String category;
    private Long categoryId;
    private String brand;
    private Long brandId;
    private Double rating;
    private Integer reviewCount;
    private Boolean featured;
    private Boolean active;
    private Integer discount;
    private Set<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
