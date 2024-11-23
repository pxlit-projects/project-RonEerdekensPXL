package be.pxl.microservices.services;

import be.pxl.microservices.domain.Post;
import be.pxl.microservices.exception.PostNotFoundException;
import be.pxl.microservices.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostServices implements IPostServices {
    private final PostRepository postRepository;
    private static final Logger log = LoggerFactory.getLogger(PostServices.class);

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }


    public Post getPostById(Long id) {
        return postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post with id " + id + " not found"));
    }


    public Post createPost(Post post) {
        post.setCreationDate(LocalDateTime.now());
        post.setConcept(true);
        post.setPublished(false);
        return postRepository.save(post);
    }


    public Post updatePost(Long id, Post post) {
       Post postToUpdate = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post with id " + id + " not found"));
         postToUpdate.setTitle(post.getTitle());
         postToUpdate.setContent(post.getContent());
         postToUpdate.setPublished(post.isPublished());
         postToUpdate.setConcept(post.isConcept());
         postToUpdate.setCreationDate(post.getCreationDate());
         postToUpdate.setPublicationDate(post.getPublicationDate());
         return postRepository.save(postToUpdate);
    }


    public List<Post> getPostsInConcept() {
        return postRepository.findByConcept(true);
    }


    public List<Post> getPublishedPosts() {
        return postRepository.findByPublished(true);
    }
}
