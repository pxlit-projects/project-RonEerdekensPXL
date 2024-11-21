package be.pxl.microservices.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "remarks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Remark {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
}