
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import "../EditPage.css";

const EditPage = () => {
  const { stage } = useParams();
  const [rollNumber, setRollNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [name, setName] = useState("");
  const [GPA, setGPA] = useState("");
  const [type, setType] = useState("");
  const [pay, setPay] = useState("");
  const [states, setstates] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState("");
  const fetchStudentData = async () => {
    if (!rollNumber || !stage) return;

    try {
      const response = await fetch(`https://flask-two-gamma.vercel.app/get-result?stage=${stage}&rollNumber=${rollNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "فشل تحميل البيانات");

      if (data.student) {
        const foundStudent = data.student;
        setStudent(foundStudent);
        setName(foundStudent.name);
        setGPA(foundStudent.GPA);
        setType(foundStudent.type);
        setPay(foundStudent.pay);
        setstates(foundStudent.states);
        setSubjects(
          Object.keys(foundStudent)
            .filter(
              (key) =>
                !["name", "GPA", "rollNumber", "stage", "type", "pay" , "states"].includes(key)
            )
            .map((subject) => ({
              name: subject,
              grade: foundStudent[subject],
            }))
        );
        setMessage("");
      } else {
        setStudent(null);
        setMessage("لم يتم العثور على الطالب");
      }
    } catch (error) {
      setMessage(error.message || "حدث خطأ في تحميل البيانات.");
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name === "pay") {
      setPay(value);
    } else if (name === "GPA") {
      if (value < 0 || value > 4.0) {
        setMessage("يجب أن يكون المعدل التراكمي (GPA) بين 0 و 4.0");
      } else {
        setGPA(value);
        setMessage("");
      }
    } else if (index !== undefined) {
      const updatedSubjects = [...subjects];
      updatedSubjects[index].grade = value;
      setSubjects(updatedSubjects);
    }
  };

  const handleSave = async () => {
    if (!name || !GPA || !type || !pay || !states || subjects.some((subject) => !subject.grade)) {
      setMessage("من فضلك تأكد من تعبئة جميع الحقول");
      return;
    }

    const updatedStudent = {
      ...student,
      name,
      GPA,
      type,
      pay,
      states,
      ...subjects.reduce((acc, subject) => {
        acc[subject.name] = subject.grade;
        return acc;
      }, {}),
    };

    try {
      const response = await fetch("https://flask-two-gamma.vercel.app/update-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stage,
          rollNumber,
          updatedStudent,
        }),
      });

      const data = await response.json();
      setMessage(response.ok ? data.message : "حدث خطأ أثناء حفظ البيانات.");
    } catch {
      setMessage("حدث خطأ أثناء الاتصال بالخادم.");
    }
  };

  return (
    <div className="edit-page" dir="rtl">
      <h1>تعديل بيانات الطالب</h1>

      <div className="edit-form">
        <label>
          أدخل رقم الجلوس:
          <input
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            placeholder="أدخل رقم الجلوس"
          />
        </label>
        <button onClick={fetchStudentData}>بحث عن الطالب</button>
      </div>

      {student && (
        <div className="student-details">
          <h2>بيانات الطالب</h2>
          <div className="form-group">
            <label>اسم الطالب:</label>
            <input type="text" value={name} disabled />
          </div>
          <div className="form-group">
            <label>المعدل التراكمي (GPA):</label>
       
            <input type="text" name="GPA" onChange={handleChange} value={parseFloat(student.GPA).toFixed(2)}  />
          </div>
          <div className="form-group">
            <label>الشعبة:</label>
            <input type="text" value={type} disabled />
          </div>
          <div className="form-group">
            <label>الحالة:</label>
            <input type="text" value={states} disabled />
          </div>
          <div className="form-group">
            <label>حالة الدفع:</label>
            <select value={pay} onChange={(e) => handleChange(e)} name="pay">
              <option value="yes">نعم</option>
              <option value="no">لا</option>
            </select>
          </div>
          <div className="form-group">
            <h3>الدرجات</h3>
            <table>
              <thead>
                <tr>
                  <th>اسم المادة</th>
                  <th>الدرجة</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, index) => (
                  <tr key={index}>
                    <td>{subject.name}</td>
                    <td>
                      <input
                        type="text"
                        value={subject.grade}
                        onChange={(e) => handleChange(e, index)}
                        placeholder="أدخل تقدير المادة"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={handleSave}>حفظ التعديلات</button>
        </div>
      )}

      {message && (
        <div className={`message ${message.includes("خطأ") ? "error" : "success"}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default EditPage;