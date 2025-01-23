
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditFilePagee = () => {
  const { stage } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (stage) {
      const fetchFileContent = async () => {
        try {
          const response = await fetch(
            `https://flask-two-gamma.vercel.app/get-file?stage=${stage}`
          );
          if (!response.ok) {
            throw new Error("حدث خطأ أثناء جلب محتوى الملف");
          }
          const data = await response.json();
          if (data && data.content) {
            setContent(data.content);
          }
        } catch (error) {
          setError("حدث خطأ أثناء جلب محتوى الملف: " + error.message);
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchFileContent();
    } else {
      setLoading(false);
    }
  }, [stage]);

  const handleSave = async () => {
    try {
      const response = await fetch("https://flask-two-gamma.vercel.app/save-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stage, content }),
      });
      if (!response.ok) {
        throw new Error("حدث خطأ أثناء حفظ الملف");
      }
      const data = await response.json();
      if (data.message === "تم حفظ الملف بنجاح") {
        alert("تم حفظ الملف بنجاح");
      }
    } catch (error) {
      setError("حدث خطأ أثناء حفظ الملف: " + error.message);
      console.error(error);
    }
  };

  if (loading) {
    return <div>جاري تحميل الملف...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (!stage) {
    // عرض قائمة الملفات إذا لم يتم تحديد ملف
    return (
      <div className="home-page">
        <h1>اختيار الملف للعمل عليه</h1>
        <ul className="course-list">
          <li><button onClick={() => navigate("/edit-file/BIS1")}>الفرقة الاولي نظم</button></li>
          <li><button onClick={() => navigate("/edit-file/BIS2")}>الفرقة الثانية نظم</button></li>
          <li><button onClick={() => navigate("/edit-file/BIS3")}>الفرقة الثالثة نظم</button></li>
          <li><button onClick={() => navigate("/edit-file/BIS4")}>الفرقة الرابعة نظم</button></li>
          <li><button onClick={() => navigate("/edit-file/Accounting1")}>الفرقة الاولي محاسبة</button></li>
          <li><button onClick={() => navigate("/edit-file/Accounting2")}>الفرقة الثانية محاسبة</button></li>
          <li><button onClick={() => navigate("/edit-file/Accounting3")}>الفرقة الثالثة محاسبة</button></li>
          <li><button onClick={() => navigate("/edit-file/Accounting4")}>الفرقة الرابعة محاسبة</button></li>
          <li><button onClick={() => navigate("/edit-file/marketing3")}>الفرقة الثالثة تسويق</button></li>
          <li><button onClick={() => navigate("/edit-file/marketing4")}>الفرقة الرابعة تسويق</button></li>
        </ul>
      </div>
    );
  }

  return (
    <div className="edit-file-page">
      <h1>تعديل ملف JSON - المرحلة {stage}</h1>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={20}
        cols={80}
      />
      <br />
      <button onClick={handleSave}>حفظ التغييرات</button>
    </div>
  );
};

export default EditFilePagee;
