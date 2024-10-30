// 쇼핑 페이지
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ShopTabBar from '../../components/ProductList/ShopTabBar';
import ProductItem from '../../components/ProductList/ProductItem';
import styles from '../ShopPage/ProductListPage.module.css';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import { useProductStore } from '../../stores/useProductStore';

const Wrapper = styled.section`
  padding: 24px;
`;

const PetstivalShopPage = () => {
  const [activeTab, setActiveTab] = useState('전체'); // 상위 컴포넌트에서 activeTab 상태 관리
  const { products, fetchProducts } = useProductStore();
  
  const fetchData = async () => {
  await fetchProducts(); // 비동기 함수 호출
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const filteredProducts = products.filter((product) => {
    if (activeTab === '전체') return true; // 모든 제품 반환
    if (activeTab === '사료/간식') {
      return product.category_id==1;
    }
    if (activeTab === '위생/배변') {
      return product.category_id==2;
    }
    if (activeTab === '의류') {
      return product.category_id==3;
    }
    if (activeTab === '장난감') {
      return product.category_id==4;
    }
    return false; // 다섯 개의 조건에 해당되지 않는 경우
  });

  return (
    <>
      <Header />
      <Wrapper>
        <ShopTabBar activeTab={activeTab} onTabChange={setActiveTab} /> {/* activeTab을 ShopTabBar로 전달 */}
        <div className={styles.itemWrapper}>
          {filteredProducts.map((product) => (
            <ProductItem key={product.product_id} id={product.product_id} title={product.product_name} price={product.price} imageSrc={product.image_url_1} />
          ))}
        </div>
      </Wrapper>
      <Navbar selectedMenu="Shop" />
    </>
  );
};

export default PetstivalShopPage;
