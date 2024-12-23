package be.pxl.microservices.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(columnDefinition = "TEXT")
    private String title;
    @Column(columnDefinition = "TEXT")
    private String content;
    @Enumerated(EnumType.STRING)
    private PostState state = PostState.CONCEPT;
    private String author;
    private int authorId;
    @Enumerated(EnumType.STRING)
    private Category category = Category.ALGEMEEN;

    private String email;

    private LocalDateTime creationDate = LocalDateTime.now();
    private LocalDateTime publicationDate;

}
