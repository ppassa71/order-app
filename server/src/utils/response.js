/**
 * 성공 응답 헬퍼 함수
 */
export const successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data
  });
};

/**
 * 에러 응답 헬퍼 함수
 */
export const errorResponse = (res, error, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error: typeof error === 'string' ? error : error.message || '서버 내부 오류가 발생했습니다.'
  });
};
