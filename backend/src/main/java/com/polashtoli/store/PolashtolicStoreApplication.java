package com.polashtoli.store;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class PolashtolicStoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(PolashtolicStoreApplication.class, args);
    }

}
