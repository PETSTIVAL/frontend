import { useEffect, useState } from 'react';
import styled from 'styled-components';
import OrderList from '../../../components/Mypage/OrderPage/OrderList';
import Navbar from '../../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import DetailBar from '../../../stories/DetailBar';
import supabase from '../../../services/supabaseClient';
import { useAuthStore } from '../../../stores/useAuthStore';

const Wrapper = styled.section`
  margin-left: 24px;
  margin-right: 24px;
`;

const OrderCard = styled.div`
  position: relative;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 0px 8px 0px rgba(51, 51, 51, 0.08);
  margin-bottom: 20px;
`;

const ReorderButton = styled.button`
  position: absolute;
  bottom: 26px;
  right: 16px;
  padding: 8px 16px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

function OrderPage() {
  const navigate = useNavigate();
  const [successProduct, setSuccessProduct] = useState(null);
  const user = useAuthStore((state) => state.user);

  const getSuccessData = async () => {
    try {
      const { data, error } = await supabase
        .from('payment')
        .select(`
          order_id,
          order (
            order_id,
            total_price,
            total_count,
            delivery_addr,
            delivery_name,
            created_at,
            user_id,
            delivery_tel,
            delivery_addr_detail,
            product_name,
            img_url_1,
            order_status,
            order_detail (product_id)
          )
        `)
        .eq('payment_state', 'success');

      console.log("Fetched Data:", data);
      if (error) throw error;

      const filteredData = data?.filter((item) => item.order.user_id === user.id);

      if (filteredData) {
        setSuccessProduct(filteredData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getSuccessData();
  }, []);

  if (!successProduct) {
    return <p>Loading product data...</p>;
  }

  const groupItemsByDate = (items) => {
    return items.reduce((acc, item) => {
      const date = new Date(item.order.created_at)
        .toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/\.$/, '');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});
  };

  let groupedItems = {};
  if (successProduct[successProduct.length - 1]?.order !== null && successProduct.length > 0) {
    groupedItems = groupItemsByDate(successProduct);
  }

  const handleReorder = (item) => {
    const productId = item.order.order_detail[0].product_id;
    navigate(`/products/${productId}/order`, {
      state: {
        delivery_name: item.order.delivery_name || "",
        delivery_tel: item.order.delivery_tel || "",
        delivery_addr: item.order.delivery_addr || "",
        delivery_addr_detail: item.order.delivery_addr_detail || "",
        total_count: item.order.total_count || 1,
        total_price: item.order.total_price || 0,
        product_price: item.order.total_price / item.order.total_count || 0,
      },
    });
  };

  return (
    <>
      <DetailBar title="주문 내역" />
      <Wrapper>
        {Object.keys(groupedItems).map((date) => (
          <div key={date}>
            <h3>{date}</h3>
            {groupedItems[date].map((item, index) => (
              <OrderCard key={index}>
                <OrderList item={item} />
                {item.order.order_status === 'cancel' && (
                  <ReorderButton onClick={() => handleReorder(item)}>
                    재주문하기
                  </ReorderButton>
                )}
              </OrderCard>
            ))}
          </div>
        ))}
      </Wrapper>
      <Navbar selectedMenu="MyPage" />
    </>
  );
}

export default OrderPage;