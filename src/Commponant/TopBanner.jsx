import React, { useState } from "react";
import "./TopBanner.css"; 

const TopBanner = () => {
  const [showBanner, setShowBanner] = useState(true);

  if (!showBanner) return null; 

  return (
    <div className="top-banner">
      <p>
      هذا الموقع في التشغيل التجريبي ويرجي الرجوع للمعهد للتاكد من البيانات المطلوبة     
      </p>
      <button className="buttn" onClick={() => setShowBanner(false)}>إغلاق</button>
    </div>
  );
};

export default TopBanner;