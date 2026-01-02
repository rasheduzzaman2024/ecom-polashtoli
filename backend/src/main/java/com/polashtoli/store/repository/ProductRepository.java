package com.polashtoli.store.repository;

import com.polashtoli.store.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByCategory_IdAndActiveTrue(Long categoryId, Pageable pageable);

    Page<Product> findByBrand_IdAndActiveTrue(Long brandId, Pageable pageable);

    List<Product> findByFeaturedTrueAndActiveTrue();

    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> searchProducts(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "p.price BETWEEN :minPrice AND :maxPrice")
    Page<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice,
                                    @Param("maxPrice") BigDecimal maxPrice,
                                    Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true AND p.rating >= :minRating")
    Page<Product> findByMinimumRating(@Param("minRating") Double minRating, Pageable pageable);

    List<Product> findTop10ByOrderByCreatedAtDesc();

    @Query("SELECT p FROM Product p WHERE p.active = true ORDER BY p.rating DESC, p.reviewCount DESC")
    Page<Product> findTopRatedProducts(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.discount > 0 AND p.active = true ORDER BY p.discount DESC")
    Page<Product> findDiscountedProducts(Pageable pageable);
}
