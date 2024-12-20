import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import supabase from '../../services/supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';
const QRCodeAuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {user} = useAuthStore();
    const params = new URLSearchParams(location.search); // 쿼리 문자열에서 파라미터 가져오기
    const fetstivalId = params.get("fetstivals_id"); // festival_id 추출
    
    useEffect(() => {
        if (!user) {
            console.log(user);
            navigate('/login'); // user가 없는 경우 login 페이지로 리디렉션
            return;
          }
          if (!user) return null;
        const getFestivalAuth = async () => {
            try {
                const { data, error } = await supabase
                    .from('user_festival')
                    .select('verified')
                    .eq('user_id', user.id)
                    .eq('fetstivals_id', fetstivalId); 
        
                if (error) {
                    // 오류가 발생한 경우
                    console.error("Error fetching data:", error.message);
                    return; // 오류가 발생하면 함수 종료
                }
        
                if (data.length > 0) {
                    // 조건에 맞는 데이터가 있는 경우
                    const isVerified = data[0].verified; // verified 값을 가져옴
        
                    if (!isVerified) {
                        // verified가 false인 경우 true로 업데이트
                        const { error: updateError } = await supabase
                            .from('user_festival')
                            .update({ verified: true })
                            .eq('user_id', user.id)
                            .eq('fetstivals_id', fetstivalId);
        
                        if (updateError) {
                            console.error("Error updating verification status:", updateError.message);
                        } else {
                            navigate('/qrcodeauthok');
                            console.log("Verification status updated to true.");
                        }
                    } else {
                        navigate('/qrcodeauthok');
                        console.log("Verification status is already true.");
                    }
                } else {
                    // 조건에 맞는 데이터가 없는 경우
                    
                    navigate(`/petstival/${fetstivalId}`);
                }
            } catch (error) {
                console.error("Unexpected error:", error);
            }
        };
        getFestivalAuth(); // 함수 호출
    }, [user])
   

    return (
        <div>QR 인증 확인중...</div>
    )
}
export default QRCodeAuthPage;