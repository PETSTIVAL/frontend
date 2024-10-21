import LoginPage from '../pages/LoginPage';

// 페이지 URL 및 렌더링할 페이지 컴포넌트 정보를 저장하는 객체
export const Screens = {
  Login: {
    path: '/login', // url 경로 지정
    element: <LoginPage />, // 렌더링할 페이지 컴포넌트 지정
  },

  // 페이지를 추가 시 아래에 새로운 페이지 객체 작성
  // Survey: {
  //   path: '/survey',
  //   element: null,
  // },
};

export const RouteDef = {
  ...Screens,
};
