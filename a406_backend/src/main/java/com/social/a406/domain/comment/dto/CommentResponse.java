package com.social.a406.domain.comment.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentResponse {
    private Long commentId;
    private String content;
    private String personalId;
    private String profileImageUrl;
    private Long likeCount;
    private Long commentReplyCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isLiked;
}
