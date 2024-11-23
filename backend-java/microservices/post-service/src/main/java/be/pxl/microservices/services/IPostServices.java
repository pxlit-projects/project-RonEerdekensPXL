package be.pxl.microservices.services;

import be.pxl.microservices.domain.Post;

import java.util.List;

public interface IPostServices {
    List<Post> getAllPosts();
    Post getPostById(Long id);
    Post createPost(Post post);
    Post updatePost(Long id, Post post);
    List<Post> getPostsInConcept();
    List<Post> getPublishedPosts();

}
