package com.boot.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.boot.dao.BoardCommentDAO;
import com.boot.dto.BoardCommentDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BoardCommentServiceImpl implements BoardCommentService {

    private final BoardCommentDAO commentDAO;

    @Override
    @Transactional
    public Long write(BoardCommentDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("댓글 데이터가 비었습니다.");
        }
        if (dto.getBoardNo() == null) {
            throw new IllegalArgumentException("게시글 번호(boardNo)는 필수입니다.");
        }
        if (dto.getUserId() == null || dto.getUserId().isBlank()) {
            throw new IllegalArgumentException("작성자(userId)는 필수입니다.");
        }
        if (dto.getCommentContent() == null || dto.getCommentContent().isBlank()) {
            throw new IllegalArgumentException("댓글 내용(commentContent)은 필수입니다.");
        }
        
        commentDAO.insert(dto);
        return dto.getCommentNo();
    }

    @Override
    public List<BoardCommentDTO> getCommentsByBoardNo(Long boardNo) {
        if (boardNo == null) {
            throw new IllegalArgumentException("게시글 번호(boardNo)는 필수입니다.");
        }
        return commentDAO.selectByBoardNo(boardNo);
    }

    @Override
    public List<BoardCommentDTO> getParentCommentsByBoardNo(Long boardNo, int page, int size) {
        if (boardNo == null) {
            throw new IllegalArgumentException("게시글 번호(boardNo)는 필수입니다.");
        }
        if (page < 1) page = 1;
        if (size < 1) size = 10;
        
        int offset = (page - 1) * size;
        return commentDAO.selectParentCommentsByBoardNo(boardNo, offset, size);
    }

    @Override
    public List<BoardCommentDTO> getAllCommentsByBoardNo(Long boardNo, int page, int size) {
        if (boardNo == null) {
            throw new IllegalArgumentException("게시글 번호(boardNo)는 필수입니다.");
        }
        if (page < 1) page = 1;
        if (size < 1) size = 10;
        
        int offset = (page - 1) * size;
        return commentDAO.selectAllCommentsByBoardNo(boardNo, offset, size);
    }

    @Override
    public int getParentCommentCount(Long boardNo) {
        if (boardNo == null) {
            return 0;
        }
        return commentDAO.countParentCommentsByBoardNo(boardNo);
    }

    @Override
    public List<BoardCommentDTO> getRepliesByParentNo(Long parentCommentNo) {
        if (parentCommentNo == null) {
            throw new IllegalArgumentException("부모 댓글 번호(parentCommentNo)는 필수입니다.");
        }
        return commentDAO.selectRepliesByParentNo(parentCommentNo);
    }

    @Override
    public BoardCommentDTO find(Long commentNo) {
        if (commentNo == null) {
            throw new IllegalArgumentException("댓글 번호(commentNo)는 필수입니다.");
        }
        return commentDAO.find(commentNo);
    }

    @Override
    @Transactional
    public void update(BoardCommentDTO dto) {
        if (dto == null || dto.getCommentNo() == null) {
            throw new IllegalArgumentException("댓글 번호(commentNo)는 필수입니다.");
        }
        if (dto.getCommentContent() == null || dto.getCommentContent().isBlank()) {
            throw new IllegalArgumentException("댓글 내용(commentContent)은 필수입니다.");
        }
        commentDAO.update(dto);
    }

    @Override
    @Transactional
    public void delete(Long commentNo) {
        if (commentNo == null) {
            throw new IllegalArgumentException("댓글 번호(commentNo)는 필수입니다.");
        }
        commentDAO.delete(commentNo);
    }

    @Override
    public int getCommentCount(Long boardNo) {
        if (boardNo == null) {
            return 0;
        }
        return commentDAO.countByBoardNo(boardNo);
    }

    @Override
    public String getUserIdByCommentNo(Long commentNo) {
        if (commentNo == null) {
            return null;
        }
        return commentDAO.getUserIdByCommentNo(commentNo);
    }
}
