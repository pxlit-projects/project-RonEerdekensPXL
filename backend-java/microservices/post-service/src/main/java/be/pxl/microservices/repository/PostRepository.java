package be.pxl.microservices.repository;

import be.pxl.microservices.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByConcept(boolean concept);

    List<Post> findByPublished(boolean published);
}
