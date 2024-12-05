package be.pxl.microservices.services;

import be.pxl.microservices.domain.Post;
import be.pxl.microservices.domain.PostState;
import be.pxl.microservices.exception.PostEditForbiddenException;
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


    public Post createPost(Post post, String username, int id) {
        post.setCreationDate(LocalDateTime.now());
        post.setAuthor(username);
        post.setAuthorId(id);
        return postRepository.save(post);
    }


    public Post updatePost(Long id, Post post) {
       Post postToUpdate = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post with id " + id + " not found"));
         postToUpdate.setTitle(post.getTitle());
         postToUpdate.setContent(post.getContent());
         postToUpdate.setState(post.getState());
         postToUpdate.setAuthor(post.getAuthor());
         postToUpdate.setAuthorId(post.getAuthorId());
         postToUpdate.setCreationDate(post.getCreationDate());
         postToUpdate.setPublicationDate(post.getPublicationDate());
         return postRepository.save(postToUpdate);
    }

    @Override
    public List<Post> getAllPublishedPosts() {
        return postRepository.findAllByState(PostState.PUBLISHED);
    }

    @Override
    public List<Post> getAllConceptsPostsByAuthorId(int authorId) {
        return postRepository.findByAuthorIdAndState(authorId, PostState.CONCEPT);
    }

    @Override
    public List<Post> getAllPostsByAuthorIdAndStateNotByConcept(int authorId) {
        return postRepository.findByAuthorIdAndStateNot(authorId, PostState.CONCEPT);
    }

    @Override
    public Post publishPost(Long id, int authorId) {
        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post with id " + id + " not found"));
        if(post.getAuthorId() != authorId) {
            throw new PostEditForbiddenException("Post with id " + id + " cannot be edited by user with id " + authorId);
        }
        if(post.getState() != PostState.APPROVED) {
            throw new PostEditForbiddenException("Post with id " + id + " cannot be published because it is not in approved state");
        }
        post.setState(PostState.PUBLISHED);
        post.setPublicationDate(LocalDateTime.now());
        return postRepository.save(post);
    }

    @Override
    public List<Post> getAllReviewPosts() {
        return postRepository.findByStateNotAndStateNotAndStateNot(PostState.PUBLISHED, PostState.CONCEPT, PostState.APPROVED);
    }


}
