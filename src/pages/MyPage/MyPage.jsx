import React from 'react';
import styled from 'styled-components';
import Header from '../../components/Header/Header';
import MyProfile from '../../components/Mypage/MyProfile';
import MyOrder from '../../components/Mypage/MyOrder';
import MyAccount from '../../components/Mypage/MyAccount';
import Navbar from '../../components/Navbar/Navbar';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import styles from './MyPage.module.css';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100svh;
`;

const Wrapper = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 48px;
  padding: 24px;
`;

// TODO: 최근 구매 내역 1개만 불러오기
function MyPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!user) {
      navigate('/login'); // user가 없는 경우 login 페이지로 리디렉션
    }
  }, [user, navigate]); // user 또는 navigate가 변경될 때만 실행

  if (!user) return null; // user가 없을 때는 null을 반환하여 컴포넌트 렌더링을 막음
  return (
    <Container>
      <Header />
      <Wrapper>
        <MyProfile />
        <MyOrder />
        <MyAccount />
      </Wrapper>
      <Navbar selectedMenu="MyPage" />
    </Container>
  );
}

export default MyPage;
