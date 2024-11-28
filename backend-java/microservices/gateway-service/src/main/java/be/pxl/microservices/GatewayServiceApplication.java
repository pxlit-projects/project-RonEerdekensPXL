package be.pxl.microservices;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@EnableDiscoveryClient
@CrossOrigin(origins = "http://localhost:4200")
public class GatewayServiceApplication
{
    public static void main( String[] args )
    {
        SpringApplication.run(GatewayServiceApplication.class, args);
    }
}
