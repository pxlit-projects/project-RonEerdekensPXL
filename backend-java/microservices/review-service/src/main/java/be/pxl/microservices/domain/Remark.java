package be.pxl.microservices.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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
    private Long postId;
    @Column(columnDefinition = "TEXT")
    private String content;
    private LocalDateTime creationDate = LocalDateTime.now();
    private String reviewer;
    private int reviewerId;
}
