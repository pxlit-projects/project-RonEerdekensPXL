package be.pxl.microservices.repository;

import be.pxl.microservices.domain.Post;
import be.pxl.microservices.domain.PostState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByState(PostState state);
    List<Post> findByAuthorIdAndState(int authorId, PostState state);
    List<Post> findByAuthorIdAndStateNot( int authorId, PostState state);

}
