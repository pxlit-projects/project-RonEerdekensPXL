package be.pxl.microservices.services;

import be.pxl.microservices.api.dto.response.PostResponse;
import be.pxl.microservices.domain.Remark;

import java.util.List;

public interface IReviewService {
    public List<PostResponse> getReviewPosts();

    void approvePost(Long id);

    void rejectPost(Long postId, String username, int id, Remark remark);
}
