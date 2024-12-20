package be.pxl.microservices.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long postId;
    @Column(columnDefinition = "TEXT")
    private String comment;
    private String author;
    private int authorId;

    private LocalDateTime creationDate = LocalDateTime.now();
}
