package com.boot.service;

import java.util.List;

import com.boot.dto.BoardCommentDTO;

public interface BoardCommentService {
    
    /** ✅ 댓글 작성 */
    Long write(BoardCommentDTO dto);
    
    /** ✅ 게시글별 댓글 목록 조회 */
    List<BoardCommentDTO> getCommentsByBoardNo(Long boardNo);
    
    /** ✅ 게시글별 원댓글 목록 조회 (페이징) */
    List<BoardCommentDTO> getParentCommentsByBoardNo(Long boardNo, int page, int size);
    
    /** ✅ 게시글별 전체 댓글 목록 조회 (페이징) */
    List<BoardCommentDTO> getAllCommentsByBoardNo(Long boardNo, int page, int size);
    
    /** ✅ 게시글별 원댓글 개수 */
    int getParentCommentCount(Long boardNo);
    
    /** ✅ 특정 원댓글의 모든 답글 조회 */
    List<BoardCommentDTO> getRepliesByParentNo(Long parentCommentNo);
    
    /** ✅ 댓글 단건 조회 */
    BoardCommentDTO find(Long commentNo);
    
    /** ✅ 댓글 수정 */
    void update(BoardCommentDTO dto);
    
    /** ✅ 댓글 삭제 */
    void delete(Long commentNo);
    
    /** ✅ 게시글별 댓글 개수 */
    int getCommentCount(Long boardNo);
    
    /** ✅ 댓글 작성자 확인 */
    String getUserIdByCommentNo(Long commentNo);
}