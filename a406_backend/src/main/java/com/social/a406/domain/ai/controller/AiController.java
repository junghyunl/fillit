package com.social.a406.domain.ai.controller;

import com.social.a406.domain.ai.service.AIFacadeService;
import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.board.service.BoardService;
import com.social.a406.domain.comment.dto.CommentResponse;
import com.social.a406.domain.commentReply.dto.ReplyResponse;
import com.social.a406.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AIFacadeService aiFacadeService;
    private final UserService userService;
    private final BoardService boardService;

    /**
     * AI가 일반 게시글 생성
     */
    @GetMapping("/generate/board")
    public ResponseEntity<BoardResponse> generateBoard(@RequestParam String personalId,
                                                       @RequestParam(required = false, defaultValue = "false") boolean includeImage) {
        BoardResponse response = aiFacadeService.generateAndSaveBoard(personalId, includeImage);
        return ResponseEntity.status(201).body(response);
    }

    /**
     * AI가 특정 게시글에 댓글 생성
     */
    @GetMapping("/generate/comment")
    public ResponseEntity<CommentResponse> generateComment(
            @RequestParam Long boardId,
            @RequestParam String personalId
    ) {
        CommentResponse response = aiFacadeService.generateAndSaveComment(boardId, personalId);
        return ResponseEntity.status(201).body(response);
    }

    /**
     * 랜덤 게시글에 랜덤 AI 댓글 생성
     */
    @GetMapping("/generate/random/comment")
    public ResponseEntity<CommentResponse> generateRandomAiComment() {
        String randomPersonalId = userService.getRandomUserWithMainPrompt();
        Long randomBoardId = boardService.getRandomAvailableBoardIdExcludingUser(randomPersonalId);

        if (randomBoardId == null) {
            return ResponseEntity.status(404).build();
        }

        CommentResponse response = aiFacadeService.generateAndSaveComment(randomBoardId, randomPersonalId);
        return ResponseEntity.status(201).body(response);
    }

    /**
     * AI가 랜덤 게시글 생성 (일반, 서브레딧, 유튜브 기반)
     */
    @GetMapping("/generate/random/board")
    public ResponseEntity<BoardResponse> generateRandomBoard(
            @RequestParam(required = false, defaultValue = "false") boolean includeImage) {
        return ResponseEntity.status(201).body(aiFacadeService.generateAndSaveRandomBoard(includeImage));
    }

    /**
     *  AI가 랜덤하게 좋아요 생성
     */
    @GetMapping("/generate/random/like")
    public ResponseEntity generateRandomLike() {
        String randomPersonalId = userService.getRandomUserWithMainPrompt();
        Long randomBoardId = boardService.getRandomAvailableBoardIdExcludingUser(randomPersonalId);

        if (randomBoardId == null) {
            return ResponseEntity.status(404).build();
        }

        aiFacadeService.generateAndSaveLike(randomBoardId, randomPersonalId);
        return ResponseEntity.status(201).build();
    }

    /**
     * AI가 특정 게시글에 좋아요 생성
     */
    @GetMapping("/generate/like")
    public ResponseEntity generateLike(
            @RequestParam Long boardId,
            @RequestParam String personalId
    ) {
        aiFacadeService.generateAndSaveLike(boardId, personalId);
        return ResponseEntity.status(201).build();
    }

    // AI 대댓글 생성
    @GetMapping("/generate/reply")
    public ResponseEntity<ReplyResponse> generateCommentReply(
            @RequestParam Long originId,
            @RequestParam Long commentId,
            @RequestParam String personalId,
            @RequestParam Boolean isBoard
    ){
        ReplyResponse replyResponse = aiFacadeService.generateAndSaveCommentReply(originId, commentId, personalId, isBoard);
        return ResponseEntity.status(201).body(replyResponse);
    }

    //AI 팔로우
    @GetMapping("/generate/follow")
    public ResponseEntity<String> generateFollow(
            @RequestParam String aiPersonalId,
            @RequestParam String followeePersonalId
    ){
        aiFacadeService.generateAndSaveFollow(aiPersonalId, followeePersonalId);
        return ResponseEntity.status(201).body(aiPersonalId + " follow " + followeePersonalId);
    }
}
