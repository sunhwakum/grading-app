// src/components/FormView.jsx
import React, { useState } from "react";

export default function FormView({ onSubmit }) {
  const NUM_COMMON = 34;
  const NUM_QUESTIONS = 45;

  // 정답, 배점 상태
  const [weights, setWeights] = useState({});
  const [keyCommon, setKeyCommon] = useState({});
  const [keyEommae, setKeyEommae] = useState({});
  const [keyHwajak, setKeyHwajak] = useState({});

  // 학생 정보 입력 상태
  const [students, setStudents] = useState([
    { name: "", subject: "언매", answers: Array(NUM_QUESTIONS).fill("") },
  ]);

  // 입력값 변경 핸들러들 (간단 예시)

  // 정답/배점 입력 UI 예시 (공통)
  const renderKeyInput = (start, end, keyState, setKeyState) => {
    const inputs = [];
    for (let q = start; q <= end; q++) {
      inputs.push(
        <div key={q}>
          <label>문항 {q}</label>
          <input
            type="text"
            style={{ width: 30 }}
            value={keyState[q] || ""}
            onChange={(e) =>
              setKeyState((prev) => ({ ...prev, [q]: e.target.value }))
            }
            placeholder="정답"
          />
          {start === 1 && (
            <input
              type="number"
              style={{ width: 50 }}
              value={weights[q] || 1}
              onChange={(e) =>
                setWeights((prev) => ({
                  ...prev,
                  [q]: Number(e.target.value),
                }))
              }
              placeholder="배점"
            />
          )}
        </div>
      );
    }
    return inputs;
  };

  // 학생 답안 입력 UI
  const renderStudentInputs = () =>
    students.map((stu, idx) => (
      <div key={idx} style={{ border: "1px solid #ccc", margin: "10px 0" }}>
        <input
          type="text"
          placeholder="이름"
          value={stu.name}
          onChange={(e) => {
            const newStudents = [...students];
            newStudents[idx].name = e.target.value;
            setStudents(newStudents);
          }}
        />
        <select
          value={stu.subject}
          onChange={(e) => {
            const newStudents = [...students];
            newStudents[idx].subject = e.target.value;
            setStudents(newStudents);
          }}
        >
          <option value="언매">언매</option>
          <option value="화작">화작</option>
        </select>
        {stu.answers.map((ans, i) => (
          <input
            key={i}
            type="text"
            style={{ width: 20 }}
            value={ans}
            onChange={(e) => {
              const newStudents = [...students];
              newStudents[idx].answers[i] = e.target.value;
              setStudents(newStudents);
            }}
          />
        ))}
      </div>
    ));

  const handleSubmit = async () => {
    // 1) 정답과 배점 먼저 API 호출
    const res1 = await fetch("/set_key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        weights,
        key_common: keyCommon,
        key_eommae: keyEommae,
        key_hwajak: keyHwajak,
      }),
    });
    if (!res1.ok) {
      alert("정답 키 저장 실패");
      return;
    }
    // 2) 학생 답안 제출
    const res2 = await fetch("/submit_answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(students),
    });
    if (!res2.ok) {
      alert("학생 답안 제출 실패");
      return;
    }
    // 3) 채점 API 호출
    const res3 = await fetch("/grade");
    if (!res3.ok) {
      alert("채점 실패");
      return;
    }
    const resultData = await res3.json();

    if (onSubmit) onSubmit(resultData.results);
  };

  return (
    <div>
      <h2>정답 및 배점 입력 (공통 1~34)</h2>
      {renderKeyInput(1, NUM_COMMON, keyCommon, setKeyCommon)}

      <h2>정답 입력 (언매 35~45)</h2>
      {renderKeyInput(NUM_COMMON + 1, NUM_QUESTIONS, keyEommae, setKeyEommae)}

      <h2>정답 입력 (화작 35~45)</h2>
      {renderKeyInput(NUM_COMMON + 1, NUM_QUESTIONS, keyHwajak, setKeyHwajak)}

      <h2>학생 답안 입력</h2>
      {renderStudentInputs()}
      <button
        onClick={() =>
          setStudents([
            ...students,
            { name: "", subject: "언매", answers: Array(NUM_QUESTIONS).fill("") },
          ])
        }
      >
        학생 추가
      </button>

      <br />
      <button onClick={handleSubmit}>채점하기</button>
    </div>
  );
}
