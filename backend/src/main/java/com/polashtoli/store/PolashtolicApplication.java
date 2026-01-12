package com.polashtoli;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PolashtolicApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(PolashtolicApplication.class, args);
        System.out.println("🚀 Polashtoli Backend API is running!");
        System.out.println("📍 http://localhost:8080/api");
    }
}
