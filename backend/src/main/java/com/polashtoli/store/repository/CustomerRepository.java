package com.polashtoli.repository;

import com.polashtoli.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    // Find by email
    Optional<Customer> findByEmail(String email);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    // Find by name (contains)
    List<Customer> findByNameContainingIgnoreCase(String name);
    
    // Find by city
    List<Customer> findByCity(String city);
    
    // Find by country
    List<Customer> findByCountry(String country);
}
