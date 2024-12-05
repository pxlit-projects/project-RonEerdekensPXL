package be.pxl.microservices.services;

import be.pxl.microservices.api.dto.response.PostResponse;

import java.util.List;

public interface IReviewService {
    public List<PostResponse> getReviewPosts();

    void approvePost(Long id);
}
