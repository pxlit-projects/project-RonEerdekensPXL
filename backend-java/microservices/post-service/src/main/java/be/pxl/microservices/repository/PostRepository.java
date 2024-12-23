package be.pxl.microservices.repository;

import be.pxl.microservices.domain.Post;
import be.pxl.microservices.domain.PostState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByState(PostState state);
    List<Post> findByAuthorIdAndState(int authorId, PostState state);
    List<Post> findByAuthorIdAndStateNot( int authorId, PostState state);

    @Query("SELECT p FROM Post p WHERE p.state = :state " +
            "AND (" +
            "LOWER(p.category) LIKE LOWER(CONCAT('%', :filter, '%')) " +
            "OR LOWER(p.content) LIKE LOWER(CONCAT('%', :filter, '%')) " +
            "OR LOWER(p.author) LIKE LOWER(CONCAT('%', :filter, '%'))" +
            ")")
    List<Post> findPublishedPostsWithFilter(
            @Param("state") PostState state,
            @Param("filter") String filter
    );

}
