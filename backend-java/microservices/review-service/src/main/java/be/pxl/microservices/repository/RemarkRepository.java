package be.pxl.microservices.repository;

import be.pxl.microservices.domain.Remark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RemarkRepository extends JpaRepository<Remark, Long> {
    List<Remark> findAllByPostId(Long postId);
}
