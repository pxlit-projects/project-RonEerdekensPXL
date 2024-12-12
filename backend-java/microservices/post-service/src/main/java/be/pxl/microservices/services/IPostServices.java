package be.pxl.microservices.services;

import be.pxl.microservices.api.dto.response.PostRemarkResponse;
import be.pxl.microservices.domain.Post;

import java.util.Arrays;
import java.util.List;

public interface IPostServices {
    List<Post> getAllPosts();
    Post getPostById(Long id);
    Post createPost(Post post, String username, int id);
    Post updatePost(Long id, Post post);


    List<Post> getAllPublishedPosts();
    List<Post> getAllConceptsPostsByAuthorId(int authorId);
    List<Post> getAllPostsByAuthorIdAndStateNotByConcept(int authorId);

    Post publishPost(Long id, int authorId);

    List<Post> getAllReviewPosts();

    PostRemarkResponse getPostByIdAndRemarks(Long id);
}
